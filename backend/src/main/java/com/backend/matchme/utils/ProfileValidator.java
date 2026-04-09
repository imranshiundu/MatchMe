package com.backend.matchme.utils;

import com.backend.matchme.entity.Profile;
import org.springframework.stereotype.Component;

@Component
public class ProfileValidator {
    public boolean isProfileComplete(Profile profile) {
        return profile.getAge() != null &&
                !profile.getGender().isBlank() &&
                !profile.getInterest().isBlank() &&
                !profile.getLookingFor().isBlank() &&
                !profile.getNickname().isBlank() &&
                !profile.getBio().isBlank();
    }
}
