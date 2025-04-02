package com.example.demo.controller;

import com.example.demo.model.KYCRequest;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.KYCRequestService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = { "http://localhost:5500", "http://127.0.0.1:5501", "http://127.0.0.1:5500" })
public class KYCRequestController {

    @Autowired
    private KYCRequestService kycRequestService;
    @Autowired
    private UserRepository userRepository;

    // Secret key for signing the JWT (must match the key in JwtAuthenticationFilter)
    private static final String SECRET_KEY = "MySuperSecretKeyForJWTAuthenticationAndItMustBeLongEnough";
    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    @GetMapping("/admin/kyc")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<KYCRequest>> getAllKYCRequests() {
        return ResponseEntity.ok(kycRequestService.getAllKYCRequests());
    }

    @GetMapping("/admin/kyc/pending")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<KYCRequest>> getPendingKYCRequests() {
        return ResponseEntity.ok(kycRequestService.getPendingKYCRequests());
    }

    @PutMapping("/admin/kyc/approve/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String, String>> approveKYC(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        response.put("message", kycRequestService.approveKYC(id));
        return ResponseEntity.ok(response);
    }

    @PutMapping("/admin/kyc/reject/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String, String>> rejectKYC(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        response.put("message", kycRequestService.rejectKYC(id));
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/admin/kyc/clear/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String, String>> clearKYCRequest(@PathVariable Long id) {
        Map<String, String> response = new HashMap<>();
        response.put("message", kycRequestService.clearKYCRequest(id));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/customer/kyc")
    public ResponseEntity<Map<String, String>> addCustomerKYC(@RequestBody KYCRequest kycRequest) {
        Map<String, String> response = new HashMap<>();
        response.put("message", kycRequestService.addKYCRequest(kycRequest));
        return ResponseEntity.ok(response);
    }

    @GetMapping("/customer/kyc/pending")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<List<KYCRequest>> getCustomerPendingKYCRequests() {
        String mobileNumber = SecurityContextHolder.getContext().getAuthentication().getName();
        List<KYCRequest> pendingRequests = kycRequestService.getPendingKYCRequestsForUser(mobileNumber);
        return ResponseEntity.ok(pendingRequests);
    }

    @GetMapping("/customer/kyc/latest")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<KYCRequest> getLatestKYCRequest() {
        String mobileNumber = SecurityContextHolder.getContext().getAuthentication().getName();
        KYCRequest latestRequest = kycRequestService.getLatestKYCRequestForUser(mobileNumber);
        return ResponseEntity.ok(latestRequest); // Returns null if no request exists
    }

    @PutMapping("/customer/profile")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<User> updateCustomerProfile(@RequestBody User updatedUser) {
        String mobileNumber = SecurityContextHolder.getContext().getAuthentication().getName();
        User updated = kycRequestService.updateUserProfile(mobileNumber, updatedUser);
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/public/registered-numbers")
    public ResponseEntity<List<String>> getRegisteredMobileNumbers() {
        List<String> mobileNumbers = userRepository.findAll()
                .stream()
                .map(User::getPhoneNumber)
                .collect(Collectors.toList());
        return ResponseEntity.ok(mobileNumbers);
    }

    @PostMapping("/public/generate-customer-token")
    public ResponseEntity<Map<String, String>> generateCustomerToken(@RequestBody Map<String, String> request) {
        Map<String, String> response = new HashMap<>();
        try {
            String mobileNumber = request.get("mobileNumber");
            if (mobileNumber == null || mobileNumber.trim().isEmpty()) {
                response.put("error", "Mobile number is required.");
                return ResponseEntity.status(400).body(response);
            }

            System.out.println("Generating token for mobile number: " + mobileNumber);

            List<String> registeredNumbers = userRepository.findAll()
                    .stream()
                    .map(User::getPhoneNumber)
                    .collect(Collectors.toList());
            System.out.println("Registered numbers: " + registeredNumbers);

            if (!registeredNumbers.contains(mobileNumber)) {
                response.put("error", "Mobile number not registered.");
                return ResponseEntity.status(400).body(response);
            }

            String token = Jwts.builder()
                    .setSubject(mobileNumber)
                    .claim("role", "ROLE_USER")
                    .setIssuedAt(new Date())
                    .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 hours expiration
                    .signWith(key) 
                    .compact();

            response.put("token", token);
            response.put("message", "Customer token generated successfully.");
            System.out.println("Token generated: " + token);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("error", "Failed to generate customer token: " + e.getMessage());
            System.out.println("Error generating token: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}