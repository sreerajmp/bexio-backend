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
      this.logPoolConfig();
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

  /**
   * Logs effective pool settings on startup so they are visible in Grafana.
   * connection_limit × 4 clients = total max DB connections from this pod.
   */
  private logPoolConfig() {
    const connLimit = process.env.PRISMA_CONN_LIMIT || '5';
    const poolTimeout = process.env.PRISMA_POOL_TIMEOUT || '10';
    const totalMax = Number(connLimit) * 4;

    this.logger.log(
      `DB pool config — connection_limit: ${connLimit} per client × 4 clients = ${totalMax} max connections | pool_timeout: ${poolTimeout}s`,
    );
  }
}
