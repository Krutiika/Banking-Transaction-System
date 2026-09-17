package com.example.banking_platform.dto.admin;

import java.util.List;

public record AdminDashboardResponse(
	DashboardSummaryResponse summary,
	List<AdminCustomerResponse> customers,
	List<AdminAccountResponse> accounts,
	List<AdminTransactionResponse> transactions
) {
}
