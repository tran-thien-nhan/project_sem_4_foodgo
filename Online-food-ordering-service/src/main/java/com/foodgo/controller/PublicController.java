package com.foodgo.controller;

import com.foodgo.model.*;
import com.foodgo.repository.EventRepository;
import com.foodgo.service.*;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicController {
    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private FoodService foodService;

    @Autowired
    private RatingService ratingService;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserService userService;

    @GetMapping("/restaurants")
    public ResponseEntity<List<Restaurant>> getAllRestaurant() throws Exception {
        List<Restaurant> restaurant = restaurantService.getAllRestaurants(); // lấy tất cả nhà hàng
        return new ResponseEntity<>(restaurant, HttpStatus.OK); // trả về response với status code 201 Created
    }

    @GetMapping("/restaurants/{id}")
    public ResponseEntity<Restaurant> findRestaurantById(@PathVariable Long id) throws Exception {
        Restaurant restaurant = restaurantService.findRestaurantById(id); // tìm nhà hàng theo id
        return new ResponseEntity<>(restaurant, HttpStatus.OK); // trả về response với status code 201 Created
    }

    @GetMapping("/category/restaurant/{id}")
    public ResponseEntity<List<Category>> getRestaurantCategory(@PathVariable Long id) throws Exception {
        List<Category> categories = categoryService.findCategoryByRestaurantId(id);
        return new ResponseEntity<>(categories, HttpStatus.CREATED);
    }

    @GetMapping("/food/restaurant/{restaurantId}")
    public ResponseEntity<List<Food>> getRestaurantFood(@RequestParam (required = false) boolean vegetarian,
                                                        @RequestParam (required = false) boolean seasonal,
                                                        @RequestParam (required = false) boolean nonVegan,
                                                        @RequestParam (required = false) String food_category,
                                                        @PathVariable Long restaurantId) throws Exception {
        List<Food> foods = foodService.getRestaurantsFood(restaurantId, vegetarian, nonVegan, seasonal, food_category);
        return new ResponseEntity<>(foods, HttpStatus.OK);
    }

    @GetMapping("/ratings/visible/{restaurantId}")
    public ResponseEntity<List<Rating>> getRatings(@PathVariable Long restaurantId) throws Exception {
        List<Rating> ratings = ratingService.getRatingsVisible(restaurantId);
        return new ResponseEntity<>(ratings, HttpStatus.OK);
    }

    //get all food
    @GetMapping("/foods")
    public ResponseEntity<List<Food>> getAllFoods() throws Exception {
        List<Food> foods = foodService.getAllFoods();
        return new ResponseEntity<>(foods, HttpStatus.OK);
    }

    //get all events
    @GetMapping("/events")
    public ResponseEntity<List<Event>> getAllEvents() throws Exception {
        List<Event> events = eventRepository.findAll();
        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) throws MessagingException, UnsupportedEncodingException {
        try{
            String email = request.get("email");
            userService.processForgotPassword(email);
            return new ResponseEntity<>("Password reset email sent.", HttpStatus.OK);
        } catch (BadCredentialsException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            e.printStackTrace();  // Ghi lại stack trace để dễ dàng gỡ lỗi
            return new ResponseEntity<>("Internal server error: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) throws Exception {
        String token = request.get("token");
        String newPassword = request.get("newPassword");
        userService.updatePassword(token, newPassword);
        return new ResponseEntity<>("Password has been reset.", HttpStatus.OK);
    }
}
