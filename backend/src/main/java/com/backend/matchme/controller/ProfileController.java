package com.backend.matchme.controller;

import com.backend.matchme.dto.ProfilePostDTO;
import com.backend.matchme.dto.ProfileResponseDTO;
import com.backend.matchme.repository.ProfileRepository;
import com.backend.matchme.service.ProfileService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ProfileController {
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService, ProfileRepository profileRepository) {
        this.profileService = profileService;

    }

    @GetMapping("/profile")
    public List<ProfileResponseDTO> getProfile() {
        return profileService.findAll();
    }

    @PostMapping("/profile")
    public ProfilePostDTO createProfile(ProfilePostDTO profilePostDTO) {
        return profileService.createProfile(profilePostDTO);
    }
}
