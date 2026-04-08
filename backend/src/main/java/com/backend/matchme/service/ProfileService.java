package com.backend.matchme.service;

import com.backend.matchme.dto.ProfilePostDTO;
import com.backend.matchme.dto.ProfileResponseDTO;
import com.backend.matchme.entity.Profile;
import com.backend.matchme.entity.User;
import com.backend.matchme.exception.ResourceNotFoundException;
import com.backend.matchme.repository.ProfileRepository;
import com.backend.matchme.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final UserService userService;


    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository, UserService userService) {
        this.profileRepository = profileRepository;
        this.userService = userService;
    }

    public ProfileResponseDTO getProfile() throws AccessDeniedException {
        User user = userService.findUserById();
        Profile profile = profileRepository.findById(user.getId()).orElseThrow(() -> new ResourceNotFoundException("Profile not found" + user.getId()));
        return new ProfileResponseDTO(profile.getId(), profile.getFirstName(), profile.getLastName(), profile.getInterest());
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
