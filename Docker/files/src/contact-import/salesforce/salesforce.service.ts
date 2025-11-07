// Service for Salesforce API integration
import { Injectable } from '@nestjs/common';
import { ImportContactDto } from '../dto/import-contact.dto';
import * as request from 'request';
import config from '../../common/config';
const path = require('path')
import commonErrors from '../../common/utils/commonError'
import warningMessage from '../../common/utils/warningMessage'
@Injectable()
export class SalesforceService {
  async fetchContacts(dto: ImportContactDto): Promise<any[]> {
    console.log(`Fetching contacts for company: ${dto.companyName} with netcomid: ${dto.netcomid}`);
    
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
    let accessToken: string;
    try {
      accessToken = await new Promise((resolve, reject) => {
        request(tokenOptions, (error, response, body) => {
          if (error) {
            commonErrors['errorTitle'] = 'Salesforce Token Request';
            commonErrors['errorDescription'] = `From: ${path.basename(__filename)} ${error.toString()} - tokenOptions: ${JSON.stringify(tokenOptions)}`;
            warningMessage(commonErrors, error);
            return reject(error);
          }
          console.log(`Salesforce token response: ${body}`);
          console.log(`Salesforce token response status: ${response.statusCode}`);
          const data = JSON.parse(body);
          if (data.access_token) return resolve(data.access_token);
          commonErrors['errorTitle'] = 'Salesforce Token Response';
          commonErrors['errorDescription'] = `From: ${path.basename(__filename)} No access_token - response: ${body}`;
          warningMessage(commonErrors, data);
          reject(data);
        });
      });
    } catch (error) {
      commonErrors['errorTitle'] = 'Salesforce Token Fetch Error';
      commonErrors['errorDescription'] = `From: ${path.basename(__filename)} ${error.toString()} - dto: ${JSON.stringify(dto)}`;
      warningMessage(commonErrors, error);
      console.error('Failed to fetch Salesforce access token:', error);
      return [];
    }

    if (!accessToken) {
      // Optionally log a warning here
      commonErrors['errorTitle'] = 'Salesforce Token Missing';
      commonErrors['errorDescription'] = `From: ${path.basename(__filename)} No access token available for contact query - dto: ${JSON.stringify(dto)}`;
      warningMessage(commonErrors, 'No access token');
      return [];
    }


    // 2. Query contacts by company name (Parent.Name)
    const query = `SELECT name,Iso_Email__c,BillingAddress,Iso_SAP_Partner_Type__c,Iso_SAP_Partner_ID__c,Iso_Account_1st_First_Name__c,Iso_Account_1st_Last_Name__c,Iso_Account_2nd_FName__c,Iso_Account_2nd_LName__c FROM Account WHERE Parent.Name='${dto.companyName}'`;
    const url = `${config.SALESFORCE_BASE_URL}/services/data/v59.0/query/?q=${encodeURIComponent(query)}`;
    const contactOptions = {
      method: 'GET',
      url,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      return await new Promise((resolve, reject) => {
        request(contactOptions, (error, response, body) => {
          if (error) {
            commonErrors['errorTitle'] = 'Salesforce Contact Query';
            commonErrors['errorDescription'] = `From: ${path.basename(__filename)} ${error.toString()} - contactOptions: ${JSON.stringify(contactOptions)}`;
            warningMessage(commonErrors, error);
            console.error('Error during Salesforce contact query:', error);
            return reject(error);
          }
          if (response && response.statusCode !== 200) {
            commonErrors['errorTitle'] = 'Salesforce Query Failed';
            commonErrors['errorDescription'] = `From: ${path.basename(__filename)} Status: ${response.statusCode} - Body: ${body}`;
            warningMessage(commonErrors, body);
            console.error(`Salesforce query failed: ${body}`);
            return reject(new Error(`Salesforce query failed with status ${response.statusCode}`));
          }
          console.log(`Salesforce query response status: ${response.statusCode}`);
          try {
            const data = JSON.parse(body);
            return resolve(data.records || []);
          } catch (parseError) {
            commonErrors['errorTitle'] = 'Salesforce Response Parse Error';
            commonErrors['errorDescription'] = `From: ${path.basename(__filename)} ${parseError.toString()} - Body: ${body}`;
            warningMessage(commonErrors, parseError);
            console.error('Failed to parse Salesforce response:', parseError);
            reject(parseError);
          }
        });
      });
    } catch (error) {
      commonErrors['errorTitle'] = 'Salesforce Contact Fetch Error';
      commonErrors['errorDescription'] = `From: ${path.basename(__filename)} ${error.toString()} - dto: ${JSON.stringify(dto)}`;
      warningMessage(commonErrors, error);
      console.error('Failed to fetch contacts from Salesforce:', error);
      return [];
    }
  }
}
