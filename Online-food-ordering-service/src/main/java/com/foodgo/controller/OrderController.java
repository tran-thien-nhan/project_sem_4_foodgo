package com.foodgo.controller;

import com.foodgo.helper.OrderTemp;
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
import java.util.stream.Collectors;

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

//    @PostMapping("/order")
//    public ResponseEntity<PaymentResponse> createOrder(@RequestBody OrderRequest req, @RequestHeader("Authorization") String jwt) throws Exception {
//        User user = userService.findUserByJwtToken(jwt);
//        Order order = orderService.createOrder(req, user);
//
//        if(req.getPaymentMethod().contains("BY_CREDIT_CARD")){ // Nếu phương thức thanh toán là thẻ
//            PaymentResponse res = paymentService.createPaymentLink(order);
//            return new ResponseEntity<>(res, HttpStatus.OK);
//        }
//
//        return new ResponseEntity<>(HttpStatus.OK);
//    }

    @PostMapping("/order")
    public ResponseEntity<List<PaymentResponse>> createOrder(@RequestBody OrderRequest req, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        List<Order> orders = orderService.createOrder(req, user);

        if(req.getPaymentMethod().contains("BY_CREDIT_CARD")){
            List<PaymentResponse> paymentResponses = orders.stream()
                    .map(order -> {
                        try {
                            return paymentService.createPaymentLink(order);
                        } catch (Exception e) {
                            throw new RuntimeException(e);
                        }
                    })
                    .collect(Collectors.toList());
            return new ResponseEntity<>(paymentResponses, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PutMapping("/order/toggle-payment-status/{orderId}")
    public ResponseEntity<Order> toggleOrderPaymentStatus(@PathVariable Long orderId, @RequestHeader("Authorization") String jwt) throws Exception {
        Order updatedOrder = orderService.toggleOrderPaymentStatus(orderId);
        return new ResponseEntity<>(updatedOrder, HttpStatus.OK);
    }

    // find order by id
    @GetMapping("/order/{id}")
    public ResponseEntity<Order> findOrderById(@PathVariable Long id) throws Exception {
        Order order = orderService.findOrderById(id);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }


    @PostMapping("/order/confirm")
    public ResponseEntity<List<Order>> confirmOrder(@RequestBody OrderRequest req, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        List<Order> order = orderService.createOrder(req, user);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    @GetMapping("/order/user")
    public ResponseEntity<List<Order>> getOrderHistory(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        List<Order> order = orderService.getUserOrders(user.getId());
        return new ResponseEntity<>(order, HttpStatus.OK);
    }


    // Xóa tất cả order chưa thanh toán của user và các order item liên quan
    @DeleteMapping("/order/clear-unpaid")
    public ResponseEntity<Void> clearUnpaidOrders(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        orderService.clearUnpaidOrders(user.getId());
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/order/refund/{orderId}")
    public ResponseEntity<String> refundOrder(@PathVariable Long orderId, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        String refundStatus = orderService.refundOrder(orderId);
        return new ResponseEntity<>(refundStatus, HttpStatus.OK);
    }
}
