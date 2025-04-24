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
const { Worker } = require('worker_threads');
const fs = require('fs')
import { resolve } from 'path';
var xml2js = require('xml2js');
import { constGetContactId, deliveryNotesListCountSearch, formatDate, getAllCurrency, getBcDetails, getContactById, getContactDetails, getRecipientList, getSendInvoiceList, getTagName, getTaxListActive, invoiceCountSearch, invoiceListCountSearch, moveFile, setDeliveryNotesCidSendStatus, setInvoiceSendStatus, setOrderId } from 'src/common/utils/helperfn';
import { PushWorkerHost } from '../common/utils/push.worker.host';
import { SendDeliveryNotesHost } from '../common/utils/sendDeliveryNotes.host';
import connectMssql from '../db/mssql-client'

@Injectable()
export class DebtorsService {
  constructor(private readonly pushWorkerHost: PushWorkerHost, private readonly sendDeliveryNotesHost: SendDeliveryNotesHost) {}

 

  async getInvoice(req: Request, res: Response): Promise<any> {
    console.log('getInvoice');
    let data = req.body;
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
      console.log('cookie.access_Token', cookie.access_Token);

      let accessToken = cookie.access_Token;
      let isBexioUser = cookie.isBexioUser;

      if (!isBexioUser) {
        return res.status(401).json({
          status: 'fail',
          message: 'unauthorized',
        });
      }

      let resultData: any[] = [], tempStatus = false;
      let totalCount;
      let sortColumn = data.sortColumn || 'updated_at';
      let sortType = data.sort || 'asc';

      let showFrom = req.body.records_per_page * (req.body.page_number - 1);
      let showTo = req.body.records_per_page ;
      console.log('showFrom', showFrom);
      console.log('showTo', showTo);
      let resultArray: any[] = [];
      let contactArray: any[] = [];

      const invoiceList = await connectBexio.documents_invoice_send.findMany({
        where: {
          companyregistered: {
            rk_party: Number(req.body?.partyId)
          }
        },
        include: {
          companyregistered: true
        }
      });

      const ediInvoices = invoiceList.filter(invoice => invoice.invoice_type === 'EDI');
      const ebillInvoices = invoiceList.filter(invoice => invoice.invoice_type === 'EBILL');
      if (ediInvoices.length > 0) {
        const getNetcomId = await connectBexio.$queryRaw<any>(
          Prisma.sql`
                    SELECT * FROM companyregistered WHERE rk_party = ${Number(partyId)}
                  `
        );

        const getInviteCompanyId = await connectLibrary.$queryRaw<{ cid: number[] }[]>(
          Prisma.sql`
                    SELECT array_agg(pa.cid) AS cid 
                    FROM party_account pa 
                    WHERE pa.fk_party = ${Number(partyId)}
                  `
        );

        const getConnectionStatusList = await connectBexio.$queryRaw<{ bcConnection: string[] }[]>(
          Prisma.sql`
                  SELECT array_agg(rk_businessconnection) AS "bcConnection"
                  FROM contact_bc cb
                  WHERE cb.rk_party_account = ANY(${Prisma.sql`ARRAY[${Prisma.join(getInviteCompanyId[0]?.cid || [])}]`})
                  AND cb.type = 'EDI'
                  AND cb.rk_businessconnection IS NOT NULL
                `
        );

        const bcConnectionIds = getConnectionStatusList[0]?.bcConnection || [];
        let bcDetails;
        bcDetails = await getBcDetails(bcConnectionIds, getNetcomId[0].netcomid);

        let tempBc = [0];
        if (bcDetails?.data?.length) {
          for (const element of bcDetails.data) {
            if (element?.company_details?.doc_type?.data === 'Invoice') {
              tempBc.push(element.bc_id);
            }
          }
        }
        const getConnectionBc = await connectBexio.$queryRaw<{ array_agg: number[] }[]>(Prisma.sql`
                    SELECT array_agg(rk_sendercontactid::int)
                    FROM contact_bc cb
                    WHERE cb.rk_party_account = ANY(ARRAY[${Prisma.join(getInviteCompanyId[0]?.cid || [])}])
                    AND cb.type = 'EDI'
                    ${tempBc.length ? Prisma.sql`AND cb.rk_businessconnection = ANY(ARRAY[${Prisma.join(tempBc)}])` : Prisma.empty}
                    AND cb.rk_businessconnection IS NOT NULL
                  `);
        resultArray = getConnectionBc[0]?.array_agg;
        console.log('resultArray',resultArray);
        
      }
      if (ebillInvoices.length > 0) {
        // const getContactBcQryReslt = await connectBexio.$queryRaw<any>(
        //   Prisma.sql`
        //           SELECT array_agg(rk_contact) 
        //           FROM contact_bc c 
        //           INNER JOIN companyregistered cr 
        //           ON cr.cid = c.fk_companyregistered
        //           WHERE c.type = 'EBILL' 
        //           AND cr.netcomid = ${netcomId}
        //         `
        // );
        // console.log('getContactBcQryReslt', getContactBcQryReslt);
        
        // contactArray = getContactBcQryReslt[0]?.array_agg || [];
        // if (req.body.contactId && req.body.contactId !== '') {
        //   contactArray = [];
        //   contactArray = [req.body.contactId];
        // }
      }

      let options;
      let searchJson: any[] = [];
      let getSendInvoiceListResult;

      if (data['invoiceStatus']) {
        getSendInvoiceListResult = await getSendInvoiceList(Number(partyId));
      }

      if (data.documentNo) {
        searchJson.push({
          "field": "document_nr",
          "value": data.documentNo,
          "criteria": "like"
        });
      }
      if (data.invoiceTitle != '' && data.invoiceTitle) {
        searchJson.push({
          "field": "title",
          "value": data.invoiceTitle,
          "criteria": "like"
        });
      }
      if (data.dateFrom) {
        searchJson.push({
          "field": "is_valid_from",
          "value": new Date(data.dateFrom),
          "criteria": ">="
        });
      }
      if (data.dateTo) {
        searchJson.push({
          "field": "is_valid_from",
          "value": new Date(data.dateTo),
          "criteria": "<="
        });
      }
      if (data['comapnyUser'] != '' && data['comapnyUser']) {
        searchJson.push({
          "field": "user_id",
          "value": data.comapnyUser,
          "criteria": "="
        });
      }
      if (data['invoiceStatus'] == 'Yes') {
        searchJson.push({
          "field": "contact_id",
          "value": resultArray == null ? "" : resultArray,
          "criteria": "in"
        },
        {
          "field": "id",
          "value": getSendInvoiceListResult[0]?.invoiceid ? getSendInvoiceListResult[0].invoiceid : "",
          "criteria": "in"
        });
      }
      if (data['invoiceStatus'] == 'No') {
        searchJson.push({
          "field": "contact_id",
          "value": resultArray == null ? "" : resultArray,
          "criteria": "in"
        },
        {
          "field": "id",
          "value": getSendInvoiceListResult[0]?.invoiceid ? getSendInvoiceListResult[0].invoiceid : "",
          "criteria": "not_in"
        });
      }

      let resData: any[] = [];
      console.log('searchJson:::',searchJson);
      
      if (searchJson.length > 0) {
          totalCount = await invoiceCountSearch(accessToken, searchJson, 0, 2000);
          options = {
            'method': 'POST',
            'url': `${config.BEXIO_API}2.0/kb_invoice/search/?limit=${showTo}&offset=${showFrom}&order_by=${sortColumn}_${sortType}`,
            'headers': {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + accessToken
            },
            body: JSON.stringify(searchJson)
          };

        const response = await new Promise<any>((resolve, reject) => {
          request(options, (error, response) => {
            if (error) reject(error);
            else resolve(response);
          });
        });

        if (response.statusCode != 200) {
              return res.status(401).json({
                status: true,
                status_code: response.statusCode,
                data: [],
                message: 'unauthorized',
              });
            }

        resData = JSON.parse(response.body);
      } else {
          // searchJson.push({
          //   "field": "contact_id",
          //   "value": contactArray,
          //   "criteria": "in"
          // });

          let totalCountInvoiceList = await invoiceListCountSearch(accessToken, 0, 2000) as number;
          let totalCountInvoiceCount = await invoiceCountSearch(accessToken, searchJson, 0, 2000) as number;
          totalCount = totalCountInvoiceList + totalCountInvoiceCount;
          console.log('searchJson:',searchJson);
          
          // const postOptions = {
          //   'method': 'POST',
          //   'url': `${config.BEXIO_API}2.0/kb_invoice/search/?limit=${showTo}&offset=${showFrom}&order_by=${sortColumn}_${sortType}`,
          //   'headers': {
          //     'Accept': 'application/json',
          //     'Authorization': 'Bearer ' + accessToken
          //   },
          //   body: JSON.stringify(searchJson)
          // };

          const getOptions = {
            'method': 'GET',
            'url': `${config.BEXIO_API}2.0/kb_invoice/?limit=${showTo}&offset=${showFrom}&order_by=${sortColumn}_${sortType}`,
            'headers': {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + accessToken
            }
          };

          const parseResponse = (response: any) => {
            if (response && response.body) {
              try {
                let parsedData = JSON.parse(response.body);
                if (Array.isArray(parsedData)) {
                  return parsedData;
                } else if (parsedData && typeof parsedData === "object" && parsedData.message) {
                return [];
                }
              } catch (error) {
                console.error("Error parsing response:", error);
              }
            }
            return [];
          };

          // const [postResponse, getResponse] = await Promise.all([
          //   new Promise<any>((resolve, reject) => {
          //     request(postOptions, (error, response) => {
          //       if (error) reject(error);
          //       else resolve(response);
          //     });
          //   }),
          //   new Promise<any>((resolve, reject) => {
          //     request(getOptions, (error, response) => {
          //       if (error) reject(error);
          //       else resolve(response);
          //     });
          //   })
          // ]).catch(error => {
          //   console.error("Request error:", error);
          // return [null, null];
          // });

          const getResponse = await new Promise<any>((resolve, reject) => {
            request(getOptions, (error, response) => {
              if (error) reject(error);
              else resolve(response);
            });
          }).catch(error => {
            console.error("Request error:", error);
          return null;
          });
          console.log('searchJson',searchJson);
          // console.log('postResponse',postResponse.body.length);
          console.log('getResponse',getResponse.statusCode);
          console.log('getResponse message',getResponse.message);
          // let postRes = parseResponse(postResponse);
          let getRes = parseResponse(getResponse);
          // console.log('postResponse',postRes.data.length);
          // console.log('getResponse',getRes);
          // if (!postRes.status || !getRes.status) {
          //   return res.status(401).json({
          //     status: true,
          //     data: [],
          //     message: "unauthorized",
          //   });
          // }
         
          if (getResponse.statusCode == 401) {
            return res.status(401).json({
              status: true,
              data: [],
              message: "unauthorized",
            });
          }
          else if (getResponse.statusCode ==200) {
        
          resData = [...getRes];
          }

          else  {
            return res.status(getResponse.statusCode).json({
              status: true,
              data: getRes,
              message: getResponse.statusMessage,
            });

          }
        
          
          // resData = [...postRes.data, ...getRes.data];
        }

      if (resData && resData.length > 0) {
          let status = JSON.parse(config.BEXIO_INVOICE_STATUS || '');
          let contact_idList: any = [];
        
          for (let invoice in resData) {
          resData[invoice]['allowSend'] = resData[invoice]['isEbill'] ? true : resultArray?.map(Number).includes(Number(resData[invoice].contact_id)) ? true : true;
            contact_idList.push((resData[invoice].contact_id));
            resData[invoice]['statusLabel'] = status[resData[invoice].kb_item_status_id];
            resData[invoice]['timestamp'] = '';
            resData[invoice]['rk_globaltransaction'] = '';
            resData[invoice]['status'] = '';
            resData[invoice]['statusLabelInvoice'] = '';
            resData[invoice]['invoice_type'] = ''; 
            
            for (let qryInvoice in invoiceList) {
              if (invoiceList[qryInvoice]['rk_invoice'] == resData[invoice]['id']) {
                resData[invoice]['rk_globaltransaction'] = invoiceList[qryInvoice]['rk_globaltransaction'];
                resData[invoice]['status'] = invoiceList[qryInvoice]['status'];
                resData[invoice]['statusLabelInvoice'] = JSON.parse(config.INVOICE_STATUS || '')[invoiceList[qryInvoice]['status'] || ''];
                resData[invoice]['timestamp'] = invoiceList[qryInvoice]['timestamp'];
                resData[invoice]['type'] = invoiceList[qryInvoice]['type'];
                resData[invoice]['response'] = invoiceList[qryInvoice]['response'];
                resData[invoice]['invoice_type'] = invoiceList[qryInvoice]['invoice_type']; // Add invoice_type
                
                if (invoiceList[qryInvoice]?.status === 2) {
                  resData[invoice]['allowSend'] = false;
                }
                break;
              }
          }
            resultData.push(resData[invoice]);
          }

        let contactList :any = await getContactById(accessToken, contact_idList);

          if (!contactList) {
          return res.status(500).send({
              status: 500,
              data: []
            });
          }

        let contactNameList = {};
        let contactEmailList = {};
          contactList.forEach(element => {
            let name_1 = element.name_1 ? element.name_1 : '';
            let name_2 = element.name_2 && element.name_2.length ? element.name_2 : '';
            contactNameList[element.id] = name_1 + (name_2 ? ' ' + name_2 : '');
            contactEmailList[element.id] = element.mail ? element.mail : '';
          });

          let currencyList = {};
          let currency: any = [];
          currency = await getAllCurrency(accessToken);
          currency.forEach(element => {
            currencyList[element.id] = element.name;
          });

          let recipientList = {};
          let recipientIds: any = [];
          recipientIds = await getRecipientList(contact_idList);
          recipientIds.forEach(element => {
            recipientList[element.rk_receivercontactid] = element.recipient_id;
          });

          resultData.forEach((second) => {
            second.companyName = contactNameList[second["contact_id"]];
            second.currency = currencyList[second['currency_id']];
            second.email = contactEmailList[second["contact_id"]];
            second.recipient_id = recipientList[second["contact_id"]] ? recipientList[second["contact_id"]] : '';
          });

          let redisKey = req.body.partyId + "_" + req.url + "_";
        let keys = Object.keys(req.body);
          keys.forEach(element => {
          redisKey = req.body[element] ? redisKey + element + ':' + req.body[element] + '_' : redisKey;
          });
        
          await redisClient.set(redisKey, JSON.stringify({
            status: 200,
            data: resData,
            totalCount: totalCount
          }), {
          EX: 24 * 60 * 60 * 2
          });
        
        return res.send({
            status: 200,
            data: resultData,
            totalCount: totalCount
        });
      } else {
        return res.status(401).json({
          status: 'fail',
          message: 'unauthorized',
        });
      }
    } catch (error) {
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString();
      warningMessage(commonErrors, error);

      return res.status(200).json({ 
        status: 500, 
        message: 'something_went_wrong' 
      });
    }
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
      console.log('accessToken',accessToken);
      
