package com.backend.matchme.dto;

public record ChangePasswordDTO(String newPassword, String newRepeatPassword, String oldPassword) {
}
