package com.example.banking_platform.service.impl;

import com.example.banking_platform.dto.auth.AuthResponse;
import com.example.banking_platform.dto.auth.LoginRequest;
import com.example.banking_platform.dto.auth.RegisterRequest;
import com.example.banking_platform.dto.auth.UserResponse;
import com.example.banking_platform.entity.Role;
import com.example.banking_platform.entity.User;
import com.example.banking_platform.exception.BadRequestException;
import com.example.banking_platform.repository.UserRepository;
import com.example.banking_platform.security.JwtService;
import com.example.banking_platform.service.AccountService;
import com.example.banking_platform.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtService jwtService;
	private final AuthenticationManager authenticationManager;
	private final AccountService accountService;

	public AuthServiceImpl(
		UserRepository userRepository,
		PasswordEncoder passwordEncoder,
		JwtService jwtService,
		AuthenticationManager authenticationManager,
		AccountService accountService
	) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtService = jwtService;
		this.authenticationManager = authenticationManager;
		this.accountService = accountService;
	}

	@Override
	@Transactional
	public AuthResponse register(RegisterRequest request) {
		if (userRepository.existsByEmail(request.email())) {
			throw new BadRequestException("An account with this email already exists.");
		}

		User user = new User(
			request.fullName(),
			request.email(),
			passwordEncoder.encode(request.password()),
			request.phone(),
			request.address(),
			Role.CUSTOMER
		);

		user = userRepository.save(user);
		accountService.createDefaultAccounts(user);

		return new AuthResponse(jwtService.generateToken(user), toUserResponse(user));
	}

	@Override
	public AuthResponse login(LoginRequest request) {
		authenticationManager.authenticate(
			new UsernamePasswordAuthenticationToken(request.email(), request.password())
		);

		User user = userRepository.findByEmail(request.email())
			.orElseThrow(() -> new BadRequestException("Invalid email or password."));

		return new AuthResponse(jwtService.generateToken(user), toUserResponse(user));
	}

	private UserResponse toUserResponse(User user) {
		return new UserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole().name());
	}
}
