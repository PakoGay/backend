package com.example.literacy.notification.repository;

import com.example.literacy.notification.model.Notification;
import com.example.literacy.notification.model.NotificationType;
import java.time.OffsetDateTime;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    Page<Notification> findByParentIdOrderByCreatedAtDesc(Long parentId, Pageable pageable);

    Optional<Notification> findByIdAndParentId(Long id, Long parentId);

    boolean existsByParentIdAndChildIdAndTypeAndCreatedAtBetween(
            Long parentId,
            Long childId,
            NotificationType type,
            OffsetDateTime start,
            OffsetDateTime end
    );

    boolean existsByParentIdAndTypeAndCreatedAtBetween(
            Long parentId,
            NotificationType type,
            OffsetDateTime start,
            OffsetDateTime end
    );
    void deleteByChildId(Long childId);
}