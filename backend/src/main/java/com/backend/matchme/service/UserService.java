package com.backend.matchme.service;

import com.backend.matchme.dto.user.ChangeEmailDTO;
import com.backend.matchme.dto.user.ChangePasswordDTO;
import com.backend.matchme.dto.user.registerRequestDTO;
import com.backend.matchme.dto.user.RegisterResponseDTO;
import com.backend.matchme.entity.Profile;
import com.backend.matchme.entity.User;
import com.backend.matchme.exception.*;
import com.backend.matchme.repository.ProfileRepository;
import com.backend.matchme.repository.UserRepository;
import com.backend.matchme.utils.GetAuthPrinciple;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;

@Service
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final GetAuthPrinciple getAuthPrinciple;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder, ProfileRepository profileRepository, GetAuthPrinciple getAuthPrinciple) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.getAuthPrinciple = getAuthPrinciple;
    }

    public List<RegisterResponseDTO> findAll() {
        return userRepository.findAll().stream().map(user -> new RegisterResponseDTO(user.getId(), user.getEmail(), user.getLocation())).toList();
    }

    public void deleteUser() throws NoPermissionsException {
        User user = getAuthPrinciple.getAuthenticatedUser();
        userRepository.delete(user);
    }

    public void changePassword(ChangePasswordDTO passDTO) throws NoPermissionsException {
        User user = getAuthPrinciple.getAuthenticatedUser();
        if (passDTO.newPassword().length() < 3) {
            throw new PasswordTooShortException("Password must be at least 3 characters long.");
        }
        if (!passDTO.newPassword().equals(passDTO.newRepeatPassword())) {
            throw new PasswordMismatchException("Passwords don't match.");
        }
        if (!bCryptPasswordEncoder.matches(passDTO.oldPassword(), user.getPassword())) {
            throw new InvalidPasswordException("Current password does not match the database.");
        }
        if (bCryptPasswordEncoder.matches(passDTO.newPassword(), user.getPassword())) {
            throw new PasswordReuseException("New password must be different from the old password.");
        }

        user.setPassword(bCryptPasswordEncoder.encode(passDTO.newPassword()));
        userRepository.save(user);

        System.out.println("New password set successfully.");
    }

    public void changeEmail(ChangeEmailDTO changeEmail) throws NoPermissionsException {
        User user = getAuthPrinciple.getAuthenticatedUser();
        if (changeEmail.newEmail().equals(user.getEmail())) {
            throw new EmailAlreadyExistsException("Email " + changeEmail.newEmail() + " is the same as current one");
        }
        if (!bCryptPasswordEncoder.matches(changeEmail.currentPassword(), user.getPassword())) {
            throw new InvalidPasswordException("Current password is invalid.");
        }
        if (userRepository.existsByEmailIgnoreCase(changeEmail.newEmail())) {
            throw new EmailAlreadyExistsException("Email already in use by another account.");
        }
        user.setEmail(changeEmail.newEmail());
        userRepository.save(user);
        System.out.println("Email changed successfully!");

    }

    public RegisterResponseDTO getUser() throws NoPermissionsException {
        User user = getAuthPrinciple.getAuthenticatedUser();
        return new RegisterResponseDTO(user.getId(), user.getEmail(), user.getLocation());
    }


}
