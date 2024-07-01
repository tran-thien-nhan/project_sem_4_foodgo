package com.foodgo.request;

import lombok.Data;

import java.util.List;

@Data
public class UpdateCartItemRequesst {
    private Long cartItemId;
    private int quantity;
    //private List<String> ingredients;
    private Long ingredientsTotalPrice;
}
