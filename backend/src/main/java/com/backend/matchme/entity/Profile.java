package com.backend.matchme.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
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

    private String nickname;

    @Lob
    private byte[] profilePicture; // Large-OBject which saves binary data of image.

    private String profilePictureContentType; //This tells frontend how to handle it e.g. Content type: JPG

    private String interest;

    private String bio;

    private Integer age;

    private String gender;

    private String lookingFor;


    @OneToOne
    @MapsId //use user ID and profile doesn't have its own id.
    @JoinColumn(name = "user_id")
    private User user;

}
