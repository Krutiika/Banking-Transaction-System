package com.example.banking_platform.dto.profile;

public record ProfileResponse(
	Long id,
	String fullName,
	String email,
	String phone,
	String address,
	String role
) {
}
