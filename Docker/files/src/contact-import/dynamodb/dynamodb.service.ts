// Service for DynamoDB job management
import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import config from '../../common/config';

const dynamoDb = new AWS.DynamoDB.DocumentClient({
accessKeyId: config.DYNAMODB_CLIENT_ID,
  secretAccessKey: config.DYNAMODB_SECRET_KEY,
  region: "eu-central-2",
});

const TABLE_NAME = config.DYNAMODB_TABLE_NAME;

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

  async createJob(netcomid: string, requestDto: any): Promise<any> {
    // Clear all existing records for this netcomid (regardless of status)
    const itemsToDelete: { cid: string }[] = [];
    let ExclusiveStartKey: AWS.DynamoDB.DocumentClient.Key | undefined = undefined;

    do {
      const queryParams: AWS.DynamoDB.DocumentClient.QueryInput = {
        TableName: TABLE_NAME,
        IndexName: 'netcomid-status-index',
        KeyConditionExpression: '#netcomid = :netcomid',
        ExpressionAttributeNames: { '#netcomid': 'netcomid' },
        ExpressionAttributeValues: { ':netcomid': netcomid },
        ExclusiveStartKey,
      };
      const res = await dynamoDb.query(queryParams).promise();
      if (res.Items && res.Items.length) {
        for (const it of res.Items) {
          if (it.cid) itemsToDelete.push({ cid: it.cid });
        }
      }
      ExclusiveStartKey = res.LastEvaluatedKey as AWS.DynamoDB.DocumentClient.Key | undefined;
    } while (ExclusiveStartKey);

    // Batch delete (max 25 items per batch)
    while (itemsToDelete.length > 0) {
      const batch = itemsToDelete.splice(0, 25);
      const deleteRequests = batch.map(d => ({
        DeleteRequest: { Key: { cid: d.cid } },
      }));
      const batchParams: AWS.DynamoDB.DocumentClient.BatchWriteItemInput = {
        RequestItems: {
          [TABLE_NAME]: deleteRequests,
        },
      };
      await dynamoDb.batchWrite(batchParams).promise();
    }

    // Create new pending job
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
    const putParams = {
      TableName: TABLE_NAME,
      Item: item,
    };
    await dynamoDb.put(putParams).promise();
    return item;
  }



  async getFirstPendingJobForNetcomid(netcomid: string): Promise<any> {
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
