package com.foodgo.service;

import com.foodgo.repository.ChangePasswordRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class TokenCleanUp {

    private final ChangePasswordRepository tokenRepository;

    public TokenCleanUp(ChangePasswordRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    @Scheduled(fixedRate = 1800000)
    public void cleanExpiredTokens() {
        LocalDateTime now = LocalDateTime.now();
        tokenRepository.deleteExpiredTokens(now);
    }
}
