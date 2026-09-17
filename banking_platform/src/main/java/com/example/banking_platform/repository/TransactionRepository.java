package com.example.banking_platform.repository;

import com.example.banking_platform.entity.BankTransaction;
import com.example.banking_platform.entity.TransactionStatus;
import com.example.banking_platform.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<BankTransaction, Long> {

	List<BankTransaction> findByUserEmailOrderByCreatedAtDesc(String email);

	List<BankTransaction> findTop10ByOrderByCreatedAtDesc();

	List<BankTransaction> findAllByOrderByCreatedAtDesc();

	long countByCreatedAtBetween(LocalDateTime start, LocalDateTime end);

	long countByTypeAndStatus(TransactionType type, TransactionStatus status);
}
