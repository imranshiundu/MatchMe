package com.backend.matchme.utils;

import com.backend.matchme.entity.User;
import com.backend.matchme.exception.NoPermissionsException;
import com.backend.matchme.exception.ResourceNotFoundException;
import com.backend.matchme.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class GetAuthPrinciple {
    private final UserRepository userRepository;

    public GetAuthPrinciple(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public User getAuthenticatedUser() throws NoPermissionsException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null
                || auth.getPrincipal().equals("anonymousUser")) {
            throw new NoPermissionsException("User not authenticated");
        }

        Long userId = (Long) auth.getPrincipal();

        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User with id: " + userId + " not found."));
    }

    public Long getUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null
                || auth.getPrincipal().equals("anonymousUser")) {
            return null;
        }
        return (Long) auth.getPrincipal();
    }
}
