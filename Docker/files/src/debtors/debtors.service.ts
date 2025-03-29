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
const redisClient = require('../common/utils/redisDB');
import commonErrors from '../common/utils/commonError'
import warningMessage from '../common/utils/warningMessage'
const path = require('path')
@Injectable()
export class DebtorsService {
//   async getInvoice(req: Request ): Promise<any> {
//     //console.log(('getNetcomIdQry');
//   }
//   async getInvoice(req: Request, res: Response, ): Promise<any> {
//     //console.log(('getNetcomIdQry');
//     let cookie = null
//     let data = req.body
//     //console.log(('req.body',req.body);
    
//     let partyId = req.body.partyId;

//     try {
//       // let cookieData = req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME];
  
//       // if (!cookieData) {
//       //   res.status(500).send({
//       //     status_code: 500,
//       //     message: 'Missing_cookie',
//       //     status: false,
//       //   })
//       // }
      
//       // let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(cookieData)));
//       // let accessToken = cookie.access_Token;
//       // let isBexioUser = cookie.isBexioUser;
//       let accessToken ='eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJkVTNTYXFLOHF1c25rakl4WEFsbE1EZk0zakRLYkJneDd3dlVVMHBsaUhFIn0.eyJleHAiOjE3NDMwNzk4OTIsImlhdCI6MTc0MzA3NjI5MiwianRpIjoiNTcxNjM2N2UtZTkxZS00NjdjLWE2NDQtMTg1ZGUzZGE2Yjc0IiwiaXNzIjoiaHR0cHM6Ly9hdXRoLmJleGlvLmNvbS9yZWFsbXMvYmV4aW8iLCJzdWIiOiJlYjE5MDBlMS03YzM3LTRhMzYtYjg5NS03NTViZWE3ZTcyYmEiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiI0ODJkNjQzMC02MmZiLTRhNDItYjkwMC03NTgzODUxZGJkZjYiLCJzaWQiOiI4ZTRjNWZiZi02MjMyLTRiOTUtODFiYi0zNjAwM2MzYmNiMjkiLCJzY29wZSI6Im9wZW5pZCBrYl9pbnZvaWNlX2VkaXQgb2ZmbGluZV9hY2Nlc3Mga2JfZGVsaXZlcnlfc2hvdyBrYl9vcmRlcl9zaG93IGtiX2FydGljbGVfb3JkZXJfc2hvdyBmaWxlIGFydGljbGVfc2hvdyBjb21wYW55X3Byb2ZpbGUgZW1haWwga2Jfb3JkZXJfZWRpdCBrYl9pbnZvaWNlX3Nob3cgY29udGFjdF9lZGl0IGtiX29mZmVyX3Nob3cgcHJvZmlsZSBjb250YWN0X3Nob3ciLCJsb2dpbl9pZCI6ImViMTkwMGUxLTdjMzctNGEzNi1iODk1LTc1NWJlYTdlNzJiYSIsImNvbXBhbnlfaWQiOiJjM2p6ang3bHpxNDYiLCJ1c2VyX2lkIjozMTU3MTEsImNvbXBhbnlfdXNlcl9pZCI6Nn0.CKIukEVH0Q_L2wgrCAYDDnX0wEyVyB7jMJpyOclW4csgBVErs6ZmK8lwbyGoZUcmDerz3O22nXxKn9zLd2uGJGq04khWAsnbyCJAOGnzdaOViG95eC-6xaA_cNAWHNRGj2TkGz65FsxhhA_-X7sDQZI29tgr9CQo_c3lVVtHH9zaPycpNeQenovExmQM2j-vDGhGpckES4N5sGhM4X8_4qI19P3oQePqFdMpztcKHol1GiWT47FoOY0Q55AzWoHL8p7MN4ugv_VR_O_Jt5pSZa3GoIIsnVZLVJ0lD1lGbktcg_v4YF1yHtJH_ZjlSqOtTG1cHqojC5o8vtwN-ie_CA'
//       let isBexioUser = true
//       let resultData: any[] = [],tempStatus = false;
//       let totalCount;
//       let sortColumn = 'updated_at';
//       let sortType = 'asc';
  
//       let showFrom = req.body.records_per_page * (req.body.page_number-1);
//       let showTo = req.body.records_per_page;
//       sortColumn = req.body?.sortColumn;
//       sortType = req.body?.sort;
  
//       const invoiceList = await connectBexio.documents_invoice_send.findMany({
//         where: {
//           invoice_type: 'EDI',
//           companyregistered: {
//             rk_party:  Number(req.body?.partyId)
//           }
//         },
//         include: {
//           companyregistered: true // Fetch related companyregistered data
//         }
//       });
      
//       //console.log(('invoiceList',invoiceList);

//       const getNetcomId = await connectBexio.$queryRaw<any>(
//         Prisma.sql`
//           SELECT * FROM companyregistered WHERE rk_party = ${Number(partyId)}
//         `
//       );

//       // //console.log(('partyId',partyId);
  
//       // //console.log(('getNetcomIdQry',getNetcomId);
//       // //console.log(('getNetcomId',getNetcomId[0].netcomid);
  
//       // NEW
//       const getInviteCompanyId = await connectLibrary.$queryRaw<{ cid: number[] }[]>(
//         Prisma.sql`
//           SELECT array_agg(pa.cid) AS cid 
//           FROM party_account pa 
//           WHERE pa.fk_party = ${Number(partyId)}
//         `
//       );
      
//       const invitedCids = getInviteCompanyId[0]?.cid || []; // Extract CIDs safely
      
    
//     // //console.log(('getInviteCompanyId.rows[0].cid',getInviteCompanyId[0].cid);


    
//     const getConnectionStatusList = await connectBexio.$queryRaw<{ bcConnection: string[] }[]>(
//       Prisma.sql`
//         SELECT array_agg(rk_businessconnection) AS bcConnection
//         FROM contact_bc cb
//         WHERE cb.rk_party_account = ANY(${Prisma.sql`ARRAY[${Prisma.join(getInviteCompanyId[0]?.cid || [])}]`})
//         AND cb.type = 'EDI'
//         AND cb.rk_businessconnection IS NOT NULL
//       `
//     );
    
// const bcConnectionIds = getConnectionStatusList[0]?.bcConnection || [];
//      // //console.log(('bcDetails12121222');
//       let bcDetails;
//       bcDetails = await this.getBcDetails(bcConnectionIds,getNetcomId[0].netcomid);
  
//    //   //console.log(('bcDetails12121222',bcDetails['data']);
//       let tempBc = [0];
//       if (bcDetails?.data?.length) {
//         for (const element of bcDetails.data) {
//           if (element?.company_details?.doc_type?.data === 'Invoice') {
//             tempBc.push(element.bc_id);
//           }
//         }
//       }
      
   
//      // //console.log(('tempBc',tempBc);
      
     


//      const getConnectionBc = await connectBexio.$queryRaw<{ array_agg: string[] }[]>(Prisma.sql`
//      SELECT array_agg(rk_sendercontactid) 
//      FROM contact_bc cb
//      WHERE cb.rk_party_account = ANY(ARRAY[${Prisma.join(getInviteCompanyId[0]?.cid || [])}])
//      AND cb.type = 'EDI'
//      ${tempBc.length ? Prisma.sql`AND cb.rk_businessconnection = ANY(ARRAY[${Prisma.join(tempBc)}])` : Prisma.empty}
//      AND cb.rk_businessconnection IS NOT NULL
//    `);
   

//     //  //console.log(('getConnectionBc',getConnectionBc);
     
//       let resultArray = getConnectionBc[0]?.array_agg;
//       if(isBexioUser)
//       {
      
//         let options;
     
//         console.log('************************************');
//         if(data['documentNo'] != '' || data['invoiceTitle'] != '' || data['dateFrom'] != '' || data['dateTo'] != '' || data['comapnyUser'] != '' || data['invoiceStatus'] == 'Yes' || data['invoiceStatus'] == 'No')
//         {
          
//           const getSendInvoiceList = await connectBexio.$queryRaw<{ invoiceid: string[] }[]>(Prisma.sql`
//           SELECT array_agg(ds.rk_invoice) AS invoiceId 
//           FROM documents_invoice_send ds
//           INNER JOIN companyregistered c ON c.cid = ds.fk_companyregistered
//           WHERE c.rk_party = CAST(${partyId} AS INTEGER)  
//           AND ds.status = 2
//           AND ds.invoice_type = 'EDI'
//         `);

//        //   //console.log(("getSendInvoiceQry",getSendInvoiceList[0].invoiceid);
  
//           let searchJson: any[] = [];

//           if (data['documentNo'] !== '' && data['documentNo']) {
//             searchJson.push({
//               "field": "document_nr",
//               "value": data.documentNo,
//               "criteria": "like"
//             });
//           }
//           if(data['documentNo'] != '' && data['documentNo']){
//             searchJson.push({
//               "field":"document_nr",
//               "value": data.documentNo,
//               "criteria":"like"
//             })
//           }
//           if(data['invoiceTitle'] != '' && data['invoiceTitle']){
//             searchJson.push({
//               "field":"title",
//               "value":data.invoiceTitle,
//               "criteria":"like"
//             })
//           }
         
//           if( data['dateFrom'] != "" && data['dateFrom']){
//             searchJson.push({
//               "field":"is_valid_from",
//               "value" :new Date(data.dateFrom),
//               "criteria":">="
//             })
//           }
//           if( data['dateTo'] != "" && data['dateTo']){
//             searchJson.push({
//               "field":"is_valid_from",
//               "value":new Date(data.dateTo),
//               "criteria":"<="
//             })
//           }
//           if(data['comapnyUser'] != '' && data['comapnyUser']){
  
  
//             searchJson.push({
//               "field":"user_id",
//               "value":data.comapnyUser,
//               "criteria":"="
//             })
//           }
//           if(data['invoiceStatus'] == 'Yes'){
  
//             //console.log(('typeof',resultArray==null);
            
//             searchJson.push({
//               "field":"contact_id",
//               "value":resultArray==null ? "" : resultArray,
//               "criteria":"in"
//             },
//             {
//               "field":"id",
//               "value":getSendInvoiceList[0].invoiceid ? getSendInvoiceList[0].invoiceid : "",
//               "criteria":"in"
//             })
//           }
//           if(data['invoiceStatus'] == 'No'){
            
//             searchJson.push({
//               "field":"contact_id",
//               "value":resultArray==null ? "" : resultArray,
//               "criteria":"in"
//             },
//             {
//               "field":"id",
//               "value":getSendInvoiceList[0].invoiceid ? getSendInvoiceList[0].invoiceid : "",
//               "criteria":"not_in"
//             })
//           }
//          // //console.log(('searchJsonsearchJson',searchJson.length);
//           if(searchJson.length != 0)
//           {
//             totalCount = await invoiceCountSearch(accessToken,searchJson,0,2000)
//             options = {
//               'method': 'POST',
//               'url': `${config.BEXIO_API}2.0/kb_invoice/search/?limit=${showTo}&offset=${showFrom}&order_by=${sortColumn}_${sortType}`,
             
//               'headers': {
//                 'Accept': 'application/json',
//                 'Authorization': 'Bearer '+accessToken
//               },
//               body: JSON.stringify(searchJson)
//             };
//           }else{
//             totalCount = await this.invoiceListCountSearch(accessToken,0,2000);
            
            
//             options = {
              
//               'method': 'GET',
//               // 'url': `${config.BEXIO_API}2.0/kb_invoice`,
//               'url': `${config.BEXIO_API}2.0/kb_invoice/?limit=${showTo}&offset=${showFrom}&order_by=${sortColumn}_${sortType}`,
//               'headers': {
//                 'Accept': 'application/json',
//                 'Authorization': 'Bearer '+accessToken
//               }
    
//             }; 
//           }
        
//           // //console.log(('totalCount',options);
//           // //console.log(('totalCount',totalCount);
        
//           // totalCount = await  contactListCountSearch(accessToken,0,2000);
  
//         }
//         else{
//           totalCount = await this.invoiceListCountSearch(accessToken,0,2000);
//           console.log('totalCount',totalCount);
//           options = {
//             'method': 'GET',
//             // 'url': `${config.BEXIO_API}2.0/kb_invoice`,
//             'url': `${config.BEXIO_API}2.0/kb_invoice/?limit=${showTo}&offset=${showFrom}&order_by=${sortColumn}_${sortType}`,
//             'headers': {
//               'Accept': 'application/json',
//               'Authorization': 'Bearer '+accessToken
//             }
  
//           }; 
//         }  
//         request(options, async function (error, response) {
//           if (error) {
//             commonErrors['errorTitle'] = req.originalUrl;
//             commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+showTo+' '+showFrom;
//             warningMessage(commonErrors,error);
//             return res.status(200).json({
//               status: false,
//               message: 'something_went_wrong',
//               error: JSON.stringify(error)
//           });
//           }
//           let resData = JSON.parse(response.body);
          
//           if(response.statusCode != 200)
//           return res.status(200).json({
//             status: true,
//             status_code : response.statusCode,
//             data: [],
//             message: 'unauthorized',
//           });
//           //'url': `${config.BEXIO_API}2.0/kb_invoice?order_by=updated_at_desc`,
//           let status = JSON.parse(config.BEXIO_INVOICE_STATUS||'');
//           let contact_idList: any[] = [];
//           for (let invoice in resData) {
//             tempStatus = false;
//             resultArray?resData[invoice]['allowSend'] = resultArray.includes((resData[invoice].contact_id).toString()) ? true:false:false;
//             console.log('****************',resData[invoice].contact_id);
//             contact_idList.push((resData[invoice].contact_id));
//             resData[invoice]['statusLabel'] = status[resData[invoice].kb_item_status_id];
//             resData[invoice]['timestamp'] = '';
//             //resData[invoice]['companyName'] = resData[invoice]['contact_address'].split("\n")[0];
//             resData[invoice]['rk_globaltransaction'] = '';
//             resData[invoice]['status'] = '';
//             resData[invoice]['statusLabelInvoice'] = '';        
//             for (let qryInvoice of invoiceList) {
//               if (qryInvoice['rk_invoice'] === resData[invoice]['id']) {
//                   resData[invoice]['rk_globaltransaction'] = qryInvoice['rk_globaltransaction'];
//                   resData[invoice]['status'] = qryInvoice['status'];
//                   const invoiceStatusMap = JSON.parse(config.INVOICE_STATUS || '{}');
//                   const statusKey = qryInvoice['status'] ?? ''; 
//                   resData[invoice]['statusLabelInvoice'] = invoiceStatusMap[statusKey] || '';

//                   resData[invoice]['timestamp'] = qryInvoice['timestamp'];
//                   resData[invoice]['type'] = qryInvoice['type'];
//                   resData[invoice]['response'] = qryInvoice['response']; // Added response from documents_invoice_send to show the error message in the front end.
          
//                   if (qryInvoice['status'] === 2) {
//                       resData[invoice]['allowSend'] = false;
//                   }
//                   if (!tempStatus && qryInvoice['type'] === 'EBILL') {
//                       tempStatus = true;
//                   }
//                   break; // Exit the loop once a match is found
//               }
//           }
          
//             if(!tempStatus){
//               // //console.log(('12332145',resData[invoice]);
              
//               resData[invoice]['isEbill'] = false;
//             }else{
//               resData[invoice]['isEbill'] = true;
//               resData[invoice]['allowSend'] = false;
  
//             }    
//             resultData.push(resData[invoice]);
//           }
//           let contactList:any = [];
//           // Search contact list from bexio to get name_1 and name_2
//           console.log("tyu", typeof contact_idList)
//           console.log("contact_idList", contact_idList)
//           contactList = await getContactById(accessToken,contact_idList);
//           // Loop to add name_1 and name_2  from contact list to the resultData as companyName.
//           let contactNameList = {};
//           if(!contactList)
//           {
//             res.send({
//               status: 500,
//               data:[]
//             });
//             return
//           }
       
//           contactList.forEach(element => {         
//             let name_1 = element.name_1 ? element.name_1 : '';
//             let name_2 = element.name_2 && element.name_2.length ? element.name_2 : '';
//             contactNameList[element.id] = name_1 + (name_2 ? ' ' + name_2 : '');
//           });
//           let currencyList = {};
//           let currency: any = [];
//           // Get all currency from bexio to map the currency_id in every invoice.
//           currency = await getAllCurrency(accessToken);
//           currency.forEach(element => {
//             currencyList[element.id] = element.name;
//           });
//           resultData.forEach((second) => {
//             second.companyName = contactNameList[second["contact_id"]];
//             second.currency = currencyList[second['currency_id']];
//           });
//           let keys = Object.keys(req.body)
//           // let redisKey = req.url+"_"+req.body.partyId+"_";
//           let redisKey = req.body.partyId+"_"+req.url+"_";
//           // //console.log(('redisKey',redisKey);
//           keys.forEach(element => {
//               redisKey = req.body[element]? redisKey +element+':'+ req.body[element] + '_' : redisKey
//           });
//           await redisClient.setex(redisKey,24*60*60*2,JSON.stringify({
//             status: 200,
//             data:resData,
//             totalCount:totalCount
//           } ));
          
//           res.send({
//             status: 200,
//             data:resultData,
//             totalCount:totalCount
//           })
//         });
//       }
//       else{
//         return res.status(401).json({
//           status: 'fail',
//           message: 'unauthorized',
//         });
//       }
//     } catch (error) {
    
      
//       //console.log((error);
//       commonErrors['errorTitle'] = req.originalUrl;
//       commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+cookie;
//       warningMessage(commonErrors,error);
//       return res
//       .status(200)
//       .json({ status: 500, message: 'something_went_wrong' });
        
//     }
//   }
//     async getBcDetails(bc_id,netcomId ): Promise<any> {
   
//     try{
     
//       // //console.log(('654');
//       // //console.log(('bc_id:: ',bc_id);
//       // //console.log(('netcomId:: ',netcomId);
      
     
//       return new Promise(async(resolve, reject) => {
//         if(bc_id){
//           let formData = {
//             bc : bc_id.toString(),
//             netcom_id : netcomId
//           } 
//           // //console.log(('formData',formData);
          
//           let  options = {
//             'method': 'POST',
//             'url': config.PYTHON_API+'get-contact-bc',
//             // 'url': 'http://192.168.2.166:5005/api/'+'get-contact-bc',
  
//             formData: formData
//           };
  
//           request(options, async function (error, response, body) {
//             if (error) {  
//               commonErrors['errorTitle'] = 'getBcDetails';
//               warningMessage(commonErrors,error);
//               resolve(false)
//             }else{
//               // //console.log(('1111111111');
              
//               resolve(JSON.parse(response.body));
//             }
            
          
//           });
//         }else{
//           resolve(false)
//         }
         
//         });
//     } catch (error) {
//         commonErrors['errorTitle'] = 'getCountryLists';
//         commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+'access_token';
//         warningMessage(commonErrors,error);
//         // fs.writeFile('assets/errorLog.txt', JSON.stringify(error), function () {
//         //   // res.send();
//         //   resolve('');
//         // });
//       }
//   }

  





//   async getEbillInvoice(req: Request, res: Response, ): Promise<any> {
//   let cookie = null
//   // let encrToken = encryptionControl.decrypt(req.body.encrToken);
//   let encrToken = req.body;

//   let netcomId = encrToken.netcomId;
//   let data = encrToken;

//   try {
  
//     let cookieData = req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME];
  
//       if (!cookieData) {
//         res.status(500).send({
//           status_code: 500,
//           message: 'Missing_cookie',
//           status: false,
//         })
//       }
      
//       let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(cookieData)));
//       let accessToken = cookie.access_Token;
//       let isBexioUser = cookie.isBexioUser;



//       let resultData: any[] = [],tempStatus = false;
//     let totalCount;
//     let sortColumn = 'updated_at';
//     let sortType = 'asc';

  
//     let showFrom = req.body.records_per_page * (req.body.page_number-1);
//     let showTo = req.body.records_per_page;
//     sortColumn = req.body?.sortColumn;
//     sortType = req.body?.sort;

   

//     const invoiceList = await connectBexio.documents_invoice_send.findMany({
//       where: {
//         invoice_type: 'EBILL',
//         companyregistered: {
//           netcomid: netcomId
//         }
//       },
//       include: {
//         companyregistered: true // Include related companyregistered data
//       }
//     });
    
//     let tempBc = [0];
    
  
   
//     const getContactBcQryReslt = await connectBexio.$queryRaw<any>(
//       Prisma.sql`
//         SELECT array_agg(rk_contact) 
//         FROM contact_bc c 
//         INNER JOIN companyregistered cr 
//         ON cr.cid = c.fk_companyregistered
//         WHERE c.type = 'EBILL' 
//         AND cr.netcomid = ${netcomId}
//       `
//     );
    
   
//       let contactArray = getContactBcQryReslt[0].array_agg;

    
    
//     if(isBexioUser)
//     {
    
//       let options;
 

//     const getSendInvoiceList = await connectBexio.$queryRaw<{ invoiceid: string[] }[]>(
//       Prisma.sql`
//       SELECT array_agg(rk_invoice) AS invoiceId
//       FROM documents_invoice_send ds
//       INNER JOIN companyregistered c ON c.cid = ds.fk_companyregistered
//       WHERE c.netcomid = ${netcomId}
//       AND ds.invoicetype = 'EBILL'
//       ${data.shippingStatus ? Prisma.sql`AND ds.status = ${data.shippingStatus}` : Prisma.empty}
//       `
//     );

//         let searchJson: any[] = [];
         
//         if(data['documentNo'] != '' && data['documentNo']){
//           searchJson.push({
//             "field":"document_nr",
//             "value": data.documentNo,
//             "criteria":"like"
//           })
//         }
//         if(data['invoiceTitle'] != '' && data['invoiceTitle']){
//           searchJson.push({
//             "field":"title",
//             "value":data.invoiceTitle,
//             "criteria":"like"
//           })
//         }
       
//         if( data['dateFrom'] != "" && data['dateFrom']){
//           searchJson.push({
//             "field":"is_valid_from",
//             "value" :new Date(data.dateFrom),
//             "criteria":">="
//           })
//         }
//         if( data['dateTo'] != "" && data['dateTo']){
//           searchJson.push({
//             "field":"is_valid_from",
//             "value":new Date(data.dateTo),
//             "criteria":"<="
//           })
//         }
//         if(data['comapnyUser'] != '' && data['comapnyUser']){


//           searchJson.push({
//             "field":"user_id",
//             "value":data.comapnyUser,
//             "criteria":"="
//           })
//         }
//         if(data['invoiceStatus'] == 'Yes'){

         
//           searchJson.push(
         
//           {
//             "field":"id",
//             "value":getSendInvoiceList[0].invoiceid ? getSendInvoiceList[0].invoiceid : "",
//             "criteria":"in"
//           })
//         }
      
        
//         if(data['invoiceStatus'] == 'No'){
          
//           searchJson.push(
        
//           {
//             "field":"id",
//             "value":getSendInvoiceList[0].invoiceid ? getSendInvoiceList[0].invoiceid : "",
//             "criteria":"not_in"
//           })
//         }
      
//         if(data['shippingStatus'] != ''){
          
//           searchJson.push(
//           {
//             "field":"id",
//             "value":getSendInvoiceList[0].invoiceid ? getSendInvoiceList[0].invoiceid : "",
//             "criteria":"in"
//           })
//         }
       
//         if(req.body.contactId != ''){
//           contactArray = [];
//           contactArray.push(req.body.contactId);
//           searchJson.push({
//             "field":"contact_id",
//             "value":contactArray,
//             "criteria":"in"
//           })
//         }else{
//           searchJson.push({
//             "field":"contact_id",
//             "value":contactArray,
//             "criteria":"in"
//           })
//         }
       
      
//           totalCount = await this.invoiceCountSearch(accessToken,searchJson,0,2000)
//           options = {
//             'method': 'POST',
//             'url': `${config.BEXIO_API}2.0/kb_invoice/search/?limit=${showTo}&offset=${showFrom}&order_by=${sortColumn}_${sortType}`,
//             // 'url': `${config.BEXIO_API}2.0/kb_invoice/search`,
           
//             'headers': {
//               'Accept': 'application/json',
//               'Authorization': 'Bearer '+accessToken
//             },
//             body: JSON.stringify(searchJson)
//           };
//           //console.log(('options1111',options);
          
       
//         //   totalCount = await invoiceListCountSearch(accessToken,0,2000);
//         //   options = {
            
//         //     'method': 'GET',
//         //     // 'url': `${config.BEXIO_API}2.0/kb_invoice`,
//         //     'url': `${config.BEXIO_API}2.0/kb_invoice/?limit=${showTo}&offset=${showFrom}&order_by=${sortColumn}_${sortType}`,
//         //     'headers': {
//         //       'Accept': 'application/json',
//         //       'Authorization': 'Bearer '+accessToken
//         //     }
  
//         //   }; 
//         // }
      
//         // //console.log(('totalCount',options);
//         // //console.log(('totalCount',totalCount);
      
//         // totalCount = await  contactListCountSearch(accessToken,0,2000);

//       // }
//       // else{
//       //   totalCount = await invoiceListCountSearch(accessToken,0,2000);
//       //   options = {
//       //     'method': 'GET',
//       //     // 'url': `${config.BEXIO_API}2.0/kb_invoice`,
//       //     'url': `${config.BEXIO_API}2.0/kb_invoice/?limit=${showTo}&offset=${showFrom}&order_by=${sortColumn}_${sortType}`,
//       //     'headers': {
//       //       'Accept': 'application/json',
//       //       'Authorization': 'Bearer '+accessToken
//       //     }

//       //   }; 
//       // }  
//       request(options, async function (error, response) {
//         if (error) {
//           commonErrors['errorTitle'] = req.originalUrl;
//           commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+showTo+' '+showFrom;
//           warningMessage(commonErrors,error);
//           return res.status(200).json({
//             status: false,
//             message: 'something_went_wrong',
//             error: JSON.stringify(error)
//         });
//         }
//         let resData = JSON.parse(response.body);
//         if(response.statusCode != 200)
//         return res.status(200).json({
//           status: true,
//           status_code : response.statusCode,
//           data: [],
//           message: 'unauthorized',
//         });
     
//         let status = JSON.parse(config.BEXIO_INVOICE_STATUS||'');
//         let contact_idList:any = [];
//         for (let invoice in resData) {
//           tempStatus = false;
//           // resultArray?resData[invoice]['allowSend'] = resultArray.includes((resData[invoice].contact_id).toString()) ? true:false:false;
//           resData[invoice]['allowSend'] = "true";
//           contact_idList.push((resData[invoice].contact_id));
//           resData[invoice]['statusLabel'] = status[resData[invoice].kb_item_status_id];
//           resData[invoice]['timestamp'] = '';
//           //resData[invoice]['companyName'] = resData[invoice]['contact_address'].split("\n")[0];
//           resData[invoice]['rk_globaltransaction'] = '';
//           resData[invoice]['status'] = '';
//           resData[invoice]['statusLabelInvoice'] = '';     
          
//           // //console.log(('invoiceList.rows',invoiceList.rows);
          
//           for (let qryInvoice of invoiceList) {  // Correct loop
//             if (qryInvoice.rk_invoice === resData[invoice].id) {  // Correct object access
             
//               resData[invoice]['rk_globaltransaction'] = qryInvoice['rk_globaltransaction'];
//                 resData[invoice]['status'] = qryInvoice['status']
//               const invoiceStatusMap = JSON.parse(config.INVOICE_STATUS || '{}');
//               const statusKey = qryInvoice['status'] ?? ''; 
//               resData[invoice]['statusLabelInvoice'] = invoiceStatusMap[statusKey] || '';
              
//               resData[invoice]['timestamp'] = qryInvoice['timestamp'];
//               resData[invoice]['type'] = qryInvoice['type'];
//               resData[invoice]['response'] = qryInvoice['response'];
//               resData[invoice]['allowSend'] = qryInvoice.status !== 2; // Simplified condition
          
//               if (!tempStatus && qryInvoice['type'] === 'EBILL') {
//                 tempStatus = true;
//               }
//               break;  // Stop iteration after finding a match
//             }
//           }

//           if(!tempStatus){
//             resData[invoice]['isEbill'] = true;
//           }else{
//             resData[invoice]['isEbill'] = false;
//             resData[invoice]['allowSend'] = false;

//           }        
//           resultData.push(resData[invoice]);
//         }
//         let contactList:any = [];
//         // Search contact list from bexio to get name_1 and name_2
//         contactList = await this.getContactById(accessToken,contact_idList);
//         // Loop to add name_1 and name_2  from contact list to the resultData as companyName.
//         let contactNameList = {};
//         if(!contactList)
//         {
//           res.send({
//             status: 500,
//             data:[]
//           });
//           return
//         }
     
//         contactList.forEach(element => {         
//           let name_1 = element.name_1 ? element.name_1 : '';
//           let name_2 = element.name_2 && element.name_2.length ? element.name_2 : '';
//           contactNameList[element.id] = name_1 + (name_2 ? ' ' + name_2 : '');
//         });
//         let currencyList = {};
//         let currency: any = [];
//         // Get all currency from bexio to map the currency_id in every invoice.
//         currency = await this.getAllCurrency(accessToken);
//         if(currency)
//         {
//           currency?.forEach(element => {
//             currencyList[element.id] = element.name;
//           });
//         }
      
//         resultData?.forEach((second) => {
//           second.companyName = contactNameList[second["contact_id"]];
//           second.currency = currencyList[second['currency_id']];
//         });
//         let keys = Object.keys(req.body)
//         // let redisKey = req.url+"_"+req.body.partyId+"_";
//         let redisKey = req.body.netcomid+"_"+req.url+"_";
//         // //console.log(('redisKey',redisKey);
//         keys.forEach(element => {
//             redisKey = req.body[element]? redisKey +element+':'+ req.body[element] + '_' : redisKey
//         });
//         await redisClient.setex(redisKey,24*60*60*2,JSON.stringify({
//           status: 200,
//           data:resData,
//           totalCount:totalCount
//         } ));
        
//         res.send({
//           status: 200,
//           data:resultData,
//           totalCount:totalCount
//         })
//       });
//     }
//     else{
//       return res.status(401).json({
//         status: 'fail',
//         message: 'unauthorized',
//       });
//     }
//   } catch (error) {
  
//     commonErrors['errorTitle'] = req.originalUrl;
//     commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+cookie;
//     warningMessage(commonErrors,error);
//     return res
//     .status(200)
//     .json({ status: 500, message: 'something_went_wrong' });
      
//   }
// }  
  async getInvoice(req: Request, res: Response,): Promise<any> {

  
    let cookie = null
    let data = req.body
  

    let partyId = req.body.partyId;
    let netcomId = req.body.netcomId;
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
  // let accessToken='eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJkVTNTYXFLOHF1c25rakl4WEFsbE1EZk0zakRLYkJneDd3dlVVMHBsaUhFIn0.eyJleHAiOjE3NDMyMzMzNTcsImlhdCI6MTc0MzIyOTc1NywianRpIjoiZjg2OGI3YTYtZDYwZS00OTJiLTlmM2YtYmU3ZDM4ZmM2ODA2IiwiaXNzIjoiaHR0cHM6Ly9hdXRoLmJleGlvLmNvbS9yZWFsbXMvYmV4aW8iLCJzdWIiOiJlYjE5MDBlMS03YzM3LTRhMzYtYjg5NS03NTViZWE3ZTcyYmEiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiI0ODJkNjQzMC02MmZiLTRhNDItYjkwMC03NTgzODUxZGJkZjYiLCJzaWQiOiIxNmExYmIwOC1lMjgwLTQyZjgtYTVjOC01ZmQ3Njk4YmFjOWQiLCJzY29wZSI6Im9wZW5pZCBrYl9pbnZvaWNlX2VkaXQgb2ZmbGluZV9hY2Nlc3Mga2JfZGVsaXZlcnlfc2hvdyBrYl9vcmRlcl9zaG93IGtiX2FydGljbGVfb3JkZXJfc2hvdyBmaWxlIGFydGljbGVfc2hvdyBjb21wYW55X3Byb2ZpbGUgZW1haWwga2Jfb3JkZXJfZWRpdCBrYl9pbnZvaWNlX3Nob3cgY29udGFjdF9lZGl0IGtiX29mZmVyX3Nob3cgcHJvZmlsZSBjb250YWN0X3Nob3ciLCJsb2dpbl9pZCI6ImViMTkwMGUxLTdjMzctNGEzNi1iODk1LTc1NWJlYTdlNzJiYSIsImNvbXBhbnlfaWQiOiJjM2p6ang3bHpxNDYiLCJ1c2VyX2lkIjozMTU3MTEsImNvbXBhbnlfdXNlcl9pZCI6Nn0.WKxEXhNgZLuV8429jABhpYdk0KcQTWSBQXKRJVK0-tcSNGltdLU7BMbxyj5ynAxCLe3Xc-PVesqAWcBeMw7ZJhryHen6TZu7q-LSNRqmfoQlo1W2F0y-XdWHLL8Imnc0IAp0iHt__8gHQ33G8fUI_TWjCEyV1A_30kqH1_8m2VhvdBNGv7pin_a9qCJjdzh7KFhCEYGGhp4NFd40zFioGYiLBBpzUH89i5LAbW1H3mwzhw0vCqu3s1XbB3hFEIWvxFm7PGDY5sw9yHvaWREtVb7BWM7oF-DbyzGMcTL_-_D0OCTRck5G9vb1GV9CyEwxdP5KB53yKnO9ZiDVgTdNxA'
  // let isBexioUser = true 
  let resultData: any[] = [], tempStatus = false;
      let totalCount;
      let sortColumn = 'updated_at';
      let sortType = 'asc';

      let showFrom = req.body.records_per_page * (req.body.page_number - 1);
      let showTo = req.body.records_per_page;
      sortColumn = req.body?.sortColumn;
      sortType = req.body?.sort;
      let resultArray
      let contactArray
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
        console.log('*************************1');
        
                  const getNetcomId = await connectBexio.$queryRaw<any>(
                    Prisma.sql`
                    SELECT * FROM companyregistered WHERE rk_party = ${Number(partyId)}
                  `
                  );
                  console.log('getNetcomId',getNetcomId);
                  
                  const getInviteCompanyId = await connectLibrary.$queryRaw<{ cid: number[] }[]>(
                    Prisma.sql`
                    SELECT array_agg(pa.cid) AS cid 
                    FROM party_account pa 
                    WHERE pa.fk_party = ${Number(partyId)}
                  `
                  );
                  console.log('getInviteCompanyId',getNetcomId[0].netcomid);
                  const invitedCids = getInviteCompanyId[0]?.cid || [];
                  const getConnectionStatusList = await connectBexio.$queryRaw<{ bcConnection: string[] }[]>(
                    Prisma.sql`
                  SELECT array_agg(rk_businessconnection) AS "bcConnection"
                  FROM contact_bc cb
                  WHERE cb.rk_party_account = ANY(${Prisma.sql`ARRAY[${Prisma.join(getInviteCompanyId[0]?.cid || [])}]`})
                  AND cb.type = 'EDI'
                  AND cb.rk_businessconnection IS NOT NULL
                `
                  );
                  console.log('getConnectionStatusList',getConnectionStatusList);
                  console.log('getConnectionStatusList',getConnectionStatusList[0]);
                  console.log('getConnectionStatusList',getConnectionStatusList[0]?.bcConnection);
                  const bcConnectionIds = getConnectionStatusList[0]?.bcConnection || [];
                  let bcDetails;
                  bcDetails = await getBcDetails(bcConnectionIds, getNetcomId[0].netcomid);
                  console.log('bcDetails',bcDetails);
                  let tempBc = [0];
                  if (bcDetails?.data?.length) {
                    for (const element of bcDetails.data) {
                      if (element?.company_details?.doc_type?.data === 'Invoice') {
                        tempBc.push(element.bc_id);
                      }
                    }
                  }
                  const getConnectionBc = await connectBexio.$queryRaw<{ array_agg: string[] }[]>(Prisma.sql`
                    SELECT array_agg(rk_sendercontactid) 
                    FROM contact_bc cb
                    WHERE cb.rk_party_account = ANY(ARRAY[${Prisma.join(getInviteCompanyId[0]?.cid || [])}])
                    AND cb.type = 'EDI'
                    ${tempBc.length ? Prisma.sql`AND cb.rk_businessconnection = ANY(ARRAY[${Prisma.join(tempBc)}])` : Prisma.empty}
                    AND cb.rk_businessconnection IS NOT NULL
                  `);
                  console.log('getConnectionBc',getConnectionBc);
                  resultArray = getConnectionBc[0]?.array_agg;
                  console.log('resultArray',resultArray);
                  
      }
      if (ebillInvoices.length > 0) {
        console.log('*************************2');
              const getContactBcQryReslt = await connectBexio.$queryRaw<any>(
                Prisma.sql`
                  SELECT array_agg(rk_contact) 
                  FROM contact_bc c 
                  INNER JOIN companyregistered cr 
                  ON cr.cid = c.fk_companyregistered
                  WHERE c.type = 'EBILL' 
                  AND cr.netcomid = ${netcomId}
                `
              );
            contactArray = getContactBcQryReslt[0]?.array_agg || []; 
            console.log('contactArray',contactArray);
            if (req.body.contactId && req.body.contactId !== '') {
              contactArray=[];
              contactArray = [req.body.contactId];  // Overwrite with user input
            }
            
      }
      let tempBc = [0];
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
      if (searchJson.length > 0) {
        console.log('161616',searchJson);
        
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
      } else {
        // searchJson.push({
        //   "field": "contact_id",
        //   "value": contactArray,
        //   "criteria": "in"
        // });

       
       totalCount = await invoiceListCountSearch(accessToken, 0, 2000)as number;
        options = {
          'method': 'GET',
          'url': `${config.BEXIO_API}2.0/kb_invoice/?limit=${showTo}&offset=${showFrom}&order_by=${sortColumn}_${sortType}`,
          'headers': {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + accessToken
          }
        };
     
      }
      request(options, async function (error, response) {
        if (error) {
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+showTo+' '+showFrom;
          warningMessage(commonErrors,error);
          return res.status(200).json({
            status: false,
            message: 'something_went_wrong',
            error: JSON.stringify(error)
        });
        }
        let resData = JSON.parse(response.body);
        // /console.log('resData',resData);
        
        if(response.statusCode != 200)
        return res.status(200).json({
          status: true,
          status_code : response.statusCode,
          data: [],
          message: 'unauthorized',
        });
       
        let status = JSON.parse(config.BEXIO_INVOICE_STATUS||'');
        let contact_idList :any= [];
        for (let invoice in resData) {
          tempStatus = false;
          resultArray?resData[invoice]['allowSend'] = resultArray.includes((resData[invoice].contact_id).toString()) ? true:false:false;
          // resData[invoice]['allowSend'] = "true";
          contact_idList.push((resData[invoice].contact_id));
          resData[invoice]['statusLabel'] = status[resData[invoice].kb_item_status_id];
          resData[invoice]['timestamp'] = '';
          resData[invoice]['rk_globaltransaction'] = '';
          resData[invoice]['status'] = '';
          resData[invoice]['statusLabelInvoice'] = '';        
          for(let qryInvoice in invoiceList ){
              if(invoiceList[qryInvoice]['rk_invoice'] == resData[invoice]['id']){
                resData[invoice]['rk_globaltransaction'] = invoiceList[qryInvoice]['rk_globaltransaction'];
                resData[invoice]['status'] = invoiceList[qryInvoice]['status'];
                resData[invoice]['statusLabelInvoice'] = JSON.parse(config.INVOICE_STATUS||'')[invoiceList[qryInvoice]['status']||''];
                resData[invoice]['timestamp'] = invoiceList[qryInvoice]['timestamp'];
                resData[invoice]['type'] = invoiceList[qryInvoice]['type'];
                resData[invoice]['response'] = invoiceList[qryInvoice]['response']; // Added response from documents_invoice_send to show the error message in the front end.

                if (invoiceList[qryInvoice]?.status === 2)
                {
                  resData[invoice]['allowSend'] = false;
                }
                if(!tempStatus && invoiceList[qryInvoice]?.invoice_type === 'EBILL'){
                  tempStatus = true;
                }
                break;
            }
            // else
              // resultData.push(resData[invoice]);
          }
          if(!tempStatus){
            // console.log('12332145',resData[invoice]);
            
            resData[invoice]['isEbill'] = false;
          }else{
            resData[invoice]['isEbill'] = true;
            resData[invoice]['allowSend'] = false;

          }    
          resultData.push(resData[invoice]);
        }
        let contactList:any = [];
    
        contactList = await getContactById(accessToken,contact_idList);
    //  console.log('contactList',contactList);
     
        let contactNameList = {};
        let contactEmailList = {};
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
          contactEmailList[element.id] = element.mail ? element.mail : '';
        });
        let currencyList = {};
        let currency: any = [];
     
