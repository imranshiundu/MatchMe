package com.backend.matchme.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ChangeEmailDTO(@NotNull @NotBlank String newEmail, @NotNull @NotBlank String currentPassword) {
}
