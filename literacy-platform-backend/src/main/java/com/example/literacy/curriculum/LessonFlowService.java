package com.example.literacy.curriculum;

import com.example.literacy.auth.model.UserAccount;
import com.example.literacy.child.ChildService;
import com.example.literacy.child.model.ChildProfile;
import com.example.literacy.common.exception.BusinessException;
import com.example.literacy.common.exception.ResourceNotFoundException;
import com.example.literacy.curriculum.model.Exercise;
import com.example.literacy.curriculum.model.Lesson;
import com.example.literacy.curriculum.repository.ExerciseRepository;
import com.example.literacy.gamification.GamificationService;
import com.example.literacy.gamification.model.ExerciseSubmission;
import com.example.literacy.gamification.repository.ExerciseSubmissionRepository;
import com.example.literacy.gamification.repository.LessonCompletionRepository;
import com.example.literacy.notification.NotificationService;
import com.example.literacy.notification.model.NotificationType;
import java.time.OffsetDateTime;
import java.util.Locale;
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
    private final ExerciseRepository exerciseRepository;
    private final ExerciseSubmissionRepository exerciseSubmissionRepository;

    public LessonFlowService(ChildService childService,
                             CurriculumService curriculumService,
                             LessonCompletionRepository lessonCompletionRepository,
                             GamificationService gamificationService,
                             NotificationService notificationService,
                             ExerciseRepository exerciseRepository,
                             ExerciseSubmissionRepository exerciseSubmissionRepository) {
        this.childService = childService;
        this.curriculumService = curriculumService;
        this.lessonCompletionRepository = lessonCompletionRepository;
        this.gamificationService = gamificationService;
        this.notificationService = notificationService;
        this.exerciseRepository = exerciseRepository;
        this.exerciseSubmissionRepository = exerciseSubmissionRepository;
    }

    public ExerciseSubmission submitExercise(UserAccount currentUser, Long exerciseId, Long childId, String answer, long timeTakenSeconds) {
        ChildProfile child = childService.resolveOwned(currentUser, childId);
        Exercise exercise = exerciseRepository.findById(exerciseId)
                .orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));
        Lesson lesson = exercise.getLesson();
        if (!lesson.isPublished() || !lesson.getUnit().isPublished()) {
            throw new BusinessException("Exercise is not available");
        }
        if (lessonCompletionRepository.existsByChildIdAndLessonId(childId, lesson.getId())) {
            throw new BusinessException("Lesson is already completed for this child");
        }

        String trimmedAnswer = answer.trim();
        boolean correct = normalize(exercise.getCorrectAnswer()).equals(normalize(trimmedAnswer));
        ExerciseSubmission submission = exerciseSubmissionRepository.findByChildIdAndExerciseId(childId, exerciseId)
                .orElseGet(ExerciseSubmission::new);
        submission.setChild(child);
        submission.setExercise(exercise);
        submission.setSubmittedAnswer(trimmedAnswer);
        submission.setCorrect(correct);
        submission.setTimeTakenSeconds(timeTakenSeconds);
        submission.setSubmittedAt(OffsetDateTime.now());
        return exerciseSubmissionRepository.save(submission);
    }

    public GamificationService.CompletionOutcome complete(UserAccount currentUser, Long lessonId, Long childId, double accuracy, long durationSeconds) {
        ChildProfile child = childService.resolveOwned(currentUser, childId);
        Lesson lesson = curriculumService.getLesson(lessonId);
        if (!lesson.isPublished() || !lesson.getUnit().isPublished()) {
            throw new BusinessException("Lesson is not available");
        }
        boolean previousCompleted = lessonCompletionRepository.findByChildIdOrderByCompletedAtDesc(childId).stream().anyMatch(c -> {
            Lesson completedLesson = c.getLesson();
            return completedLesson.getUnit().getId().equals(lesson.getUnit().getId()) && completedLesson.getSortOrder() == lesson.getSortOrder() - 1;
        });
        curriculumService.ensureLessonUnlocked(childId, lesson, previousCompleted);
        if (lessonCompletionRepository.existsByChildIdAndLessonId(childId, lessonId)) {
            throw new BusinessException("Lesson is already completed for this child");
        }

        long exerciseCount = exerciseRepository.countByLessonId(lessonId);
        if (exerciseCount == 0) {
            throw new BusinessException("Lesson has no exercises and cannot be completed");
        }
        long submittedCount = exerciseSubmissionRepository.countByChildIdAndExerciseLessonId(childId, lessonId);
        if (submittedCount < exerciseCount) {
            throw new BusinessException("Complete all lesson exercises before finishing the lesson");
        }
        long correctCount = exerciseSubmissionRepository.countByChildIdAndExerciseLessonIdAndCorrectTrue(childId, lessonId);
        double serverAccuracy = correctCount / (double) exerciseCount;

        GamificationService.CompletionOutcome outcome = gamificationService.completeLesson(child, lesson, serverAccuracy, durationSeconds);
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

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }
}