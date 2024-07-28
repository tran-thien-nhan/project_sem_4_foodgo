package com.foodgo.dto;

import com.foodgo.model.Vehicle;
import jakarta.persistence.Embeddable;
import lombok.Data;

@Data
@Embeddable
public class DriverDto {
    private Long driverId;
    private String name;
    private String phone;
    private String image;
    private String licenseNumber;
}
