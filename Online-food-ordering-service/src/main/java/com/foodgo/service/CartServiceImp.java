package com.foodgo.service;

import com.foodgo.model.*;
import com.foodgo.repository.CartItemRepository;
import com.foodgo.repository.CartRepository;
import com.foodgo.repository.IngredientItemRepository;
import com.foodgo.request.AddCartItemRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartServiceImp implements CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private FoodService foodService;

    @Autowired
    private IngredientService ingredientService;

    @Autowired
    private IngredientItemRepository ingredientsItemRepository;

    @Override
    public CartItem addItemToCart(AddCartItemRequest req, String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt); // dùng để lấy id của user từ jwt token
        Food food = foodService.findFoodById(req.getFoodId()); // dùng để lấy food từ id của food
        Cart cart = cartRepository.findByCustomerId(user.getId()); // dùng để lấy cart của user

        // Tính giá thêm của các thành phần nguyên liệu
        //Long additionalPrice = ingredientService.calculateTotalPrice(req.getIngredientsItems());
        // Lấy các ingredients được chọn

        // Kiểm tra xem food đã có trong cart chưa, nếu có thì kiểm tra thành phần nguyên liệu
        for (CartItem cartItem : cart.getCartItems()) {
            if (cartItem.getFood().equals(food)) {
                // So sánh thành phần nguyên liệu
                if (cartItem.getIngredients().equals(req.getIngredients())) {
                    // Nếu cùng thành phần nguyên liệu, tăng số lượng
                    int newQuantity = cartItem.getQuantity() + req.getQuantity();
                    //return updateCartItemQuantity(cartItem.getId(), newQuantity, req.getTotalPrice());
                    return updateCartItemQuantity(cartItem.getId(), newQuantity, req.getIngredientsTotalPrice());
                }
            }
        }

        // Nếu cùng food nhưng khác ingredient thì tạo mới
        CartItem newCartItem = new CartItem(); // nếu chưa có thì tạo mới
        newCartItem.setFood(food); // set food
        newCartItem.setQuantity(req.getQuantity()); // set số lượng
        newCartItem.setCart(cart); // set cart
        newCartItem.setIngredients(req.getIngredients()); // set ingredients
        //newCartItem.setTotalPrice(food.getPrice() * req.getQuantity()); // set total price
        newCartItem.setTotalPrice(req.getTotalPrice() * req.getQuantity()); // set total price

        CartItem savedCartItem = cartItemRepository.save(newCartItem); // lưu cart item
        cart.getCartItems().add(savedCartItem); // thêm cart item vào cart

        return savedCartItem; // trả về cart item
    }


    @Override
    public CartItem updateCartItemQuantity(Long cartItemId, int quantity, Long ingredientsTotalPrice) throws Exception {
        Optional<CartItem> cartItemOptional = cartItemRepository.findById(cartItemId); // tìm cart item theo id
        if (cartItemOptional.isEmpty()) { // nếu không tìm thấy thì báo lỗi
            throw new Exception("Cart item not found"); // báo lỗi
        }

        CartItem cartItem = cartItemOptional.get(); // lấy ra cart item
        cartItem.setQuantity(quantity); // cập nhật số lượng


        cartItem.setTotalPrice((cartItem.getFood().getPrice() + ingredientsTotalPrice) * quantity); // cập nhật total price
        return cartItemRepository.save(cartItem); // lưu cart item
    }

    @Override
    public Cart removeItemFromCart(Long cartItemId, String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt); // lấy user từ jwt token
        Cart cart = cartRepository.findByCustomerId(user.getId()); // lấy cart của user
        Optional<CartItem> cartItemOptional = cartItemRepository.findById(cartItemId); // tìm cart item theo id
        if (cartItemOptional.isEmpty()) { // nếu không tìm thấy thì báo lỗi
            throw new Exception("Cart item not found"); // báo lỗi
        }

        CartItem cartItem = cartItemOptional.get(); // lấy ra cart item
        cart.getCartItems().remove(cartItem); // xóa cart item khỏi cart
        cartItemRepository.delete(cartItem); // xóa cart item
        return cart; // trả về cart
    }

    @Override
    public Long calculateCartTotals(Cart cart) throws Exception {
        Long total = 0L; // khởi tạo total
        for (CartItem cartItem : cart.getCartItems()) { // duyệt qua từng cart item
            total += cartItem.getTotalPrice(); // cộng vào total
        }
        return total; // trả về total
    }

    @Override
    public Cart findCartById(Long id) throws Exception {
        Optional<Cart> cartOptional = cartRepository.findById(id); // tìm cart theo id
        if (cartOptional.isEmpty()) { // nếu không tìm thấy thì báo lỗi
            throw new Exception("Cart not found with id: " + id); // báo lỗi
        }
        return cartOptional.get(); // trả về cart
    }

    @Override
    public Cart findCartByUserId(Long userId) throws Exception {
        //User user = userService.findUserByJwtToken(jwt); // lấy user từ jwt token
        Cart cart = cartRepository.findByCustomerId(userId); // lấy cart của user
        cart.setTotal(calculateCartTotals(cart)); // tính total
        return cart; // trả về cart
    }

    @Override
    public Cart clearCart(Long userId) throws Exception {
        //User user = userService.findUserByJwtToken(jwt); // lấy user từ jwt token
        Cart cart = findCartByUserId(userId); // lấy cart của user (đã viết ở trên)
        cart.getCartItems().clear(); // xóa hết cart item
        return cartRepository.save(cart); // lưu cart
    }

    @Override
    public Cart removeIngredientFromCart(Long cartItemId, Long ingredientId) throws Exception {
        Optional<CartItem> cartItemOptional = cartItemRepository.findById(cartItemId); // tìm cart item theo id
        if (cartItemOptional.isEmpty()) { // nếu không tìm thấy thì báo lỗi
            throw new Exception("Cart item not found"); // báo lỗi
        }

        CartItem cartItem = cartItemOptional.get(); // lấy ra cart item
        List<String> ingredientNames = cartItem.getIngredients(); // lấy ra danh sách tên ingredients

        // Chuyển đổi danh sách tên ingredients thành danh sách IngredientsItem
        List<IngredientsItem> ingredients = ingredientNames.stream()
                .map(name -> findIngredientByName(name)) // Giả sử bạn có phương thức này để tìm IngredientsItem theo tên
                .collect(Collectors.toList());

        // Lọc ra ingredient không phải ingredientId
        ingredients = ingredients.stream().filter(ingredient -> !ingredient.getId().equals(ingredientId)).collect(Collectors.toList());

        // Chuyển đổi ngược lại từ danh sách IngredientsItem sang danh sách tên ingredients
        ingredientNames = ingredients.stream()
                .map(IngredientsItem::getName)
                .collect(Collectors.toList());

        cartItem.setIngredients(ingredientNames); // set lại danh sách tên ingredients
        Long totalPriceIngredients = ingredientService.calculateTotalPrice(ingredientNames); // tính lại giá thành phần nguyên liệu
        cartItem.setTotalPrice((cartItem.getFood().getPrice() + totalPriceIngredients) * cartItem.getQuantity()); // tính lại total price
        return cartItemRepository.save(cartItem).getCart(); // lưu cart item và trả về cart
    }

    private IngredientsItem findIngredientByName(String name) {
        return findByName(name).orElseThrow(() -> new RuntimeException("Ingredient not found"));
    }

    private Optional<IngredientsItem> findByName(String name) {
        return ingredientsItemRepository.findByName(name);
    }
}
