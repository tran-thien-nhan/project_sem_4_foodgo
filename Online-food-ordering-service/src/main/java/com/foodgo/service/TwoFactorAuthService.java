package com.foodgo.service;

import jakarta.mail.MessagingException;

import java.io.UnsupportedEncodingException;
import java.util.List;

public interface TwoFactorAuthService {
    public String generateCode();

    public boolean verifyCode(String inputCode, String email) throws MessagingException, UnsupportedEncodingException;

    public List<String> generateNewCodes(int count);

    public void generateAndSaveNewCodes(String email, int count);
}
