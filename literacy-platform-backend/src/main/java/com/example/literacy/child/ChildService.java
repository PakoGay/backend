package com.example.literacy.child;

import com.example.literacy.auth.model.UserAccount;
import com.example.literacy.auth.model.UserRole;
import com.example.literacy.child.model.ChildProfile;
import com.example.literacy.child.repository.ChildProfileRepository;
import com.example.literacy.common.api.PageResponse;
import com.example.literacy.common.exception.ForbiddenOperationException;
import com.example.literacy.common.exception.ResourceNotFoundException;
import com.example.literacy.common.web.PageUtils;
import com.example.literacy.gamification.model.BadgeAward;
import com.example.literacy.gamification.model.LessonCompletion;
import com.example.literacy.gamification.repository.BadgeAwardRepository;
import com.example.literacy.gamification.repository.ExerciseSubmissionRepository;
import com.example.literacy.gamification.repository.LessonCompletionRepository;
import com.example.literacy.notification.repository.NotificationRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ChildService {

    private final ChildProfileRepository childProfileRepository;
    private final LessonCompletionRepository lessonCompletionRepository;
    private final BadgeAwardRepository badgeAwardRepository;
    private final ExerciseSubmissionRepository exerciseSubmissionRepository;
    private final NotificationRepository notificationRepository;

    public ChildService(
            ChildProfileRepository childProfileRepository,
            LessonCompletionRepository lessonCompletionRepository,
            BadgeAwardRepository badgeAwardRepository,
            ExerciseSubmissionRepository exerciseSubmissionRepository,
            NotificationRepository notificationRepository
    ) {
        this.childProfileRepository = childProfileRepository;
        this.lessonCompletionRepository = lessonCompletionRepository;
        this.badgeAwardRepository = badgeAwardRepository;
        this.exerciseSubmissionRepository = exerciseSubmissionRepository;
        this.notificationRepository = notificationRepository;
    }

    public PageResponse<ChildProfile> myChildren(UserAccount parent, int page, int size) {
        Pageable pageable = PageUtils.pageable(page, size, null);

        if (parent.getRole() == UserRole.ADMIN) {
            return PageResponse.from(childProfileRepository.findAll(pageable));
        }

        ensureParent(parent);

        return PageResponse.from(
                childProfileRepository.findByParentIdOrderByNameAsc(parent.getId(), pageable)
        );
    }

    public PageResponse<ChildProfile> childrenForParent(
            UserAccount currentUser,
            Long parentId,
            int page,
            int size
    ) {
        if (currentUser.getRole() == UserRole.ADMIN || currentUser.getId().equals(parentId)) {
            return PageResponse.from(
                    childProfileRepository.findByParentIdOrderByNameAsc(
                            parentId,
                            PageUtils.pageable(page, size, null)
                    )
            );
        }

        throw new ForbiddenOperationException("You cannot view another parent's children");
    }

    public ChildProfile create(
            UserAccount parent,
            String name,
            int age,
            String avatar,
            int startingLevel
    ) {
        ensureParent(parent);

        ChildProfile child = new ChildProfile();
        child.setParent(parent);
        child.setName(name.trim());
        child.setAge(age);
        child.setAvatar(avatar.trim());
        child.setStartingLevel(startingLevel);
        child.setCurrentLevel(startingLevel);

        return childProfileRepository.save(child);
    }

    public ChildProfile get(UserAccount currentUser, Long childId) {
        return resolveOwned(currentUser, childId);
    }

    public ChildProfile update(
            UserAccount currentUser,
            Long childId,
            String name,
            int age,
            String avatar,
            int startingLevel
    ) {
        ChildProfile child = resolveOwned(currentUser, childId);

        child.setName(name.trim());
        child.setAge(age);
        child.setAvatar(avatar.trim());
        child.setStartingLevel(startingLevel);

        if (child.getCurrentLevel() < startingLevel) {
            child.setCurrentLevel(startingLevel);
        }

        return childProfileRepository.save(child);
    }

    public void delete(UserAccount currentUser, Long childId) {
        ChildProfile child = resolveOwned(currentUser, childId);

        exerciseSubmissionRepository.deleteByChildId(childId);
        lessonCompletionRepository.deleteByChildId(childId);
        badgeAwardRepository.deleteByChildId(childId);
        notificationRepository.deleteByChildId(childId);

        childProfileRepository.delete(child);
    }

    public PageResponse<LessonCompletion> progress(
            UserAccount currentUser,
            Long childId,
            int page,
            int size
    ) {
        ChildProfile child = resolveOwned(currentUser, childId);

        return PageResponse.from(
                lessonCompletionRepository.findByChildIdOrderByCompletedAtDesc(
                        child.getId(),
                        PageUtils.pageable(page, size, null)
                )
        );
    }

    public PageResponse<BadgeAward> badges(
            UserAccount currentUser,
            Long childId,
            int page,
            int size
    ) {
        ChildProfile child = resolveOwned(currentUser, childId);

        return PageResponse.from(
                badgeAwardRepository.findByChildIdOrderByAwardedAtDesc(
                        child.getId(),
                        PageUtils.pageable(page, size, null)
                )
        );
    }

    public PageResponse<ChildProfile> leaderboard(int age, int page, int size) {
        return PageResponse.from(
                childProfileRepository.findByAgeOrderByXpDescNameAsc(
                        age,
                        PageUtils.pageable(page, size, null)
                )
        );
    }

    public ChildProfile resolveOwned(UserAccount currentUser, Long childId) {
        if (currentUser.getRole() == UserRole.ADMIN) {
            return childProfileRepository.findById(childId)
                    .orElseThrow(() -> new ResourceNotFoundException("Child not found"));
        }

        ensureParent(currentUser);

        return childProfileRepository.findByIdAndParentId(childId, currentUser.getId())
                .orElseThrow(() -> new ForbiddenOperationException("You cannot access this child profile"));
    }

    private void ensureParent(UserAccount user) {
        if (user.getRole() != UserRole.PARENT) {
            throw new ForbiddenOperationException("Only parents can manage child profiles");
        }
    }
}