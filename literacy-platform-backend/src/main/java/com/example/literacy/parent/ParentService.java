package com.example.literacy.parent;

import com.example.literacy.auth.model.UserAccount;
import com.example.literacy.auth.model.UserRole;
import com.example.literacy.auth.repository.UserAccountRepository;
import com.example.literacy.common.exception.ForbiddenOperationException;
import com.example.literacy.common.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ParentService {

    private final UserAccountRepository userAccountRepository;

    public ParentService(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    public UserAccount getMe(Long id) {
        return getParentById(id);
    }

    public UserAccount getParent(UserAccount currentUser, Long id) {
        if (currentUser.getRole() == UserRole.ADMIN || currentUser.getId().equals(id)) {
            return getParentById(id);
        }
        throw new ForbiddenOperationException("You cannot access another parent's profile");
    }

    public UserAccount updateParent(UserAccount currentUser, Long id, String name, boolean audioEnabled) {
        UserAccount target = getParent(currentUser, id);
        target.setName(name.trim());
        target.setAudioEnabled(audioEnabled);
        return userAccountRepository.save(target);
    }

    public UserAccount updateMe(UserAccount user, String name, boolean audioEnabled) {
        if (user.getRole() != UserRole.PARENT) {
            throw new ForbiddenOperationException("Only parents can update parent profile settings");
        }
        user.setName(name.trim());
        user.setAudioEnabled(audioEnabled);
        return userAccountRepository.save(user);
    }

    private UserAccount getParentById(Long id) {
        UserAccount user = userAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parent not found"));
        if (user.getRole() != UserRole.PARENT) {
            throw new ResourceNotFoundException("Parent not found");
        }
        return user;
    }
}
