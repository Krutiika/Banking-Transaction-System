package com.example.banking_platform.rabbitmq;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionCreatedEvent(
	String reference,
	String email,
	String type,
	String status,
	BigDecimal amount,
	String remarks,
	String senderAccountNumber,
	String receiverAccountNumber,
	LocalDateTime createdAt
) {
}
