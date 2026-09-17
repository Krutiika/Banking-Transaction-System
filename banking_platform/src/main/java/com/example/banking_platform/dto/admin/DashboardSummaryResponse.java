package com.example.banking_platform.dto.admin;

public record DashboardSummaryResponse(
	long totalCustomers,
	long totalAccounts,
	long todaysTransactions,
	long pendingTransfers
) {
}
