package com.example.banking_platform.dto.auth;

public record AuthResponse(
	String token,
	UserResponse user
) {
}
