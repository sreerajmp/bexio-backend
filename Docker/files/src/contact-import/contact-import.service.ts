// Business logic for importing and processing contacts
import { Injectable } from '@nestjs/common';
import { ImportContactDto } from './dto/import-contact.dto';
import { DynamoDBService } from './dynamodb/dynamodb.service';
import { ContactImportWorkerHost } from '../common/utils/contact-import-jobs/contact-import.worker.host';
const encryptionControl = require('../common/utils/jwt-decode');
import connectMssql from '../db/mssql-client';
import { Request, Response } from 'express';
import config from '../common/config/index';
import * as request from 'request';
import { schedulerContactimportWorkerHost } from '../common/utils/schedulercontactimport.worker.host';
import commonErrors from 'src/common/utils/commonError';
const path = require('path');
import warningMessage from 'src/common/utils/warningMessage';
import {
  getContactGroupList,
  getContactIdsByChannel,
  getCountryLists,
} from 'src/common/utils/helperfn';
@Injectable()
export class ContactImportService {
  constructor(
    // private readonly salesforceService: SalesforceService,
    private readonly dynamoDBService: DynamoDBService,
    private readonly contactImportWorkerHost: ContactImportWorkerHost,
    private readonly schedulerContactimportWorkerHost: schedulerContactimportWorkerHost,
  ) {}

  async importContacts(dto: any) {
    // Check for existing pending/in_progress job for this netcomid
    const existingJob =
      await this.dynamoDBService.getFirstPendingJobForNetcomid(dto.netcomid);
    if (existingJob) {
      return {
        message: 'A job is already pending or in progress for this company',
        jobId: existingJob.cid,
      };
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

  async schedulercontact(req: Request, res: Response): Promise<any> {
    try {
      await this.schedulerContactimportWorkerHost.startWorker();
      return res.status(200).json({ success: true, message: 'Worker started' });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to start worker',
        error: err?.message || err,
      });
    }
  }

  async contactImportSearch(req: Request, res: Response): Promise<any> {
    try {
      console.log('contactImportSearch initiated. Body:', JSON.stringify(req.body));
      const cookieData = req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME];

      if (!cookieData) {
        return res.status(401).send({
          status_code: 401,
          message: 'Missing_cookie',
          status: false,
        });
      }
      const cookie = JSON.parse(
        encryptionControl.decryptCookie(JSON.stringify(cookieData)),
      );

      const accessToken = cookie.access_Token;
      const name = req.body?.name;
      const channel=req.body?.channel
      const email=req.body?.email
      const page=parseInt(req.body?.page)
      const limit=parseInt(req.body?.limit)

      // Prepare search array only if name exists
      console.log('accessToken', accessToken);

      const countryList = await getCountryLists(accessToken);

      console.log('countryList', countryList);

      const contactList: any = await searchContact(accessToken, {name,channel,email},page,limit);
      
      console.log('searchContact result:', JSON.stringify(contactList));

      if (contactList?.statusCode === 401) {
         console.log('contactImportSearch: unauthorized (401) from bexio');
         return res.status(401).send({
          status_code: 401,
          message: 'Unauthorized',
          status: false,
        });
      }

      console.log('contactList', contactList);

      const contactGroupId = await getContactGroupList(accessToken);

      console.log('contactGroupId', contactGroupId);

      if (countryList && typeof countryList === 'string') {
        const parsedCountryList = JSON.parse(countryList);
        if (contactList && Array.isArray(contactList)) {
          contactList.forEach((contact) => {
            if (contact.country_id) {
              const country = parsedCountryList.find(
                (c: any) => c.id == contact.country_id,
              );
              if (country) {
                contact['country_name'] = country.name;
                contact['country_code'] = country.iso_3166_alpha2;
              }
            }
          });
        }
      }

      if(contactGroupId && Array.isArray(contactGroupId)){
        if(contactList && Array.isArray(contactList)){
          contactList.forEach((contact)=>{
            if(contact.contact_group_ids){
              const groupIds=contact.contact_group_ids.split(',')
             const groupNames = groupIds
              .map((id) => contactGroupId.find(g => g.id == id))          
              contact["contact_group_list"]=groupNames || []
            }
          })
        }
      }

      console.log('contactList', contactList);
      return res.status(200).send({
        status_code: 200,
        data: contactList,
        status: true,
      });
    } catch (err: any) {
      commonErrors['errorTitle'] = 'getContactById';
      commonErrors['errorDescription'] =
        'From:' + path.basename(__filename) + '-bexio param,';
      warningMessage(commonErrors, err);
      return res.status(500).send({
        status_code: 500,
        message: 'failed',
        status: false,
      });
    }
  }
}


