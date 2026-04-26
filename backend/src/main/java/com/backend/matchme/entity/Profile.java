package com.backend.matchme.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

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

    private String imageUrl = "https://res.cloudinary.com/ddvukican/image/upload/v1775725641/default-profile-image.jpg";

    private String publicId = "default-placeholder-image";

    private String bio;

    private Integer age;

    private String gender;

    @ElementCollection
    @CollectionTable(
            name = "profile_interest",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @Column(name = "interest")
    private List<String> interest = new ArrayList<>();

    @ElementCollection
    @CollectionTable(
            name = "profile_looking_for",
            joinColumns = @JoinColumn(name = "user_id")
    )
    @Column(name = "looking_for")
    private List<String> lookingFor = new ArrayList<>();

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;
}
