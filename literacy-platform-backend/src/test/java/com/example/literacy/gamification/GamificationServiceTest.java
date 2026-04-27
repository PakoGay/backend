package com.example.literacy.gamification;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.example.literacy.curriculum.repository.LessonRepository;
import com.example.literacy.gamification.repository.BadgeAwardRepository;
import com.example.literacy.gamification.repository.LessonCompletionRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class GamificationServiceTest {

    private final LessonCompletionRepository completionRepository = Mockito.mock(LessonCompletionRepository.class);
    private final BadgeAwardRepository badgeAwardRepository = Mockito.mock(BadgeAwardRepository.class);
    private final LessonRepository lessonRepository = Mockito.mock(LessonRepository.class);
    private final GamificationService service = new GamificationService(completionRepository, badgeAwardRepository, lessonRepository);

    @Test
    void shouldCalculateXpWithAccuracyAndSpeedBonus() {
        assertEquals(84, service.calculateXp(50, 0.95, 50));
    }

    @Test
    void shouldAwardThreeStarsForHighAccuracyAndFastTime() {
        assertEquals(3, service.calculateStars(0.96, 80));
    }
}
