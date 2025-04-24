import { Injectable } from '@nestjs/common';
import { connectBexio, connectLibrary, connectGate2b, connectNewGate2b } from '../db/prisma-clients';
import config from '../common/config/index';
import * as request from 'request';
import { Request, Response } from 'express';
const encryptionControl = require("../common/utils/jwt-decode");
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
import { SendOrderWorkerHost } from '../common/utils/sendOrder_worker.host';
@Injectable()
export class CreditorsService {
  constructor(private readonly sendOrderWorkerHost: SendOrderWorkerHost) {}
 async getInvoice(req: Request, res: Response,): Promise<any> {
  
    let cookie = null
    let data = req.body;
   
    try {
      let cookieData = req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME];

      if (!cookieData) {
        res.status(500).send({
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
  
      console.log('showFrom',showFrom);
      console.log('showTo',showTo);
  
      
  
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
            console.log(error);
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
            
            const getRegisteredId = await connectBexio.companyregistered.findMany({
              where: {
                rk_party: Number(data.partyId), 
              },
              select: {
                cid: true, 
              },
            });
            console.log('getRegisteredId',getRegisteredId);
            
            const validDate = (date) => {
              const parsedDate = new Date(date);
              return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
            };
  
            const billsList = await connectBexio.documents_invoice_receive.findMany({
              where: {
                fk_companyregistered: getRegisteredId[0].cid, // Ensure correct ID
                created_date: {
                  gte: data.dateFrom ? new Date(data.dateFrom) : undefined,
                  lte: data.dateTo ? new Date(data.dateTo) : undefined,
                },
                document_number: data.documentNo?.trim()
                  ? { contains: data.documentNo.trim(), mode: "insensitive" }
                  : undefined,
                ...(data.billStatus === "Yes" ? { rk_invoice: { not: null } } : {}),
                ...(data.billStatus === "No" ? { rk_invoice: null } : {}),
              },
              orderBy: {
                created_date: "desc",
              },
              skip: Number(showFrom) - 1,
              take: Number(showTo) - Number(showFrom) + 1,
            });
            
            console.log("billsList", billsList);
            


            const billsListCount = await connectBexio.documents_invoice_receive.count({
              where: {
                fk_companyregistered: getRegisteredId[0]?.cid,
                created_date: {
                  gte: validDate(data.dateFrom),
                  lte: validDate(data.dateTo),
                },
                document_number: data.documentNo?.trim()
                  ? { contains: data.documentNo.trim(), mode: "insensitive" }
                  : undefined,
                ...(data.orderStatus === "Yes" ? { rk_invoice: { not: null } } : {}),
                ...(data.orderStatus === "No" ? { rk_invoice: null } : {}),
              },
            });


            const totalOrders = Number(billsListCount); // Convert BigInt to Number
            
            console.log("Total Orders:", totalOrders);
            
           
  
            for (let index = 0; index < billsList.length; index++) {
              const element = billsList[index];
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
              if(getBc.length != 0)
              {
                element['companyName'] = getBc[0].companyname;
                element['netcomId'] = getBc[0].netcomId;
                if(!element['rk_invoice'])
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
              data:billsList,
              totalCount:totalOrders
          })
        // res.send(billsList.rows);
        });
  
      }else{
        return res.status(401).json({
          status: 'fail',
          message: 'unauthorized',
      });
      }
     
    } catch (error) {
   
      console.log(error);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+cookie;
      warningMessage(commonErrors,error);
      return res
      .status(200)
      .json({ status: 500, message: 'something_went_wrong' });
        
    }
  }
  async getOrderList(req: Request, res: Response,): Promise<any> {
  
    let cookie = null
    let data = req.body
    let partyId = req.body.partyId;
    try {
      let cookieData = req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME];

      if (!cookieData) {
        res.status(500).send({
          status_code: 500,
          message: 'Missing_cookie',
          status: false,
        })
      }

      let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(cookieData)));
      console.log('cookie.access_Token;',cookie.access_Token);
      
      let accessToken = cookie.access_Token;
      let isBexioUser = cookie.isBexioUser;
      let resultData: any[] = [],tempStatus = false;
      let totalCount;
      let sortColumn = 'updated_at';
      let sortType = 'asc';
  
      let showFrom = req.body.records_per_page * (req.body.page_number-1);
      let showTo = req.body.records_per_page;
      sortColumn = req.body?.sortColumn;
      sortType = req.body?.sort;
  
      
      const invoiceData = await connectBexio.documents_order_send.findMany({
        where: {
          companyregistered: {
            rk_party: Number(req.body?.partyId)
          }
        },
        include: {
          companyregistered: true
        }
      });
      // console.log('invoiceData',invoiceData);
      const invoiceList = invoiceData.map(inv => ({
        ...inv,
        rk_order: Number(inv.rk_order)
      }));
      const getNetcomId = await connectBexio.$queryRaw<any>(
        Prisma.sql`
        SELECT * FROM companyregistered WHERE rk_party = ${Number(partyId)}
      `
      );
      // console.log('getNetcomId',getNetcomId);
  
    
      // console.log('getNetcomId',getNetcomId[0].netcomid);
  
      // NEW
  

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




     // console.log('bcDetails12121222');
     
      const bcConnectionIds = getConnectionStatusList[0]?.bcConnection || [];
                  let bcDetails;
                  bcDetails = await getBcDetails(bcConnectionIds, getNetcomId[0].netcomid);
                 // console.log('bcDetails',bcDetails);
                  let tempBc = [0];
      if(bcDetails){
        for (let index = 0; index < bcDetails['data'].length; index++) {
          const element = bcDetails['data'][index];
          if(element['company_details']['doc_type']['data'] == 'Order'){
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
    let resultArray  = getConnectionBc[0]?.array_agg;
   // console.log('resultArray',resultArray);
      if(isBexioUser)
      {
      
        let options;
   
          let searchJson: any[] = [];
      
        
          if (data.documentNo) {
            searchJson.push({
              "field": "document_nr",
              "value": data.documentNo,
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
        //  console.log('searchJsonsearchJson',searchJson.length);
          if(searchJson.length != 0)
          {
            totalCount = await orderCountSearch(accessToken,searchJson,0,2000)
            options = {
              'method': 'POST',
              'url': `${config.BEXIO_API}3.0/purchase_orders/search/?limit=${showTo}&offset=${showFrom}&order_by=${sortColumn}_${sortType}`,
             
              'headers': {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+accessToken
              },
              body: JSON.stringify(searchJson)
            };
          }else{
            totalCount = await orderListCountSearch(accessToken,0,2000);
            options = {
              
              'method': 'GET',
              // 'url': `${config.BEXIO_API}2.0/kb_invoice`,
              'url': `${config.BEXIO_API}3.0/purchase_orders/?limit=${showTo}&offset=${showFrom}&order_by=${sortColumn}_${sortType}`,
              'headers': {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+accessToken
              }
    
            }; 
          }
        
          // console.log('totalCount',options);
          // console.log('totalCount',totalCount);
        
          // totalCount = await  contactListCountSearch(accessToken,0,2000);
  
       
        request(options, async function (error, response) {
          if (error) {
            commonErrors['errorTitle'] = req.originalUrl;
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+showTo+' '+showFrom;
            warningMessage(commonErrors,error);
            return res.status(500).json({
              status: false,
              message: 'something_went_wrong',
              error: JSON.stringify(error)
          });
          }
          let resData = JSON.parse(response.body);
          
          if(response.statusCode != 200)
          return res.status(401).json({
            status: true,
            status_code : response.statusCode,
            data: ['test'],
            message: 'unauthorized',
          });
          //'url': `${config.BEXIO_API}2.0/kb_invoice?order_by=updated_at_desc`,
          let status = JSON.parse(config.BEXIO_PURCHASE_ORDER_STATUS);
          let contact_idList:any = [];
          let order:any;

          
          // console.log('resData',resData);
          for (let invoice in resData) {
            tempStatus = false;
            resData[invoice]['allowSend'] = resultArray ? ( resultArray.includes((resData[invoice].contact_id)) ? true : false ) : false;
            contact_idList.push((resData[invoice].contact_id));
            
            order = await getOrderOT(accessToken,resData[invoice].id); 
            
            // order = JSON.parse(order)
            resData[invoice]['statusLabel'] = status[resData[invoice].kb_item_status_id];
            resData[invoice]['timestamp'] = '';
            resData[invoice]['total_net'] = order.positions.total_net;
            resData[invoice]['total'] = order.positions.total;
            resData[invoice]['total_gross'] = order.positions.total_gross;
            //resData[invoice]['companyName'] = resData[invoice]['contact_address'].split("\n")[0];
            resData[invoice]['companyName'] = order['contact_address_manual'].split("\n")[0];
            resData[invoice]['rk_globaltransaction'] = '';
            resData[invoice]['status'] = '';
            resData[invoice]['statusLabelInvoice'] = '';  
            for(let qryInvoice in invoiceList ){
              if(invoiceList[qryInvoice]['rk_order'] == resData[invoice]['id']){
               // console.log('0000',invoiceList[qryInvoice]['status'])
              }
                if(invoiceList[qryInvoice]['rk_order'] == resData[invoice]['id']){
                  resData[invoice]['rk_globaltransaction'] = invoiceList[qryInvoice]['rk_globaltransaction'];
                  resData[invoice]['status'] = invoiceList[qryInvoice]['status'];
                  resData[invoice]['statusLabelInvoice'] =JSON.parse(config.INVOICE_STATUS || '{}')[String(invoiceList?.[qryInvoice]?.status)];
                  resData[invoice]['timestamp'] = invoiceList[qryInvoice]['time_stamp'];
                  resData[invoice]['type'] = invoiceList[qryInvoice]['type'];
                  if(invoiceList[qryInvoice]['status'] == 2)
                  {
                   // console.log('222')
                    resData[invoice]['allowSend'] = false;
                  }
                  
                  break;
              }
            }
            if(!tempStatus){
              resData[invoice]['isEbill'] = false;
            }else{
              resData[invoice]['isEbill'] = true;
              resData[invoice]['allowSend'] = false;
              // resData[invoice]['allowSend'] = true;
  
            }      
            resultData.push(resData[invoice]);
          }
          let contactList:any = [];
          // Search contact list from bexio to get name_1 and name_2
          contactList = await getContactById(accessToken,contact_idList);
          // Loop to add name_1 and name_2  from contact list to the resultData as companyName.
          let contactNameList = {};
          if(!contactList)
          {
            res.send({
              status: 500,
              data:[]
            });
            return
          }
       
          contactList.forEach(element => {         
            let name_1 = element.name_1 ? element.name_1 : '';
            let name_2 = element.name_2 && element.name_2.length ? element.name_2 : '';
            contactNameList[element.id] = name_1 + (name_2 ? ' ' + name_2 : '');
          });
          let currencyList = {};
          let currency: any = [];
          // Get all currency from bexio to map the currency_id in every invoice.
          currency = await getAllCurrency(accessToken);
          currency.forEach(element => {
            currencyList[element.id] = element.name;
          });
          resultData.forEach((second) => {
            second.companyName = contactNameList[second["contact_id"]];
            second.currency = currencyList[second['currency_id']];
          });
          let keys = Object.keys(req.body)
          // let redisKey = req.url+"_"+req.body.partyId+"_";
          let redisKey = req.body.partyId+"_"+req.url+"_";
          console.log('redisKey1',redisKey);
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
    
    
      console.log(error);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+cookie;
      warningMessage(commonErrors,error);
      return res
      .status(500)
      .json({ status: 500, message: 'something_went_wrong' });
        
    }
  }
  async sendOrder(req: Request, res: Response,): Promise<any> {
    try {
      let bodyData = req.body;
      let bodyParams = {
        "partyId": bodyData.partyId,
        "accountId": bodyData.accountId,
      }
      let orders = bodyData.orderItems;
      let obj = JSON.parse(orders);
      console.log('objobjobjobj',obj);
      
      async function processInvoices(obj, bodyData) {
        for (let index = 0; index < obj.length; index++) {
          const element = obj[index];
          await setOrderSendStatus(bodyData.partyId, element.orderId, '', '1', '');
  
        }
      }
      // Call the function with await to ensure it completes before moving on
      await processInvoices(obj, bodyData);
      await this.sendOrderWorkerHost.run(orders, bodyParams, {
        cookies: req.cookies, // Include cookies
        signedCookies: req.signedCookies, // Include signed cookies
        url: req.url,
      });

      
    } catch (error) {
      console.log("error in sendBulkPurchaseOrder :: ",error);      
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
  async xmlToJson(req: Request, res: Response,): Promise<any> {
 
    let formData;
    let reqData = req.body;
    let cookie,access_token
    cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
   try {
       let transaction_id = req.body.globaltransaction,taxList;
       let bc_id = req.body.bcId;
       let file_path = req.body.file_path;
       let id = req.body.id;
       let netcomId = req.body.netcomId;
      
       access_token = cookie.access_Token;
       let customerIds = await constGetContactId(bc_id);
       console.log('customerIds',customerIds);
       taxList = await getTaxList(access_token);
         
          formData = {
           transaction_id:transaction_id,
           virtual_filename:JSON.parse(file_path).output,
           filetype:'output',
           data_format:'base64'
         }
         console.log(formData);
         
         var options = {
           'method': 'POST',
           'url': config.PYTHON_API+'file-download',
           formData: formData
         };
         request(options, function (error, response) {
           if (error) {  
             commonErrors['errorTitle'] = 'xmlToJson';
             commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+formData;
             warningMessage(commonErrors,error);
         
             res.send({
               status_code: 500,
               message: 'something_went_wrong'+error,
               status: false,
           
             });
             return
           }
             let data = JSON.parse(response.body).data;
           console.log(data);
           console.log('xmltojsooooooooo',response.body);
           if(!data){
             console.log('File not found');
             let error = 'File not found';
             let errorJson = {host:req.headers.host,method:'xmlToJson',parms:req.body,error:'File not found'}
             commonErrors['errorTitle'] = req.originalUrl;
             commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+formData;
             warningMessage(commonErrors,error);
    
             res.send({
               status_code: 500,
               message: 'something_went_wrong',
               status: false,
             })
             return

           }
           let xml = Buffer.from(data, 'base64').toString();
           let contact,contryName;
           
         xml2js.parseString(xml, async (err, result) => {
           if(err) {
               throw err;
           }
   
       let header,itemList,summary;
       header = result.OPENTRANS.INVOICE[0]?.INVOICE_HEADER[0];
       itemList = result.OPENTRANS.INVOICE[0]?.INVOICE_ITEM_LIST;
       summary = result.OPENTRANS.INVOICE[0]?.INVOICE_SUMMARY;
 
       let fileDeatis;

       if('MIME_INFO' in header.INVOICE_INFO[0])
       {
         console.log(header.INVOICE_INFO[0]);
         

         fileDeatis = await fileUpload(transaction_id,header.INVOICE_INFO[0].MIME_INFO[0].MIME[0].MIME_EMBEDDED[0],access_token);
         if(!fileDeatis){
           commonErrors['errorTitle'] = req.originalUrl;
           commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'error_in_fileUpload -req param,',JSON.stringify(req.body);
           warningMessage(commonErrors,'error_in_fileUpload');
           res.send({
             status_code: 500,
             message: 'something_went_wrong',
             status: false,
           });
           return
         }
         'error_code' in JSON.parse(fileDeatis) ? fileDeatis = '':''
         console.log(fileDeatis);
       }
       
       let iteamArray:any = [];
       let dueDate;

       if('PAYMENT' in header.INVOICE_INFO[0])
       {
        if(JSON.stringify( header.INVOICE_INFO[0].PAYMENT).indexOf('VALUE_DATE') != -1)
        {
         dueDate = header.INVOICE_INFO[0]?.PAYMENT[0]?.PAYMENT_TERMS[0]?.VALUE_DATE[0];
          
        }else{
         var date = new Date(header.INVOICE_INFO[0].INVOICE_DATE);
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
       }else{
         var date = new Date(header.INVOICE_INFO[0].INVOICE_DATE);
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
       itemList[0].INVOICE_ITEM.forEach(element => {
         console.log( element.LINE_ITEM_ID);
         let items = {};
         let discounts = {};
         let title;
         // items = 
         items['position'] = Math.trunc(element.LINE_ITEM_ID[0]),
         console.log(typeof(element.PRODUCT_ID[0]));
         
         //  typeof(element.PRODUCT_ID[0]) ==  'object' ?:'',
          if( typeof(element.PRODUCT_ID[0]) ==  'object' )
          {
            if('bmecat:DESCRIPTION_SHORT' in element.PRODUCT_ID[0])
            {
             title = element.PRODUCT_ID[0]['bmecat:DESCRIPTION_SHORT'][0];
            }else{
             title = ' ';
            }
          }else{
           title = ' ';
          }
          items['title'] = title;
        
         console.log('123');

         items['amount'] = parseFloat(element.PRICE_LINE_AMOUNT[0]).toFixed(2);
         items['booking_account_id'] = 99; // Setting default value

         console.log(items);
         console.log('DESCRIPTION_SHORT',element.PRODUCT_ID[0]['bmecat:DESCRIPTION_SHORT']);
         console.log('PRICE_AMOUNT',element.PRODUCT_PRICE_FIX[0]['bmecat:PRICE_AMOUNT']);
         let taxId = '';
         if('TAX_DETAILS_FIX' in element.PRODUCT_PRICE_FIX[0])
         {
           if('bmecat:TAX_TYPE' in element.PRODUCT_PRICE_FIX[0]['TAX_DETAILS_FIX'][0])
           {
             if('bmecat:TAX' in element.PRODUCT_PRICE_FIX[0]['TAX_DETAILS_FIX'][0])
             {
               taxId = taxList.filter((e)=> e.type == element.PRODUCT_PRICE_FIX[0]['TAX_DETAILS_FIX'][0]['bmecat:TAX_TYPE'] && e.value == element.PRODUCT_PRICE_FIX[0]['TAX_DETAILS_FIX'][0]['bmecat:TAX'])
               taxId != '' ? items['tax_id'] = taxId[0]['id']:'';
             }
           }
     
         }

         iteamArray.push(items)
       });
       console.log('123');
       
       contact = await getContactDetails(access_token, customerIds[0].senderid);
       console.log(contact);

       if(!contact)
       {
         commonErrors['errorTitle'] = req.originalUrl;
         commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'contactDetails_not_found -req param,',JSON.stringify(req.body);
         warningMessage(commonErrors,'contactDetails_not_found');
     
           res.send({
           status_code: 500,
           message: 'something_went_wrong',
           status: false,
       
       });
       return
       }
        console.log("contact['country_id']",contact['country_id']);
     
       contryName =  contact['country_id'] ? await getCountryName(access_token, contact['country_id']) : true;
       console.log('contryName',contryName);

       if(!contryName)
       {
         commonErrors['errorTitle'] = req.originalUrl;
         commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'countryName_not_found -req param,',JSON.stringify(req.body);
         warningMessage(commonErrors,'countryName_not_found');
     
         res.send({
           status_code: 500,
           message: 'something_went_wrong',
           status: false,
       
       });
       return
       }
       console.log('contryName',JSON.parse(contryName)['iso_3166_alpha2']);
       console.log('amount_man',summary[0].TOTAL_AMOUNT[0]);
       console.log('amount_man_trunc',Math.trunc(summary[0].TOTAL_AMOUNT[0]));
       
       let bill =  {
         "supplier_id": customerIds[0].senderid, //Contact Id
         "vendor_ref": header.INVOICE_INFO[0].INVOICE_ID[0],
         "contact_partner_id":  req.body.userId, // User Id
         "bill_date": formatDate(header.INVOICE_INFO[0].INVOICE_DATE),
         "due_date": dueDate,
         "amount_man":parseFloat(summary[0].TOTAL_AMOUNT[0]).toFixed(2),
         "manual_amount": true,
         "currency_code": header.INVOICE_INFO[0]['bmecat:CURRENCY'][0],
         "item_net": true,
         "address": {
           "lastname_company": contact['name_1'],
           "country_code": contryName ? JSON.parse(contryName)['iso_3166_alpha2']:'',
           "type": JSON.parse(config.BEXIO_COMPANY_TYPE||'')[contact['contact_type_id']]
         },
        
       
         "line_items":iteamArray,
      
       
     }
     fileDeatis ? bill['attachment_ids'] = [JSON.parse(fileDeatis)[0].uuid] : '';
   
     console.log('bill',bill);
     var options = {
       'method': 'POST',
       'url': `${config.BEXIO_API}4.0/purchase/bills`,
       'headers': {
         'Accept': 'application/json',
         "Content-Type": "application/json",
         'Authorization': 'Bearer '+access_token
       },
       body:JSON.stringify(bill)
   
     };
     request(options, async function (error, response) {
       if (error) {  
         commonErrors['errorTitle'] = 'bills';
         commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+bill;
         warningMessage(commonErrors,error);
       
         res.send({
           status_code: 500,
           message: JSON.stringify(error),
           status: false,
         })
       }
       if(response.statusCode==201)
         await setBillId(id,JSON.parse(response.body)['document_no'])
         if('customer-output' in JSON.parse(file_path)){
           await moveFile(netcomId,JSON.parse(file_path)["customer-output"]);
         }
    
         console.log(response.body);
         
         res.send(response.body);

     });
     });
         });

   } catch (error) {
    
      console.log(error);
     
     let errorJson = {host:req.headers.host,method:'xmlToJson',parms:req.body,error:error}

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
async getAllUsers(req: Request, res: Response,): Promise<any> {

  let cookie ;
  cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
  try {
    let access_token = cookie.access_Token;
    
    return new Promise(async(resolve, reject) => {
          var options = {
            'method': 'GET',
            'url': `https://api.bexio.com/3.0/users`,
            'headers': {
              'Accept': 'application/json',
              'Authorization': 'Bearer '+access_token
            }
          };
          request(options, function (error, response) {
            if (error) {  
              commonErrors['errorTitle'] = 'users';
              commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+access_token;
              warningMessage(commonErrors,error);
              resolve(false)
            }
            // res.send(response.body)
            console.log(response?.body);
             res.status(200).send(response?.body)
           'body' in response ?  resolve(JSON.parse(response?.body)) : '';
  
          });
        });
    } catch (error) {
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+cookie;
        warningMessage(commonErrors,error);
      res.send({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
    });
    }
}
}
const orderListCountSearch = async (token,offset,limit?) => {
  return new Promise(async(resolve, reject) => {
    var options = {
      'method': 'GET',
      // 'url': 'https://api.bexio.com/2.0/contact/search',
      'url': `${config.BEXIO_API}3.0/purchase_orders/?limit=${limit}&offset=${offset}&order_by=updated_at_desc`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    };
    console.log({
      offset: offset,
      limit: limit
    });
    
      request(options, function (error, response) {
        if (error) {  
          commonErrors['errorTitle'] = 'orderListCount';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+token;
          warningMessage(commonErrors,error);
          resolve(false);
        }
        if(response.statusCode == 200){
          if(JSON.parse(response.body).length == limit){
           let temp = orderListCountSearch(token,offset+2000,2000);
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
const orderCountSearch = async (token,search,offset,limit?)=>{
  return new Promise(async(resolve, reject) => {
    var options = {
      'method': 'POST',
      'url': `${config.BEXIO_API}3.0/purchase_orders/search?limit=${limit}&offset=${offset}&order_by=updated_at_desc`,
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
        console.log("JSON.parse(response.body).length",options);

        console.log("JSON.parse(response.body).length",JSON.parse(response.body));
        console.log("limit",limit)
        
        if(JSON.parse(response.body).length == limit){
         let temp = orderCountSearch(token,offset+2000,2000)
         console.log('11111111111111111111111111111');
         
        }else{
          offset = offset + JSON.parse(response.body).length;
          console.log('lengthhh',offset);
          resolve(offset)
        }
        // console.log(JSON.parse(response.body).length);
        
        // resolve(JSON.parse(response.body).length)

      }
      else
      resolve(false)
    });
  });
}
const getBcDetails = async (bc_id,netcomId)=>{
  
  try{
  

    return new Promise(async(resolve, reject) => {
      if(bc_id){
        let formData = {
          bc : bc_id.toString(),
          netcom_id : netcomId
        } 
        console.log('formData',formData);
        
        let  options = {
          'method': 'POST',
          'url': config.PYTHON_API+'get-contact-bc',
          // 'url': 'http://192.168.2.166:5005/api/'+'get-contact-bc',

          formData: formData
        };

        request(options, async function (error, response, body) {
          if (error) {  
            commonErrors['errorTitle'] = 'getBcDetails';
            warningMessage(commonErrors,error);
            resolve(false)
          }else{
            console.log('1111111111');
            
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
const getOrderOT = async (accessToken,orderId) =>{
  try {
    return new Promise( async( resolve, reject) => {
      var options = {
        'method': 'GET',
        'url': `https://api.bexio.com/3.0/purchase_orders/${orderId}`,
        'headers': {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      };
      // console.log('optionsoptions',options);
      

      request( options, function(error, response){
        if(error){
          console.log('errorerrorerror',error);
          commonErrors['errorTitle'] = 'getOrderOT';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+orderId;
          warningMessage(commonErrors,error);
          resolve(error);
        }
        // console.log('responseresponse',response);

        if( response.statusCode == 200){
          resolve(JSON.parse(response.body));
        }
        else{
          resolve(false);
        }
      })
    });
  } catch (error) {
    commonErrors['errorTitle'] = 'getOrderOT';
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+orderId;
    warningMessage(commonErrors,error);
    return;
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
   
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer '+accessToken
      },
      body: JSON.stringify(searchJson)
    };
    let contactList: any = [];
    request(optionsContact, async function (error, response) {
      if (error) {
        commonErrors['errorTitle'] ='getContactById';
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
const setOrderSendStatus = async (partyId,orderId,ordernumber,status,error?) => {
  let sendOrderId;
  return new Promise( async function (resolve, reject) {
    try {

      const selectQryResult = await connectBexio.documents_order_send.findMany({
        where: {
          rk_order: orderId,
          order_type: 'EDI',
          companyregistered: {
            rk_party: Number(partyId),
          },
        },
        select: {
          cid: true, // this is documents_order_send.cid (ordersendid)
          companyregistered: {
            select: {
              cid: true, // this is c.cid
            },
          },
        },
      });
      
      if(selectQryResult.length == 0){
        console.log('ifffffffffffff');
       
        const selectQryResultParty = await connectBexio.companyregistered.findMany({
          where: {
            rk_party:Number(partyId),
          },
        });

        const result = await connectBexio.documents_order_send.create({
          data: {
            rk_order: orderId,
            order_number: ordernumber,
            fk_companyregistered: selectQryResultParty[0]?.cid, // Make sure this exists
            order_type: 'EDI',
            status:Number(status),
          },
          select: {
            cid: true, // This is the equivalent of RETURNING cid
          },
        });
        console.log(result);
        sendOrderId = result.cid;
      }
      else{
        console.log('elseeeeeeeeeee');

        sendOrderId = selectQryResult[0]?.cid;


        await connectBexio.documents_order_send.updateMany({
          where: {
            fk_companyregistered:selectQryResult[0]?.companyregistered?.cid,
            rk_order: orderId,
            order_type: 'EDI',
          },
          data: {
            time_stamp: new Date(), // equivalent to NOW()
            status:Number(status),        // make sure it's a string
          },
        });

      }
    
      resolve(sendOrderId);
    } catch (error) {
     
      console.log(error);
      commonErrors['errorTitle'] =' setInvoiceSendStatus';
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+partyId+'-partyId'+orderId+'-orderId'+ordernumber+'orderNumber';
      warningMessage(commonErrors,error);
      resolve('');
    }
  });

}
const constGetContactId = async (code) =>{
  try {
    const getCustomerIdResult = await connectNewGate2b.$queryRaw<any>(Prisma.sql`
    SELECT json_extract_path("ot_updator"::json,'in_custom_id') AS senderId,
    json_extract_path("ot_updator"::json,'out_custom_id')  AS receiverId
  FROM  g2b_business_connections 
    WHERE id = ${Number(code)}
    `);
      return getCustomerIdResult


  } catch (error) {
      commonErrors['errorTitle'] = constGetContactId.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+code;
      warningMessage(commonErrors,error);
  }
}
const getTaxList = async (access_token) => {

  return new Promise(async(resolve, reject) => {
        var options = {
          'method': 'GET',
          'url': `https://api.bexio.com/3.0/taxes`,
          'headers': {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+access_token
          }
        };
        request(options, function (error, response) {
          if (error) {  
            commonErrors['errorTitle'] = 'taxes';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+access_token;
            warningMessage(commonErrors,error);
            resolve(false)
          }
          // res.send(response.body)
          console.log(response.body);
          if(response.statusCode==200)
           resolve(JSON.parse(response.body));
          else
           resolve(false)

        });
      });
} 
const fileUpload = async (transaction_id,file,access_token)=>{
  let formData = {
    transaction_id:transaction_id,
    virtual_filename:file.FILE_NAME[0],
    filetype:'input',
    data_format:'base64',
  }
  return new Promise(async(resolve, reject) => {
      var b64string = file.MIME_DATA[0]
      
      var buf = Buffer.from(b64string, 'base64');
      var options = {
        'method': 'POST',
        'url': `https://api.bexio.com/3.0/files`,
        'headers': {
          'Accept': 'application/json',
          'Authorization': 'Bearer '+access_token
        },
        formData: {
          'string': {
            'value': buf,
            'options': {
              'filename': file.FILE_NAME[0],
              'contentType': null
            }
          }
        }
      };
      request(options, function (error, response) {
        if (error) {  
          commonErrors['errorTitle'] = 'getCountryLists';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+formData;
          warningMessage(commonErrors,error);
          resolve(false)
        }
           resolve(response.body);
      });
  });
}
const getContactDetails = async (access_token,id) => {    
  console.log(id);
  
  try {
    return new Promise(async(resolve, reject) => {
      var options = {
        'method': 'GET',
        'url': `https://api.bexio.com/2.0/contact/${id}`,
        'headers': {
          'Accept': 'application/json',
          'Authorization': 'Bearer '+access_token
        }
      };
      request(options, function (error, response) {
        if (error) {  
          commonErrors['errorTitle'] = 'getContactDetails';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+id;
          warningMessage(commonErrors,error);
          resolve(false)
        }
     
        if(response.statusCode==200)
          resolve(JSON.parse(response.body));
        else
          resolve(false)

      });
    });
  } catch (error) {
      commonErrors['errorTitle'] = getContactDetails.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+access_token+id;
      warningMessage(commonErrors,error);

    fs.writeFile('assets/errorLog.txt', JSON.stringify(error), function () {
      resolve('');
    });
  }
}
const getCountryName = async (access_token,id)=>{
    try {
      return new Promise(async(resolve, reject) => {
        var options = {
          'method': 'GET',
          'url': `https://api.bexio.com/2.0/country/${id}`,
          'headers': {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+access_token
          }
        };
        request(options, function (error, response) {
          if (error) {  
            commonErrors['errorTitle'] = 'getCountryName';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+id;
            warningMessage(commonErrors,error);
            resolve(false)
          }
         
          if(response.statusCode==200)
           resolve(response.body);
          else
           resolve(false)
        });
      });
    } catch (error) {
      commonErrors['errorTitle'] = getCountryName.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+access_token+id;
      warningMessage(commonErrors,error);
      fs.writeFile('assets/errorLog.txt', JSON.stringify(error), function () {
        resolve('');
      });
    }
}
function formatDate(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) 
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;

  return [year, month, day].join('-');
}
const setBillId = async (id,billId) =>{
  console.log('error');

  try {

    const getcustomerIdResult = await connectBexio.documents_invoice_receive.updateMany({
      where: {
        cid: id,
      },
      data: {
        rk_invoice: billId,
        status: '2',
      },
    });
    return getcustomerIdResult
  } catch (error) {
    console.log(error);
      commonErrors['errorTitle'] = setBillId.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+billId;
      warningMessage(commonErrors,error);
    return 0;
  }
}
const moveFile = async (netcomId,fileName)=>{
  let formData 
  try {
   formData = {
      netcom_id:netcomId,
      filename:fileName
    }
    console.log(formData);
    

    return new Promise(async(resolve, reject) => {
      var options = {
        'method': 'POST',
        'url': config.PYTHON_API+'move-file',
       
        formData: formData
      };
      
      request(options, function (error, response) {
        if (error) {  
          commonErrors['errorTitle'] = 'moveFile';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+formData;
          warningMessage(commonErrors,error);
          resolve(false)
        }
      
    console.log("move",response.body);
        
        resolve(response.body);

      });
    });
  } catch (error) {
      commonErrors['errorTitle'] = 'moveFile';
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+netcomId+fileName;
      warningMessage(commonErrors,error);
    fs.writeFile('assets/errorLog.txt', JSON.stringify(error), function () {
      // res.send();
      resolve('');
    });
  }
}

const getConnectionDetails = async (partyId,accountId,contactId,req) => {
  try {
    console.log(contactId);
  let dataCookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.cookies[config.EXPIRE_EXPIRES_COOKIE_NAME])));
    const partyObjectId = await connectBexio.contact_bc.findMany({
      where: {
        rk_netcomidsender: dataCookie.netcomId,
        rk_sendercontactid: contactId,
        type: 'EDI',
        rk_businessconnection: {
          not: null,
        },
      },
    });
    return partyObjectId;
  } catch (error) {
      commonErrors['errorTitle'] = getConnectionDetails.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+contactId;
      warningMessage(commonErrors,error);
    console.log(error);
    
  }
}
const deleteRedis = async (api, key) => {
  const checkAPI = JSON.parse(fs.readFileSync('./assets/iom_E76FAD2A-41E9-E211-84C9-D8D385E0B238.json'));
  let delApis = checkAPI.realated[api];
  console.log('delApis', delApis);
  console.log('data', key);

  const redis_client = await redisClient;

  try {
    delApis.split(",").forEach(async element => { // <--- make this async
      const pattern = key + element + '*';
      console.log(pattern);

      const data = await redis_client.keys(pattern); // use await instead of callback
      data.forEach(async apis => {
        await redis_client.del(apis); // also await here
      });
    });
  } catch (error) {
    console.log(error);
  }
};
async function invoiceFilePush(netcomId,service,data,filename,type) {
  let formData 
  console.log('123654');
  
  return new Promise(async(resolve, reject) => {
    formData = {
      netcom_id:netcomId,
      interface:service,
      data:data,
      filename:filename+'.xml',
      module:type
    }

    let  options = {
        'method': 'POST',
        // 'url':'http://192.168.2.63:5005/api/bexio-file-drop',
        'url':config.PYTHON_API+'bexio-file-drop',
        // 'headers': headers,
        formData: formData
      };
    request(options, function (error, response) {
      if (error) { 
        console.log('sdfdsfdsf',error);
        
        commonErrors['errorTitle'] = 'bexio-file-drop';
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+formData;
        warningMessage(commonErrors,error);
        resolve(false)
      }

      // console.log('invoiceFilePush',response.body);
      console.log('asdsadsadsad',response?.body);
      
      return resolve(response?.body)
      
      // res.send(response.body)
    });
  });
}
const getCountryLists = async (access_token)=>{
  try {
    return new Promise(async(resolve, reject) => {
      var options = {
        'method': 'GET',
        'url': `https://api.bexio.com/2.0/country`,
        'headers': {
          'Accept': 'application/json',
          'Authorization': 'Bearer '+access_token
        }
      };
      request(options, function (error, response) {
        if (error) {  
          commonErrors['errorTitle'] = 'getCountryLists';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+access_token;
          warningMessage(commonErrors,error);
          resolve(false)
        }
        if(response.statusCode==200)
        resolve(response.body);
        else
        resolve(false)

      });
    });
  } catch (error) {
    commonErrors['errorTitle'] = getCountryLists.name;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+access_token;
    warningMessage(commonErrors,error);
    fs.writeFile('assets/errorLog.txt', JSON.stringify(error), function () {
      resolve('');
    });
  }
}
const getCurrency = async (access_token,id)=>{

  return new Promise(async(resolve, reject) => {
        var options = {
          'method': 'GET',
          'url': `https://api.bexio.com/3.0/currencies/${id}`,
          'headers': {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+access_token
          }
        };
        request(options, function (error, response) {
          if (error) {  
            commonErrors['errorTitle'] = 'getCountryLists';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,',id;
            warningMessage(commonErrors,error);
            resolve(false)
          }
          // res.send(response.body)
          //console.log(response.body);
          if(response.statusCode==200)
            resolve(JSON.parse(response.body));
          else
            resolve(false)
        });
      });
}
const getloginUserCompanyDetails = async (access_token)=>{
  try{
 
     return new Promise(async(resolve, reject) => {
 
      var options = {
        'method': 'GET',
        'url': 'https://api.bexio.com/2.0/company_profile',
        'headers': {
          'Accept': 'application/json',
          'Authorization': 'Bearer '+access_token
        }
      };
      
      request(options, function (error, response) {
        if (error) {
          commonErrors['errorTitle'] = getloginUserCompanyDetails.name;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+access_token;
          warningMessage(commonErrors,error);
           resolve(false);
        }
        if(response.statusCode==200)
          return resolve(response.body)
        else
          return resolve(false)
        
      });
    });
    
  } catch (error) {
      commonErrors['errorTitle'] = getloginUserCompanyDetails.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+access_token;
      warningMessage(commonErrors,error);

    fs.writeFile('assets/errorLog.txt', JSON.stringify(error), function () {
     
      resolve('');
    });
  }
}
const getPaymentType = async (access_token,id)=>{

  return new Promise(async(resolve, reject) => {
        var options = {
          'method': 'GET',
          'url': `https://api.bexio.com/2.0/payment_type`,
          'headers': {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+access_token
          }
        };
        request(options, function (error, response) {
          if (error) {  
            commonErrors['errorTitle'] = 'getPaymentType';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+access_token;
            warningMessage(commonErrors,error);
            resolve(false)
          }
          if(response.statusCode==200)
          resolve(JSON.parse(response.body));
          else
          resolve(false)
        });
      });
}
const getContact = async (access_token,id)=>{

  return new Promise(async(resolve, reject) => {
        var options = {
          'method': 'GET',
          'url': `https://api.bexio.com/2.0/contact/${id}`,
          'headers': {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+access_token
          }
        };
        request(options, function (error, response) {
          if (error) {  
            commonErrors['errorTitle'] = 'getContact';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+id;
            warningMessage(commonErrors,error);
            resolve(false)
          }
          if(response.statusCode==200)
          resolve(JSON.parse(response.body));
          else
          resolve(false)
        });
      });
}
const getTaxs = async (access_token,id)=>{

  return new Promise(async(resolve, reject) => {
        var options = {
          'method': 'GET',
          'url': `https://api.bexio.com/3.0/taxes/${id}`,
          'headers': {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+access_token
          }
        };
        request(options, function (error, response) {
          if (error) {  
            commonErrors['errorTitle'] = 'getTaxs';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+id;
            warningMessage(commonErrors,error);
            resolve(false)
          }
          console.log(response?.body);
          
          if(response?.statusCode==200)
          resolve(JSON.parse(response?.body));
          else
          resolve(false)

        });
      });
}
const getProducts = async (access_token,id)=>{
  console.log('IDDD',id);

  return new Promise(async(resolve, reject) => {
        var options = {
          'method': 'GET',
          'url': `https://api.bexio.com/2.0/article/${id}`,
          'headers': {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+access_token
          }
        };
        request(options, function (error, response) {
          if (error) {  
            commonErrors['errorTitle'] = 'getProducts';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+id;
            warningMessage(commonErrors,error);
            resolve(false)
          }
          if(response.statusCode==200)
          resolve(JSON.parse(response.body));
          else
          resolve(false);


        });
      });
}
