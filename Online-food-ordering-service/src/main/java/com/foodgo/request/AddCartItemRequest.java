package com.foodgo.request;

import com.foodgo.model.IngredientsItem;
import lombok.Data;

import java.util.List;

@Data
public class AddCartItemRequest {
    private Long foodId;
    private int quantity;
    private List<String> ingredients;
    //private List<IngredientsItem> ingredientsItems;
}
