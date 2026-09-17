package com.example.banking_platform.service;

import com.example.banking_platform.dto.auth.AuthResponse;
import com.example.banking_platform.dto.auth.LoginRequest;
import com.example.banking_platform.dto.auth.RegisterRequest;

public interface AuthService {

	AuthResponse register(RegisterRequest request);

	AuthResponse login(LoginRequest request);
}
