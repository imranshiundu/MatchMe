package com.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserPatchDTO(@NotBlank(message = "E-mail cannot be blank") @Email String email,
                           @NotBlank(message = "password cannot be blank") @Size(min = 3, message = "password must be at least 3 char") String password) {
}
