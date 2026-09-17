package com.example.banking_platform.service;

import com.example.banking_platform.dto.account.BankAccountResponse;
import com.example.banking_platform.entity.BankAccount;
import com.example.banking_platform.entity.User;

import java.util.List;

public interface AccountService {

	List<BankAccountResponse> getAccountsForUser(String email);

	List<BankAccountResponse> getAccountsForAdmin();

	BankAccount getPrimaryAccount(String email);

	BankAccount getAccountByNumber(String accountNumber);

	void createDefaultAccounts(User user);
}
