package com.foodgo.model;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    private Food food; //một order item chỉ có một food

    private int quantity;

    private Long totalPrice;

    //@ElementCollection //lưu trữ danh sách các thành phần của một món ăn
    private List<String> ingredients;
}
