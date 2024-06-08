package com.foodgo.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Cart {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToOne
    private User customer; // Một giỏ hàng chỉ thuộc về một người dùng

    private Long total; // Tổng tiền của giỏ hàng

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    // Một giỏ hàng có nhiều món ăn, mappedBy trỏ tới cart trong CartItem
    // Khi xóa giỏ hàng thì xóa hết món ăn, orphanRemoval xóa món ăn khi không có giỏ hàng nào sử dụng
    // CascadeType.ALL tức là khi thực hiện các thao tác CRUD trên giỏ hàng thì cũng thực hiện các thao tác tương ứng trên món ăn
    // orphanRemoval = true tức là khi một món ăn không thuộc giỏ hàng nào thì xóa món ăn đó
    private List<CartItem> cartItems = new ArrayList<>(); // Danh sách các món ăn trong giỏ hàng


}
