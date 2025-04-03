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
@Injectable()
export class CreditorsService {
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
  
      
      const invoiceList = await connectBexio.documents_order_send.findMany({
        where: {
          companyregistered: {
            rk_party: Number(req.body?.partyId)
          }
        },
        include: {
          companyregistered: true
        }
      });


      const getNetcomId = await connectBexio.$queryRaw<any>(
        Prisma.sql`
        SELECT * FROM companyregistered WHERE rk_party = ${Number(partyId)}
      `
      );
      console.log('getNetcomId',getNetcomId);
  
    
      console.log('getNetcomId',getNetcomId[0].netcomid);
  
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




      console.log('bcDetails12121222');
     
      const bcConnectionIds = getConnectionStatusList[0]?.bcConnection || [];
                  let bcDetails;
                  bcDetails = await getBcDetails(bcConnectionIds, getNetcomId[0].netcomid);
                  console.log('bcDetails',bcDetails);
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
    console.log('getConnectionBc',getConnectionBc);
    let resultArray  = getConnectionBc[0]?.array_agg;
    console.log('resultArray',resultArray);
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
          console.log('searchJsonsearchJson',searchJson.length);
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
            return res.status(200).json({
              status: false,
              message: 'something_went_wrong',
              error: JSON.stringify(error)
          });
          }
          let resData = JSON.parse(response.body);
          console.log('*********',response.body);
          
          if(response.statusCode != 200)
          return res.status(200).json({
            status: true,
            status_code : response.statusCode,
            data: ['test'],
            message: 'unauthorized',
          });
          //'url': `${config.BEXIO_API}2.0/kb_invoice?order_by=updated_at_desc`,
          let status = JSON.parse(config.BEXIO_PURCHASE_ORDER_STATUS);
          let contact_idList:any = [];
          let order:any;
          for (let invoice in resData) {
            tempStatus = false;
            resData[invoice]['allowSend'] = resultArray ? ( resultArray.includes((resData[invoice].contact_id).toString()) ? true : false ) : false;
            contact_idList.push((resData[invoice].contact_id));
            console.log('resData[invoice].id',resData[invoice].id);
            
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
                  resData[invoice]['rk_globaltransaction'] = invoiceList[qryInvoice]['rk_globaltransaction'];
                  resData[invoice]['status'] = invoiceList[qryInvoice]['status'];
                  resData[invoice]['statusLabelInvoice'] = JSON.parse(config.INVOICE_STATUS||'')[invoiceList[qryInvoice]['status']||''];
                  resData[invoice]['timestamp'] = invoiceList[qryInvoice]['timestamp'];
                  resData[invoice]['type'] = invoiceList[qryInvoice]['type'];
                  if(invoiceList[qryInvoice]['status'] == 2)
                  {
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
          // await redisClient.setex(redisKey,24*60*60*2,JSON.stringify({
          //   status: 200,
          //   data:resData,
          //   totalCount:totalCount
          // } ));
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
      .status(200)
      .json({ status: 500, message: 'something_went_wrong' });
        
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