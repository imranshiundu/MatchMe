package com.backend.matchme.repository;

import com.backend.matchme.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProfileRepository extends JpaRepository<Profile,Long> {
    List<Profile> findByNicknameContainingIgnoreCase(String nickname);
}
