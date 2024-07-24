package com.foodgo.service;

import com.foodgo.model.Event;
import com.foodgo.model.User;

import java.util.List;

public interface EventService {
    Event createEvent(Long restaurantId, Event event) throws Exception;
    Event updateEvent(Long eventId, Event event) throws Exception;
    void deleteEvent(Long eventId) throws Exception;
    List<Event> getEventsByRestaurant(Long restaurantId) throws Exception;
    Event getEventById(Long eventId) throws Exception;
    void addUserToEvent(Long eventId, Long userId) throws Exception;
    List<Event> getFavoriteEvents(User user) throws Exception;
    Event toggleAvailable(Long eventId) throws Exception;
    List<Event> getFavoriteEventsOfRestaurantsByUser(User user) throws Exception;
    void removeUserFromEvent(Long eventId, Long userId) throws Exception;
}
