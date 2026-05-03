package com.example.literacy.notification;

import com.example.literacy.common.api.PageResponse;
import com.example.literacy.notification.model.Notification;
import com.example.literacy.security.CurrentUserFacade;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/notifications")
@PreAuthorize("hasRole('PARENT')")
public class NotificationController {

    private final NotificationService notificationService;
    private final CurrentUserFacade currentUserFacade;

    public NotificationController(NotificationService notificationService, CurrentUserFacade currentUserFacade) {
        this.notificationService = notificationService;
        this.currentUserFacade = currentUserFacade;
    }

    @GetMapping
    public PageResponse<NotificationResponse> notifications(@RequestParam(defaultValue = "0") int page,
                                                            @RequestParam(required = false) Integer size,
                                                            @RequestParam(name = "page_size", required = false) Integer pageSize) {
        int resolvedSize = pageSize != null ? pageSize : (size == null ? 20 : size);
        PageResponse<Notification> response = notificationService.listForParent(currentUserFacade.currentUser().getId(), page, resolvedSize);
        return new PageResponse<>(response.content().stream().map(NotificationResponse::from).toList(), response.page(), response.pageSize(), response.total(), response.totalPages());
    }

    @PatchMapping("/{id}")
    public NotificationResponse patchRead(@PathVariable Long id) {
        return NotificationResponse.from(notificationService.markRead(currentUserFacade.currentUser().getId(), id));
    }

    @PatchMapping("/{id}/read")
    public NotificationResponse markRead(@PathVariable Long id) {
        return patchRead(id);
    }

    public record NotificationResponse(Long id, String type, String title, String message, boolean isRead, java.time.OffsetDateTime createdAt) {
        static NotificationResponse from(Notification notification) {
            return new NotificationResponse(notification.getId(), notification.getType().name(), notification.getTitle(), notification.getMessage(), notification.isRead(), notification.getCreatedAt());
        }
    }
}
