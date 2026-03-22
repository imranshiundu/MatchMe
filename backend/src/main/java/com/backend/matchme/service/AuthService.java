package com.backend.matchme.service;

import com.backend.matchme.dto.LoginResponseDTO;
import com.backend.matchme.entity.User;
import com.backend.matchme.exception.InvalidCredentialsException;
import com.backend.matchme.repository.UserRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static io.jsonwebtoken.SignatureAlgorithm.HS256;

@Service
public class AuthService {

    private final UserService userService;
    private final LoginService loginService;
    private final UserRepository userRepository;
    @Value("${jwt.secret}")
    private String jwtSecret;
    SecretKey secretKey = Keys.hmacShaKeyFor(jwtSecret.getBytes());
    @Value("${jwt.expiration}")
    private Long jwtExpirationMs;

    public AuthService(UserService userService, LoginService loginService, UserRepository userRepository) {
        this.userService = userService;
        this.loginService = loginService;
        this.userRepository = userRepository;
    }

    public LoginResponseDTO login(String email, String password) {
        if (loginService.authenticate(email, password)) {
            User user = userRepository.findByEmail(email).orElseThrow(() -> new InvalidCredentialsException("User not found"));
            Map<String, Object> claims = new HashMap<>();
            claims.put("userId", user.getId());
            claims.put("email", user.getEmail());
            Date now = new Date();
            Date expiryDate = new Date(now.getTime() + jwtExpirationMs);
            String token = Jwts.builder()
                    .setClaims(claims).setIssuedAt(now).setExpiration(expiryDate).signWith(secretKey, HS256).compact();
            return new LoginResponseDTO(token, user.getEmail(), user.getId());
        }

        return null;
    }

}
