package com.example.literacy.auth;

import com.example.literacy.auth.model.RefreshToken;
import com.example.literacy.auth.model.UserAccount;
import com.example.literacy.auth.model.UserRole;
import com.example.literacy.auth.repository.RefreshTokenRepository;
import com.example.literacy.auth.repository.UserAccountRepository;
import com.example.literacy.common.config.AppProperties;
import com.example.literacy.common.exception.BusinessException;
import com.example.literacy.common.exception.ResourceNotFoundException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.OffsetDateTime;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;
    private final AppProperties appProperties;

    public AuthService(UserAccountRepository userAccountRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       PasswordEncoder passwordEncoder,
                       JwtEncoder jwtEncoder,
                       AppProperties appProperties) {
        this.userAccountRepository = userAccountRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtEncoder = jwtEncoder;
        this.appProperties = appProperties;
    }

    public AuthTokens register(String name, String email, String password) {
        if (userAccountRepository.existsByEmailIgnoreCase(email)) {
            throw new BusinessException("Email is already registered");
        }
        UserAccount user = new UserAccount();
        user.setName(name.trim());
        user.setEmail(email.trim().toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(UserRole.PARENT);
        user = userAccountRepository.save(user);
        return issueTokens(user);
    }

    public AuthTokens login(String email, String password) {
        UserAccount user = userAccountRepository.findByEmailIgnoreCase(email.trim())
                .orElseThrow(() -> new BusinessException("Invalid email or password"));
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new BusinessException("Invalid email or password");
        }
        return issueTokens(user);
    }

    public AuthTokens refresh(String refreshToken) {
        String hash = hash(refreshToken);
        RefreshToken stored = refreshTokenRepository.findByTokenHash(hash)
                .orElseThrow(() -> new BusinessException("Refresh token is invalid"));
        if (stored.getExpiresAt().isBefore(OffsetDateTime.now())) {
            refreshTokenRepository.delete(stored);
            throw new BusinessException("Refresh token has expired");
        }
        UserAccount user = stored.getUser();
        refreshTokenRepository.delete(stored);
        return issueTokens(user);
    }

    public void logout(String refreshToken) {
        refreshTokenRepository.deleteByTokenHash(hash(refreshToken));
    }

    public UserAccount getRequiredUser(Long id) {
        return userAccountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private AuthTokens issueTokens(UserAccount user) {
        refreshTokenRepository.deleteAllByUserId(user.getId());
        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime expiresAt = now.plusMinutes(appProperties.getSecurity().getAccessTokenMinutes());

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .subject(user.getEmail())
                .issuedAt(now.toInstant())
                .expiresAt(expiresAt.toInstant())
                .claim("userId", user.getId())
                .claim("roles", List.of(user.getRole().name()))
                .build();

        String accessToken = jwtEncoder.encode(JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS256).build(),
                claims)).getTokenValue();

        String refreshTokenPlain = UUID.randomUUID() + "." + UUID.randomUUID();
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setTokenHash(hash(refreshTokenPlain));
        refreshToken.setExpiresAt(now.plusDays(appProperties.getSecurity().getRefreshTokenDays()));
        refreshTokenRepository.save(refreshToken);

        return new AuthTokens(accessToken, refreshTokenPlain, "Bearer", appProperties.getSecurity().getAccessTokenMinutes() * 60,
                new UserView(user.getId(), user.getName(), user.getEmail(), user.getRole().name(), user.isAudioEnabled()));
    }

    private String hash(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(token.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm is not available", e);
        }
    }

    public record AuthTokens(String accessToken, String refreshToken, String tokenType, long expiresIn, UserView user) {}
    public record UserView(Long id, String name, String email, String role, boolean audioEnabled) {}
}
