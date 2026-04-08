package com.backend.matchme.repository;

import com.backend.matchme.entity.Connection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ConnectionRepository extends JpaRepository<Connection, Long> {
    @Query("SELECT c FROM Connection c WHERE (" +
            "c.userA.id = :userAId AND c.userB.id = :userBId OR " +
            "c.userA.id = :userBId AND c.userB.id = :userAId) " +
            "AND c.status = ConnectionStatus.ACCEPTED")
    Optional<Connection> findConnection(@Param("userAId") Long userAId,
                                        @Param("userBId") Long userBId);
}
