package com.backend.matchme.controller;

import com.backend.matchme.dto.ProfileResponseDTO;
import com.backend.matchme.service.ProfileService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ProfileController {
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/profile/{id}")
    public List<ProfileResponseDTO> getProfile() {
        return profileService.findAll();
    }

}
