package com.example.demo.service;

import com.example.demo.repository.KYCRequestRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private KYCRequestRepository kycRequestRepository;

    public Map<String, Long> getActiveUsersData() {
        Map<String, Long> data = new HashMap<>();
        long totalUsers = userRepository.count();
        
        long activeUsers = totalUsers * 75 / 100;
        data.put("totalUsers", totalUsers);
        data.put("activeUsers", activeUsers);
        return data;
    }

    public Map<String, Double> getPopularPlansData() {
        // Mock data for plans
        Map<String, Double> data = new HashMap<>();
        data.put("Popular Plan", 40.0);
        data.put("Validity Plan", 30.0);
        data.put("Top-Up Plan", 20.0);
        data.put("Data Plan", 10.0);
        return data;
    }

    public Map<String, Long> getNewRegistrationsData() {
        // Mock data for the last 5 months
        Map<String, Long> data = new HashMap<>();
        String[] months = {"Jan", "Feb", "Mar", "Apr", "May"};
        LocalDate now = LocalDate.now();
        for (int i = 0; i < 5; i++) {
            
            long registrations = userRepository.count() * (i + 1) / 5; 
            data.put(months[i], registrations);
        }
        return data;
    }

    public Map<String, Double> getPaymentTrendsData() {
        
        Map<String, Double> data = new HashMap<>();
        data.put("UPI", 40.0);
        data.put("Debit Card", 30.0);
        data.put("Credit Card", 20.0);
        data.put("Net Banking", 10.0);
        return data;
    }

    public Map<String, Long> getAdminActionsData() {
        Map<String, Long> data = new HashMap<>();
        long kycApproved = kycRequestRepository.countByStatus("Approved");
        long kycRejected = kycRequestRepository.countByStatus("Rejected");
        long kycPending = kycRequestRepository.countByStatus("Pending");
        data.put("kycApproved", kycApproved);
        data.put("kycRejected", kycRejected);
        data.put("kycPending", kycPending);
        return data;
    }

    public Map<String, String> getReportData() {
        Map<String, String> data = new HashMap<>();
        long totalUsers = userRepository.count();
        long activeUsers = totalUsers * 75 / 100; 
        long kycApproved = kycRequestRepository.countByStatus("Approved");
        long newRegistrations = totalUsers / 5;
        data.put("totalUsers", String.valueOf(totalUsers));
        data.put("activeUsers", String.valueOf(activeUsers));
        data.put("popularPlan", "40% Usage"); 
        data.put("newRegistrationsMay", String.valueOf(newRegistrations));
        data.put("topPaymentMode", "UPI - 40%"); 
        data.put("kycApproved", String.valueOf(kycApproved));
        return data;
    }
}