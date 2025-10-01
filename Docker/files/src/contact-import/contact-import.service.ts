// Business logic for importing and processing contacts
import { Injectable } from '@nestjs/common';
import { ImportContactDto } from './dto/import-contact.dto';
import { DynamoDBService } from './dynamodb/dynamodb.service';
import { ContactImportWorkerHost } from '../common/utils/contact-import-jobs/contact-import.worker.host';
import { getContactSearch, updateBexioContact } from 'src/common/utils/helperfn';
const encryptionControl = require("../common/utils/jwt-decode");
import connectMssql from '../db/mssql-client'
import { Request, Response } from 'express';
import config from '../common/config/index';
import {schedulerContactimportWorkerHost} from'../common/utils/schedulercontactimport.worker.host'
@Injectable()
export class ContactImportService {
  constructor(
    // private readonly salesforceService: SalesforceService,
    private readonly dynamoDBService: DynamoDBService,
    private readonly contactImportWorkerHost: ContactImportWorkerHost,private readonly schedulerContactimportWorkerHost: schedulerContactimportWorkerHost,
  ) { }

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

  async ebillSyncBexioContact(req: Request, res: Response): Promise<any> {
    try {
      console.log("ebillSyncBexioContact called with body:", req.body);
      
      // Validate netcomid
      const netcomid = req.body.netcomid;
      console.log("Received netcomid:", netcomid);
      
      if (!netcomid) {
        return { message: 'Missing netcomid in request body' };
      }

      // Validate cookie
      const signedCookie = req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME];
      console.log("Received signedCookie:", signedCookie);
      
      if (!signedCookie) {
        return { message: 'Missing authentication cookie' };
      }

      let cookie;
      try {
        cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(signedCookie)));
        console.log("Decrypted cookie:", cookie);
        
      } catch (err) {
        return { message: 'Invalid authentication cookie' };
      }

      const accessToken = cookie.access_Token;
      if (!accessToken) {
        return { message: 'Missing access token in cookie' };
      }

      const pool = await connectMssql;
      const getRecipientsQuery = `
        SELECT r.recipientId, r.email
        FROM recipient r
        INNER JOIN biller b ON r.fk_biller = b.id
        WHERE b.netcomid = '${req.body.netcomid}'
          AND r.email IS NOT NULL
          AND r.email <> ''
      `;
      const recipients = await pool.query(getRecipientsQuery);
      console.log("recipients", recipients.recordset);
      console.log("recipients", typeof recipients.recordset);

      if (!recipients.recordset || recipients.recordset.length === 0) {
        return { message: 'No recipients found for this netcomid' };
      }
      
      // Collect all emails from recipients
      const emails = recipients.recordset.map(rec => rec.email);

      // Build searchJson for Bexio contact search
      const searchJson = [{
        field: "mail",
        value: emails,
        criteria: "in"
      }];

      // Query Bexio contacts by email array
      const bexioContacts: any = await getContactSearch(accessToken, searchJson);
      console.log("bexioContacts", bexioContacts);
      
      // Loop through Bexio contacts and update each contact with corresponding recipientId
      for (const contact of bexioContacts) {
        const contactEmail = contact.mail;
        const recipient = recipients.recordset.find(rec => rec.email === contactEmail);
        if (recipient) {
          const contactId = contact.id;
          const recipientId = recipient.recipientId;
          await updateBexioContact(accessToken, contactId, recipientId);
        }
      }

      return { message: 'Sync completed' };
    } catch (error) {
      return { message: 'Error during sync', error: error?.message || error };
    }
  }
  async schedulercontact(req: Request, res: Response): Promise<any>{
    this.schedulerContactimportWorkerHost.startWorker();
  }
}
