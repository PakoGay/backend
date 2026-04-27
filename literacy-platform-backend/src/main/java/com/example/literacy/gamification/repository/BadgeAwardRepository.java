package com.example.literacy.gamification.repository;

import com.example.literacy.gamification.model.BadgeAward;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BadgeAwardRepository extends JpaRepository<BadgeAward, Long> {
    boolean existsByChildIdAndCode(Long childId, String code);
    List<BadgeAward> findByChildIdOrderByAwardedAtDesc(Long childId);
}
