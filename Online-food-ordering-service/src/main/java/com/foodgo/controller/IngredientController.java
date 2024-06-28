package com.foodgo.controller;

import com.foodgo.model.IngredientCategory;
import com.foodgo.model.IngredientsItem;
import com.foodgo.request.IngredientCategoryRequest;
import com.foodgo.request.IngredientRequest;
import com.foodgo.service.IngredientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/ingredients")
public class IngredientController {
    @Autowired
    private IngredientService ingredientService;

    @PostMapping("/category")
    public ResponseEntity<IngredientCategory> createIngredientCategory(@RequestBody IngredientCategoryRequest req) throws Exception {
        IngredientCategory ingredientCategory = ingredientService.createIngredientCategory(req.getName(), req.getRestaurantId());
        return new ResponseEntity<>(ingredientCategory, HttpStatus.CREATED);
    }
    @PostMapping
    public ResponseEntity<IngredientsItem> createIngredientItem(@RequestBody IngredientRequest req) throws Exception { // tạo mới một ingredient item
        IngredientsItem item = ingredientService.createdIngredientItem(req.getRestaurantId(), req.getName(), req.getCategoryId(), req.getPrice(), req.getQuantity()); // tạo mới một ingredient item
        return new ResponseEntity<>(item, HttpStatus.CREATED); // trả về ingredient item
    }

    @PutMapping("/{id}/stock")
    public ResponseEntity<IngredientsItem> updateIngredientStock(@PathVariable Long id) throws Exception { // cập nhật số lượng stock của ingredient item
        IngredientsItem item = ingredientService.updateStock(id); // cập nhật số lượng stock của ingredient item
        return new ResponseEntity<>(item, HttpStatus.OK); // trả về ingredient item
    }

    @GetMapping("/restaurant/{id}")
    public ResponseEntity<List<IngredientsItem>> getRestaurantIngredients(@PathVariable Long id) throws Exception {
        List<IngredientsItem> items = ingredientService.findRestaurantIngredients(id);
        return new ResponseEntity<>(items, HttpStatus.OK);
    }

    @GetMapping("/restaurant/{id}/category")
    public ResponseEntity<List<IngredientCategory>> getRestaurantIngredientCategory(@PathVariable Long id) throws Exception {
        List<IngredientCategory> items = ingredientService.findIngredientCategoryByRestaurantId(id);
        return new ResponseEntity<>(items, HttpStatus.OK);
    }
}
