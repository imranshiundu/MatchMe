package com.backend.matchme.dto;

import jakarta.validation.constraints.NotBlank;

public record ProfilePostDTO(@NotBlank(message = "First name cannot be blank") String firstName,
                             @NotBlank(message = "Last name cannot be blank") String lastName,
                             String interest
) {
}
