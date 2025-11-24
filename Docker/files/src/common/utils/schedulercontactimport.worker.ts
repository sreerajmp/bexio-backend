const { DynamoDBService } = require('../../contact-import/dynamodb/dynamodb.service');
import { processNextPendingJob } from "../utils/helperfn";
const { parentPort } = require('worker_threads');

if (!parentPort) {
  throw new Error('Worker must be run as a worker thread');
}

parentPort.on('message', async ({ id }) => {
  try {
    const companies = JSON.parse(process.env.CONTACT_SCHEDULE_COMPANIES || '[]');
    console.log('companies', companies);
    const dynamo = new DynamoDBService();

    // 1) Create job for each company
    for (const company of companies) {
      try {
        console.log(`Creating job for ${company.companyName} (${company.netcomid})`);
        await dynamo.createJob(company.netcomid, { netcomid: company.netcomid, companyName: company.companyName, source: 'scheduler' });
        parentPort.postMessage({ id, status: 'job_created', netcomid: company.netcomid });
      } catch (err) {
        console.error('Error creating job for', company.netcomid, err);
        parentPort.postMessage({ id, status: 'job_create_error', netcomid: company.netcomid, error: String(err) });
      }
    }

    // 2) For each company, process all pending jobs (same as contact-import.worker)
    for (const company of companies) {
      try {
        parentPort.postMessage({ id, status: 'processing_start', netcomid: company.netcomid });
        while (true) {
          const job = await dynamo.getFirstPendingJobForNetcomid(company.netcomid);
          if (!job) break;
          try {
            await processNextPendingJob(job);
            parentPort.postMessage({ id, status: 'processed_job', netcomid: company.netcomid, jobId: job.cid || job.id });
          } catch (errJob) {
            console.error('Error processing job', job, errJob);
            parentPort.postMessage({ id, status: 'job_process_error', netcomid: company.netcomid, jobId: job.cid || job.id, error: String(errJob) });
          }
        }
        parentPort.postMessage({ id, status: 'processing_done', netcomid: company.netcomid });
      } catch (err) {
        console.error('Error in processing loop for', company.netcomid, err);
        parentPort.postMessage({ id, status: 'processing_error', netcomid: company.netcomid, error: String(err) });
      }
    }

    parentPort.postMessage({ id, status: 'all_done' });
  } catch (error) {
    parentPort.postMessage({ id, status: 'error', error: String(error) });
  }
});
