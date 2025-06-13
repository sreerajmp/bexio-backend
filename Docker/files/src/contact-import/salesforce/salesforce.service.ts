// Service for Salesforce API integration
import { Injectable } from '@nestjs/common';
import { ImportContactDto } from '../dto/import-contact.dto';
import * as request from 'request';
import config from '../../common/config';

@Injectable()
export class SalesforceService {
  async fetchContacts(dto: ImportContactDto): Promise<any[]> {
    // 1. Get Salesforce access token using env/config values
    const tokenOptions = {
      method: 'POST',
      url: `${config.SALESFORCE_BASE_URL}/services/oauth2/token`,
      formData: {
        username: config.SALESFORCE_USERNAME,
        password: config.SALESFORCE_PASSWORD,
        client_id: config.SALESFORCE_CLIENT_ID,
        client_secret: config.SALESFORCE_CLIENT_SECRET,
        grant_type: 'password',
      },
    };
    const accessToken: string = await new Promise((resolve, reject) => {
      request(tokenOptions, (error, response, body) => {
        if (error) return reject(error);
        const data = JSON.parse(body);
        if (data.access_token) return resolve(data.access_token);
        reject(data);
      });
    });

    // 2. Query contacts by company name (Parent.Name)
    const query = `SELECT name,Iso_Email__c,BillingAddress,Iso_SAP_Partner_Type__c FROM Account WHERE Parent.Name='${dto.companyName}'`;
    const url = `${config.SALESFORCE_BASE_URL}/services/data/v59.0/query/?q=${encodeURIComponent(query)}`;
    const contactOptions = {
      method: 'GET',
      url,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    return await new Promise((resolve, reject) => {
      request(contactOptions, (error, response, body) => {
        if (error) return reject(error);
        const data = JSON.parse(body);
        resolve(data.records || []);
      });
    });
  }
}
