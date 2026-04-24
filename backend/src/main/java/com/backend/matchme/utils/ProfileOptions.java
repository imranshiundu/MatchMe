package com.backend.matchme.utils;

import java.util.List;

public final class ProfileOptions {
    private ProfileOptions() {
    }

    public static final String LOOKING_FOR_ANY = "Any";

    // Fixed selectable values for frontend multi-select fields.
    public static final List<String> INTEREST_OPTIONS = List.of(
            "Reading",
            "Traveling",
            "Gaming",
            "Music",
            "Sports"
    );

    public static final List<String> LOOKING_FOR_OPTIONS = List.of(
            "backend",
            "frontend",
            "fullstack",
            LOOKING_FOR_ANY,
            "Friendship"
    );
}

