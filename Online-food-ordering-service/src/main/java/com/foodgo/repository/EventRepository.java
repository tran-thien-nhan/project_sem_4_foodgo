package com.foodgo.repository;

import com.foodgo.model.Event;
import com.foodgo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByRestaurantId(Long restaurantId);

    List<Event> findByRestaurantIdIn(List<Long> favoriteRestaurantIds);

    @Query("SELECT DISTINCT u FROM User u JOIN u.events e WHERE e.id = ?1")
    List<User> getListUserByEventId(Long eventId);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM User u JOIN u.events e WHERE e.id = ?1 AND u.id = ?2")
    boolean checkIfUserJoinedEvent(Long eventId, Long userId);
}
