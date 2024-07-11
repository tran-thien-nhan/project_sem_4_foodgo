package com.foodgo.service;

import com.foodgo.model.*;
import com.foodgo.repository.*;
import com.foodgo.request.OrderRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class OrderServiceImp implements OrderService{

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private AddressService addressService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartService cartService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private IngredientItemRepository ingredientItemRepository;

    @Autowired
    private IngredientService ingredientService;

    @Autowired
    private FoodRepository foodRepository;

    @Override
    public List<Order> createOrder(OrderRequest order, User user) throws Exception {
        try{
            Address shipAddress = order.getDeliveryAddress();

            Address savedAddress = addressService.findByStreetAddressAndCityAndStateAndPinCode(
                    shipAddress.getStreetAddress(),
                    shipAddress.getCity(),
                    shipAddress.getState(),
                    shipAddress.getPinCode(),
                    user.getId()
            );

            if (savedAddress == null) {
                savedAddress = addressRepository.save(shipAddress);
                user.getAddresses().add(savedAddress);
                userRepository.save(user);
            }

            Cart cart = cartService.findCartByUserId(user.getId());

            // Nhóm các món ăn theo nhà hàng
            Map<Restaurant, List<CartItem>> itemsGroupedByRestaurant = cart.getCartItems().stream()
                    .collect(Collectors.groupingBy(cartItem -> cartItem.getFood().getRestaurant()));

            List<Order> createdOrders = new ArrayList<>();

            for (Map.Entry<Restaurant, List<CartItem>> entry : itemsGroupedByRestaurant.entrySet()) {
                Restaurant restaurant = entry.getKey();
                List<CartItem> cartItems = entry.getValue();

                Order createdOrder = new Order();
                createdOrder.setCustomer(user);
                createdOrder.setCreatedAt(new Date());
                createdOrder.setOrderStatus("PENDING");
                createdOrder.setDeliveryAddress(savedAddress);
                createdOrder.setRestaurant(restaurant);

                List<OrderItem> orderItems = new ArrayList<>();
                int count = 0;
                long totalAmount = 0;

                for (CartItem cartItem : cartItems) { // Duyệt qua từng món ăn trong giỏ hàng
                    OrderItem orderItem = new OrderItem();
                    orderItem.setFood(cartItem.getFood());
                    orderItem.setIngredients(cartItem.getIngredients());
                    orderItem.setQuantity(cartItem.getQuantity());
                    count += cartItem.getQuantity();
                    orderItem.setTotalPrice(cartItem.getTotalPrice());
                    OrderItem savedOrderItem = orderItemRepository.save(orderItem);
                    orderItems.add(savedOrderItem);
                    totalAmount += cartItem.getTotalPrice();

                    // Trừ đi số lượng nguyên liệu
                    for (String ingredient : cartItem.getIngredients()) {
                        IngredientsItem item = ingredientService.findIngredientByName(ingredient);
                        item.setQuantity(item.getQuantity() - cartItem.getQuantity());
                        if (item.getQuantity() < 10) {
                            item.setInStoke(false);
                        }
                        ingredientItemRepository.save(item);
                    }

                    // tìm food
                Food food = foodRepository.findById(cartItem.getFood().getId()).get();
                food.setTotalBought(food.getTotalBought() + cartItem.getQuantity());
                foodRepository.save(food);
                }

                createdOrder.setTotalItem(Long.valueOf(count));
                createdOrder.setTotalAmount(totalAmount);

                long totalPrice = totalAmount + 18000; // delivery charge
                createdOrder.setItems(orderItems);
                createdOrder.setTotalPrice(totalPrice);
                createdOrder.setPaymentMethod(order.getPaymentMethod());

                if (order.getPaymentMethod().contains("BY_CASH")) {
                    createdOrder.setIsPaid(true);
                }

                Order savedOrder = orderRepository.save(createdOrder);

                if (createdOrder.getIsPaid()) {
                    restaurant.getOrders().add(savedOrder);
                }

                createdOrders.add(savedOrder);
            }

            // clear cart
            cartService.clearCart(user.getId());

            return createdOrders;
        }
        catch (Exception e){
            throw new Exception("Error creating order: " + e.getMessage());
        }
    }

    @Override
    public Long getTotalPrice(User user) throws Exception {
        Cart cart = cartService.findCartByUserId(user.getId());
        return cartService.calculateCartTotals(cart);
    }

    @Override
    public Order toggleOrderPaymentStatus(Long orderId) throws Exception {
        Order order = findOrderById(orderId);
        order.setIsPaid(true);
        order.setOrderStatus("PENDING");
//        // tìm cart
//        Cart cart = cartService.findCartByUserId(order.getCustomer().getId());
//        // neu cart khong rong
//        if (cart != null) {
//            // xóa cart
//            cartService.clearCart(cart.getId());
//            // thêm order vào danh sách order của restaurant
//            Restaurant restaurant = restaurantService.findRestaurantById(order.getRestaurant().getId());
//            restaurant.getOrders().add(order);
//        }

        return orderRepository.save(order);
    }
    @Override
    public Order updateOrder(Long orderId, ORDER_STATUS newStatus) throws Exception {
        Order order = findOrderById(orderId);

        ORDER_STATUS currentStatus = ORDER_STATUS.valueOf(order.getOrderStatus());

        if (currentStatus.canTransitionTo(newStatus)) {
            order.setOrderStatus(newStatus.toString());
            return orderRepository.save(order);
        } else {
            throw new Exception("Invalid order status transition");
        }
    }


    @Override
    public void cancelOrder(Long orderId) throws Exception {
        Order order = findOrderById(orderId);
        orderRepository.delete(order);
    }

    @Override
    public List<Order> getUserOrders(Long userId) throws Exception {
        return orderRepository.findByCustomerId(userId);
    }

    @Override
    public List<Order> getRestaurantsOrder(Long restaurantId, String orderStatus) throws Exception {
        List<Order> orders = orderRepository.findByRestaurantId(restaurantId);
        if (orderStatus != null) {
            orders = orders.stream()
                    .filter(order -> order.getOrderStatus().equals(orderStatus))
                    .collect(Collectors.toList());
        }
        return orders;
    }

    @Override
    public List<Order> getRestaurantsAllOrder(Long restaurantId) throws Exception {
        return orderRepository.findByRestaurantId(restaurantId);
    }

    @Override
    public Order findOrderById(Long orderId) throws Exception {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isEmpty()) {
            throw new Exception("Order not found with id: " + orderId);
        }
        return optionalOrder.get();
    }

    // xóa hết tat ca order có isPaid = false
    @Override
    public void clearUnpaidOrders(Long userId) {
        List<Order> userOrders = orderRepository.findByCustomerId(userId);
        for (Order order : userOrders) {
            if (!order.getIsPaid()) {
                // Xóa tất cả OrderItem trong đơn hàng chưa thanh toán
                for (OrderItem item : order.getItems()) {
                    orderItemRepository.delete(item);
                }
                // Sau khi xóa các OrderItem, xóa luôn đơn hàng
                orderRepository.delete(order);
            }
        }
    }

    @Override
    public String refundOrder(Long orderId) throws Exception {
        Order order = findOrderById(orderId);

        if(order.getPaymentMethod().contains("BY_CASH")){
            String paymentIntentId = PAYMENT_METHOD.BY_CASH.toString();
            String refundStatus = "succeeded";
            order.setOrderStatus("CANCELLED_REFUNDED");
            order.setPaymentIntentId(paymentIntentId);
            orderRepository.save(order);
            return refundStatus;
        }

        if (order.getIsPaid() && order.getPaymentMethod().contains("BY_CREDIT_CARD")) {
            String paymentIntentId = order.getPaymentIntentId();
            String refundStatus = paymentService.refundPayment(paymentIntentId);

            if ("succeeded".equals(refundStatus)) {
                order.setOrderStatus("CANCELLED_REFUNDED");
                orderRepository.save(order);
            }

            return refundStatus;
        }

        throw new Exception("Order is either not paid or not eligible for refund");
    }
}
