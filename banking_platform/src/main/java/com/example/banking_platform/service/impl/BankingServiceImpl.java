package com.example.banking_platform.service.impl;

import com.example.banking_platform.dto.banking.OperationResponse;
import com.example.banking_platform.dto.banking.TransferRequest;
import com.example.banking_platform.dto.transaction.TransactionResponse;
import com.example.banking_platform.entity.BankAccount;
import com.example.banking_platform.entity.BankTransaction;
import com.example.banking_platform.entity.TransactionStatus;
import com.example.banking_platform.entity.TransactionType;
import com.example.banking_platform.entity.User;
import com.example.banking_platform.exception.BadRequestException;
import com.example.banking_platform.rabbitmq.TransactionCreatedEvent;
import com.example.banking_platform.rabbitmq.TransactionEventPublisher;
import com.example.banking_platform.repository.BankAccountRepository;
import com.example.banking_platform.repository.TransactionRepository;
import com.example.banking_platform.repository.UserRepository;
import com.example.banking_platform.service.AccountService;
import com.example.banking_platform.service.BankingService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Caching;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
public class BankingServiceImpl implements BankingService {

	private final AccountService accountService;
	private final BankAccountRepository bankAccountRepository;
	private final TransactionRepository transactionRepository;
	private final UserRepository userRepository;
	private final TransactionEventPublisher transactionEventPublisher;

	public BankingServiceImpl(
		AccountService accountService,
		BankAccountRepository bankAccountRepository,
		TransactionRepository transactionRepository,
		UserRepository userRepository,
		TransactionEventPublisher transactionEventPublisher
	) {
		this.accountService = accountService;
		this.bankAccountRepository = bankAccountRepository;
		this.transactionRepository = transactionRepository;
		this.userRepository = userRepository;
		this.transactionEventPublisher = transactionEventPublisher;
	}

	@Override
	@Transactional
	@Caching(evict = {
		@CacheEvict(cacheNames = {"accountsByEmail", "transactionsByEmail", "adminAccounts", "adminDashboard"}, allEntries = true)
	})
	public OperationResponse deposit(String email, BigDecimal amount) {
		BankAccount account = accountService.getPrimaryAccount(email);
		account.setBalance(account.getBalance().add(amount));
		bankAccountRepository.save(account);

		User user = getUser(email);
		BankTransaction transaction = saveTransaction(
			user,
			TransactionType.DEPOSIT,
			TransactionStatus.SUCCESS,
			amount,
			null,
			account.getAccountNumber(),
			account.getAccountNumber()
		);
		publishTransactionEvent(user, transaction, account.getAccountNumber(), account.getAccountNumber());

		return new OperationResponse("Deposit successful.", transaction.getReference());
	}

	@Override
	@Transactional
	@Caching(evict = {
		@CacheEvict(cacheNames = {"accountsByEmail", "transactionsByEmail", "adminAccounts", "adminDashboard"}, allEntries = true)
	})
	public OperationResponse withdraw(String email, BigDecimal amount) {
		BankAccount account = accountService.getPrimaryAccount(email);
		if (account.getBalance().compareTo(amount) < 0) {
			throw new BadRequestException("Insufficient balance.");
		}

		account.setBalance(account.getBalance().subtract(amount));
		bankAccountRepository.save(account);

		User user = getUser(email);
		BankTransaction transaction = saveTransaction(
			user,
			TransactionType.WITHDRAW,
			TransactionStatus.SUCCESS,
			amount,
			null,
			account.getAccountNumber(),
			account.getAccountNumber()
		);
		publishTransactionEvent(user, transaction, account.getAccountNumber(), account.getAccountNumber());

		return new OperationResponse("Withdraw successful.", transaction.getReference());
	}

	@Override
	@Transactional
	@Caching(evict = {
		@CacheEvict(cacheNames = {"accountsByEmail", "transactionsByEmail", "adminAccounts", "adminDashboard"}, allEntries = true)
	})
	public OperationResponse transfer(String email, TransferRequest request) {
		BankAccount source = accountService.getPrimaryAccount(email);
		User user = getUser(email);

		if (source.getBalance().compareTo(request.amount()) < 0) {
			throw new BadRequestException("Insufficient balance.");
		}

		BankAccount receiver = bankAccountRepository.findByAccountNumber(request.receiverAccountNumber()).orElse(null);
		TransactionStatus status = receiver == null ? TransactionStatus.PENDING : TransactionStatus.SUCCESS;

		if (status == TransactionStatus.SUCCESS) {
			source.setBalance(source.getBalance().subtract(request.amount()));
			receiver.setBalance(receiver.getBalance().add(request.amount()));
			bankAccountRepository.save(source);
			bankAccountRepository.save(receiver);
		}

		BankTransaction transaction = saveTransaction(
			user,
			TransactionType.TRANSFER,
			status,
			request.amount(),
			request.remarks(),
			source.getAccountNumber(),
			request.receiverAccountNumber()
		);
		publishTransactionEvent(user, transaction, source.getAccountNumber(), request.receiverAccountNumber());

		String message = status == TransactionStatus.SUCCESS
			? "Transfer successful."
			: "Transfer queued for processing.";
		return new OperationResponse(message, transaction.getReference());
	}

	@Override
	@Cacheable(cacheNames = "transactionsByEmail", key = "#p0")
	public List<TransactionResponse> getTransactionsForUser(String email) {
		return transactionRepository.findByUserEmailOrderByCreatedAtDesc(email)
			.stream()
			.map(this::toResponse)
			.toList();
	}

	private User getUser(String email) {
		return userRepository.findByEmail(email)
			.orElseThrow(() -> new BadRequestException("User not found."));
	}

	private BankTransaction saveTransaction(
		User user,
		TransactionType type,
		TransactionStatus status,
		BigDecimal amount,
		String remarks,
		String senderAccountNumber,
		String receiverAccountNumber
	) {
		BankTransaction transaction = new BankTransaction(
			generateReference(type),
			type,
			status,
			amount,
			remarks,
			senderAccountNumber,
			receiverAccountNumber,
			user
		);
		return transactionRepository.save(transaction);
	}

	private TransactionResponse toResponse(BankTransaction transaction) {
		return new TransactionResponse(
			transaction.getReference(),
			transaction.getCreatedAt(),
			transaction.getType().name(),
			transaction.getAmount(),
			transaction.getStatus().name(),
			transaction.getRemarks()
		);
	}

	private void publishTransactionEvent(
		User user,
		BankTransaction transaction,
		String senderAccountNumber,
		String receiverAccountNumber
	) {
		TransactionCreatedEvent event = new TransactionCreatedEvent(
			transaction.getReference(),
			user.getEmail(),
			transaction.getType().name(),
			transaction.getStatus().name(),
			transaction.getAmount(),
			transaction.getRemarks(),
			senderAccountNumber,
			receiverAccountNumber,
			transaction.getCreatedAt()
		);

		if (TransactionSynchronizationManager.isActualTransactionActive()) {
			TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
				@Override
				public void afterCommit() {
					transactionEventPublisher.publish(event);
				}
			});
			return;
		}

		transactionEventPublisher.publish(event);
	}

	private String generateReference(TransactionType type) {
		String prefix = switch (type) {
			case DEPOSIT -> "DEP";
			case WITHDRAW -> "WTH";
			case TRANSFER -> "TRF";
		};
		return prefix + "-" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();
	}
}
