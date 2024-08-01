package com.foodgo.request;

import lombok.Data;

import java.util.List;

@Data
public class UpdateDriverInfoRequest {
    private String name;
    private String email;
    private String phone;
    private List<String> imageOfDriver;
    private String licenseNumber;
    private String licenseState;
    private String licenseExpirationDate;
    private List<String> imageOfLicense;
    private String make;
    private String model;
    private int year;
    private String color;
    private String vehicleLicensePlate;
    private int capacity;
    private List<String> imageOfVehicle;

    private String streetAddress;
    private String city;
    private String state;
    private String pinCode;
    private String country;
}
