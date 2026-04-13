package com.backend.matchme.service;
import com.backend.matchme.entity.Connection;
import com.backend.matchme.entity.User;
import com.backend.matchme.enums.ConnectionStatus;
import com.backend.matchme.repository.ConnectionRepository;
import com.backend.matchme.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
@Service
public class ConnService {
    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;
    public ConnService(ConnectionRepository connectionRepository, UserRepository userRepository) {
        this.connectionRepository = connectionRepository;
        this.userRepository = userRepository;
    }
    public void requestConnection(Long requesterId, Long receiverId) {
        User requester = userRepository.findById(requesterId).orElseThrow();
        User receiver = userRepository.findById(receiverId).orElseThrow();
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
}
