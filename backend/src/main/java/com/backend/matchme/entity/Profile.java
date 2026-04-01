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

    @Lob
    private byte[] profilePicture; // Large-OBject which saves binary data of image.

    @Column(nullable = true)
    private String profilePictureContentType; //This tells frontend how to handle it e.g. Content type: JPG

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
