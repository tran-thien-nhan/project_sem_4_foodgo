package com.foodgo.controller;

import com.foodgo.dto.RestaurantDto;
import com.foodgo.model.Restaurant;
import com.foodgo.model.User;
import com.foodgo.request.CreateRestaurantRequest;
import com.foodgo.service.RestaurantService;
import com.foodgo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {
    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private UserService userService;

    @GetMapping("/search")
    public ResponseEntity<List<Restaurant>> searchRestaurant(@RequestHeader("Authorization") String jwt,
                                                             @RequestParam String keyword) throws Exception {
        User user = userService.findUserByJwtToken(jwt); // tìm user theo jwt token
        List<Restaurant> restaurant = restaurantService.searchRestaurant(keyword); // tìm nhà hàng theo keyword
        return new ResponseEntity<>(restaurant, HttpStatus.OK); // trả về response với status code 201 Created
    }

    @GetMapping()
    public ResponseEntity<List<Restaurant>> getAllRestaurant(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt); // tìm user theo jwt token
        List<Restaurant> restaurant = restaurantService.getAllRestaurants(); // lấy tất cả nhà hàng
        return new ResponseEntity<>(restaurant, HttpStatus.OK); // trả về response với status code 201 Created
    }

    @GetMapping("/{id}")
    public ResponseEntity<Restaurant> findRestaurantById(@RequestHeader("Authorization") String jwt,
                                                               @PathVariable Long id) throws Exception {
        User user = userService.findUserByJwtToken(jwt); // tìm user theo jwt token
        Restaurant restaurant = restaurantService.findRestaurantById(id); // tìm nhà hàng theo id
        return new ResponseEntity<>(restaurant, HttpStatus.OK); // trả về response với status code 201 Created
    }

    @PutMapping("/{id}/add-to-favorites")
    public ResponseEntity<RestaurantDto> addToFavorites(@RequestHeader("Authorization") String jwt,
                                                         @PathVariable Long id) throws Exception {
        User user = userService.findUserByJwtToken(jwt); // tìm user theo jwt token
        RestaurantDto restaurant = restaurantService.addToFavorites(id, user); // thêm nhà hàng vào danh sách yêu thích
        return new ResponseEntity<>(restaurant, HttpStatus.OK); // trả về response với status code 201 Created
    }
}
