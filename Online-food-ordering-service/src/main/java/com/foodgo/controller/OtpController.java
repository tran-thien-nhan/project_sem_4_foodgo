package com.foodgo.controller;

import com.foodgo.model.User;
import com.foodgo.service.EmailService;
import com.foodgo.service.OtpService;
import com.foodgo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/otp")
public class OtpController {

    @Autowired
    private OtpService otpService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<String> sendOtp(@RequestBody Map<String, String> request, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        if (user == null) {
            throw new Exception("Invalid user");
        }
        String phoneNumber = request.get("phoneNumber");
        otpService.sendOtp(phoneNumber);
        return ResponseEntity.ok("OTP sent successfully");
    }

    @PostMapping("/verify")
    public ResponseEntity<Boolean> verifyOtp(@RequestBody Map<String, String> request, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        if (user == null) {
            throw new Exception("Invalid user");
        }
        String phoneNumber = request.get("phoneNumber");
        String otp = request.get("otp");
        boolean isVerified = otpService.verifyOtp(phoneNumber, otp);
        return ResponseEntity.ok(isVerified);
    }

    @PostMapping("/email/send")
    public ResponseEntity<String> sendOtpViaEmail(@RequestBody Map<String, String> request, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        if (user == null) {
            throw new Exception("Invalid user");
        }
        String email = request.get("email");
        String otp = otpService.generateOtpViaEmail(email);
        emailService.sendOtpEmail(email, otp); // Gửi email chứa mã OTP
        return ResponseEntity.ok("OTP sent successfully");
    }

    @PostMapping("/email/verify")
    public ResponseEntity<Boolean> verifyOtpOfEmail(@RequestBody Map<String, String> request, @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        if (user == null) {
            throw new Exception("Invalid user");
        }
        String email = request.get("email");
        String otp = request.get("otp");
        boolean isVerified = otpService.verifyOtpOfEmail(email, otp);
        return ResponseEntity.ok(isVerified);
    }
}
