package com.example.banking_platform.dto.auth;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
	@JsonAlias("name")
	@NotBlank String fullName,
	@NotBlank @Email String email,
	@NotBlank @Size(min = 8) String password,
	String phone,
	String address
) {
}
