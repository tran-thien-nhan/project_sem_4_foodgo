package com.foodgo.request;

import lombok.Data;

@Data
public class IngredientRequest {
    private String name;
    private Long categoryId;
    private Long restaurantId;
    private Long price;
    private int quantity;
}
