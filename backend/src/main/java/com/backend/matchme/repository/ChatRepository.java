package com.backend.matchme.repository;
import com.backend.matchme.entity.Chat;
import com.backend.matchme.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
public interface ChatRepository extends JpaRepository<Chat, Long> {
    Optional<Chat> findByUser1AndUser2(User user1, User user2);
    List<Chat> findByUser1OrUser2OrderByLastActivityDesc(User user1, User user2);
}
