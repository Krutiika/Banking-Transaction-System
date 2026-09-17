package com.example.banking_platform.service;

import com.example.banking_platform.dto.banking.OperationResponse;
import com.example.banking_platform.dto.banking.TransferRequest;
import com.example.banking_platform.dto.transaction.TransactionResponse;

import java.math.BigDecimal;
import java.util.List;

public interface BankingService {

	OperationResponse deposit(String email, BigDecimal amount);

	OperationResponse withdraw(String email, BigDecimal amount);

	OperationResponse transfer(String email, TransferRequest request);

	List<TransactionResponse> getTransactionsForUser(String email);
}
