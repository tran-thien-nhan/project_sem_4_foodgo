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
public class Food {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    private String description;

    private Long price;

    @ManyToOne
    private Category foodCategory; //một food chỉ thuộc một category

    @Column(length = 1000)
    @ElementCollection
    private List<String> images;

    private boolean available = false; //món ăn có sẵn hay không

    @ManyToOne
    private Restaurant restaurant; //một food chỉ thuộc một nhà hàng

    private boolean isVegetarian;
    private boolean isSeasonal;

    @ManyToMany //một food có thể thuộc nhiều ingredient, một ingredient có thể thuộc nhiều food
    private List<IngredientsItem> ingredients = new ArrayList<>();

    private Date creationDate;
}
