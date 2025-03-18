// src/db/prisma-clients.ts
import { PrismaClient } from '@prisma/client';

export const connectBexio = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export const connectLibrary = new PrismaClient({
  datasources: {
    db: {
      url: process.env.LIABRARY_DATABASE_URL,
    },
  },
});

export const connectGate2b = new PrismaClient({
  datasources: {
    db: {
      url: process.env.GATE2B_DATABASE_URL,
    },
  },
});
export const connectNewGate2b = new PrismaClient({
  datasources: {
    db: {
      url: process.env.NEWGATE2B_DATABASE_URL,
    },
  },
});
