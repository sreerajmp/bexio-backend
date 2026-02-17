# Architecture

## System Overview

The `Docker-iom-bexio_interface_api` is a NestJS-based backend service that acts as an interface between Bexio (ERP) and various output channels (Gate2B, eBill, Email, Print). It handles invoice processing, contact synchronization, and dashboard analytics.

### High-Level Architecture

```mermaid
graph TD
    Client[Client / Frontend] -->|REST API / HTTPS| API_Gateway[NestJS API Gateway]
    
    subgraph "Application Core"
        API_Gateway --> Auth[Auth & Session (Redis)]
        API_Gateway --> Pipes[Global Validation Pipes]
        Pipes --> Modules[Feature Modules]
    end

    subgraph "Feature Modules"
        Modules --> UserMod[BexioUser Module]
        Modules --> DebtorsMod[Debtors Module]
        Modules --> CreditorsMod[Creditors Module]
        Modules --> DashboardMod[Dashboard Module]
    end

    subgraph "Data & Background"
        DebtorsMod -->|Jobs| Queue[Bull Queue / WorkerPool]
        Queue --> PushWorker[Push Worker Host]
        Queue --> DeliveryWorker[Delivery Notes Host]
        Modules --> Prisma[Prisma Client]
        Prisma --> DB[(Database)]
        Auth --> Redis[(Redis Cache)]
    end

    subgraph "External Integrations"
        UserMod -->|REST| BexioAPI[Bexio API]
        PushWorker -->|SOAP/REST| Gate2B[Gate2B / IO-Market]
        PushWorker -->|SMTP| Email[Email Service]
    end
```

## Application Structure

The application is modularized following NestJS best practices. The root module `AppModule` composes the following feature modules:

-   **BexioUserModule**: Handles user authentication and synchronization with Bexio.
-   **DebtorsModule**: Core logic for processing debtor invoices, including routing and status updates.
-   **CreditorsModule**: Manages creditor workflows (if applicable).
-   **DashboardModule**: Provides analytics and KPI data for the frontend dashboard.
-   **ConfigurationModule**: Manages global configuration and environment variables.
-   **ContactImportModule**: Import and synchronization of contacts.
-   **DatabaseModule**: Encapsulates Prisma client for database access.

## Request Flow

1.  **Incoming Request**: Client triggers an API call (e.g., `POST /api/v1/debtors/invoice`).
2.  **Middleware**: `cookie-parser` and `express-session` (backed by Redis) validate the session.
3.  **Guards & Pipes**:
    -   Global `ValidationPipe` ensures DTOs are valid.
    -   Auth guards (if applied) check for valid user context.
4.  **Controller**: Routes the request to the appropriate service method.
5.  **Service Layer**: Executes business logic.
    -   May query the database via Prisma.
    -   May call external APIs (Bexio).
    -   May offload heavy tasks to background workers.
6.  **Response**: Returns standard JSON response to the client.

## Background Processing (Workers)

The application uses a worker implementation (likely `workerpool` or `bull` based on dependencies) to handle long-running tasks asynchronously.

-   **PushWorkerHost**: Handles the transmission of invoices to external systems (IO-Market/Gate2B, Email, etc.).
-   **SendDeliveryNotesHost**: Processes delivery note generation and sending.

## Integrations

-   **Bexio**: Source of truth for contacts and invoices.
-   **Redis**: Distributed session storage and potential caching.
-   **Prisma**: ORM for type-safe database interactions.
-   **IO-Market / Gate2B**: Target interface for EDI invoice delivery.

## Security

-   **Sessions**: Stored in Redis with `httpOnly` and `secure` flags (in production).
-   **CORS**: Strict origin whitelist in production settings.
-   **Validation**: Input sanitization via `class-validator`.

## Environment Boundaries

-   **Development**:
    -   Swagger UI enabled at `/api`.
    -   Relaxed CORS (allows localhost).
-   **Production**:
    -   Swagger disabled (typically).
    -   Strict CORS allowed only for `BEXIO_APP_URL` and `BILLING_URL`.
