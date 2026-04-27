package com.example.literacy.curriculum;

import com.example.literacy.common.api.PageResponse;
import com.example.literacy.curriculum.model.CurriculumUnit;
import com.example.literacy.curriculum.model.DifficultyLevel;
import com.example.literacy.curriculum.model.Exercise;
import com.example.literacy.curriculum.model.Lesson;
import com.example.literacy.curriculum.model.LessonType;
import com.example.literacy.gamification.GamificationService;
import com.example.literacy.security.CurrentUserFacade;
import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

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

    @PutMapping("/units/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public UnitResponse updateUnit(@PathVariable Long id, @Valid @RequestBody UnitRequest request) {
        return UnitResponse.from(curriculumService.updateUnit(currentUserFacade.currentUser(), id, request.title(), request.description(), request.sortOrder(), request.published()));
    }

    @DeleteMapping("/units/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteUnit(@PathVariable Long id) {
        curriculumService.deleteUnit(currentUserFacade.currentUser(), id);
    }

    @GetMapping("/lessons")
    public PageResponse<LessonResponse> lessons(@RequestParam(required = false) Long unitId,
                                                @RequestParam(required = false) LessonType type,
                                                @RequestParam(required = false) DifficultyLevel difficulty,
                                                @RequestParam(required = false) Boolean published,
                                                @RequestParam(defaultValue = "0") int page,
                                                @RequestParam(defaultValue = "20") int size) {
        PageResponse<Lesson> response = curriculumService.lessons(unitId, type, difficulty, published, page, size);
        return new PageResponse<>(response.content().stream().map(LessonResponse::from).toList(), response.page(), response.size(), response.totalElements(), response.totalPages());
    }

    @PostMapping("/lessons")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public LessonResponse createLesson(@Valid @RequestBody LessonRequest request) {
        return LessonResponse.from(curriculumService.createLesson(currentUserFacade.currentUser(), request.unitId(), request.title(), request.description(), request.lessonType(), request.difficulty(), request.baseXp(), request.sortOrder(), request.published()));
    }

    @PutMapping("/lessons/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public LessonResponse updateLesson(@PathVariable Long id, @Valid @RequestBody LessonRequest request) {
        return LessonResponse.from(curriculumService.updateLesson(currentUserFacade.currentUser(), id, request.unitId(), request.title(), request.description(), request.lessonType(), request.difficulty(), request.baseXp(), request.sortOrder(), request.published()));
    }

    @DeleteMapping("/lessons/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteLesson(@PathVariable Long id) {
        curriculumService.deleteLesson(currentUserFacade.currentUser(), id);
    }

    @GetMapping("/lessons/{lessonId}/exercises")
    public List<ExerciseResponse> exercises(@PathVariable Long lessonId) {
        return curriculumService.exercises(lessonId).stream().map(ExerciseResponse::from).toList();
    }

    @PostMapping("/lessons/{lessonId}/exercises")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.CREATED)
    public ExerciseResponse createExercise(@PathVariable Long lessonId, @Valid @RequestBody ExerciseRequest request) {
        return ExerciseResponse.from(curriculumService.createExercise(currentUserFacade.currentUser(), lessonId, request.exerciseType(), request.prompt(), request.correctAnswer(), request.displayOrder()));
    }

    @PutMapping("/exercises/{exerciseId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ExerciseResponse updateExercise(@PathVariable Long exerciseId, @Valid @RequestBody ExerciseRequest request) {
        return ExerciseResponse.from(curriculumService.updateExercise(currentUserFacade.currentUser(), exerciseId, request.exerciseType(), request.prompt(), request.correctAnswer(), request.displayOrder()));
    }

    @DeleteMapping("/exercises/{exerciseId}")
    @PreAuthorize("hasRole('ADMIN')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteExercise(@PathVariable Long exerciseId) {
        curriculumService.deleteExercise(currentUserFacade.currentUser(), exerciseId);
    }

    @PostMapping("/lessons/{lessonId}/complete")
    public CompletionResponse complete(@PathVariable Long lessonId, @Valid @RequestBody CompleteLessonRequest request) {
        GamificationService.CompletionOutcome outcome = lessonFlowService.complete(currentUserFacade.currentUser(), lessonId, request.childId(), request.accuracy(), request.durationSeconds());
        return new CompletionResponse(
                outcome.completion().getId(),
                outcome.completion().getXpEarned(),
                outcome.completion().getStars(),
                outcome.newBadges().stream().map(b -> b.getTitle()).toList(),
                "Great job! Lesson completed successfully."
        );
    }

    public record UnitRequest(@NotBlank @Size(max = 120) String title, @NotBlank @Size(max = 500) String description, @Min(1) int sortOrder, boolean published) {}
    public record UnitResponse(Long id, String title, String description, int sortOrder, boolean published) {
        static UnitResponse from(CurriculumUnit unit) { return new UnitResponse(unit.getId(), unit.getTitle(), unit.getDescription(), unit.getSortOrder(), unit.isPublished()); }
    }

    public record LessonRequest(@NotNull Long unitId, @NotBlank @Size(max = 120) String title, @NotBlank @Size(max = 500) String description,
                                @NotNull LessonType lessonType, @NotNull DifficultyLevel difficulty, @Min(1) int baseXp, @Min(1) int sortOrder, boolean published) {}
    public record LessonResponse(Long id, Long unitId, String unitTitle, String title, String description, LessonType lessonType, DifficultyLevel difficulty, int baseXp, int sortOrder, boolean published) {
        static LessonResponse from(Lesson lesson) { return new LessonResponse(lesson.getId(), lesson.getUnit().getId(), lesson.getUnit().getTitle(), lesson.getTitle(), lesson.getDescription(), lesson.getLessonType(), lesson.getDifficulty(), lesson.getBaseXp(), lesson.getSortOrder(), lesson.isPublished()); }
    }

    public record ExerciseRequest(@NotNull LessonType exerciseType, @NotBlank @Size(max = 500) String prompt, @NotBlank @Size(max = 255) String correctAnswer, @Min(1) int displayOrder) {}
    public record ExerciseResponse(Long id, Long lessonId, LessonType exerciseType, String prompt, String correctAnswer, int displayOrder) {
        static ExerciseResponse from(Exercise exercise) { return new ExerciseResponse(exercise.getId(), exercise.getLesson().getId(), exercise.getExerciseType(), exercise.getPrompt(), exercise.getCorrectAnswer(), exercise.getDisplayOrder()); }
    }

    public record CompleteLessonRequest(@NotNull Long childId, @DecimalMin("0.60") @DecimalMax("1.0") double accuracy, @Min(1) long durationSeconds) {}
    public record CompletionResponse(Long completionId, int xpEarned, int stars, List<String> newBadges, String message) {}
}
