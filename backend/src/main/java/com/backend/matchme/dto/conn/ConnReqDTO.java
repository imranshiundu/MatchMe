package com.backend.matchme.dto.conn;
import lombok.Data;
import java.util.UUID;

@Data
public class ConnReqDTO {
    private Long requesterId;
    private String requesterName;
}
