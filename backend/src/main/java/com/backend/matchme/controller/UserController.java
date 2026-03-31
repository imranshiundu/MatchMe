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

import java.nio.file.AccessDeniedException;
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


    @PutMapping("/change-email")
    public void changeEmail(@RequestBody ChangeEmailDTO changeEmail) throws AccessDeniedException {
        userService.changeEmail(changeEmail);
    }

    @PutMapping("/change-password")
    public void changePassword( @RequestBody ChangePasswordDTO changePw) throws AccessDeniedException {
        userService.changePassword(changePw);
    }

    @DeleteMapping("/delete")
    public void deleteUser() throws AccessDeniedException {
        userService.deleteUser();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/register")
    public UserResponseDTO createUser(@RequestBody @Valid registerRequestDTO registerRequestDTO) {
        return userService.createNewUser(registerRequestDTO);
    }
}
