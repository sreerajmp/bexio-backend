import { Injectable } from '@nestjs/common';
import { Worker } from 'worker_threads';
import { join } from 'path';

@Injectable()
export class schedulerContactimportWorkerHost {
  private worker: Worker;

  startWorker() {
    if (!this.worker || !this.worker.threadId) {
      this.worker = new Worker(join(__dirname, 'schedulercontactimport.worker.js'));
      this.worker.postMessage('');
      this.worker.on('message', (msg) => {
        console.log('Contact import worker message:', msg);
      });
      this.worker.on('exit', (code) => {
        console.log(`Contact import worker exited with code ${code}`);
      });
    } else {
      this.worker.postMessage('');
    }
  }
}