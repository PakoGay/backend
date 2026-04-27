package com.example.literacy.security;

import com.example.literacy.auth.model.UserAccount;
import com.example.literacy.auth.repository.UserAccountRepository;
import com.example.literacy.common.exception.ResourceNotFoundException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserFacade {

    private final UserAccountRepository userAccountRepository;

    public CurrentUserFacade(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    public UserAccount currentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (!(principal instanceof Jwt jwt)) {
            throw new ResourceNotFoundException("Authenticated user not found");
        }
        return userAccountRepository.findByEmailIgnoreCase(jwt.getSubject())
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found"));
    }
}
