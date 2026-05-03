package com.example.literacy.notification;

import com.example.literacy.auth.model.UserAccount;
import com.example.literacy.child.model.ChildProfile;
import com.example.literacy.common.api.PageResponse;
import com.example.literacy.common.exception.ResourceNotFoundException;
import com.example.literacy.notification.model.Notification;
import com.example.literacy.notification.model.NotificationType;
import com.example.literacy.notification.repository.NotificationRepository;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification create(UserAccount parent, ChildProfile child, NotificationType type, String title, String message) {
        Notification notification = new Notification();
        notification.setParent(parent);
        notification.setChild(child);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRead(false);
        return notificationRepository.save(notification);
    }

    public PageResponse<Notification> listForParent(Long parentId, int page, int size) {
        return PageResponse.from(notificationRepository.findByParentIdOrderByCreatedAtDesc(parentId, PageRequest.of(page, size)));
    }

    public Notification markRead(Long parentId, Long notificationId) {
        Notification notification = notificationRepository.findByIdAndParentId(notificationId, parentId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found"));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }

    public boolean alreadyHasStreakRiskToday(Long parentId, Long childId) {
        OffsetDateTime start = LocalDate.now().atStartOfDay().atOffset(OffsetDateTime.now().getOffset());
        OffsetDateTime end = start.plusDays(1);
        return notificationRepository.existsByParentIdAndChildIdAndTypeAndCreatedAtBetween(parentId, childId,
                NotificationType.STREAK_AT_RISK, start, end);
    }
    public boolean alreadyHasWeeklySummaryThisWeek(Long parentId) {
        LocalDate today = LocalDate.now();

        OffsetDateTime start = today
                .minusDays(6)
                .atStartOfDay()
                .atOffset(OffsetDateTime.now().getOffset());

        OffsetDateTime end = today
                .plusDays(1)
                .atStartOfDay()
                .atOffset(OffsetDateTime.now().getOffset());

        return notificationRepository.existsByParentIdAndTypeAndCreatedAtBetween(
                parentId,
                NotificationType.WEEKLY_SUMMARY,
                start,
                end
        );
    }
}
