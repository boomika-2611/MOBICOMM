package com.example.demo.service;

import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.model.Admin;
import com.example.demo.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public Admin getAdminProfile(Long id) {
        return adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with ID: " + id));
    }

    public Admin updateAdminProfile(Long id, Admin updatedAdmin) {
        Admin existingAdmin = adminRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found with ID: " + id));

        existingAdmin.setName(updatedAdmin.getName());
        existingAdmin.setEmail(updatedAdmin.getEmail());
        existingAdmin.setPhoneNumber(updatedAdmin.getPhoneNumber());

        if (updatedAdmin.getPassword() != null && !updatedAdmin.getPassword().isEmpty()) {
            existingAdmin.setPassword(passwordEncoder.encode(updatedAdmin.getPassword()));
        }

        return adminRepository.save(existingAdmin);
    }
}