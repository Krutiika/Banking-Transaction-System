package com.example.banking_platform.dto.transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TransactionResponse(
	String reference,
	LocalDateTime createdAt,
	String type,
	BigDecimal amount,
	String status,
	String remarks
) {
}
