package com.backend.matchme.controller;

import com.backend.matchme.dto.connections.ConnectionResponseDTO;
import com.backend.matchme.service.ConnectionService;
import org.springframework.web.bind.annotation.GetMapping;
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
    public List<ConnectionResponseDTO> connections() throws AccessDeniedException {
        return connectionService.getConnections();

    }
}

