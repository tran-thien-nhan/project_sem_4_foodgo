package com.foodgo.repository;

import com.foodgo.model.IngredientsItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IngredientItemRepository extends JpaRepository<IngredientsItem, Long> {
    List<IngredientsItem> findByRestaurantId(Long id);

    Optional<IngredientsItem> findByName(String name);
}
