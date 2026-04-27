package com.example.literacy.gamification.model;

import com.example.literacy.child.model.ChildProfile;
import com.example.literacy.common.model.BaseEntity;
import com.example.literacy.curriculum.model.Lesson;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;

@Entity
@Table(name = "lesson_completions")
public class LessonCompletion extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "child_id", nullable = false)
    private ChildProfile child;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(nullable = false)
    private double accuracy;

    @Column(nullable = false)
    private long durationSeconds;

    @Column(nullable = false)
    private int stars;

    @Column(nullable = false)
    private int xpEarned;

    @Column(nullable = false)
    private OffsetDateTime completedAt;

    public ChildProfile getChild() { return child; }
    public void setChild(ChildProfile child) { this.child = child; }
    public Lesson getLesson() { return lesson; }
    public void setLesson(Lesson lesson) { this.lesson = lesson; }
    public double getAccuracy() { return accuracy; }
    public void setAccuracy(double accuracy) { this.accuracy = accuracy; }
    public long getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(long durationSeconds) { this.durationSeconds = durationSeconds; }
    public int getStars() { return stars; }
    public void setStars(int stars) { this.stars = stars; }
    public int getXpEarned() { return xpEarned; }
    public void setXpEarned(int xpEarned) { this.xpEarned = xpEarned; }
    public OffsetDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(OffsetDateTime completedAt) { this.completedAt = completedAt; }
}
