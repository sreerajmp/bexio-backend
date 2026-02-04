// src/db/prisma-clients.ts
import { PrismaClient } from '@prisma/client';
import { isMainThread } from 'worker_threads';

const getDatabaseUrl = (url: string | undefined) => {
  if (!url) return url;
  if (!isMainThread) {
    const separator = url.includes('?') ? '&' : '?';
    console.log(`[Worker] Limiting connection pool for: ${url.split('@')[1] || 'db'}`); // Masked log
    return `${url}${separator}connection_limit=1`;
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
