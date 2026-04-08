package com.backend.matchme.utils;

import com.backend.matchme.dto.ProfileResponseDTO;
import com.backend.matchme.entity.Profile;

public class ProfileMapper {
    public static ProfileResponseDTO toProfileResponseDTO(Profile profile) {
        return new ProfileResponseDTO(
                profile.getId(),
                profile.getNickname(),
                profile.getInterest(),
                profile.getBio(),
                profile.getAge(),
                profile.getGender(),
                profile.getLookingFor()
        );
    }
}
