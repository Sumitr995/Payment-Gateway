# Payment Gateway — Development Roadmap

## Guiding Principles
- **Learn by building** — each phase introduces a new distributed-systems or backend concept
- **Production mindset** — everything we add must be scalable, observable, and secure by default
- **No spoonfeeding** — phases describe *what* and *why*; the *how* is for us to figure out together

---

## Phase 0: Project Spine (Done)
Core Express + MongoDB auth scaffold. Single-user session via JWT cookies.

**Concepts touched:** REST API, JWT, bcrypt, HTTP-only cookies, Nodemailer

---

## Phase 1: API Trust Layer
*Goal: secure every endpoint, prevent abuse, and detect duplicates*

| Sub-phase | Focus | Key additions |
|-----------|-------|---------------|
| **1.1** | Rate Limiting | Token-bucket / sliding-window per-IP and per-user; Redis backend; `429` responses with `Retry-After` |
| **1.2** | Input Validation & Sanitization | Zod or Joi schemas per route; centralized validation middleware |
| **1.3** | Idempotency | Idempotency-Key header → Redis TTL; replay detection; safe retry for payment intents |
| **1.4** | Global Error Handler | Unified `AppError` class; async wrapper; consistent JSON error shape |

**Why:** No production API ships without these. Rate limiting prevents cascading failure; idempotency is mandatory for money-moving endpoints.

---

## Phase 2: Payment Core
*Goal: process payments with real provider integration*

| Sub-phase | Focus | Key additions |
|-----------|-------|---------------|
| **2.1** | Payment Models & Schema | `Payment`, `Transaction`, `Refund` Mongoose models; status enum + state machine |
| **2.2** | Payment Intents API | `POST /api/payments/intent`, `GET /api/payments/:id`; idempotent creation |
| **2.3** | Provider Abstraction | Strategy pattern — `StripeProvider`, `MockProvider`; swap via config |
| **2.4** | Webhook Receiver | Verify provider signature; update Payment status; emit events |
| **2.5** | Refund & Capture | Partial/full refund; delayed capture for auth-only flows |

**Why:** The provider abstraction is the single most important architectural decision — it lets us test offline and add new gateways without touching business logic.

---

## Phase 3: Caching & Performance
*Goal: reduce latency, protect the DB, and scale reads*

| Sub-phase | Focus | Key additions |
|-----------|-------|---------------|
| **3.1** | Redis Integration | Connection pool; config with retry logic; Docker Compose for local dev |
| **3.2** | Cache-Aside Layer | Decorator pattern for service methods; TTL per entity; manual invalidation on writes |
| **3.3** | Pagination & Cursor-based | Efficient listing for transactions; `?cursor=...&limit=...` |
| **3.4** | Database Indexing Audit | `.explain()` on every hot query; compound indexes for payment lookups |

**Why:** Redis does double duty — idempotency keys (Phase 1) and cache (Phase 3). Cache-aside is simple to reason about and easy to evict.

---

## Phase 4: Security Hardening
*Goal: defence in depth — beyond basic auth*

| Sub-phase | Focus | Key additions |
|-----------|-------|---------------|
| **4.1** | API Keys & HMAC Signing | Merchant API key pair; HMAC request signing; key rotation endpoint |
| **4.2** | CORS, CSP, Helmet | Strict origin allow-list; Content-Security-Policy; HSTS |
| **4.3** | Payload Encryption | AES-256-GCM for sensitive fields at rest; TLS 1.3 for transit |
| **4.4** | Audit Log | Immutable log per state transition; who, what, when, previous state |

**Why:** Payment gateways are high-value targets. Audit logs are required for compliance (PCI-DSS).

---

## Phase 5: Asynchronous & Event-Driven
*Goal: decouple critical paths and survive partial failures*

| Sub-phase | Focus | Key additions |
|-----------|-------|---------------|
| **5.1** | Message Broker (RabbitMQ) | Topology: exchange per event type; dead-letter queue; retry with backoff |
| **5.2** | Event Producers & Consumers | `payment.succeeded`, `payment.failed`, `refund.completed` → separate handlers |
| **5.3** | Outbox Pattern | Write events atomically with DB transaction; relay worker picks them up |
| **5.4** | Background Job Worker | Separate process/container for async work (email, reconciliation, reporting) |

