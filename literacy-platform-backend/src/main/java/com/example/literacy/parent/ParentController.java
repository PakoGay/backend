package com.example.literacy.parent;

import com.example.literacy.auth.model.UserAccount;
import com.example.literacy.child.ChildService;
import com.example.literacy.security.CurrentUserFacade;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/parents")
public class ParentController {

    private final ParentService parentService;
    private final ChildService childService;
    private final CurrentUserFacade currentUserFacade;

    public ParentController(ParentService parentService, ChildService childService, CurrentUserFacade currentUserFacade) {
        this.parentService = parentService;
        this.childService = childService;
        this.currentUserFacade = currentUserFacade;
    }

    @GetMapping("/me")
    public ParentResponse me() {
        UserAccount user = parentService.getMe(currentUserFacade.currentUser().getId());
        return ParentResponse.from(user);
    }

    @PutMapping("/me")
    public ParentResponse update(@Valid @RequestBody UpdateParentRequest request) {
        UserAccount updated = parentService.updateMe(currentUserFacade.currentUser(), request.name(), request.audioEnabled());
        return ParentResponse.from(updated);
    }

    @GetMapping("/me/children")
    public List<ChildSummary> myChildren() {
        return childService.myChildren(currentUserFacade.currentUser()).stream().map(ChildSummary::from).toList();
    }

    public record UpdateParentRequest(@NotBlank @Size(max = 120) String name, boolean audioEnabled) {}

    public record ParentResponse(Long id, String name, String email, String role, boolean audioEnabled) {
        static ParentResponse from(UserAccount user) {
            return new ParentResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name(), user.isAudioEnabled());
        }
    }

    public record ChildSummary(Long id, String name, int age, String avatar, int level, int xp, int dailyStreak, int progressPercent) {
        static ChildSummary from(com.example.literacy.child.model.ChildProfile child) {
            return new ChildSummary(child.getId(), child.getName(), child.getAge(), child.getAvatar(), child.getCurrentLevel(), child.getXp(), child.getDailyStreak(), child.getProgressPercent());
        }
    }
}
