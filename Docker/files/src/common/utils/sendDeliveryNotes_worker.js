const {parentPort, workerData} = require("worker_threads");
const redis = require("redis")
const apiController = require('../../api/controllers/apiController');



// Extract req from workerData
const { headerParams, bodyParams, deliveryItems } = workerData;

// Call push with extracted data
parentPort.postMessage(push(bodyParams, deliveryItems, headerParams));

function push(bodyParams, deliveryItems, headerParams) {
    console.log("Push");
    console.log({ bodyParams, deliveryItems });
  
    // Pass req instead of the full req object
    apiController.setDeliveryNotesBulk(deliveryItems, bodyParams, headerParams);
  }