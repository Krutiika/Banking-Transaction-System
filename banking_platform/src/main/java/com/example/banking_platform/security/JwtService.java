package com.example.banking_platform.security;

import com.example.banking_platform.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {

	private final String secret;
	private final long expirationMinutes;

	public JwtService(
		@Value("${app.jwt.secret}") String secret,
		@Value("${app.jwt.expiration-minutes}") long expirationMinutes
	) {
		this.secret = secret;
		this.expirationMinutes = expirationMinutes;
	}

	public String generateToken(User user) {
		Date now = new Date();
		Date expiry = new Date(now.getTime() + expirationMinutes * 60_000L);

		return Jwts.builder()
			.setSubject(user.getEmail())
			.claim("role", user.getRole().name())
			.claim("userId", user.getId())
			.setIssuedAt(now)
			.setExpiration(expiry)
			.signWith(getSignInKey(), SignatureAlgorithm.HS256)
			.compact();
	}

	public String extractUsername(String token) {
		return extractAllClaims(token).getSubject();
	}

	public boolean isTokenValid(String token, UserDetails userDetails) {
		return extractUsername(token).equals(userDetails.getUsername()) && !isTokenExpired(token);
	}

	public boolean isTokenExpired(String token) {
		return extractAllClaims(token).getExpiration().before(new Date());
	}

	public Claims extractAllClaims(String token) {
		return Jwts.parserBuilder()
			.setSigningKey(getSignInKey())
			.build()
			.parseClaimsJws(token)
			.getBody();
	}

	private SecretKey getSignInKey() {
		return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
	}
}
