package com.foodgo.repository;

import com.foodgo.model.Cart;
import com.foodgo.model.CartItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
}
