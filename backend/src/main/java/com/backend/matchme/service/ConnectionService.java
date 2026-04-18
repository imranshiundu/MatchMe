package com.backend.matchme.service;

import com.backend.matchme.dto.connections.ConnectionResponseDTO;
import com.backend.matchme.dto.connections.RecommendationsResponseDTO;
import com.backend.matchme.entity.Connection;
import com.backend.matchme.entity.User;
import com.backend.matchme.enums.ConnectionStatus;
import com.backend.matchme.repository.ConnectionRepository;
import com.backend.matchme.repository.UserRepository;
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

    public ConnectionService(ConnectionRepository connectionRepository,
                             UserRepository userRepository,
                             MatchService matchService) {
        this.connectionRepository = connectionRepository;
        this.userRepository = userRepository;
        this.matchService = matchService;
    }

    public List<ConnectionResponseDTO> getConnections(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();

        return connectionRepository.findByRequesterOrReceiverAndStatus(user, user, ConnectionStatus.ACCEPTED)
                .stream()
                .map(connection -> new ConnectionResponseDTO(
                        connection.getRequester().getEmail(),
                        connection.getReceiver().getEmail(),
                        connection.getStatus().name()))
                .collect(Collectors.toList());
    }

    public RecommendationsResponseDTO getRecommendations(Pageable pageable, Long userId) {
        List<Long> recommendedIds = matchService.getRecommendations(userId);
        int start = (int) pageable.getOffset();

        if (start >= recommendedIds.size()) {
            return new RecommendationsResponseDTO(Collections.emptyList(), pageable);
        }

        int end = Math.min(start + pageable.getPageSize(), recommendedIds.size());
        return new RecommendationsResponseDTO(recommendedIds.subList(start, end), pageable);
    }

    public void requestConnection(Long requesterId, Long receiverId) {
        if (requesterId.equals(receiverId)) {
            return;
        }

        User requester = userRepository.findById(requesterId).orElseThrow();
        User receiver = userRepository.findById(receiverId).orElseThrow();

        if (connectionRepository.findByRequesterAndReceiver(requester, receiver).isPresent()
                || connectionRepository.findByRequesterAndReceiver(receiver, requester).isPresent()) {
            return;
        }

        Connection conn = Connection.builder()
                .requester(requester)
                .receiver(receiver)
                .status(ConnectionStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();
        connectionRepository.save(conn);
    }

    public List<Long> getConnectedIds(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return connectionRepository.findByRequesterOrReceiverAndStatus(user, user, ConnectionStatus.ACCEPTED)
                .stream()
                .map(c -> c.getRequester().getId().equals(userId) ? c.getReceiver().getId() : c.getRequester().getId())
                .collect(Collectors.toList());
    }

    public List<ConnectionResponseDTO> getConnectionRequests(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return connectionRepository.findByReceiverAndStatus(user, ConnectionStatus.PENDING)
                .stream()
                .map(connection -> new ConnectionResponseDTO(
                        connection.getRequester().getEmail(),
                        connection.getReceiver().getEmail(),
                        connection.getStatus().name()))
                .collect(Collectors.toList());
    }

    public void acceptRequest(Long userId, Long requesterId) {
        User receiver = userRepository.findById(userId).orElseThrow();
        User requester = userRepository.findById(requesterId).orElseThrow();
        Connection connection = connectionRepository.findByRequesterAndReceiverAndStatus(requester, receiver, ConnectionStatus.PENDING)
                .orElseThrow(() -> new RuntimeException("Connection request not found"));
        connection.setStatus(ConnectionStatus.ACCEPTED);
        connectionRepository.save(connection);
    }

    public void dismissRequest(Long userId, Long requesterId) {
        User receiver = userRepository.findById(userId).orElseThrow();
        User requester = userRepository.findById(requesterId).orElseThrow();
        Connection connection = connectionRepository.findByRequesterAndReceiverAndStatus(requester, receiver, ConnectionStatus.PENDING)
                .orElseThrow(() -> new RuntimeException("Connection request not found"));
        connection.setStatus(ConnectionStatus.DISMISSED);
        connectionRepository.save(connection);
    }

    public void deleteConnection(Long userId, Long otherUserId) {
        User user = userRepository.findById(userId).orElseThrow();
        User other = userRepository.findById(otherUserId).orElseThrow();
        
        Connection connection = connectionRepository.findByRequesterAndReceiverAndStatus(user, other, ConnectionStatus.ACCEPTED)
                .orElseGet(() -> connectionRepository.findByRequesterAndReceiverAndStatus(other, user, ConnectionStatus.ACCEPTED)
                        .orElseThrow(() -> new RuntimeException("Connection not found")));
        
        connectionRepository.delete(connection);
    }
}
