package com.foodgo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JsonIgnore // Không trả về thông tin này khi gửi response
    private Cart cart; // Một món ăn chỉ thuộc về một giỏ hàng

    @ManyToOne
    private Food food; // Một món ăn chỉ thuộc về một giỏ hàng

    private int quantity; // Số lượng món ăn

    //@ElementCollection // Lưu trữ danh sách các thành phần của một món ăn
    private List<String> ingredients; // Danh sách các thành phần của món ăn

    private Long totalPrice; // Tổng tiền của món ăn

}
