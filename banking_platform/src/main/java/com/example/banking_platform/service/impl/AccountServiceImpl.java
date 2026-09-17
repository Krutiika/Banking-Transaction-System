package com.example.banking_platform.service.impl;

import com.example.banking_platform.dto.account.BankAccountResponse;
import com.example.banking_platform.entity.BankAccount;
import com.example.banking_platform.entity.User;
import com.example.banking_platform.exception.ResourceNotFoundException;
import com.example.banking_platform.repository.BankAccountRepository;
import com.example.banking_platform.repository.UserRepository;
import com.example.banking_platform.service.AccountService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class AccountServiceImpl implements AccountService {

	private final BankAccountRepository bankAccountRepository;
	private final UserRepository userRepository;

	public AccountServiceImpl(BankAccountRepository bankAccountRepository, UserRepository userRepository) {
		this.bankAccountRepository = bankAccountRepository;
		this.userRepository = userRepository;
	}

	@Override
	@Cacheable(cacheNames = "accountsByEmail", key = "#p0")
	public List<BankAccountResponse> getAccountsForUser(String email) {
		return bankAccountRepository.findByUserEmailOrderByCreatedAtAsc(email)
			.stream()
			.map(this::toResponse)
			.toList();
	}

	@Override
	@Cacheable(cacheNames = "adminAccounts")
	public List<BankAccountResponse> getAccountsForAdmin() {
		return bankAccountRepository.findAllByOrderByCreatedAtDesc()
			.stream()
			.map(this::toResponse)
			.toList();
	}

	@Override
	public BankAccount getPrimaryAccount(String email) {
		return bankAccountRepository.findByUserEmailOrderByCreatedAtAsc(email)
			.stream()
			.filter(BankAccount::isActive)
			.findFirst()
			.orElseThrow(() -> new ResourceNotFoundException("No active account found for user."));
	}

	@Override
	public BankAccount getAccountByNumber(String accountNumber) {
		return bankAccountRepository.findByAccountNumber(accountNumber)
			.orElseThrow(() -> new ResourceNotFoundException("Receiver account not found."));
	}

	@Override
	@Transactional
	@CacheEvict(cacheNames = {"accountsByEmail", "adminAccounts", "adminDashboard"}, allEntries = true)
	public void createDefaultAccounts(User user) {
		BankAccount savings = new BankAccount(generateAccountNumber("SAV"), "Savings", new BigDecimal("15200.00"), user);
		BankAccount checking = new BankAccount(generateAccountNumber("CHK"), "Checking", new BigDecimal("10300.00"), user);
		bankAccountRepository.save(savings);
		bankAccountRepository.save(checking);
	}

	private BankAccountResponse toResponse(BankAccount account) {
		return new BankAccountResponse(
			account.getAccountNumber(),
			account.getAccountType(),
			account.getBalance(),
			account.isActive() ? "Active" : "Inactive"
		);
	}

	private String generateAccountNumber(String prefix) {
		String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 8).toUpperCase();
		return prefix + "-" + suffix;
	}
}
