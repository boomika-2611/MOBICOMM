package com.example.demo.controller;

import com.example.demo.model.Plan;
import com.example.demo.model.Recharge;
import com.example.demo.service.PlanService;
import com.example.demo.service.RechargeService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/customer/plans")
@CrossOrigin(origins = { "http://localhost:5500", "http://127.0.0.1:5501","http://127.0.0.1:5500" })
public class CustomerPlanController {

    @Autowired
    private PlanService planService;

    @Autowired
    private RechargeService rechargeService;

    @GetMapping
    public ResponseEntity<List<Plan>> getAllPlans() {
        return ResponseEntity.ok(planService.getAllPlans());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Plan>> searchPlans(
            @RequestParam(required = false) String categoryName,
            @RequestParam(required = false) Integer validity,
            @RequestParam(required = false) String data) {
        return ResponseEntity.ok(planService.searchPlans(categoryName, validity, data));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Plan> getPlanById(@PathVariable Long id) {
        Optional<Plan> plan = planService.getPlanById(id);
        return plan.map(ResponseEntity::ok)
                   .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/recharge/{id}")
    public ResponseEntity<String> rechargePlan(@PathVariable Long id, @RequestBody Recharge recharge, @RequestParam(required = false) String paymentId) {
        Optional<Plan> plan = planService.getPlanById(id);
        if (!plan.isPresent()) {
            return ResponseEntity.badRequest().body("Plan not found!");
        }

      
        if (recharge.getMobileNumber() == null || recharge.getMobileNumber().isEmpty()) {
            return ResponseEntity.badRequest().body("Mobile number is required!");
        }

       
        recharge.setPlanId(id);
        recharge.setAmount(plan.get().getPrice());
        recharge.setPlanDetails(plan.get().getDataPerDay() + " for " + plan.get().getValidityDays() + " days");
        recharge.setTransactionDate(LocalDateTime.now());

        try {
            String result = paymentId != null ? rechargeService.processRecharge(recharge, paymentId) : rechargeService.processRecharge(recharge);
            return ResponseEntity.ok("Plan " + plan.get().getName() + " recharged successfully! " + result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (MessagingException e) {
            return ResponseEntity.status(500).body("Failed to send email: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Unexpected error: " + e.getMessage());
        }
    }
}