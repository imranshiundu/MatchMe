package com.matchme.service;

import com.matchme.dto.UserPatchDTO;
import com.matchme.dto.UserResponseDTO;
import com.matchme.entity.User;
import com.matchme.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Stream;

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
