package com.example.literacy.config;

import com.example.literacy.auth.model.UserAccount;
import com.example.literacy.auth.model.UserRole;
import com.example.literacy.auth.repository.UserAccountRepository;
import com.example.literacy.child.model.ChildProfile;
import com.example.literacy.child.repository.ChildProfileRepository;
import com.example.literacy.curriculum.model.CurriculumUnit;
import com.example.literacy.curriculum.model.DifficultyLevel;
import com.example.literacy.curriculum.model.Exercise;
import com.example.literacy.curriculum.model.Lesson;
import com.example.literacy.curriculum.model.LessonType;
import com.example.literacy.curriculum.repository.CurriculumUnitRepository;
import com.example.literacy.curriculum.repository.ExerciseRepository;
import com.example.literacy.curriculum.repository.LessonRepository;
import java.util.List;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

    @Bean
    public ApplicationRunner applicationRunner(UserAccountRepository userAccountRepository,
                                               ChildProfileRepository childProfileRepository,
                                               CurriculumUnitRepository curriculumUnitRepository,
                                               LessonRepository lessonRepository,
                                               ExerciseRepository exerciseRepository,
                                               PasswordEncoder passwordEncoder) {
        return args -> {
            if (userAccountRepository.count() == 0) {
                UserAccount admin = new UserAccount();
                admin.setName("Platform Admin");
                admin.setEmail("admin@literacy.local");
                admin.setPasswordHash(passwordEncoder.encode("Admin123!"));
                admin.setRole(UserRole.ADMIN);
                userAccountRepository.save(admin);

                UserAccount parent = new UserAccount();
                parent.setName("Demo Parent");
                parent.setEmail("parent@literacy.local");
                parent.setPasswordHash(passwordEncoder.encode("Parent123!"));
                parent.setRole(UserRole.PARENT);
                parent = userAccountRepository.save(parent);

                ChildProfile child = new ChildProfile();
                child.setParent(parent);
                child.setName("Lia");
                child.setAge(5);
                child.setAvatar("fox");
                child.setStartingLevel(1);
                child.setCurrentLevel(1);
                childProfileRepository.save(child);
            }

            if (curriculumUnitRepository.count() == 0) {
                CurriculumUnit unit1 = new CurriculumUnit();
                unit1.setTitle("Letters and Sounds");
                unit1.setDescription("Introductory phonics lessons.");
                unit1.setSortOrder(1);
                unit1.setPublished(true);
                unit1 = curriculumUnitRepository.save(unit1);

                CurriculumUnit unit2 = new CurriculumUnit();
                unit2.setTitle("Everyday Words");
                unit2.setDescription("Common sight words and picture vocabulary.");
                unit2.setSortOrder(2);
                unit2.setPublished(true);
                unit2 = curriculumUnitRepository.save(unit2);

                Lesson lesson1 = buildLesson(unit1, "Letter A", "Match the sound and the letter A.", LessonType.PHONICS, DifficultyLevel.EASY, 50, 1, true);
                Lesson lesson2 = buildLesson(unit1, "Letter B", "Practice the letter B sound.", LessonType.PHONICS, DifficultyLevel.EASY, 50, 2, true);
                Lesson lesson3 = buildLesson(unit2, "Apple and Ball", "Match common words to pictures.", LessonType.VOCABULARY, DifficultyLevel.EASY, 60, 1, true);
                lessonRepository.saveAll(List.of(lesson1, lesson2, lesson3));

                exerciseRepository.save(buildExercise(lesson1, LessonType.PHONICS, "Tap the letter that makes the /a/ sound.", "A", 1));
                exerciseRepository.save(buildExercise(lesson1, LessonType.PHONICS, "Choose the uppercase A.", "A", 2));
                exerciseRepository.save(buildExercise(lesson2, LessonType.PHONICS, "Tap the letter that makes the /b/ sound.", "B", 1));
                exerciseRepository.save(buildExercise(lesson3, LessonType.VOCABULARY, "Which picture is an apple?", "apple", 1));
            }
        };
    }

    private Lesson buildLesson(CurriculumUnit unit, String title, String description, LessonType type, DifficultyLevel difficulty, int baseXp, int sortOrder, boolean published) {
        Lesson lesson = new Lesson();
        lesson.setUnit(unit);
        lesson.setTitle(title);
        lesson.setDescription(description);
        lesson.setLessonType(type);
        lesson.setDifficulty(difficulty);
        lesson.setBaseXp(baseXp);
        lesson.setSortOrder(sortOrder);
        lesson.setPublished(published);
        return lesson;
    }

    private Exercise buildExercise(Lesson lesson, LessonType type, String prompt, String correctAnswer, int displayOrder) {
        Exercise exercise = new Exercise();
        exercise.setLesson(lesson);
        exercise.setExerciseType(type);
        exercise.setPrompt(prompt);
        exercise.setCorrectAnswer(correctAnswer);
        exercise.setDisplayOrder(displayOrder);
        return exercise;
    }
}
