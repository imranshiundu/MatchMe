package com.backend.matchme.service;

import com.backend.matchme.dto.UserPostDTO;
import com.backend.matchme.dto.UserResponseDTO;
import com.backend.matchme.entity.User;
import com.backend.matchme.exception.EmailAlreadyExistsException;
import com.backend.matchme.exception.PasswordMismatchException;
import com.backend.matchme.exception.PasswordTooShortException;
import com.backend.matchme.exception.ResourceNotFoundException;
import com.backend.matchme.repository.UserRepository;
import org.apache.coyote.BadRequestException;
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

    public List<UserResponseDTO> findAll() {
        System.out.println("Finding all users...(" + userRepository.findAll() + ")");
        return userRepository.findAll().stream().map(user -> new UserResponseDTO(user.getId(), user.getEmail(), user.getLocation())).toList();
    }

    public UserResponseDTO createNewUser(UserPostDTO userPostDTO) {

//TODO: check if email has @, maybe apply some rules for email and password.
        if (userRepository.existsByEmail(userPostDTO.email())) { //check if entered email already exists.
            throw new EmailAlreadyExistsException("Email " + userPostDTO.email() + " already exists");
        }
        if (!userPostDTO.password().equals(userPostDTO.repeatPassword())) { //check for password mismatching.
            throw new PasswordMismatchException("Passwords don't match");
        }
        if(userPostDTO.password().length() < 3){ //check for password length, we want to have at least 3 characters in password.
            throw new PasswordTooShortException("Password must be at least 3 characters long");
        }

        User user = new User();
        user.setEmail(userPostDTO.email());
        String hashedPassword = bCryptPasswordEncoder.encode(userPostDTO.password()); //we encrypt password and never save the plain password.
        user.setPassword(hashedPassword);
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
