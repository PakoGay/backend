package com.example.literacy.curriculum.repository;

import com.example.literacy.curriculum.model.Exercise;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findByLessonIdOrderByDisplayOrderAsc(Long lessonId);
    long countByLessonId(Long lessonId);
}
