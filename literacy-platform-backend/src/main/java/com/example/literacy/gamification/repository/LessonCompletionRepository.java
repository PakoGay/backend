package com.example.literacy.gamification.repository;

import com.example.literacy.gamification.model.LessonCompletion;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonCompletionRepository extends JpaRepository<LessonCompletion, Long> {
    boolean existsByChildIdAndLessonId(Long childId, Long lessonId);
    List<LessonCompletion> findByChildIdOrderByCompletedAtDesc(Long childId);
    long countByChildId(Long childId);
    long countByChildIdAndLessonUnitId(Long childId, Long unitId);
    long countByChildIdAndCompletedAtBetween(Long childId, java.time.OffsetDateTime start, java.time.OffsetDateTime end);
    long countByCompletedAtBetween(java.time.OffsetDateTime start, java.time.OffsetDateTime end);
}
