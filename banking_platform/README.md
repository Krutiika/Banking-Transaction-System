# Banking Platform Backend

Spring Boot backend scaffold for the banking system.

## Layers

- JWT auth and Spring Security
- Controllers
- Services
- Repositories
- MySQL entities
- Redis caching
- RabbitMQ event processing

## API Surface

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/accounts` protected
- `GET /api/transactions` protected
- `GET /api/profile` protected
- `POST /api/profile` protected
- `POST /api/deposit` protected
- `POST /api/withdraw` protected
- `POST /api/transfer` protected
- `GET /api/admin/dashboard` admin only

## Security

- Public routes: `/api/auth/**`
- Protected routes: all other `/api/**` endpoints
- Admin-only routes: `/api/admin/**`
- Send the JWT on every protected request:
  - `Authorization: Bearer <token>`
- Unauthenticated requests return `401`
- Forbidden requests return `403`

## Runtime Setup

Set these environment variables before starting the app:

- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `REDIS_HOST`
- `REDIS_PORT`
- `RABBITMQ_HOST`
- `RABBITMQ_PORT`
- `RABBITMQ_USERNAME`
- `RABBITMQ_PASSWORD`
- `BANKING_EXCHANGE`
- `BANKING_TRANSACTION_CREATED_ROUTING_KEY`
- `BANKING_TRANSACTION_QUEUE`

The app defaults to:

- `server.port=8000`
- MySQL database `banking_platform`
