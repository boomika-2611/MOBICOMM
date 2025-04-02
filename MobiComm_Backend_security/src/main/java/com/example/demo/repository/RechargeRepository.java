package com.example.demo.repository;

import com.example.demo.model.Recharge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RechargeRepository extends JpaRepository<Recharge, Long> {
    List<Recharge> findByMobileNumber(String mobileNumber);
    List<Recharge> findByMobileNumberOrderByTransactionDateDesc(String mobileNumber);

    @Query("SELECT r FROM Recharge r WHERE r.transactionDate >= :startDate AND r.transactionDate <= :endDate")
    List<Recharge> findByTransactionDateBetween(LocalDateTime startDate, LocalDateTime endDate);

}
