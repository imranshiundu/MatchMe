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

    private String imageUrl = "https://res.cloudinary.com/ddvukican/image/upload/v1775725641/default-profile-image.jpg";// URL for frontend display

    private String publicId = "default-placeholder-image"; // Cloudinary identifier for backend management

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
