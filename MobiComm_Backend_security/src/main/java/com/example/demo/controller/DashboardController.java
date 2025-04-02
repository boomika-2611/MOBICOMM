package com.example.demo.controller;

import com.example.demo.repository.KYCRequestRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/admin/dashboard")
@CrossOrigin(origins = {"http://localhost:5500", "http://127.0.0.1:5501", "http://127.0.0.1:5500"})
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

   
    @GetMapping("/active-users")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String, Long>> getActiveUsersData() {
        return ResponseEntity.ok(dashboardService.getActiveUsersData());
    }

  
    @GetMapping("/popular-plans")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String, Double>> getPopularPlansData() {
        return ResponseEntity.ok(dashboardService.getPopularPlansData());
    }

    
    @GetMapping("/new-registrations")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String, Long>> getNewRegistrationsData() {
        return ResponseEntity.ok(dashboardService.getNewRegistrationsData());
    }

    
    @GetMapping("/payment-trends")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String, Double>> getPaymentTrendsData() {
        return ResponseEntity.ok(dashboardService.getPaymentTrendsData());
    }

    
    @GetMapping("/admin-actions")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String, Long>> getAdminActionsData() {
        return ResponseEntity.ok(dashboardService.getAdminActionsData());
    }

   
    @GetMapping("/report-data")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String, String>> getReportData() {
        return ResponseEntity.ok(dashboardService.getReportData());
    }
}