import { Injectable } from '@nestjs/common';
import { connectBexio, connectLibrary, connectGate2b, connectNewGate2b } from '../db/prisma-clients';
import { generators } from 'openid-client'
const code_verifier = generators.codeVerifier();
const code_challenge = generators.codeChallenge(code_verifier);
import config from '../common/config/index';
import { edit } from '../common/utils/bexioClient';
import * as request from 'request';
import { Request, Response } from 'express';
const encryptionControl = require("../common/utils/jwt-decode");
const fetchEmailContent = require('../common/utils/fetchEmailData');
const sendEmail = require('../common/utils/email');
const jwt = require('jsonwebtoken');
const mailchimp = require("@mailchimp/mailchimp_marketing");
import { Prisma } from '@prisma/client';
import redisClient from '../common/utils/redisDB';
import commonErrors from '../common/utils/commonError'
import warningMessage from '../common/utils/warningMessage'
const path = require('path')
@Injectable()
export class DebtorsService {
  async getInvoice(req: Request, res: Response,): Promise<any> {
    console.log('getInvoice');
    let cookie = null;
    let data = req.body;
    let resData: any[] = [];
    let partyId = req.body.partyId;
    let netcomId = req.body.netcomId;

    try {
      let cookieData = req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME];
      if (!cookieData) {
        return res.status(500).send({
          status_code: 500,
          message: 'Missing_cookie',
          status: false,
        });
      }

      let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(cookieData)));
      let accessToken = cookie.access_Token;
      let isBexioUser = cookie.isBexioUser;

      let searchParams = this.buildSearchParams(data);
      let totalCount = await invoiceCountSearch(accessToken, searchParams, 0, 2000);

      let options = {
        'method': 'POST',
        'url': `${config.BEXIO_API}2.0/kb_invoice/search/?limit=${searchParams.showTo}&offset=${searchParams.showFrom}&order_by=${searchParams.sortColumn}_${searchParams.sortType}`,
        'headers': {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        },
        body: JSON.stringify(searchParams.searchJson)
      };

      let response = await this.makeRequest(options);
      if (response.statusCode != 200) {
        return res.status(401).json({
          status: true,
          status_code: response.statusCode,
          data: [],
          message: 'unauthorized',
        });
      }

      resData = JSON.parse(response.body);
      resData = await this.processInvoiceData(resData, accessToken, partyId, netcomId);

      let keys = Object.keys(req.body);
      let redisKey = req.body.partyId + "_" + req.url + "_";
      keys.forEach(element => {
        redisKey = req.body[element] ? redisKey + element + ':' + req.body[element] + '_' : redisKey;
      });

      await redisClient.set(redisKey, JSON.stringify({
        status: 200,
        data: resData,
        totalCount: totalCount
      }), {
        EX: 24 * 60 * 60 * 2 // Expiry time in seconds (2 days)
      });

      res.send({
        status: 200,
        data: resData,
        totalCount: totalCount
      });
    } catch (error) {
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + cookie;
      warningMessage(commonErrors, error);
      return res
        .status(200)
        .json({ status: 500, message: 'something_went_wrong' });
    }
  }

  buildSearchParams(data: any): any {
    let searchParams : any = {
      searchJson: [],
      showFrom: data.records_per_page * (data.page_number - 1),
      showTo: data.records_per_page,
      sortColumn: data?.sortColumn || 'updated_at',
      sortType: data?.sort || 'asc'
    };

    if (data.documentNo) {
      searchParams.searchJson.push({
        "field": "document_nr",
        "value": data.documentNo,
        "criteria": "like"
      });
    }

    if (data.invoiceTitle && data.invoiceTitle !== '') {
      searchParams.searchJson.push({
        "field": "title",
        "value": data.invoiceTitle,
        "criteria": "like"
      });
    }

    if (data.dateFrom) {
      searchParams.searchJson.push({
        "field": "is_valid_from",
        "value": new Date(data.dateFrom),
        "criteria": ">="
      });
    }

    if (data.dateTo) {
      searchParams.searchJson.push({
        "field": "is_valid_from",
        "value": new Date(data.dateTo),
        "criteria": "<="
      });
    }

    if (data['comapnyUser'] && data['comapnyUser'] !== '') {
      searchParams.searchJson.push({
        "field": "user_id",
        "value": data.comapnyUser,
        "criteria": "="
      });
    }

    if (data['invoiceStatus'] === 'Yes') {
      searchParams.searchJson.push({
        "field": "contact_id",
        "value": searchParams.resultArray == null ? "" : searchParams.resultArray,
        "criteria": "in"
      }, {
        "field": "id",
        "value": searchParams.getSendInvoiceList.rows[0]?.invoiceid ? searchParams.getSendInvoiceList.rows[0].invoiceid : "",
        "criteria": "in"
      });
    } else if (data['invoiceStatus'] === 'No') {
      searchParams.searchJson.push({
        "field": "contact_id",
        "value": searchParams.resultArray == null ? "" : searchParams.resultArray,
        "criteria": "in"
      }, {
        "field": "id",
        "value": searchParams.getSendInvoiceList.rows[0]?.invoiceid ? searchParams.getSendInvoiceList.rows[0].invoiceid : "",
        "criteria": "not_in"
      });
    }

    return searchParams;
  }

  makeRequest(options: any): Promise<any> {
    return new Promise((resolve, reject) => {
      request(options, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }

  processInvoiceData(resData: any[], accessToken: string, partyId: string, netcomId: string): Promise<any[]> {
    // Implement the logic to process the invoice data
    // This could include fetching additional data, mapping the response, etc.
    return Promise.resolve(resData);
  }

  async getOrderList(req: Request, res: Response,): Promise<any> {
    let cookie = null
    let data = req.body;
  
    try {
   let cookieData = req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME];

      if (!cookieData) {
        return res.status(500).send({
          status_code: 500,
          message: 'Missing_cookie',
          status: false,
        })
      }

      let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(cookieData)));
      let accessToken = cookie.access_Token;
      let isBexioUser = cookie.isBexioUser;

      let contacts;
      let showTo:number;
      let showFrom:number = parseInt(data.records_per_page)*(parseInt(data.page_number)-1) + 1;
      showTo = showFrom + parseInt(data.records_per_page) - 1;
      if(isBexioUser)
      {
       
        var options = {
          'method': 'GET',
          'url': `${config.BEXIO_API}2.0/contact`,
          'headers': {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+accessToken
          }
        };
        request(options, async function (error, response) {
          if (error){
            //console.log(error);
            commonErrors['errorTitle'] = req.originalUrl;
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+accessToken;
            warningMessage(commonErrors,error);
              return res.status(200).json({
                status: false,
                message: 'something_went_wrong',
             });
  
            } 
            if(response.statusCode != 200)
            {
              return res.status(200).json({
                data:[],
                totalCount:0
            });
            }
            contacts = JSON.parse(response.body);
            // //console.log('contacts',contacts);
            
            const getRegisteredId = await connectBexio.companyregistered.findMany({
              where: {
                rk_party: Number(data.partyId), // Equivalent to `WHERE rk_party = $1`
              },
              select: {
                cid: true, // Selects only `cid`
              },
            });
            
            const validDate = (date) => {
              const parsedDate = new Date(date);
              return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
            };
            
            const orderList = await connectBexio.documents_order_receive.findMany({
              where: {
                fk_companyregistered: getRegisteredId[0]?.cid,
                created_date: {
                  gte: validDate(data.dateFrom),
                  lte: validDate(data.dateTo),
                },
                rk_order: data.documentNo?.trim()
                  ? { contains: data.documentNo.trim(), mode: "insensitive" }
                  : undefined,
              },
              orderBy: {
                created_date: "desc",
              },
              skip: Number(showFrom) - 1,
              take: Number(showTo) - Number(showFrom) + 1,
            });
            
            // //console.log("orderList:", orderList);
            
            
           
            
          
            
            const orderListCount = await connectBexio.documents_order_receive.count({
              where: {
                fk_companyregistered: getRegisteredId[0]?.cid,
                created_date: {
                  gte: validDate(data.dateFrom),
                  lte: validDate(data.dateTo),
                },
                rk_order: data.documentNo?.trim()
                  ? { contains: data.documentNo.trim(), mode: "insensitive" }
                  : undefined,
                ...(data.orderStatus === "Yes" ? { rk_order: { not: null } } : {}),
                ...(data.orderStatus === "No" ? { rk_order: null } : {}),
              },
            });
            
            const totalOrders = Number(orderListCount); // Convert BigInt to Number
            
            //console.log("Total Orders:", totalOrders);

  
            for (let index = 0; index < orderList.length; index++) {
              const element = orderList[index];
              element['companyName'] = '';
              element['netcomId'] = '';
              const getBc = await connectNewGate2b.$queryRaw<any>`
              SELECT l.companyname, 
                     gc."netcomId", 
                     json_extract_path("ot_updator"::json, 'in_custom_id') as sender_custom_id, 
                     * 
              FROM g2b_business_connections bc 
              INNER JOIN g2b_connections gc ON gc.id = bc."FK_g2b_connections_IN"
              INNER JOIN ediparty e ON gc."netcomId" = e.netcomid
              INNER JOIN legalParty l ON l.fk_ediparty = e.cid
              WHERE bc.id = ${element.rk_businessconnection};
            `;
            
            //console.log(getBc);
             
              if(getBc.length != 0)
              {
                element['companyName'] = getBc[0].companyname;
                element['netcomId'] = getBc[0].netcomId;
                if(!element['rk_order'])
                {
                  let temp = contacts.filter(e => e.id == getBc[0].sender_custom_id);
                  element['contactName'] = temp.length != 0 ? temp[0].name_1:'';
                  element['contactId'] = temp.length != 0 ? getBc[0].sender_custom_id:'';
                  element['connectioStatus'] = 'active';
                }else{
                  element['contactId'] = '';
                  let temp = contacts.filter(e => e.id == getBc[0].sender_custom_id);
                  element['contactName'] = temp.length != 0 ? temp[0].name_1:'';
                  element['connectioStatus'] = 'done';
                }
               
              }else{
                element['contactId'] = '';
                element['contactName'] ='';
                element['connectioStatus'] ='';
  
              }
            } 
          res.send({
              status: 200,
              data:orderList,
               totalCount:totalOrders
          })
        // res.send(orderList.rows);
        });
  
      }else{
        return res.status(401).json({
          status: 'fail',
          message: 'unauthorized',
      });
      }
     
    } catch (error) {
   
 
      //console.log(error);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+cookie;
      warningMessage(commonErrors,error);
      return res
      .status(200)
      .json({ status: 500, message: 'something_went_wrong' });
        
    }
  }
  async getDeliveryNotesList(req: Request, res: Response,): Promise<any> {

    //console.log("getDeliveryNotesList");  
    let cookie = null;
    let data = req.body;
    let partyId = req.body.partyId;
    
    let netcomId;
    //console.log("req.body ",req.body);  
    try {
      let cookieData = req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME];

      if (!cookieData) {
       return res.status(500).send({
          status_code: 500,
          message: 'Missing_cookie',
          status: false,
        })
      }

      let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(cookieData)));
      let accessToken = cookie.access_Token;
      let isBexioUser = cookie.isBexioUser;
  
  let resultData: any[] = [],tempStatus = false;
      let totalCount;
      let showFrom = req.body.records_per_page * (req.body.page_number-1);
      let showTo = req.body.records_per_page;
  
      const deliveryNotesList = await connectBexio.documents_dispatchnotification_send.findMany({
        where: {
          fk_companyregistered: {
            in: (
              await connectBexio.companyregistered.findMany({
                where: { rk_party: Number(partyId) },
                select: { cid: true },
              })
            ).map((company) => company.cid),
          },
          deliverynotes_type: "EDI",
        },
        include: {
          companyregistered : true, // Includes related company details if needed
        },
      });
      

      const getNetcomId = await connectBexio.$queryRaw<any>(
        Prisma.sql`
        SELECT * FROM companyregistered WHERE rk_party = ${Number(partyId)}
      `
      );
      //console.log('getNetcomId',getNetcomId);

      

      const getInviteCompanyId = await connectLibrary.$queryRaw<{ cid: number[] }[]>(
        Prisma.sql`
        SELECT array_agg(pa.cid) AS cid 
        FROM party_account pa 
        WHERE pa.fk_party = ${Number(partyId)}
      `
      );

    
      //console.log('getInviteCompanyId.rows[0].cid',getInviteCompanyId[0].cid);
    
      


      const getConnectionStatusList = await connectBexio.$queryRaw<{ bcConnection: string[] }[]>(
        Prisma.sql`
        SELECT array_agg(rk_businessconnection) AS "bcConnection"
        FROM contact_bc cb
        WHERE ${getInviteCompanyId[0]?.cid?.length ? 
          Prisma.sql`cb.rk_party_account = ANY(ARRAY[${Prisma.join(getInviteCompanyId[0].cid)}])` : 
          Prisma.sql`FALSE`}
        AND cb.type = 'EDI'
        AND cb.rk_businessconnection IS NOT NULL
      `
      );

      const bcConnectionIds = getConnectionStatusList[0]?.bcConnection || [];
      let bcDetails;
      bcDetails = await getBcDetails(bcConnectionIds, getNetcomId[0].netcomid);

     
      let tempBc = [0];
    
      if(bcDetails){
        for (let index = 0; index < bcDetails['data'].length; index++) {
          const element = bcDetails['data'][index];
          //console.log("element :: ",element);      
          if(element['company_details']['doc_type']['data'] == 'DispatchNotification'){
            tempBc.push(element['bc_id'])
          }      
        }
      }
      
     

      const getConnectionBc = await connectBexio.$queryRaw<{array_agg: number[]}[]>(Prisma.sql`
      SELECT array_agg(rk_sendercontactid::int)
      FROM contact_bc cb
      WHERE cb.rk_party_account = ANY(ARRAY[${Prisma.join(getInviteCompanyId[0]?.cid || [])}])
      AND cb.type = 'EDI'
      ${tempBc.length ? Prisma.sql`AND cb.rk_businessconnection = ANY(ARRAY[${Prisma.join(tempBc)}])` : Prisma.empty}
      AND cb.rk_businessconnection IS NOT NULL
    `);
    //console.log('getConnectionBc',getConnectionBc);
    let resultArray = getConnectionBc[0]?.array_agg;
    //console.log('resultArray',resultArray);

      if(isBexioUser){
        totalCount = await deliveryNotesListCountSearch(accessToken,0,2000);
        var options = {
          'method': 'GET',
          // 'url': `${config.BEXIO_API}2.0/kb_delivery`,
          'url': `${config.BEXIO_API}2.0/kb_delivery/?limit=${showTo}&offset=${showFrom}&order_by=updated_at_desc`,
          'headers': {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+accessToken
          }
  
        };    
        request(options, async function (error, response) {
          if (error) {
            commonErrors['errorTitle'] = req.originalUrl;
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+showTo+' '+showFrom;
            warningMessage(commonErrors,error);
            return res.status(500).json({
              status: false,
              message: 'something_went_wrong',
          });
          }
          let resData = JSON.parse(response.body);       
          if(response.statusCode != 200)
            return res.status(401).json({
            status: false,
            message: 'unauthorized',
            });
          let status = JSON.parse(config.BEXIO_ITEM_STATUS);
          for (let deliveryNotes in resData) {
            tempStatus = false;
            resultArray?resData[deliveryNotes]['allowSend'] = resultArray.includes((resData[deliveryNotes].contact_id).toString()) ? true:false:false;
            resData[deliveryNotes]['statusLabel'] = status[resData[deliveryNotes].kb_item_status_id];
            resData[deliveryNotes]['timestamp'] = '';
            resData[deliveryNotes]['companyName'] = resData[deliveryNotes]['contact_address'].split("\n")[0];
            resData[deliveryNotes]['rk_globaltransaction'] = '';
            resData[deliveryNotes]['status'] = '';
            resData[deliveryNotes]['statusLabelDeliveryNotes'] = '';        
            for(let qryDeliveryNotes in deliveryNotesList){
                if(deliveryNotesList[qryDeliveryNotes]['rk_deliverynotes'] == resData[deliveryNotes]['id']){
                  resData[deliveryNotes]['rk_globaltransaction'] = deliveryNotesList[qryDeliveryNotes]['rk_globaltransaction'];
                  resData[deliveryNotes]['status'] = deliveryNotesList[qryDeliveryNotes]['status'];
                  resData[deliveryNotes]['statusLabelDeliveryNotes'] = JSON.parse(config.INVOICE_STATUS||'')[deliveryNotesList[qryDeliveryNotes]['status']||''];
                  resData[deliveryNotes]['timestamp'] = deliveryNotesList[qryDeliveryNotes]['timestamp'];
                  resData[deliveryNotes]['type'] = deliveryNotesList[qryDeliveryNotes]['type'];
  
                  if(deliveryNotesList[qryDeliveryNotes]['status'] == 2){
                    resData[deliveryNotes]['allowSend'] = false;
                  }
                  if(!tempStatus && deliveryNotesList[qryDeliveryNotes]['type'] == 'EBILL'){
                    tempStatus = true;
                  }
                  break;
                }
              }
              if(!tempStatus){            
                resData[deliveryNotes]['isEbill'] = false;
              }else{
                resData[deliveryNotes]['isEbill'] = true;
                resData[deliveryNotes]['allowSend'] = false;
              }
              resultData.push(resData[deliveryNotes]);
          }
          let keys = Object.keys(req.body)
          // let redisKey = req.url+"_"+req.body.partyId+"_";
          let redisKey = req.body.partyId+"_"+req.url+"_";
          //console.log('redisKey',redisKey);
          keys.forEach(element => {
              redisKey = req.body[element]? redisKey +element+':'+ req.body[element] + '_' : redisKey
          });
         
          await redisClient.set(redisKey, JSON.stringify( {status: 200,
            data:resData,
            totalCount:totalCount}), {
            EX: 24 * 60 * 60 * 2 // 2 days in seconds
        });
            
          res.send({
            status: 200,
            data:resultData,
            totalCount:totalCount
          })
        });
      }
      else{
          return res.status(401).json({
            status: 'fail',
            message: 'unauthorized',
        });
      }
    } catch (error) {
    
     
      //console.log(error);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+cookie;
      warningMessage(commonErrors,error);
      return res
      .status(500)
      .json({ status: 500, message: 'something_went_wrong' });
        
    }
  }
  async getTagName (req: Request, res: Response,): Promise<any> {
   
    //console.log("req.body ",req.body);  
    try {
      let data = req.body
      let responseData = null
    
   
    let reason={
      "config_id": 1,
      "module": data.module,
      "file_list":JSON.parse(data.file_list)
		  }
  //  let invoice_issuerid ='';
  //  let emailAddress='';
  //  let billRecipientId ='';
  //  let sender_name='';
  //  let receiver_name='';
  //  let doc_type='';
  //  let in_cust_id='';
  //  let out_cust_id='';
  //  let doc_format='';
  //  let mode='';
  //  let doc_module='';
  //  let recipient_email='';
  //  let recipient_name='';
  //  let receiver_street='';
  //  let receiver_city='';
  //  let receiver_zip='';
  var options = {
    'method': 'POST',
    'url': `${config.OCTOPUS_URL}/bexio_file_check/`,
    'headers': {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reason)
  
  };
      //console.log('options',options);
      
      return new Promise(function (resolve, reject) {
        request(options, async function (error, response, body) {
        
          if(error){
            commonErrors['errorTitle'] = 'getPythonData';
            commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString();
            warningMessage(commonErrors, error);
            return resolve(error)
          }
          else{
            try{
              //console.log('response.bodyresponse.body',response.body);
              
            responseData = JSON.parse(response.body)
            res.send({
              status: 200,
              data:responseData,
              
            })
            }
            catch{
              return resolve(responseData)
            }
          }
        })
        
        });
       
     }
     catch (error) {
      commonErrors['errorTitle'] = 'getPythonData';
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString();
      warningMessage(commonErrors, error);
      
      }
  
  }
}
const getContactById = async (accessToken,contact_idList) => {

  return new Promise(async(resolve, reject) => {
    let searchJson: any[] = [];
    searchJson.push({
      "field": "id",
      "value": contact_idList,
      "criteria": "in"
    });
    let optionsContact = {
      'method': 'POST',
      'url': `${config.BEXIO_API}2.0/contact/search`,
      // 'url': `${config.BEXIO_API}${data.api}`,
      // url = `${url}`;
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer '+accessToken
      },
      body: JSON.stringify(searchJson)
    };
   
    request(optionsContact, async function (error, response) {
      if (error) {
        commonErrors['errorTitle'] = 'getContactById';
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'-bexio param,'+accessToken;
        warningMessage(commonErrors,error);
        resolve(error);
      }
   
      
      if(response.statusCode == 200){
        resolve(JSON.parse(response.body));      
      }else{
        resolve(false)
      }
    }); 
  });
          
 
}
const getAllCurrency = async (access_token) => {

  return new Promise(async(resolve, reject) => {
        var options = {
          'method': 'GET',
          'url': `https://api.bexio.com/3.0/currencies`,
          'headers': {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+access_token
          }
        };
        request(options, function (error, response) {
          if (error) {  
            commonErrors['errorTitle'] = 'getAllCurrency';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param';
            warningMessage(commonErrors,error);
            resolve(false)
          }
          
          if(response?.statusCode==200)
            resolve(JSON.parse(response.body));
          else
            resolve(false)
        });
      });
}
const getRecipientList = async (contact_idList: number[]) => {
  try {
    // Ensure unique IDs and explicitly cast to number[]
    const uniqueIds: number[] = [...new Set(contact_idList)];
console.log('uniqueIds',uniqueIds);
console.log('uniqueIds',uniqueIds.length);
    if (uniqueIds.length === 0) return []; // Return empty array if no valid IDs

    const contacts = await connectBexio.contact_bc.findMany({
      where: {
        rk_receivercontactid: { in: uniqueIds },
      },
      select: {
        recipient_id: true, 
        rk_receivercontactid:true
        // Remove `docType` for testing
      },
    });
    

    return contacts;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};


const invoiceCountSearch = async (token,search,offset,limit?) => {

  return new Promise(async(resolve, reject) => {
    var options = {
      'method': 'POST',
      'url': `${config.BEXIO_API}2.0/kb_invoice/search?limit=${limit}&offset=${offset}&order_by=updated_at_desc`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }, body: JSON.stringify(search)
    };
    request(options, function (error, response) {
      if (error) {  
        commonErrors['errorTitle'] = 'contactListCount';
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+token;
        warningMessage(commonErrors,error);
        resolve(false)
      }
      if(response?.statusCode == 200){
        if(JSON.parse(response.body).length == limit){
         let temp = this.invoiceCountSearch(token,offset+2000,2000)
        //  ////console.log(('11111111111111111111111111111');
         
        }else{
          offset = offset + JSON.parse(response.body).length;
          // ////console.log(('lengthhh',offset);
          resolve(offset)
        }
        // ////console.log((JSON.parse(response.body).length);
        
        // resolve(JSON.parse(response.body).length)

      }
      else
      resolve(false)
    });
  });
}
const invoiceListCountSearch = async (token,offset,limit?) => {

  return new Promise(async(resolve, reject) => {
    var options = {
      'method': 'GET',
      // 'url': 'https://api.bexio.com/2.0/contact/search',
      'url': `${config.BEXIO_API}2.0/kb_invoice/?limit=${limit}&offset=${offset}&order_by=updated_at_desc`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    };
    // ////console.log(({
    //   offset: offset,
    //   limit: limit
    // });
    
      request(options, function (error, response) {
        if (error) {  
          commonErrors['errorTitle'] = 'invoiceListCount';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+token;
          warningMessage(commonErrors,error);
          resolve(false);
        }
        if( response.statusCode == 401 ){
          resolve(false);
        }
        if(response.statusCode == 200){
          if(JSON.parse(response.body).length == limit){
           let temp = this.invoiceListCountSearch(token,offset+2000,2000);
           resolve(temp);
          }else{
            offset = offset + JSON.parse(response.body).length;
            resolve(offset);
          }  
        }
        else
        resolve(false);
      });
  });
}
const getBcDetails= async (bc_id,netcomId ) => {
   
      try{
      
        return new Promise(async(resolve, reject) => {
          if(bc_id){
            let formData = {
              bc : bc_id.toString(),
              netcom_id : netcomId
            } 
            let  options = {
              'method': 'POST',
              'url': config.PYTHON_API+'get-contact-bc',
              formData: formData
            };
    
            request(options, async function (error, response, body) {
              if (error) {  
                commonErrors['errorTitle'] = 'getBcDetails';
                warningMessage(commonErrors,error);
                resolve(false)
              }else{
                resolve(JSON.parse(response.body));
              }
            });
          }else{
            resolve(false)
          }
           
          });
      } catch (error) {
          commonErrors['errorTitle'] = 'getBcDetails';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+'access_token';
          warningMessage(commonErrors,error);
        
        }
}
const deliveryNotesListCountSearch = async(token,offset,limit?)=>{
  return new Promise(async(resolve, reject) => {
    var options = {
      'method': 'GET',
      // 'url': 'https://api.bexio.com/2.0/contact/search',
      'url': `${config.BEXIO_API}2.0/kb_delivery/?limit=${limit}&offset=${offset}&order_by=updated_at_desc`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    };
    //console.log({
    //   offset: offset,
    //   limit: limit
    // });
    
      request(options, function (error, response) {
        if (error) {  
          commonErrors['errorTitle'] = 'deliveryNotesList';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+token;
          warningMessage(commonErrors,error);
          resolve(false);
        }
        if(response.statusCode == 200){
          if(JSON.parse(response.body).length == limit){
           let temp = invoiceListCountSearch(token,offset+2000,2000);
           resolve(temp);
          }else{
            offset = offset + JSON.parse(response.body).length;
            resolve(offset);            
          }  
        }
        else
        resolve(false);
      });
  });
}

