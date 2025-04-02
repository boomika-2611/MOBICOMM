package com.example.demo.service;

import com.example.demo.model.Plan;
import com.example.demo.model.Recharge;
import com.example.demo.repository.PlanRepository;
import com.example.demo.repository.RechargeRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RechargeService {

    @Autowired
    private RechargeRepository rechargeRepository;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Transactional
    public String processRecharge(Recharge recharge, String paymentId) throws MessagingException {
       
        if (recharge.getMobileNumber() == null || recharge.getMobileNumber().isEmpty()) {
            throw new IllegalArgumentException("Mobile number is required!");
        }
        if (recharge.getAmount() <= 0) {
            throw new IllegalArgumentException("Amount must be positive!");
        }

       
        if (recharge.getPlanId() != null) {
            Optional<Plan> planOpt = planRepository.findById(recharge.getPlanId());
            if (planOpt.isPresent()) {
                Plan plan = planOpt.get();
                recharge.setAmount(plan.getPrice());
                recharge.setPlanDetails(plan.getDataPerDay() + " for " + plan.getValidityDays() + " days");
            } else {
                throw new IllegalArgumentException("Invalid plan ID: " + recharge.getPlanId());
            }
        } else if (recharge.getPlanDetails() == null || recharge.getPlanDetails().isEmpty()) {
            throw new IllegalArgumentException("Plan details or plan ID must be provided!");
        }

        // Set transaction date
        recharge.setTransactionDate(LocalDateTime.now());

        // Set payment details
        recharge.setPaymentId(paymentId);
        recharge.setPaymentMethod("UPI"); 
        recharge.setPaymentStatus("SUCCESS");

        // Save recharge
        rechargeRepository.save(recharge);

        // Send confirmation email
        sendRechargeConfirmationEmail(recharge);

        return "Recharge successful for " + recharge.getMobileNumber() + "! Payment ID: " + paymentId;
    }

    // Overload for backward compatibility (without paymentId)
    @Transactional
    public String processRecharge(Recharge recharge) throws MessagingException {
        String paymentId = "pay_dummy_" + System.currentTimeMillis(); // Fallback to dummy payment
        return processRecharge(recharge, paymentId);
    }

    public List<Recharge> getTransactionHistory(String mobileNumber) {
        if (mobileNumber == null || mobileNumber.isEmpty()) {
            throw new IllegalArgumentException("Mobile number is required!");
        }
        return rechargeRepository.findByMobileNumber(mobileNumber);
    }

    private void sendRechargeConfirmationEmail(Recharge recharge) throws MessagingException {
        if (recharge.getEmail() == null || recharge.getEmail().isEmpty()) {
            throw new IllegalArgumentException("Customer email is required for sending confirmation!");
        }

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(recharge.getEmail()); // Use the email from the Recharge object
        helper.setSubject("Recharge Confirmation - " + recharge.getMobileNumber());
        helper.setText(
                "<h2>Recharge Confirmation</h2>" +
                "<p>Dear Customer,</p>" +
                "<p>Your recharge has been successfully processed. Here are the details:</p>" +
                "<ul>" +
                "<li><b>Mobile Number:</b> " + recharge.getMobileNumber() + "</li>" +
                "<li><b>Amount:</b> ₹" + recharge.getAmount() + "</li>" +
                "<li><b>Plan Details:</b> " + recharge.getPlanDetails() + "</li>" +
                "<li><b>Payment ID:</b> " + recharge.getPaymentId() + "</li>" +
                "<li><b>Payment Method:</b> " + recharge.getPaymentMethod() + "</li>" +
                "<li><b>Date:</b> " + recharge.getTransactionDate() + "</li>" +
                "</ul>" +
                "<p>Thank you for choosing mobicomm Recharge service!</p>",
                true
        );

        mailSender.send(message);
    }
}