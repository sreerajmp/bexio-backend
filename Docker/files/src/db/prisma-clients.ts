// src/db/prisma-clients.ts
import { PrismaClient } from '@prisma/client';
import { isMainThread } from 'worker_threads';

const hasConnectionLimit = (url: string) => /[?&]connection_limit=/.test(url);
const getDatabaseUrl = (url: string | undefined) => {
  if (!url) return url;
  const separator = url.includes('?') ? '&' : '?';
  const limitFromEnv = process.env.PRISMA_CONN_LIMIT;
  if (!isMainThread) {
    console.log(`[Worker] Limiting connection pool for: ${url.split('@')[1] || 'db'}`); // Masked log
    return hasConnectionLimit(url) ? url : `${url}${separator}connection_limit=1`;
  }
  if (limitFromEnv && !hasConnectionLimit(url)) {
    return `${url}${separator}connection_limit=${limitFromEnv}`;
  }
  return url;
};

export const connectBexio = new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl(process.env.DATABASE_URL),
    },
  },
});

export const connectLibrary = new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl(process.env.LIBRARY_DATABASE_URL),
    },
  },
});

export const connectGate2b = new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl(process.env.GATE2B_DATABASE_URL),
    },
  },
});
export const connectNewGate2b = new PrismaClient({
  datasources: {
    db: {
      url: getDatabaseUrl(process.env.NEWGATE2B_DATABASE_URL),
    },
  },
});
