package com.backend.matchme.utils;

import java.util.List;

public final class ProfileOptions {
    private ProfileOptions() {
    }

    public static final String LOOKING_FOR_ANY = "Any";

    // Fixed selectable values for frontend multi-select fields.
    public static final List<String> INTEREST_OPTIONS = List.of(
            "Full-Stack",
            "Front-End",
            "Back-End",
            "Cyber-Security",
            "Vibe Coding",
            "Open Source",
            "Linux"
    );

    public static final List<String> LOOKING_FOR_OPTIONS = List.of(
            "Co-Founder",
            "Pair-Programmer",
            "Reviewer",
            "Teammate"
    );
}

