package com.example.literacy.curriculum;

import com.example.literacy.common.api.PageResponse;
import com.example.literacy.curriculum.model.*;
import com.example.literacy.gamification.GamificationService;
import com.example.literacy.gamification.model.ExerciseSubmission;
import com.example.literacy.security.CurrentUserFacade;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
public class CurriculumController {

    private final CurriculumService curriculumService;
    private final LessonFlowService lessonFlowService;
    private final CurrentUserFacade currentUserFacade;

    public CurriculumController(CurriculumService curriculumService, LessonFlowService lessonFlowService, CurrentUserFacade currentUserFacade) {
        this.curriculumService = curriculumService;
        this.lessonFlowService = lessonFlowService;
        this.currentUserFacade = currentUserFacade;
    }

    @GetMapping("/units")
    public List<UnitResponse> units() {
        boolean admin = currentUserFacade.currentUser().getRole().name().equals("ADMIN");
        return curriculumService.listUnits(admin).stream().map(UnitResponse::from).toList();
    }

    @PostMapping("/units")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public UnitResponse createUnit(@Valid @RequestBody UnitRequest request) {
        return UnitResponse.from(curriculumService.createUnit(currentUserFacade.currentUser(), request.title(), request.description(), request.sortOrder(), request.published()));
    }

    @PostMapping("/exercises/{exerciseId}/submit")
    public ExerciseSubmissionResponse submitExercise(@PathVariable Long exerciseId, @Valid @RequestBody SubmitExerciseRequest request) {
        return ExerciseSubmissionResponse.from(lessonFlowService.submitExercise(
                currentUserFacade.currentUser(), exerciseId, request.childId(), request.answer(), request.timeTakenSeconds()));
    }

    @PostMapping("/lessons/{lessonId}/complete")
    public CompletionResponse complete(@PathVariable Long lessonId, @Valid @RequestBody CompleteLessonRequest request) {
        GamificationService.CompletionOutcome outcome = lessonFlowService.complete(currentUserFacade.currentUser(), lessonId, request.childId(), request.accuracy(), request.durationSeconds());
        return new CompletionResponse(
                outcome.completion().getId(),
                outcome.completion().getXpEarned(),
                outcome.completion().getStars(),
                outcome.completion().getAccuracy(),
                outcome.newBadges().stream().map(b -> b.getTitle()).toList(),
                "Great job! Lesson completed successfully."
        );
    }

    // Records (DTOs)
    public record UnitRequest(@NotBlank @Size(max = 120) String title, @NotBlank @Size(max = 500) String description, @Min(1) int sortOrder, boolean published) {}
    public record UnitResponse(Long id, String title, String description, int sortOrder, boolean published) {
        static UnitResponse from(CurriculumUnit unit) { return new UnitResponse(unit.getId(), unit.getTitle(), unit.getDescription(), unit.getSortOrder(), unit.isPublished()); }
    }
    public record SubmitExerciseRequest(@NotNull Long childId, @NotBlank @Size(max = 500) String answer, @Min(1) long timeTakenSeconds) {}
    public record ExerciseSubmissionResponse(Long submissionId, Long exerciseId, Long childId, boolean correct, long timeTakenSeconds) {
        static ExerciseSubmissionResponse from(ExerciseSubmission submission) {
            return new ExerciseSubmissionResponse(submission.getId(), submission.getExercise().getId(), submission.getChild().getId(), submission.isCorrect(), submission.getTimeTakenSeconds());
        }
    }
    public record CompleteLessonRequest(@NotNull Long childId, @DecimalMin("0.0") @DecimalMax("1.0") double accuracy, @Min(1) long durationSeconds) {}
    public record CompletionResponse(Long completionId, int xpEarned, int stars, double accuracy, List<String> newBadges, String message) {}
}