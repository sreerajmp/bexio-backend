import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { Worker } from 'worker_threads';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { fromEvent, Observable, firstValueFrom } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class PushWorkerHost implements OnApplicationBootstrap, OnApplicationShutdown {
  private worker: Worker;
  private messages$: Observable<{ id: string; status: string; error?: string }>;

  onApplicationBootstrap() {
    // Initialize the worker thread
    this.worker = new Worker(join(__dirname, 'push.worker.js'));

    // Create an observable from the worker's message events
    this.messages$ = fromEvent(this.worker, 'message') as Observable<{
      id: string;
      status: string;
      error?: string;
    }>;
  }

  async onApplicationShutdown() {
    // Terminate the worker thread
    await this.worker.terminate();
  }

  async run(invoices: any, bodyParams: any, headerParams: any, billerid?: any, channel?: string, allow?:string): Promise<string> {
    const uniqueId = randomUUID(); // Generate a unique ID for the task

    try {
        // Send a message to the worker thread
        this.worker.postMessage({ invoices, bodyParams, headerParams, id: uniqueId, billerId: billerid ,channel: channel,allow});
        console.log(`Worker triggered with ID: ${uniqueId}`);

        return firstValueFrom(
          this.messages$.pipe(
            filter(({ id }) => id === uniqueId), // Filter messages by unique ID
            map(({ status, error }) => {
              if (status === 'error') {
                throw new Error(error);
              }
              return status;
            })
          )
        );
    } catch (error) {
        console.error(`Error triggering worker with ID: ${uniqueId}`, error);
        throw new Error("Failed to trigger worker");
    }
  }
}