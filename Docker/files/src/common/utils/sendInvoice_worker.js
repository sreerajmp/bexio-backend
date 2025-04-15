const {parentPort, workerData} = require("worker_threads");
import { DebtorsService } from './debtors.service';

const { headerParams, bodyParams, invoices } = workerData;


parentPort.postMessage(push(bodyParams, invoices, headerParams));

function push(bodyParams, invoices, headerParams) {
    console.log("Push");
    console.log({ bodyParams, invoices });
    DebtorsService.pushInvoiceBulk(invoices, bodyParams, headerParams);
  }