const searchContact = async (accessToken: string, {name,channel,email}:{name?:string,channel?:string,email?:string},page:number,limit:number ) => {
  console.log('searchContact called with:', { name, channel, email });
  let optionsContact: any;
  let searchJson:any[]=[]
  let arrayContactIds:any[]=[]

  // 1. Prepare Filter Data (Async operations MUST happen here, before the Promise)
  if (name && name.length > 0) {
     searchJson.push({
        field: 'name_1',
        value: name,
        criteria: 'like',
      })
  }

 if (email && email.length > 0) {
     searchJson.push({
        field: 'mail',
        value: email,
        criteria: 'like',
      })
  }

  if(channel){
       if (channel === "print") {
        let printContactIds = await getContactIdsByChannel(accessToken, "print");
        let postContactIds = await getContactIdsByChannel(accessToken, "post")
        arrayContactIds = [...new Set([...printContactIds, ...postContactIds])];
        console.log("printContactIds", printContactIds);
        console.log("postContactIds", postContactIds);
        console.log("arrayContactIds :::",arrayContactIds);
      }else{
        arrayContactIds = await getContactIdsByChannel(accessToken, channel);
        console.log(`arrayContactIds ${channel} :`, arrayContactIds);
    }
       if (channel === "ebill") {
        let printContactIds = await getContactIdsByChannel(accessToken, "ebill");
        arrayContactIds = [...new Set([...printContactIds])];
        console.log("printContactIds", printContactIds);
        console.log("arrayContactIds :::",arrayContactIds);

        if (arrayContactIds.length > 0) {
          searchJson.push({
            field: 'id',
            value: arrayContactIds,
            criteria: 'in'
          });
        }
    }
      if (channel === "email") {
        let printContactIds = await getContactIdsByChannel(accessToken, "email");
        arrayContactIds = [...new Set([...printContactIds])];
        console.log("printContactIds", printContactIds);
        console.log("arrayContactIds :::",arrayContactIds);

        if (arrayContactIds.length > 0) {
          searchJson.push({
            field: 'id',
            value: arrayContactIds,
            criteria: 'in'
          });
        }
    }
  }

    console.log("arrayContactIds :::",arrayContactIds);
    if (arrayContactIds.length) {
      searchJson.push({
        field: 'id',
        value: arrayContactIds,
        criteria: 'in'
      });
    }
    //    if (channel === "ebill") {
    //     let printContactIds = await getContactIdsByChannel(accessToken, "ebill");
    //     arrayContactIds = [...new Set([...printContactIds])];
    //     console.log("printContactIds", printContactIds);
    //     console.log("arrayContactIds :::",arrayContactIds);

    //     if (arrayContactIds.length > 0) {
    //       searchJson.push({
    //         field: 'id',
    //         value: arrayContactIds,
    //         criteria: 'in'
    //       });
    //     }
    // }
    //   if (channel === "email") {
    //     let printContactIds = await getContactIdsByChannel(accessToken, "email");
    //     arrayContactIds = [...new Set([...printContactIds])];
    //     console.log("printContactIds", printContactIds);
    //     console.log("arrayContactIds :::",arrayContactIds);

    //     if (arrayContactIds.length > 0) {
    //       searchJson.push({
    //         field: 'id',
    //         value: arrayContactIds,
    //         criteria: 'in'
    //       });
    //     }
    // }

  // 2. Configure Options based on whether we have search criteria
  console.log('Constructed searchJson:', JSON.stringify(searchJson));
  const offset=(page-1)*limit
  console.log("contact search offset",offset);
  console.log("contact search limit",limit);
  
  
  if(searchJson.length > 0){
      console.log('contact search using criteria');
      optionsContact = {
        method: 'POST',
        url: `${config.BEXIO_API}2.0/contact/search?offset=${offset}&limit=${limit}`,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(searchJson),
      };
  } else {
      console.log('contact List (no criteria)');
      optionsContact = {
        method: 'GET',
        url: `${config.BEXIO_API}2.0/contact?offset=${offset}&limit=${limit}`,
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      };
  }

  // 3. Execute Request (Wrapped in Promise)
  return new Promise((resolve) => {
    request(optionsContact, (error, response) => {
      if (error) {
        commonErrors['errorTitle'] = 'searchContact';
        commonErrors['errorDescription'] =
          'From:' + path.basename(__filename) + '-bexio param,';
        warningMessage(commonErrors, error);
            // Return error object instead of false
        return resolve({ error: true, message: error.message, statusCode: 500 });
      }
      console.log("optionsContact",optionsContact);
      console.log("Contact response",response);
      if (response?.statusCode === 200) {
        try {
          console.log('contact data', JSON.parse(response.body));
          return resolve(JSON.parse(response.body));
        } catch {
             // Return error on parse failure
          return resolve({ error: true, message: 'JSON Parse Error', statusCode: 500 });
        }
      }
       // Return error object with status code
      console.log('API Error Body:', response?.body); 
      return resolve({ error: true, statusCode: response?.statusCode || 500, message: 'API Error' });
    });
  });
};

  


// const searchContact = async (
//   accessToken: string,
//   { name, channel }: { name?: string; channel?: string }
// ) => {
//   let optionsContact: any;
//   let searchJson: any[] = [];
//   let arrayContactIds: any[] = [];

//   if (name && name.length > 0) {
//     searchJson.push({
//       field: 'name_1',
//       value: name,
//       criteria: 'like',
//     });
//   }

//   if (channel && channel.length > 0) {
//     if (channel === 'print') {
//       const printContactIds = await getContactIdsByChannel(accessToken, 'print');
//       const postContactIds = await getContactIdsByChannel(accessToken, 'post');

//       arrayContactIds = [...new Set([...printContactIds, ...postContactIds])];

//       console.log('printContactIds', printContactIds);
//       console.log('postContactIds', postContactIds);
//       console.log('arrayContactIds :::', arrayContactIds);
//     }
//   }

//   if (searchJson.length > 0) {
//     optionsContact = {
//       method: 'POST',
//       url: `${config.BEXIO_API}2.0/contact/search`,
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${accessToken}`,
//       },
//       body: JSON.stringify(searchJson),
//     };
//   } else {
//     optionsContact = {
//       method: 'GET',
//       url: `${config.BEXIO_API}2.0/contact`,
//       headers: {
//         Accept: 'application/json',
//         Authorization: `Bearer ${accessToken}`,
//       },
//     };
//   }

//   return new Promise((resolve) => {
//     request(optionsContact, (error, response) => {
//       if (error) {
//         return resolve(false);
//       }

//       if (response?.statusCode === 200) {
//         try {
//           return resolve(JSON.parse(response.body));
//         } catch {
//           return resolve(false);
//         }
//       }

//       return resolve(false);
//     });
//   });
// };