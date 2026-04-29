package com.example.literacy.child;

import com.example.literacy.auth.model.UserAccount;
import com.example.literacy.auth.model.UserRole;
import com.example.literacy.child.model.ChildProfile;
import com.example.literacy.child.repository.ChildProfileRepository;
import com.example.literacy.common.api.PageResponse;
import com.example.literacy.common.exception.ForbiddenOperationException;
import com.example.literacy.common.exception.ResourceNotFoundException;
import com.example.literacy.gamification.model.BadgeAward;
import com.example.literacy.gamification.model.LessonCompletion;
import com.example.literacy.gamification.repository.BadgeAwardRepository;
import com.example.literacy.gamification.repository.LessonCompletionRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class ChildService {
    private final ChildProfileRepository childProfileRepository;
    private final LessonCompletionRepository lessonCompletionRepository;
    private final BadgeAwardRepository badgeAwardRepository;

    public ChildService(ChildProfileRepository childProfileRepository,
                        LessonCompletionRepository lessonCompletionRepository,
                        BadgeAwardRepository badgeAwardRepository) {
        this.childProfileRepository = childProfileRepository;
        this.lessonCompletionRepository = lessonCompletionRepository;
        this.badgeAwardRepository = badgeAwardRepository;
    }

    public PageResponse<ChildProfile> myChildren(UserAccount parent, int page, int size) {
        if (parent.getRole() == UserRole.ADMIN) {
            return PageResponse.from(childProfileRepository.findAll(PageRequest.of(page, size)));
        }
        return PageResponse.from(childProfileRepository.findByParentIdOrderByNameAsc(parent.getId(), PageRequest.of(page, size)));
    }

    public ChildProfile create(UserAccount parent, String name, int age, String avatar, int startingLevel) {
        ChildProfile child = new ChildProfile();
        child.setParent(parent);
        child.setName(name.trim());
        child.setAge(age);
        child.setAvatar(avatar);
        child.setStartingLevel(startingLevel);
        child.setCurrentLevel(startingLevel);
        return childProfileRepository.save(child);
    }

    public ChildProfile get(UserAccount currentUser, Long childId) {
        return resolveOwned(currentUser, childId);
    }

    public ChildProfile update(UserAccount currentUser, Long childId, String name, int age, String avatar, int startingLevel) {
        ChildProfile child = resolveOwned(currentUser, childId);
        child.setName(name.trim());
        child.setAge(age);
        child.setAvatar(avatar);
        child.setStartingLevel(startingLevel);
        if (child.getCurrentLevel() < startingLevel) child.setCurrentLevel(startingLevel);
        return childProfileRepository.save(child);
    }

    public void delete(UserAccount currentUser, Long childId) {
        childProfileRepository.delete(resolveOwned(currentUser, childId));
    }

    public List<LessonCompletion> progress(UserAccount currentUser, Long childId) {
        ChildProfile child = resolveOwned(currentUser, childId);
        return lessonCompletionRepository.findByChildIdOrderByCompletedAtDesc(child.getId());
    }

    public List<BadgeAward> badges(UserAccount currentUser, Long childId) {
        ChildProfile child = resolveOwned(currentUser, childId);
        return badgeAwardRepository.findByChildIdOrderByAwardedAtDesc(child.getId());
    }

    public PageResponse<ChildProfile> leaderboard(int age, int page, int size) {
        return PageResponse.from(childProfileRepository.findByAgeOrderByXpDescNameAsc(age, PageRequest.of(page, size)));
    }

    public ChildProfile resolveOwned(UserAccount currentUser, Long childId) {
        if (currentUser.getRole() == UserRole.ADMIN) {
            return childProfileRepository.findById(childId).orElseThrow(() -> new ResourceNotFoundException("Child not found"));
        }
        return childProfileRepository.findByIdAndParentId(childId, currentUser.getId())
                .orElseThrow(() -> new ForbiddenOperationException("You cannot access this child profile"));
    }
}