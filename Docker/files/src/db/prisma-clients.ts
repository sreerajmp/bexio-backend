// src/db/prisma-clients.ts
import { PrismaClient } from '@prisma/client';
import { isMainThread } from 'worker_threads';

/**
 * Builds a Prisma-compatible DB URL with explicit pool settings.
 *
 * connection_limit: Max simultaneous connections this client may hold.
 *   - Workers: 1  (they are short-lived, should not hog connections)
 *   - Main thread: PRISMA_CONN_LIMIT env var (default: 5 per client)
 *     With 4 clients → 4 × 5 = 20 connections total — well within a
 *     typical PostgreSQL max_connections of 100.
 *
 * pool_timeout: Seconds to wait for a free connection before throwing.
 *   Prevents requests from hanging forever when the pool is exhausted.
 */
const hasParam = (url: string, param: string) =>
  new RegExp(`[?&]${param}=`).test(url);

const getDatabaseUrl = (url: string | undefined): string | undefined => {
  if (!url) return url;

  const connLimit = isMainThread
    ? (process.env.PRISMA_CONN_LIMIT || '5')   // default 5 per client on main thread
    : '1';                                       // workers get exactly 1

  const poolTimeout = process.env.PRISMA_POOL_TIMEOUT || '10'; // seconds

  const separator = url.includes('?') ? '&' : '?';
  let result = url;

  if (!hasParam(result, 'connection_limit')) {
    result += `${separator}connection_limit=${connLimit}`;
  }
  if (!hasParam(result, 'pool_timeout')) {
    result += `&pool_timeout=${poolTimeout}`;
  }

  if (!isMainThread) {
    console.log(`[Worker] DB pool capped at 1 for: ${url.split('@')[1]?.split('?')[0] || 'db'}`);
  }

  return result;
};

export const connectBexio = new PrismaClient({
  datasources: { db: { url: getDatabaseUrl(process.env.DATABASE_URL) } },
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export const connectLibrary = new PrismaClient({
  datasources: { db: { url: getDatabaseUrl(process.env.LIBRARY_DATABASE_URL) } },
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export const connectGate2b = new PrismaClient({
  datasources: { db: { url: getDatabaseUrl(process.env.GATE2B_DATABASE_URL) } },
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export const connectNewGate2b = new PrismaClient({
  datasources: { db: { url: getDatabaseUrl(process.env.NEWGATE2B_DATABASE_URL) } },
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});
