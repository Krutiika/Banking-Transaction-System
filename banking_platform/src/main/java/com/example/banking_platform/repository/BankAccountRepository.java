package com.example.banking_platform.repository;

import com.example.banking_platform.entity.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {

	Optional<BankAccount> findByAccountNumber(String accountNumber);

	List<BankAccount> findByUserEmailOrderByCreatedAtAsc(String email);

	List<BankAccount> findAllByOrderByCreatedAtDesc();
}
