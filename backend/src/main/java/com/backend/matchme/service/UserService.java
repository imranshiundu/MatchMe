package com.backend.matchme.service;

import com.backend.matchme.dto.ChangeEmailDTO;
import com.backend.matchme.dto.ChangePasswordDTO;
import com.backend.matchme.dto.registerRequestDTO;
import com.backend.matchme.dto.UserResponseDTO;
import com.backend.matchme.entity.Profile;
import com.backend.matchme.entity.User;
import com.backend.matchme.exception.*;
import com.backend.matchme.repository.ProfileRepository;
import com.backend.matchme.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;

@Service
public class UserService {
    private static final Logger log = LoggerFactory.getLogger(UserService.class);
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final ProfileRepository profileRepository;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder, ProfileRepository profileRepository) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.profileRepository = profileRepository;
    }

    //TODO: debugger method for now, delete for prod.
    public List<UserResponseDTO> findAll() {
        return userRepository.findAll().stream().map(user -> new UserResponseDTO(user.getId(), user.getEmail(), user.getLocation())).toList();
    }

    public void deleteUser() throws AccessDeniedException {
        User user = findUserById();
        userRepository.delete(user);
    }

    public void changePassword(ChangePasswordDTO passDTO) throws AccessDeniedException {
        User user = findUserById();
        if (passDTO.newPassword().length() < 3) { //check for password length, we want to have at least 3 characters in password.
            throw new PasswordTooShortException("Password must be at least 3 characters long.");
        }
        if (!passDTO.newPassword().equals(passDTO.newRepeatPassword())) { //check for password mismatching.
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

        //TODO: add DTO to set response to frontend maybe.
        System.out.println("New password set successfully.");
    }

    public void changeEmail(ChangeEmailDTO changeEmail) throws AccessDeniedException {
        User user = findUserById();
        if (changeEmail.newEmail().equals(user.getEmail())) { //check if entered email already exists.
            throw new EmailAlreadyExistsException("Email " + changeEmail.newEmail() + " is the same as current one");
        }
        if (!bCryptPasswordEncoder.matches(changeEmail.currentPassword(), user.getPassword())) {
            throw new InvalidPasswordException("Current password is invalid.");
        }
        if (userRepository.existsByEmail(changeEmail.newEmail())) {
            throw new EmailAlreadyExistsException("Email already in use by another account.");
        }
        user.setEmail(changeEmail.newEmail());
        userRepository.save(user);
        //TODO: add DTO to set response to frontend maybe.
        System.out.println("Email changed successfully!");

    }

    public UserResponseDTO createNewUser(registerRequestDTO registerRequestDTO) {

        //TODO: check if email has @, maybe apply some rules for email and password.
        if (userRepository.existsByEmail(registerRequestDTO.email())) { //check if entered email already exists.
            throw new EmailAlreadyExistsException("Email " + registerRequestDTO.email() + " already exists.");
        }
        if (!registerRequestDTO.password().equals(registerRequestDTO.repeatPassword())) { //check for password mismatching.
            throw new PasswordMismatchException("Passwords don't match.");
        }
        if (registerRequestDTO.password().length() < 3) { //check for password length, we want to have at least 3 characters in password.
            throw new PasswordTooShortException("Password must be at least 3 characters long.");
        }

        User user = new User();
        user.setEmail(registerRequestDTO.email());
        String hashedPassword = bCryptPasswordEncoder.encode(registerRequestDTO.password()); //we encrypt password and never save the plain password.
        user.setPassword(hashedPassword);
        Profile profile = new Profile();
        profile.setUser(user); // link user
        User savedUser = userRepository.save(user); //save email and hashed password to database.
        Profile savedProfile = profileRepository.save(profile);


        return new UserResponseDTO(savedUser.getId(), savedUser.getEmail(), savedUser.getLocation());
    }

    public UserResponseDTO getUser() throws AccessDeniedException {
        User user = findUserById();
        return new UserResponseDTO(user.getId(), user.getEmail(), user.getLocation());
    }

    //helper method to reduce boilerplate
    private User findUserById() throws AccessDeniedException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null
                || auth.getPrincipal().equals("anonymousUser")) {
            log.info("Authentication object: {}", auth);
            log.info("Principal: {}", auth != null ? auth.getPrincipal() : null);
            log.info("Authenticated: {}", auth != null && auth.isAuthenticated());
            throw new AccessDeniedException("User not authenticated");
        }

        Long userId = (Long) auth.getPrincipal();

        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id: " + userId + " not found."));
    }

}
