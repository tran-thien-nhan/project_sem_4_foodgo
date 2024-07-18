package com.foodgo.request;

import lombok.Data;

import java.util.List;

@Data
public class CreateLicenseVehicleRequest {
    private String licenseNumber; // Số bằng lái
    private String licenseState; // Nơi cấp bằng lái
    private String licensePlate; // Biển số xe
    private String licenseExpirationDate; // Ngày hết hạn bằng lái
    private String make; // Tên hãng xe
    private String model; // Tên mẫu xe
    private int year; // Năm sản xuất
    private String color; // Màu xe
    private String vehicleLicensePlate; // Biển số xe
    private int capacity; // Số lượng đồ ăn tối đa mà xe có thể chở
    private List<String> imageOfLicense; // Ảnh của bằng lái
    private List<String> imageOfVehicle; // Ảnh của xe
    private List<String> imageOfDriver; // Ảnh của tài xế

    private String streetAddress; // Địa chỉ của tài xế
    private String city; // Thành phố của tài xế
    private String state; // Bang của tài xế
    private String pinCode; // Mã bưu chính của tài xế
    private String country; // Quốc gia của tài xế
}
