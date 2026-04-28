package com.example.literacy.gamification;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.example.literacy.child.model.ChildProfile;
import com.example.literacy.curriculum.repository.LessonRepository;
import com.example.literacy.gamification.repository.BadgeAwardRepository;
import com.example.literacy.gamification.repository.LessonCompletionRepository;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

public class StreakLogic {
    private final LessonCompletionRepository completionRepository = Mockito.mock(LessonCompletionRepository.class);
    private final BadgeAwardRepository badgeAwardRepository = Mockito.mock(BadgeAwardRepository.class);
    private final LessonRepository lessonRepository = Mockito.mock(LessonRepository.class);
    private final GamificationService service = new GamificationService(completionRepository, badgeAwardRepository, lessonRepository);

    @Test
    void shouldStartStreakForFirstLesson() {
        ChildProfile child = new ChildProfile();
        service.applyStreak(child);
        assertEquals(1, child.getDailyStreak());
        assertEquals(LocalDate.now(), child.getLastLessonCompletedOn());
    }

    @Test
    void shouldIncreaseStreakAfterYesterdayActivity() {
        ChildProfile child = new ChildProfile();
        child.setDailyStreak(3);
        child.setLastLessonCompletedOn(LocalDate.now().minusDays(1));
        service.applyStreak(child);
        assertEquals(4, child.getDailyStreak());
    }

    @Test
    void shouldResetStreakAfterMissedDay() {
        ChildProfile child = new ChildProfile();
        child.setDailyStreak(5);
        child.setLastLessonCompletedOn(LocalDate.now().minusDays(3));
        service.applyStreak(child);
        assertEquals(1, child.getDailyStreak());
    }
}
