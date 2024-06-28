package com.foodgo.controller;

import com.foodgo.helper.ApiResponse;
import com.foodgo.model.Food;
import com.foodgo.model.Restaurant;
import com.foodgo.model.User;
import com.foodgo.request.CreateFoodRequest;
import com.foodgo.response.MessageResponse;
import com.foodgo.service.FoodService;
import com.foodgo.service.RestaurantService;
import com.foodgo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/food")
public class AdminFoodController {
    @Autowired
    private FoodService foodService;

    @Autowired
    private UserService userService;

    @Autowired
    private RestaurantService restaurantService;

    @PostMapping
    public ResponseEntity<Food> createFood(@RequestBody CreateFoodRequest req,
                                        @RequestHeader("Authorization") String jwt) throws Exception {
        try {
            User user = userService.findUserByJwtToken(jwt);
            Restaurant restaurant = restaurantService.findRestaurantById(req.getRestaurantId());
            Food food = foodService.createFood(req, req.getCategory(),restaurant);

            return new ResponseEntity<>(food, HttpStatus.CREATED);
        }
        catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteFood(@PathVariable Long id,
                                             @RequestHeader("Authorization") String jwt) throws Exception {
        try {
            User user = userService.findUserByJwtToken(jwt);
            foodService.deleteFood(id);
            MessageResponse res = new MessageResponse();
            res.setMessage("Food deleted successfully");
            return new ResponseEntity<>(res, HttpStatus.OK);
        } catch (Exception e) {
            MessageResponse res = new MessageResponse();
            res.setMessage("Error: Food not found");
            return new ResponseEntity<>(res, HttpStatus.NOT_FOUND);
        }
    }

    //update food availability
    @PutMapping("/{id}")
    public ResponseEntity<Food> updateFoodAvailabilityStatus(@PathVariable Long id,
                                                       @RequestHeader("Authorization") String jwt) throws Exception {
        try {
            User user = userService.findUserByJwtToken(jwt);
            Food food = foodService.updateAvailabilityStatus(id);
            return new ResponseEntity<>(food, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

}
