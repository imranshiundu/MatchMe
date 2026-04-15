package com.backend.matchme.controller;

import com.backend.matchme.dto.endpoints.UserProfileBioDTO;
import com.backend.matchme.dto.endpoints.UserProfileInterestDTO;
import com.backend.matchme.dto.endpoints.UserSummaryDTO;
import com.backend.matchme.dto.user.ChangeEmailDTO;
import com.backend.matchme.dto.user.ChangePasswordDTO;
import com.backend.matchme.dto.user.RegisterResponseDTO;
import com.backend.matchme.dto.user.registerRequestDTO;
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

    public UserController(UserService userService, ProfileService profileService) {
        this.userService = userService;
        this.profileService = profileService;
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
    public UserProfileInterestDTO getProfileInterest(@PathVariable Long id) throws com.backend.matchme.exception.AccessDeniedException {
        return profileService.getProfileInterest(id);
    }
    @GetMapping("/users/{id}/bio")
    public UserProfileBioDTO getProfileBio(@PathVariable Long id) throws AccessDeniedException {
        return profileService.getProfileBio(id);
    }

    @PutMapping("/change-email")
    public void changeEmail(@RequestBody ChangeEmailDTO changeEmail) throws AccessDeniedException {
        userService.changeEmail(changeEmail);
    }

    @PutMapping("/change-password")
    public void changePassword(@RequestBody ChangePasswordDTO changePw) throws AccessDeniedException {
        userService.changePassword(changePw);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/delete")
    public void deleteUser() throws AccessDeniedException {
        userService.deleteUser();
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/register")
    public RegisterResponseDTO createUser(@RequestBody @Valid registerRequestDTO registerRequestDTO) {
        return userService.createNewUser(registerRequestDTO);
    }
}
