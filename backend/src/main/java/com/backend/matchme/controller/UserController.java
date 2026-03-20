package com.backend.matchme.controller;

import com.backend.matchme.dto.UserPatchDTO;
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
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/users")
    public UserResponseDTO createUser(@RequestBody @Valid UserPatchDTO userPatchDTO) {
        return userService.createNewUser(userPatchDTO);
    }
}
