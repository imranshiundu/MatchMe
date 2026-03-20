package com.backend.matchme.service;

import com.backend.matchme.dto.UserPatchDTO;
import com.backend.matchme.dto.UserResponseDTO;
import com.backend.matchme.entity.User;
import com.backend.matchme.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<UserResponseDTO> findAll() {
        System.out.println(userRepository.findAll());
        return userRepository.findAll().stream().map(user -> new UserResponseDTO(user.getId(), user.getEmail(), user.getLocation())).toList();
    }

    public UserResponseDTO createNewUser(UserPatchDTO userPatchDTO) {
        User user = new User();
        user.setEmail(userPatchDTO.email());
        user.setPassword(userPatchDTO.password());
        User savedUser = userRepository.save(user);
        return  new UserResponseDTO(savedUser.getId(), savedUser.getEmail(), savedUser.getLocation());
    }
}
