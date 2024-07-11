package com.foodgo.controller;

import com.foodgo.dto.EventDto;
import com.foodgo.model.Event;
import com.foodgo.model.User;
import com.foodgo.service.EventService;
import com.foodgo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {
    @Autowired
    private EventService eventService;

    @Autowired
    private UserService userService;


    @PostMapping("/restaurant/{restaurantId}")
    public ResponseEntity<Event> createEvent(@PathVariable Long restaurantId, @RequestBody Event event,
                                             @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Event createdEvent = eventService.createEvent(restaurantId, event);
        return new ResponseEntity<>(createdEvent, HttpStatus.CREATED);
    }

    @PutMapping("/{eventId}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long eventId, @RequestBody Event event,
                                             @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Event updatedEvent = eventService.updateEvent(eventId, event);
        return new ResponseEntity<>(updatedEvent, HttpStatus.OK);
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long eventId,
                                            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        eventService.deleteEvent(eventId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Event>> getEventsByRestaurant(@PathVariable Long restaurantId,
                                                             @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        List<Event> events = eventService.getEventsByRestaurant(restaurantId);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<Event> getEventById(@PathVariable Long eventId,
                                              @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Event event = eventService.getEventById(eventId);
        return new ResponseEntity<>(event, HttpStatus.OK);
    }

    @PostMapping("/{eventId}/favorite")
    public ResponseEntity<EventDto> addEventToFavorites(@PathVariable Long eventId,
                                                        @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        EventDto eventDto = eventService.addEventToFavorites(eventId, user);
        return new ResponseEntity<>(eventDto, HttpStatus.OK);
    }

    @GetMapping("/favorites")
    public ResponseEntity<List<Event>> getFavoriteEvents(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        List<Event> events = eventService.getFavoriteEvents(user);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    //toggleAvailable(Long eventId)
    @PutMapping("/{eventId}/toggle-available")
    public ResponseEntity<Event> toggleAvailable(@PathVariable Long eventId,
                                                 @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Event event = eventService.toggleAvailable(eventId);
        return new ResponseEntity<>(event, HttpStatus.OK);
    }

    // getFavoriteEventsOfRestaurantsByUser
    @GetMapping("/favorites-of-restaurants")
    public ResponseEntity<List<Event>> getFavoriteEventsOfRestaurantsByUser(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        List<Event> events = eventService.getFavoriteEventsOfRestaurantsByUser(user);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }
}
