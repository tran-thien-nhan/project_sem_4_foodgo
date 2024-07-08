package com.foodgo.repository;

import com.foodgo.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByRestaurantId(Long restaurantId);

    List<Event> findByRestaurantIdIn(List<Long> favoriteRestaurantIds);
}
