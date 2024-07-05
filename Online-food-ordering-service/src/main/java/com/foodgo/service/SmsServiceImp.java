package com.foodgo.service;

import com.foodgo.config.NexmoConfig;
import com.foodgo.config.TwilioConfig;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Call;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.twiml.VoiceResponse;
import com.twilio.twiml.voice.Say;
import com.twilio.type.PhoneNumber;
import com.vonage.client.VonageClient;
import com.vonage.client.sms.MessageStatus;
import com.vonage.client.sms.SmsSubmissionResponse;
import com.vonage.client.sms.messages.TextMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class SmsServiceImp implements SmsService{

    @Autowired
    private TwilioConfig twilioConfig;

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
