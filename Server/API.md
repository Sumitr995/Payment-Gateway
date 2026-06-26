# Payment Gateway — API Reference

Base URL: `http://localhost:3000/api/v1`

---

## Auth

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** `201`
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com"
}
```
Sets `jwt` httpOnly cookie.

---

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** `200`
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```
Sets `jwt` httpOnly cookie.

---

### Logout
```http
POST /auth/logout
```

**Response** `200`
```json
{
  "message": "Logged out successfully"
}
```

---

### Get Profile
```http
GET /auth/profile
Cookie: jwt=...
```

**Response** `200`
```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

## Payments

### Create Payment Intent
```http
POST /payments/intent
Cookie: jwt=...
Idempotency-Key: uuid-v4-string
Content-Type: application/json

{
  "amount": 2000,
  "currency": "usd",
  "description": "Test payment",
  "metadata": {
    "orderId": "123"
  }
}
```

**Response** `201`
```json
{
  "_id": "...",
  "amount": 2000,
  "currency": "usd",
  "status": "requires_confirmation",
  "description": "Test payment",
  "metadata": { "orderId": "123" },
  "idempotencyKey": "uuid-v4-string",
  "provider": "mock",
  "providerPaymentId": "mock_pi_...",
  "user": "...",
  "errorMessage": "",
  "createdAt": "...",
  "updatedAt": "..."
}
```

| Status | Description |
|--------|-------------|
| `201` | Created |
| `400` | Missing/Invalid `Idempotency-Key` |
| `409` | Request already being processed (duplicate key) |
| `502` | Provider error |

---

### Get Payment
```http
GET /payments/:id
Cookie: jwt=...
```

**Response** `200`
```json
{
  "_id": "...",
  "amount": 2000,
  "currency": "usd",
  "status": "requires_confirmation",
  "description": "Test payment",
  "metadata": { "orderId": "123" },
  "idempotencyKey": "uuid-v4-string",
  "provider": "mock",
  "providerPaymentId": "mock_pi_...",
  "user": "...",
  "errorMessage": "",
  "createdAt": "...",
  "updatedAt": "..."
}
```

| Status | Description |
|--------|-------------|
| `200` | OK |
| `404` | Payment not found |

---

## Webhooks

### Receive Webhook (Mock)
```http
POST /webhooks/mock
Content-Type: application/json

{
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "mock_pi_<providerPaymentId>",
      "status": "succeeded"
    }
  }
}
```

### Receive Webhook (Stripe)
```http
POST /webhooks/stripe
Content-Type: application/json
Stripe-Signature: <stripe-signature>

{
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_...",
      "status": "succeeded"
    }
  }
}
```

**Response** `200`
```json
{
  "received": true,
  "success": true
}
```

| Event Type | Payment Status |
|---|---|
| `payment_intent.succeeded` | `succeeded` |
| `payment_intent.processing` | `processing` |
| `payment_intent.requires_action` | `requires_confirmation` |
| `payment_intent.requires_payment_method` | `requires_payment_method` |
| `payment_intent.payment_failed` | `failed` |
| `payment_intent.canceled` | `failed` |

---

## Health

### Liveness
```http
GET /health
```

**Response** `200`
```json
{
  "status": "ok",
  "timestamp": "...",
  "uptime": 123.45
}
```

### Readiness
```http
GET /ready
```

**Response** `200`
```json
{
  "status": "ok",
  "services": {
    "database": "connected",
    "redis": "connected"
  }
}
```

---

## Error Shape

All errors follow this format:
```json
{
  "error": {
    "code": 400,
    "message": "Validation failed",
    "details": [
      { "field": "amount", "message": "Amount must be positive" }
    ]
  }
}
```

| Code | Meaning |
|------|---------|
| `400` | Validation failure / bad request |
| `401` | Not authenticated |
| `404` | Resource not found |
| `409` | Conflict (duplicate / already processing) |
| `429` | Rate limited |
| `500` | Internal server error |
| `502` | Upstream provider error |
