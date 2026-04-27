package com.example.literacy.curriculum;

import com.example.literacy.auth.model.UserAccount;
import com.example.literacy.child.ChildService;
import com.example.literacy.child.model.ChildProfile;
import com.example.literacy.curriculum.model.Lesson;
import com.example.literacy.gamification.GamificationService;
import com.example.literacy.gamification.repository.LessonCompletionRepository;
import com.example.literacy.notification.NotificationService;
import com.example.literacy.notification.model.NotificationType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class LessonFlowService {

    private final ChildService childService;
    private final CurriculumService curriculumService;
    private final LessonCompletionRepository lessonCompletionRepository;
    private final GamificationService gamificationService;
    private final NotificationService notificationService;

    public LessonFlowService(ChildService childService,
                             CurriculumService curriculumService,
                             LessonCompletionRepository lessonCompletionRepository,
                             GamificationService gamificationService,
                             NotificationService notificationService) {
        this.childService = childService;
        this.curriculumService = curriculumService;
        this.lessonCompletionRepository = lessonCompletionRepository;
        this.gamificationService = gamificationService;
        this.notificationService = notificationService;
    }

    public GamificationService.CompletionOutcome complete(UserAccount currentUser, Long lessonId, Long childId, double accuracy, long durationSeconds) {
        ChildProfile child = childService.resolveOwned(currentUser, childId);
        Lesson lesson = curriculumService.getLesson(lessonId);
        boolean previousCompleted = lessonCompletionRepository.findByChildIdOrderByCompletedAtDesc(childId).stream().anyMatch(c -> {
            Lesson completedLesson = c.getLesson();
            return completedLesson.getUnit().getId().equals(lesson.getUnit().getId()) && completedLesson.getSortOrder() == lesson.getSortOrder() - 1;
        });
        curriculumService.ensureLessonUnlocked(childId, lesson, previousCompleted);
        if (lessonCompletionRepository.existsByChildIdAndLessonId(childId, lessonId)) {
            throw new IllegalArgumentException("Lesson is already completed for this child");
        }
        GamificationService.CompletionOutcome outcome = gamificationService.completeLesson(child, lesson, accuracy, durationSeconds);
        if (!outcome.newBadges().isEmpty()) {
            notificationService.create(child.getParent(), child, NotificationType.ACHIEVEMENT,
                    "New badge unlocked",
                    child.getName() + " unlocked " + outcome.newBadges().size() + " badge(s) after finishing " + lesson.getTitle() + ".");
        } else {
            notificationService.create(child.getParent(), child, NotificationType.ACHIEVEMENT,
                    "Lesson completed",
                    child.getName() + " completed " + lesson.getTitle() + " and earned " + outcome.completion().getXpEarned() + " XP.");
        }
        return outcome;
    }
}
