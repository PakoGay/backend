package com.example.literacy.child.model;

import com.example.literacy.auth.model.UserAccount;
import com.example.literacy.common.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "children")
public class ChildProfile extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "parent_id", nullable = false)
    private UserAccount parent;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false)
    private int age;

    @Column(nullable = false, length = 100)
    private String avatar;

    @Column(nullable = false)
    private int startingLevel;

    @Column(nullable = false)
    private int currentLevel = 1;

    @Column(nullable = false)
    private int xp = 0;

    @Column(nullable = false)
    private int dailyStreak = 0;

    @Column(nullable = false)
    private int progressPercent = 0;

    private LocalDate lastLessonCompletedOn;

    private OffsetDateTime lastActiveAt;

    public UserAccount getParent() { return parent; }
    public void setParent(UserAccount parent) { this.parent = parent; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public int getStartingLevel() { return startingLevel; }
    public void setStartingLevel(int startingLevel) { this.startingLevel = startingLevel; }
    public int getCurrentLevel() { return currentLevel; }
    public void setCurrentLevel(int currentLevel) { this.currentLevel = currentLevel; }
    public int getXp() { return xp; }
    public void setXp(int xp) { this.xp = xp; }
    public int getDailyStreak() { return dailyStreak; }
    public void setDailyStreak(int dailyStreak) { this.dailyStreak = dailyStreak; }
    public int getProgressPercent() { return progressPercent; }
    public void setProgressPercent(int progressPercent) { this.progressPercent = progressPercent; }
    public LocalDate getLastLessonCompletedOn() { return lastLessonCompletedOn; }
    public void setLastLessonCompletedOn(LocalDate lastLessonCompletedOn) { this.lastLessonCompletedOn = lastLessonCompletedOn; }
    public OffsetDateTime getLastActiveAt() { return lastActiveAt; }
    public void setLastActiveAt(OffsetDateTime lastActiveAt) { this.lastActiveAt = lastActiveAt; }
}
