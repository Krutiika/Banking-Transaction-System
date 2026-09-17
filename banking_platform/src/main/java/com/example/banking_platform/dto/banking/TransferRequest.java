package com.example.banking_platform.dto.banking;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record TransferRequest(
	@NotBlank String receiverAccountNumber,
	@NotNull @DecimalMin("0.01") BigDecimal amount,
	String remarks
) {
}
