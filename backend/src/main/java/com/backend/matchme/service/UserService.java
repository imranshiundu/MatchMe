package com.backend.matchme.service;

import com.backend.matchme.dto.UserPostDTO;
import com.backend.matchme.dto.UserResponseDTO;
import com.backend.matchme.entity.User;
import com.backend.matchme.exception.EmailAlreadyExistsException;
import com.backend.matchme.exception.PasswordMismatchException;
import com.backend.matchme.exception.ResourceNotFoundException;
import com.backend.matchme.repository.UserRepository;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponseDTO> findAll() {
        System.out.println("Finding all users...(" + userRepository.findAll() + ")");
        return userRepository.findAll().stream().map(user -> new UserResponseDTO(user.getId(), user.getEmail(), user.getLocation())).toList();
    }

    public UserResponseDTO createNewUser(UserPostDTO userPostDTO) {


        if (userRepository.existsByEmail(userPostDTO.email())) { //check if entered email already exists.
            throw new EmailAlreadyExistsException("Email " + userPostDTO.email() + " already exists");
        }
        if (!userPostDTO.password().equals(userPostDTO.repeatPassword())) {
            throw new PasswordMismatchException("Passwords don't match");
        }

        User user = new User();
        user.setEmail(userPostDTO.email());
        user.setPassword(userPostDTO.password());
        User savedUser = userRepository.save(user);

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
