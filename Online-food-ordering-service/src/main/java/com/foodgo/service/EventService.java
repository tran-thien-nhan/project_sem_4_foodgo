package com.foodgo.service;

import com.foodgo.dto.EventDto;
import com.foodgo.model.Event;
import com.foodgo.model.User;

import java.util.List;

public interface EventService {
    public Event createEvent(Long restaurantId, Event event) throws Exception;
    public Event updateEvent(Long eventId, Event event) throws Exception;
    public void deleteEvent(Long eventId) throws Exception;
    public List<Event> getEventsByRestaurant(Long restaurantId) throws Exception;
    public Event getEventById(Long eventId) throws Exception;
    public EventDto addEventToFavorites(Long eventId, User user) throws Exception;
    public List<Event> getFavoriteEvents(User user) throws Exception;
}
