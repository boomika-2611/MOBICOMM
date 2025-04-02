package com.example.demo.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/customer/payment")
@CrossOrigin(origins = { "http://localhost:5500", "http://127.0.0.1:5501","http://127.0.0.1:5500" })
public class PaymentController {

    @Value("${razorpay.key.id:rzp_test_4mqwZ2yylKYX0g}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret:Re6nvIMvBcv4WPHJr0t6BIzT}")
    private String razorpayKeySecret;

    @PostMapping("/create-order")
    public ResponseEntity<String> createOrder(@RequestBody OrderRequest orderRequest) {
        try {
            RazorpayClient razorpay = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            JSONObject orderReq = new JSONObject();
            orderReq.put("amount", (int) (orderRequest.getAmount() * 100)); 
            orderReq.put("currency", "INR");
            orderReq.put("receipt", "order_" + System.currentTimeMillis());
            Order order = razorpay.orders.create(orderReq);
            return ResponseEntity.ok(order.get("id"));
        } catch (RazorpayException e) {
            return ResponseEntity.status(500).body("Failed to create order: " + e.getMessage());
        }
    }
}

class OrderRequest {
    private double amount;

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }
}