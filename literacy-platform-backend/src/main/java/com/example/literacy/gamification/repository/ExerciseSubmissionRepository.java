package com.example.literacy.gamification.repository;

import com.example.literacy.gamification.model.ExerciseSubmission;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExerciseSubmissionRepository extends JpaRepository<ExerciseSubmission, Long> {
    Optional<ExerciseSubmission> findByChildIdAndExerciseId(Long childId, Long exerciseId);
    List<ExerciseSubmission> findByChildIdAndExerciseLessonId(Long childId, Long lessonId);
    long countByChildIdAndExerciseLessonId(Long childId, Long lessonId);
    long countByChildIdAndExerciseLessonIdAndCorrectTrue(Long childId, Long lessonId);
}