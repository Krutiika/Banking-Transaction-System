package com.example.banking_platform.service;

import com.example.banking_platform.dto.profile.ProfileResponse;
import com.example.banking_platform.dto.profile.ProfileUpdateRequest;

public interface ProfileService {

	ProfileResponse getProfile(String email);

	ProfileResponse updateProfile(String email, ProfileUpdateRequest request);
}
