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
public class Driver {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;
    private String email;
    private String phone;
    private String password;

    @ElementCollection // Đánh dấu là một collection của các phần tử, không phải một entity riêng biệt
    @Column(length = 1000) // Độ dài tối đa của mỗi phần tử
    private List<String> imageOfDriver;

    private Double rating = 0.0;
    private Double latitude = 0.0;
    private Double longitude = 0.0;

    private USER_ROLE role = USER_ROLE.ROLE_SHIPPER;

    private boolean isAvailable = false;

    @OneToOne(mappedBy = "driver", cascade = CascadeType.ALL)
    private License license; // Một driver chỉ có một license

    @JsonIgnore
    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Ride> rides;

    @OneToOne(mappedBy = "driver", cascade = CascadeType.ALL, orphanRemoval = true)
    private Vehicle vehicle; // Một driver chỉ có một vehicle

    @JsonIgnore
    @OneToOne(cascade = CascadeType.ALL)
    private Ride currentRide;

    private Long totalRevenue = 0L;

    @JsonIgnore
    @OneToMany(mappedBy = "driver", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DeclinedDriver> declinedDrivers;

    @OneToOne // Thêm liên kết tới User
    private User driver;
}
