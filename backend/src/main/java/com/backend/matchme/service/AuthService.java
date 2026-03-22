package com.backend.matchme.service;

import com.backend.matchme.dto.LoginResponseDTO;
import com.backend.matchme.entity.User;
import com.backend.matchme.exception.InvalidCredentialsException;
import com.backend.matchme.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    private final UserService userService;
    private final LoginService loginService;
    private final UserRepository userRepository;
    @Value("${jwt.secret}")
    private String jwtSecret;
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

        }

        return null;
    }

}
