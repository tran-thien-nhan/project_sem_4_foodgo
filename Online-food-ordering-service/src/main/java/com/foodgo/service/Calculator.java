package com.foodgo.service;

import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
public class Calculator {
    private static final int EARTH_RADIUS = 6371;
    public double calculateDistance(double sourceLatitude,
                                    double sourceLongitude,
                                    double destinationLatitude,
                                    double destinationLongitude) {
        double dLat = Math.toRadians(destinationLatitude - sourceLatitude);
        double dLong = Math.toRadians(destinationLongitude - sourceLongitude);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(Math.toRadians(sourceLatitude)) * Math.cos(Math.toRadians(destinationLatitude)) *
                        Math.sin(dLong / 2) * Math.sin(dLong / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distance = EARTH_RADIUS * c;
        return distance;
    }

    public Long calculateDuration(LocalDateTime startTime, LocalDateTime endTime) {
        Duration duration = Duration.between(startTime, endTime); // tính thời gian giữa thời gian bắt đầu và thời gian kết thúc
        return duration.toMinutes(); // trả về thời gian tính bằng phút
    }

    public Double calculateFare(double distance) {
        double baseFare = 5000; // giá cố định
        double farePerKm = 5000; // giá mỗi km
        double totalFare = baseFare + farePerKm * distance; // tính tổng giá = giá cố định + giá mỗi km * số km
        return totalFare; // trả về tổng giá
    }
}
