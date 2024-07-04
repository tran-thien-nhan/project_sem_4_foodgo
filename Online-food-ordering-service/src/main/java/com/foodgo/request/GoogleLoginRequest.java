package com.foodgo.request;

import com.foodgo.model.PROVIDER;
import com.foodgo.model.USER_ROLE;
import lombok.Data;

@Data
public class GoogleLoginRequest {
//    private String token;
    private String email;
    private String fullName;
    private String password;
    private USER_ROLE role;
    private PROVIDER provider;
}
