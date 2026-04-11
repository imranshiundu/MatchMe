package com.backend.matchme.service;

import com.backend.matchme.dto.connections.ConnectionResponseDTO;
import com.backend.matchme.dto.connections.RecommendationsResponseDTO;
import com.backend.matchme.entity.Profile;
import com.backend.matchme.entity.User;
import com.backend.matchme.exception.ProfileIncompleteException;
import com.backend.matchme.exception.ResourceNotFoundException;
import com.backend.matchme.repository.ConnectionRepository;
import com.backend.matchme.repository.ProfileRepository;
import com.backend.matchme.utils.ConnectionMapper;
import com.backend.matchme.utils.GetAuthPrinciple;
import com.backend.matchme.utils.ProfileValidator;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;

@Service
public class ConnectionService {
    private final GetAuthPrinciple getAuthPrinciple;
    private final ProfileRepository profileRepository;
    private final ProfileValidator profileValidator;
    private final ConnectionRepository connectionRepository;


    public ConnectionService(GetAuthPrinciple getAuthPrinciple, ProfileRepository profileRepository, ProfileValidator profileValidator, ConnectionRepository connectionRepository) {
        this.getAuthPrinciple = getAuthPrinciple;
        this.profileRepository = profileRepository;
        this.profileValidator = profileValidator;
        this.connectionRepository = connectionRepository;
    }

    public List<ConnectionResponseDTO> getConnections() throws AccessDeniedException {
        User user = getAuthPrinciple.getAuthenticatedUser();
        Profile profile = profileRepository.findById(user.getId()).orElseThrow(() -> new ResourceNotFoundException("Profile not found" + user.getId()));
        if (!profileValidator.isProfileComplete(profile)) {
            throw new ProfileIncompleteException("Profile incomplete. Please complete profile before proceeding");
        }
        return connectionRepository.findAll()
                .stream()
                .map(ConnectionMapper::toDTO)
                .toList();
    }

    //TODO: currently returns list of profile ids 1->10 with paging. edit to match with recommendations.
    public RecommendationsResponseDTO getRecommendations(Pageable pageable) throws AccessDeniedException {
        User user = getAuthPrinciple.getAuthenticatedUser();
        Profile profile = profileRepository.findById(user.getId()).orElseThrow(() -> new ResourceNotFoundException("Profile not found" + user.getId()));
        if (!profileValidator.isProfileComplete(profile)) {
            throw new ProfileIncompleteException("Profile incomplete. Please complete profile before proceeding");
        }
        List<Long> profileList = profileRepository.findAll(pageable).stream().map(Profile::getId).toList();
        return new RecommendationsResponseDTO(profileList, pageable);
    }
}
