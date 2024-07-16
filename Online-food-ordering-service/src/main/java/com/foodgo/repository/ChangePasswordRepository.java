package com.foodgo.repository;

import com.foodgo.model.ChangePasswordToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChangePasswordRepository extends JpaRepository<ChangePasswordToken,Long> {
    Optional<ChangePasswordToken> findByToken(String token);
    void deleteByUserId(Long userId);
}
