package com.foodgo.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "vnpay")
@Data
public class VNPayConfig {
    @Value("${vnpay.url}")
    private String vn_PayUrl;

    @Value("${vnpay.returnurl}")
    private String vn_ReturnUrl;

    @Value("${vnpay.tmncode}")
    private String vn_TmnCode;

    @Value("${vnpay.hashsecret}")
    private String vn_HashSecret;

    @Value("${vnpay.vn_Version}")
    private String vn_Version;

    @Value("${vnpay.vn_Command}")
    private String vn_Command;

}
