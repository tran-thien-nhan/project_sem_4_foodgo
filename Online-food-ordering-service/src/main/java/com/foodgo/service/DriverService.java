package com.foodgo.service;

import com.foodgo.model.Driver;
import com.foodgo.model.License;
import com.foodgo.model.Ride;
import com.foodgo.model.Vehicle;
import com.foodgo.request.CreateLicenseVehicleRequest;

import java.util.List;

public interface DriverService {

    // Tạo thông tin bằng lái và thông tin xe của tài xế
    public Driver registerDriver(CreateLicenseVehicleRequest req) throws Exception;

    // Tìm tài xế có sẵn trong bán kính radius từ nhà hàng
    public List<Driver> getAvailableDrivers(double restaurantLatitude, double restaurantLongitude, Ride ride) throws Exception;

    // Tìm tài xế gần nhà hàng nhất
    public Driver findNearestDriver(List<Driver> availableDrivers ,double restaurantLatitude, double restaurantLongitude) throws Exception;
    public Driver getDriverProfile(String jwt) throws Exception; // Lấy thông tin cá nhân của tài xế
    public Ride getDriverCurrentRide(Long driverId) throws Exception; // Lấy thông tin chuyến đi hiện tại của tài xế
    public List<Ride> getAllocatedRides(Long driverId) throws Exception; // Lấy danh sách các chuyến đi đã nhận
    public Driver findDriverById(Long driverId) throws Exception; // Tìm tài xế theo ID
    public List<Ride> completedRides(Long driverId) throws Exception; // Lấy danh sách các chuyến đi đã hoàn thành
}
