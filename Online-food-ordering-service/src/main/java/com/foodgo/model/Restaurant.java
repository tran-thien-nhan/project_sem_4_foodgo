package com.foodgo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.foodgo.dto.EventDto;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.*;
import java.time.*;

@Data // Tự động tạo getter, setter, toString, equals, hashCode
@Entity // Đánh dấu là một entity
@NoArgsConstructor // Tự động tạo constructor không có tham số
@AllArgsConstructor // Tự động tạo constructor có tham số
public class Restaurant {
    @Id // Đánh dấu là id
    @GeneratedValue(strategy = GenerationType.AUTO) // Tự động tăng giá trị id
    private Long id;

    @OneToOne
    private User owner; // Một nhà hàng chỉ có một chủ nhà hàng

    private String name;

    private String description;

    private String cuisineType;

    private String phone;

    @OneToOne(cascade = CascadeType.ALL) // Một nhà hàng chỉ có một địa chỉ, cascade để thực hiện các thao tác CRUD trên Address
    private Address address; // Một nhà hàng chỉ có một địa chỉ

    @Embedded // Đánh dấu là một phần của entity khác, không phải một entity riêng biệt
    private ContactInformation contactInformation; // Thông tin liên hệ của nhà hàng

    private String openingHours; // Giờ mở cửa

    private Double latitude; // Vĩ độ
    private Double longitude; // Kinh độ

    @JsonIgnore
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true) // Một nhà hàng có nhiều order, mappedBy trỏ tới restaurant trong Order
    // Khi xóa nhà hàng thì xóa hết order, orphanRemoval xóa order khi không có nhà hàng nào sử dụng
    @ToString.Exclude
    private List<Order> orders = new ArrayList<>(); // Mảng chứa thông tin các order

    @ElementCollection // Đánh dấu là một collection của các phần tử, không phải một entity riêng biệt
    @Column(length = 1000) // Độ dài tối đa của mỗi phần tử
    private List<String> images; // Mảng chứa đường dẫn ảnh

    private LocalDateTime registrationDate; // Ngày đăng ký

    private boolean open; // Trạng thái mở cửa

    private int totalFavorites = 0;

    @JsonIgnore // Không trả về thông tin này khi gửi response
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL) // Một nhà hàng có nhiều món ăn, mappedBy trỏ tới restaurant trong Food
    @ToString.Exclude
    private List<Food> foods = new ArrayList<>(); // Mảng chứa thông tin các món ăn

    @JsonIgnore
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Rating> ratings = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private List<Event> events = new ArrayList<>(); // Thêm trường này vào để lưu thông tin sự kiện của nhà hàng

    @ElementCollection
    private List<EventDto> eventDto = new ArrayList(); //mảng chứa thông tin các sự kiện yêu thích
}