      let isBexioUser = cookie.isBexioUser;
      let contacts;
      let showTo:number;
      let showFrom:number = parseInt(data.records_per_page)*(parseInt(data.page_number)-1) + 1;
      showTo = showFrom + parseInt(data.records_per_page) - 1;
      //console.log('showFrom',showFrom);
      //console.log('showTo',showTo);
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
            resultArray?resData[deliveryNotes]['allowSend'] = resultArray.includes((resData[deliveryNotes].contact_id)) ? true:false:false;
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
  async sendInvoice(req: Request, res: Response): Promise<any> {
    let data = req.body;
    const bexioClient = await edit();
    let combinedResponse :any = {};

    try {
        if (data.otherInvoice) {
            let getTag: any = await getTagName(data.otherInvoice);
            console.log('getTag', getTag);
            combinedResponse.otherInvoiceResults = getTag?.data || [];

            for (const item of getTag?.data || []) {
                if (item.tag === "ebill") {
                    try {
                        const pool = await connectMssql;
                        const getRecipient = await connectBexio.companyregistered.findMany({
                            where: {
                                netcomid: data.netcomId,
                            },
                            select: {
                                refresh_token: true,
                            },
                        });
                        let tokenSet = await bexioClient.refresh(getRecipient[0]?.refresh_token || '');

                        let tempJson = JSON.parse(data.otherInvoice);
                        console.log('getRecipient tempJson',tempJson)
                        
                        for (let index = 0; index < tempJson.length; index++) {
                            const element = tempJson[index];
                            console.log('getRecipient element',element)
                            const getRecipient = await connectBexio.contact_bc.findFirst({
                                where: {
                                    rk_contact: element.contactId,
                                    companyregistered: {
                                        netcomid: data.netcomId,
                                    },
                                },
                                select: {
                                    recipient_id: true,
                                    companyregistered: {
                                        select: {
                                            refresh_token: true,
                                        },
                                    },
                                },
                            });
                            console.log('getRecipient',element, getRecipient);
                            
                            element['recipientid'] = getRecipient?.recipient_id;
                            element['accessToken'] = tokenSet['access_token'];
                        }

                        const getBiller = `SELECT billerid  FROM biller  
                        WHERE netcomid = '${data.netcomId}'
                        AND status = 'ACTIVE'`;
                        const getBillerData = await pool.query(getBiller);

                        if (getBillerData.recordset.length > 0) {
                            this.pushWorkerHost.run(tempJson, {}, {}, getBillerData?.recordset[0]?.billerid);
                        }

                        let bexioTokenCookie = {
                            access_Token: tokenSet.access_token,
                            refresh_Token: tokenSet.refresh_token,
                            isBexioUser: true
                        };
                        const rk_csn = jwt.decode(tokenSet.access_token)['company_id'];
                        await connectBexio.companyregistered.updateMany({
                            where: {
                                rk_csn: rk_csn,
                            },
                            data: {
                                refresh_token: tokenSet.refresh_token,
                            },
                        });
                        res.cookie(config.TOKEN_COOKIE_BEXIO_NAME, encryptionControl.encrypt(JSON.stringify(bexioTokenCookie)), {
                            domain: config.SESSION_DOMAIN,
                            maxAge: config.SESSION_EXPIRY,
                            httpOnly: true,
                            signed: true,
                            secure: true
                        });
                    } catch (error) {
                        console.log('error', error);

                        let responseValue = data.otherInvoice.invoiceId;
                        commonErrors['errorTitle'] = req.originalUrl;
                        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + responseValue;
                        warningMessage(commonErrors, error);
                    }
                }
            }
        }

        if (data.invoices) {
            console.log("Processing invoices:", data.invoices);

            try {
                let bodyParams = {
                    partyId: data.partyId,
                    accountId: data.accountId,
                };
                async function processInvoices(obj, bodyData): Promise<any[]> {
                  const results:any = [];
                  for (let index = 0; index < obj.length; index++) {
                    console.log("Processing invoice:", obj[index]);
                    
                      const element = obj[index];
                      const result = await setInvoiceSendStatus(bodyData.partyId, element.invoiceId, '', '1', '');
                      results.push(result);
                  }
                  return results;
              }
              combinedResponse.ediResults = await processInvoices(JSON.parse(data.invoices), bodyParams);
                // Use the PushWorkerHost to run the worker task
                 this.pushWorkerHost.run(data.invoices, bodyParams, {
                    cookies: req.cookies, // Include cookies
                    signedCookies: req.signedCookies, // Include signed cookies
                    url: req.url,
                });
            } catch (error) {
                console.log("error in sendBulkInvoices :: ", error);
            }
        }

        return res.status(200).json({
            status_code: 200,
            message: 'common_success',
            status: true,
            data: combinedResponse,
        });
    } catch (error) {

        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param';
        warningMessage(commonErrors, error);
        return res
            .status(500)
            .json({ status: 500, message: 'something_went_wrong' });

    }
}
  async sendOrder(req: Request, res: Response,): Promise<any> {
    let formData ;
    console.log("xmlToJsonOrder ");
    const reqData = req.body;
    console.log(reqData);
    try {
      let transaction_id = req.body.globaltransaction,taxList,orderTitle = '';
      let bc_id = req.body.bcId;
      let file_path = req.body.file_path;
      let id = req.body.id;
      let netcomId = req.body.netcomId;
      let cookie, access_token;
      // let bexioPool = await postgresBexio;
      cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
      access_token = cookie.access_Token;
      console.log('access_token',access_token);
      const getCompanyIdQryResult = await connectBexio.companyregistered.findMany({
        where: {
          netcomid: netcomId,
        },
        select: {
          tax_type: true,
          settings: true,
        },
      });
     

      taxList = await getTaxListActive(access_token);
      console.log(taxList);
      console.log("typeof ",typeof(taxList));
    
      formData = {
        transaction_id:transaction_id,
        virtual_filename:JSON.parse(file_path).output,
        filetype:'output',
        data_format:'base64'
      }
  var options = {
    'method': 'POST',
        'url': config.PYTHON_API+'file-download',
      
        formData: formData
      };
      console.log('formData',formData);
      request(options, async function (error, response) {
        if (error) {  
          commonErrors['errorTitle'] = 'xmlToJson';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+formData;
          warningMessage(commonErrors,error);
          res.send({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
          });
          return
        }
      let customerIds = await constGetContactId(bc_id);
   
      let title;
     console.log('response',response.body);
     
      let data = JSON.parse(response.body).data;
      let xml = Buffer.from(data, 'base64').toString();
              let contact,contryName;
           
      xml2js.parseString(xml, async (err, result) => {
        if (err) {
          console.log("error XML");
  
          throw err;
        }
  
        let header, itemList, summary,orderId;
        header = result.OPENTRANS.ORDER[0]?.ORDER_HEADER[0];
        itemList = result.OPENTRANS.ORDER[0]?.ORDER_ITEM_LIST;
        summary = result.OPENTRANS.ORDER[0]?.ORDER_SUMMARY;
        let tempDeliveryAddress = header?.ORDER_INFO?.[0]?.PARTIES?.[0]?.PARTY?.filter(
          e => Array.isArray(e?.PARTY_ROLE) && e.PARTY_ROLE[0] === "delivery"
        ) || [];
        // let tempDeliveryAddress = header['ORDER_INFO'][0]['PARTIES'][0]['PARTY'].filter((e)=> isArray(e.PARTY_ROLE) && e.PARTY_ROLE[0] == "delivery");
        let deliveryAddress = "";
        if(tempDeliveryAddress.length != 0){
          
          let tempAddress = tempDeliveryAddress[0]['ADDRESS'][0];
        
          deliveryAddress = await getAddress(tempAddress);
          console.log('12345',deliveryAddress);
        }
       function getAddress(tempAddress){
        for (const key in tempAddress) {
          if (Array.isArray(tempAddress[key])) {
            if(typeof(tempAddress[key][0]) == 'object'){
              deliveryAddress =  getAddress(tempAddress[key][0])
            }else{
              deliveryAddress += tempAddress[key][0] + '\n';  
  
            }
          }
        }
        return deliveryAddress;
  
       } 
      
        console.log(JSON.stringify(result));
     
      if('REMARKS' in header.ORDER_INFO[0])
      {
      
        orderTitle = header.ORDER_INFO[0]['REMARKS'][0];
  
      }
  
  
       console.log('orderTitle',orderTitle);
  
        console.log({
          header,
          itemList,
          summary,
          orderId
        });
       
  
        if ('ORDER_ID' in header.ORDER_INFO[0]) {
         
          orderId = header.ORDER_INFO[0]['ORDER_ID'][0]

       }
          
        console.log('orderIdorderId',orderId);
   
        if('REMARKS' in header.ORDER_INFO[0])
        {
         
            orderTitle = header.ORDER_INFO[0]['REMARKS'][0];
         
        }
        let itemArray = [];
        let dueDate;
        if ('PAYMENT' in header.ORDER_INFO[0]) {
          if (JSON.stringify(header.ORDER_INFO[0].PAYMENT).indexOf('VALUE_DATE') != -1) {
            dueDate = header.ORDER_INFO[0]?.PAYMENT[0]?.PAYMENT_TERMS[0]?.VALUE_DATE[0];
  
          } else {
            var date = new Date(header.ORDER_INFO[0].ORDER_DATE);
            console.log(date.getDate());
  
            date.setDate(date.getDate() + 30);
  
            var d = new Date(date),
              month = '' + (d.getMonth() + 1),
              day = '' + d.getDate(),
              year = d.getFullYear();
  
            if (month.length < 2)
              month = '0' + month;
            if (day.length < 2)
              day = '0' + day;
            dueDate = [year, month, day].join('-');
          }
        } else {
          var date = new Date(header.ORDER_INFO[0].ORDER_DATE);
          console.log(date.getDate());
  
          date.setDate(date.getDate() + 30);
  
          var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
  
          if (month.length < 2)
            month = '0' + month;
          if (day.length < 2)
            day = '0' + day;
          dueDate = [year, month, day].join('-');
  
        }
        let iteamArray:any = [];
        let taxId:any = [];
        let taxStatus = true;
        let tempTaxIdTmp = taxList.filter((e) =>  (e.type == 'not_taxable_turnover' && e.value == 0) || (e.type == 'not_taxable_turnover' && e.value == (0 * 100)));
        console.log('tempTaxIdTmp[0]',tempTaxIdTmp[0].id);
  
        itemList[0].ORDER_ITEM.forEach(element => {
          console.log(element.LINE_ITEM_ID[0]);
          let items:any = {};
          let discounts = {};
     
            console.log(typeof (element.PRODUCT_ID[0]));
  
          if (typeof (element.PRODUCT_ID[0]) == 'object') {
            if ('bmecat:DESCRIPTION_SHORT' in element.PRODUCT_ID[0]) {
              title = element.PRODUCT_ID[0]['bmecat:DESCRIPTION_SHORT'][0];
            } else {
              title = ' ';
            }
          } else {
            title = ' ';
          }
      
          console.log('123');
  
          items['amount'] = element.QUANTITY[0];

          items['unit_price'] = parseFloat(element.PRODUCT_PRICE_FIX[0]['bmecat:PRICE_AMOUNT'][0]).toFixed(2);
         
          let desc = '',tempDesc = '';
          
          if('bmecat:SUPPLIER_PID' in element.PRODUCT_ID[0]){ 
            if(typeof(element.PRODUCT_ID[0]['bmecat:SUPPLIER_PID'][0]) == 'object')
            {
              
              desc = element.PRODUCT_ID[0]['bmecat:SUPPLIER_PID'][0]["_"];
            }else{
              desc = element.PRODUCT_ID[0]['bmecat:SUPPLIER_PID'][0];
            }
          }
            
          if('bmecat:INTERNATIONAL_PID' in element.PRODUCT_ID[0])
          {
            if(typeof(element.PRODUCT_ID[0]['bmecat:INTERNATIONAL_PID'][0]) == 'object')
            {
              tempDesc = element.PRODUCT_ID[0]['bmecat:INTERNATIONAL_PID'][0]["_"];
            }else{
              tempDesc = element.PRODUCT_ID[0]['bmecat:INTERNATIONAL_PID'][0];
            }
          }
       
          desc != '' ? desc = desc + '<br>' : ''
          console.log('desc',desc);
  
          if(element.PRODUCT_ID[0]['bmecat:DESCRIPTION_LONG']){
            desc = desc + element.PRODUCT_ID[0]['bmecat:DESCRIPTION_LONG'][0]
          }
          console.log('tempDesc',tempDesc);
          
          'bmecat:INTERNATIONAL_PID' in element.PRODUCT_ID[0] ? desc = desc + '<br>EAN:'+ tempDesc : '';
          items['text'] = desc;
          console.log('descdesc',desc);
          
        
         
          console.log(items);
         
          console.log(getCompanyIdQryResult[0]);
            console.log('99988887777');
            
            if ('TAX_DETAILS_FIX' in element.PRODUCT_PRICE_FIX[0]) {
             
    
                if ('bmecat:TAX_TYPE' in element.PRODUCT_PRICE_FIX[0]['TAX_DETAILS_FIX'][0]) {
                  if ('bmecat:TAX' in element.PRODUCT_PRICE_FIX[0]['TAX_DETAILS_FIX'][0]) {
                    
                    let tempTaxId,tempTaxType;
                   
                    tempTaxType = getCompanyIdQryResult[0].tax_type? getCompanyIdQryResult[0].tax_type :'sales_tax';
    
                    console.log('tempTaxType',tempTaxType);
                    tempTaxId = taxList.filter((e) =>  (e.type == tempTaxType && e.value == element.PRODUCT_PRICE_FIX[0]['TAX_DETAILS_FIX'][0]['bmecat:TAX'][0]) || (e.type == tempTaxType && e.value == (element.PRODUCT_PRICE_FIX[0]['TAX_DETAILS_FIX'][0]['bmecat:TAX'][0] * 100)));
                    tempTaxId != '' ? items['tax_id'] = tempTaxId[0]['id']:taxStatus = false;
                    taxId.push(tempTaxId)
                  }else{
                    taxStatus = false;
    
                  }
                }else{
                  taxStatus = false;
                }
               
          }
          else{
    
                items['tax_id'] = tempTaxIdTmp[0].id;            
              }
         
          items['type'] = 'KbPositionCustom';
          iteamArray.push(items)
          console.log(items);
        });
       
        console.log('customerIds',customerIds);
        
        contact = await getContactDetails(access_token, customerIds[0].senderid);
  
        console.log("contact++ ",contact);
        if (!contact) {
       
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'getContactDetails_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'getContactDetails_not_found');
            res.send({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
  
          });
          return
        }
       
        if(!taxStatus){
          console.log('TAX NOT FOUND');
          res.send({
            status_code: 500,
            message: 'tax_not_Found',
            status: false,
          })
          return
        }
        let currencyList:any = await getAllCurrency(access_token);
        let cnyCurrency;
        if( header.ORDER_INFO[0]['bmecat:CURRENCY'] ){
          cnyCurrency = currencyList.find(currency => currency.name === header.ORDER_INFO[0]['bmecat:CURRENCY'][0]);
        }
        console.log('getCompanyIdQryResult.rows[0].settings',getCompanyIdQryResult[0].settings);
        let mwstType;
        if('HEADER_UDX' in header.ORDER_INFO[0]){
          if('IS_TAX_INCLUSIVE' in header.ORDER_INFO[0]['HEADER_UDX'][0]){
            if(header.ORDER_INFO[0]['HEADER_UDX'][0]['IS_TAX_INCLUSIVE'][0] == "true"){
              mwstType = "false";
            }else{
              mwstType = "true";
            }
            console.log("header.ORDER_INFO[0]['HEADER_UDX'][0]['IS_TAX_INCLUSIVE'][0]",header.ORDER_INFO[0]['HEADER_UDX'][0]['IS_TAX_INCLUSIVE'][0]);
          }
        }
        console.log('mwstTypemwstType',mwstType);
        console.log("cnyCurrency :: ",cnyCurrency);
        let order = {
          "contact_id": customerIds[0].senderid ,
          "user_id": contact.user_id,
          "currency_id": cnyCurrency ? cnyCurrency.id : '',
          "mwst_type": taxId.length != 0 ? 0 : 1,
          "mwst_is_net": taxId.length != 0 ? (mwstType ? mwstType :true) : false,
          "is_valid_from": formatDate(header.ORDER_INFO[0].ORDER_DATE),
          "positions": iteamArray,
          "title": orderTitle,
           "delivery_address_type": deliveryAddress != "" ? "1" : undefined,
           "delivery_address_manual": deliveryAddress != "" ? deliveryAddress : undefined,
        }
        console.log("order :: ",order);
        var options = {
          'method': 'POST',
          'url': `${config.BEXIO_API}2.0/kb_order`,
          'headers': {
            'Accept': 'application/json',
            "Content-Type": "application/json",
            'Authorization': 'Bearer '+access_token
          },
          body:JSON.stringify(order)
  
        };
        request(options, async function (error, response) {
          console.log("create order:::");
          console.log(JSON.stringify(response.body));
          
          if (error){
            console.log(error);
            res.send({
              status_code: 500,
              message: JSON.stringify(error),
              status: false,
            })
          }
          if(response.statusCode==201){
            let footer = JSON.parse(response.body)['footer'];
            if(orderId != ' '){
            footer = `Bestellnummer: ${orderId} <br><br>` + footer 
            await setOrderId(id,JSON.parse(response.body)['document_nr'])
            if('customer-output' in JSON.parse(file_path)){
              await moveFile(netcomId,JSON.parse(file_path)["customer-output"]);
            }
            }
            res.send({
              status_code: 200,
              message: 'common_sucess',
              status: true,
              data: [],
            });
          }else{
            commonErrors['errorTitle'] = req.originalUrl;
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'SEND_G2B_ORDER -req param,',JSON.stringify(req.body);
            warningMessage(commonErrors,'SEND_G2B_ORDER');
            res.send({
              status_code: 500,
              message: 'something_went_wrong',
              status: false,
            })
          }
        });
        console.log('SEND_G2B_ORDER1SEND_G2B_ORDER1');
      });
    });
    } catch (error) {
       commonErrors['errorTitle'] = req.originalUrl;
       commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+formData;
       warningMessage(commonErrors,error);
       res.send({
         status_code: 500,
         message: JSON.stringify(error),
         status: false,
       })
    }
  }
  async sendDeliveryNotes(req: Request, res: Response,): Promise<any> {
    try {
      let bodyData = req.body;
      let bodyParams = {
        "partyId": bodyData.partyId,
        "accountId": bodyData.accountId,
      }
      let deliveryItems = bodyData.deliveryItems;  
    
       
      let obj = JSON.parse(deliveryItems);
      console.log('objobjobjobj',obj);
      
      async function processInvoices(obj, bodyData) {
        for (let index = 0; index < obj.length; index++) {
          const element = obj[index];
          await setDeliveryNotesCidSendStatus(bodyData.partyId, element.delivery_id, '', '1', '');
        }
      }
      await processInvoices(obj, bodyData);
      console.log('deliveryItems',deliveryItems);
      
      this.sendDeliveryNotesHost.run(deliveryItems, bodyParams, {
        cookies: req.cookies, // Include cookies
        signedCookies: req.signedCookies, // Include signed cookies
        url: req.url,
    });
      
    } catch (error) {
      console.log("error in sendBulkDeliveryNotes :: ",error);      
      let responseValue = req.body.invoiceId;
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + responseValue;
      warningMessage(commonErrors, error);
      return res.status(500).json({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
      });
    }
    res.send({});
  }
}