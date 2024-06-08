package com.foodgo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity //nghĩa là class này sẽ tương tác với database
@Data //tự động tạo getter, setter, toString, equals, hashCode
@AllArgsConstructor //tự động tạo constructor có tham số
@NoArgsConstructor //tự động tạo constructor không có tham số
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String code;
    private int discount;
    private boolean active;
    private int maxDiscount;
    private int minOrder;
    private int maxOrder;
    private int maxUse;
    private int currentUse;
    private String description;
    private String startDate;
    private String endDate;
    private boolean isPercent;
    private boolean isFreeShip;
    private boolean isForCustomer;
    private boolean isForRestaurant;
    private boolean isForAll;
    private boolean isForNewCustomer;
    private boolean isForOldCustomer;
    private boolean isForVipCustomer;
}
