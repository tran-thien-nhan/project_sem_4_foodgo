package com.foodgo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Ride {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id; // ID của chuyến đi

    @OneToOne
//    @JoinColumn(name = "order_id")
//    @JsonIgnore

    private Order order; // Danh sách các đơn hàng trong chuyến đi

    @ManyToOne // Mỗi chuyến đi chỉ do một người dùng đặt
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user; // Thông tin người dùng đặt đơn hàng

    @ManyToOne(cascade = CascadeType.ALL) // Mỗi chuyến đi chỉ giao cho một tài xế
    @JoinColumn(name = "driver_id")
    @JsonIgnore
    @ToString.Exclude
    private Driver driver; // Thông tin tài xế nhận đơn hàng

    @ManyToOne // Mỗi chuyến đi chỉ giao một nhà hàng
    @JoinColumn(name = "restaurant_id")
    @JsonIgnore
    private Restaurant restaurant; // Thông tin nhà hàng

    @JsonIgnore
    @OneToMany(mappedBy = "ride", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DeclinedDriver> declinedDrivers = new ArrayList<>(); // Danh sách các tài xế từ chối nhận đơn hàng

    @Column(nullable = false)
    private double restaurantLatitude; // Vĩ độ của nhà hàng

    @Column(nullable = false)
    private double restaurantLongitude; // Kinh độ của nhà hàng

    @Column(nullable = false)
    private double destinationLatitude; // Vĩ độ của điểm giao đồ ăn (nhà của khách hàng)

    @Column(nullable = false)
    private double destinationLongitude; // Kinh độ của điểm giao đồ ăn (nhà của khách hàng)

    @Column(length = 255, nullable = false)
    private String userAddress; // Địa chỉ nhà của khách hàng

    @Column(length = 255, nullable = false)
    private String restaurantAddress; // Địa chỉ nhà hàng

    @Column(length = 255, nullable = false)
    private String destinationAddress; // Địa chỉ nhà của khách hàng

    private double driverStopLatitude; // Vĩ độ của điểm dừng tài xế hiện tại

    private double driverStopLongitude; // Kinh độ của điểm dừng tài xế hiện tại

    private double distance; // Khoảng cách từ nhà hàng đến nhà của khách hàng

    private Long duration; // Thời gian từ nhà hàng đến nhà của khách hàng

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RIDE_STATUS status = RIDE_STATUS.REQUESTED; // Trạng thái của đơn hàng, ban đầu là REQUESTED (chờ tài xế nhận đơn)

    @Column(nullable = false)
    private LocalDateTime startTime; // Thời gian bắt đầu giao hàng

    // Thời gian kết thúc giao hàng
    private LocalDateTime endTime; // Thời gian kết thúc giao hàng

    // Giá cước
    private Long fare; // Giá cước

    private Long total;

    @ElementCollection // Đánh dấu là một collection của các phần tử, không phải một entity riêng biệt
    @Column(length = 1000) // Độ dài tối đa của mỗi phần tử
    private List<String> images; // Danh sách các đường dẫn hình ảnh đơn hàng (sau khi thành công hoặc thất bại)
}
