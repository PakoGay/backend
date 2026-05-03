package com.example.literacy.parent;

import com.example.literacy.auth.model.UserAccount;
import com.example.literacy.child.ChildService;
import com.example.literacy.common.api.PageResponse;
import com.example.literacy.security.CurrentUserFacade;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/parents")
@PreAuthorize("hasAnyRole('PARENT','ADMIN')")
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
    public ParentResponse updateMe(@Valid @RequestBody UpdateParentRequest request) {
        UserAccount updated = parentService.updateMe(currentUserFacade.currentUser(), request.name(), request.audioEnabled());
        return ParentResponse.from(updated);
    }

    @GetMapping("/{id}")
    public ParentResponse get(@PathVariable Long id) {
        return ParentResponse.from(parentService.getParent(currentUserFacade.currentUser(), id));
    }

    @PutMapping("/{id}")
    public ParentResponse update(@PathVariable Long id, @Valid @RequestBody UpdateParentRequest request) {
        return ParentResponse.from(parentService.updateParent(currentUserFacade.currentUser(), id, request.name(), request.audioEnabled()));
    }

    @GetMapping("/me/children")
    public PageResponse<ChildSummary> myChildren(@RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(required = false) Integer size,
                                                 @RequestParam(name = "page_size", required = false) Integer pageSize) {
        int resolvedSize = pageSize != null ? pageSize : (size == null ? 20 : size);
        PageResponse<com.example.literacy.child.model.ChildProfile> response = childService.myChildren(currentUserFacade.currentUser(), page, resolvedSize);
        return new PageResponse<>(response.content().stream().map(ChildSummary::from).toList(), response.page(), response.pageSize(), response.total(), response.totalPages());
    }

    @GetMapping("/{id}/children")
    public PageResponse<ChildSummary> children(@PathVariable Long id,
                                               @RequestParam(defaultValue = "0") int page,
                                               @RequestParam(required = false) Integer size,
                                               @RequestParam(name = "page_size", required = false) Integer pageSize) {
        int resolvedSize = pageSize != null ? pageSize : (size == null ? 20 : size);
        PageResponse<com.example.literacy.child.model.ChildProfile> response = childService.childrenForParent(currentUserFacade.currentUser(), id, page, resolvedSize);
        return new PageResponse<>(response.content().stream().map(ChildSummary::from).toList(), response.page(), response.pageSize(), response.total(), response.totalPages());
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
