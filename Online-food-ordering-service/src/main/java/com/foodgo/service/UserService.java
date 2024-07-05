package com.foodgo.service;

import com.foodgo.model.User;
import com.foodgo.request.GoogleLoginRequest;
import com.foodgo.response.ResetpasswordResponse;
import jakarta.mail.MessagingException;

import java.io.UnsupportedEncodingException;

public interface UserService {
    public User findUserByJwtToken(String jwtToken) throws Exception;

    public User findUserByEmail(String email) throws Exception;

    //find by id
    public User findUserById(Long id) throws Exception;

    //public User processGoogleLogin(GoogleLoginRequest request) throws Exception;

    public void processForgotPassword(String email) throws MessagingException, UnsupportedEncodingException;

    public ResetpasswordResponse updatePassword(String token, String newPassword) throws Exception;
}
