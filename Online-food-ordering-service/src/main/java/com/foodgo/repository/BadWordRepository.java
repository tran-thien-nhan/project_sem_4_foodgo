package com.foodgo.repository;

import com.foodgo.model.BadWord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BadWordRepository extends JpaRepository<BadWord, Long> {
}
