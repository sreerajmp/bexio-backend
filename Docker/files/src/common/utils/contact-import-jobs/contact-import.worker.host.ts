import { Injectable } from '@nestjs/common';
import { Worker } from 'worker_threads';
import { join } from 'path';

@Injectable()
export class ContactImportWorkerHost {
  private worker: Worker;

  startWorker(netcomid: string, companyName: string) {
    if (!this.worker || !this.worker.threadId) {
      this.worker = new Worker(join(__dirname, 'contact-import.worker.js'));
      this.worker.postMessage({ netcomid, companyName });
      this.worker.on('message', (msg) => {
        console.log('Contact import worker message:', msg);
      });
      this.worker.on('exit', (code) => {
        console.log(`Contact import worker exited with code ${code}`);
      });
    } else {
      this.worker.postMessage({ netcomid });
    }
  }
}
