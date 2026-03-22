package com.backend.matchme.controller;

import com.backend.matchme.dto.ProfilePostDTO;
import com.backend.matchme.dto.ProfileResponseDTO;
import com.backend.matchme.repository.ProfileRepository;
import com.backend.matchme.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/profile/{id}")
    public ProfileResponseDTO getProfile(@PathVariable long id) {
        return profileService.findById(id);
    }


    @PostMapping("/profile")
    public ProfileResponseDTO createNewProfile(@Valid @RequestBody ProfilePostDTO profilePostDTO) {
        return profileService.createNewProfile(profilePostDTO);
    }
}
