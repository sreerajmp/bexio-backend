// Business logic for importing and processing contacts
import { Injectable } from '@nestjs/common';
import { ImportContactDto } from './dto/import-contact.dto';
import { DynamoDBService } from './dynamodb/dynamodb.service';
import { ContactImportWorkerHost } from '../common/utils/contact-import-jobs/contact-import.worker.host';

@Injectable()
export class ContactImportService {
  constructor(
    // private readonly salesforceService: SalesforceService,
    private readonly dynamoDBService: DynamoDBService,
    private readonly contactImportWorkerHost: ContactImportWorkerHost, 
  ) {}

  async importContacts(dto: any) {
    // Check for existing pending/in_progress job for this netcomid
    const existingJob = await this.dynamoDBService.getFirstPendingJobForNetcomid(dto.netcomid);
    if (existingJob) {
      return { message: 'A job is already pending or in progress for this company', jobId: existingJob.cid };
    }
    // 1. Create job entry in DynamoDB with status 'pending' and store request params
    const job = await this.dynamoDBService.createJob(dto.netcomid, dto);
    // 2. Trigger worker for this netcomid (worker will fetch contacts and process)
    this.contactImportWorkerHost.startWorker(dto.netcomid, dto.companyName);
    return { message: 'Contact import job created', jobId: job.cid };
  }

  async getCurrentJobStatus(netcomid: string) {
    return this.dynamoDBService.getJobDataByNetcomid(netcomid);
  }
}
