import { Injectable, Logger, OnApplicationShutdown } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { isMainThread } from 'worker_threads';
import {
  connectBexio,
  connectLibrary,
  connectGate2b,
  connectNewGate2b,
} from './prisma-clients';

@Injectable()
export class PrismaClientsService implements OnApplicationShutdown {
  readonly connectBexio: PrismaClient = connectBexio;
  readonly connectLibrary: PrismaClient = connectLibrary;
  readonly connectGate2b: PrismaClient = connectGate2b;
  readonly connectNewGate2b: PrismaClient = connectNewGate2b;

  private readonly logger = new Logger(PrismaClientsService.name);

  constructor() {
    if (isMainThread) {
      this.warnIfMissingConnectionLimit();
    }
  }

  static getClients(): {
    connectBexio: PrismaClient;
    connectLibrary: PrismaClient;
    connectGate2b: PrismaClient;
    connectNewGate2b: PrismaClient;
  } {
    return {
      connectBexio,
      connectLibrary,
      connectGate2b,
      connectNewGate2b,
    };
  }

  async onApplicationShutdown(signal?: string) {
    this.logger.log(`Shutting down Prisma clients${signal ? ` (${signal})` : ''}`);
    await Promise.allSettled([
      connectBexio.$disconnect(),
      connectLibrary.$disconnect(),
      connectGate2b.$disconnect(),
      connectNewGate2b.$disconnect(),
    ]);
  }

  private warnIfMissingConnectionLimit() {
    const urls = [
      { name: 'DATABASE_URL', value: process.env.DATABASE_URL },
      { name: 'LIBRARY_DATABASE_URL', value: process.env.LIBRARY_DATABASE_URL },
      { name: 'GATE2B_DATABASE_URL', value: process.env.GATE2B_DATABASE_URL },
      { name: 'NEWGATE2B_DATABASE_URL', value: process.env.NEWGATE2B_DATABASE_URL },
    ];
    const missing = urls.filter(
      (u) => u.value && !/[?&]connection_limit=/.test(u.value),
    );
    if (missing.length > 0 && !process.env.PRISMA_CONN_LIMIT) {
      this.logger.warn(
        `connection_limit is not set in ${missing
          .map((u) => u.name)
          .join(', ')}. Consider adding ?connection_limit=N or PRISMA_CONN_LIMIT.`,
      );
    }
  }
}
