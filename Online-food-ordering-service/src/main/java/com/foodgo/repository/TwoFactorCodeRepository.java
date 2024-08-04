package com.foodgo.repository;

import com.foodgo.model.TwoFactorCode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TwoFactorCodeRepository extends JpaRepository<TwoFactorCode, Long> {
}
