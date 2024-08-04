package com.foodgo.request;

import com.foodgo.model.PROVIDER;
import lombok.Data;

@Data
public class AdminLoginRequest {
    private String email;
    private String password;
    private String code;
    private PROVIDER provider = PROVIDER.NORMAL;
}
