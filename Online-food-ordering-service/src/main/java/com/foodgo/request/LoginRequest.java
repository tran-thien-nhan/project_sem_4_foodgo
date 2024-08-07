package com.foodgo.request;

import com.foodgo.model.PROVIDER;
import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
    private PROVIDER provider;
}
