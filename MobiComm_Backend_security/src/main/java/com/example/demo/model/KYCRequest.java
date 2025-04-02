package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "kyc_requests")
public class KYCRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String mobileNumber;

    @Column(nullable = false)
    private String customerName;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String aadharDocument;

    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String email; 

    @Column(nullable = false)
    private String status; // Pending, Approved, Rejected
}