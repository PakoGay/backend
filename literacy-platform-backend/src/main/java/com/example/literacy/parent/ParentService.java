package com.example.literacy.parent;

import com.example.literacy.auth.model.UserAccount;
import com.example.literacy.auth.repository.UserAccountRepository;
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
        return userAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Parent not found"));
    }

    public UserAccount updateMe(UserAccount user, String name, boolean audioEnabled) {
        user.setName(name.trim());
        user.setAudioEnabled(audioEnabled);
        return userAccountRepository.save(user);
    }
}
