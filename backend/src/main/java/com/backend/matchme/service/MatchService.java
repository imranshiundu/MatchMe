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

        List<Long> recommendations = profileRepository.findAll().stream()
                .filter(candidate -> !candidate.getId().equals(userId))
                .filter(this::ready)
                .filter(candidate -> withinRadius(me, candidate))
                .filter(candidate -> compatibleLookingFor(me, candidate))
                .filter(candidate -> !isDismissed(user, candidate.getId()))
                .filter(candidate -> !hasConnection(userId, candidate.getId()))
                .map(candidate -> new MatchScore(candidate.getId(), score(me, candidate)))
                .sorted(Comparator.comparingDouble(MatchScore::score).reversed())
                .map(MatchScore::userId)
                .collect(Collectors.toList());

        if (recommendations.isEmpty()) {
            // Fallback: show any active users
            return profileRepository.findAll().stream()
                    .filter(candidate -> !candidate.getId().equals(userId))
                    .filter(candidate -> candidate.getNickname() != null && !candidate.getNickname().isBlank())
                    .filter(candidate -> !isDismissed(user, candidate.getId()))
                    .filter(candidate -> !hasConnection(userId, candidate.getId()))
                    .limit(20)
                    .map(Profile::getId)
                    .collect(Collectors.toList());
        }

        return recommendations;
    }

    private boolean withinRadius(Profile me, Profile other) {
        User myUser = me.getUser();
        User otherUser = other.getUser();

        if (myUser.getLatitude() == null || myUser.getLongitude() == null ||
            otherUser.getLatitude() == null || otherUser.getLongitude() == null) {
            // Fallback to string matching if coordinates are missing
            if (myUser.getLocation() == null || otherUser.getLocation() == null) return false;
            return myUser.getLocation().equalsIgnoreCase(otherUser.getLocation());
        }

        double distance = calculateDistance(myUser.getLatitude(), myUser.getLongitude(),
                                           otherUser.getLatitude(), otherUser.getLongitude());
        
        return distance <= myUser.getRadius();
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371; // Earth's radius in km
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                   Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                   Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private boolean isDismissed(User user, Long candidateId) {
        return user.getDismissedUserIds() != null && user.getDismissedUserIds().contains(candidateId);
    }

    private boolean ready(Profile profile) {
        return profile.getNickname() != null && !profile.getNickname().isBlank()
                && profile.getBio() != null && !profile.getBio().isBlank();
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
        total += overlapLookingFor(left, right) * 0.50d;
        total += overlapCollections(left.getInterest(), right.getInterest()) * 0.35d;
        total += overlapText(left.getBio(), right.getBio()) * 0.15d;
        return total;
    }

    private boolean compatibleLookingFor(Profile left, Profile right) {
        return overlapLookingFor(left, right) > 0d;
    }

    private double overlapLookingFor(Profile left, Profile right) {
        Set<String> leftOptions = normalize(left.getLookingFor());
        Set<String> rightOptions = normalize(right.getLookingFor());
        if (leftOptions.isEmpty() || rightOptions.isEmpty()) {
            return 0d;
        }
        if (leftOptions.contains("any") || rightOptions.contains("any")) {
            return 1d;
        }
        return overlapCollections(left.getLookingFor(), right.getLookingFor());
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
