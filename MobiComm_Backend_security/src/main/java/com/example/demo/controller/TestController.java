package com.example.demo.controller;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @Value("${razorpay.key.id:rzp_test_gFA0eCS8LJFy01}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:deSjRHiTBGALqGCwuPjfKPv}")
    private String razorpayKeySecret;

    @GetMapping("/test-razorpay")
    public ResponseEntity<String> testRazorpay() {
        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", 50000); 
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "test_receipt_" + System.currentTimeMillis());
            com.razorpay.Order order = razorpay.orders.create(orderRequest);
            return ResponseEntity.ok("Razorpay Order Created: " + order.toString());
        } catch (RazorpayException e) {
            return ResponseEntity.status(500).body("Razorpay Error: " + e.getMessage());
        }
    }
}