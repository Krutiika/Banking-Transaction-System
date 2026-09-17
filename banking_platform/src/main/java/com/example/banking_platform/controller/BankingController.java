package com.example.banking_platform.controller;

import com.example.banking_platform.dto.banking.DepositRequest;
import com.example.banking_platform.dto.banking.OperationResponse;
import com.example.banking_platform.dto.banking.TransferRequest;
import com.example.banking_platform.dto.banking.WithdrawRequest;
import com.example.banking_platform.service.BankingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
public class BankingController {

	private final BankingService bankingService;

	public BankingController(BankingService bankingService) {
		this.bankingService = bankingService;
	}

	@PostMapping("/deposit")
	public ResponseEntity<OperationResponse> deposit(Authentication authentication, @Valid @RequestBody DepositRequest request) {
		return ResponseEntity.ok(bankingService.deposit(authentication.getName(), request.amount()));
	}

	@PostMapping("/withdraw")
	public ResponseEntity<OperationResponse> withdraw(Authentication authentication, @Valid @RequestBody WithdrawRequest request) {
		return ResponseEntity.ok(bankingService.withdraw(authentication.getName(), request.amount()));
	}

	@PostMapping("/transfer")
	public ResponseEntity<OperationResponse> transfer(Authentication authentication, @Valid @RequestBody TransferRequest request) {
		return ResponseEntity.ok(bankingService.transfer(authentication.getName(), request));
	}
}
