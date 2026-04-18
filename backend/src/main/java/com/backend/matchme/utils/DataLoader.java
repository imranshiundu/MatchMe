package com.backend.matchme.utils;

import com.backend.matchme.entity.Profile;
import com.backend.matchme.entity.User;
import com.backend.matchme.repository.ProfileRepository;
import com.backend.matchme.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DataLoader implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(UserRepository userRepository, ProfileRepository profileRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            System.out.println("Database already seeded.");
            return;
        }

        System.out.println("Seeding database with fictitious users...");

        String[] locations = {"New York", "London", "Tokyo", "Paris", "Berlin", "Sydney", "Toronto", "Dubai", "Singapore"};
        String[] interests = {"Reading", "Traveling", "Gaming", "Swimming", "Music", "Photography", "Cooking", "Sports", "Art"};
        String[] genders = {"Male", "Female", "Non-binary"};
        String[] lookingForOpts = {"Male", "Female", "Non-binary", "Any"};

        Random random = new Random();
        List<User> users = new ArrayList<>();

        String encodedPassword = passwordEncoder.encode("password123");

        for (int i = 1; i <= 100; i++) {
            User user = new User();
            user.setEmail("user" + i + "@example.com");
            user.setPassword(encodedPassword);
            user.setLocation(locations[random.nextInt(locations.length)]);
            users.add(user);
        }

        userRepository.saveAll(users);
        userRepository.flush();

        for (int i = 0; i < users.size(); i++) {
            User user = users.get(i);
            String interest = interests[random.nextInt(interests.length)];
            String gender = genders[random.nextInt(genders.length)];
            String nickname = user.getEmail().split("@")[0];
            Profile profile = new Profile();
            profile.setUser(user);
            profile.setNickname(nickname);
            profile.setInterest(interest);
            profile.setAge(18 + random.nextInt(40));
            profile.setGender(gender);
            profile.setLookingFor(lookingForOpts[random.nextInt(lookingForOpts.length)]);
            profile.setBio("Hi, I'm " + nickname + ". I enjoy " + interest.toLowerCase() + " and love exploring " + user.getLocation() + ".");
            profileRepository.save(profile);
        }

        System.out.println("Successfully seeded 100 fictitious users and profiles.");
    }
}
