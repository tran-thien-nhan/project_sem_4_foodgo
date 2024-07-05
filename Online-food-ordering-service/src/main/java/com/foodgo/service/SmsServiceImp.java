package com.foodgo.service;

import com.foodgo.config.NexmoConfig;
import com.vonage.client.VonageClient;
import com.vonage.client.sms.MessageStatus;
import com.vonage.client.sms.SmsSubmissionResponse;
import com.vonage.client.sms.messages.TextMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SmsServiceImp implements SmsService{

    private final NexmoConfig nexmoConfig;

    private final VonageClient vonageClient;

    @Autowired
    public SmsServiceImp(NexmoConfig nexmoConfig) {
        this.nexmoConfig = nexmoConfig;
        this.vonageClient = VonageClient.builder()
                .apiKey(nexmoConfig.getApiKey())
                .apiSecret(nexmoConfig.getApiSecret())
                .build();
    }

    @Override
    public void sendSmsNexMo(String phoneNumber, String message) {
        TextMessage textMessage = new TextMessage(nexmoConfig.getFromNumber(), phoneNumber, message);
        SmsSubmissionResponse response = vonageClient.getSmsClient().submitMessage(textMessage);

        if (response.getMessages().get(0).getStatus() == MessageStatus.OK) {
            System.out.println("Message sent successfully.");
            System.out.println("Message details: " + response.getMessages().get(0));
        } else {
            System.out.println("Message failed with error: " + response.getMessages().get(0).getErrorText());
        }
    }

}
