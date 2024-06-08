package com.foodgo.service;

import com.foodgo.model.Cart;
import com.foodgo.model.CartItem;
import com.foodgo.model.Food;
import com.foodgo.model.User;
import com.foodgo.repository.CartItemRepository;
import com.foodgo.repository.CartRepository;
import com.foodgo.request.AddCartItemRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

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

    @Override
    public CartItem addItemToCart(AddCartItemRequest req, String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt); // dùng để lấy id của user từ jwt token
        Food food = foodService.findFoodById(req.getFoodId()); // dùng để lấy food từ id của food
        Cart cart = cartRepository.findByCustomerId(user.getId()); // dùng để lấy cart của user
        for (CartItem cartItem : cart.getCartItems()) { // kiểm tra xem food đã có trong cart chưa
            if (cartItem.getFood().equals(food)) { // nếu có rồi thì tăng số lượng
                int newQuantity = cartItem.getQuantity() + req.getQuantity(); // tăng số lượng
                return updateCartItemQuantity(cartItem.getId(), newQuantity); // cập nhật số lượng
            }
        }

        CartItem newCartItem = new CartItem(); // nếu chưa có thì tạo mới
        newCartItem.setFood(food); // set food
        newCartItem.setQuantity(req.getQuantity()); // set số lượng
        newCartItem.setCart(cart); // set cart
        newCartItem.setIngredients(req.getIngredients()); // set ingredients
        newCartItem.setTotalPrice(food.getPrice() * req.getQuantity()); // set total price

        CartItem savedCartItem = cartItemRepository.save(newCartItem); // lưu cart item
        cart.getCartItems().add(savedCartItem); // thêm cart item vào cart

        return savedCartItem; // trả về cart item
    }

    @Override
    public CartItem updateCartItemQuantity(Long cartItemId, int quantity) throws Exception {
        Optional<CartItem> cartItemOptional = cartItemRepository.findById(cartItemId); // tìm cart item theo id
        if (cartItemOptional.isEmpty()) { // nếu không tìm thấy thì báo lỗi
            throw new Exception("Cart item not found"); // báo lỗi
        }

        CartItem cartItem = cartItemOptional.get(); // lấy ra cart item
        cartItem.setQuantity(quantity); // cập nhật số lượng
        cartItem.setTotalPrice(cartItem.getFood().getPrice() * quantity); // cập nhật total price
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
}
