package com.example.literacy.curriculum;

import com.example.literacy.admin.AdminService;
import com.example.literacy.auth.model.UserAccount;
import com.example.literacy.auth.model.UserRole;
import com.example.literacy.common.api.PageResponse;
import com.example.literacy.common.exception.BusinessException;
import com.example.literacy.common.exception.ResourceNotFoundException;
import com.example.literacy.common.web.PageUtils;
import com.example.literacy.curriculum.model.CurriculumUnit;
import com.example.literacy.curriculum.model.DifficultyLevel;
import com.example.literacy.curriculum.model.Exercise;
import com.example.literacy.curriculum.model.Lesson;
import com.example.literacy.curriculum.model.LessonType;
import com.example.literacy.curriculum.repository.CurriculumUnitRepository;
import com.example.literacy.curriculum.repository.ExerciseRepository;
import com.example.literacy.curriculum.repository.LessonRepository;
import java.util.List;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CurriculumService {

    private final CurriculumUnitRepository curriculumUnitRepository;
    private final LessonRepository lessonRepository;
    private final ExerciseRepository exerciseRepository;
    private final AdminService adminService;

    public CurriculumService(CurriculumUnitRepository curriculumUnitRepository,
                             LessonRepository lessonRepository,
                             ExerciseRepository exerciseRepository,
                             AdminService adminService) {
        this.curriculumUnitRepository = curriculumUnitRepository;
        this.lessonRepository = lessonRepository;
        this.exerciseRepository = exerciseRepository;
        this.adminService = adminService;
    }

    public List<CurriculumUnit> listUnits(boolean admin) {
        return admin ? curriculumUnitRepository.findAllByOrderBySortOrderAsc() : curriculumUnitRepository.findAllByPublishedTrueOrderBySortOrderAsc();
    }

    public CurriculumUnit getVisibleUnit(Long id, UserAccount user) {
        CurriculumUnit unit = getUnit(id);
        if (!unit.isPublished() && user.getRole() != UserRole.ADMIN) {
            throw new ResourceNotFoundException("Unit not found");
        }
        return unit;
    }

    public Lesson getVisibleLesson(Long id, UserAccount user) {
        Lesson lesson = getLesson(id);
        if ((!lesson.isPublished() || !lesson.getUnit().isPublished()) && user.getRole() != UserRole.ADMIN) {
            throw new ResourceNotFoundException("Lesson not found");
        }
        return lesson;
    }

    public CurriculumUnit createUnit(UserAccount admin, String title, String description, int sortOrder, boolean published) {
        CurriculumUnit unit = new CurriculumUnit();
        unit.setTitle(title.trim());
        unit.setDescription(description.trim());
        unit.setSortOrder(sortOrder);
        unit.setPublished(published);
        unit = curriculumUnitRepository.save(unit);
        adminService.log(admin, "CREATE", "UNIT", unit.getId(), title);
        return unit;
    }

    public CurriculumUnit updateUnit(UserAccount admin, Long id, String title, String description, int sortOrder, boolean published) {
        CurriculumUnit unit = getUnit(id);
        unit.setTitle(title.trim());
        unit.setDescription(description.trim());
        unit.setSortOrder(sortOrder);
        unit.setPublished(published);
        unit = curriculumUnitRepository.save(unit);
        adminService.log(admin, "UPDATE", "UNIT", unit.getId(), title);
        return unit;
    }

    public void deleteUnit(UserAccount admin, Long id) {
        CurriculumUnit unit = getUnit(id);
        curriculumUnitRepository.delete(unit);
        adminService.log(admin, "DELETE", "UNIT", id, unit.getTitle());
    }

    public PageResponse<Lesson> lessons(Long unitId, LessonType lessonType, DifficultyLevel difficulty, Boolean published, int page, int size, String sort) {
        return PageResponse.from(lessonRepository.search(unitId, lessonType, difficulty, published, PageUtils.pageable(page, size, null, lessonSort(sort))));
    }

    private Sort lessonSort(String sort) {
        if (sort == null || sort.isBlank()) {
            return Sort.by(Sort.Order.asc("unit.sortOrder"), Sort.Order.asc("sortOrder"));
        }
        boolean desc = sort.startsWith("-");
        String field = desc ? sort.substring(1) : sort;
        String property = switch (field) {
            case "title" -> "title";
            case "difficulty" -> "difficulty";
            case "baseXp" -> "baseXp";
            case "createdAt" -> "createdAt";
            case "sortOrder" -> "sortOrder";
            default -> throw new IllegalArgumentException("Unsupported lesson sort field: " + field);
        };
        return Sort.by(desc ? Sort.Order.desc(property) : Sort.Order.asc(property));
    }

    public Lesson createLesson(UserAccount admin, Long unitId, String title, String description, LessonType lessonType,
                               DifficultyLevel difficulty, int baseXp, int sortOrder, boolean published) {
        CurriculumUnit unit = getUnit(unitId);
        Lesson lesson = new Lesson();
        lesson.setUnit(unit);
        lesson.setTitle(title.trim());
        lesson.setDescription(description.trim());
        lesson.setLessonType(lessonType);
        lesson.setDifficulty(difficulty);
        lesson.setBaseXp(baseXp);
        lesson.setSortOrder(sortOrder);
        lesson.setPublished(published);
        lesson = lessonRepository.save(lesson);
        adminService.log(admin, "CREATE", "LESSON", lesson.getId(), title);
        return lesson;
    }

    public Lesson updateLesson(UserAccount admin, Long lessonId, Long unitId, String title, String description, LessonType lessonType,
                               DifficultyLevel difficulty, int baseXp, int sortOrder, boolean published) {
        Lesson lesson = getLesson(lessonId);
        lesson.setUnit(getUnit(unitId));
        lesson.setTitle(title.trim());
        lesson.setDescription(description.trim());
        lesson.setLessonType(lessonType);
        lesson.setDifficulty(difficulty);
        lesson.setBaseXp(baseXp);
        lesson.setSortOrder(sortOrder);
        lesson.setPublished(published);
        lesson = lessonRepository.save(lesson);
        adminService.log(admin, "UPDATE", "LESSON", lesson.getId(), title);
        return lesson;
    }

    public void deleteLesson(UserAccount admin, Long lessonId) {
        Lesson lesson = getLesson(lessonId);
        lessonRepository.delete(lesson);
        adminService.log(admin, "DELETE", "LESSON", lessonId, lesson.getTitle());
    }

    public PageResponse<Exercise> exercises(Long lessonId, UserAccount user, int page, int size) {
        getVisibleLesson(lessonId, user);
        return PageResponse.from(exerciseRepository.findByLessonIdOrderByDisplayOrderAsc(lessonId, PageUtils.pageable(page, size, null)));
    }

    public Exercise createExercise(UserAccount admin, Long lessonId, LessonType exerciseType, String prompt, String correctAnswer, int displayOrder) {
        Exercise exercise = new Exercise();
        exercise.setLesson(getLesson(lessonId));
        exercise.setExerciseType(exerciseType);
        exercise.setPrompt(prompt.trim());
        exercise.setCorrectAnswer(correctAnswer.trim());
        exercise.setDisplayOrder(displayOrder);
        exercise = exerciseRepository.save(exercise);
        adminService.log(admin, "CREATE", "EXERCISE", exercise.getId(), prompt);
        return exercise;
    }

    public Exercise updateExercise(UserAccount admin, Long exerciseId, LessonType exerciseType, String prompt, String correctAnswer, int displayOrder) {
        Exercise exercise = exerciseRepository.findById(exerciseId).orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));
        exercise.setExerciseType(exerciseType);
        exercise.setPrompt(prompt.trim());
        exercise.setCorrectAnswer(correctAnswer.trim());
        exercise.setDisplayOrder(displayOrder);
        exercise = exerciseRepository.save(exercise);
        adminService.log(admin, "UPDATE", "EXERCISE", exercise.getId(), prompt);
        return exercise;
    }

    public void deleteExercise(UserAccount admin, Long exerciseId) {
        Exercise exercise = exerciseRepository.findById(exerciseId).orElseThrow(() -> new ResourceNotFoundException("Exercise not found"));
        exerciseRepository.delete(exercise);
        adminService.log(admin, "DELETE", "EXERCISE", exerciseId, exercise.getPrompt());
    }

    public Lesson getLesson(Long id) {
        return lessonRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Lesson not found"));
    }

    public List<Lesson> publishedLessonsInUnit(Long unitId) {
        return lessonRepository.findByUnitIdAndPublishedTrueOrderBySortOrderAsc(unitId);
    }

    public CurriculumUnit getUnit(Long id) {
        return curriculumUnitRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Unit not found"));
    }

    public void ensureLessonUnlocked(Long childId, Lesson lesson, boolean previousPublishedLessonCompleted) {
        List<Lesson> publishedLessons = lessonRepository.findByUnitIdAndPublishedTrueOrderBySortOrderAsc(lesson.getUnit().getId());
        if (publishedLessons.isEmpty()) {
            throw new BusinessException("The unit has no published lessons");
        }
        Lesson first = publishedLessons.getFirst();
        if (first.getId().equals(lesson.getId())) {
            return;
        }
        boolean lessonIsPublishedInSequence = publishedLessons.stream().anyMatch(l -> l.getId().equals(lesson.getId()));
        if (!lessonIsPublishedInSequence || !previousPublishedLessonCompleted) {
            throw new BusinessException("Lesson is locked until the previous published lesson is completed");
        }
    }
}
