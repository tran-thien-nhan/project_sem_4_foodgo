package com.foodgo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpServiceImp implements OtpService{

    @Autowired
    private SmsService smsService;

    private Map<String, String> otpStorage = new HashMap<>(); // otpStorage chứa phoneNumber và otp tương ứng
    @Override
    public void sendOtp(String phoneNumber) throws Exception {
        String otp = generateOtp();
        otpStorage.put(phoneNumber, otp);
        String formattedPhoneNumber = formatPhoneNumber(phoneNumber);
        smsService.sendSmsNexMo(formattedPhoneNumber, "Your OTP is " + otp);
    }

    @Override
    public String generateOtpViaEmail(String email) {
        String otp = generateOtp();
        otpStorage.put(email, otp);
        return otp;
    }

    @Override
    public boolean verifyOtpOfEmail(String email, String otp) throws Exception {
        String storedOtp = otpStorage.get(email);
        return otp.equals(storedOtp);
    }

    @Override
    public boolean verifyOtp(String phoneNumber, String otp) throws Exception {
        String storedOtp = otpStorage.get(phoneNumber);
        return otp.equals(storedOtp);
    }

    private String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    private String formatPhoneNumber(String phoneNumber) {
        return "84" + phoneNumber.substring(1);
    }
}
