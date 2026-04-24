package com.backend.matchme.utils;

import com.backend.matchme.entity.Profile;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ProfileValidator {
    public boolean isProfileComplete(Profile profile) {
        return profile.getAge() != null
                && hasText(profile.getGender())
                && hasText(profile.getNickname())
                && hasText(profile.getBio())
                && hasAnyValue(profile.getInterest())
                && hasAnyValue(profile.getLookingFor());
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private boolean hasAnyValue(List<String> values) {
        return values != null && values.stream().anyMatch(this::hasText);
    }
}
