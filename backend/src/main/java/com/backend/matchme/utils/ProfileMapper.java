package com.backend.matchme.utils;

import com.backend.matchme.dto.profile.ProfileResponseDTO;
import com.backend.matchme.entity.Profile;

public class ProfileMapper {
    public static ProfileResponseDTO toProfileResponseDTO(Profile profile, boolean isOwner) {
        return new ProfileResponseDTO(
                profile.getId(),
                (profile.getUser() != null && isOwner) ? profile.getUser().getEmail() : null,
                profile.getNickname(),
                profile.getInterest(),
                profile.getBio(),
                profile.getAge(),
                profile.getGender(),
                profile.getLookingFor(),
                profile.getImageUrl(),
                profile.getPublicId(),
                profile.getUser() != null ? profile.getUser().getLocation() : null
        );
    }
}
