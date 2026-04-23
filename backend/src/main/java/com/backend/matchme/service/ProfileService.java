package com.backend.matchme.service;

import com.backend.matchme.dto.endpoints.UserProfileBioDTO;
import com.backend.matchme.dto.endpoints.UserProfileInterestDTO;
import com.backend.matchme.dto.endpoints.UserSummaryDTO;
import com.backend.matchme.dto.profile.EditProfileDTO;
import com.backend.matchme.dto.profile.ProfileImageUploadResponseDTO;
import com.backend.matchme.dto.profile.ProfileResponseDTO;
import com.backend.matchme.entity.Profile;
import com.backend.matchme.entity.User;
import com.backend.matchme.exception.ResourceNotFoundException;
import com.backend.matchme.exception.UploadFailedException;
import com.backend.matchme.repository.ConnectionRepository;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProfileService {
    private static final Logger log = LoggerFactory.getLogger(ProfileService.class);
    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png");

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final ConnectionRepository connectionRepository;
    private final GetAuthPrinciple getAuthPrinciple;
    private final Cloudinary cloudinary;
    private final MatchService matchService;

    public ProfileService(ProfileRepository profileRepository,
                          UserRepository userRepository,
                          ConnectionRepository connectionRepository,
                          GetAuthPrinciple getAuthPrinciple,
                          Cloudinary cloudinary,
                          MatchService matchService) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.connectionRepository = connectionRepository;
        this.getAuthPrinciple = getAuthPrinciple;
        this.cloudinary = cloudinary;
        this.matchService = matchService;
    }

    public ProfileResponseDTO getProfile() {
        User user = getAuthPrinciple.getAuthenticatedUser();
        Profile profile = getOrCreateProfile(user);
        return ProfileMapper.toProfileResponseDTO(profile, true);
    }

    public ProfileResponseDTO getProfileWithId(Long id) {
        User me = getAuthPrinciple.getAuthenticatedUser();
        Profile target = getAuthorizedProfileOrThrow(id);

        return ProfileMapper.toProfileResponseDTO(target, me.getId().equals(id));
    }

    private boolean isRecommended(Long myId, Long targetId) {
        return matchService.getRecommendations(myId).contains(targetId);
    }

    private boolean hasRelationship(User me, User target) {
        return connectionRepository.findByRequesterAndReceiver(me, target).isPresent()
                || connectionRepository.findByRequesterAndReceiver(target, me).isPresent();
    }

    public UserSummaryDTO findById(Long id) {
        Profile profile = getAuthorizedProfileOrThrow(id);
        return new UserSummaryDTO(profile.getId(), profile.getNickname(), profile.getImageUrl());
    }

    public ProfileResponseDTO editProfile(EditProfileDTO newProfileData) {
        User user = getAuthPrinciple.getAuthenticatedUser();
        Profile profile = getOrCreateProfile(user);

        profile.setNickname(newProfileData.nickname());
        profile.setInterest(newProfileData.interest());
        profile.setAge(newProfileData.age());
        profile.setGender(newProfileData.gender());
        profile.setBio(newProfileData.bio());
        profile.setLookingFor(newProfileData.lookingFor());
        if (newProfileData.location() != null) user.setLocation(newProfileData.location());

        userRepository.save(user);
        return ProfileMapper.toProfileResponseDTO(profileRepository.save(profile), true);
    }

    public void dismiss(Long targetId) {
        User user = getAuthPrinciple.getAuthenticatedUser();
        user.getDismissedUserIds().add(targetId);
        userRepository.save(user);
    }

    public ProfileImageUploadResponseDTO uploadImage(MultipartFile file) throws UploadFailedException, IOException {
        User user = getAuthPrinciple.getAuthenticatedUser();
        Profile profile = getOrCreateProfile(user);

        if (file.getContentType() == null || file.isEmpty() || !ALLOWED_TYPES.contains(file.getContentType())) {
            throw new UploadFailedException("Invalid image file");
        }

        HashMap<Object, Object> options = new HashMap<>();
        options.put("public_id", "profilePictureOfUserId_" + profile.getId());
        options.put("overwrite", true);
        Map uploadedFile = cloudinary.uploader().upload(file.getBytes(), options);

        profile.setImageUrl(uploadedFile.get("secure_url").toString());
        profile.setPublicId(uploadedFile.get("public_id").toString());
        profileRepository.save(profile);

        return new ProfileImageUploadResponseDTO(profile.getImageUrl());
    }

    public void removeImage() {
        User user = getAuthPrinciple.getAuthenticatedUser();
        Profile profile = getOrCreateProfile(user);
        profile.setImageUrl("https://res.cloudinary.com/ddvukican/image/upload/v1775725641/default-profile-image.jpg");
        profileRepository.save(profile);
    }

    public List<ProfileResponseDTO> searchProfiles(String q) {
        return profileRepository.findByNicknameContainingIgnoreCaseOrInterestContainingIgnoreCase(q, q)
                .stream()
                .map(p -> ProfileMapper.toProfileResponseDTO(p, false))
                .collect(Collectors.toList());
    }

    private Profile getOrCreateProfile(User user) {
        return profileRepository.findById(user.getId()).orElseGet(() -> {
            Profile p = new Profile();
            p.setUser(user);
            p.setNickname(user.getEmail().split("@")[0]);
            return profileRepository.save(p);
        });
    }

    public UserProfileInterestDTO getProfileInterest(Long id) {
        Profile profile = getAuthorizedProfileOrThrow(id);
        return new UserProfileInterestDTO(profile.getId(), profile.getInterest());
    }

    public UserProfileBioDTO getProfileBio(Long id) {
        Profile profile = getAuthorizedProfileOrThrow(id);
        return new UserProfileBioDTO(profile.getId(), profile.getBio());
    }

    private Profile getAuthorizedProfileOrThrow(Long targetId) {
        User me = getAuthPrinciple.getAuthenticatedUser();
        Profile target = profileRepository.findById(targetId).orElseThrow(() -> new ResourceNotFoundException("Profile not found"));

        boolean allowed = me.getId().equals(targetId)
                || isRecommended(me.getId(), targetId)
                || hasRelationship(me, target.getUser());

        if (!allowed) {
            log.warn("Unauthorized access attempt to profile {} by user {}", targetId, me.getId());
            throw new ResourceNotFoundException("Profile not found");
        }

        return target;
    }
}
