package com.foodgo.request;

import lombok.Data;

@Data
public class UpdateCartItemRequesst {
    private Long cartItemId;
    private int quantity;
}
