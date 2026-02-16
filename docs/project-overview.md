# Project Overview

## Purpose

`bexio_be` is a NestJS-based integration API that connects io-market/gate2b systems with the Bexio platform.
It provides backend capabilities for modules such as debtors, creditors, bexio user management, dashboard, configuration, and contact import.

## Scope

- Provide API endpoints under `api/v1`
- Handle Bexio-connected business operations
- Persist/query data via Prisma-backed databases
- Manage sessions via Redis-backed express session store

## High-Level Capabilities

- Bexio user token and identity operations
- Debtor and creditor workflows
- Contact import from external systems (Salesforce/DynamoDB)
- Dashboard/configuration endpoints

## Runtime Summary

- Framework: NestJS
- Language: TypeScript
- ORM: Prisma
- Cache/Session: Redis (`connect-redis` + `express-session`)
- API Docs: Swagger in development environment




