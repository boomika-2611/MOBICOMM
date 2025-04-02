package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User getUserByPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber);
    }

    @Transactional
    public User saveUser(User user) {
        User existingUser = userRepository.findByPhoneNumber(user.getPhoneNumber());
        if (existingUser != null) {
           
            existingUser.setName(user.getName());
            existingUser.setAlternatePhoneNumber(user.getAlternatePhoneNumber());
            existingUser.setEmail(user.getEmail());
            existingUser.setAddress(user.getAddress());
            existingUser.setProfilePic(user.getProfilePic());
            if (user.getPassword() != null && !user.getPassword().isEmpty()) {
                existingUser.setPassword(user.getPassword());
            }
            return userRepository.save(existingUser);
        } else {
            if (user.getPassword() == null || user.getPassword().isEmpty()) {
                user.setPassword("otp-authenticated");
            }
            return userRepository.save(user);
        }
    }
}