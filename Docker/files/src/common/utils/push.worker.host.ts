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

  async run(invoices: any, bodyParams: any, headerParams: any): Promise<string> {
    const uniqueId = randomUUID(); // Generate a unique ID for the task

    // Send a message to the worker thread
    this.worker.postMessage({ invoices, bodyParams, headerParams, id: uniqueId });

    // Wait for the worker's response
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
  }
}