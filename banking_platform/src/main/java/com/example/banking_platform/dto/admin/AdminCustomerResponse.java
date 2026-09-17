package com.example.banking_platform.dto.admin;

public record AdminCustomerResponse(
	Long id,
	String fullName,
	String email,
	String phone,
	String status
) {
}
