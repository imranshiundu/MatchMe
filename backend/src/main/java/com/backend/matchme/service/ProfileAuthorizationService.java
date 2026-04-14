package com.backend.matchme.service;


import com.backend.matchme.repository.ConnectionRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ProfileAuthorizationService {
    private final ConnectionRepository connectionRepository;

    public ProfileAuthorizationService(ConnectionRepository connectionRepository) {
        this.connectionRepository = connectionRepository;
    }


    public boolean isProfileAuthorized(Long id) {
        Long userId = (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return id.equals(userId) || connectionRepository.findConnection(id, userId).isPresent();
    }

}
