package com.foodgo.repository;

import com.foodgo.model.ChangePasswordToken;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.Optional;

public interface ChangePasswordRepository extends JpaRepository<ChangePasswordToken,Long> {
    void deleteByUserId(Long userId);

    Optional<ChangePasswordToken> findByUserIdAndToken(Long userId, String token);

    @Transactional
    @Modifying
    @Query("DELETE FROM ChangePasswordToken t WHERE t.expiryDate <= :now")
    void deleteExpiredTokens(LocalDateTime now);
}
