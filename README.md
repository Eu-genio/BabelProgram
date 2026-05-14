# BabelProgram

A full-stack trading simulator platform that allows users to simulate buying and selling financial assets using real market data.

Users can:

• create portfolios

• simulate buy/sell trades

• track performance over time

• view market prices and historical data  and more!

The system is built as a modular monolith backend with a React frontend.

Tech stack:

Frontend

React + TypeScript + Vite

Backend

ASP.NET Core (.NET 8)

Entity Framework Core

SQLite (dev) → PostgreSQL (future)

Architecture

Modular Monolith with clean module boundaries.

## Bash Scripts (learning + preflight)

This repo includes practical Bash scripts in `scripts/` to validate runtime setup before demos/deploys.

- `scripts/check-env.sh`
  - validates required env vars are present:
    - `Jwt__Key`
    - `Jwt__Issuer`
    - `Jwt__Audience`
    - `Finnhub__ApiKey`
    - `VITE_API_BASE_URL`
- `scripts/check-api.sh`
  - hits real endpoints with `curl`/`jq`
  - flow:
    - register temp user
    - validate `/auth/me`
    - validate market endpoints
- `scripts/preflight.sh`
  - runs env + API checks in one command

### Usage

```bash
# from repo root
bash scripts/check-env.sh
bash scripts/check-api.sh
bash scripts/preflight.sh
```

You can pass a custom env file path:

```bash
bash scripts/preflight.sh ./path/to/.env.local
```

