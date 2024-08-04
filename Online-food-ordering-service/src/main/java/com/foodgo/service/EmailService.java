package com.foodgo.service;

import com.foodgo.model.Event;
import com.foodgo.model.Mail;
import jakarta.mail.MessagingException;

import java.io.UnsupportedEncodingException;
import java.util.List;

public interface EmailService {
    public void sendMailWelcomeOwner(String email, String fullname) throws MessagingException,UnsupportedEncodingException;

    public void sendMailWelcomeCustomer(String email, String fullname) throws  MessagingException,UnsupportedEncodingException;

    public void sendPasswordResetEmail(String email, String token) throws MessagingException, UnsupportedEncodingException;

    public void sendPasswordChangeEmailOtp(String email, String token) throws MessagingException, UnsupportedEncodingException;

    //send mail welcome shipper
    public void sendMailWelcomeShipper(String email, String fullname) throws MessagingException, UnsupportedEncodingException;

    public void sendOtpEmail(String email, String otp) throws MessagingException, UnsupportedEncodingException;

    //gửi mail thông báo khi có sự kiện mới
    public void sendMailEvent(List<String> emails , Event event) throws MessagingException, UnsupportedEncodingException;

    //gửi mail thông báo khi sự kiện đã đủ người tham gia
    public void sendMailEventFull(List<String> emails ,Event event) throws MessagingException, UnsupportedEncodingException;

    //gửi mail thông báo khi sự kiện đã hết hạn
    public void sendMailEventExpired(List<String> emails ,Event event) throws MessagingException, UnsupportedEncodingException;

    //gửi mail thông báo khi sự kiện đã bị hủy
    public void sendMailEventCanceled(List<String> emails ,Event event) throws MessagingException, UnsupportedEncodingException;

    //gửi mail thông báo khi sự kiện đã bắt đầu
    public void sendMailEventStarted(List<String> emails ,Event event) throws MessagingException, UnsupportedEncodingException;

    public void send2FaCodes(String email, List<String> codes) throws MessagingException, UnsupportedEncodingException;
}
