package com.foodgo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data // Tự động tạo getter, setter, toString, equals, hashCode
@Entity // Đánh dấu là một entity
@NoArgsConstructor // Tự động tạo constructor không có tham số
@AllArgsConstructor // Tự động tạo constructor có tham số
public class Address {
    @Id //nghĩa là id là primary key
    @GeneratedValue(strategy = GenerationType.AUTO) //tự động tăng giá trị id
    private Long id;

    private String city;

    private String streetAddress;

    private String state;

    private String pinCode;

    private String country;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
