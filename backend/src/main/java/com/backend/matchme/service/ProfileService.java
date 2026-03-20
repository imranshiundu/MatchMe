package com.backend.matchme.service;

import com.backend.matchme.dto.ProfileResponseDTO;
import com.backend.matchme.entity.Profile;
import com.backend.matchme.exception.ResourceNotFoundException;
import com.backend.matchme.repository.ProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    public List<ProfileResponseDTO> findAll() {
        System.out.println(profileRepository.findAll());
        return profileRepository.findAll().stream().map(profile -> new ProfileResponseDTO(profile.getId(), profile.getFirstName(), profile.getLastName(), profile.getInterest())).toList();

    }

    public ProfileResponseDTO findById(Long id) {
        Profile profile = profileRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Can't find profile with id " + id));
        return new ProfileResponseDTO(profile.getId(), profile.getFirstName(), profile.getLastName(), profile.getInterest());
    }
}
