package com.backend.matchme.controller;

import com.backend.matchme.dto.user.LoginRequestDTO;
import com.backend.matchme.dto.user.LoginResponseDTO;
import com.backend.matchme.service.AuthService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    @PostMapping("/login")
    public LoginResponseDTO login(@RequestBody LoginRequestDTO loginRequestDTO) {
        return authService.login(loginRequestDTO.email(), loginRequestDTO.password());
    }
}
