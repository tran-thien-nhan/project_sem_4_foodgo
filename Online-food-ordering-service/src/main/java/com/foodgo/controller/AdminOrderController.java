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
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminOrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @GetMapping("/order/restaurant/{id}")
    public ResponseEntity<Order> getOrderHistory(@PathVariable Long id,
                                                    @RequestParam(required = false) String order_status,
                                                    @RequestHeader("Authorization") String jwt) throws Exception {
        try {
            User user = userService.findUserByJwtToken(jwt);
            List<Order> order = orderService.getRestaurantsOrder(id, order_status);
            return new ResponseEntity(order, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/all/order/restaurant/{id}")
    public ResponseEntity<Order> getAllOrderHistory(@PathVariable Long id,
                                          @RequestHeader("Authorization") String jwt) throws Exception {
        try {
            User user = userService.findUserByJwtToken(jwt);
            List<Order> order = orderService.getRestaurantsAllOrder(id);
            return new ResponseEntity(order, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

//    @PutMapping("/order/{id}/{orderStatus}")
//    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id,
//                                                   @PathVariable String orderStatus,
//                                                   @RequestHeader("Authorization") String jwt) throws Exception {
//        User user = userService.findUserByJwtToken(jwt);
//        Order order = orderService.updateOrder(id, orderStatus);
//        return new ResponseEntity<>(order, HttpStatus.OK);
//    }

    @PutMapping("/order/update-status/{id}")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id,
                                                   @RequestBody Map<String, String> requestBody,
                                                   @RequestHeader("Authorization") String jwt) throws Exception {
//        String orderStatus = requestBody.get("orderStatus");
//        if (orderStatus == null) {
//            throw new Exception("Order status is required");
//        }
        User user = userService.findUserByJwtToken(jwt);
        Order order = orderService.updateOrder(id);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }
}
