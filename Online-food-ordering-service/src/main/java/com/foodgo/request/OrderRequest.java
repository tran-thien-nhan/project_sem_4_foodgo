package com.foodgo.request;

import com.foodgo.model.Address;
import com.foodgo.model.CartItem;
import com.stripe.model.Order;
import lombok.Data;

@Data
public class OrderRequest {
    private Long restaurantId;
    private Address deliveryAddress;
    private String paymentMethod;
}
