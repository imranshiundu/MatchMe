package com.backend.matchme.service;

import com.backend.matchme.dto.LoginResponseDTO;
import com.backend.matchme.entity.User;
import com.backend.matchme.exception.InvalidCredentialsException;
import com.backend.matchme.repository.UserRepository;
import io.jsonwebtoken.Jwts;

import io.jsonwebtoken.security.Keys;
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

    //TODO: Could extract JWT creation into a private helper method in AuthService, keeping login() cleaner. private String generateJwt(User user) { ... }
    public LoginResponseDTO login(String email, String password) {
        if (!authenticate(email, password)) {
            throw new InvalidCredentialsException("Invalid email or password");
        }
        User user = userRepository.findByEmail(email).orElseThrow(() -> new InvalidCredentialsException("User not found")); // we need user entity to set claims and later send DTO.
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", user.getId());//claim is a sealed data inside token

        Date now = new Date(); //we calculate expiration.
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);
        SecretKey secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes()); //create secretKey
        String token = Jwts.builder() //this builds JWT token to send with DTO.
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(secretKey, HS256)
                .compact();

        return new LoginResponseDTO(token, user.getEmail(), user.getId());
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


