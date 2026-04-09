package com.backend.matchme.utils;

import com.backend.matchme.dto.connections.ConnectionResponseDTO;
import com.backend.matchme.entity.Connection;

public class ConnectionMapper {
    public static ConnectionResponseDTO toDTO(Connection connection) {
        return new ConnectionResponseDTO(
                connection.getUserA().getEmail(), // or getId() if you prefer
                connection.getUserB().getEmail(),
                connection.getStatus().toString()
        );
    }
}