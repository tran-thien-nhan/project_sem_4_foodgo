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

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private EmailService emailService;
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
            eventDto.setOfRestaurant(savedEvent.getRestaurant().getName());
            eventDto.setEventLimit(savedEvent.getEventLimit());

            restaurant.getEventDto().add(eventDto);
            restaurantRepository.save(restaurant);

            if(!event.isEmailSentNewEvent()){
                //lọc ra những mail của user đã thêm nhà hàng chứng event trên vào danh sáhc yêu thích
                List<String> emails = userRepository.findAll().stream()
                        .filter(user -> user.getFavorites().stream().anyMatch(restaurantDto -> restaurantDto.getId().equals(restaurantId)))
                        .map(User::getEmail)
                        .collect(Collectors.toList());
                emailService.sendMailEvent(emails, savedEvent);
                savedEvent.setEmailSentNewEvent(true);
                eventRepository.save(savedEvent);
            }

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
            existingEvent.setDescription(event.getDescription());
            existingEvent.setEventLimit(event.getEventLimit());

            Event updatedEvent = eventRepository.save(existingEvent);
            updateEventDtoForUsers(updatedEvent);
            return updatedEvent;
        } else {
            throw new Exception("Event not found");
        }
    }

    @Override
    public void deleteEvent(Long eventId) throws Exception {
        Event event = getEventById(eventId);    // Lấy sự kiện theo id
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
        eventDto.setEventLimit(event.getEventLimit());
        eventDto.setIsAvailable(event.isAvailable());
        eventDto.setIsFull(event.isFull());

        List<EventDto> favoriteEvents = user.getEventDtoFavorites(); // Lấy danh sách event yêu thích của người dùng
        boolean isFavorite = favoriteEvents.stream().anyMatch(favorite -> favorite.getId().equals(eventId)); // Kiểm tra xem event đã có trong danh sách yêu thích chưa

        if (isFavorite) { // Nếu event đã được thêm vào danh sách yêu thích
            boolean removed = favoriteEvents.removeIf(favorite -> favorite.getId().equals(eventId)); // Xóa event khỏi danh sách yêu thích của người dùng
            if (removed) { // Nếu event thực sự bị xóa
                if(event.getTotalFavorites() > 0){ // Kiểm tra xem số lượng yêu thích của event có lớn hơn 0 không
                    event.setTotalFavorites(event.getTotalFavorites() - 1); // Giảm số lượng yêu thích của event xuống 1 nếu event thực sự bị xóa
                    // set is Full
                    if(event.getTotalFavorites() >= event.getEventLimit()){
                        event.setFull(true);
                    }
                    else{
                        event.setFull(false);
                    }
                }
                else{ // Nếu số lượng yêu thích của event bằng 0
                    event.setTotalFavorites(0);
                    event.setFull(false);
                }
            }
            user.setEventDtoFavorites(favoriteEvents);
        } else { // Nếu event chưa được thêm vào danh sách yêu thích

            if (event.isFull()){
                throw new Exception("Event is full");
            }

            favoriteEvents.add(eventDto); // Thêm event vào danh sách yêu thích của người dùng
            event.setTotalFavorites(event.getTotalFavorites() + 1); // Tăng số lượng yêu thích của event lên 1
            user.setEventDtoFavorites(favoriteEvents);
        }

        eventRepository.save(event); // Lưu thông tin event vào database
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
            updateEventDtoForUsers(event);
            if (event != null) { // Nếu sự kiện tồn tại
                if(event.getTotalFavorites() == event.getEventLimit()){ // Kiểm tra xem số lượng yêu thích của sự kiện có bằng giới hạn không
                    event.setFull(true); // Nếu bằng giới hạn thì set trạng thái full
                } else { // Nếu không bằng giới hạn
                    event.setFull(false); // Set trạng thái không full
                }
                eventRepository.save(event); // Lưu thông tin sự kiện vào database
                favoriteEvents.add(event); // Thêm sự kiện vào danh sách yêu thích
            }
        }

        List<Event> result = new ArrayList<>(); // Tạo danh sách kết quả
        ChronoLocalDateTime currentDate = new Date().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime(); // Lấy ngày hiện tại

        for (Event event : favoriteEvents) { // Duyệt qua danh sách sự kiện yêu thích của người dùng
            if (event.getStartedAt().isBefore(currentDate) && event.getEndsAt().isAfter(currentDate)) { // Nếu ngày bắt đầu trước ngày hiện tại và ngày kết thúc sau ngày hiện tại
                result.add(event); // Thêm sự kiện vào danh sách kết quả
            }

            // nếu sự kiện đã hết hạn
            if(event.getEndsAt().isBefore(currentDate)){ // Nếu ngày kết thúc trước ngày hiện tại
                event.setAvailable(false); // Set trạng thái không khả dụng
                eventRepository.save(event); // Lưu thông tin sự kiện vào database
            }
        }

        result.sort(Comparator.comparing(Event::getStartedAt)); // Sắp xếp danh sách kết quả theo thời gian bắt đầu
        return result; // Trả về danh sách kết quả
    }

    @Override
    public Event toggleAvailable(Long eventId) throws Exception {
        Optional<Event> eventOptional = eventRepository.findById(eventId); // Lấy sự kiện theo id
        if (eventOptional.isPresent()) { // Nếu sự kiện tồn tại
            Event event = eventOptional.get(); // Lấy thông tin sự kiện
            boolean newAvailability = !event.isAvailable();
            event.setAvailable(newAvailability); // Đảo trạng thái khả dụng

            eventRepository.save(event); // Lưu thông tin sự kiện vào database

            if(!event.isEmailSentEventCanceled()){
                //lọc ra những mail của user đã thêm nhà hàng chứng event trên vào danh sáhc yêu thích
                List<String> emails = userRepository.findAll().stream()
                        .filter(user -> user.getEventDtoFavorites().stream().anyMatch(eventDto -> eventDto.getId().equals(eventId)))
                        .map(User::getEmail)
                        .collect(Collectors.toList());
                emailService.sendMailEventCanceled(emails, event);
                event.setEmailSentEventCanceled(true);
                eventRepository.save(event);
            }

            return event;
        } else {
            throw new Exception("Event not found"); // Nếu sự kiện không tồn tại thì báo lỗi
        }
    }


    @Override
    public List<Event> getFavoriteEventsOfRestaurantsByUser(User user) throws Exception {
        // lay tat ca nha hang -> duy tung nha hang trong vong lap roi lay ra tat ca event cua nha hang do -> luu trong mang
        List<Restaurant> restaurants = restaurantRepository.findAll(); // Lấy danh sách tất cả nhà hàng
        //lọc ra các nhà hàng dc yeu thích
        List<Restaurant> favoritesRestaurants = restaurantService.getFavoriteRestaurants(user);
        List<Event> restaurantsEvents = new ArrayList<>(); // Tạo danh sách sự kiện yêu thích
        for (Restaurant restaurant : favoritesRestaurants) { // Duyệt qua danh sách nhà hàng
            List<Event> events = eventRepository.findByRestaurantId(restaurant.getId()); // Lấy danh sách sự kiện của nhà hàng
            for (Event event : events) { // Duyệt qua danh sách sự kiện
//                if (user.getEventDtoFavorites().stream().anyMatch(favorite -> favorite.getId().equals(event.getId()))) { // Kiểm tra xem sự kiện đã được thêm vào danh sách yêu thích của người dùng chưa
//                    favoriteEvents.add(event); // Nếu đã được thêm thì thêm vào danh sách sự kiện yêu thích
//                }
                restaurantsEvents.add(event); // Thêm sự kiện vào danh sách sự kiện yêu thích
            }
        }
        return restaurantsEvents; // Trả về danh sách sự kiện yêu thích
    }

    private void updateEventDtoForUsers(Event event) {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            List<EventDto> userEvents = user.getEventDto();
            for (EventDto eventDto : userEvents) {
                if (eventDto.getId().equals(event.getId())) {
                    eventDto.setName(event.getName());
                    eventDto.setLocation(event.getLocation());
                    eventDto.setDescription(event.getDescription());
                    eventDto.setStartedAt(event.getStartedAt());
                    eventDto.setEndsAt(event.getEndsAt());
                    eventDto.setImages(event.getImages());
                    eventDto.setEventLimit(event.getEventLimit());
                    eventDto.setIsFull(event.isFull());
                    eventDto.setOfRestaurant(event.getRestaurant().getName());
                    eventDto.setIsAvailable(event.isAvailable());
                }
            }
            List<EventDto> userFavoriteEvents = user.getEventDtoFavorites();
            for (EventDto eventDto : userFavoriteEvents) {
                if (eventDto.getId().equals(event.getId())) {
                    eventDto.setName(event.getName());
                    eventDto.setLocation(event.getLocation());
                    eventDto.setDescription(event.getDescription());
                    eventDto.setStartedAt(event.getStartedAt());
                    eventDto.setEndsAt(event.getEndsAt());
                    eventDto.setImages(event.getImages());
                    eventDto.setEventLimit(event.getEventLimit());
                    eventDto.setIsFull(event.isFull());
                    eventDto.setOfRestaurant(event.getRestaurant().getName());
                    eventDto.setIsAvailable(event.isAvailable());
                }
            }
            userRepository.save(user);
        }
    }
}
