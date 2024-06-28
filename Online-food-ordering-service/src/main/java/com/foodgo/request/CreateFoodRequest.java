package com.foodgo.request;

import com.foodgo.model.Category;
import com.foodgo.model.IngredientsItem;
import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class CreateFoodRequest {
    private String name;
    private String description;
    private Long price;

    private Category category;

    private List<String> images;

    private Long restaurantId;
    private boolean vegetarian;
    private boolean seasional;
    private List<IngredientsItem> ingredients;

}
