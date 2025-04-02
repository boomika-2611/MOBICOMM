package com.example.demo.service;

import com.example.demo.model.KYCRequest;
import com.example.demo.model.User;
import com.example.demo.repository.KYCRequestRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class KYCRequestService {

    @Autowired
    private KYCRequestRepository kycRequestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JavaMailSender mailSender;

    public List<KYCRequest> getAllKYCRequests() {
        return kycRequestRepository.findAll();
    }

    public List<KYCRequest> getPendingKYCRequests() {
        return kycRequestRepository.findByStatus("Pending");
    }

    public List<KYCRequest> getPendingKYCRequestsForUser(String mobileNumber) {
        return kycRequestRepository.findByMobileNumberAndStatus(mobileNumber, "Pending");
    }

    public String addKYCRequest(KYCRequest kycRequest) {
        // Validate mandatory fields
        if (kycRequest.getMobileNumber() == null || kycRequest.getMobileNumber().isEmpty()) {
            throw new IllegalArgumentException("Mobile number is mandatory!");
        }
        if (kycRequest.getCustomerName() == null || kycRequest.getCustomerName().isEmpty()) {
            throw new IllegalArgumentException("Customer name is mandatory!");
        }
        if (kycRequest.getAadharDocument() == null || kycRequest.getAadharDocument().isEmpty()) {
            throw new IllegalArgumentException("Aadhar document is mandatory!");
        }
        if (kycRequest.getPassword() == null || kycRequest.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password is mandatory!");
        }

       
        if (userRepository.findByPhoneNumber(kycRequest.getMobileNumber()) != null) {
            throw new RuntimeException("Mobile number already registered!");
        }

        kycRequest.setStatus("Pending");
        kycRequestRepository.save(kycRequest);
        return "KYC request submitted successfully!";
    }

    public String approveKYC(Long id) {
        Optional<KYCRequest> request = kycRequestRepository.findById(id);
        if (request.isPresent()) {
            KYCRequest kyc = request.get();
            
            if (userRepository.findByPhoneNumber(kyc.getMobileNumber()) != null) {
                throw new RuntimeException("Mobile number already registered!");
            }
            kyc.setStatus("Approved");
            kycRequestRepository.save(kyc);

          
            User user = new User();
            user.setPhoneNumber(kyc.getMobileNumber());
            user.setName(kyc.getCustomerName());
            user.setPassword(kyc.getPassword());
            user.setEmail(kyc.getEmail()); 
            userRepository.save(user);

           
            if (kyc.getEmail() != null && !kyc.getEmail().isEmpty()) {
                try {
                    sendApprovalEmail(kyc);
                } catch (Exception e) {
                  
                    System.err.println("Failed to send approval email to " + kyc.getEmail() + ": " + e.getMessage());
                }
            } else {
                System.out.println("No email provided for KYC request ID " + id + ". Skipping email notification.");
            }

            return "KYC request approved! User added to the system.";
        }
        return "KYC request not found!";
    }

    public String rejectKYC(Long id) {
        Optional<KYCRequest> request = kycRequestRepository.findById(id);
        if (request.isPresent()) {
            KYCRequest kyc = request.get();
            kyc.setStatus("Rejected");
            kycRequestRepository.save(kyc);
            
            if (kyc.getEmail() != null && !kyc.getEmail().isEmpty()) {
                try {
                    sendRejectionEmail(kyc);
                } catch (Exception e) {
                    System.err.println("Failed to send rejection email to " + kyc.getEmail() + ": " + e.getMessage());
                }
            } else {
                System.out.println("No email provided for KYC request ID " + id + ". Skipping email notification.");
            }

            return "KYC request rejected!";
        }
        return "KYC request not found!";
    }

    public String clearKYCRequest(Long id) {
        if (kycRequestRepository.existsById(id)) {
            kycRequestRepository.deleteById(id);
            return "KYC request cleared successfully!";
        }
        return "KYC request not found!";
    }

    public KYCRequest getLatestKYCRequestForUser(String mobileNumber) {
        KYCRequest request = kycRequestRepository.findTopByMobileNumberOrderByIdDesc(mobileNumber);
        System.out.println("Latest KYC Request for " + mobileNumber + ": " + request);
        return request;
    }

    public User updateUserProfile(String mobileNumber, User updatedUser) {
        User user = userRepository.findByPhoneNumber(mobileNumber);
        if (user == null) {
            throw new RuntimeException("User not found!");
        }

        // Update optional fields
        if (updatedUser.getName() != null) {
            user.setName(updatedUser.getName());
        }
        if (updatedUser.getAlternatePhoneNumber() != null) {
            user.setAlternatePhoneNumber(updatedUser.getAlternatePhoneNumber());
        }
        if (updatedUser.getEmail() != null) {
            user.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getAddress() != null) {
            user.setAddress(updatedUser.getAddress());
        }
        if (updatedUser.getProfilePic() != null) {
            user.setProfilePic(updatedUser.getProfilePic());
        }

        return userRepository.save(user);
    }

    private void sendApprovalEmail(KYCRequest kyc) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(kyc.getEmail());
        message.setSubject("KYC Approval Notification");
        message.setText(
                "Dear " + kyc.getCustomerName() + ",\n\n" +
                        "Your KYC request has been approved!\n" +
                        "You can now log in to MobiComm using your mobile number (" + kyc.getMobileNumber() + ") and the password you provided.\n\n" +
                        "Best regards,\nMobiComm Team"
        );
        message.setFrom("boomikamohan316@gmail.com");

        mailSender.send(message);
        System.out.println("Approval email sent to " + kyc.getEmail());
    }

    private void sendRejectionEmail(KYCRequest kyc) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(kyc.getEmail());
        message.setSubject("KYC Rejection Notification");
        message.setText(
                "Dear " + kyc.getCustomerName() + ",\n\n" +
                        "We regret to inform you that your KYC request has been rejected.\n" +
                        "Please resubmit your KYC with correct details or contact support for assistance.\n\n" +
                        "Best regards,\nMobiComm Team"
        );
        message.setFrom("boomikamohan316@gmail.com");

        mailSender.send(message);
        System.out.println("Rejection email sent to " + kyc.getEmail());
    }
}