package com.foodgo.dto;

import com.foodgo.model.Driver;
import com.foodgo.model.ORDER_STATUS;
import com.foodgo.model.RIDE_STATUS;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Embeddable
public class RideDto {
    private Long rideId;
    private Long driverId;
    private Long RestaurantId;
    private Long orderId;
    private double restaurantLatitude;
    private double restaurantLongitude;
    private double destinationLatitude;
    private double destinationLongitude;
    private String userAddress;
    private String restaurantAddress;
    private double distance;
    private long duration;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private List<OrderItemDto> orderItem;
    private double fare;
    private Long total;
    private RIDE_STATUS status;
    private String paymentMethod;
}
