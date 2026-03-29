package com.backend.matchme.service;

import com.backend.matchme.dto.registerRequestDTO;
import com.backend.matchme.dto.UserResponseDTO;
import com.backend.matchme.entity.Profile;
import com.backend.matchme.entity.User;
import com.backend.matchme.exception.EmailAlreadyExistsException;
import com.backend.matchme.exception.PasswordMismatchException;
import com.backend.matchme.exception.PasswordTooShortException;
import com.backend.matchme.exception.ResourceNotFoundException;
import com.backend.matchme.repository.ProfileRepository;
import com.backend.matchme.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final ProfileRepository profileRepository;

    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder, ProfileRepository profileRepository) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.profileRepository = profileRepository;
    }

    public List<UserResponseDTO> findAll() {
        System.out.println("Finding all users...(" + userRepository.findAll() + ")");
        return userRepository.findAll().stream().map(user -> new UserResponseDTO(user.getId(), user.getEmail(), user.getLocation())).toList();
    }

    public UserResponseDTO createNewUser(registerRequestDTO registerRequestDTO) {

//TODO: check if email has @, maybe apply some rules for email and password.
        if (userRepository.existsByEmail(registerRequestDTO.email())) { //check if entered email already exists.
            throw new EmailAlreadyExistsException("Email " + registerRequestDTO.email() + " already exists");
        }
        if (!registerRequestDTO.password().equals(registerRequestDTO.repeatPassword())) { //check for password mismatching.
            throw new PasswordMismatchException("Passwords don't match");
        }
        if (registerRequestDTO.password().length() < 3) { //check for password length, we want to have at least 3 characters in password.
            throw new PasswordTooShortException("Password must be at least 3 characters long");
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
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User with id " + id + " not found"));
        return new UserResponseDTO(user.getId(), user.getEmail(), user.getLocation());
    }

    public UserResponseDTO register() {
        return null;
    }
}
