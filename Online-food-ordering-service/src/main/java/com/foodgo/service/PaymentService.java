package com.foodgo.service;

import com.foodgo.model.Order;
import com.foodgo.response.PaymentResponse;
import com.stripe.exception.StripeException;

public interface PaymentService{
    public PaymentResponse createPaymentLink(Order order) throws StripeException;
}
