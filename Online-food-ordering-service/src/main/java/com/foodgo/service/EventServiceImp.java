package com.foodgo.service;

import com.foodgo.dto.EventDto;
import com.foodgo.model.Event;
import com.foodgo.model.Restaurant;
import com.foodgo.model.User;
import com.foodgo.repository.EventRepository;
import com.foodgo.repository.RestaurantRepository;
import com.foodgo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.chrono.ChronoLocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class EventServiceImp implements EventService{

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private UserRepository userRepository;
    @Override
    public Event createEvent(Long restaurantId, Event event) throws Exception {
        Optional<Restaurant> restaurantOptional = restaurantRepository.findById(restaurantId);
        if (restaurantOptional.isPresent()) {
            Restaurant restaurant = restaurantOptional.get();
            event.setRestaurant(restaurant);
            Event savedEvent = eventRepository.save(event);

            EventDto eventDto = new EventDto();
            eventDto.setId(savedEvent.getId());
            eventDto.setName(savedEvent.getName());
            eventDto.setLocation(savedEvent.getLocation());
            eventDto.setDescription(savedEvent.getDescription());
            eventDto.setStartedAt(savedEvent.getStartedAt());
            eventDto.setEndsAt(savedEvent.getEndsAt());
            eventDto.setImages(savedEvent.getImages());

            restaurant.getEventDto().add(eventDto);
            restaurantRepository.save(restaurant);

            return savedEvent;
        } else {
            throw new Exception("Restaurant not found");
        }
    }

    @Override
    public Event updateEvent(Long eventId, Event event) throws Exception {
        Optional<Event> eventOptional = eventRepository.findById(eventId);
        if (eventOptional.isPresent()) {
            Event existingEvent = eventOptional.get();
            existingEvent.setName(event.getName());
            existingEvent.setLocation(event.getLocation());
            existingEvent.setStartedAt(event.getStartedAt());
            existingEvent.setEndsAt(event.getEndsAt());
            existingEvent.setImages(event.getImages());
            return eventRepository.save(existingEvent);
        } else {
            throw new Exception("Event not found");
        }
    }

    @Override
    public void deleteEvent(Long eventId) throws Exception {
        eventRepository.deleteById(eventId);
    }

    @Override
    public List<Event> getEventsByRestaurant(Long restaurantId) throws Exception {
        return eventRepository.findByRestaurantId(restaurantId);
    }

    @Override
    public Event getEventById(Long eventId) throws Exception {
        Optional<Event> eventOptional = eventRepository.findById(eventId);
        if (eventOptional.isPresent()) {
            return eventOptional.get();
        } else {
            throw new Exception("Event not found");
        }
    }

    @Override
    public EventDto addEventToFavorites(Long eventId, User user) throws Exception {
        Event event = getEventById(eventId); // Lấy event theo id

        EventDto eventDto = new EventDto(); // Tạo đối tượng EventDto
        eventDto.setId(event.getId());
        eventDto.setName(event.getName());
        eventDto.setLocation(event.getLocation());
        eventDto.setDescription(event.getDescription());
        eventDto.setStartedAt(event.getStartedAt());
        eventDto.setEndsAt(event.getEndsAt());
        eventDto.setImages(event.getImages());
        eventDto.setOfRestaurant(event.getRestaurant().getName());

        boolean isFavorite = false; // Khởi tạo biến isFavorite với giá trị false
        List<EventDto> favoriteEvents = user.getEventDtoFavorites(); // Lấy danh sách event yêu thích của người dùng
        for (EventDto favorite : favoriteEvents) { // Duyệt qua danh sách event yêu thích của người dùng
            if (favorite.getId().equals(eventId)) { // Nếu id của event yêu thích trùng với id của event
                isFavorite = true; // Set isFavorite thành true
                break; // Thoát khỏi vòng lặp
            }
        }

        if (isFavorite) { // Nếu event đã được thêm vào danh sách yêu thích
            favoriteEvents.removeIf(favorite -> favorite.getId().equals(eventId)); // Xóa event khỏi danh sách yêu thích của người dùng
        } else { // Nếu event chưa được thêm vào danh sách yêu thích
            favoriteEvents.add(eventDto); // Thêm event vào danh sách yêu thích của người dùng
        }

        userRepository.save(user); // Lưu thông tin người dùng vào database
        return eventDto; // Trả về đối tượng EventDto
    }

    //display những event mà user đã add to favorites có ngày bắt đầu sau ngày hiện tại và ngày kết thúc trước ngày hiện tại và sắp xếp theo thời gian bắt đầu
    @Override
    public List<Event> getFavoriteEvents(User user) throws Exception {
        List<Long> favoriteEventIds = user.getEventDtoFavorites().stream()
                .map(EventDto::getId)
                .collect(Collectors.toList()); // Lấy danh sách id của sự kiện yêu thích
        List<Event> favoriteEvents = new ArrayList<>();

        for (Long eventId : favoriteEventIds) {
            Event event = getEventById(eventId); // Lấy sự kiện theo id
            if (event != null) {
                favoriteEvents.add(event); // Thêm sự kiện vào danh sách yêu thích
            }
        }

        List<Event> result = new ArrayList<>(); // Tạo danh sách kết quả
        ChronoLocalDateTime currentDate = new Date().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime(); // Lấy ngày hiện tại

        for (Event event : favoriteEvents) { // Duyệt qua danh sách sự kiện yêu thích của người dùng
            if (event.getStartedAt().isBefore(currentDate) && event.getEndsAt().isAfter(currentDate)) { // Nếu ngày bắt đầu trước ngày hiện tại và ngày kết thúc sau ngày hiện tại
                result.add(event); // Thêm sự kiện vào danh sách kết quả
            }
        }
        result.sort(Comparator.comparing(Event::getStartedAt)); // Sắp xếp danh sách kết quả theo thời gian bắt đầu
        return result; // Trả về danh sách kết quả
    }
}
