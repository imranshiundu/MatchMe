package com.backend.matchme.controller;

import com.backend.matchme.dto.endpoints.UserProfileBioDTO;
import com.backend.matchme.dto.endpoints.UserProfileInterestDTO;
import com.backend.matchme.dto.endpoints.UserSummaryDTO;
import com.backend.matchme.dto.user.*;
import com.backend.matchme.exception.NoPermissionsException;
import com.backend.matchme.service.AuthService;
import com.backend.matchme.service.ProfileService;
import com.backend.matchme.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
public class UserController {
    private final UserService userService;
    private final ProfileService profileService;
    private final AuthService authService;

    public UserController(UserService userService, ProfileService profileService, AuthService authService) {
        this.userService = userService;
        this.profileService = profileService;
        this.authService = authService;
    }


    @GetMapping("/users")
    public List<RegisterResponseDTO> getAllUsers() {
        return userService.findAll();
    }


    @GetMapping("/users/{id}")
    public UserSummaryDTO getUsersById(@PathVariable Long id) {
        return profileService.findById(id);
    }


    @GetMapping("/users/{id}/profile")
    public UserProfileInterestDTO getProfileById(@PathVariable Long id) throws NoPermissionsException {
        return profileService.getProfileInterest(id);
    }

    @GetMapping("/users/{id}/bio")
    public UserProfileBioDTO getProfileBio(@PathVariable Long id) throws NoPermissionsException {
        return profileService.getProfileBio(id);
    }

    @PutMapping("/change-email")
    public void changeEmail(@RequestBody ChangeEmailDTO changeEmail) throws NoPermissionsException {
        userService.changeEmail(changeEmail);
    }

    @PutMapping("/change-password")
    public void changePassword(@RequestBody ChangePasswordDTO changePw) throws NoPermissionsException {
        userService.changePassword(changePw);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/delete")
    public void deleteUser() throws NoPermissionsException {
        userService.deleteUser();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/register")
    public LoginResponseDTO createUser(@RequestBody @Valid registerRequestDTO registerRequestDTO) {
        return authService.createNewUser(registerRequestDTO);
    }
}
