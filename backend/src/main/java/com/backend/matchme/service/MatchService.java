package com.backend.matchme.service;

import com.backend.matchme.entity.Profile;
import com.backend.matchme.entity.User;
import com.backend.matchme.repository.ConnectionRepository;
import com.backend.matchme.repository.ProfileRepository;
import com.backend.matchme.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MatchService {
    private final ProfileRepository profileRepository;
    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;

    public MatchService(ProfileRepository profileRepository,
                        ConnectionRepository connectionRepository,
                        UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.connectionRepository = connectionRepository;
        this.userRepository = userRepository;
    }

    public List<Long> getRecommendations(Long userId) {
        Profile me = profileRepository.findById(userId).orElseThrow();
        User user = userRepository.findById(userId).orElseThrow();

        return profileRepository.findAll().stream()
                .filter(candidate -> !candidate.getId().equals(userId))
                .filter(this::ready)
                .filter(candidate -> sameLocation(me, candidate))
                .filter(candidate -> !isDismissed(user, candidate.getId()))
                .filter(candidate -> !hasConnection(userId, candidate.getId()))
                .map(candidate -> new MatchScore(candidate.getId(), score(me, candidate)))
                .sorted(Comparator.comparingDouble(MatchScore::score).reversed())
                .map(MatchScore::userId)
                .collect(Collectors.toList());
    }

    private boolean sameLocation(Profile me, Profile other) {
        if (me.getUser().getLocation() == null || other.getUser().getLocation() == null) return false;
        return me.getUser().getLocation().equalsIgnoreCase(other.getUser().getLocation());
    }

    private boolean isDismissed(User user, Long candidateId) {
        return user.getDismissedUserIds() != null && user.getDismissedUserIds().contains(candidateId);
    }

    private boolean ready(Profile profile) {
        return profile.getNickname() != null && !profile.getNickname().isBlank()
                && profile.getBio() != null && !profile.getBio().isBlank()
                && profile.getGender() != null && !profile.getGender().isBlank()
                && profile.getLookingFor() != null && !profile.getLookingFor().isEmpty()
                && profile.getInterest() != null && !profile.getInterest().isEmpty()
                && profile.getAge() != null;
    }

    private boolean hasConnection(Long leftId, Long rightId) {
        Optional<User> left = userRepository.findById(leftId);
        Optional<User> right = userRepository.findById(rightId);
        if (left.isEmpty() || right.isEmpty()) {
            return false;
        }

        return connectionRepository.findByRequesterAndReceiver(left.get(), right.get()).isPresent()
                || connectionRepository.findByRequesterAndReceiver(right.get(), left.get()).isPresent();
    }

    private double score(Profile left, Profile right) {
        double total = 0d;
        if (compatibleLookingFor(left, right)) {
            total += 0.50d;
        }

        total += overlapCollections(left.getInterest(), right.getInterest()) * 0.35d;
        total += overlapText(left.getBio(), right.getBio()) * 0.15d;
        return total;
    }

    private boolean compatibleLookingFor(Profile left, Profile right) {
        String rightGender = clean(right.getGender());
        String leftGender = clean(left.getGender());

        boolean leftAcceptsRight = acceptsGender(left.getLookingFor(), rightGender);
        boolean rightAcceptsLeft = acceptsGender(right.getLookingFor(), leftGender);
        return leftAcceptsRight && rightAcceptsLeft;
    }

    private boolean acceptsGender(List<String> lookingFor, String gender) {
        if (lookingFor == null || lookingFor.isEmpty() || gender.isBlank()) {
            return false;
        }

        Set<String> options = normalize(lookingFor);
        return options.contains("any") || options.contains(gender);
    }

    private double overlapCollections(List<String> left, List<String> right) {
        Set<String> leftTokens = normalize(left);
        Set<String> rightTokens = normalize(right);
        if (leftTokens.isEmpty() || rightTokens.isEmpty()) {
            return 0d;
        }

        Set<String> common = new HashSet<>(leftTokens);
        common.retainAll(rightTokens);
        Set<String> union = new HashSet<>(leftTokens);
        union.addAll(rightTokens);
        return (double) common.size() / union.size();
    }

    private double overlapText(String left, String right) {
        Set<String> leftTokens = tokens(left);
        Set<String> rightTokens = tokens(right);
        if (leftTokens.isEmpty() || rightTokens.isEmpty()) {
            return 0d;
        }

        Set<String> common = new HashSet<>(leftTokens);
        common.retainAll(rightTokens);
        Set<String> union = new HashSet<>(leftTokens);
        union.addAll(rightTokens);
        return (double) common.size() / union.size();
    }

    private Set<String> normalize(List<String> values) {
        Set<String> result = new HashSet<>();
        if (values == null) {
            return result;
        }

        for (String value : values) {
            String cleaned = clean(value);
            if (!cleaned.isBlank()) {
                result.add(cleaned);
            }
        }
        return result;
    }

    private Set<String> tokens(String value) {
        Set<String> result = new HashSet<>();
        for (String token : clean(value).replace(',', ' ').split("\\s+")) {
            if (token.length() > 1) {
                result.add(token);
            }
        }
        return result;
    }

    private String clean(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }

    private record MatchScore(Long userId, double score) {
    }
}
