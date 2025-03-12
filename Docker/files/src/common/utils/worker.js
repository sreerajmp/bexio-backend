const {parentPort, workerData} = require("worker_threads");
const redis = require("redis")
const apiController = require('../../api/controllers/apiController');

// const {
//   REDIS_PORT,
//   REDIS_HOST,
 
// } = require("./config/index");


parentPort.postMessage(push(workerData.billerId,workerData.invoices))

function push(billerId,invoices) {


  apiController.pushInvoiceTestProcess(invoices,billerId)
  // for (let index = 0; index < tempIds.length; index++) {
    
  //   const element = tempIds[index];
  //   tempParam['body']['invoice_id'] = element.invoiceId;
  //   tempParam['body']['biller_pid'] = billerId;
  //   tempParam['body']['contact_pid'] = element.recipientid;
  //   tempParam['body']['invoice_uuid'] = '';
  //   tempParam['body']['token'] = element.accessToken;
    
  //   apiController.pushInvoiceTest(tempParam)
  // }


  // const invoice_id = decryptData.invoice_id;
  // const biller_pid = decryptData.biller_pid;
  // const contact_pid = decryptData.contact_pid;
  // const invoice_uuid = decryptData?.invoice_uuid;

// console.log(api);
//   api.split(",").forEach(element => {
   
//   });
}