const { parentPort } = require('worker_threads');
const { pushInvoiceBulk, pushInvoiceTestProcess,pushEmailInvoice,pushPrintInvoice } = require('./helperfn');

// Listen for messages from the main thread
parentPort.on('message', async ({ invoices, bodyParams, headerParams, id, billerId,channel }) => {
  try {
    console.log('Push Worker Received:', { bodyParams, invoices, billerId });

    if (channel=='EBILL') {
      console.log('Push Worker Received ebill:', { bodyParams, invoices });

      // Call the pushInvoiceTestProcess if billerId is provided
       pushInvoiceTestProcess(invoices, billerId);
    } 
    if(channel=='email') {
      console.log('Push Worker Received email:', { bodyParams, invoices });
      // Perform the bulk push task
      pushEmailInvoice(invoices, bodyParams,headerParams, channel);
    }
    if(channel=='print') {
      console.log('Push Worker Received print:', { bodyParams, invoices });
      // Perform the bulk push task
      pushPrintInvoice(invoices, bodyParams,headerParams, channel);
    }
    if (channel=='EDI') {
        // Perform the task
        console.log('Push Worker Received edi:', { bodyParams, invoices });
      // Perform the bulk push task
       pushInvoiceBulk(invoices, bodyParams, headerParams, 'EDI');
    }

    // Send success response back to the main thread
    parentPort.postMessage({ id, status: 'success' });
  } catch (error) {
    console.error('Error in Push Worker:', error);

    // Send error response back to the main thread
    parentPort.postMessage({ id, status: 'error', error: error.message });
  }
});