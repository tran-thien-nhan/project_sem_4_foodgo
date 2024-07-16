package com.foodgo.dto;

import com.foodgo.model.Driver;
import com.foodgo.model.RIDE_STATUS;
import jakarta.persistence.Embeddable;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Embeddable
public class RideDto {
    private Long rideId;
//    private OrderDto order;
    private RestaurantDto restaurant;
//    private UserDto user;
//    private DriverDto driver;
    private double driverStopLatitude;
    private double driverStopLongitude;
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
    private double fare;
    private RIDE_STATUS status;
}
