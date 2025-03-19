// src/db/prisma-clients.ts
import { PrismaClient } from '@prisma/client';

console.log('process.env:',process.env)
console.log('process.env.DATABASE_URL:',process.env.DATABASE_URL)
console.log('process.env.LIBRARY_DATABASE_URL:',process.env.LIBRARY_DATABASE_URL)
console.log('process.env.GATE2B_DATABASE_URL:',process.env.GATE2B_DATABASE_URL)
console.log('process.env.NEWGATE2B_DATABASE_URL:',process.env.NEWGATE2B_DATABASE_URL)
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
      url: process.env.LIBRARY_DATABASE_URL,
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
