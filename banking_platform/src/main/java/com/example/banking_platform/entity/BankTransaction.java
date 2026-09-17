package com.example.banking_platform.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class BankTransaction {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String reference;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private TransactionType type;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private TransactionStatus status;

	@Column(nullable = false, precision = 19, scale = 2)
	private BigDecimal amount;

	@Column(length = 1000)
	private String remarks;

	private String senderAccountNumber;

	private String receiverAccountNumber;

	@Column(nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private User user;

	protected BankTransaction() {
	}

	public BankTransaction(
		String reference,
		TransactionType type,
		TransactionStatus status,
		BigDecimal amount,
		String remarks,
		String senderAccountNumber,
		String receiverAccountNumber,
		User user
	) {
		this.reference = reference;
		this.type = type;
		this.status = status;
		this.amount = amount;
		this.remarks = remarks;
		this.senderAccountNumber = senderAccountNumber;
		this.receiverAccountNumber = receiverAccountNumber;
		this.user = user;
	}

	@PrePersist
	void onCreate() {
		createdAt = LocalDateTime.now();
	}

	public Long getId() {
		return id;
	}

	public String getReference() {
		return reference;
	}

	public TransactionType getType() {
		return type;
	}

	public TransactionStatus getStatus() {
		return status;
	}

	public BigDecimal getAmount() {
		return amount;
	}

	public String getRemarks() {
		return remarks;
	}

	public String getSenderAccountNumber() {
		return senderAccountNumber;
	}

	public String getReceiverAccountNumber() {
		return receiverAccountNumber;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public User getUser() {
		return user;
	}
}
