package com.backend.matchme.controller;

import com.backend.matchme.dto.post.CreatePostDTO;
import com.backend.matchme.dto.post.PostResponseDTO;
import com.backend.matchme.service.PostService;
import com.backend.matchme.utils.GetAuthPrinciple;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {
    private final PostService postService;
    private final GetAuthPrinciple getAuthPrinciple;

    public PostController(PostService postService, GetAuthPrinciple getAuthPrinciple) {
        this.postService = postService;
        this.getAuthPrinciple = getAuthPrinciple;
    }

    @PostMapping
    public ResponseEntity<PostResponseDTO> createPost(@RequestBody CreatePostDTO dto) {
        Long userId = getAuthPrinciple.getUserId();
        return ResponseEntity.ok(postService.createPost(userId, dto));
    }

    @GetMapping
    public ResponseEntity<Page<PostResponseDTO>> getPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "false") boolean discover) {
        if (discover) {
            return ResponseEntity.ok(postService.getDiscoveryFeed(PageRequest.of(page, size)));
        }
        return ResponseEntity.ok(postService.getAllPosts(PageRequest.of(page, size)));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostResponseDTO>> getUserPosts(@PathVariable Long userId) {
        return ResponseEntity.ok(postService.getUserPosts(userId));
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Void> likePost(@PathVariable Long id) {
        postService.likePost(id);
        return ResponseEntity.ok().build();
    }
}
