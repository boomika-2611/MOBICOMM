package com.example.demo.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OTPService {
    private final Map<String, String> otpStore = new HashMap<>();
    private final Random random = new Random();

    public OTPService() {}

    
    public String generateOTP(String phoneNumber) {
        String otp = String.format("%04d", random.nextInt(10000));  
        otpStore.put(phoneNumber, otp);
        return otp;
    }

    
    public boolean validateOTP(String phoneNumber, String otp) {
        return otp.equals(otpStore.get(phoneNumber));
    }

  
    public void sendOTPEmail(String email, String otp) {
        System.out.println("Sending OTP " + otp + " to email: " + email);
    }
}
