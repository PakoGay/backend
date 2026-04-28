package com.example.literacy.gamification.model;

import com.example.literacy.child.model.ChildProfile;
import com.example.literacy.common.model.BaseEntity;
import com.example.literacy.curriculum.model.Exercise;
import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "exercise_submissions", uniqueConstraints = {
        @UniqueConstraint(name = "uk_exercise_submission_child_exercise", columnNames = {"child_id", "exercise_id"})
})
public class ExerciseSubmission extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "child_id", nullable = false)
    private ChildProfile child;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "exercise_id", nullable = false)
    private Exercise exercise;

    @Column(nullable = false, length = 500)
    private String submittedAnswer;

    @Column(nullable = false)
    private boolean correct;

    @Column(nullable = false)
    private long timeTakenSeconds;

    @Column(nullable = false)
    private OffsetDateTime submittedAt;

    // Getters and Setters
    public ChildProfile getChild() { return child; }
    public void setChild(ChildProfile child) { this.child = child; }
    public Exercise getExercise() { return exercise; }
    public void setExercise(Exercise exercise) { this.exercise = exercise; }
    public String getSubmittedAnswer() { return submittedAnswer; }
    public void setSubmittedAnswer(String submittedAnswer) { this.submittedAnswer = submittedAnswer; }
    public boolean isCorrect() { return correct; }
    public void setCorrect(boolean correct) { this.correct = correct; }
    public long getTimeTakenSeconds() { return timeTakenSeconds; }
    public void setTimeTakenSeconds(long timeTakenSeconds) { this.timeTakenSeconds = timeTakenSeconds; }
    public OffsetDateTime getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(OffsetDateTime submittedAt) { this.submittedAt = submittedAt; }
}