package com.backend.matchme.service;

import com.backend.matchme.dto.ChangeEmailDTO;
import com.backend.matchme.dto.ChangePasswordDTO;
import com.backend.matchme.dto.registerRequestDTO;
import com.backend.matchme.dto.UserResponseDTO;
import com.backend.matchme.entity.Profile;
import com.backend.matchme.entity.User;
import com.backend.matchme.exception.*;
import com.backend.matchme.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    //TODO: debugger method for now, delete for prod.
    public List<UserResponseDTO> findAll() {
        return userRepository.findAll().stream().map(user -> new UserResponseDTO(user.getId(), user.getEmail(), user.getLocation())).toList();
    }

    public void deleteUser(Long id) {
        User user = findUserById(id);
        userRepository.delete(user);
    }

    public void changePassword(Long id, ChangePasswordDTO passDTO) {
        User user = findUserById(id);
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

    public void changeEmail(Long id, ChangeEmailDTO changeEmail) {
        User user = findUserById(id);
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
        user.setProfile(profile); // set profile (important!)

        User savedUser = userRepository.save(user); //save email and hashed password to database.


        return new UserResponseDTO(savedUser.getId(), savedUser.getEmail(), savedUser.getLocation());
    }

    public UserResponseDTO getUser(Long id) {
        User user = findUserById(id);
        return new UserResponseDTO(user.getId(), user.getEmail(), user.getLocation());
    }

    //helper method to reduce boilerplate
    private User findUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User with id: " + id + " not found."));
    }

}
