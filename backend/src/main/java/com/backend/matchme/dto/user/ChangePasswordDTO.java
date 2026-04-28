package com.backend.matchme.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ChangePasswordDTO(@NotNull @NotBlank String newPassword, @NotNull @NotBlank String newRepeatPassword, @NotNull @NotBlank String oldPassword) {
}
