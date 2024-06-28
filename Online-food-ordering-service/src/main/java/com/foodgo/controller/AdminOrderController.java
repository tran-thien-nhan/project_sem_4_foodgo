package com.foodgo.controller;

import com.foodgo.helper.ApiResponse;
import com.foodgo.model.Order;
import com.foodgo.model.User;
import com.foodgo.service.OrderService;
import com.foodgo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminOrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @GetMapping("/order/restaurant/{id}")
    public ApiResponse<?> getOrderHistory(@PathVariable Long id,
                                                    @RequestParam(required = false) String order_status,
                                                    @RequestHeader("Authorization") String jwt) throws Exception {
        try {
            User user = userService.findUserByJwtToken(jwt);
            List<Order> order = orderService.getRestaurantsOrder(id, order_status);
            return ApiResponse.success(order, "get order history success");
        } catch (Exception e) {
            return ApiResponse.errorServer(null, "error", null);
        }
    }

    @GetMapping("/all/order/restaurant/{id}")
    public ApiResponse<?> getAllOrderHistory(@PathVariable Long id,
                                          @RequestHeader("Authorization") String jwt) throws Exception {
        try {
            User user = userService.findUserByJwtToken(jwt);
            List<Order> order = orderService.getRestaurantsAllOrder(id);
            return ApiResponse.success(order, "get ALL order history success");
        } catch (Exception e) {
            return ApiResponse.errorServer(null, "error", null);
        }
    }

    @PutMapping("/order/{id}/{orderStatus}")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id,
                                                   @PathVariable String orderStatus,
                                                   @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Order order = orderService.updateOrder(id, orderStatus);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }
}
