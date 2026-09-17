package com.example.banking_platform.service.impl;

import com.example.banking_platform.dto.profile.ProfileResponse;
import com.example.banking_platform.dto.profile.ProfileUpdateRequest;
import com.example.banking_platform.entity.User;
import com.example.banking_platform.exception.BadRequestException;
import com.example.banking_platform.repository.UserRepository;
import com.example.banking_platform.service.ProfileService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileServiceImpl implements ProfileService {

	private final UserRepository userRepository;

	public ProfileServiceImpl(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	@Cacheable(cacheNames = "userProfile", key = "#p0")
	public ProfileResponse getProfile(String email) {
		return toResponse(getUser(email));
	}

	@Override
	@Transactional
	@CacheEvict(
		cacheNames = {"userProfile", "accountsByEmail", "adminAccounts", "adminDashboard"},
		allEntries = true
	)
	public ProfileResponse updateProfile(String email, ProfileUpdateRequest request) {
		User user = getUser(email);
		if (!user.getEmail().equals(request.email()) && userRepository.existsByEmail(request.email())) {
			throw new BadRequestException("An account with this email already exists.");
		}
		user.setFullName(request.fullName());
		user.setEmail(request.email());
		user.setPhone(request.phone());
		user.setAddress(request.address());
		userRepository.save(user);
		return toResponse(user);
	}

	private User getUser(String email) {
		return userRepository.findByEmail(email)
			.orElseThrow(() -> new BadRequestException("User not found."));
	}

	private ProfileResponse toResponse(User user) {
		return new ProfileResponse(
			user.getId(),
			user.getFullName(),
			user.getEmail(),
			user.getPhone(),
			user.getAddress(),
			user.getRole().name()
		);
	}
}
