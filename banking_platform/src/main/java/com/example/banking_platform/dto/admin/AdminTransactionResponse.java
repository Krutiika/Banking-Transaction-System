package com.example.banking_platform.dto.admin;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record AdminTransactionResponse(
	String reference,
	String type,
	BigDecimal amount,
	String status,
	LocalDateTime createdAt
) {
}
