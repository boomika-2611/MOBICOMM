package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.AuthService;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = { "http://localhost:5500", "http://127.0.0.1:5501","http://127.0.0.1:5500" })
public class UserController {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserService userService;

    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOTP(@RequestBody Map<String, String> request) {
        String phoneNumber = request.get("phoneNumber");
        if (phoneNumber == null || phoneNumber.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Phone number is required"));
        }
        String message = authService.generateOTPForUser(phoneNumber);
        return ResponseEntity.ok(Map.of("message", message));
    }

    @PostMapping("/validate-otp")
    public ResponseEntity<Map<String, String>> validateOTP(@RequestBody Map<String, String> request) {
        String phoneNumber = request.get("phoneNumber");
        String otp = request.get("otp");
        if (phoneNumber == null || phoneNumber.isEmpty() || otp == null || otp.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Phone number and OTP are required"));
        }
        String token = authService.validateOTPAndLogin(phoneNumber, otp);
        if (token != null) {
            User existingUser = userService.getUserByPhoneNumber(phoneNumber);
            if (existingUser == null) {
                User newUser = new User();
                newUser.setPhoneNumber(phoneNumber);
                newUser.setName("User");
                newUser.setPassword("otp-authenticated");
                userService.saveUser(newUser);
            }
            return ResponseEntity.ok(Map.of("token", token, "message", "User logged in successfully", "phoneNumber", phoneNumber));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Invalid OTP"));
    }

    @GetMapping("/{phoneNumber}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<User> getUser(@PathVariable String phoneNumber) {
        User user = userService.getUserByPhoneNumber(phoneNumber);
        if (user == null && !phoneNumber.startsWith("+91")) {
            user = userService.getUserByPhoneNumber("+91" + phoneNumber);
        }
        if (user == null) {
            return ResponseEntity.status(404).body(null);
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping("/save")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Map<String, String>> saveUser(@RequestBody User user) {
        User savedUser = userService.saveUser(user);
        return ResponseEntity.ok(Map.of("message", "Profile saved successfully for " + savedUser.getPhoneNumber()));
    }
}