        currency = await getAllCurrency(accessToken);
        currency.forEach(element => {
          currencyList[element.id] = element.name;
        });
        
        resultData.forEach((second) => {
          second.companyName = contactNameList[second["contact_id"]];
          second.currency = currencyList[second['currency_id']];
          second.email = contactEmailList[second["contact_id"]];
        });
        // let keys = Object.keys(req.body)
    
        // let redisKey = req.body.partyId+"_"+req.url+"_";
        // console.log('redisKey',redisKey);
        // keys.forEach(element => {
        //     redisKey = req.body[element]? redisKey +element+':'+ req.body[element] + '_' : redisKey
        // });
        // await redisClient.setex(redisKey,24*60*60*2,JSON.stringify({
        //   status: 200,
        //   data:resData,
        //   totalCount:totalCount
        // } ));
        
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
    }
    catch (error) {


      //console.log((error);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + cookie;
      warningMessage(commonErrors, error);
      return res
        .status(200)
        .json({ status: 500, message: 'something_went_wrong' });

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
        //  //console.log(('11111111111111111111111111111');
         
        }else{
          offset = offset + JSON.parse(response.body).length;
          // //console.log(('lengthhh',offset);
          resolve(offset)
        }
        // //console.log((JSON.parse(response.body).length);
        
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
    // //console.log(({
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
          commonErrors['errorTitle'] = 'getCountryLists';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+'access_token';
          warningMessage(commonErrors,error);
        
        }
}