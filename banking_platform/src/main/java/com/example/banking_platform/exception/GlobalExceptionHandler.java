package com.example.banking_platform.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(BadRequestException.class)
	public ResponseEntity<Map<String, String>> handleBadRequest(BadRequestException ex) {
		return build(HttpStatus.BAD_REQUEST, ex.getMessage());
	}

	@ExceptionHandler(ResourceNotFoundException.class)
	public ResponseEntity<Map<String, String>> handleNotFound(ResourceNotFoundException ex) {
		return build(HttpStatus.NOT_FOUND, ex.getMessage());
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<Map<String, String>> handleValidation(MethodArgumentNotValidException ex) {
		String message = ex.getBindingResult().getFieldErrors().stream()
			.findFirst()
			.map(error -> error.getField() + " " + error.getDefaultMessage())
			.orElse("Validation failed.");
		return build(HttpStatus.BAD_REQUEST, message);
	}

	@ExceptionHandler(BadCredentialsException.class)
	public ResponseEntity<Map<String, String>> handleBadCredentials(BadCredentialsException ex) {
		return build(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<Map<String, String>> handleGeneric(Exception ex) {
		return build(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage() == null ? "Unexpected error." : ex.getMessage());
	}

	private ResponseEntity<Map<String, String>> build(HttpStatus status, String message) {
		Map<String, String> body = new HashMap<>();
		body.put("message", message);
		return ResponseEntity.status(status).body(body);
	}
}
