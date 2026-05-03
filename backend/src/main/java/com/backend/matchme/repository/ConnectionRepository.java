package com.backend.matchme.repository;

import com.backend.matchme.entity.Connection;
import com.backend.matchme.entity.User;
import com.backend.matchme.enums.ConnectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    Optional<Connection> findByRequesterAndReceiver(User requester, User receiver);

    Optional<Connection> findByRequesterAndReceiverAndStatus(User requester, User receiver, ConnectionStatus status);

    Optional<Connection> findByIdAndReceiverAndStatus(Long id, User receiver, ConnectionStatus status);

    List<Connection> findByReceiverAndStatus(User receiver, ConnectionStatus status);

    List<Connection> findByStatusAndRequesterOrStatusAndReceiver(ConnectionStatus status1, User user1, ConnectionStatus status2, User user2);
}
