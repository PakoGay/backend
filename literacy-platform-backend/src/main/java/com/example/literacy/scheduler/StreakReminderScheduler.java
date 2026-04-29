package com.example.literacy.scheduler;
import com.example.literacy.child.model.ChildProfile;
import com.example.literacy.child.repository.ChildProfileRepository;
import com.example.literacy.notification.NotificationService;
import com.example.literacy.notification.model.NotificationType;
import java.time.LocalDate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class StreakReminderScheduler {

    private final ChildProfileRepository childProfileRepository;
    private final NotificationService notificationService;

    public StreakReminderScheduler(ChildProfileRepository childProfileRepository, NotificationService notificationService) {
        this.childProfileRepository = childProfileRepository;
        this.notificationService = notificationService;
    }

    @Scheduled(cron = "0 0 8 * * *")
    public void notifyStreakRisk() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        childProfileRepository.findByLastLessonCompletedOn(yesterday).stream()
                .filter(child -> !notificationService.alreadyHasStreakRiskToday(child.getParent().getId(), child.getId()))
                .forEach(child -> notificationService.create(
                        child.getParent(),
                        child,
                        NotificationType.STREAK_AT_RISK,
                        "Streak at risk",
                        child.getName() + " needs one lesson today to keep the streak going."
                ));
    }

    @Transactional
    @Scheduled(cron = "0 5 0 * * *")
    public void resetBrokenStreaks() {
        LocalDate yesterday = LocalDate.now().minusDays(1);
        for (ChildProfile child : childProfileRepository.findByDailyStreakGreaterThanAndLastLessonCompletedOnBefore(0, yesterday)) {
            child.setDailyStreak(0);
            childProfileRepository.save(child);
        }
    }
}