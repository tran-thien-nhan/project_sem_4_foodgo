package com.foodgo.repository;

import com.foodgo.model.IngredientCategory;
import com.foodgo.model.IngredientsItem;
import com.foodgo.model.Restaurant;
import com.foodgo.service.IngredientService;
import com.foodgo.service.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IngredientServiceImp implements IngredientService {
    @Autowired
    private IngredientItemRepository ingredientItemRepository;

    @Autowired
    private IngredientCategoryRepository ingredientCategoryRepository;

    @Autowired
    private RestaurantService restaurantService;
    @Override
    public IngredientCategory createIngredientCategory(String name, Long restaurantId) throws Exception {
        Restaurant restaurant = restaurantService.findRestaurantById(restaurantId);
        IngredientCategory category = new IngredientCategory();
        category.setName(name);
        category.setRestaurant(restaurant);
        return ingredientCategoryRepository.save(category);
    }

    @Override
    public IngredientCategory findIngredientCategoryById(Long id) throws Exception {
        Optional<IngredientCategory> opt = ingredientCategoryRepository.findById(id);
        if (opt.isEmpty()) {
            throw new Exception("Category not found");
        }
        return opt.get();
    }

    @Override
    public List<IngredientCategory> findIngredientCategoryByRestaurantId(Long id) throws Exception {
        restaurantService.findRestaurantById(id);
        return ingredientCategoryRepository.findByRestaurantId(id);
    }

    @Override
    public IngredientsItem createdIngredientItem(Long restaurantId, String ingredientName, Long categoryId, Long price, int quantity) throws Exception {
        Restaurant restaurant = restaurantService.findRestaurantById(restaurantId); // tìm nhà hàng theo id người dùng
        IngredientCategory category = findIngredientCategoryById(categoryId); // tìm category theo id

        IngredientsItem item = new IngredientsItem(); // tạo mới một ingredient item
        item.setName(ingredientName); // set tên cho ingredient item
        item.setCategory(category); // set category cho ingredient item
        item.setRestaurant(restaurant); // set nhà hàng cho ingredient item
        item.setPrice(price); // set giá cho ingredient item
        item.setQuantity(quantity); // set số lượng cho ingredient item

        IngredientsItem ingredient = ingredientItemRepository.save(item); // lưu ingredient item vào database
        category.getIngredients().add(ingredient); // thêm ingredient item vào danh sách ingredient của category
        return ingredient; // trả về ingredient item
    }

    @Override
    public List<IngredientsItem> findRestaurantIngredients(Long restaurantId) throws Exception {
        return ingredientItemRepository.findByRestaurantId(restaurantId); // trả về danh sách ingredient item của nhà hàng
    }

    @Override
    public IngredientsItem updateStock(Long id) throws Exception {
        Optional<IngredientsItem> optinalIngredientsItem = ingredientItemRepository.findById(id); // tìm ingredient item theo id
        if (optinalIngredientsItem.isEmpty()) { // nếu không tìm thấy ingredient item
            throw new Exception("Ingredient item not found"); // ném ra lỗi
        }
        IngredientsItem ingredientsItem = optinalIngredientsItem.get(); // lấy ingredient item
        ingredientsItem.setInStoke(!ingredientsItem.isInStoke()); // cập nhật trạng thái ingredient item
        return ingredientItemRepository.save(ingredientsItem); // lưu ingredient item vào database
    }

    @Override
    public long calculateTotalPrice(List<String> ingredients) {
        long total = 0; // khởi tạo total
        for (String ingredientName : ingredients) { // duyệt qua từng tên nguyên liệu
            // Tìm ingredient theo tên
            IngredientsItem ingredient = findIngredientByName(ingredientName);
            if (ingredient != null) {
                total += ingredient.getPrice(); // cộng giá của ingredient vào tổng
            } else {
                throw new RuntimeException("Ingredient not found: " + ingredientName); // báo lỗi nếu không tìm thấy ingredient
            }
        }
        return total; // trả về total
    }

    @Override
    public IngredientsItem findIngredientById(Long id) {
        Optional<IngredientsItem> opt = ingredientItemRepository.findById(id); // tìm ingredient item theo id
        return opt.orElse(null); // trả về ingredient item hoặc null nếu không tìm thấy
    }

    @Override
    public IngredientsItem findIngredientByName(String name) {
        return ingredientItemRepository.findByName(name) // tìm ingredient item theo tên
                .orElseThrow(() -> new RuntimeException("Ingredient not found: " + name)); // ném ra lỗi nếu không tìm thấy
    }

//    private IngredientsItem findIngredientByName(String name) {
//        return ingredientItemRepository.findByName(name)
//                .orElseThrow(() -> new RuntimeException("Ingredient not found: " + name));
//    }
}
