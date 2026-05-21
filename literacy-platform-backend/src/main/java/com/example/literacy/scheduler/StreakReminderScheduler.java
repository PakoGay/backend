package com.example.literacy.scheduler;

import com.example.literacy.auth.model.UserAccount;
import com.example.literacy.child.repository.ChildProfileRepository;
import com.example.literacy.notification.NotificationService;
import com.example.literacy.notification.model.NotificationType;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class StreakReminderScheduler {

    private final ChildProfileRepository childProfileRepository;
    private final NotificationService notificationService;

    public StreakReminderScheduler(ChildProfileRepository childProfileRepository,
                                   NotificationService notificationService) {
        this.childProfileRepository = childProfileRepository;
        this.notificationService = notificationService;
    }

    @Transactional
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
        childProfileRepository.resetDailyStreaksBefore(0, yesterday);
    }

    @Transactional
    @Scheduled(cron = "0 30 9 * * MON")
    public void sendWeeklyProgressSummaries() {
        OffsetDateTime end = OffsetDateTime.now();
        OffsetDateTime start = end.minusDays(7);

        childProfileRepository.summarizeWeeklyCompletionsByParent(start, end).forEach(summary -> {
            UserAccount parent = (UserAccount) summary[0];
            Long completions = (Long) summary[1];

            if (!notificationService.alreadyHasWeeklySummaryThisWeek(parent.getId())) {
                notificationService.create(
                        parent,
                        null,
                        NotificationType.WEEKLY_SUMMARY,
                        "Weekly learning summary",
                        "Your children completed " + completions + " lesson(s) this week."
                );
            }
        });
    }
}
