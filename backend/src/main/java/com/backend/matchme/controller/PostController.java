package com.backend.matchme.controller;

import com.backend.matchme.dto.post.PostResponseDTO;
import com.backend.matchme.service.PostService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/posts")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public List<PostResponseDTO> getAllPosts() {
        return postService.getAllPosts();
    }

    @PostMapping
    public PostResponseDTO createPost(@RequestBody PostRequest postRequest) {
        return postService.createPost(postRequest.content(), postRequest.imageUrl());
    }

    public record PostRequest(String content, String imageUrl) {}
}
