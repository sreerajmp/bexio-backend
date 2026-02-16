# Setup and Installation

## Prerequisites

- Node.js 18+
- npm
- Running Redis instance
- Database connectivity required by Prisma and app DB clients

## Local Setup

1. Clone repository.
2. Install dependencies:
   ```bash
   cd Docker/files
   npm install
   ```
3. Create env file:
   ```bash
   cp ../../.env.example .env
   ```
4. Update `.env` values for your environment.
5. Start app:
   ```bash
   npm run dev
   ```

## API Access

- Base URL (local): `https://localhost:3001/api/v1`
- Swagger (development): `https://localhost:3001/api`

## Docker Notes

Top-level `README.md` and `docker-compose.yml` include container-level instructions.
Update this section with exact image names/tags used in your environment.

## Useful Commands

```bash
# Build
npm run build

# Start production build
npm run start:prod

# Lint
npm run lint

# Unit tests
npm run test

# E2E tests
npm run test:e2e
```
