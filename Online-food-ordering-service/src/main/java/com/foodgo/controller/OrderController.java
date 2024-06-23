package com.foodgo.controller;

import com.foodgo.model.Cart;
import com.foodgo.model.CartItem;
import com.foodgo.model.Order;
import com.foodgo.model.User;
import com.foodgo.request.AddCartItemRequest;
import com.foodgo.request.OrderRequest;
import com.foodgo.response.PaymentResponse;
import com.foodgo.service.CartService;
import com.foodgo.service.OrderService;
import com.foodgo.service.PaymentService;
import com.foodgo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private CartService cartService;

    @PostMapping("/order")
    public ResponseEntity<PaymentResponse> createOrder(@RequestBody OrderRequest req, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Order order = orderService.createOrder(req, user);
        PaymentResponse res = paymentService.createPaymentLink(order);

        return new ResponseEntity<>(res, HttpStatus.OK);
    }

    @PostMapping("/order/success")
    public ResponseEntity<Order> createOrderSuccess(@RequestBody OrderRequest req, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Order order = orderService.createOrder(req, user);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    @GetMapping("/order/user")
    public ResponseEntity<List<Order>> getOrderHistory(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        List<Order> order = orderService.getUserOrders(user.getId());
        return new ResponseEntity<>(order, HttpStatus.OK);
    }
}
