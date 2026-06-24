# AGENTS.md — Payment Gateway

## What this is
A production-grade Payment Gateway backend. Currently at **Phase 0** (auth scaffold). See `src/Context/Roadmap.md` for the full plan.

## Quickstart
```bash
cd Server
npm install
# set MONGO_URI, JWT_SECRET, REDIS_URL in .env
npm start            # node server.js
npx nodemon server.js   # dev mode
```

## Architecture
- Express 5 + MongoDB (Mongoose 9) + Redis + RabbitMQ (later)
- ES Modules only (`"type": "module"`)
- Controller-Service-Model pattern
- Provider strategy pattern for payment gateways
- `src/Context/` contains AI context files: Roadmap, Infra, ProjectInfo, Error, Agent

## Key Conventions
| Thing | Rule |
|-------|------|
| Error shape | `{ error: { code, message, details? } }` via `AppError` class |
| API versioning | All routes under `/api/v1/*` |
| Global error handler | `AppError` (operational) → 4xx/5xx; uncaught → 500; last middleware in chain |
| Idempotency | POST payments require `Idempotency-Key` header → Redis TTL |
| Imports | ESM `import`/`export` only (no `require`) |
| Naming | Files: PascalCase; functions: camelCase; models: PascalCase |
| Middleware order | `cookieParser` → `express.json` → rate-limit → routes → error handler |

## Commands
- `npm start` — production
- `npx nodemon server.js` — dev with auto-restart
- `npm test` — currently placeholder; Phase 8 adds full suite

## Known Gotchas (Windows)
- `dns.setServers` needed in `config/DB.js` for MongoDB Atlas SRV on some networks
- Use `;` to chain commands in PowerShell, not `&&`
- Cookie `secure: true` only in production — already handled in `utils/utils.js`

## Context Files
Read these before starting work:
- `src/Context/Roadmap.md` — phased development plan with progress checkboxes
- `src/Context/ProjectInfo.md` — stack, structure, endpoints, env vars
- `src/Context/Infra.md` — local and production infrastructure topology
- `src/Context/Agent.md` — AI collaboration protocol and session flow
- `src/Context/Error.md` — logged mistakes and preventions
