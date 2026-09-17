package com.example.banking_platform.dto.auth;

public record UserResponse(
	Long id,
	String fullName,
	String email,
	String role
) {
}
