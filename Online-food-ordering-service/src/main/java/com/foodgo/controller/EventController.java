package com.foodgo.controller;

import com.foodgo.dto.EventDto;
import com.foodgo.dto.UserDto;
import com.foodgo.mapper.DtoMapper;
import com.foodgo.model.Event;
import com.foodgo.model.User;
import com.foodgo.service.EventService;
import com.foodgo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
    public ResponseEntity<Event> toggleEventFavorite(@PathVariable Long eventId,
                                                     @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Event event = eventService.getEventById(eventId);

        // Kiểm tra xem user đã tham gia event chưa
        if (event.getUsers().contains(user)) {
            // Nếu đã tham gia, gọi removeUserFromEvent
            eventService.removeUserFromEvent(eventId, user.getId());
        } else {
            // Nếu chưa tham gia, gọi addUserToEvent
            eventService.addUserToEvent(eventId, user.getId());
        }

        return new ResponseEntity<>(event, HttpStatus.OK);
    }


    @GetMapping("/favorites")
    public ResponseEntity<List<Event>> getFavoriteEvents(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        List<Event> events = eventService.getFavoriteEvents(user);
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @PutMapping("/{eventId}/toggle-available")
    public ResponseEntity<Event> toggleAvailable(@PathVariable Long eventId,
                                                 @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Event event = eventService.toggleAvailable(eventId); // Toggle trạng thái available của event
        return new ResponseEntity<>(event, HttpStatus.OK);
    }

    @GetMapping("/favorites-of-restaurants")
    public ResponseEntity<List<Event>> getFavoriteEventsOfRestaurantsByUser(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt); // Lấy thông tin user từ jwt
        List<Event> events = eventService.getFavoriteEventsOfRestaurantsByUser(user); // Lấy danh sách sự kiện yêu thích của user
        List<EventDto> eventDtos = new ArrayList<>(); // Tạo danh sách chứa thông tin sự kiện dưới dạng EventDto
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @GetMapping("/{eventId}/users")
    public ResponseEntity<List<UserDto>> getListUserByEventId(@PathVariable Long eventId,
                                                              @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt); // Lấy thông tin user từ jwt
        List<UserDto> users = eventService.getListUserByEventId(eventId); // Lấy danh sách user tham gia event
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/{eventId}/{userId}/is-joined")
    public ResponseEntity<Boolean> isUserJoinedEvent(@PathVariable Long eventId, @PathVariable Long userId,
                                                     @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt); // Lấy thông tin user từ jwt
        boolean result = eventService.isUserJoinedEvent(eventId, userId); // Kiểm tra xem user đã tham gia event chưa
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/{eventId}/check-in")
    public ResponseEntity<List<UserDto>> getListUserCheckInByEventId(@PathVariable Long eventId,
                                                                     @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt); // Lấy thông tin user từ jwt
        List<UserDto> users = eventService.getListUserCheckInByEventId(eventId); // Lấy danh sách user check-in tại event
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/{eventId}/analytics")
    public ResponseEntity<Map<String, Object>> getEventAttendeeAnalytics(@PathVariable Long eventId,
                                                                         @RequestHeader("Authorization") String jwt) {
        try {
            User user = userService.findUserByJwtToken(jwt); // Lấy thông tin user từ jwt
            Map<String, Object> analytics = eventService.getEventAttendeeAnalytics(eventId);
            return new ResponseEntity<>(analytics, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
