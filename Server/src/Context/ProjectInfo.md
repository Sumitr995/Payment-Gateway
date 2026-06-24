# Payment Gateway — Project Info

## Overview
Production-grade Payment Gateway backend. Architecture prioritises provider abstraction, idempotency, observability, and multi-tenancy. Currently at **Phase 0** (auth scaffold from the Roadmap).

## Stack
| Layer | Choice | Why |
|-------|--------|-----|
| Runtime | Node.js 22+, ES Modules | Universal, strong ecosystem |
| Framework | Express 5 | Minimal, well-understood |
| Database | MongoDB 7+ via Mongoose 9 | Flexible schema for payment metadata |
| Cache / Idempotency | Redis | Multi-purpose (rate-limit, key-value, pub/sub) |
| Message Broker | RabbitMQ | Mature, AMQP, dead-letter support |
| Auth | JWT (httpOnly cookie) + bcryptjs | Stateless sessions, secure by default |
| Validation | Zod | Runtime types, inferred TypeScript-like schemas |
| Observability | OpenTelemetry + Prometheus + Grafana | Vendor-neutral, industry standard |

## Project Structure
```
Server/
├── server.js                 # Entry: connect DB, start HTTP
├── src/
│   ├── app.js                # Express app setup, middleware chain, route mounting
│   ├── config/               # DB, Redis, broker connections
│   ├── controller/           # HTTP handlers (thin — validate + respond)
│   ├── services/             # Business logic (fat — orchestrates models, providers, events)
│   ├── models/               # Mongoose schemas + indexes
│   ├── middleware/            # Auth, rate-limit, validation, error handler
│   ├── routes/               # Express Router definitions
│   ├── utils/                # Helpers (token gen, email, crypto)
│   ├── providers/            # Payment gateway adapters (Stripe, mock)
│   ├── events/               # Event schemas, producers, consumers
│   ├── jobs/                 # Background workers (emails, reconciliation)
│   ├── validators/           # Zod schemas per route
│   └── Context/              # AI-agent context files (Roadmap, Infra, Agent, Error)
└── package.json
```

## Architecture Constraints
- **ESM only** — `"type": "module"` in package.json; use `import`/`export` everywhere
- **Controller-Service-Repository** pattern: controllers handle HTTP, services hold business rules, models access data
- **Provider Strategy**: payment providers implement a common interface; swap via config/env
- **Idempotency**: all POST payment endpoints require `Idempotency-Key` header; replay rejected with `409 Conflict`
- **Error shape**: all errors return `{ error: { code, message, details? } }`

## Key Endpoints (after full build)
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/v1/auth/register | Create account |
| POST | /api/v1/auth/login | Get session cookie |
| POST | /api/v1/auth/logout | Clear session cookie |
| GET  | /api/v1/auth/profile | Get current user (protected) |
| POST | /api/v1/payments/intent | Create payment intent (idempotent) |
| GET  | /api/v1/payments/:id | Get payment status |
| POST | /api/v1/payments/:id/capture | Capture authorized payment |
| POST | /api/v1/payments/:id/refund | Refund (partial / full) |
| POST | /api/v1/webhooks/:provider | Provider webhook receiver |
| GET  | /api/v1/health | Liveness probe |
| GET  | /api/v1/ready | Readiness probe (checks DB) |

## Running Locally
```bash
cd Server
npm install
# ensure .env has MONGO_URI, JWT_SECRET, REDIS_URL
npm start                  # node server.js
npx nodemon server.js      # dev mode with auto-restart
```

## Environment Variables
```
PORT=3000
NODE_ENV=development|production
MONGO_URI=mongodb://...
JWT_SECRET=...
REDIS_URL=redis://...
SMTP_USER=...
SMTP_PASS=...
SENDER_EMAIL=...
PAYMENT_PROVIDER=stripe|mock
STRIPE_SECRET_KEY=...
```
