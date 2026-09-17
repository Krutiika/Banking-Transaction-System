package com.example.banking_platform.rabbitmq;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class TransactionEventPublisher {

	private static final Logger log = LoggerFactory.getLogger(TransactionEventPublisher.class);

	private final RabbitTemplate rabbitTemplate;
	private final String exchangeName;
	private final String routingKey;

	public TransactionEventPublisher(
		RabbitTemplate rabbitTemplate,
		@Value("${app.rabbitmq.exchange}") String exchangeName,
		@Value("${app.rabbitmq.transaction-created-routing-key}") String routingKey
	) {
		this.rabbitTemplate = rabbitTemplate;
		this.exchangeName = exchangeName;
		this.routingKey = routingKey;
	}

	public void publish(TransactionCreatedEvent event) {
		try {
			rabbitTemplate.convertAndSend(exchangeName, routingKey, event);
		} catch (Exception ex) {
			log.warn(
				"RabbitMQ publish skipped for transaction {} because the broker is unavailable: {}",
				event.reference(),
				ex.getMessage()
			);
		}
	}
}
