package com.backend.matchme.entity;

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
public class Profile {

    @Id
    @Column(name = "user_id")
    private Long id;
    private String firstName;
    @Column(nullable = true)
    private String lastName;
    @Column(nullable = true)
    private String interest;
    @Column(nullable = true)
    private String bio;
    @Column(nullable = true)
    private Integer age;
    @Column(nullable = true)
    private String gender;
    @Column(nullable = true)
    private String lookingFor;

    @OneToOne
    @MapsId //use user ID and profile doesn't have its own id.
    @JoinColumn(name = "user_id")
    private User user;

}
