package com.example.banking_platform.controller;

import com.example.banking_platform.dto.account.BankAccountResponse;
import com.example.banking_platform.service.AccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
public class AccountController {

	private final AccountService accountService;

	public AccountController(AccountService accountService) {
		this.accountService = accountService;
	}

	@GetMapping
	public ResponseEntity<List<BankAccountResponse>> getAccounts(Authentication authentication) {
		return ResponseEntity.ok(accountService.getAccountsForUser(authentication.getName()));
	}
}
