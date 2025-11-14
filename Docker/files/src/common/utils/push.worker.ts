// worker.js
const { parentPort } = require('worker_threads');
const {
  pushInvoiceBulk,
  pushEbillInvoiceProcess,
  pushEmailInvoice,
  pushPrintInvoice
} = require('./helperfn');

// Keep track of processed invoices to prevent duplicates
const processedInvoiceIds = new Set();

// Listen for messages from the main thread
parentPort.on('message', async ({ invoices, bodyParams, headerParams, id, billerId, channel }) => {
  try {
    console.log('Push Worker Received:', {
      bodyParams,
      invoices,
      billerId,
      channel
    });

    if (!invoices || invoices.length === 0) {
      console.log('No invoices received, skipping...');
      parentPort.postMessage({ id, status: 'success', message: 'No invoices to process' });
      return;
    }

    // Filter out invoices already processed
    const filteredInvoices = invoices.filter(inv => {
      if (processedInvoiceIds.has(inv.invoiceId)) {
        console.log(`Skipping already processed invoice: ${inv.invoiceId}`);
        return false;
      }
      processedInvoiceIds.add(inv.invoiceId);
      return true;
    });

    if (filteredInvoices.length === 0) {
      parentPort.postMessage({ id, status: 'success', message: 'All invoices already processed' });
      return;
    }

    // Process based on channel
    switch (channel) {
      case 'EBILL':
        console.log('Push Worker Received ebill:', { bodyParams, filteredInvoices });
        if (billerId) {
          await pushEbillInvoiceProcess(filteredInvoices, billerId);
        }
        break;

      case 'email':
        console.log('Push Worker Received email:', { bodyParams, filteredInvoices });
        await pushEmailInvoice(filteredInvoices, bodyParams, headerParams, channel);
        break;

      case 'print':
        console.log('Push Worker Received print:', { bodyParams, filteredInvoices });
        await pushPrintInvoice(filteredInvoices, bodyParams, headerParams, channel);
        break;

      case 'EDI':
        console.log('Push Worker Received edi:', { bodyParams, filteredInvoices });
        await pushInvoiceBulk(filteredInvoices, bodyParams, headerParams, channel);
        break;

      default:
        console.log('Unknown channel:', channel);
        break;
    }

    // Send success response back to main thread
    parentPort.postMessage({ id, status: 'success' });

  } catch (error) {
    console.error('Error in Push Worker:', error);
    parentPort.postMessage({ id, status: 'error', error: error.message });
  }
});
