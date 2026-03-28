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
    private long id;
    @Column(nullable = false)
    private String firstName;
    @Column(nullable = false)
    private String lastName;
    @Column(nullable = false)
    private String interest;
    private String bio;
    private String age;
    private String gender;
    private String lookingFor;

    @OneToOne
    @MapsId //use user ID
    @JoinColumn(name = "user_id")
    private User user;

}
