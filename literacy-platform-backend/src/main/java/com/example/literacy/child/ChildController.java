package com.example.literacy.child;

import com.example.literacy.common.api.PageResponse;
import com.example.literacy.gamification.model.BadgeAward;
import com.example.literacy.gamification.model.LessonCompletion;
import com.example.literacy.security.CurrentUserFacade;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.springframework.http.HttpStatus;
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
public class ChildController {
    private final ChildService childService;
    private final CurrentUserFacade currentUserFacade;
    public ChildController(ChildService childService, CurrentUserFacade currentUserFacade) {
        this.childService = childService;
        this.currentUserFacade = currentUserFacade;
    }
    @GetMapping("/children")
    public List<ChildResponse> myChildren() {
        return childService.myChildren(currentUserFacade.currentUser()).stream().map(ChildResponse::from).toList();
    }

    @PostMapping("/children")
    @ResponseStatus(HttpStatus.CREATED)
    public ChildResponse create(@Valid @RequestBody ChildRequest request) {
        return ChildResponse.from(childService.create(currentUserFacade.currentUser(), request.name(), request.age(), request.avatar(), request.startingLevel()));
    }

    @GetMapping("/children/{id}")
    public ChildResponse get(@PathVariable Long id) {
        return ChildResponse.from(childService.get(currentUserFacade.currentUser(), id));
    }

    @PutMapping("/children/{id}")
    public ChildResponse update(@PathVariable Long id, @Valid @RequestBody ChildRequest request) {
        return ChildResponse.from(childService.update(currentUserFacade.currentUser(), id, request.name(), request.age(), request.avatar(), request.startingLevel()));
    }

    @DeleteMapping("/children/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        childService.delete(currentUserFacade.currentUser(), id);
    }

    @GetMapping("/children/{id}/progress")
    public List<ProgressResponse> progress(@PathVariable Long id) {
        return childService.progress(currentUserFacade.currentUser(), id).stream().map(ProgressResponse::from).toList();
    }

    @GetMapping("/children/{id}/badges")
    public List<BadgeResponse> badges(@PathVariable Long id) {
        return childService.badges(currentUserFacade.currentUser(), id).stream().map(BadgeResponse::from).toList();
    }

    @GetMapping("/leaderboard")
    public PageResponse<LeaderboardEntry> leaderboard(@RequestParam int age,
                                                      @RequestParam(defaultValue = "0") int page,
                                                      @RequestParam(defaultValue = "10") int size) {
        PageResponse<com.example.literacy.child.model.ChildProfile> response = childService.leaderboard(age, page, size);
        return new PageResponse<>(response.content().stream().map(LeaderboardEntry::from).toList(), response.page(), response.size(), response.totalElements(), response.totalPages());
    }

    public record ChildRequest(
            @NotBlank @Size(max = 120) String name,
            @Min(3) @Max(8) int age,
            @NotBlank @Size(max = 100) String avatar,
            @Min(1) @Max(20) int startingLevel
    ) {}

    public record ChildResponse(Long id, String name, int age, String avatar, int startingLevel, int currentLevel, int xp, int dailyStreak, int progressPercent) {
        static ChildResponse from(com.example.literacy.child.model.ChildProfile child) {
            return new ChildResponse(child.getId(), child.getName(), child.getAge(), child.getAvatar(), child.getStartingLevel(), child.getCurrentLevel(), child.getXp(), child.getDailyStreak(), child.getProgressPercent());
        }
    }

    public record ProgressResponse(Long completionId, Long lessonId, String lessonTitle, double accuracy, long durationSeconds, int stars, int xpEarned, java.time.OffsetDateTime completedAt) {
        static ProgressResponse from(LessonCompletion completion) {
            return new ProgressResponse(completion.getId(), completion.getLesson().getId(), completion.getLesson().getTitle(), completion.getAccuracy(), completion.getDurationSeconds(), completion.getStars(), completion.getXpEarned(), completion.getCompletedAt());
        }
    }

    public record BadgeResponse(String code, String title, String description, java.time.OffsetDateTime awardedAt) {
        static BadgeResponse from(BadgeAward badge) {
            return new BadgeResponse(badge.getCode(), badge.getTitle(), badge.getDescription(), badge.getAwardedAt());
        }
    }

    public record LeaderboardEntry(Long childId, String displayName, int age, int xp, int level) {
        static LeaderboardEntry from(com.example.literacy.child.model.ChildProfile child) {
            String display = child.getName().length() <= 1 ? child.getName() : child.getName().charAt(0) + "***";
            return new LeaderboardEntry(child.getId(), display, child.getAge(), child.getXp(), child.getCurrentLevel());
        }
    }
}
