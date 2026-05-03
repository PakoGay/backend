package com.example.literacy.curriculum.repository;

import com.example.literacy.curriculum.model.Exercise;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {

    @EntityGraph(attributePaths = {"lesson", "lesson.unit"})
    List<Exercise> findByLessonIdOrderByDisplayOrderAsc(Long lessonId);

    @EntityGraph(attributePaths = {"lesson", "lesson.unit"})
    Page<Exercise> findByLessonIdOrderByDisplayOrderAsc(Long lessonId, Pageable pageable);

    long countByLessonId(Long lessonId);
}