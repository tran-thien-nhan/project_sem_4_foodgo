package com.foodgo.service;

import com.foodgo.model.Category;
import com.foodgo.model.Restaurant;
import com.foodgo.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImp implements CategoryService{
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private RestaurantService restaurantService;
    @Override
    public Category createCategory(String name, Long userId) throws Exception {
        Restaurant restaurant = restaurantService.getRestaurantByUserId(userId); // tìm nhà hàng theo id người dùng
        Category category = new Category(); // tạo mới một category
        category.setName(name); // set tên cho category
        category.setRestaurant(restaurant); // set nhà hàng cho category
        return categoryRepository.save(category); // lưu category vào database
    }

    @Override
    public List<Category> findCategoryByRestaurantId(Long id) throws Exception {
        Restaurant restaurant = restaurantService.findRestaurantById(id); // tìm nhà hàng theo id
        return categoryRepository.findByRestaurantId(restaurant.getId()); // trả về danh sách category của nhà hàng
    }

    @Override
    public Category findCategoryById(Long id) throws Exception {
        Optional<Category> optionalCategory = categoryRepository.findById(id); // tìm category theo id
        if (optionalCategory.isEmpty()) { // nếu không tìm thấy category
            throw new Exception("Category not found"); // ném ra lỗi
        }
        return optionalCategory.get(); // trả về category
    }
}
