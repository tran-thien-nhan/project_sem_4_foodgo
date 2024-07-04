package com.foodgo.service;

import com.foodgo.helper.OrderTemp;
import com.foodgo.model.Order;
import com.foodgo.response.PaymentResponse;
import com.stripe.exception.StripeException;

import java.io.UnsupportedEncodingException;
import java.util.Map;

public interface PaymentService{
    public PaymentResponse createPaymentLink(Order order) throws StripeException;

    public PaymentResponse createPaymentUrlVnPay(Order order) throws UnsupportedEncodingException;

    public String refundPayment(String paymentIntentId) throws StripeException;

    public boolean validateResponse(Map<String, String> vnp_Params);
}
