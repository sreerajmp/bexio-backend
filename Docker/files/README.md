# Bexio Interface API Service

This API service acts as an interface for integrating with the Bexio business platform. It provides endpoints for managing invoices, contacts, orders, and other business operations, facilitating seamless communication between external applications and Bexio.

## Technology Stack

-   **Framework:** NestJS
-   **Database:** PostgreSQL
-   **ORM:** Prisma
-   **Caching/Session:** Redis
-   **Language:** TypeScript

## Prerequisites

-   Node.js (v18+ recommended)
-   npm
-   PostgreSQL local instance or connection string
-   Redis local instance or connection string

## Installation

1.  Clone the repository:
    ```bash
    git clone <repository_url>
    cd <repository_name>
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Configuration

1.  Copy the sample environment file:
    ```bash
    cp .env_SAMPLE .env
    ```

2.  Update the `.env` file with your configuration. Key variables include:

    -   `PORT`: Application port (default: 4000)
    -   `DATABASE_URL`: PostgreSQL connection string (e.g., `postgresql://user:password@localhost:5432/mydb`)
    -   `REDIS_HOST`, `REDIS_PORT`: Redis connection details
    -   `SMTP_*`: Email configuration
    -   `SESSION_SECRET`: Secret for session management
    -   `encryptionKey`: Key for data encryption

## Running the Application

### Development
```bash
npm run dev
```
The application will start in watch mode.

### Production
```bash
npm run build
npm run start:prod
```

## API Documentation

The API documentation is generated using Swagger.

-   **Local Development:** Access the Swagger UI at `http://localhost:3001/api`.
-   **Base URL:** The API endpoints are prefixed with `/api/v1`.
-   **JSON Spec:** The Swagger JSON is available at `http://localhost:3001/api-json`.

## Database Migration

To apply database migrations using Prisma:

```bash
npx prisma migrate dev
```

## Key Modules

-   **Debtors:** Manages debtor-related operations (Invoices, Contacts).
-   **Creditors:** Manages creditor-related operations.
-   **Bexio User:** Handles Bexio user authentication and management.
-   **Contact Import:** Handles importing contacts.