**Why:** Synchronous payment flows are fragile. Event-driven architecture lets us retry, replay, and recover without blocking the user.

---

## Phase 6: Observability
*Goal: know what's happening in production without guessing*

| Sub-phase | Focus | Key additions |
|-----------|-------|---------------|
| **6.1** | Structured Logging | `pino` or `winston` with correlation IDs; JSON format; log levels per env |
| **6.2** | Distributed Tracing | OpenTelemetry instrumentation; trace propagation across broker boundaries |
| **6.3** | Metrics & Dashboards | Prometheus counters (requests, errors, latency histograms); Grafana board |
| **6.4** | Health & Readiness Probes | `GET /health` (liveness), `GET /ready` (DB, Redis, broker connectivity) |

**Why:** Without observability you're debugging blind. Tracing is non-negotiable once you have async flows.

---

## Phase 7: Multi-Tenant & Multi-Currency
*Goal: serve multiple merchants and regions*

| Sub-phase | Focus | Key additions |
|-----------|-------|---------------|
| **7.1** | Merchant Onboarding | Tenant isolation (discriminator or separate DB); `X-Merchant-ID` header |
| **7.2** | Currency & FX | ISO 4217; live FX rates via external API; `amount` stored in smallest unit (cents) |
| **7.3** | Payouts Engine | Batch payout to merchant bank accounts; reconciliation report |
| **7.4** | Invoice Generation | PDF invoice; tax calculation hook; store in S3/compatible |

**Why:** Multi-tenancy forces clean separation of concerns and is the final step before production deployment.

---

## Phase 8: Production Readiness
*Goal: ship with confidence*

| Sub-phase | Focus | Key additions |
|-----------|-------|---------------|
| **8.1** | Test Suite | Unit → Integration → E2E (Supertest + testcontainers); idempotency & race-condition tests |
| **8.2** | CI/CD Pipeline | GitHub Actions: lint → typecheck → test → build → deploy; semantic release |
| **8.3** | Containerization | Multi-stage Dockerfile; docker-compose with all dependencies; health checks |
| **8.4** | Disaster Recovery | Backup RPO/RTO; failover plan; runbook for common incidents |

**Why:** Testing async/idempotent code requires dedicated effort. Containers ensure dev/prod parity.

---

## Phase 9 (Stretch): Advanced Distributed Systems
*Goal: true high-availability and scale*

| Sub-phase | Focus |
|-----------|-------|
| **9.1** | Database sharding (MongoDB hashed shard key on merchant_id) |
| **9.2** | Read replicas + CQRS for reporting queries |
| **9.3** | Circuit breaker pattern (Opossum) for downstream providers |
| **9.4** | Blue-green deployment & canary releases |

---

## Progress Tracking

- [x] **Phase 0**: Project Spine
- [x] **Phase 1.1**: Rate Limiting (`express-rate-limit`, global + auth-specific)
- [x] **Phase 1.2**: Input Validation (Zod schemas, `validate` middleware)
- [x] **Phase 1.4**: Global Error Handler (`AppError`, `asyncHandler`, `errorHandler` middleware)
- [x] **Phase 1.3**: Idempotency (Redis-backed)
- [x] **Phase 2.1**: Payment Models & Schema (`Payment`, `Transaction`, `Refund` Mongoose models; status enum + state machine)
- [ ] **Phase 2.2**: Payment Intents API
- [x] **Phase 2.3**: Provider Abstraction (Strategy pattern — `StripeProvider`, `MockProvider`; swap via config)
- [ ] **Phase 2.4**: Webhook Receiver
- [ ] **Phase 2.5**: Refund & Capture
- [ ] **Phase 3**: Caching & Performance
- [ ] **Phase 3**: Caching & Performance
- [ ] **Phase 4**: Security Hardening
- [ ] **Phase 5**: Async & Event-Driven
- [ ] **Phase 6**: Observability
- [ ] **Phase 7**: Multi-Tenant & Multi-Currency
- [ ] **Phase 8**: Production Readiness
- [ ] **Phase 9**: Advanced Distributed Systems
