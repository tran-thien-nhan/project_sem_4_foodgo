package com.foodgo.service;

import com.foodgo.model.Category;
import com.foodgo.model.Food;
import com.foodgo.model.Restaurant;
import com.foodgo.request.CreateFoodRequest;

import java.util.List;

public interface FoodService {
    public Food createFood(CreateFoodRequest req, Category category, Restaurant restaurant) throws Exception;

    void deleteFood(Long foodId) throws Exception;

    public List<Food> getRestaurantsFood(Long restaurantId,
                                         boolean isVegetarian,
                                         boolean isNonVegan,
                                         boolean isSeasonal,
                                         String foodCategory);
    public List<Food> searchFood(String keyword);
    public Food findFoodById(Long id) throws Exception;
    public Food updateAvailabilityStatus(Long foodId) throws Exception;
    public Food updateFood(Long foodId, CreateFoodRequest updatedFood) throws Exception;

    //get all
    public List<Food> getAllFoods();
}
