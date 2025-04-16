const { parentPort } = require('worker_threads');
import { pushInvoiceBulk } from './helperfn';

// Listen for messages from the main thread
parentPort.on('message', async ({ orders, bodyParams, headerParams, id }) => {
  try {
    console.log('Send Order Worker Received:', { bodyParams, orders });

    // Perform the task
    await pushInvoiceBulk(orders, bodyParams, headerParams);

    // Send success response back to the main thread
    parentPort.postMessage({ id, status: 'success' });
  } catch (error) {
    console.error('Error in Send Order Worker:', error);

    // Send error response back to the main thread
    parentPort.postMessage({ id, status: 'error', error: error.message });
  }
});