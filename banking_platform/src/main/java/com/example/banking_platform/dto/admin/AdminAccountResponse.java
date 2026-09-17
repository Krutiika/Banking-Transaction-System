package com.example.banking_platform.dto.admin;

import java.math.BigDecimal;

public record AdminAccountResponse(
	String accountNumber,
	String customerName,
	BigDecimal balance,
	String type
) {
}
