package com.foodgo.request;

import lombok.Data;

@Data
public class AddAddressRequest {
    private String city;
    private String streetAddress;
    private String state;
    private String pinCode;
    private String country;
    private String phone;
//    private double latitude;
//    private double longitude;
}
