package com.matchme.service;

import com.matchme.dto.ProfileResponseDTO;
import com.matchme.entity.Profile;
import com.matchme.repository.ProfileRepository;
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
}
