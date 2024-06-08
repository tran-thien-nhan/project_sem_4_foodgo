package com.foodgo.controller;

import com.foodgo.model.Restaurant;
import com.foodgo.model.User;
import com.foodgo.request.CreateRestaurantRequest;
import com.foodgo.response.MessageResponse;
import com.foodgo.service.RestaurantService;
import com.foodgo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/restaurants")
public class AdminRestaurantController {
    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private UserService userService;

    // tạo mới nhà hàng
    @PostMapping()
    public ResponseEntity<Restaurant> createRestaurant(@RequestBody CreateRestaurantRequest req,
                                                       @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt); // tìm user theo jwt token
        Restaurant restaurant = restaurantService.createRestaurant(req, user); // tạo mới nhà hàng
        return new ResponseEntity<>(restaurant, HttpStatus.CREATED); // trả về response với status code 201 Created
    }

    @PutMapping("/{id}")
    public ResponseEntity<Restaurant> updateRestaurant(@RequestBody CreateRestaurantRequest req,
                                                       @RequestHeader("Authorization") String jwt,
                                                       @PathVariable Long id) throws Exception {
        User user = userService.findUserByJwtToken(jwt); // tìm user theo jwt token
        Restaurant restaurant = restaurantService.updateRestaurant(id, req); // cập nhật nhà hàng
        return new ResponseEntity<>(restaurant, HttpStatus.CREATED); // trả về response với status code 201 Created
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteRestaurant(@RequestHeader("Authorization") String jwt,
                                                       @PathVariable Long id) throws Exception {
        User user = userService.findUserByJwtToken(jwt); // tìm user theo jwt token
        restaurantService.deleteRestaurant(id); // xóa nhà hàng
        MessageResponse res = new MessageResponse();
        res.setMessage("Restaurant deleted successfully");
        return new ResponseEntity<>(res, HttpStatus.OK); // trả về response với status code 204 No Content
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Restaurant> updateRestaurantStatus(@RequestHeader("Authorization") String jwt,
                                                            @PathVariable Long id) throws Exception {
        User user = userService.findUserByJwtToken(jwt); // tìm user theo jwt token
        Restaurant restaurant = restaurantService.updateRestaurantStatus(id); // cập nhật trạng thái nhà hàng
        return new ResponseEntity<>(restaurant, HttpStatus.OK); // trả về response với status code 200 OK
    }

    @GetMapping("/user")
    public ResponseEntity<Restaurant> findRestaurantByUserId(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt); // tìm user theo jwt token
        Restaurant restaurant = restaurantService.getRestaurantByUserId(user.getId()); // tìm nhà hàng theo id user
        return new ResponseEntity<>(restaurant, HttpStatus.OK); // trả về response với status code 200 OK
    }
}
