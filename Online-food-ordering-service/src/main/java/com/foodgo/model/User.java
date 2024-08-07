package com.foodgo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.foodgo.dto.EventDto;
import com.foodgo.dto.RestaurantDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.*;

@Entity //nghĩa là class này sẽ tương tác với database
@Data //tự động tạo getter, setter, toString, equals, hashCode
@AllArgsConstructor //tự động tạo constructor có tham số
@NoArgsConstructor //tự động tạo constructor không có tham số
public class User {
    @Id //nghĩa là id là primary key
    @GeneratedValue (strategy = GenerationType.AUTO) //tự động tăng giá trị id
    private Long id;

    private String fullName;

    private String email;

    private String phone;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY) //chỉ cho phép ghi, không cho phép đọc
    @Column(nullable = true) //cho phép null
    private String password;

    private USER_ROLE role = USER_ROLE.ROLE_CUSTOMER; //mặc định role là ROLE_CUSTOMER

    private PROVIDER provider = PROVIDER.NORMAL; //mặc định provider là NORMAL

    @JsonIgnore //tránh lặp vô hạn, không lấy thông tin của orders, chỉ lấy thông tin của user
    @OneToMany(cascade = CascadeType.ALL, mappedBy = "customer") //một user có thể có nhiều order, khi xóa user thì xóa hết order, mappedBy trỏ tới customer trong Order
//    @ToString.Exclude
    private List<Order> orders = new ArrayList<>(); //mảng chứa thông tin các order

    @ElementCollection //tạo bảng mới chứa thông tin favorites, không cần tạo class mới
    private List<RestaurantDto> favorites = new ArrayList(); //mảng chứa thông tin các nhà hàng yêu thích

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "user_event",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "event_id")
    )
    private List<Event> events = new ArrayList<>();

    @ElementCollection //tạo bảng mới chứa thông tin favoriteEventsDto, không cần tạo class mới
    private List<EventDto> favoriteEventsDto = new ArrayList<>();

    @JsonIgnore //tránh lặp vô hạn, không lấy thông tin của addresses, chỉ lấy thông tin của user
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true, mappedBy = "user") //một user có thể có nhiều địa chỉ, khi xóa user thì xóa hết địa chỉ, orphanRemoval xóa địa chỉ khi không có user nào sử dụng
//    @ToString.Exclude
    private List<Address> addresses = new ArrayList<>(); //mảng chứa thông tin các địa chỉ

    private String resetPasswordToken;
    private Date resetPasswordExpires;

    private Boolean shipperInfoFilled = false;

    @ElementCollection //tạo bảng mới chứa thông tin previousPasswords, không cần tạo class mới
    private List<String> previousPasswords = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
//    @ToString.Exclude
    private List<TwoFactorCode> twoFaCodes = new ArrayList<>();
}
