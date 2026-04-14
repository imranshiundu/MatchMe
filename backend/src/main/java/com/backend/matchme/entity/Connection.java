package com.backend.matchme.entity;

import com.backend.matchme.enums.ConnectionStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Connection {
    @Id
    private Long id;

    @MapsId
    @ManyToOne
    @JoinColumn(name = "user_a_id")
    private User userA;

    @MapsId
    @ManyToOne
    @JoinColumn(name = "user_b_id")
    private User userB;

    @Enumerated(EnumType.STRING)
    private ConnectionStatus status;


}
