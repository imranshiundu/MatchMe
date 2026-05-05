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
                profile.getUser() != null ? profile.getUser().getLocation() : null,
                profile.getUser() != null ? profile.getUser().getLatitude() : null,
                profile.getUser() != null ? profile.getUser().getLongitude() : null,
                profile.getUser() != null && profile.getUser().getRadius() != null ? profile.getUser().getRadius() : 50.0,
                profile.getPrompt1(),
                profile.getAnswer1(),
                profile.getPrompt2(),
                profile.getAnswer2(),
                profile.getPrompt3(),
                profile.getAnswer3()
        );
    }
}
