package com.backend.matchme.service;

import com.backend.matchme.dto.post.CreatePostDTO;
import com.backend.matchme.dto.post.PostResponseDTO;
import com.backend.matchme.entity.Post;
import com.backend.matchme.entity.User;
import com.backend.matchme.repository.PostRepository;
import com.backend.matchme.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public PostResponseDTO createPost(Long userId, CreatePostDTO dto) {
        User author = userRepository.findById(userId).orElseThrow();
        
        Post post = Post.builder()
                .content(dto.getContent())
                .type(dto.getType())
                .codeLanguage(dto.getCodeLanguage())
                .createdAt(LocalDateTime.now())
                .author(author)
                .build();
        
        Post saved = postRepository.save(post);
        return mapToDTO(saved);
    }

    public Page<PostResponseDTO> getAllPosts(Pageable pageable) {
        return postRepository.findAllByOrderByCreatedAtDesc(pageable).map(this::mapToDTO);
    }

    public Page<PostResponseDTO> getDiscoveryFeed(Pageable pageable) {
        return postRepository.findAllRandom(pageable).map(this::mapToDTO);
    }

    public List<PostResponseDTO> getUserPosts(Long userId) {
        User author = userRepository.findById(userId).orElseThrow();
        return postRepository.findByAuthorOrderByCreatedAtDesc(author).stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    private PostResponseDTO mapToDTO(Post post) {
        User author = post.getAuthor();
        String nickname = author.getProfile() != null ? author.getProfile().getNickname() : "Unknown";
        String imageUrl = author.getProfile() != null ? author.getProfile().getImageUrl() : "/favicon.svg";

        return new PostResponseDTO(
                post.getId(),
                post.getContent(),
                post.getType(),
                post.getCodeLanguage(),
                post.getCreatedAt(),
                author.getId(),
                nickname,
                imageUrl,
                post.getLikesCount()
        );
    }

    @Transactional
    public void likePost(Long postId) {
        postRepository.findById(postId).ifPresent(post -> {
            post.setLikesCount((post.getLikesCount() == null ? 0 : post.getLikesCount()) + 1);
            postRepository.save(post);
        });
    }
}
