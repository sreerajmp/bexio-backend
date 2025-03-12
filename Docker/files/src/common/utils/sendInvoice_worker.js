const {parentPort, workerData} = require("worker_threads");
const redis = require("redis")
const apiController = require('../../api/controllers/apiController');



// Extract req from workerData
const { headerParams, bodyParams, invoices } = workerData;

// Call push with extracted data
parentPort.postMessage(push(bodyParams, invoices, headerParams));

function push(bodyParams, invoices, headerParams) {
    console.log("Push");
    console.log({ bodyParams, invoices });
  
    // Pass req instead of the full req object
    apiController.pushInvoiceBulk(invoices, bodyParams, headerParams);
  }