package com.matchme.service;

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

    public List<Profile> findAll(){
        return profileRepository.findAll();
    }
}
