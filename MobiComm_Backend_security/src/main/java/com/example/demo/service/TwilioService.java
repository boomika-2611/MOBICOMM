package com.example.demo.service;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

@Service
public class TwilioService {

    @Value("${twilio.account.sid:AC27010ae80c462a352505fe42d6b6ffa1}")
    private String accountSid;

    @Value("${twilio.auth.token:2e2af6e0c5a8a9b03bfcd59306097649}")
    private String authToken;

    @Value("${twilio.phone.number:+12525905567}")
    private String twilioPhoneNumber;

    public TwilioService() {
    }

    @PostConstruct
    public void init() {
        try {
            Twilio.init(accountSid, authToken);
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize Twilio: " + e.getMessage(), e);
        }
    }

   
    public void sendOTPSMS(String phoneNumber, String otp) {
        try {
            String formattedPhoneNumber = phoneNumber.startsWith("+91") ? phoneNumber : "+91" + phoneNumber;
            Message message = Message.creator(
                new PhoneNumber(formattedPhoneNumber),  
                new PhoneNumber(twilioPhoneNumber),     
                "Your OTP is: " + otp                 
            ).create();

            System.out.println("SMS sent successfully with SID: " + message.getSid());
        } catch (Exception e) {
            System.err.println("Error sending SMS: " + e.getMessage());
            throw new RuntimeException("Failed to send OTP SMS", e);
        }
    }
}