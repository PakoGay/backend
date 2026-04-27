package com.example.literacy.gamification;

import com.example.literacy.child.model.ChildProfile;
import com.example.literacy.curriculum.model.Lesson;
import com.example.literacy.curriculum.repository.LessonRepository;
import com.example.literacy.gamification.model.BadgeAward;
import com.example.literacy.gamification.model.LessonCompletion;
import com.example.literacy.gamification.repository.BadgeAwardRepository;
import com.example.literacy.gamification.repository.LessonCompletionRepository;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class GamificationService {

    private final LessonCompletionRepository lessonCompletionRepository;
    private final BadgeAwardRepository badgeAwardRepository;
    private final LessonRepository lessonRepository;

    public GamificationService(LessonCompletionRepository lessonCompletionRepository,
                               BadgeAwardRepository badgeAwardRepository,
                               LessonRepository lessonRepository) {
        this.lessonCompletionRepository = lessonCompletionRepository;
        this.badgeAwardRepository = badgeAwardRepository;
        this.lessonRepository = lessonRepository;
    }

    public CompletionOutcome completeLesson(ChildProfile child, Lesson lesson, double accuracy, long durationSeconds) {
        int stars = calculateStars(accuracy, durationSeconds);
        int xpEarned = calculateXp(lesson.getBaseXp(), accuracy, durationSeconds);

        LessonCompletion completion = new LessonCompletion();
        completion.setChild(child);
        completion.setLesson(lesson);
        completion.setAccuracy(accuracy);
        completion.setDurationSeconds(durationSeconds);
        completion.setStars(stars);
        completion.setXpEarned(xpEarned);
        completion.setCompletedAt(OffsetDateTime.now());
        lessonCompletionRepository.save(completion);

        applyStreak(child);
        child.setXp(child.getXp() + xpEarned);
        child.setCurrentLevel(Math.max(child.getStartingLevel(), (child.getXp() / 100) + 1));
        child.setLastActiveAt(OffsetDateTime.now());
        child.setProgressPercent(calculateProgressPercent(child));

        List<BadgeAward> newBadges = evaluateBadges(child, lesson.getUnit().getId());
        return new CompletionOutcome(completion, newBadges);
    }

    public int calculateXp(int baseXp, double accuracy, long durationSeconds) {
        int accuracyBonus = (int) Math.round(accuracy * 20);
        int speedBonus = durationSeconds <= 60 ? 15 : durationSeconds <= 120 ? 5 : 0;
        return baseXp + accuracyBonus + speedBonus;
    }

    public int calculateStars(double accuracy, long durationSeconds) {
        if (accuracy >= 0.95 && durationSeconds <= 90) return 3;
        if (accuracy >= 0.80) return 2;
        if (accuracy >= 0.60) return 1;
        throw new IllegalArgumentException("Accuracy must be at least 0.60 to complete a lesson");
    }

    public void applyStreak(ChildProfile child) {
        LocalDate today = LocalDate.now();
        LocalDate last = child.getLastLessonCompletedOn();
        if (last == null) {
            child.setDailyStreak(1);
        } else if (last.equals(today)) {
            child.setDailyStreak(child.getDailyStreak() == 0 ? 1 : child.getDailyStreak());
        } else if (last.equals(today.minusDays(1))) {
            child.setDailyStreak(child.getDailyStreak() + 1);
        } else {
            child.setDailyStreak(1);
        }
        child.setLastLessonCompletedOn(today);
    }

    public List<BadgeAward> evaluateBadges(ChildProfile child, Long unitId) {
        List<BadgeAward> earned = new ArrayList<>();
        if (lessonCompletionRepository.countByChildId(child.getId()) >= 1) {
            maybeAddBadge(earned, child, "FIRST_LESSON", "First Lesson", "Completed the first lesson.");
        }
        if (child.getXp() >= 100) {
            maybeAddBadge(earned, child, "HUNDRED_XP", "100 XP", "Reached 100 XP.");
        }
        if (child.getDailyStreak() >= 7) {
            maybeAddBadge(earned, child, "SEVEN_DAY_STREAK", "7-Day Streak", "Learned for seven days in a row.");
        }
        long completedInUnit = lessonCompletionRepository.countByChildIdAndLessonUnitId(child.getId(), unitId);
        long totalInUnit = lessonRepository.countByUnitIdAndPublishedTrue(unitId);
        if (totalInUnit > 0 && completedInUnit >= totalInUnit) {
            maybeAddBadge(earned, child, "UNIT_COMPLETE_" + unitId, "Unit Complete", "Finished every published lesson in the unit.");
        }
        return earned;
    }

    private int calculateProgressPercent(ChildProfile child) {
        long completed = lessonCompletionRepository.countByChildId(child.getId());
        long totalPublished = lessonRepository.countByPublishedTrue();
        if (totalPublished == 0) return 0;
        return (int) Math.min(100, Math.round((completed * 100.0) / totalPublished));
    }

    private void maybeAddBadge(List<BadgeAward> earned, ChildProfile child, String code, String title, String description) {
        if (badgeAwardRepository.existsByChildIdAndCode(child.getId(), code)) {
            return;
        }
        BadgeAward award = new BadgeAward();
        award.setChild(child);
        award.setCode(code);
        award.setTitle(title);
        award.setDescription(description);
        award.setAwardedAt(OffsetDateTime.now());
        earned.add(badgeAwardRepository.save(award));
    }

    public record CompletionOutcome(LessonCompletion completion, List<BadgeAward> newBadges) {}
}
