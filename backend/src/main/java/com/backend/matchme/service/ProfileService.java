package com.backend.matchme.service;

import com.backend.matchme.dto.profile.EditProfileDTO;
import com.backend.matchme.dto.profile.ProfileImageUploadResponseDTO;
import com.backend.matchme.dto.profile.ProfileResponseDTO;
import com.backend.matchme.entity.Profile;
import com.backend.matchme.entity.User;
import com.backend.matchme.exception.ResourceNotFoundException;
import com.backend.matchme.exception.UploadFailedException;
import com.backend.matchme.repository.ProfileRepository;
import com.backend.matchme.repository.UserRepository;
import com.backend.matchme.utils.GetAuthPrinciple;
import com.backend.matchme.utils.ProfileMapper;
import com.cloudinary.Cloudinary;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
public class ProfileService {
    private static final Logger log = LoggerFactory.getLogger(ProfileService.class);
    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png");

    private final ProfileRepository profileRepository;
    private final GetAuthPrinciple getAuthPrinciple;
    private final Cloudinary cloudinary;


    public ProfileService(ProfileRepository profileRepository, UserRepository userRepository, UserService userService, GetAuthPrinciple getAuthPrinciple, Cloudinary cloudinary) {
        this.profileRepository = profileRepository;
        this.getAuthPrinciple = getAuthPrinciple;
        this.cloudinary = cloudinary;
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
        profile.setImageUrl(newProfileData.imageUrl());
        profile.setPublicId(newProfileData.publicId());

        profileRepository.save(profile);

        return ProfileMapper.toProfileResponseDTO(profileRepository.save(profile));
    }

    public ProfileImageUploadResponseDTO uploadImage(MultipartFile file) throws UploadFailedException, IOException {
        User user = getAuthPrinciple.getAuthenticatedUser();
        Profile profile = profileRepository.findById(user.getId()).orElseThrow(() -> new ResourceNotFoundException("Profile not found" + user.getId()));
        if (file.getContentType() == null || file.isEmpty()) {
            log.error("user_{} did not enter image", user.getId());
            throw new UploadFailedException("You must enter image");
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) { //get content type to check if it contains allowed type(Jpeg or PNG).
            throw new UploadFailedException("Only JPEG or PNG file types are allowed.");
        }
        long maxSize = 5 * 1024 * 1024; //max size 5MB
        if (file.getSize() > maxSize) { //getSize returns filesize in bytes which is in long file type.
            throw new UploadFailedException("File size must be lower than 5MB");
        }

        HashMap<Object, Object> options = new HashMap<>(); //we create a map to instruct cloudinary what we want to do with image or its properties.
        options.put("public_id", "profile_" + profile.getId()); //add key - value pairs to map.
        options.put("overwrite", true); //overwrite last image we stored.
        Map uploadedFile = cloudinary.uploader().upload(file.getBytes(), options);

        profile.setImageUrl((uploadedFile.get("secure_url").toString()));
        profile.setPublicId(uploadedFile.get("public_id").toString());
        profileRepository.save(profile);
        log.info("user_{} uploaded image with publicId: {}", user.getId(), uploadedFile.get("public_id"));
        return new ProfileImageUploadResponseDTO(uploadedFile.get("secure_url").toString());
    }


}
