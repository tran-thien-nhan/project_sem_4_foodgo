package com.foodgo.controller;

import com.foodgo.model.*;
import com.foodgo.service.CategoryService;
import com.foodgo.service.FoodService;
import com.foodgo.service.RatingService;
import com.foodgo.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
