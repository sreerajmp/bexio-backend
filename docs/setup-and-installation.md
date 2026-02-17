# Setup and Installation

## Prerequisites

-   **Node.js**: v18 or higher
-   **npm**: v9 or higher
-   **Docker** (optional, for running dependencies like Redis/SQL Server locally)
-   **Redis**: Required for session management and caching.
-   **Database**: MSSQL (via Prisma)

## Local Setup

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd Docker-iom-bexio_interface_api/Docker/files
    ```

2.  **Install dependencies**:
    ```bash
   cd Docker/files
    npm install
    ```

3.  **Generate Prisma Client**:
    ```bash
    npx prisma generate
    ```

4.  **Environment Configuration**:
    Copy the example environment file:
    ```bash
    cp ../../.env.example .env
    ```
    > [!IMPORTANT]
    > You must populate `.env` with real values. See the [Environment Variables](#environment-variables) section below.

5.  **Start the Application**:
    ```bash
    # Development mode (watch mode)
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
    ```

## Environment Variables

The application relies on several environment variables defined in `src/common/config/index.ts`.

### Core Application
| Variable | Description | Default |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment mode (`development`, `production`) | `production` |
| `PORT` | HTTP port to listen on | `5000` |
| `LOG_LEVEL` | Logging verbosity (`silly`, `info`, `error`) | `silly` |

### Database & Redis
| Variable | Description | Default |
| :--- | :--- | :--- |
| `DB_HOST` | Database Host | - |
| `DB_PORT` | Database Port | - |
| `DB_USER` | Database Username | - |
| `DB_PASSWORD` | Database Password | - |
| `DB_NAME` | Database Name | - |
| `REDIS_HOST` | Redis Host | `localhost` |
| `REDIS_PORT` | Redis Port | `6379` |

### Authentication & Session
| Variable | Description |
| :--- | :--- |
| `JWT_SECRET` | Secret for signing JWTs |
| `SESSION_SECRET` | Secret for session cookies |
| `SESSION_DOMAIN` | Domain for session cookies |

### Integrations (Bexio)
| Variable | Description |
| :--- | :--- |
| `BEXIO_CLIENT_ID` | OAuth Client ID for Bexio |
| `BEXIO_SECRET` | OAuth Client Secret for Bexio |
| `BEXIO_APP_URL` | URL of the connected frontend app |

### Integrations (Salesforce)
| Variable | Description |
| :--- | :--- |
| `SALESFORCE_BASE_URL` | Base URL for Salesforce API |
| `SALESFORCE_CLIENT_ID` | Salesforce Client ID |
| `SALESFORCE_CLIENT_SECRET` | Salesforce Client Secret |

### Email (SMTP)
| Variable | Description |
| :--- | :--- |
| `SMTP_HOST` | SMTP Server Host |
| `SMTP_PORT` | SMTP Server Port |
| `SMTP_USER` | SMTP Username |
| `SMTP_PASSWORD` | SMTP Password |

## Troubleshooting

### Database Connection Fails
-   Ensure your IP is whitelisted if connecting to a remote Azure SQL/AWS RDS instance.
-   Verify credentials in `.env`.

### Redis Error
-   Ensure Redis is running (`redis-cli ping` should return `PONG`).
-   If using Docker, check if the container is up.

### "Too many database connections"
-   Check `prisma` connection pool settings.
-   Verify if multiple workers are spawning too many clients.
