package com.foodgo.service;

import com.foodgo.dto.EventDto;
import com.foodgo.dto.UserDto;
import com.foodgo.mapper.DtoMapper;
import com.foodgo.model.Event;
import com.foodgo.model.Restaurant;
import com.foodgo.model.USER_ROLE;
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
public class EventServiceImp implements EventService {

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

            restaurant.getEvents().add(savedEvent);
            restaurantRepository.save(restaurant);

            if (!event.isEmailSentNewEvent()) {
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

            // update các event trong eventDto của user, sử dụng updateEventDto
            List<User> users = userRepository.findAll();
            for (User user : users) {
                if (user.getRole().equals(USER_ROLE.ROLE_CUSTOMER)) {
                    List<EventDto> eventDtos = user.getFavoriteEventsDto();
                    for (EventDto eventDto : eventDtos) {
                        if (eventDto.getId().equals(eventId)) {
                            DtoMapper.updateEventDto(existingEvent);
                        }
                    }
                    userRepository.save(user);
                }
            }


            return eventRepository.save(existingEvent);
        } else {
            throw new Exception("Event not found");
        }
    }

    @Override
    public void deleteEvent(Long eventId) throws Exception {
        Event event = getEventById(eventId);
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
    public void addUserToEvent(Long eventId, Long userId) throws Exception {
        Optional<Event> eventOptional = eventRepository.findById(eventId); // Lấy thông tin event từ eventId
        Optional<User> userOptional = userRepository.findById(userId); // Lấy thông tin user từ userId

        if (eventOptional.isPresent() && userOptional.isPresent()) { // Nếu cả 2 thông tin đều tồn tại
            Event event = eventOptional.get(); // Lấy thông tin event
            User user = userOptional.get(); // Lấy thông tin user

            if (!event.getUsers().contains(user)) { // Nếu user chưa tham gia event
                event.getUsers().add(user); // Thêm user vào danh sách tham gia event
                user.getEvents().add(event); // Thêm event vào danh sách sự kiện yêu thích của user
                // cộng 1 vào số lượng tham gia của event (totalFavorites)
                event.setTotalFavorites(event.getTotalFavorites() + 1);
                EventDto eventDto = DtoMapper.toEventDto(event); // Chuyển đổi event thành eventDto
                user.getFavoriteEventsDto().add(eventDto); // Thêm eventDto vào danh sách sự kiện yêu thích của user

                eventRepository.save(event); // Lưu thông tin event
                userRepository.save(user); // Lưu thông tin event và user
            }
        } else {
            throw new Exception("Event or User not found");
        }
    }

    public void removeUserFromEvent(Long eventId, Long userId) throws Exception { // Xóa user khỏi event
        Optional<Event> eventOptional = eventRepository.findById(eventId); // Lấy thông tin event từ eventId
        Optional<User> userOptional = userRepository.findById(userId); // Lấy thông tin user từ userId

        if (eventOptional.isPresent() && userOptional.isPresent()) { // Nếu cả 2 thông tin đều tồn tại
            Event event = eventOptional.get(); // Lấy thông tin event
            User user = userOptional.get(); // Lấy thông tin user

            if (event.getUsers().contains(user)) { // Nếu user đã tham gia event
                event.getUsers().remove(user); // Xóa user khỏi danh sách tham gia event
                user.getEvents().remove(event); // Xóa event khỏi danh sách sự kiện yêu thích của user
                // trừ 1 vào số lượng tham gia của event (totalFavorites)
                event.setTotalFavorites(event.getTotalFavorites() - 1);
                user.getFavoriteEventsDto().removeIf(eventDto -> eventDto.getId().equals(eventId)); // Xóa eventDto khỏi danh sách sự kiện yêu thích của user

                eventRepository.save(event); // Lưu thông tin event
                userRepository.save(user); // Lưu thông tin user
            }
        } else {
            throw new Exception("Event or User not found");
        }
    }

    @Override
    public List<UserDto> getListUserByEventId(Long eventId) throws Exception {
        List<User> users = eventRepository.getListUserByEventId(eventId);
        List<UserDto> userDtos = new ArrayList<>();

        if (users != null && !users.isEmpty()) {
            for (User user : users) {
                userDtos.add(DtoMapper.toUserDto(user));
            }
        }

        return userDtos;
    }


    @Override
    public boolean isUserJoinedEvent(Long eventId, Long userId) throws Exception {
        try {
            Event event = getEventById(eventId); // Lấy thông tin event từ eventId
            Optional<User> userOptional = userRepository.findById(userId); // Lấy thông tin user từ userId

            if (userOptional.isPresent()) { // Nếu thông tin user tồn tại
                User user = userOptional.get(); // Lấy thông tin user

                boolean hasCheckedIn = eventRepository.checkIfUserJoinedEvent(eventId, userId); // Kiểm tra xem user đã tham gia event chưa

                if (hasCheckedIn) { // Nếu user đã tham gia event
                    if (!event.getActualAttendees().contains(user)) { // Nếu user chưa trong danh sách tham gia thực tế
                        event.getActualAttendees().add(user); // Thêm user vào danh sách tham gia thực tế
                    } else { // Nếu user đã có trong danh sách tham gia thực tế
                        event.getActualAttendees().remove(user); // Xóa user khỏi danh sách tham gia thực tế
                    }
                    eventRepository.save(event); // Lưu thông tin event
                }
                return event.getActualAttendees().contains(user); // Trả về true nếu user đã check-in, ngược lại trả về false
            }
            return false;
        } catch (Exception e) {
            throw new Exception("Event or User not found");
        }
    }

    @Override
    public List<UserDto> getListUserCheckInByEventId(Long eventId) throws Exception {
        try{
            Event event = getEventById(eventId); // Lấy thông tin event từ eventId
            List<User> users = event.getActualAttendees(); // Lấy danh sách user đã check-in
            List<UserDto> userDtos = new ArrayList<>();
            for (User user : users) {
                userDtos.add(DtoMapper.toUserDto(user));
            }
            return userDtos;
        }
        catch (Exception e) {
            throw new Exception("Event or User not found");
        }
    }

    @Override
    public Map<String, Object> getEventAttendeeAnalytics(Long eventId) throws Exception {
        Event event = getEventById(eventId);

        int totalInvited = event.getUsers().size();
        int totalCheckedIn = event.getActualAttendees().size();

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalInvited", totalInvited);
        analytics.put("totalCheckedIn", totalCheckedIn);
        analytics.put("percentageCheckedIn", (totalInvited > 0) ? ((double) totalCheckedIn / totalInvited) * 100 : 0);

        return analytics;
    }


    @Override
    public List<Event> getFavoriteEvents(User user) throws Exception {
        List<Event> favoriteEvents = user.getEvents();
        List<Event> result = new ArrayList<>();
        ChronoLocalDateTime currentDate = new Date().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();

        for (Event event : favoriteEvents) {
            if (event.getStartedAt().isBefore(currentDate) && event.getEndsAt().isAfter(currentDate)) {
                result.add(event);
            }

            if (event.getEndsAt().isBefore(currentDate)) {
                event.setAvailable(false);
                eventRepository.save(event);
            }
        }

        result.sort(Comparator.comparing(Event::getStartedAt));
        return result;
    }

    @Override
    public Event toggleAvailable(Long eventId) throws Exception {
        Optional<Event> eventOptional = eventRepository.findById(eventId);
        if (eventOptional.isPresent()) {
            Event event = eventOptional.get();
            event.setAvailable(!event.isAvailable());

            eventRepository.save(event);

            if (!event.isEmailSentEventCanceled()) {
                List<String> emails = userRepository.findAll().stream()
                        .filter(user -> user.getEvents().contains(event))
                        .map(User::getEmail)
                        .collect(Collectors.toList());
                emailService.sendMailEventCanceled(emails, event);
                event.setEmailSentEventCanceled(true);
                eventRepository.save(event);
            }

            return event;
        } else {
            throw new Exception("Event not found");
        }
    }

    @Override
    public List<Event> getFavoriteEventsOfRestaurantsByUser(User user) throws Exception {
        List<Restaurant> favoriteRestaurants = restaurantService.getFavoriteRestaurants(user);
        List<Event> favoriteEvents = new ArrayList<>();
        for (Restaurant restaurant : favoriteRestaurants) {
            favoriteEvents.addAll(eventRepository.findByRestaurantId(restaurant.getId()));
        }
        return favoriteEvents;
    }
}
