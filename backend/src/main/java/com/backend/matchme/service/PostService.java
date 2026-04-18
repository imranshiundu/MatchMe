package com.backend.matchme.service;

import com.backend.matchme.dto.post.PostResponseDTO;
import com.backend.matchme.entity.Post;
import com.backend.matchme.entity.User;
import com.backend.matchme.repository.PostRepository;
import com.backend.matchme.utils.GetAuthPrinciple;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final GetAuthPrinciple getAuthPrinciple;

    public PostService(PostRepository postRepository, GetAuthPrinciple getAuthPrinciple) {
        this.postRepository = postRepository;
        this.getAuthPrinciple = getAuthPrinciple;
    }

    public List<PostResponseDTO> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public PostResponseDTO createPost(String content, String imageUrl) {
        User user = getAuthPrinciple.getAuthenticatedUser();
        Post post = new Post();
        post.setAuthor(user);
        post.setContent(content);
        post.setImageUrl(imageUrl);
        return mapToDTO(postRepository.save(post));
    }

    private PostResponseDTO mapToDTO(Post post) {
        return new PostResponseDTO(
            post.getId(),
            post.getAuthor().getId(),
            post.getAuthor().getProfile() != null ? post.getAuthor().getProfile().getNickname() : post.getAuthor().getEmail(),
            post.getAuthor().getProfile() != null ? post.getAuthor().getProfile().getImageUrl() : null,
            post.getContent(),
            post.getImageUrl(),
            post.getLikesCount(),
            post.getCreatedAt()
        );
    }
}
