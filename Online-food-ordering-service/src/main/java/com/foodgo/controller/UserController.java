package com.foodgo.controller;

import com.foodgo.helper.ApiResponse;
import com.foodgo.model.Address;
import com.foodgo.model.User;
import com.foodgo.request.GoogleLoginRequest;
import com.foodgo.service.AddressService;
import com.foodgo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private AddressService addressService;

    @GetMapping("/profile")
    public ResponseEntity<User> findUserByJwtToken(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        return new ResponseEntity<>(user, HttpStatus.OK);
        //return ApiResponse.success(user,"find user by jwt token successfully");
    }

}
