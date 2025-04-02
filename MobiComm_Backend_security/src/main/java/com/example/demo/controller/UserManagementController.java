package com.example.demo.controller;

import com.example.demo.model.UserManagement;
import com.example.demo.service.UserManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/admin/users")
@CrossOrigin(origins = { "http://localhost:5500", "http://127.0.0.1:5501","http://127.0.0.1:5500" })
public class UserManagementController {

    @Autowired
    private UserManagementService userManagementService;

    @GetMapping
    public ResponseEntity<Page<UserManagement>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(userManagementService.getAllUsers(page, size));
    }

    @GetMapping("/search")
    public ResponseEntity<List<UserManagement>> searchUsers(@RequestParam String name) {
        return ResponseEntity.ok(userManagementService.searchUsers(name));
    }

    @GetMapping("/search-by-date")
    public ResponseEntity<List<UserManagement>> searchByDate(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        return ResponseEntity.ok(userManagementService.searchByDate(startDate, endDate));
    }

    @GetMapping("/expiring-users")
    public ResponseEntity<List<UserManagement>> getExpiringUsers() {
        return ResponseEntity.ok(userManagementService.getExpiringUsers());
    }

    @GetMapping("/notify-expiring-users")
    public ResponseEntity<List<UserManagement>> notifyExpiringUsers() {
        return ResponseEntity.ok(userManagementService.notifyExpiringUsers());
    }

    @PostMapping("/notify-user/{id}")
    public ResponseEntity<String> notifyUser(@PathVariable Long id) {
        try {
            userManagementService.notifySingleUser(id);
            return ResponseEntity.ok("Email sent successfully to user with ID: " + id);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send email: " + e.getMessage());
        }
    }
}