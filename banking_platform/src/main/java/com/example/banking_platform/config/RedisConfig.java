package com.example.banking_platform.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.CacheManager;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

@Configuration
public class RedisConfig {

	private static final Logger log = LoggerFactory.getLogger(RedisConfig.class);
	private static final String[] CACHE_NAMES = {
		"accountsByEmail",
		"transactionsByEmail",
		"adminAccounts",
		"adminDashboard",
		"userProfile"
	};

	@Bean
	public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory connectionFactory) {
		RedisTemplate<String, Object> template = new RedisTemplate<>();
		template.setConnectionFactory(connectionFactory);
		template.setKeySerializer(new StringRedisSerializer());
		template.setHashKeySerializer(new StringRedisSerializer());
		template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
		template.setHashValueSerializer(new GenericJackson2JsonRedisSerializer());
		template.afterPropertiesSet();
		return template;
	}

	@Bean
	public CacheManager cacheManager(RedisConnectionFactory connectionFactory) {
		try {
			try (var connection = connectionFactory.getConnection()) {
				connection.ping();
			}

			GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer();

			RedisCacheConfiguration cacheConfiguration = RedisCacheConfiguration.defaultCacheConfig()
				.entryTtl(Duration.ofMinutes(10))
				.disableCachingNullValues()
				.serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(new StringRedisSerializer()))
				.serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(serializer));

			return RedisCacheManager.builder(connectionFactory)
				.cacheDefaults(cacheConfiguration)
				.withInitialCacheConfigurations(java.util.Arrays.stream(CACHE_NAMES)
					.collect(java.util.stream.Collectors.toMap(
						cacheName -> cacheName,
						cacheName -> cacheConfiguration
					)))
				.build();
		} catch (Exception ex) {
			log.warn("Redis is unavailable, using in-memory cache fallback instead: {}", ex.getMessage());
			return new ConcurrentMapCacheManager(CACHE_NAMES);
		}
	}
}
