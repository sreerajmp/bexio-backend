// NestJS module definition for contact-import
import { Module } from '@nestjs/common';
import { ContactImportController } from './contact-import.controller';
import { SalesforceService } from './salesforce/salesforce.service';
import { DynamoDBService } from './dynamodb/dynamodb.service';
import { ContactImportService } from './contact-import.service';
import { ContactImportWorkerHost } from '../common/utils/contact-import-jobs/contact-import.worker.host';
import {schedulerContactimportWorkerHost} from '../common/utils/schedulercontactimport.worker.host'

@Module({
  controllers: [ContactImportController],
  providers: [ContactImportService, SalesforceService, DynamoDBService, ContactImportWorkerHost,schedulerContactimportWorkerHost],
})
export class ContactImportModule {}
