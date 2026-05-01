package com.backend.matchme.repository;
import com.backend.matchme.entity.Chat;
import com.backend.matchme.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;
public interface MessageRepository extends JpaRepository<Message, Long> {
    Page<Message> findByChatOrderByTimestampDesc(Chat chat, Pageable pageable);
    int countByChatAndSenderIdNotAndIsReadFalse(Chat chat, Long sender_id);
    List<Message> findByChatAndSenderIdNotAndIsReadFalse(Chat chat, Long senderId);
}
