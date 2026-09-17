package com.example.banking_platform.service.impl;

import com.example.banking_platform.dto.admin.*;
import com.example.banking_platform.entity.BankAccount;
import com.example.banking_platform.entity.BankTransaction;
import com.example.banking_platform.entity.Role;
import com.example.banking_platform.entity.TransactionStatus;
import com.example.banking_platform.entity.TransactionType;
import com.example.banking_platform.entity.User;
import com.example.banking_platform.repository.BankAccountRepository;
import com.example.banking_platform.repository.TransactionRepository;
import com.example.banking_platform.repository.UserRepository;
import com.example.banking_platform.service.AdminService;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

	private final UserRepository userRepository;
	private final BankAccountRepository bankAccountRepository;
	private final TransactionRepository transactionRepository;

	public AdminServiceImpl(
		UserRepository userRepository,
		BankAccountRepository bankAccountRepository,
		TransactionRepository transactionRepository
	) {
		this.userRepository = userRepository;
		this.bankAccountRepository = bankAccountRepository;
		this.transactionRepository = transactionRepository;
	}

	@Override
	@Transactional(readOnly = true)
	@Cacheable(cacheNames = "adminDashboard")
	public AdminDashboardResponse getDashboard() {
		LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
		LocalDateTime startOfTomorrow = startOfDay.plusDays(1);

		DashboardSummaryResponse summary = new DashboardSummaryResponse(
			userRepository.countByRole(Role.CUSTOMER),
			bankAccountRepository.count(),
			transactionRepository.countByCreatedAtBetween(startOfDay, startOfTomorrow),
			transactionRepository.countByTypeAndStatus(TransactionType.TRANSFER, TransactionStatus.PENDING)
		);

		List<AdminCustomerResponse> customers = userRepository.findAllByOrderByCreatedAtDesc()
			.stream()
			.map(this::toCustomerResponse)
			.toList();

		List<AdminAccountResponse> accounts = bankAccountRepository.findAllByOrderByCreatedAtDesc()
			.stream()
			.map(this::toAccountResponse)
			.toList();

		List<AdminTransactionResponse> transactions = transactionRepository.findTop10ByOrderByCreatedAtDesc()
			.stream()
			.map(this::toTransactionResponse)
			.toList();

		return new AdminDashboardResponse(summary, customers, accounts, transactions);
	}

	private AdminCustomerResponse toCustomerResponse(User user) {
		return new AdminCustomerResponse(
			user.getId(),
			user.getFullName(),
			user.getEmail(),
			user.getPhone(),
			user.getAccounts().isEmpty() ? "Pending" : "Active"
		);
	}

	private AdminAccountResponse toAccountResponse(BankAccount account) {
		return new AdminAccountResponse(
			account.getAccountNumber(),
			account.getUser().getFullName(),
			account.getBalance(),
			account.getAccountType()
		);
	}

	private AdminTransactionResponse toTransactionResponse(BankTransaction transaction) {
		return new AdminTransactionResponse(
			transaction.getReference(),
			transaction.getType().name(),
			transaction.getAmount(),
			transaction.getStatus().name(),
			transaction.getCreatedAt()
		);
	}
}
