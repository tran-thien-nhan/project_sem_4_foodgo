package com.foodgo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
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

    @ManyToOne
    @JoinColumn(name = "ride_id")
    private Ride ride; // Thêm thuộc tính ride để xác định mối quan hệ
}
