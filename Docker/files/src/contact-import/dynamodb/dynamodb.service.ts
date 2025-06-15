// Service for DynamoDB job management
import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import config from '../../common/config';

const dynamoDb = new AWS.DynamoDB.DocumentClient({
accessKeyId: config.DYNAMODB_CLIENT_ID,
  secretAccessKey: config.DYNAMODB_SECRET_KEY,
  region: "eu-central-2",
});

const TABLE_NAME = 'contact_import_manager';

@Injectable()
export class DynamoDBService {
  async getJobData(cid: string): Promise<any> {
    const params = {
      TableName: TABLE_NAME,
      Key: { cid },
    };
    const result = await dynamoDb.get(params).promise();
    return result.Item;
  }

  async getJobDataByNetcomid(netcomid: string): Promise<any> {
    // DynamoDB only allows efficient sorting on the sort key of the index.
    // If 'requestedAt' is the sort key of 'netcomid-status-index', you can query with ScanIndexForward: false.
    const params = {
      TableName: TABLE_NAME,
      IndexName: 'netcomid-status-index',
      KeyConditionExpression: '#netcomid = :netcomid',
      ExpressionAttributeNames: { '#netcomid': 'netcomid' },
      ExpressionAttributeValues: { ':netcomid': netcomid },
      ScanIndexForward: false, // Descending order on the sort key
      Limit: 1, // Only get the latest
    };
    const result = await dynamoDb.query(params).promise();
    return result.Items && result.Items.length > 0 ? result.Items[0] : null;
  }
  async markJobComplete(cid: string): Promise<void> {
    await this.updateJobStatus(cid, 'done');
  }

  async createJob(netcomid: string, requestDto: any): Promise<any> {
    // Check for existing pending job for this netcomid
    const existing = await this.getFirstPendingJobForNetcomid(netcomid);
    if (existing) {
      return { message: 'A job is already pending for this company', jobId: existing.cid, status: existing.status };
    }
    const cid = `${netcomid}-${Date.now()}`;
    const item = {
      cid,
      netcomid,
      status: 'pending',
      companyName: requestDto.companyName,
      requestedAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      // requestDto,
    };
    const params = {
      TableName: TABLE_NAME,
      Item: item,
    };
    await dynamoDb.put(params).promise();
    return item;
  }



  async getFirstPendingJobForNetcomid(netcomid: string): Promise<any> {
    // DynamoDB does not allow FilterExpression on primary key attributes in a GSI query.
    // Instead, query for 'pending' first, then 'in_progress' if not found.
    const pendingParams = {
      TableName: TABLE_NAME,
      IndexName: 'netcomid-status-index',
      KeyConditionExpression: '#netcomid = :netcomid and #status = :pending',
      ExpressionAttributeNames: { '#netcomid': 'netcomid', '#status': 'status' },
      ExpressionAttributeValues: { ':netcomid': netcomid, ':pending': 'pending' },
      Limit: 1,
    };
    const pendingResult = await dynamoDb.query(pendingParams).promise();
    if (pendingResult.Items && pendingResult.Items.length > 0) {
      return pendingResult.Items[0];
    }
    // If no pending job, check for in_progress
    const inProgressParams = {
      TableName: TABLE_NAME,
      IndexName: 'netcomid-status-index',
      KeyConditionExpression: '#netcomid = :netcomid and #status = :in_progress',
      ExpressionAttributeNames: { '#netcomid': 'netcomid', '#status': 'status' },
      ExpressionAttributeValues: { ':netcomid': netcomid, ':in_progress': 'in_progress' },
      Limit: 1,
    };
    const inProgressResult = await dynamoDb.query(inProgressParams).promise();
    return inProgressResult.Items && inProgressResult.Items.length > 0 ? inProgressResult.Items[0] : null;
  }

  async updateJobStatus(cid: string, status: string): Promise<void> {
    const params = {
      TableName: TABLE_NAME,
      Key: { cid },
      UpdateExpression: 'set #status = :status, lastUpdated = :now',
      ExpressionAttributeNames: { '#status': 'status' },
      ExpressionAttributeValues: { ':status': status, ':now': new Date().toISOString() },
    };
    await dynamoDb.update(params).promise();
  }
}
