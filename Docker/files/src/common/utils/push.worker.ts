const { parentPort } = require('worker_threads');
const { pushInvoiceBulk } = require('./helperfn.js');

// Listen for messages from the main thread
parentPort.on('message', async ({ invoices, bodyParams, headerParams, id }) => {
  try {
    console.log('Push Worker Received:', { bodyParams, invoices });

    // Perform the task
    await pushInvoiceBulk(invoices, bodyParams, headerParams);

    // Send success response back to the main thread
    parentPort.postMessage({ id, status: 'success' });
  } catch (error) {
    console.error('Error in Push Worker:', error);

    // Send error response back to the main thread
    parentPort.postMessage({ id, status: 'error', error: error.message });
  }
});