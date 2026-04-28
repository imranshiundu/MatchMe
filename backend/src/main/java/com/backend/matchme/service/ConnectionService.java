package com.backend.matchme.service;

import com.backend.matchme.dto.connections.ConnectionIdDTO;
import com.backend.matchme.dto.connections.ConnectionResponseDTO;
import com.backend.matchme.dto.connections.RecommendationsResponseDTO;
import com.backend.matchme.entity.Connection;
import com.backend.matchme.entity.Profile;
import com.backend.matchme.entity.User;
import com.backend.matchme.enums.ConnectionStatus;
import com.backend.matchme.exception.ConnectionStateException;
import com.backend.matchme.exception.ProfileIncompleteException;
import com.backend.matchme.exception.ResourceNotFoundException;
import com.backend.matchme.repository.ConnectionRepository;
import com.backend.matchme.repository.ProfileRepository;
import com.backend.matchme.repository.UserRepository;
import com.backend.matchme.utils.ProfileValidator;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConnectionService {
    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;
    private final MatchService matchService;
    private final ProfileValidator profileValidator;
    private final ProfileRepository profileRepository;

    public ConnectionService(ConnectionRepository connectionRepository,
                             UserRepository userRepository,
                             MatchService matchService, ProfileValidator profileValidator, ProfileRepository profileRepository) {
        this.connectionRepository = connectionRepository;
        this.userRepository = userRepository;
        this.matchService = matchService;
        this.profileValidator = profileValidator;
        this.profileRepository = profileRepository;
    }

    public RecommendationsResponseDTO getRecommendations(Pageable pageable, Long userId) {
        ensureProfileComplete(userId);

        List<Long> recommendedIds = matchService.getRecommendations(userId);

        int start = (int) pageable.getOffset();
        int size = pageable.getPageSize();

        if (start >= recommendedIds.size()) {
            return new RecommendationsResponseDTO(
                    Collections.emptyList(),
                    false,
                    start > 0
            );
        }

        int end = Math.min(start + size, recommendedIds.size());

        List<Long> pageContent = recommendedIds.subList(start, end);

        boolean hasNext = end < recommendedIds.size();
        boolean hasPrevious = start > 0;

        return new RecommendationsResponseDTO(pageContent, hasNext, hasPrevious);
    }

    public void requestConnection(Long requesterId, Long receiverId) {
        if (requesterId.equals(receiverId)) {
            throw new ConnectionStateException("You cannot send a connection request to yourself");
        }
        ensureProfileComplete(requesterId);

        User requester = userRepository.findById(requesterId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        User receiver = userRepository.findById(receiverId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Connection outbound = connectionRepository.findByRequesterAndReceiver(requester, receiver).orElse(null);
        if (outbound != null) {
            throw new ConnectionStateException("You already sent a request to this user");
        }

        Connection inbound = connectionRepository.findByRequesterAndReceiver(receiver, requester).orElse(null);
        if (inbound != null) {
            throw new ConnectionStateException("This user already has a request/connection with you");
        }

        Connection conn = Connection.builder()
                .requester(requester)
                .receiver(receiver)
                .status(ConnectionStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        connectionRepository.save(conn);
    }

    public List<ConnectionIdDTO> getConnectedIds(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return connectionRepository.findByRequesterOrReceiverAndStatus(user, user, ConnectionStatus.ACCEPTED)
                .stream()
                .map(c -> new ConnectionIdDTO(c.getRequester().getId().equals(userId) ? c.getReceiver().getId() : c.getRequester().getId())).toList();

    }

    public List<ConnectionResponseDTO> getConnectionRequests(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return connectionRepository.findByReceiverAndStatus(user, ConnectionStatus.PENDING)
                .stream()
                .map(connection -> new ConnectionResponseDTO(
                        connection.getId(),
                        connection.getRequester().getId(),
                        connection.getReceiver().getId(),
                        connection.getStatus().name()))
                .collect(Collectors.toList());
    }

    public void acceptRequest(Long userId, Long requestId) {
        User receiver = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Connection connection = connectionRepository.findByIdAndReceiverAndStatus(requestId, receiver, ConnectionStatus.PENDING)
                .orElseThrow(() -> new ResourceNotFoundException("Connection request not found"));

        connection.setStatus(ConnectionStatus.ACCEPTED);
        connection.setUpdatedAt(LocalDateTime.now());
        connectionRepository.save(connection);
    }

    public void dismissRequest(Long userId, Long requestId) {
        User receiver = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Connection connection = connectionRepository.findByIdAndReceiverAndStatus(requestId, receiver, ConnectionStatus.PENDING)
                .orElseThrow(() -> new ResourceNotFoundException("Connection request not found"));
        connection.setStatus(ConnectionStatus.DISMISSED);
        connection.setUpdatedAt(LocalDateTime.now());
        connectionRepository.save(connection);
    }

    public void deleteConnection(Long userId, Long otherUserId) {
        if(userId.equals(otherUserId)) { throw new ConnectionStateException("Cannot delete self connection."); }
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        User other = userRepository.findById(otherUserId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Connection connection = connectionRepository.findByRequesterAndReceiverAndStatus(user, other, ConnectionStatus.ACCEPTED)
                .orElseGet(() -> connectionRepository.findByRequesterAndReceiverAndStatus(other, user, ConnectionStatus.ACCEPTED)
                        .orElseThrow(() -> new ResourceNotFoundException("Connection not found")));

        connectionRepository.delete(connection);
    }

    private void ensureProfileComplete(Long userId) {
        Profile requesterProfile = profileRepository.findById(userId).orElseThrow(() -> new ProfileIncompleteException("Complete your profile before using recommendations or connections"));
        if (!profileValidator.isProfileComplete(requesterProfile)) {
            throw new ProfileIncompleteException("Complete your profile before using recommendations or connections");
        }
    }
}
