package com.backend.matchme.controller;

import com.backend.matchme.dto.connections.ConnectionIdDTO;
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
    private final ConnectionService connectionService;

    public ConnectionController(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }

    @GetMapping("/connections")
    public List<ConnectionIdDTO> getConnections(@AuthenticationPrincipal Long userId) {
        return connectionService.getConnectedIds(userId);
    }

    @GetMapping("/recommendations")
    public RecommendationsResponseDTO getRecommendations(
            @AuthenticationPrincipal Long userId,
            @RequestParam(defaultValue = "0") int page
    ) {
        PaginationValidator.validate(page, 10);
        Pageable pageable = PageRequest.of(page, 10);
        return connectionService.getRecommendations(pageable, userId);
    }

    @PostMapping("/{id}/request")
    public ResponseEntity<Void> request(@AuthenticationPrincipal Long userId, @PathVariable Long id) {
        connectionService.requestConnection(userId, id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/connection-requests")
    public ResponseEntity<List<ConnectionResponseDTO>> getConnectionRequests(@AuthenticationPrincipal Long userId) {
        return ResponseEntity.ok(connectionService.getConnectionRequests(userId));
    }

    @PostMapping("/connection-requests/{id}/accept")
    public ResponseEntity<Void> acceptRequest(@AuthenticationPrincipal Long userId, @PathVariable Long id) {
        connectionService.acceptRequest(userId, id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/connection-requests/{id}/dismiss")
    public ResponseEntity<Void> dismissRequest(@AuthenticationPrincipal Long userId, @PathVariable Long id) {
        connectionService.dismissRequest(userId, id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/connections/{id}")
    public ResponseEntity<Void> deleteConnection(@AuthenticationPrincipal Long userId, @PathVariable Long id) {
        connectionService.deleteConnection(userId, id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/status")
    public ResponseEntity<String> getStatus(@AuthenticationPrincipal Long userId, @PathVariable Long id) {
        return ResponseEntity.ok(connectionService.getConnectionStatus(userId, id));
    }
}
