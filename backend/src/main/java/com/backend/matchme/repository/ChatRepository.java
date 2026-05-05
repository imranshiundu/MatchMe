package com.backend.matchme.repository;
import com.backend.matchme.entity.Chat;
import com.backend.matchme.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    Optional<Chat> findFirstByUser1AndUser2(User user1, User user2);

    @Query("SELECT c FROM Chat c WHERE c.user1 = :user OR c.user2 = :user ORDER BY c.lastActivity DESC")
    List<Chat> findByUser1OrUser2OrderByLastActivityDesc(User user);
}
