package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.service.AuthService;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = { "http://localhost:5500", "http://127.0.0.1:5501","http://127.0.0.1:5500" })
public class AuthController {

	@Autowired
	private AuthService authService;

	@PostMapping("/admin/login")
	public ResponseEntity<?> adminLogin(@RequestBody Map<String, String> request) {
		String username = request.get("username");
		String password = request.get("password");

		if (username == null || username.isEmpty() || password == null || password.isEmpty()) {
			return ResponseEntity.badRequest().body(Map.of("error", "Username and password are required"));
		}

		String token = authService.adminLogin(username, password);
		if (token != null) {
			return ResponseEntity.ok(Map.of("token", token, "message", "Admin logged in successfully"));
		}
		return ResponseEntity.badRequest().body(Map.of("error", "Invalid admin credentials"));
	}
}
