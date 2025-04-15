const {parentPort, workerData} = require("worker_threads");
const redis = require("redis")
const apiController = require('../../api/controllers/apiController');
parentPort.postMessage(push(workerData.billerId,workerData.invoices))
function push(billerId,invoices) {
  apiController.pushInvoiceTestProcess(invoices,billerId)
}