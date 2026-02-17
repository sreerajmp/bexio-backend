# Modules and Code Responsibilities

## Core Modules

### `BexioUserModule`

- Paths: `Docker/files/src/bexio-user/*`
- Responsibility: Bexio token/user-related operations.

### `DebtorsModule`

- Paths: `Docker/files/src/debtors/*`
- Responsibility: Debtor-related business flows and API operations.

### `CreditorsModule`

- Paths: `Docker/files/src/creditors/*`
- Responsibility: Creditor workflows, invoice and order-related processing.
- Note: `creditors.service.ts` includes external API calls, DB operations, and status handling logic.

### `ContactImportModule`

- Paths: `Docker/files/src/contact-import/*`
- Responsibility: Contact import pipeline and integrations (Salesforce, DynamoDB).

### `ConfigurationModule`

- Paths: `Docker/files/src/configuration/*`
- Responsibility: Runtime/application configuration endpoints.

### `DashboardModule`

- Paths: `Docker/files/src/dashboard/*`
- Responsibility: Dashboard data endpoints.

## Shared Utilities

- Common helpers/interceptors/utils under `Docker/files/src/common/*`
- DB connection helpers under `Docker/files/src/db/*`

## Technical Debt and Refactor Targets (recommended)

- Reduce very large service methods into smaller units.
- Standardize response/error envelope across modules.
- Move hardcoded defaults and secrets fully to env-managed config.
