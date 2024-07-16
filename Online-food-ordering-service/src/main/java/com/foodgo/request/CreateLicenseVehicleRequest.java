package com.foodgo.request;

import lombok.Data;

import java.util.List;

@Data
public class CreateLicenseVehicleRequest {
    private String licenseNumber; // Số bằng lái
    private String licenseState; // Nơi cấp bằng lái
    private String licensePlate; // Biển số xe
    private String licenseExpirationDate; // Ngày hết hạn bằng lái
    private String vehicleMake; // Tên hãng xe
    private String vehicleModel; // Tên mẫu xe
    private int vehicleYear; // Năm sản xuất
    private String vehicleColor; // Màu xe
    private String vehicleLicensePlate; // Biển số xe
    private int vehicleCapacity; // Số lượng đồ ăn tối đa mà xe có thể chở
    private List<String> imageOfLicense; // Ảnh của bằng lái
    private List<String> imageOfVehicle; // Ảnh của xe
    private List<String> imageOfDriver; // Ảnh của tài xế
    private String jwt; // JWT của tài xế
}
