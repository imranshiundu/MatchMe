package com.backend.matchme.controller;

import com.backend.matchme.dto.profile.EditProfileDTO;
import com.backend.matchme.dto.profile.ProfileImageUploadResponseDTO;
import com.backend.matchme.dto.profile.ProfileResponseDTO;
import com.backend.matchme.exception.UploadFailedException;
import com.backend.matchme.repository.ProfileRepository;
import com.backend.matchme.service.ProfileService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.AccessDeniedException;

@RestController
public class ProfileController {
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService, ProfileRepository profileRepository) {
        this.profileService = profileService;

    }

    // /me: which is a shortcut to /users/{id} for the authenticated user. You should also implement /me/profile and /me/bio.
    @GetMapping({"/me", "/me/profile", "/me/bio"}) //gets your own authorized profile
    public ProfileResponseDTO getProfile() throws AccessDeniedException {
        return profileService.getProfile();
    }

    //TODO: returns the user's name and link to the profile picture.
    //TODO: If the id is not found, or the user does not have permission to view that profile, it must return HTTP404.
    @GetMapping("/profile/{id}")
    public ProfileResponseDTO getProfile(@PathVariable long id) throws AccessDeniedException {
        return profileService.getProfileWithId(id);
    }

    @PatchMapping("/me/editProfile")
    public ProfileResponseDTO editProfile(@RequestBody EditProfileDTO editProfileDTO) throws AccessDeniedException {
        return profileService.editProfile(editProfileDTO);
    }

    @PostMapping("/profile/upload-image")
    public ProfileImageUploadResponseDTO uploadImage(@RequestParam("file") MultipartFile file) throws UploadFailedException, IOException {
        return profileService.uploadImage(file);
    }

}
