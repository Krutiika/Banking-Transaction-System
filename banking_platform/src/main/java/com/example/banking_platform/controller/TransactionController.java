package com.example.banking_platform.controller;

import com.example.banking_platform.dto.transaction.TransactionResponse;
import com.example.banking_platform.service.BankingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
public class TransactionController {

	private final BankingService bankingService;

	public TransactionController(BankingService bankingService) {
		this.bankingService = bankingService;
	}

	@GetMapping
	public ResponseEntity<List<TransactionResponse>> getTransactions(Authentication authentication) {
		return ResponseEntity.ok(bankingService.getTransactionsForUser(authentication.getName()));
	}
}
