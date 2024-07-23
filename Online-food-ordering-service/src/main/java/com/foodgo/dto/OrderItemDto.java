package com.foodgo.dto;

import jakarta.persistence.Embeddable;
import lombok.Data;

import java.util.List;

@Data
@Embeddable
public class OrderItemDto {
    private Long itemId;
    private String itemName;
    private Long itemPrice;
    private int itemQuantity;
    private List<String> ingredientsName;
}
