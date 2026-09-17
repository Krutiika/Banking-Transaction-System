package com.example.banking_platform.rabbitmq;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class TransactionEventListener {

	private static final Logger log = LoggerFactory.getLogger(TransactionEventListener.class);

	@RabbitListener(queues = "${app.rabbitmq.transaction-queue}")
	public void handleTransactionCreated(TransactionCreatedEvent event) {
		log.info(
			"Processed transaction event reference={} type={} status={} amount={} email={}",
			event.reference(),
			event.type(),
			event.status(),
			event.amount(),
			event.email()
		);
	}
}
