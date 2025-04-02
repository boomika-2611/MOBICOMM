package com.example.demo.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "admins")
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String email;
    private String phoneNumber;
    private String username;
    
    private String password; 

    @Enumerated(EnumType.STRING)
    private Role role;  

    public enum Role {
        ROLE_ADMIN, ROLE_USER
    }
}
