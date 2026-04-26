package com.backend.matchme.utils;

import com.backend.matchme.entity.Profile;
import com.backend.matchme.entity.User;
import com.backend.matchme.repository.ProfileRepository;
import com.backend.matchme.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

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
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            System.out.println("Database count is more than 0. Database already seeded.......");
            return;
        }

        System.out.println("Database count is less than 1. Seeding database with fictitious users.........");

        String[] locations = {"Tallinn", "Tartu", "Võru", "Pärnu", "Viimsi"};
        List<String> interests = ProfileOptions.INTEREST_OPTIONS;
        String[] genders = {"male", "female", "other"};
        List<String> lookingForOpts = ProfileOptions.LOOKING_FOR_OPTIONS;

        Random random = new Random();
        List<User> users = new ArrayList<>();

        String encodedPassword = passwordEncoder.encode("123");

        for (int i = 1; i <= 100; i++) {
            User user = new User();
            user.setEmail("user" + i + "@test.com");
            user.setPassword(encodedPassword);
            user.setLocation(locations[random.nextInt(locations.length)]);
            users.add(user);
        }

        userRepository.saveAll(users);
        userRepository.flush();

        for (User user : users) {
            List<String> selectedInterests = randomSelection(interests, 1 + random.nextInt(interests.size()), random);
            String gender = genders[random.nextInt(genders.length)];
            List<String> selectedLookingFor = randomSelection(lookingForOpts, 1 + random.nextInt(3), random);
            String nickname = user.getEmail().split("@")[0];
            Profile profile = new Profile();
            profile.setUser(user);
            profile.setNickname(nickname);
            profile.setInterest(selectedInterests);
            profile.setAge(18 + random.nextInt(50));
            profile.setGender(gender);
            profile.setLookingFor(selectedLookingFor);
            profile.setBio("Hi, I'm " + nickname + ". I enjoy " + String.join(", ", selectedInterests).toLowerCase() + " and love exploring " + user.getLocation() + ".");
            profileRepository.save(profile);
        }

        System.out.println("Successfully seeded 100 fictitious users and profiles.");
    }

    private List<String> randomSelection(List<String> options, int count, Random random) {
        Set<String> selected = new LinkedHashSet<>();
        while (selected.size() < count) {
            selected.add(options.get(random.nextInt(options.size())));
        }
        return new ArrayList<>(selected);
    }
}
