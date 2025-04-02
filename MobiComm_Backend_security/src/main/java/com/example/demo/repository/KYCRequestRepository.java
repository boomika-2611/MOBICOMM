package com.example.demo.repository;

import com.example.demo.model.KYCRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KYCRequestRepository extends JpaRepository<KYCRequest, Long> {
    List<KYCRequest> findByStatus(String status);

    List<KYCRequest> findByMobileNumberAndStatus(String mobileNumber, String status);

    KYCRequest findTopByMobileNumberOrderByIdDesc(String mobileNumber);
    
    long countByStatus(String status);
}