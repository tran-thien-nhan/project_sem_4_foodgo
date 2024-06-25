package com.foodgo.helper;

import com.foodgo.model.CartItem;
import com.foodgo.request.OrderRequest;
import com.foodgo.model.User;
import com.foodgo.service.CartService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;

@Data
public class OrderTemp {

    private OrderRequest orderRequest;
    private User user;

    public OrderTemp(OrderRequest req, User user) {
        this.orderRequest = req;
        this.user = user;
    }

    public OrderRequest getOrderRequest() {
        return orderRequest;
    }

    public User getUser() {
        return user;
    }


}
