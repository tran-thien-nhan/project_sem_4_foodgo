package com.foodgo.service;

import com.foodgo.model.IngredientCategory;
import com.foodgo.model.IngredientsItem;

import java.util.List;

public interface IngredientService {
    public IngredientCategory createIngredientCategory(String name, Long restaurantId) throws Exception;
    public IngredientCategory findIngredientCategoryById(Long id) throws Exception;
    public List<IngredientCategory> findIngredientCategoryByRestaurantId(Long id) throws Exception;
    public IngredientsItem createdIngredientItem(Long restaurantId, String ingredientName, Long categoryId, Long price, int quantity) throws Exception;
    public List<IngredientsItem> findRestaurantIngredients(Long restaurantId) throws Exception;

    public IngredientsItem updateStock(Long id) throws Exception;

    // Tính tổng giá của các nguyên liệu
    public long calculateTotalPrice(List<String> ingredients);

    public IngredientsItem findIngredientById(Long id);

    //findIngredientByName
    public IngredientsItem findIngredientByName(String name);

    //findByFoodIdAndIngredientName
    //public IngredientsItem findByFoodIdAndIngredientName(Long foodId, String ingredientName);
}
