package com.foodgo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "make")
    private String make; // tên hãng xe

    @Column(name = "model")
    private String model; // tên mẫu xe

    @Column(name = "year")
    private int year; // năm sản xuất

    @Column(name = "color")
    private String color; // màu xe

    @Column(name = "license_plate")
    private String licensePlate; // biển số xe

    @Column(name = "capacity")
    private int capacity; // số lượng đồ ăn tối đa mà xe có thể chở

    @Column(name = "image_of_vehicle", length = 1000)
    @ElementCollection // Đánh dấu là một collection của các phần tử, không phải một entity riêng biệt
    private List<String> imageOfVehicle; // ảnh của xe

    @JsonIgnore
    @OneToOne(cascade = CascadeType.ALL)
    private Driver driver;
}
