package com.foodgo.service;

import com.foodgo.model.Cart;
import com.foodgo.model.ORDER_STATUS;
import com.foodgo.model.Order;
import com.foodgo.model.User;
import com.foodgo.request.OrderRequest;

import java.util.List;

public interface OrderService {
    public List<Order> createOrder(OrderRequest order, User user) throws Exception;
    //public Order updateOrder(Long orderId, String orderStatus) throws Exception;
    public Order updateOrder(Long orderId, ORDER_STATUS newStatus) throws Exception;
    public void cancelOrder(Long orderId) throws Exception;
    public List<Order> getUserOrders(Long userId) throws Exception;
    public List<Order> getRestaurantsOrder(Long restaurantId, String orderStatus) throws Exception;

    public List<Order> getRestaurantsAllOrder(Long restaurantId) throws Exception;


    public Order findOrderById(Long orderId) throws Exception;

    public Long getTotalPrice(User user) throws Exception;

    //update trường isPaid của order từ true sang false và ngược lại

    public Order toggleOrderPaymentStatus(Long orderId) throws Exception;
    public void clearUnpaidOrders(Long userId) throws Exception;

    public String refundOrder(Long orderId) throws Exception;
}
