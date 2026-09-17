package com.example.banking_platform.bootstrap;

import com.example.banking_platform.entity.BankAccount;
import com.example.banking_platform.entity.BankTransaction;
import com.example.banking_platform.entity.Role;
import com.example.banking_platform.entity.TransactionStatus;
import com.example.banking_platform.entity.TransactionType;
import com.example.banking_platform.entity.User;
import com.example.banking_platform.repository.BankAccountRepository;
import com.example.banking_platform.repository.TransactionRepository;
import com.example.banking_platform.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

	private final UserRepository userRepository;
	private final BankAccountRepository bankAccountRepository;
	private final TransactionRepository transactionRepository;
	private final PasswordEncoder passwordEncoder;

	public DataSeeder(
		UserRepository userRepository,
		BankAccountRepository bankAccountRepository,
		TransactionRepository transactionRepository,
		PasswordEncoder passwordEncoder
	) {
		this.userRepository = userRepository;
		this.bankAccountRepository = bankAccountRepository;
		this.transactionRepository = transactionRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	@Transactional
	public void run(String... args) {
		if (userRepository.count() > 0) {
			return;
		}

		User admin = userRepository.save(new User(
			"Admin User",
			"admin@mybank.com",
			passwordEncoder.encode("Admin@123"),
			"+91 90000 00000",
			"Bank HQ",
			Role.ADMIN
		));

		User customer = userRepository.save(new User(
			"Rahul Sharma",
			"rahul@example.com",
			passwordEncoder.encode("Password@123"),
			"+91 98765 43210",
			"123 Main Street, Mumbai",
			Role.CUSTOMER
		));

		BankAccount savings = bankAccountRepository.save(new BankAccount(
			"SAV-1024",
			"Savings",
			new BigDecimal("15200.00"),
			customer
		));
		BankAccount checking = bankAccountRepository.save(new BankAccount(
			"CHK-2048",
			"Checking",
			new BigDecimal("10300.00"),
			customer
		));

		transactionRepository.saveAll(List.of(
			new BankTransaction("TXN-1001", TransactionType.DEPOSIT, TransactionStatus.SUCCESS, new BigDecimal("500.00"), "Salary credit", savings.getAccountNumber(), savings.getAccountNumber(), customer),
			new BankTransaction("TXN-1002", TransactionType.WITHDRAW, TransactionStatus.SUCCESS, new BigDecimal("300.00"), "ATM cash", checking.getAccountNumber(), checking.getAccountNumber(), customer),
			new BankTransaction("TXN-1003", TransactionType.TRANSFER, TransactionStatus.SUCCESS, new BigDecimal("1000.00"), "Utility payment", checking.getAccountNumber(), "EXT-2001", customer)
		));
	}
}
