package com.foodgo.repository;

import com.foodgo.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByRestaurantId(Long restaurantId);

    List<Rating> findByUserId(Long userId);

    List<Rating> findByRestaurantIdAndUserId(Long restaurantId, Long userId);
}
