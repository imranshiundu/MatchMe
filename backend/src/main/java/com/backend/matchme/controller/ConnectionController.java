package com.backend.matchme.controller;

import com.backend.matchme.dto.connections.ConnectionResponseDTO;
import com.backend.matchme.dto.connections.RecommendationsResponseDTO;
import com.backend.matchme.service.ConnectionService;
import com.backend.matchme.utils.PaginationValidator;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.AccessDeniedException;
import java.util.List;

@RestController
public class ConnectionController {
    private final ConnectionService connectionService;


    public ConnectionController(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }


    @GetMapping("/connections")
    public List<ConnectionResponseDTO> getConnections() throws AccessDeniedException {
        return connectionService.getConnections();
    }

    @GetMapping("/recommendations")
    public RecommendationsResponseDTO getRecommendations(@RequestParam(defaultValue = "0") int page,
                                                         @RequestParam(defaultValue = "10") int size) throws AccessDeniedException {
        PaginationValidator.validate(page, size);
        Pageable pageable = PageRequest.of(page, size);
        return connectionService.getRecommendations(pageable);
    }
}

