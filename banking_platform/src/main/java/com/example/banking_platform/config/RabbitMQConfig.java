package com.example.banking_platform.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.annotation.EnableRabbit;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableRabbit
public class RabbitMQConfig {

	@Bean
	public DirectExchange bankingExchange(@Value("${app.rabbitmq.exchange}") String exchangeName) {
		return new DirectExchange(exchangeName);
	}

	@Bean
	public Queue transactionQueue(@Value("${app.rabbitmq.transaction-queue}") String queueName) {
		return new Queue(queueName, true);
	}

	@Bean
	public Binding transactionBinding(
		Queue transactionQueue,
		DirectExchange bankingExchange,
		@Value("${app.rabbitmq.transaction-created-routing-key}") String routingKey
	) {
		return BindingBuilder.bind(transactionQueue).to(bankingExchange).with(routingKey);
	}

	@Bean
	public MessageConverter rabbitMessageConverter() {
		return new Jackson2JsonMessageConverter();
	}

	@Bean
	public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, MessageConverter rabbitMessageConverter) {
		RabbitTemplate template = new RabbitTemplate(connectionFactory);
		template.setMessageConverter(rabbitMessageConverter);
		return template;
	}
}
