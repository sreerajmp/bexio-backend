const { parentPort } = require('worker_threads');
const { pushInvoiceBulk, pushInvoiceTestProcess } = require('./helperfn');

// Listen for messages from the main thread
parentPort.on('message', async ({ invoices, bodyParams, headerParams, id, billerId }) => {
  try {
    console.log('Push Worker Received:', { bodyParams, invoices, billerId });

    if (billerId) {
      console.log('Push Worker Received ebill:', { bodyParams, invoices });

      // Call the pushInvoiceTestProcess if billerId is provided
       pushInvoiceTestProcess(invoices, billerId);
    } else {
        // Perform the task
        console.log('Push Worker Received edi:', { bodyParams, invoices });
      // Perform the bulk push task
       pushInvoiceBulk(invoices, bodyParams, headerParams);
    }

    // Send success response back to the main thread
    parentPort.postMessage({ id, status: 'success' });
  } catch (error) {
    console.error('Error in Push Worker:', error);

    // Send error response back to the main thread
    parentPort.postMessage({ id, status: 'error', error: error.message });
  }
});