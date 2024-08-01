package com.foodgo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.foodgo.dto.DriverDto;
import com.foodgo.dto.RideDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @ToString.Exclude
    private User customer;

    @JsonIgnore //tránh lặp vô hạn, không lấy thông tin của restaurant, chỉ lấy thông tin của order
    @ManyToOne //một order chỉ thuộc về một nhà hàng
    private Restaurant restaurant;

    private Long totalAmount;

    private String orderStatus = ORDER_STATUS.PENDING.name();

    private Date createdAt;

    @ManyToOne //một order chỉ có một địa chỉ giao hàng
    private Address deliveryAddress;

    @OneToMany //một order có nhiều order item
    private List<OrderItem> items;

    //private Payment payment;
    private Long totalItem;

    private Long totalPrice;

    private String comment;

    private String PaymentMethod;

    private Boolean isPaid = false;

    private String paymentIntentId;

    private Double latitude;
    private Double longitude;

    private double distance;

    private Long duration;

    private Long fare;

    @ElementCollection // Đánh dấu là một collection của các phần tử, không phải một entity riêng biệt
    @Column(length = 1000) // Độ dài tối đa của mỗi phần tử
    private List<String> images;

    @Embedded
    private DriverDto driverdto;

    @ManyToOne
    @JoinColumn(name = "ride_id")
    @JsonIgnore
    @ToString.Exclude
    private Ride ride; // Thêm thuộc tính ride để xác định mối quan hệ
}
