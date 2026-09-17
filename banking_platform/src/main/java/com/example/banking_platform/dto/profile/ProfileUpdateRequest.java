package com.example.banking_platform.dto.profile;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ProfileUpdateRequest(
	@JsonAlias("name")
	@NotBlank String fullName,
	@NotBlank @Email String email,
	String phone,
	String address
) {
}
