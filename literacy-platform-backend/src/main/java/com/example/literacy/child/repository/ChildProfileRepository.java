package com.example.literacy.child.repository;

import com.example.literacy.child.model.ChildProfile;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChildProfileRepository extends JpaRepository<ChildProfile, Long> {
    List<ChildProfile> findByParentIdOrderByNameAsc(Long parentId);
    Page<ChildProfile> findByParentIdOrderByNameAsc(Long parentId, Pageable pageable);
    Optional<ChildProfile> findByIdAndParentId(Long id, Long parentId);
    Page<ChildProfile> findByAgeOrderByXpDescNameAsc(int age, Pageable pageable);
    List<ChildProfile> findByLastLessonCompletedOn(LocalDate date);
    List<ChildProfile> findByDailyStreakGreaterThanAndLastLessonCompletedOnBefore(int streak, LocalDate date);
    long countByLastActiveAtAfter(OffsetDateTime after);
}