package com.foodgo.request;

import com.foodgo.model.Restaurant;
import com.foodgo.model.User;
import lombok.Data;

@Data
public class RideRequest {
    private double restaurantLatitude; // Vĩ độ của nhà hàng
    private double restaurantLongitude; // Kinh độ của nhà hàng
    private double destinationLatitude; // Vĩ độ của điểm giao đồ ăn (nhà của khách hàng)
    private double destinationLongitude; // Kinh độ của điểm giao đồ ăn (nhà của khách hàng)

    private Long UserId; // ID của người dùng
    private Long RestaurantId; // ID của nhà hàng
    private Long OrderId; // ID của đơn hàng

    private double distance;
    private Long duration;
    private Long fare;
}
