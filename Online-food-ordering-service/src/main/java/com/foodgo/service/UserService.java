package com.foodgo.service;

import com.foodgo.model.User;

public interface UserService {
    public User findUserByJwtToken(String jwtToken) throws Exception;

    public User findUserByEmail(String email) throws Exception;

    //find by id
    public User findUserById(Long id) throws Exception;
}
