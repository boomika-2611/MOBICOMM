package com.example.demo.model;

import java.time.LocalDate;

public class UserManagement {

    private Long id; // Added id field
    private String mobileNumber;
    private String customerName;
    private String email;
    private LocalDate startDate;
    private LocalDate endDate;
    private long daysRemaining;

    // Constructors
    public UserManagement() {
    }

    public UserManagement(Long id, String mobileNumber, String customerName, String email, LocalDate startDate, LocalDate endDate, long daysRemaining) {
        this.id = id;
        this.mobileNumber = mobileNumber;
        this.customerName = customerName;
        this.email = email;
        this.startDate = startDate;
        this.endDate = endDate;
        this.daysRemaining = daysRemaining;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMobileNumber() {
        return mobileNumber;
    }

    public void setMobileNumber(String mobileNumber) {
        this.mobileNumber = mobileNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public long getDaysRemaining() {
        return daysRemaining;
    }

    public void setDaysRemaining(long daysRemaining) {
        this.daysRemaining = daysRemaining;
    }
}