const {parentPort, workerData} = require("worker_threads");
const redis = require("redis")
const apiController = require('../../api/controllers/apiController');



// Extract req from workerData
const { headerParams, bodyParams, orders } = workerData;

// Call push with extracted data
parentPort.postMessage(push(bodyParams, orders, headerParams));

function push(bodyParams, orders, headerParams) {
    console.log("Push");
    console.log({ bodyParams, orders });
  
    // Pass req instead of the full req object
    apiController.setPurchaseOrderBulk(orders, bodyParams, headerParams);
  }