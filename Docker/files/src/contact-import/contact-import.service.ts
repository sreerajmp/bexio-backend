// Business logic for importing and processing contacts
import { Injectable } from '@nestjs/common';
import { ImportContactDto } from './dto/import-contact.dto';
import { SalesforceService } from './salesforce/salesforce.service';
import { BexioService } from './bexio/bexio.service';
import { DynamoDBService } from './dynamodb/dynamodb.service';
import { ContactImportWorkerHost } from '../common/utils/contact-import-jobs/contact-import.worker.host';

@Injectable()
export class ContactImportService {
  constructor(
    private readonly salesforceService: SalesforceService,
    private readonly bexioService: BexioService,
    private readonly dynamoDBService: DynamoDBService,
    private readonly contactImportWorkerHost: ContactImportWorkerHost, 
  ) {}

  async importContacts(dto: ImportContactDto) {
    // Check for existing pending/in_progress job for this netcomid
    const existingJob = await this.dynamoDBService.getFirstPendingJobForNetcomid(dto.netcomid);
    if (existingJob) {
      return { message: 'A job is already pending or in progress for this company', jobId: existingJob.jobId };
    }
    // 1. Create job entry in DynamoDB with status 'pending' and store request params
    const job = await this.dynamoDBService.createJob(dto.netcomid, dto);
    // 2. Trigger worker for this netcomid (worker will fetch contacts and process)
    this.contactImportWorkerHost.startWorker(dto.netcomid,dto.companyName);
    return { message: 'Contact import job created', jobId: job.jobId };
  }

  async getCurrentJobStatus(netcomid: string) {
    return this.dynamoDBService.getFirstPendingJobForNetcomid(netcomid);
  }
}
