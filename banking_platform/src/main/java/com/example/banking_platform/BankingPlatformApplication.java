package com.example.banking_platform;

import org.springframework.cache.annotation.EnableCaching;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableCaching
public class BankingPlatformApplication {

	public static void main(String[] args) {
		SpringApplication.run(BankingPlatformApplication.class, args);
	}
}
