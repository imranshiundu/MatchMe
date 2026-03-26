package com.backend.matchme.controller;

import com.backend.matchme.dto.registerRequestDTO;
import com.backend.matchme.dto.UserResponseDTO;
import com.backend.matchme.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public List<UserResponseDTO> getUsers() {
        return userService.findAll();
    }

    @GetMapping("/users/{id}")
    public UserResponseDTO getUser(@PathVariable long id) {
        return userService.getUser(id);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/register")
    public UserResponseDTO createUser(@RequestBody @Valid registerRequestDTO registerRequestDTO) {
        return userService.createNewUser(registerRequestDTO);
    }
}
