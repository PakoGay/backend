package com.example.literacy.curriculum.repository;

import com.example.literacy.curriculum.model.DifficultyLevel;
import com.example.literacy.curriculum.model.Lesson;
import com.example.literacy.curriculum.model.LessonType;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LessonRepository extends JpaRepository<Lesson, Long> {

    @Query("""
            select l from Lesson l
            join fetch l.unit u
            where (:unitId is null or u.id = :unitId)
              and (:lessonType is null or l.lessonType = :lessonType)
              and (:difficulty is null or l.difficulty = :difficulty)
              and (:published is null or l.published = :published)
            order by u.sortOrder asc, l.sortOrder asc
            """)
    Page<Lesson> search(@Param("unitId") Long unitId,
                        @Param("lessonType") LessonType lessonType,
                        @Param("difficulty") DifficultyLevel difficulty,
                        @Param("published") Boolean published,
                        Pageable pageable);

    List<Lesson> findByUnitIdOrderBySortOrderAsc(Long unitId);
    List<Lesson> findByUnitIdAndPublishedTrueOrderBySortOrderAsc(Long unitId);
    long countByPublishedTrue();
    long countByUnitIdAndPublishedTrue(Long unitId);
}
