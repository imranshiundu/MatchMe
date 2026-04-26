package com.backend.matchme.dto.endpoints;

import jakarta.validation.constraints.NotNull;

public record UserProfileBioDTO(@NotNull Long id,
                                @NotNull String bio) {
}
