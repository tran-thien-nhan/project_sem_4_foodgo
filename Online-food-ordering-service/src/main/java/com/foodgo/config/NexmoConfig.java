package com.foodgo.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "nexmo")
@Data
public class NexmoConfig {
    @Value("${nexmo.apiKey}")
    private String apiKey;

    @Value("${nexmo.apiSecret}")
    private String apiSecret;

    @Value("${nexmo.fromNumber}")
    private String fromNumber;
}
