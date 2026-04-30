# Babel Program Deploy Checklist

## 1) Environment Variables

### Backend (`Babel.Api`)
- `Jwt:Key` - strong secret, 32+ chars.
- `Jwt:Issuer` - production issuer string.
- `Jwt:Audience` - production audience string.
- `Database:Provider` - `postgres` for production.
- `ConnectionStrings:DefaultConnection` - production DB connection string.

### Frontend (`Babel-ui`)
- `VITE_API_BASE_URL` - API host (with or without `/api`; code normalizes both).

## 2) Backend Readiness
- Set production CORS origins (replace localhost origin with frontend domain).
- Run EF Core migrations against production DB before first traffic.
- Confirm HTTPS is enabled at hosting layer.
- Verify auth endpoints:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Verify protected endpoints reject missing tokens (`401`).

## 3) Frontend Readiness
- Build with `npm run build`.
- Verify login/register/trading flow against production API URL.
- Confirm session expiration behavior:
  - invalid/expired token -> redirect/login state reset.

## 4) Smoke Test (post-deploy)
- Register new user.
- Create first portfolio.
- Place buy trade and confirm holdings/value updates.
- Attempt invalid trade (e.g. insufficient cash) and confirm clear UI error.
- Logout and login again.

## 5) Monitoring + Recovery
- Enable host logs for backend and frontend.
- Backup and retention configured for production database.
- Keep rollback instructions documented (previous build + DB migration rollback strategy).
