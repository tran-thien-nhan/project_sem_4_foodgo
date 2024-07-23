package com.foodgo.service;

import com.foodgo.dto.RideDto;
import com.foodgo.model.*;
import com.foodgo.request.CreateLicenseVehicleRequest;
import com.foodgo.request.UpdateDriverInfoRequest;

import java.util.List;

public interface DriverService {

    // Tạo thông tin bằng lái và thông tin xe của tài xế
    public Driver registerDriver(CreateLicenseVehicleRequest req, User user) throws Exception;

    // Tìm tài xế có sẵn trong bán kính radius từ nhà hàng
    public List<Driver> getAvailableDrivers(double restaurantLatitude, double restaurantLongitude, Ride ride) throws Exception;

    // Tìm tài xế gần nhà hàng nhất
    public Driver findNearestDriver(List<Driver> availableDrivers ,double restaurantLatitude, double restaurantLongitude) throws Exception;
    public Driver getDriverProfile(String jwt) throws Exception; // Lấy thông tin cá nhân của tài xế
    public RideDto getDriverCurrentRide(Long driverId) throws Exception; // Lấy thông tin chuyến đi hiện tại của tài xế
    public List<RideDto> getAllocatedRides(Long driverId) throws Exception; // Lấy danh sách các chuyến đi đã nhận
    public Driver findDriverById(Long driverId) throws Exception; // Tìm tài xế theo ID
    public List<Ride> completedRides(Long driverId) throws Exception; // Lấy danh sách các chuyến đi đã hoàn thành

    public Driver updateDriver(Long driverId, UpdateDriverInfoRequest req) throws Exception; // Cập nhật thông tin tài xế

    public void deleteImage(Long driverId, String imageUrl) throws Exception;
}
