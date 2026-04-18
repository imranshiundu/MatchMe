package com.backend.matchme.repository;

import com.backend.matchme.entity.Profile;
import com.backend.matchme.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProfileRepository extends JpaRepository<Profile,Long> {
    List<Profile> findByNicknameContainingIgnoreCaseOrInterestContainingIgnoreCase(String query, String interest);
    List<Profile> findByNicknameContainingIgnoreCase(String nickname);
}
