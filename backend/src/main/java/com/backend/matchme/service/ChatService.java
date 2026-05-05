package com.backend.matchme.service;

import com.backend.matchme.dto.chat.*;
import com.backend.matchme.entity.Chat;
import com.backend.matchme.entity.Message;
import com.backend.matchme.entity.Profile;
import com.backend.matchme.entity.User;
import com.backend.matchme.enums.ConnectionStatus;
import com.backend.matchme.repository.ChatRepository;
import com.backend.matchme.repository.ConnectionRepository;
import com.backend.matchme.repository.MessageRepository;
import com.backend.matchme.repository.ProfileRepository;
import com.backend.matchme.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ChatService {
    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ConnectionRepository connectionRepository;
    private final PresenceService presenceService;
    private final ProfileRepository profileRepository;

    public ChatService(
            ChatRepository chatRepository,
            MessageRepository messageRepository,
            UserRepository userRepository,
            ConnectionRepository connectionRepository,
            PresenceService presenceService,
            ProfileRepository profileRepository
    ) {
        this.chatRepository = chatRepository;
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.connectionRepository = connectionRepository;
        this.presenceService = presenceService;
        this.profileRepository = profileRepository;
    }

    public List<ChatItemDTO> getChats(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return chatRepository.findByUser1OrUser2OrderByLastActivityDesc(user).stream()
                .map(chat -> mapToChatItem(chat, userId))
                .collect(Collectors.toList());
    }

    @Transactional
    public List<ChatMsgDTO> getMessages(Long userId, Long chatId, int page, int size, boolean markAsRead) {
        Chat chat = chatRepository.findById(chatId).orElseThrow();
        if (!owns(chat, userId)) {
            throw new RuntimeException("Chat not found");
        }
        if (markAsRead) {
            markMessagesAsRead(chat, userId);
        }
        List<ChatMsgDTO> items = messageRepository.findByChatOrderByTimestampDesc(chat, PageRequest.of(page, size))
                .stream()
                .map(msg -> mapMessage(msg, other(chat, userId).getId()))
                .collect(Collectors.toList());
        Collections.reverse(items);
        return items;
    }

    @Transactional
    public SendRes send(Long senderId, ChatSendDTO dto) {
        User sender = userRepository.findById(senderId).orElseThrow();
        User receiver = userRepository.findById(dto.getReceiverId()).orElseThrow();
        if (!isConnected(sender, receiver)) {
            throw new RuntimeException("Users are not connected");
        }

        Chat chat = getOrCreateChat(sender, receiver);

        Message saved = messageRepository.save(Message.builder()
                .chat(chat)
                .sender(sender)
                .content(dto.getContent())
                .timestamp(LocalDateTime.now())
                .isRead(false)
                .build());

        chat.setLastActivity(saved.getTimestamp());
        chatRepository.save(chat);

        return new SendRes(
                mapMessage(saved, receiver.getId()),
                mapToChatItem(chat, senderId),
                mapToChatItem(chat, receiver.getId())
        );
    }

    public TypingEventDTO typing(Long senderId, TypingDTO dto) {
        User sender = userRepository.findById(senderId).orElseThrow();
        User receiver = userRepository.findById(dto.toId()).orElseThrow();
        if (!isConnected(sender, receiver)) {
            throw new RuntimeException("Users are not connected");
        }
        Chat chat = getOrCreateChat(sender, receiver);
        return new TypingEventDTO(chat.getId(), senderId, dto.typing());
    }

    private void markMessagesAsRead(Chat chat, Long userId) {
        List<Message> unreadMessages = messageRepository.findByChatAndSenderIdNotAndIsReadFalse(chat, userId);
        if (unreadMessages.isEmpty()) {
            return;
        }

        unreadMessages.forEach(message -> message.setRead(true));
        messageRepository.saveAll(unreadMessages);
    }

    private ChatItemDTO mapToChatItem(Chat chat, Long userId) {
        User other = other(chat, userId);
        Profile otherProfile = profileRepository.findById(other.getId()).orElse(null);

        ChatItemDTO dto = new ChatItemDTO();
        dto.setChatId(chat.getId());
        dto.setParticipantId(other.getId());
        dto.setParticipantName(resolveParticipantName(other, otherProfile));
        dto.setParticipantPicture(otherProfile != null ? otherProfile.getImageUrl() : null);
        dto.setParticipantBio(otherProfile != null ? otherProfile.getBio() : null);
        dto.setParticipantOnline(presenceService.isOnline(other.getId()));
        if (chat.getMessages() != null && !chat.getMessages().isEmpty()) {
            dto.setLastMessage(chat.getMessages().get(0).getContent());
        }
        dto.setLastActivity(chat.getLastActivity());
        dto.setUnreadCount(messageRepository.countByChatAndSenderIdNotAndIsReadFalse(chat, userId));
        return dto;
    }

    private String resolveParticipantName(User user, Profile profile) {
        if (profile != null && profile.getNickname() != null && !profile.getNickname().isBlank()) {
            return profile.getNickname();
        }
        return user.getEmail();
    }

    private ChatMsgDTO mapMessage(Message msg, Long receiverId) {
        ChatMsgDTO dto = new ChatMsgDTO();
        dto.setId(msg.getId());
        dto.setChatId(msg.getChat().getId());
        dto.setSenderId(msg.getSender().getId());
        dto.setReceiverId(receiverId);
        dto.setContent(msg.getContent());
        dto.setTimestamp(msg.getTimestamp());
        dto.setRead(msg.isRead());
        return dto;
    }

    private boolean owns(Chat chat, Long userId) {
        return chat.getUser1().getId().equals(userId) || chat.getUser2().getId().equals(userId);
    }

    private boolean isConnected(User left, User right) {
        return connectionRepository.findByRequesterAndReceiverAndStatus(left, right, ConnectionStatus.ACCEPTED).isPresent()
                || connectionRepository.findByRequesterAndReceiverAndStatus(right, left, ConnectionStatus.ACCEPTED).isPresent();
    }

    private User other(Chat chat, Long userId) {
        return chat.getUser1().getId().equals(userId) ? chat.getUser2() : chat.getUser1();
    }

    @Transactional
    public Chat ensureChatExists(User u1, User u2) {
        return getOrCreateChat(u1, u2);
    }

    @Transactional
    public Chat ensureChatExists(Long user1Id, Long user2Id) {
        User u1 = userRepository.findById(user1Id).orElseThrow();
        User u2 = userRepository.findById(user2Id).orElseThrow();
        return getOrCreateChat(u1, u2);
    }

    public ChatItemDTO initiateChat(Long userId, Long receiverId) {
        User sender = userRepository.findById(userId).orElseThrow();
        User receiver = userRepository.findById(receiverId).orElseThrow();
        if (!isConnected(sender, receiver)) {
            throw new RuntimeException("Users are not connected");
        }
        Chat chat = getOrCreateChat(sender, receiver);
        return mapToChatItem(chat, userId);
    }

    private Chat getOrCreateChat(User u1, User u2) {
        User first = u1.getId().compareTo(u2.getId()) < 0 ? u1 : u2;
        User second = first == u1 ? u2 : u1;
        Optional<Chat> chat = chatRepository.findByUser1AndUser2(first, second);
        return chat.orElseGet(() -> chatRepository.save(Chat.builder()
                .user1(first)
                .user2(second)
                .lastActivity(LocalDateTime.now())
                .build()));
    }

    public record SendRes(ChatMsgDTO msg, ChatItemDTO mine, ChatItemDTO theirs) {
    }
}
