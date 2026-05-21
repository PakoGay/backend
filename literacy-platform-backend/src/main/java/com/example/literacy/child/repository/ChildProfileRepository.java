package com.example.literacy.child.repository;

import com.example.literacy.child.model.ChildProfile;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChildProfileRepository extends JpaRepository<ChildProfile, Long> {
    List<ChildProfile> findByParentIdOrderByNameAsc(Long parentId);
    Page<ChildProfile> findByParentIdOrderByNameAsc(Long parentId, Pageable pageable);
    Optional<ChildProfile> findByIdAndParentId(Long id, Long parentId);
    Page<ChildProfile> findByAgeOrderByXpDescNameAsc(int age, Pageable pageable);
    List<ChildProfile> findByLastLessonCompletedOn(LocalDate date);
    List<ChildProfile> findByDailyStreakGreaterThanAndLastLessonCompletedOnBefore(int streak, LocalDate date);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            update ChildProfile child
            set child.dailyStreak = 0
            where child.dailyStreak > :streak
              and child.lastLessonCompletedOn < :date
            """)
    int resetDailyStreaksBefore(@Param("streak") int streak, @Param("date") LocalDate date);

    @Query("""
            select child.parent, count(completion.id)
            from ChildProfile child
            left join LessonCompletion completion
                   on completion.child = child
                  and completion.completedAt between :start and :end
            group by child.parent
            """)
    List<Object[]> summarizeWeeklyCompletionsByParent(
            @Param("start") OffsetDateTime start,
            @Param("end") OffsetDateTime end
    );

    long countByLastActiveAtAfter(OffsetDateTime after);
}