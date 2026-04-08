package com.backend.matchme.service;

import com.backend.matchme.dto.EditProfileDTO;
import com.backend.matchme.dto.ProfilePostDTO;
import com.backend.matchme.dto.ProfileResponseDTO;
import com.backend.matchme.entity.Profile;
import com.backend.matchme.entity.User;
import com.backend.matchme.exception.ResourceNotFoundException;
import com.backend.matchme.repository.ProfileRepository;
import com.backend.matchme.repository.UserRepository;
import com.backend.matchme.utils.GetAuthPrinciple;
import com.backend.matchme.utils.ProfileMapper;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;

@Service
public class ProfileService {
    private final ProfileRepository profileRepository;
    private final GetAuthPrinciple getAuthPrinciple;


    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository, UserService userService, GetAuthPrinciple getAuthPrinciple) {
        this.profileRepository = profileRepository;
        this.getAuthPrinciple = getAuthPrinciple;
    }

    public ProfileResponseDTO getProfile() throws AccessDeniedException {
        User user = getAuthPrinciple.getAuthenticatedUser();
        Profile profile = profileRepository.findById(user.getId()).orElseThrow(() -> new ResourceNotFoundException("Profile not found" + user.getId()));
        return ProfileMapper.toProfileResponseDTO(profile);
    }

    public ProfileResponseDTO getProfileWithId(Long id) throws AccessDeniedException {
        User user = getAuthPrinciple.getAuthenticatedUser();
        if (!user.getId().equals(id)) {
            throw new AccessDeniedException("access denied, not authorized to view profile with ID: " + id);
        }
        Profile profile = profileRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Profile not found" + id));
        return ProfileMapper.toProfileResponseDTO(profile);
    }

    public List<ProfileResponseDTO> findAll() {
        System.out.println(profileRepository.findAll());
        return profileRepository.findAll().stream().map(ProfileMapper::toProfileResponseDTO).toList();

    }

    public ProfileResponseDTO findById(Long id) {
        Profile profile = profileRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Can't find profile with id " + id));
        return ProfileMapper.toProfileResponseDTO(profile);
    }

    public ProfileResponseDTO editProfile(EditProfileDTO newProfileData) throws AccessDeniedException {
        User user = getAuthPrinciple.getAuthenticatedUser();
        Profile profile = profileRepository.findById(user.getId()).orElseThrow(() -> new ResourceNotFoundException("Profile not found" + user.getId()));
        profile.setNickname(newProfileData.nickname());
        profile.setInterest(newProfileData.interest());
        profile.setAge(newProfileData.age());
        profile.setGender(newProfileData.gender());
        profile.setBio(newProfileData.bio());
        profile.setLookingFor(newProfileData.lookingFor());

        profileRepository.save(profile);

        return ProfileMapper.toProfileResponseDTO(profileRepository.save(profile));
    }


}
