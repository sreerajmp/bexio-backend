import { processNextPendingJob } from "../helperfn";
const { parentPort } = require('worker_threads');
const { DynamoDBService } = require('../../../contact-import/dynamodb/dynamodb.service');




parentPort.on('message', async ({ netcomid,companyName }) => {
  const dynamoDBService = new DynamoDBService();
  while (true) {
    const job = await dynamoDBService.getFirstPendingJobForNetcomid(netcomid);
    if (!job) break;
    await processNextPendingJob(dynamoDBService,companyName);
  }
  parentPort.postMessage({ status: 'all_done', netcomid });
});
