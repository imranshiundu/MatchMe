package com.backend.matchme.controller;

import com.backend.matchme.dto.profile.EditProfileDTO;
import com.backend.matchme.dto.profile.ProfileImageUploadResponseDTO;
import com.backend.matchme.dto.profile.ProfileResponseDTO;
import com.backend.matchme.exception.UploadFailedException;
import com.backend.matchme.repository.ProfileRepository;
import com.backend.matchme.service.ProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
public class ProfileController {
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService, ProfileRepository profileRepository) {
        this.profileService = profileService;

    }

    @GetMapping({"/me", "/me/profile", "/me/bio"})
    public ProfileResponseDTO getProfile() throws AccessDeniedException {
        return profileService.getProfile();
    }

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

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/profile/remove-image")
    public void removeImage() throws IOException {
        profileService.removeImage();
    }

    @PostMapping("/profile/{id}/dismiss")
    public void dismiss(@PathVariable Long id) {
        profileService.dismiss(id);
    }

    @GetMapping("/profiles/search")
    public List<ProfileResponseDTO> searchProfiles(@RequestParam String q) {
        return profileService.searchProfiles(q);
    }
}
