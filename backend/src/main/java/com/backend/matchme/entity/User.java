package com.backend.matchme.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String password;

    private String location;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true) //orphanRemoval removes profile is user entity is deleted from db.
    @PrimaryKeyJoinColumn
    private Profile profile;
}
