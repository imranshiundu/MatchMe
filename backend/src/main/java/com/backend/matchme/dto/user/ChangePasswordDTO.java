package com.backend.matchme.dto.user;

public record ChangePasswordDTO(String newPassword, String newRepeatPassword, String oldPassword) {
}
