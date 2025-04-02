package com.example.demo.controller;

import com.example.demo.model.Recharge;
import com.example.demo.service.RechargeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customer/recharge")
@CrossOrigin(origins = { "http://localhost:5500", "http://127.0.0.1:5501","http://127.0.0.1:5500" })
public class RechargeController {

    @Autowired
    private RechargeService rechargeService;

    @PostMapping
    public ResponseEntity<String> processRecharge(@RequestBody Recharge recharge, @RequestParam(required = false) String paymentId) {
        try {
            String result = paymentId != null ? rechargeService.processRecharge(recharge, paymentId) : rechargeService.processRecharge(recharge);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to process recharge: " + e.getMessage());
        }
    }

    @GetMapping("/{mobileNumber}")
    public ResponseEntity<List<Recharge>> getTransactionHistory(@PathVariable String mobileNumber) {
        try {
            List<Recharge> history = rechargeService.getTransactionHistory(mobileNumber);
            if (history.isEmpty()) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(history);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }
}