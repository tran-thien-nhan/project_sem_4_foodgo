package com.foodgo.service;

import com.foodgo.model.*;
import com.foodgo.repository.*;
import com.foodgo.request.OrderRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
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

    @Override
    public Order createOrder(OrderRequest order, User user) throws Exception {
        Address shipAddress = order.getDeliveryAddress(); // lay dia chi giao hang tu request
        //Address savedAddress = addressRepository.save(shipAddress); // luu dia chi giao hang

        // kiểm tra xem địa chỉ giao hàng đã có trong danh sách địa chỉ của user chưa
        Address savedAddress = addressService.findByStreetAddressAndCityAndStateAndPinCode(
                shipAddress.getStreetAddress(),
                shipAddress.getCity(),
                shipAddress.getState(),
                shipAddress.getPinCode(),
                user.getId()
        );

        // kiem tra xem dia chi giao hang da co trong danh sach dia chi cua user chua
//        if (!user.getAddresses().contains(savedAddress)) {
//            // neu chua co thi them vao danh sach dia chi cua user
//            user.getAddresses().add(savedAddress);
//            // luu lai user
//            userRepository.save(user);
//        }

        // nếu địa chỉ không tồn tại thì lưu địa chỉ mới
        if (savedAddress == null) {
            savedAddress = addressRepository.save(shipAddress);
            // thêm vào danh sách địa chỉ của user
            user.getAddresses().add(savedAddress);
            // lưu lại user
            userRepository.save(user);
        }

        Restaurant restaurant = restaurantService.findRestaurantById(order.getRestaurantId());
        Order createdOrder = new Order();
        createdOrder.setCustomer(user);
        createdOrder.setCreatedAt(new Date());
        createdOrder.setOrderStatus("PENDING");
        createdOrder.setDeliveryAddress(savedAddress);
        createdOrder.setRestaurant(restaurant);

        Cart cart = cartService.findCartByUserId(user.getId());
        List<OrderItem> orderItems = new ArrayList<>();
        int count = 0;
        for (CartItem cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();

            orderItem.setFood(cartItem.getFood());
            orderItem.setIngredients(cartItem.getIngredients());
            orderItem.setQuantity(cartItem.getQuantity());
            count += cartItem.getQuantity();

            orderItem.setTotalPrice(cartItem.getTotalPrice());

            OrderItem savedOrderItem = orderItemRepository.save(orderItem);
            orderItems.add(savedOrderItem);

        }

        createdOrder.setTotalItem(Long.valueOf(count));
        createdOrder.setTotalAmount(cart.getTotal());

        Long totalPrice = cartService.calculateCartTotals(cart);
        totalPrice += 18000; // delivery charge

        createdOrder.setItems(orderItems);
        createdOrder.setTotalPrice(totalPrice != null ? totalPrice : 0L);
        createdOrder.setPaymentMethod(order.getPaymentMethod());
        if (order.getPaymentMethod().contains("BY_CASH")) {
            createdOrder.setIsPaid(true);
        }

        Order savedOrder = orderRepository.save(createdOrder);
        //clear cart
        cartService.clearCart(cart.getId());

        restaurant.getOrders().add(savedOrder);

        return savedOrder;
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
        return orderRepository.save(order);
    }

    @Override
    public Order updateOrder(Long orderId, String orderStatus) throws Exception {
        Order order = findOrderById(orderId);
        if (orderStatus.equals("OUT_FOR_DELIVERY")
                || orderStatus.equals("DELIVERED")
                || orderStatus.equals("COMPLETED")
                || orderStatus.equals("PENDING")
                || orderStatus.equals("IN_PROGRESS"))
        {
            order.setOrderStatus(orderStatus);
            return orderRepository.save(order);
        } else {
            throw new Exception("Invalid order status");
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
    public Order findOrderById(Long orderId) throws Exception {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isEmpty()) {
            throw new Exception("Order not found with id: " + orderId);
        }
        return optionalOrder.get();
    }

}
