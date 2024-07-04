package com.foodgo.service;

import com.foodgo.model.Mail;
import jakarta.mail.MessagingException;

import java.io.UnsupportedEncodingException;

public interface EmailService {
    public void sendMailWelcomeOwner(String email, String fullname) throws MessagingException, UnsupportedEncodingException;

    public void sendMailWelcomeCustomer(String email, String fullname) throws MessagingException, UnsupportedEncodingException;
}
