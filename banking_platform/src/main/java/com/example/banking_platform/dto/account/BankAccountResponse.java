package com.example.banking_platform.dto.account;

import java.math.BigDecimal;

public record BankAccountResponse(
	String accountNumber,
	String accountType,
	BigDecimal balance,
	String status
) {
}
