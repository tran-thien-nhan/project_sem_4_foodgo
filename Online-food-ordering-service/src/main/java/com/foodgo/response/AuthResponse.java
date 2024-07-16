package com.foodgo.response;

import com.foodgo.model.USER_ROLE;
import com.foodgo.model.User;
import lombok.Data;

@Data
public class AuthResponse {
    private String jwt;
    private String message;
    private USER_ROLE role;
    private User user;
}
