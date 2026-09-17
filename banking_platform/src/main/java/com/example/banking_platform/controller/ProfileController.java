package com.example.banking_platform.controller;

import com.example.banking_platform.dto.profile.ProfileResponse;
import com.example.banking_platform.dto.profile.ProfileUpdateRequest;
import com.example.banking_platform.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/profile")
@PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
public class ProfileController {

	private final ProfileService profileService;

	public ProfileController(ProfileService profileService) {
		this.profileService = profileService;
	}

	@GetMapping
	public ResponseEntity<ProfileResponse> getProfile(Authentication authentication) {
		return ResponseEntity.ok(profileService.getProfile(authentication.getName()));
	}

	@PostMapping
	public ResponseEntity<ProfileResponse> updateProfile(
		Authentication authentication,
		@Valid @RequestBody ProfileUpdateRequest request
	) {
		return ResponseEntity.ok(profileService.updateProfile(authentication.getName(), request));
	}
}
