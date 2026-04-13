package com.backend.matchme.controller;

import com.backend.matchme.dto.connections.ConnectionResponseDTO;
import com.backend.matchme.dto.connections.RecommendationsResponseDTO;
import com.backend.matchme.service.ConnectionService;
import com.backend.matchme.utils.PaginationValidator;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ConnectionController {
    private final ConnectionService connService;

    public ConnectionController(ConnectionService connService) {
        this.connService = connService;
    }

    @GetMapping("/connections")
    public List<ConnectionResponseDTO> getConnections(@AuthenticationPrincipal Long userId) {
        return connService.getConnections(userId);
    }

    @GetMapping("/recommendations")
    public RecommendationsResponseDTO getRecommendations(@AuthenticationPrincipal Long userId,
                                                         @RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "10") int size) {
        PaginationValidator.validate(page, size);
        Pageable pageable = PageRequest.of(page, size);
        return connService.getRecommendations(pageable, userId);
    }

    @PostMapping("/{id}/request")
    public ResponseEntity<Void> request(@AuthenticationPrincipal Long userId, @PathVariable Long id) {
        connService.requestConnection(userId, id);
        return ResponseEntity.ok().build();
    }
}
