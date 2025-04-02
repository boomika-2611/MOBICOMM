package com.example.demo.service;

import com.example.demo.model.Plan;
import com.example.demo.model.Recharge;
import com.example.demo.model.User;
import com.example.demo.model.UserManagement;
import com.example.demo.repository.PlanRepository;
import com.example.demo.repository.RechargeRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserManagementService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RechargeRepository rechargeRepository;

    @Autowired
    private PlanRepository planRepository;

    @Autowired
    private JavaMailSender mailSender;

    public Page<UserManagement> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        List<User> users = userRepository.findAll();

        List<UserManagement> userManagementList = users.stream()
                .map(this::mapToUserManagement)
                .filter(userManagement -> userManagement.getStartDate() != null) // Exclude users with no recharges
                .collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), userManagementList.size());
        List<UserManagement> pagedList = userManagementList.subList(start, end);

        return new PageImpl<>(pagedList, pageable, userManagementList.size());
    }

    public List<UserManagement> searchUsers(String name) {
        List<User> users = userRepository.findAll().stream()
                .filter(user -> user.getName() != null && user.getName().toLowerCase().contains(name.toLowerCase()))
                .collect(Collectors.toList());

        return users.stream()
                .map(this::mapToUserManagement)
                .filter(userManagement -> userManagement.getStartDate() != null)
                .collect(Collectors.toList());
    }

    public List<UserManagement> searchByDate(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        List<Recharge> recharges = rechargeRepository.findByTransactionDateBetween(startDateTime, endDateTime);

        List<UserManagement> userManagementList = new ArrayList<>();
        for (Recharge recharge : recharges) {
            User user = userRepository.findByPhoneNumber(recharge.getMobileNumber());
            if (user != null) {
                UserManagement userManagement = mapToUserManagement(user, recharge);
                if (userManagement.getStartDate() != null) {
                    userManagementList.add(userManagement);
                }
            }
        }
        return userManagementList;
    }

    public List<UserManagement> getExpiringUsers() {
        LocalDate today = LocalDate.now();
        List<LocalDate> notificationDates = Arrays.asList(
                today.plusDays(1),
                today.plusDays(2),
                today.plusDays(3)
        );

        List<UserManagement> allUsers = userRepository.findAll().stream()
                .map(this::mapToUserManagement)
                .filter(userManagement -> userManagement.getStartDate() != null)
                .collect(Collectors.toList());

        return allUsers.stream()
                .filter(user -> user.getEndDate() != null && notificationDates.contains(user.getEndDate()))
                .collect(Collectors.toList());
    }

    public List<UserManagement> notifyExpiringUsers() {
        List<UserManagement> expiringUsers = getExpiringUsers();
        for (UserManagement user : expiringUsers) {
            if (user.getEmail() != null && !user.getEmail().isEmpty()) {
                sendExpirationEmail(user);
            }
        }
        return expiringUsers;
    }

    public void notifySingleUser(Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            UserManagement userManagement = mapToUserManagement(user);
            if (userManagement.getEmail() != null && !userManagement.getEmail().isEmpty()) {
                sendExpirationEmail(userManagement);
            } else {
                throw new RuntimeException("No email address available for user with ID: " + id);
            }
        } else {
            throw new RuntimeException("User with ID: " + id + " not found");
        }
    }

    private void sendExpirationEmail(UserManagement user) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Plan Expiration Reminder");
        message.setText(
                "Dear " + user.getCustomerName() + ",\n\n" +
                        "Your plan will expire on " + user.getEndDate() + ". " +
                        "You have " + user.getDaysRemaining() + " days remaining.\n\n" +
                        "Please renew your plan.\n\n" +
                        "Best regards,\nMobiComm Team"
        );
        message.setFrom("support@mobicomm.com");

        try {
            mailSender.send(message);
            System.out.println("Email sent to " + user.getEmail());
        } catch (Exception e) {
            System.err.println("Failed to send email to " + user.getEmail() + ": " + e.getMessage());
            throw e;
        }
    }

    private UserManagement mapToUserManagement(User user) {
        List<Recharge> recharges = rechargeRepository.findByMobileNumberOrderByTransactionDateDesc(user.getPhoneNumber());
        if (recharges.isEmpty()) {
            return new UserManagement(user.getId(), user.getPhoneNumber(), user.getName(), user.getEmail(), null, null, 0);
        }

        Recharge latestRecharge = recharges.get(0); 
        return mapToUserManagement(user, latestRecharge);
    }

    private UserManagement mapToUserManagement(User user, Recharge recharge) {
        LocalDate startDate = recharge.getTransactionDate().toLocalDate();
        Optional<Plan> planOpt = planRepository.findById(recharge.getPlanId());
        if (!planOpt.isPresent()) {
            return new UserManagement(user.getId(), user.getPhoneNumber(), user.getName(), user.getEmail(), null, null, 0);
        }

        Plan plan = planOpt.get();
        LocalDate endDate = startDate.plusDays(plan.getValidityDays());
        long daysRemaining = ChronoUnit.DAYS.between(LocalDate.now(), endDate);
        daysRemaining = Math.max(0, daysRemaining); 

        return new UserManagement(
                user.getId(), 
                user.getPhoneNumber(),
                user.getName(),
                user.getEmail(),
                startDate,
                endDate,
                daysRemaining
        );
    }
}