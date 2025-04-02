package com.example.demo.controller;

import com.example.demo.model.Recharge;
import com.example.demo.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customer/transactions")
@CrossOrigin(origins = { "http://localhost:5500", "http://127.0.0.1:5501","http://127.0.0.1:5500" })
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping("/{mobileNumber}")
    public ResponseEntity<List<Recharge>> getTransactions(@PathVariable String mobileNumber) {
        try {
            List<Recharge> transactions = transactionService.getTransactions(mobileNumber);
            return ResponseEntity.ok(transactions);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<byte[]> downloadReceipt(@PathVariable Long id) {
        try {
            return transactionService.generateReceipt(id);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(("Error downloading receipt: " + e.getMessage()).getBytes());
        }
    }
}