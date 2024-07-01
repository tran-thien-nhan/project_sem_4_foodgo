package com.foodgo.service;

import com.foodgo.model.Category;
import com.foodgo.model.Food;
import com.foodgo.model.Restaurant;
import com.foodgo.repository.FoodRepository;
import com.foodgo.request.CreateFoodRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FoodServiceImp implements FoodService{

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private CategoryService categoryService;

    @Override
    public Food createFood(CreateFoodRequest req,  Category category, Restaurant restaurant) throws Exception {
        Food food = new Food();
        //Category findCategory = categoryService.findCategoryById(category.getId());

        food.setFoodCategory(category);
        //food.setFoodCategory(findCategory);
        food.setRestaurant(restaurant);
        food.setDescription(req.getDescription());
        food.setImages(req.getImages());
        food.setName(req.getName());
        food.setPrice(req.getPrice());
        food.setIngredients(req.getIngredients());
        food.setSeasonal(req.isSeasional());
        food.setVegetarian(req.isVegetarian());
        food.setAvailable(false);
        food.setCreationDate(new Date());

        Food savedFood = foodRepository.save(food);
        restaurant.getFoods().add(savedFood);

        return savedFood;
    }

    @Override
    public void deleteFood(Long foodId) throws Exception {
        Food food = findFoodById(foodId);
        if (food == null) {
            throw new Exception("Food not found");
        }
        food.setRestaurant(null);
        foodRepository.save(food);
    }

    @Override
    public List<Food> getRestaurantsFood(Long restaurantId,
                                         boolean isVegetarian,
                                         boolean isNonVegan,
                                         boolean isSeasonal,
                                         String foodCategory) {
        List<Food> foods = foodRepository.findByRestaurantId(restaurantId); // lấy tất cả món ăn của nhà hàng

        if (isVegetarian) { // nếu người dùng chọn lọc món ăn chay
            foods = filterByVegetarian(foods, isVegetarian); // lọc món ăn chay
        }
        if (isNonVegan) { // nếu người dùng chọn lọc món ăn không chay
            foods = filterByNonVegan(foods, !isNonVegan); // lọc món ăn không chay
        }
        if (isSeasonal) { // nếu người dùng chọn lọc món ăn theo mùa
            foods = filterBySeasonal(foods, isSeasonal); // lọc món ăn theo mùa
        }
        if (foodCategory != null && !foodCategory.equals("")) { // nếu người dùng chọn lọc món ăn theo danh mục
            foods = filterByCategory(foods, foodCategory); // lọc món ăn theo danh mục
        }

        return foods;
    }

    private List<Food> filterByCategory(List<Food> foods, String foodCategory) {
        return foods.stream().filter(food -> {
            if (food.getFoodCategory() != null) { // nếu món ăn có danh mục
                return food.getFoodCategory().getName().equals(foodCategory); // lọc món ăn theo danh mục
            }
            return false; // không có danh mục
        }).collect(Collectors.toList()); // lọc món ăn theo danh mục
    }

    private List<Food> filterBySeasonal(List<Food> foods, boolean isSeasonal) {
        return foods.stream().filter(food -> food.isSeasonal() == isSeasonal).collect(Collectors.toList()); // lọc món ăn theo mùa
    }

    private List<Food> filterByNonVegan(List<Food> foods, boolean isNonVegan) {
        return foods.stream().filter(food -> food.isVegetarian() == false).collect(Collectors.toList()); // lọc món ăn không chay
    }

    private List<Food> filterByVegetarian(List<Food> foods, boolean isVegetarian) {
        return foods.stream().filter(food -> food.isVegetarian() == isVegetarian).collect(Collectors.toList()); // lọc món ăn chay
    }

    @Override
    public List<Food> searchFood(String keyword) {
        return foodRepository.searchFood(keyword); // tìm món ăn theo tên
    }

    @Override
    public Food findFoodById(Long id) throws Exception {
        Optional<Food> optionalFood = foodRepository.findById(id); // tìm món ăn theo id
        //vì sao chọn Optional<T> trong Java?
        //Optional<T> trong Java là một lớp được thiết kế để giải quyết vấn đề về NullPointerException trong Java.
        //Nó cung cấp một cách để kiểm tra giá trị null trước khi sử dụng nó.
        //Nó là một cách tốt để giúp tránh NullPointerException trong Java.

        if (optionalFood.isEmpty()) { // nếu không tìm thấy món ăn
            throw new Exception("Food not found"); // ném ra ngoại lệ "Food not found"
        }
        return optionalFood.get(); // trả về món ăn
    }

    @Override
    public Food updateAvailabilityStatus(Long foodId) throws Exception {
        Food food = findFoodById(foodId); // tìm món ăn theo id
        if (food == null) { // nếu không tìm thấy món ăn
            throw new Exception("Food not found"); // ném ra ngoại lệ "Food not found"
        }
        food.setAvailable(!food.isAvailable()); // cập nhật trạng thái món ăn
        return foodRepository.save(food); // lưu món ăn
    }

    @Override
    public Food updateFood(Long foodId, CreateFoodRequest updatedFood) throws Exception {
        Food food = findFoodById(foodId); // tìm món ăn theo id
        if (food == null) { // nếu không tìm thấy món ăn
            throw new Exception("Food not found"); // ném ra ngoại lệ "Food not found"
        }
        food.setName(updatedFood.getName()); // cập nhật tên món ăn
        food.setDescription(updatedFood.getDescription()); // cập nhật mô tả món ăn
        food.setPrice(updatedFood.getPrice()); // cập nhật giá món ăn
        food.setImages(updatedFood.getImages()); // cập nhật hình ảnh món ăn
        food.setVegetarian(updatedFood.isVegetarian()); // cập nhật trạng thái chay
        food.setSeasonal(updatedFood.isSeasional()); // cập nhật trạng thái mùa
        food.setIngredients(updatedFood.getIngredients()); // cập nhật nguyên liệu món ăn

        return foodRepository.save(food); // lưu món ăn
    }
}
