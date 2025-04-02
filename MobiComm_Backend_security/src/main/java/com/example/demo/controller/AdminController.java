package com.example.demo.controller;

import com.example.demo.model.Admin;
import com.example.demo.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/profile")
@CrossOrigin(origins = { "http://localhost:5500", "http://127.0.0.1:5501","http://127.0.0.1:5500" })
public class AdminController {

	@Autowired
	private AdminService adminService;

	@GetMapping("/{id}")
	public ResponseEntity<Admin> getAdminProfile(@PathVariable Long id) {
		Admin admin = adminService.getAdminProfile(id);
		return ResponseEntity.ok(admin);
	}

	@PutMapping("/{id}")
	public ResponseEntity<Admin> updateAdminProfile(@PathVariable Long id, @RequestBody Admin admin) {
		Admin updatedAdmin = adminService.updateAdminProfile(id, admin);
		return ResponseEntity.ok(updatedAdmin);
	}
}
