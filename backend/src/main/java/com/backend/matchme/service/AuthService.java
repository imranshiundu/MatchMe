package com.backend.matchme.service;

import com.backend.matchme.dto.user.LoginResponseDTO;
import com.backend.matchme.entity.User;
import com.backend.matchme.exception.InvalidCredentialsException;
import com.backend.matchme.repository.UserRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;

import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


import static io.jsonwebtoken.SignatureAlgorithm.HS256;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private Long jwtExpirationMs;

    public AuthService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    public LoginResponseDTO login(String email, String password) {
        if (!authenticate(email, password)) {
            throw new InvalidCredentialsException("Invalid email or password");
        }
        User user = userRepository.findByEmail(email).orElseThrow(() -> new InvalidCredentialsException("User not found"));

        String token = generateToken(user);

        return new LoginResponseDTO(token, user.getEmail(), user.getId());
    }

    public String generateToken(User user) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);
        SecretKey secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(secretKey, HS256)
                .compact();
    }

    public Long extractUserId(String token) {
        Claims claims = extractAllClaims(token);
        return claims == null ? null : claims.get("userId", Long.class);
    }

    private Claims extractAllClaims(String token) {
        try {
            SecretKey secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
            return Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (SignatureException | MalformedJwtException | ExpiredJwtException |
                 UnsupportedJwtException | IllegalArgumentException e) {
            return null;
        }
    }


    public boolean authenticate(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent()) {
            if (bCryptPasswordEncoder.matches(password, user.get().getPassword())) {
                System.out.println("Successfully logged in: " + email);
                return true;
            } else {
                throw new InvalidCredentialsException("Invalid password");
            }
        } else {
            throw new InvalidCredentialsException("Invalid email or password");
        }

    }

}

