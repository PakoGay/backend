package com.example.literacy.admin;

import com.example.literacy.admin.model.AdminActivityLog;
import com.example.literacy.admin.repository.AdminActivityLogRepository;
import com.example.literacy.auth.model.UserAccount;
import com.example.literacy.auth.model.UserRole;
import com.example.literacy.auth.repository.UserAccountRepository;
import com.example.literacy.child.repository.ChildProfileRepository;
import com.example.literacy.curriculum.repository.CurriculumUnitRepository;
import com.example.literacy.curriculum.repository.LessonRepository;
import com.example.literacy.gamification.repository.LessonCompletionRepository;
import com.example.literacy.common.api.PageResponse;
import java.time.OffsetDateTime;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AdminService {

    private final AdminActivityLogRepository adminActivityLogRepository;
    private final UserAccountRepository userAccountRepository;
    private final ChildProfileRepository childProfileRepository;
    private final LessonCompletionRepository lessonCompletionRepository;
    private final CurriculumUnitRepository curriculumUnitRepository;
    private final LessonRepository lessonRepository;

    public AdminService(AdminActivityLogRepository adminActivityLogRepository,
                        UserAccountRepository userAccountRepository,
                        ChildProfileRepository childProfileRepository,
                        LessonCompletionRepository lessonCompletionRepository,
                        CurriculumUnitRepository curriculumUnitRepository,
                        LessonRepository lessonRepository) {
        this.adminActivityLogRepository = adminActivityLogRepository;
        this.userAccountRepository = userAccountRepository;
        this.childProfileRepository = childProfileRepository;
        this.lessonCompletionRepository = lessonCompletionRepository;
        this.curriculumUnitRepository = curriculumUnitRepository;
        this.lessonRepository = lessonRepository;
    }

    public void log(UserAccount admin, String action, String entityType, Long entityId, String details) {
        AdminActivityLog log = new AdminActivityLog();
        log.setAdmin(admin);
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setDetails(details);
        adminActivityLogRepository.save(log);
    }

    public PageResponse<AdminActivityLog> logs(int page, int size) {
        return PageResponse.from(adminActivityLogRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size)));
    }

    public Stats stats() {
        OffsetDateTime startOfDay = OffsetDateTime.now().minusHours(24);
        OffsetDateTime weekStart = OffsetDateTime.now().minusDays(7);
        long parents = userAccountRepository.countByRole(UserRole.PARENT);
        long admins = userAccountRepository.countByRole(UserRole.ADMIN);
        long children = childProfileRepository.count();
        long activeLearnersToday = childProfileRepository.countByLastActiveAtAfter(startOfDay);
        long lessonsCompletedThisWeek = lessonCompletionRepository.countByCompletedAtBetween(weekStart, OffsetDateTime.now());
        long publishedUnits = curriculumUnitRepository.countByPublishedTrue();
        long publishedLessons = lessonRepository.countByPublishedTrue();
        return new Stats(parents, admins, children, activeLearnersToday, lessonsCompletedThisWeek, publishedUnits, publishedLessons);
    }

    public record Stats(long totalParents, long totalAdmins, long totalChildren, long activeLearnersToday,
                        long lessonsCompletedThisWeek, long publishedUnits, long publishedLessons) {}
}
