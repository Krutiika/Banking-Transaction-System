package com.example.banking_platform.controller;

import com.example.banking_platform.dto.admin.AdminDashboardResponse;
import com.example.banking_platform.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

	private final AdminService adminService;

	public AdminController(AdminService adminService) {
		this.adminService = adminService;
	}

	@GetMapping("/dashboard")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<AdminDashboardResponse> dashboard() {
		return ResponseEntity.ok(adminService.getDashboard());
	}
}
