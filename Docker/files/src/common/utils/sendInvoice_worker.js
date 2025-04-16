import { parentPort, workerData } from 'worker_threads';
import { pushInvoiceBulk } from './helperfn';

async function push(bodyParams, invoices, headerParams) {
  console.log('Push');
  console.log({ bodyParams, invoices });
  await pushInvoiceBulk(invoices, bodyParams, headerParams);
}

// Destructure workerData
const { headerParams, bodyParams, invoices } = workerData;

// Call the push function and handle errors
push(bodyParams, invoices, headerParams)
  .then(() => {
    parentPort?.postMessage({ status: 'success' });
  })
  .catch((error) => {
    console.error('Error in worker:', error);
    parentPort?.postMessage({ status: 'error', error });
  });