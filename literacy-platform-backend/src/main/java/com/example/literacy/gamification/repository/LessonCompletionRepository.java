package com.example.literacy.gamification.repository;

import com.example.literacy.gamification.model.LessonCompletion;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LessonCompletionRepository extends JpaRepository<LessonCompletion, Long> {

    boolean existsByChildIdAndLessonId(Long childId, Long lessonId);

    @EntityGraph(attributePaths = {"lesson", "lesson.unit"})
    List<LessonCompletion> findByChildIdOrderByCompletedAtDesc(Long childId);

    @EntityGraph(attributePaths = {"lesson", "lesson.unit"})
    Page<LessonCompletion> findByChildIdOrderByCompletedAtDesc(Long childId, Pageable pageable);

    long countByChildId(Long childId);

    long countByChildIdAndLessonUnitId(Long childId, Long unitId);

    long countByChildIdAndCompletedAtBetween(
            Long childId,
            OffsetDateTime start,
            OffsetDateTime end
    );

    long countByCompletedAtBetween(
            OffsetDateTime start,
            OffsetDateTime end
    );
    void deleteByChildId(Long childId);
}