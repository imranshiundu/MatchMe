package com.backend.matchme.controller;

import com.backend.matchme.dto.ChangeEmailDTO;
import com.backend.matchme.dto.ChangePasswordDTO;
import com.backend.matchme.dto.registerRequestDTO;
import com.backend.matchme.dto.UserResponseDTO;
import com.backend.matchme.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping(value = "/users", produces = MediaType.APPLICATION_JSON_VALUE)
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


    @PutMapping("/change-email/{id}")
    public void changeEmail(@PathVariable Long id, @RequestBody ChangeEmailDTO changeEmail) {
        userService.changeEmail(id, changeEmail);
    }

    @PutMapping("/change-password/{id}")
    public void changePassword(@PathVariable Long id, @RequestBody ChangePasswordDTO changePw) {
        userService.changePassword(id, changePw);
    }

    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/register")
    public UserResponseDTO createUser(@RequestBody @Valid registerRequestDTO registerRequestDTO) {
        return userService.createNewUser(registerRequestDTO);
    }
}
