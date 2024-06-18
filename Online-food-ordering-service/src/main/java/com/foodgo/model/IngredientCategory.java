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
public class IngredientCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    @JsonIgnore // Không trả về thông tin này khi gửi response
    @ManyToOne // Một loại nguyên liệu có nhiều món ăn, một món ăn chỉ thuộc một loại nguyên liệu
    private Restaurant restaurant;

    @JsonIgnore
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL) // Một loại nguyên liệu có nhiều nguyên liệu, mappedBy trỏ tới category trong IngredientsItem
    private List<IngredientsItem> ingredients = new ArrayList<>();
}
