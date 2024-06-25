package com.foodgo.service;

import com.foodgo.helper.OrderTemp;
import com.foodgo.model.Order;
import com.foodgo.response.PaymentResponse;
import com.stripe.exception.StripeException;

public interface PaymentService{
    public PaymentResponse createPaymentLink(Order order) throws StripeException;

    public String refundPayment(String paymentIntentId) throws StripeException;
}
