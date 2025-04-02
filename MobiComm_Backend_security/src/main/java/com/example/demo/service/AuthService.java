package com.example.demo.service;

import com.example.demo.model.Admin;
import com.example.demo.model.User;
import com.example.demo.repository.AdminRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired 
    private OTPService otpService;

    @Autowired
    private TwilioService twilioService; // Inject the new TwilioService

    // Admin Login
    public String adminLogin(String username, String password) {
        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (passwordEncoder.matches(password, admin.getPassword())) {
                return jwtUtil.generateToken(admin.getUsername(), "ROLE_ADMIN");  
            }
        }
        return null;
    }

    // Generate OTP and send via Twilio SMS
    public String generateOTPForUser(String phoneNumber) {
        String dbPhoneNumber = phoneNumber.startsWith("+91") ? phoneNumber.substring(3) : phoneNumber;
        Optional<User> userOpt = Optional.ofNullable(userRepository.findByPhoneNumber(dbPhoneNumber));
        
        String otp = otpService.generateOTP(dbPhoneNumber); // Generate OTP
        if (userOpt.isPresent() && userOpt.get().getEmail() != null) {
            otpService.sendOTPEmail(userOpt.get().getEmail(), otp); // Keep email option if email exists
        }
        twilioService.sendOTPSMS(dbPhoneNumber, otp); // Send OTP via SMS
        
        return userOpt.isPresent() ? "OTP sent successfully!" : "OTP sent for new user registration!";
    }

    // Validate OTP and generate token
    public String validateOTPAndLogin(String phoneNumber, String otp) {
        String dbPhoneNumber = phoneNumber.startsWith("+91") ? phoneNumber.substring(3) : phoneNumber;
        if (otpService.validateOTP(dbPhoneNumber, otp)) {
            return jwtUtil.generateToken(dbPhoneNumber, "ROLE_USER");  
        }
        return null;
    }
}