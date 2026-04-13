package com.backend.matchme.repository;

import com.backend.matchme.entity.Connection;
import com.backend.matchme.entity.User;
import com.backend.matchme.enums.ConnectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    @Query("SELECT c FROM Connection c WHERE ((c.requester.id = :userAId AND c.receiver.id = :userBId) OR " +
            "(c.requester.id = :userBId AND c.receiver.id = :userAId)) " +
            "AND c.status = com.backend.matchme.enums.ConnectionStatus.ACCEPTED")
    Optional<Connection> findConnection(@Param("userAId") Long userAId,
                                        @Param("userBId") Long userBId);

    Optional<Connection> findByRequesterAndReceiver(User requester, User receiver);

    Optional<Connection> findByRequesterAndReceiverAndStatus(User requester, User receiver, ConnectionStatus status);

    List<Connection> findByReceiverAndStatus(User receiver, ConnectionStatus status);

    List<Connection> findByRequesterOrReceiverAndStatus(User user1, User user2, ConnectionStatus status);
}
