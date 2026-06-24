# Payment Gateway — Infrastructure

## Local Development Topology
```
┌─────────────────────────────────────────────────┐
│  Docker Compose                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │  Node.js  │  │ MongoDB  │  │    Redis      │  │
│  │  :3000    │  │ :27017   │  │  :6379        │  │
│  └────┬─────┘  └──────────┘  └──────────────┘  │
│       │                                         │
│  ┌────▼─────┐  ┌──────────────────────────────┐ │
│  │ RabbitMQ  │  │  Mailhog (fake SMTP :1025)  │ │
│  │ :5672     │  │  Web UI :8025               │ │
│  └──────────┘  └──────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

## Service Dependencies
| Service | Required | Notes |
|---------|----------|-------|
| MongoDB | Yes | Primary datastore |
| Redis | Yes | Idempotency keys, rate-limit counters, cache |
| RabbitMQ | Phase 5+ | Event bus for async flows |
| SMTP | Phase 0+ | Transactional emails (welcome, receipts) |

## Running Infrastructure (Local)
```bash
# Start all dependencies
docker compose up -d mongo redis rabbitmq mailhog

# Start the app
npm start
```

## Production Considerations (Phase 8+)
- **MongoDB**: Atlas (M10+) or self-managed replica set (minimum 3 nodes)
- **Redis**: ElastiCache / Memorystore — at least 2 nodes for HA; `maxmemory-policy allkeys-lru`
- **RabbitMQ**: clustered with mirrored queues; management plugin for monitoring
- **App**: containerised; behind ALB/NGINX; minimum 2 instances; horizontal scale on CPU/memory
- **Deployment**: ECS / EKS / K8s; rolling update with health-grace-period 30s

## CI/CD Pipeline
```
Git push → Lint → Typecheck → Test → Build image → Push to registry → Deploy staging → E2E → Deploy prod
```
GitHub Actions or equivalent. Secrets managed via GH Secrets / AWS Secrets Manager.

## Observability Stack
- **Logs**: JSON structured → stdout → CloudWatch / Loki
- **Metrics**: Prometheus `/metrics` endpoint → Grafana dashboard
- **Tracing**: OpenTelemetry SDK → Jaeger / Tempo
- **Alerting**: Prometheus AlertManager → PagerDuty / Slack

## Disaster Recovery
| Scenario | RPO | RTO | Strategy |
|----------|-----|-----|----------|
| DB corruption | 5 min | 30 min | Point-in-time recovery from oplog |
| AZ failure | 0 | 5 min | Multi-AZ deployment |
| Region failure | 15 min | 1 hr | Cross-region replica + DNS failover |

## Security Boundaries
- All inter-service traffic over TLS
- Network ACLs: app tier → db tier (port 27017, 6379, 5672), no public ingress to data tier
- Secrets rotated every 90 days
- WAF in front of API for OWASP top-10 protection
