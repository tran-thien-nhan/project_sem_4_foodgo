package com.foodgo.service;

public interface OtpService {
    public void sendOtp(String phoneNumber) throws Exception;

    public boolean verifyOtp(String phoneNumber, String otp) throws Exception;

    public String generateOtpViaEmail(String email) throws Exception;

    public boolean verifyOtpOfEmail(String email, String otp) throws Exception;
}
