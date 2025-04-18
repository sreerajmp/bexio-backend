const encryptionControl = require("../utils/jwt-decode");
import * as request from 'request';
import config from '../config/index';
const path = require('path')
import { connectNewGate2b, connectBexio,connectLibrary } from '../../db/prisma-clients';
import { Prisma } from '@prisma/client';

const fs = require('fs')
import { resolve } from 'path';
var xml2js = require('xml2js');
import connectMssql from '../../db/mssql-client'
const crypto = require("crypto");
import redisClient from '../utils/redisDB';
import commonErrors from '../utils/commonError'
import warningMessage from '../utils/warningMessage'

export const getContactById = async (accessToken,contact_idList) => {

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
export const getAllCurrency = async (access_token) => {

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
export const getRecipientList = async (contact_idList: number[]) => {
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


export const invoiceCountSearch = async (token,search,offset,limit?) => {

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
export const invoiceListCountSearch = async (token,offset,limit?) => {

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
export const getBcDetails= async (bc_id,netcomId ) => {
   
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
export const deliveryNotesListCountSearch = async(token,offset,limit?)=>{
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

export const getTagName = async(details)=>{
    
  try {
  
     let responseData = null
  
    const data = {
      config_id: 1,
      module: 'BEX',
      file_list:JSON.parse(details)
    };
    const formData = {
      data: JSON.stringify(data) // Must stringify the entire object
    };
    
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
  'url': `${config.OCTOPUS_URL}/bexio_file_check`,
  formData: formData

};
    console.log('options',options);
    
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
            resolve(JSON.parse(response.body));   
         
          }
          catch{
            return resolve(error)
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
export const setInvoiceSendStatus = async (partyId, invoiceId, invoicenumber, status,error?) => {
  let sendInvoiceId;
  return new Promise(async function (resolve, reject) {
    let errorBody = error || '';
    try {
      const selectQryResult = await connectBexio.documents_invoice_send.findMany({
        where: {
          rk_invoice: invoiceId,
          invoice_type: 'EDI',
          companyregistered: {
            rk_party: Number(partyId),
          },
        },
        select: {
          cid: true,
          companyregistered: {
            select: {
              cid: true,
            },
          },
        },
      });
      if (selectQryResult.length == 0) {
        const companyregisteredSelectQryResult = await connectBexio.companyregistered.findMany({
          where: {
            rk_party: Number(partyId), // Equivalent to `WHERE rk_party = $1`
          }
        });
        const result = await connectBexio.documents_invoice_send.create({
          data: {
            rk_invoice: invoiceId,
            invoice_number: invoicenumber,
            fk_companyregistered: companyregisteredSelectQryResult[0].cid, // assuming you already formatted your result
            invoice_type: 'EDI',
            status: Number(status),
            response:errorBody
          },
          select: {
            cid: true,
          },
        });
        sendInvoiceId = result.cid;
      }
      else {
        sendInvoiceId = selectQryResult[0]?.cid;
         await connectBexio.documents_invoice_send.updateMany({
          where: {
            fk_companyregistered: Number(selectQryResult[0].cid),
            rk_invoice: invoiceId,
            invoice_type: 'EDI'
          },
          data: {
            time_stamp: new Date(),
            status: Number(status)
          }
        });
      }
      resolve(sendInvoiceId);
    } catch (error) {
      reject(error);
      console.log(error);
      commonErrors['errorTitle'] = setInvoiceSendStatus.name;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + partyId + '-partyId' + invoiceId + '-invoiceId' + invoicenumber + 'invoiceNumber';
      warningMessage(commonErrors, error);
      resolve('');

    }
  });

}
export const pushInvoiceBulk = async (invoices, bodyValues, headerParams) => {
  try {
    console.log("worker processing invoices...");

    let tempIds = JSON.parse(invoices);

    for (let index = 0; index < tempIds.length; index++) {
      const element = tempIds[index];
      const tempParam = {
        cookies: headerParams['cookies'],
        signedCookies: headerParams['signedCookies'],
        url: headerParams['url'],
        originalUrl: headerParams['originalUrl'],
        body: {
          partyId: bodyValues.partyId,
          accountId: bodyValues.accountId,
          invoiceId: element.invoiceId,
        },
      };

      console.log("start processing invoice", tempParam);
      try {
        const result = await pushInvoiceBulkTest(tempParam, "");
        console.log("result:", result);
      } catch (error) {
        console.error("Error processing invoice:", element.invoiceId, error);
      }
      console.log("end processing invoice");
    }
  } catch (error) {
    console.error('Error in pushInvoiceBulkxx:', error);
    throw error; // Ensure the error is thrown to be caught by the caller
  }
};

export const pushInvoiceBulkTest = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    try {
      let decryptData = req;
      if (!req || !req.signedCookies || !decryptData.body.partyId) {
        return reject('Invalid input data');
      }

      console.log("decryptData ", decryptData);
      let invoiceCid;
      try {
        let invoice,paymentType
        let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
        let accessToken = cookie.access_Token;
        const partyId = decryptData.body.partyId;
        const accountId = decryptData.body.accountId;
        const invoiceId = decryptData.body.invoiceId;
        invoice = await getInvoiceOT(accessToken,invoiceId);
        console.log('invoice::::',invoice);
        if( !invoice || !invoice.positions ){
          invoiceCid = await setInvoiceSendStatus(partyId,invoiceId,'','0','invoice_invalid');
          console.log('invoice not found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'error_pushInvoiceBulkTest -req param,',JSON.stringify(decryptData);
          warningMessage(commonErrors,'error_getInvoiceOT');
          return resolve('invoice_invalid');
        }

        let invitionData:any = await getConnectionDetails(partyId,accountId,invoice.contact_id,req);
        console.log('invitionDatainvitionDatainvitionDatainvitionData',invitionData);
      

        if( invitionData.length != 0){    

            let customerIds = await constGetContactId(invitionData[0].rk_businessconnection);
            console.log(customerIds);
            console.log('invitionData',invitionData);     
            let pdf,fileName,pdfContent;
            pdf = await getInvoicePdf(accessToken,invoiceId);
            if(!pdf){
              invoiceCid = await setInvoiceSendStatus(partyId,invoiceId,invoice['document_nr'],'0','pdf_not_found');
              commonErrors['errorTitle'] = req.originalUrl;
              commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'error_getInvoicePdf -req param,',JSON.stringify(req.body);
              warningMessage(commonErrors,'error_getInvoicePdf ');
              return resolve('pdf_not_found');
            }
            let pdf_parsed = JSON.parse(pdf);
            pdfContent = pdf_parsed.content;
            fileName = pdf_parsed.name;
            let coutryList;
            coutryList = await getCountryLists(accessToken);
            if(!coutryList){
              invoiceCid = await setInvoiceSendStatus(partyId,invoiceId,invoice['document_nr'],'0','countryList_not_found');
              console.log('coutryList');
              commonErrors['errorTitle'] = req.originalUrl;
              commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'countryList_not_found -req param,',JSON.stringify(req.body);
              warningMessage(commonErrors,'countryList_not_found');
              return resolve('country_not_found');
            }
            coutryList = JSON.parse(coutryList);
            let bank
            bank = await getBank(accessToken,invoice.bank_account_id);
            if(!bank){
              invoiceCid = await setInvoiceSendStatus(partyId,invoiceId,invoice['document_nr'],'0','bexio_bank_error');
              commonErrors['errorTitle'] = req.originalUrl;
              commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'bank_not_found -req param,',JSON.stringify(req.body);
              warningMessage(commonErrors,'bank_not_found');
              return resolve('bank_not_found');
            }
            // invoice['bank'] = 'iban_nr' in bank ? bank : '';
            if('iban_nr' in bank){
              invoice['bank'] = bank;
            }
            else{
              invoiceCid = await setInvoiceSendStatus(partyId,invoiceId,invoice['document_nr'],'0','bexio_bank_error');
              return resolve('bexio_bank_error');
            }
            console.log('123');
            console.log('invoice.currency_id',invoice.currency_id);
            
            let currency = await getCurrency(accessToken,invoice.currency_id);
            if(!currency){
              invoiceCid = await setInvoiceSendStatus(partyId,invoiceId,invoice['document_nr'],'0','currency_not_found');
              commonErrors['errorTitle'] = req.originalUrl;
              commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'currency_not_found -req param,',JSON.stringify(req.body);
              warningMessage(commonErrors,'currency_not_found');
              return resolve('currency_not_found');
            }
            invoice['currency'] = currency;
            let temp = await getloginUserCompanyDetails(accessToken);
            console.log(temp);  
            if(!temp){
              invoiceCid = await setInvoiceSendStatus(partyId,invoiceId,invoice['document_nr'],'0','getloginUserCompanyDetails_not_found');
              commonErrors['errorTitle'] = req.originalUrl;
              commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'getloginUserCompanyDetails_not_found -req param,',JSON.stringify(req.body);
              warningMessage(commonErrors,'getloginUserCompanyDetails_not_found');
              return resolve('getloginUserCompanyDetails_not_found');
            }
            invoice['companyProfile'] = temp;
            invoice['companyProfile'] = JSON.parse(invoice['companyProfile']);
            paymentType = await getPaymentType(accessToken,invoice.payment_type_id);
            if(!paymentType){
              invoiceCid = await setInvoiceSendStatus(partyId,invoiceId,invoice['document_nr'],'0','getPaymentType_not_found');
              commonErrors['errorTitle'] = req.originalUrl;
              commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'getPaymentType_not_found -req param,',JSON.stringify(req.body);
              warningMessage(commonErrors,'getPaymentType_not_found');
              return resolve('getPaymentType_not_found');
            
            }
            let tempPaymentType = paymentType.filter(e => e.id == invoice.payment_type_id);
            invoice['paymentType'] = tempPaymentType;
            let contact = await getContact(accessToken,invoice.contact_id);
            if(!contact){
              invoiceCid = await setInvoiceSendStatus(partyId,invoiceId,invoice['document_nr'],'0','contact_not_found');
              commonErrors['errorTitle'] = req.originalUrl;
              commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'contact_not_found -req param,',JSON.stringify(req.body);
              warningMessage(commonErrors,'contact_not_found');
              return resolve('contact_not_found');
            }
            invoice['contact'] = contact;
            // let user = await getUser(accessToken,invoice.user_id);
            let user = true;
            if(!user){
              invoiceCid = await setInvoiceSendStatus(partyId,invoiceId,invoice['document_nr'],'0','user_not_found');
              commonErrors['errorTitle'] = req.originalUrl;
              commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'user_not_found -req param,',JSON.stringify(req.body);
              warningMessage(commonErrors,'user_not_found');
              return resolve('user_not_found');
            
            }
            invoice['user'] = user;
            // companyDetails = await getloginUserCompanyDetails(accessToken)
        
            await Promise.all(invoice.positions.map(async (items) => {
              console.log('items.tax_id',items.tax_id);
              if(items.tax_id){
                let tempTax = await getTaxs(accessToken,items.tax_id);
                if(!tempTax){
                  invoiceCid = await setInvoiceSendStatus(partyId,invoiceId,invoice['document_nr'],'0','tax_not_Found');
                  commonErrors['errorTitle'] = req.originalUrl;
                  commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'tax_not_Found -req param,',JSON.stringify(req.body);
                  warningMessage(commonErrors,'tax_not_Found');
                  return resolve('tax_not_Found');
                }
                items['tax'] = tempTax;
              }
              let tempItem;
              console.log('tempItem',tempItem);
              if('article_id' in items){
                tempItem = await getProducts(accessToken,items.article_id);
                items['article'] = tempItem;
                // console.log('articleas',items['article']);
                
              }else{
                console.log('items',items);
                
                items['article'] = {}
                items['article']['intern_name'] = items.text;
                items['article']['intern_description'] = items.text;
    
              }
              invoiceCid = await setInvoiceSendStatus(partyId,invoiceId,invoice['document_nr'],'1');
              let xml;
    
              xml = await setInvoiceToOt(invoice,coutryList,invitionData[0],pdfContent,fileName,customerIds,invoiceCid);
              //  console.log('xml',xml);
              if(xml == false){
                invoiceCid = await setInvoiceSendStatus(partyId,invoiceId,invoice['document_nr'],'0','bexio_item_error');
                return resolve('bexio_item_error');
              }
              await invoiceFilePush(invitionData[0].rk_netcomidsender,'WS',xml,invoice['document_nr'],'EDI');

              let redisKey = req.body.partyId+"_/";
              await deleteRedis('sendInvoice',redisKey);
            
              return resolve(true);
            }));
        }
        else{
            invoiceCid = await setInvoiceSendStatus(partyId,invoiceId,invoice['document_nr'],'0','invoice_push_error');
            return resolve('invoice_push_error');
        }
      }
      catch(error){
        console.error('Error in pushInvoiceBulkTest:', error);
        reject(error); // Ensure the promise is rejected.
      }
    } catch (error) {
      console.error('Error in pushInvoiceBulkTest:', error);
      reject(error); // Ensure the promise is rejected.
    }
  });
}
export const getInvoiceOT = async (access_token,invoiceId)=>{
  return new Promise(async(resolve, reject) => {
        var options = {
          'method': 'GET',
          'url': `https://api.bexio.com/2.0/kb_invoice/${invoiceId}`,
          'headers': {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+access_token
          }
        };
        console.log('optionsoptions',options);
        
        request(options, function (error, response) {
          console.log("response::::",response.statusCode,response.body);
          
          if (error) {  
            console.log('errorerrorerror',error);
            
            commonErrors['errorTitle'] = 'getInvoiceOT';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+invoiceId;
            warningMessage(commonErrors,error);
            resolve(false)
          }
          if(response.statusCode==200)
          {
            console.log('JSON.parse(response.body)',JSON.parse(response.body));
            resolve(JSON.parse(response.body));
            
          }
          else {
            resolve(false)

            }
        });
      });
}
export const getConnectionDetails = async (partyId,accountId,contactId,req) => {
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
export const constGetContactId = async (code) =>{
  try {
    console.log(code);
    const getCustomerIdResult = await connectNewGate2b.$queryRaw<any>(Prisma.sql`
  SELECT json_extract_path("ot_updator"::json,'in_custom_id') AS senderId,
  json_extract_path("ot_updator"::json,'out_custom_id')  AS receiverId
FROM  g2b_business_connections 
  WHERE id = ${code}
  `);
    return getCustomerIdResult
  } catch (error) {
      commonErrors['errorTitle'] = constGetContactId.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+code;
      warningMessage(commonErrors,error);
  }
}
export const getInvoicePdf = async (accessToken,invoiceId)=>{
  try {
    return new Promise( async (resolve, reject) => {
      var options = {
        'method': 'GET',
        'url': `https://api.bexio.com/2.0/kb_invoice/${invoiceId}/pdf`,
        'headers': {
          'Accept': 'application/json',
          'Authorization': 'Bearer '+accessToken
        }
      };
      request(options, function (error, response) {
        if (error) {  
          commonErrors['errorTitle'] = 'getInvoicePdf';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+invoiceId;
          warningMessage(commonErrors,error);
          resolve(false)
        }
        if(response.statusCode==200)
         resolve(response.body);
        else
         resolve(false);

      });
  })
  } catch (error) {
      commonErrors['errorTitle'] = getInvoicePdf.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+accessToken+' '+invoiceId;
      warningMessage(commonErrors,error);
      return false;

      
  }
}
export const getCountryLists = async (access_token)=>{
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
export const getBank = async (access_token,id)=>{
  console.log(id);
  return new Promise(async(resolve, reject) => {
    
        var options = {
          'method': 'GET',
          'url': `https://api.bexio.com/3.0/banking/accounts/${id}`,
          'headers': {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+access_token
          }
        };
        request(options, function (error, response) {
          console.log('response getBank',response.body);
          console.log('response.statusCode',response.statusCode);
          
          if (error) {  
            commonErrors['errorTitle'] = 'getBank';
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
export const getCurrency = async (access_token,id)=>{

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
export const getloginUserCompanyDetails = async (access_token)=>{
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
export const getPaymentType = async (access_token,id)=>{

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
export const getContact = async (access_token,id)=>{

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
export const getProducts = async (access_token,id)=>{
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
export const getTaxs = async (access_token,id)=>{

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
export const setInvoiceToOt = async (invoice,coutryList,invitionData,pdf,fileName,customerIds,invoiceCid) => {
  console.log('invoice',JSON.stringify(invoice));

  let emptyValue = 'NA'
  let taxIsAdded;
  
  let priceQuantity = '1'
  let orderUnit = {
    'Stk':'C62',
    'h':'HUR'
  }
console.log('setInvoiceToOt : invitionData -> ',invitionData);
let total = '';
console.log("invoice['total_credit_vouchers'] == 0",invoice['total_credit_vouchers'] == 0);

total = invoice['total_remaining_payments'];
console.log('totalqqqqqqqqqqqqqq',total);

  let obj = JSON.parse(JSON.stringify({
      "OPENTRANS": {
          "$": {
              "xmlns:iomarket": "http://tempuri.org/io-market/openTRANS_UDX",
              "xmlns:bmecat": "http://www.bmecat.org/bmecat/2005",
              "xmlns": "http://www.opentrans.org/XMLSchema/2.1"
          },
          "INVOICE": [{
              "$": {
                  "version": "2.1"
              },
              "INVOICE_HEADER": [{
                  "INVOICE_INFO": [],
                  ...(invoice.reference
                    ? {
                        "ORDER_HISTORY": [
                          {
                            "ORDER_ID": invoice.reference,
                          },
                        ],
                      }
                    : {})
              }],
              "INVOICE_ITEM_LIST": [{
                  "INVOICE_ITEM": []
              }],
              "INVOICE_SUMMARY": JSON.parse(JSON.stringify([{
                  "TOTAL_ITEM_NUM": invoice.positions.length,
                  "NET_VALUE_GOODS": parseFloat(invoice.total_net).toFixed(2),
                  "TOTAL_AMOUNT": parseFloat(total).toFixed(2),
                  "TOTAL_TAX": {
                    "TAX_DETAILS_FIX":[]
                  }
              }]))
          }]
      }
  }))

let v = coutryList.filter(coutry => coutry.id == invoice.contact.country_id)
taxIsAdded = invoice.taxs.length;

  obj.OPENTRANS.INVOICE[0]['INVOICE_HEADER'][0]['INVOICE_INFO'].push(JSON.parse(JSON.stringify({
      "INVOICE_ID": invoice.document_nr,
      "INVOICE_DATE": new Date(invoice.updated_at).toISOString(),
      "INVOICE_TYPE": "invoice",
      "DELIVERY_DATE": [{
       "DELIVERY_START_DATE": new Date(invoice.updated_at).toISOString(),
       "DELIVERY_END_DATE": new Date(invoice.updated_at).toISOString(),
      }],
      "bmecat:LANGUAGE": 'deu',
      "PARTIES": [{
          "PARTY": [{
              "bmecat:PARTY_ID": [{
                  "_": invitionData.rk_netcomidsender,
                  "$": {
                      "type": "netcomid"
                  }
                 
              }],
              "PARTY_ROLE": "invoice_issuer",
              "ADDRESS": [{
                  "bmecat:NAME": invoice.companyProfile[0].name?invoice.companyProfile[0].name:undefined,
                  "bmecat:STREET": invoice.companyProfile[0].address?invoice.companyProfile[0].address:undefined,
                  "bmecat:ZIP": invoice.companyProfile[0].postcode?invoice.companyProfile[0].postcode:undefined,
                  "bmecat:CITY": invoice.companyProfile[0].city?invoice.companyProfile[0].city:undefined,
                 
                  "bmecat:COUNTRY_CODED": coutryList.filter(coutry => coutry.name == invoice.companyProfile[0].country_name)[0].iso_3166_alpha2,
                 
                  
              }]

          }, {
              "bmecat:PARTY_ID": [{
                  "_": invitionData.rk_netcomidreceived,
                  "$": {
                      "type": "supplier_specific"
                  }
              }],
              "PARTY_ROLE": "invoice_recipient",
              "ADDRESS": [{
                  "bmecat:NAME": invoice.contact.name_1,
                  "bmecat:NAME2": invoice.contact.name_2?invoice.contact.name_2:undefined,

                  "bmecat:STREET": invoice.contact.address?invoice.contact.address:undefined,
                  "bmecat:ZIP": invoice.contact.postcode?invoice.contact.postcode:undefined, //NOT IN BEXIO CONTACTS - REMOVED 
                  "bmecat:CITY": invoice.contact.city?invoice.contact.city:undefined,
                  // "bmecat:COUNTRY": invoice.contact.country_id?coutryList.filter(coutry => coutry.id == invoice.contact.country_id)[0].name:undefined,
                  "bmecat:COUNTRY_CODED": invoice.contact.country_id?coutryList.filter(coutry => coutry.id == invoice.contact.country_id)[0].iso_3166_alpha2:undefined
              }]
          }]
      }],
      "INVOICE_ISSUER_IDREF": [{
          "_": invitionData.sendercustomerid
      }],
      "INVOICE_RECIPIENT_IDREF": [{
          "_": invitionData.receivercustomerid,
          "$": {
              "type": "supplier_specific"
          }
      }],
      "bmecat:CURRENCY": invoice.currency['name'],
      "PAYMENT":  invoice.bank != '' ?[{
          "ACCOUNT": [{
              "HOLDER": invoice.bank?.owner?invoice.bank.owner:'',
              "BANK_ACCOUNT": [{
                  "_": invoice.bank?.iban_nr?invoice.bank.iban_nr:'',
                  "$": {
                      "type": "iban"
                  }
              }],
              "BANK_CODE": [{
                  "_": invoice.bank?.bank_nr?invoice.bank.bank_nr:'',
                  "$": {
                      "type": "bic"
                  }
              }],
              "BANK_NAME": invoice.bank?.bank_name?invoice.bank.bank_name:'',
              // "BANK_COUNTRY": invoice.bank.currency_id NOT IN BEXIO BANK - REMOVED
          }],
          "PAYMENT_TERMS": [{
              "TIME_FOR_PAYMENT": [{
                  "DAYS": ["30"]
              }],
              "VALUE_DATE": invoice.is_valid_to
          }]
      }]:undefined,
      "MIME_INFO":[{
        "MIME":[{
          "MIME_EMBEDDED":{
            "MIME_DATA":[{
              "_":pdf,
            //   "$": {
            //     "contentType": "application/pdf"
            // }
            }],
            "FILE_NAME":fileName?fileName:'temp'}
        }]
      }],
      "REMARKS": invoice.title ? invoice.title : undefined,
      "HEADER_UDX": customerIds.length != 0 || invoiceCid ? [{
        "HEADER_UDX_OPT":[{
          "BEX_INVOICE_DOCUMENT_ID": invoiceCid ? invoiceCid : undefined
        }],
        "SENDER_CUSTOM_ID_1": customerIds[0]?.senderid ? customerIds[0].senderid:undefined,
        "RECEIVER_CUSTOM_ID_1": customerIds[0]?.receiverid? customerIds[0].receiverid:undefined
      }]:undefined
  })))
  let allTax:any = []
console.log('customerIds.length',customerIds.length);

    invoice.positions.forEach(element => {
      const index = allTax.findIndex(object => object.type === element.tax?.type);
      if (index === -1) {
          allTax.push({
              type: element.tax?.type,
              value: element.tax?.value,
          });
      }
  })
  let tempTaxArray = [];
  
 

 invoice.taxs.length!=0?
invoice.taxs.forEach(element => {
  JSON.parse(JSON.stringify(obj.OPENTRANS['INVOICE'][0]['INVOICE_SUMMARY'][0]['TOTAL_TAX']["TAX_DETAILS_FIX"].push(
    {
        "bmecat:TAX": element.percentage,
        "TAX_AMOUNT": element.value
    }
    )))
})
 :obj.OPENTRANS['INVOICE'][0]['INVOICE_SUMMARY'][0]['TOTAL_TAX']["TAX_DETAILS_FIX"]='';
  

console.log('123',obj.OPENTRANS['INVOICE'][0]['INVOICE_SUMMARY'][0]);
// obj.OPENTRANS['INVOICE'][0]['INVOICE_SUMMARY'][0] = JSON.parse(JSON.stringify(obj.OPENTRANS['INVOICE'][0]['INVOICE_SUMMARY'][0]['TOTAL_TAX']))

 console.log('invoice.positions',invoice.positions);
 
  // invoice.positions.forEach(function (element,index) {
  for (let index = 0; index < invoice.positions.length; index++) {
    let element = invoice.positions[index];
    let arr,status = true;

    // element.article.intern_description?arr={"bmecat:DESCRIPTION_LONG":element.article.intern_description}:"";
    // arr={"bmecat:SUPPLIER_PID":element.article.id}
    // arr={"bmecat:DESCRIPTION_SHORT":element.intern_name}
    // console.log('arr',arr);

//     console.log(obj.OPENTRANS.INVOICE[0]['INVOICE_ITEM_LIST'][0]['INVOICE_ITEM']);
// console.log(index);

//     console.log(obj.OPENTRANS.INVOICE[0]['INVOICE_ITEM_LIST'][0]['INVOICE_ITEM'][index]['PRODUCT_ID']["bmecat:DESCRIPTION_LONG"]);
      console.log(element.unit_price);

      // if(element.unit_price == null){
      //   console.log('123');
      //   return false;
      //   break;
      // }
      console.log('987');

      obj.OPENTRANS.INVOICE[0]['INVOICE_ITEM_LIST'][0]['INVOICE_ITEM'].push(JSON.parse(JSON.stringify({
          "$": {
              "type": "order_item"
          },
          "LINE_ITEM_ID": element.pos?element.pos:index,
          "PRODUCT_ID": [{
              "bmecat:SUPPLIER_PID": element.article.intern_code?element.article.intern_code.substring(0, 23):undefined,
              ...(element.article.intern_code
                ? {
                    "bmecat:INTERNATIONAL_PID": {
                      "_": element.article.intern_code,
                      "$": {
                        "type": "ean"
                      }
                    }
                  }
                : {}),
              "bmecat:DESCRIPTION_SHORT": element.article.intern_name?element.article.intern_name.substring(0, 145):undefined, // product id mandatory field so just added intername as description short
              "bmecat:DESCRIPTION_LONG": element.article.intern_description? element.article.intern_description:undefined
          }],
          "QUANTITY": element.amount?Math.trunc(element.amount):1,
          "bmecat:ORDER_UNIT": orderUnit[element.unit_name]?orderUnit[element.unit_name]:'C62', // add defult value directly
          "PRODUCT_PRICE_FIX": [JSON.parse(JSON.stringify({
              "bmecat:PRICE_AMOUNT": element.unit_price == null ? 0.00 : parseFloat(element.unit_price).toFixed(2),
              "ALLOW_OR_CHARGES_FIX":[{
                "ALLOW_OR_CHARGE":[{
                  "$": {
                    "type": "allowance"
                },
                "ALLOW_OR_CHARGE_TYPE":'cash_discount',
                "ALLOW_OR_CHARGE_VALUE":{
                  "AOC_PERCENTAGE_FACTOR":element.discount_in_percent,
                }
                
              }]
              }],
              "TAX_DETAILS_FIX":element.tax?.value&&taxIsAdded>0? [{
                  "bmecat:TAX_TYPE": element.tax?.type,
                  "bmecat:TAX": element.tax?.value
                  // "TAX_AMOUNT": element.tax_value
              }]:undefined,
  
        
          "bmecat:PRICE_QUANTITY": priceQuantity, // add defult value directly.
          })),
        ],
        "PRICE_LINE_AMOUNT": element.position_total? parseFloat(element.position_total).toFixed(2) : 0.00,
        "ORDER_REFERENCE": [{
          "ORDER_ID":invoice.document_nr,
          "LINE_ITEM_ID":index
        }]
       
       
        
      })))
      // element.article.intern_description==''?delete obj.OPENTRANS.INVOICE[0]['INVOICE_ITEM_LIST'][0]['INVOICE_ITEM'][obj.OPENTRANS.INVOICE[0]['INVOICE_ITEM_LIST'][0]['INVOICE_ITEM'].length-1]['PRODUCT_ID'][0]['bmecat:DESCRIPTION_LONG']:'';
       element.discount_in_percent==null?delete obj.OPENTRANS.INVOICE[0]['INVOICE_ITEM_LIST'][0]['INVOICE_ITEM'][obj.OPENTRANS.INVOICE[0]['INVOICE_ITEM_LIST'][0]['INVOICE_ITEM'].length-1]['PRODUCT_PRICE_FIX'][0]['ALLOW_OR_CHARGES_FIX']:'';
  }


  // let builder = new xml2js.Builder();
  let builder = new xml2js.Builder({'xmldec.version':1.0} );
  var xml = builder.buildObject(obj);
  console.log(xml);
  // console.log(xml)
  return Buffer.from(xml).toString('base64');
  // console.log('OT', JSON.stringify(obj));
}
export async function invoiceFilePush(netcomId,service,data,filename,type) {
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
export const deleteRedis = async (api, key) => {
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
export const pushInvoiceTestProcess = async (invoices,billerId)=>{
console.log('invoices',invoices);
  let tempIds = invoices
  let tempParam = {
    body:{
      invoice_id:'',
      biller_pid:'',
      contact_pid:'',
      invoice_uuid:'',
      token:''
    }
  };
    for (let index = 0; index < tempIds.length; index++) {
      const element = tempIds[index];
      tempParam['body']['invoice_id'] = element.doc_id;
      tempParam['body']['biller_pid'] = billerId;
      tempParam['body']['contact_pid'] = element.recipientid;
      tempParam['body']['invoice_uuid'] = '';
      tempParam['body']['token'] = element.accessToken;
      console.log('start');
      let v = await pushInvoiceTest1(tempParam,'')
      console.log('vvv',v);
    }
}
export const pushInvoiceTest1 = async (req, res) => {

  return new Promise(async (resolve, reject) => {

    let formData
    formData = req.body;
    let invoiceCid: any;
    let cookie;
    try {
      
      let invoice, paymentType
      const ebillPool = await connectMssql;
      const decryptData = req.body;
      const invoice_id = decryptData.invoice_id;
      const biller_pid = decryptData.biller_pid;
      const contact_pid = decryptData.contact_pid;
      const invoice_uuid = decryptData?.invoice_uuid;
      console.log('decryptData', decryptData);

      let billerDetails = {
        'recipientid': decryptData.contact_pid,
        'billerid': decryptData.biller_pid
      }

      let getBiller = `SELECT * 
          FROM biller
          WHERE billerid  = '${decryptData.biller_pid}'
          AND status = 'ACTIVE'`
      let getBillerResult = await ebillPool.query(getBiller);

   
      const result = await connectBexio.companyregistered.findMany({
        where: {
          netcomid: getBillerResult.recordset[0].netcomid,
          refresh_token: {
            not: null,
          },
        },
      });
      
      const partyId = result[0].rk_party;

      if (getBillerResult.recordset.length == 0) {
       
        invoiceCid = await setEbillInvoiceSendStatus(partyId, decryptData.invoice_id, '', decryptData, '0', 'biller_not_found');

        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + 'biller_not_found ' + '-req param,' + JSON.stringify(decryptData);
        warningMessage(commonErrors, 'biller_not_found');

        resolve('biller_not_found')

        return
      }


      const companyDetailsResult = await connectLibrary.$queryRaw<any>(
        Prisma.sql`
        SELECT pa.cid,lp.companyname,a.code AS app,av.version AS appversion
        FROM partyapplication pa 
        INNER JOIN application_version av ON av.cid = pa.fk_application_version  
        INNER JOIN application a ON a.cid = av.fk_application
        INNER JOIN legalparty lp ON lp.fk_party = pa.fk_party
        WHERE pa.fk_party = ${Number(partyId)} AND a.code = 'EBILL'
         `
      );
      let companyJson = JSON.parse(getBillerResult.recordset[0].companyJSON);


      let defaultLang = companyJson['localizedData']['defaultLanguage'];

      let tempCompanyName = companyJson['legalName'];
      let tempMail = companyJson['localizedData'][defaultLang]['emailAddress'];


      const checkRecipientValid = async (billerid, pid) => {
        return new Promise(async (resolve, reject) => {
          const correlationId = crypto.randomBytes(15).toString('hex');
          let data = {
            items: [{
              'billRecipientId': pid,
            }]
          }
          const options = {
            method: 'POST',
            url: config.SIX_API_CERTIFICATE_BASE + `billers/${billerid}/bill-recipients/search`,
            headers: {
              'Content-Type': 'application/json',
              'x-networkpartner-id': config.NETWORK_PARTNER_ID,
              'X-Correlation-Id': correlationId,
            },
            body: JSON.stringify(data),
            key: fs.readFileSync(config.CERTIFICATE_PATH + config.SIX_API_KEY),
            cert: fs.readFileSync(config.CERTIFICATE_PATH + config.SIX_API_CERTIFICATE)
          };
         
          await request(options, async function (error, response) {
            if (error) {
              resolve(false)
            }
            else {
              if (response.statusCode == 200) {
                let resData = JSON.parse(response.body)

                if (resData.items[0].ebillSubmissionStatus != 'NOT_ALLOWED') {
                  resolve(true)
                }
                else {
                  resolve(false)
                }
              }
              else {
                resolve(false)
              }
            }
          })
        })
      }

      let checkRecipientData;
      if (config.IS_LIVE == 'true') {
        checkRecipientData = await checkRecipientValid(decryptData.biller_pid, decryptData.contact_pid);
      } else {
        checkRecipientData = true;

      }

      console.log("checkRecipientData----", checkRecipientData);
      if (!checkRecipientData) {

        await notifiBexioBulk(decryptData.token, decryptData.invoice_id, 'ERROR-INTERNAL', 'Dieser "Kontakt" hat Sie als Rechnungssteller bisher noch nicht abonniert. Bitte kontaktieren Sie Ihren Kunden.', getBillerResult.recordset[0].netcomid)
       
        invoiceCid = await setEbillInvoiceSendStatus(partyId, decryptData.invoice_id, '', decryptData, '0', 'recipientId_not_allowed');

        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' comapny_name ' + tempCompanyName + ' email_id ' + tempMail + ' recipientId_not_allowed' + '-req param,' + JSON.stringify(decryptData);


        warningMessage(commonErrors, 'recipientId_not_allowed');

        resolve('recipientId_not_allowed')
        return
      }
      if (result.length == 0) {


        invoiceCid = await setEbillInvoiceSendStatus(partyId, decryptData.invoice_id, '', decryptData, '0');


        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + 'refreshToken_not_found ' + '-req param,' + JSON.stringify(decryptData);
        warningMessage(commonErrors, 'refreshToken_not_found');

        resolve('refreshToken_not_found')

        return
      }

      let accessToken = '';
      if ('token' in decryptData) {
        accessToken = decryptData.token;

      } else {

      }

      const invoiceId = decryptData.invoice_id;
      console.log('accessToken', accessToken);
      console.log('invoiceId', invoiceId);

      invoice = await getInvoiceOT(accessToken, invoiceId);
      console.log('invoice', invoice);
      if (!invoice) {
      
        invoiceCid = await setEbillInvoiceSendStatus(partyId, decryptData.invoice_id, '', decryptData, '0', 'something_went_wrong');

        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + 'ebill_invoice_not_found ' + '-req param,' + JSON.stringify(decryptData);
        warningMessage(commonErrors, 'ebill_invoice_not_found');
        resolve('something_went_wrong')

      }

      let recipentStatus;
      if (config.IS_LIVE == 'true') {
        recipentStatus = await checkRecipient(decryptData.biller_pid, decryptData.contact_pid, invoice.contact_id, accessToken)
      } else {
        recipentStatus = true;
      }
      if (!recipentStatus) {
      
        await notifiBexioBulk(decryptData.token, decryptData.invoice_id, 'ERROR-INTERNAL', 'Dieser "Kontakt" hat Sie als Rechnungssteller bisher noch nicht abonniert. Bitte kontaktieren Sie Ihren Kunden.', getBillerResult.recordset[0].netcomid)
        invoiceCid = await setEbillInvoiceSendStatus(partyId, decryptData.invoice_id, '', decryptData, '0', 'ebill_Recipient_not_found');

        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + 'ebill_Recipient_not_found ' + '-req param,' + JSON.stringify(decryptData);
        warningMessage(commonErrors, 'ebill_Recipient_not_found');
        resolve('something_went_wrong2')

      }


      let pdf, fileName, pdfContent;
      pdf = await getInvoicePdf(accessToken, invoiceId);
      if (!pdf) {
       


        invoiceCid = await setEbillInvoiceSendStatus(partyId, decryptData.invoice_id, '', decryptData, '0', 'something_went_wrong');

        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + 'ebill_pdf_not_found ' + '-req param,' + JSON.stringify(decryptData);
        warningMessage(commonErrors, 'ebill_pdf_not_found');

        resolve('something_went_wrong')


      }
      pdfContent = JSON.parse(pdf).content;
      fileName = JSON.parse(pdf).name;

      let coutryList;
      coutryList = await getCountryLists(accessToken);
      if (!coutryList) {


        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + 'ebill_coutryList_not_found ' + '-req param,' + JSON.stringify(decryptData);
        warningMessage(commonErrors, 'ebill_coutryList_not_found');
        resolve('something_went_wrong')

      }
      coutryList = JSON.parse(coutryList);

      let currency = await getCurrency(accessToken, invoice.currency_id);
      if (!currency) {
       

        invoiceCid = await setEbillInvoiceSendStatus(partyId, decryptData.invoice_id, '', decryptData, '0', 'something_went_wrong');


        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + 'ebill_currency_not_found ' + '-req param,' + JSON.stringify(decryptData);
        warningMessage(commonErrors, 'ebill_currency_not_found');
        resolve('something_went_wrong')

      }
      invoice['currency'] = currency;
      let temp = await getloginUserCompanyDetails(accessToken);



      if (!temp) {
        
        invoiceCid = await setEbillInvoiceSendStatus(partyId, decryptData.invoice_id, '', decryptData, '0', 'something_went_wrong');

        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + 'ebill_companyDetails_not_found ' + '-req param,' + JSON.stringify(decryptData);
        warningMessage(commonErrors, 'ebill_companyDetails_not_found');
        resolve('something_went_wrong')

      }
      invoice['companyProfile'] = temp;
      invoice['companyProfile'] = JSON.parse(invoice['companyProfile']);

      paymentType = true;
      if (!paymentType) {
     
        invoiceCid = await setEbillInvoiceSendStatus(partyId, decryptData.invoice_id, '', decryptData, '0', 'something_went_wrong');


        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + 'ebill_paymentType_not_found ' + '-req param,' + JSON.stringify(decryptData);
        warningMessage(commonErrors, 'ebill_paymentType_not_found');
        resolve('something_went_wrong')


      }

      invoice['paymentType'] = true;
      let contact = await getContact(accessToken, invoice.contact_id);
      if (!contact) {
      
        invoiceCid = await setEbillInvoiceSendStatus(partyId, decryptData.invoice_id, '', decryptData, '0', 'something_went_wrong');

        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + 'ebill_contact_not_found ' + '-req param,' + JSON.stringify(decryptData);
        warningMessage(commonErrors, 'ebill_contact_not_found');
        resolve('something_went_wrong')


      }
      invoice['contact'] = contact;

      let user = true

      if (!user) {
     
        invoiceCid = await setEbillInvoiceSendStatus(partyId, decryptData.invoice_id, '', decryptData, '0', 'something_went_wrong');



        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + 'ebill_user_not_found ' + '-req param,' + JSON.stringify(decryptData);
        warningMessage(commonErrors, 'ebill_user_not_found');
        resolve('something_went_wrong')


      }
      invoice['user'] = user;


      if (invoice.positions.length != 0) {
        for (const items of invoice.positions) {

          if (items.tax_id) {
            let tempTax = await getTaxs(accessToken, items.tax_id);
            if (!tempTax) {
              commonErrors['errorTitle'] = req.originalUrl;
              commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + 'ebill_tax_not_found ' + '-req param,' + JSON.stringify(decryptData);
              warningMessage(commonErrors, 'ebill_tax_not_found');
              resolve('something_went_wrong10')

            }
            items['tax'] = tempTax;
          }


          let tempItem;

          if ('article_id' in items) {
            tempItem = await getProducts(accessToken, items.article_id);
            items['article'] = tempItem;

          } else {


            items['article'] = {}
            items['article']['intern_name'] = items.text;
            items['article']['intern_description'] = items.text;

          }


        }
      } else {
        let items = {};
        items['article'] = {}
        items['article']['intern_name'] = 'Dummy Name';
        items['article']['intern_description'] = 'Dummy Desccription';
        invoice.positions.push(items);
      }


      let xml;

      decryptData['bank_id'] = 'bank_account_id' in invoice ? invoice['bank_account_id'] : '';
      let invoiceCidSucess = await setEbillInvoiceSendStatus(partyId, invoiceId, invoice['document_nr'], decryptData, '1');
      xml = await setInvoiceEbillOt(invoice, coutryList, '', pdfContent, fileName, '', billerDetails, decryptData, invoiceCidSucess);


      if (xml == false) {

        invoiceCid = await setEbillInvoiceSendStatus(partyId, decryptData.invoice_id, '', decryptData, '0', 'something_went_wrong');
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + 'ebill_xml_not_found ' + '-req param,' + JSON.stringify(decryptData);
        warningMessage(commonErrors, 'ebill_xml_not_found');
        resolve('something_went_wrong')

      }
      await invoiceFilePush(getBillerResult.recordset[0].netcomid, 'WS', xml, invoice['document_nr'], 'EBILL');
      await issueEbillInvoice(accessToken, decryptData.invoice_id);
      await markAsIssues(accessToken, decryptData.invoice_id);
      resolve(true)


    } catch (error) {

      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + formData;
      warningMessage(commonErrors, error);
      resolve('something_went_wrong12')

    }
  });
}
export const setEbillInvoiceSendStatus = async (partyId,invoiceId,invoicenumber,formData,status,error?) => {
  let sendInvoiceId;
    console.log('invoiceId',invoiceId);
    console.log('partyId',partyId);
    console.log('partyId',partyId);
    console.log('formData',formData);
    let responseBody = error;
    
    return new Promise(async function (resolve, reject) {
     try {
          const selectQryResult = await connectBexio.documents_invoice_send.findMany({
            where: {
              rk_invoice: invoiceId,
              invoice_type: 'EBILL',
              companyregistered: {
                rk_party: Number(partyId),
              },
            },
            select: {
              cid: true, 
              object_id: true,
              companyregistered: {
                select: {
                  cid: true,
                },
              },
            },
          });

          console.log('selectQryResult:::',selectQryResult);
          
          let insertQry;
          console.log('azaaza',selectQryResult.length);

          if(selectQryResult.length == 0)
          {
            console.log('azaaza');
            const selectQryResult = await connectBexio.companyregistered.findMany({
              where: {
                rk_party: Number(partyId), 
                
              }
            });
            const result = await connectBexio.documents_invoice_send.create({
              data: {
                rk_invoice: invoiceId,
                invoice_number: invoicenumber,
                fk_companyregistered:Number(selectQryResult[0].cid),
                invoice_type: 'EBILL',
                invoice_params: formData, // Assuming `formData` is a valid JSON object
                response: responseBody,
                status: Number(status),
                is_notifyed: false,
              },
              select: {
                object_id: true,
              },
            });
            sendInvoiceId = result[0].objectid;
          }else{
            sendInvoiceId = selectQryResult[0].object_id;
            await connectBexio.documents_invoice_send.updateMany({
              where: {
                fk_companyregistered: selectQryResult[0].cid,
                rk_invoice: invoiceId,
                invoice_type: 'EBILL',
              },
              data: {
                time_stamp: new Date(), // equivalent to NOW()
                invoice_params: formData, // assuming it's a valid JSON object
                is_notifyed: false,
                reference_id: null,
                response: responseBody,
                status: Number(status), // Ensure status is passed as an integer
              },
            });
          }
          console.log('sendInvoiceIdsendInvoiceId',sendInvoiceId);
          console.log('statusstatus1',status);

          
          resolve(sendInvoiceId);
        } catch (error) {
          console.log(error);
        commonErrors['errorTitle'] = setEbillInvoiceSendStatus.name;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+partyId+'-partyId'+invoiceId+'-invoiceId'+invoicenumber+'invoiceNumber';
        warningMessage(commonErrors,error);
          resolve('');
          
        }
    });

}
export const notifiBexioBulk = async (token,id,status,message?,netcomId?,amount?,bankId?)=>{
  let options;
  console.log('refreshToken',token);
  let params = {
    refreshToken:token,
    id:id,
    status:status,
    amount:amount,
  }
  let tempMsg,erroMsg = '';
  console.log('typeof(message)',typeof(message));
  
  if(message){
    if(typeof(message) == 'object')
       tempMsg = message;
    else
      try {
       tempMsg = JSON.parse(message);
        
      } catch (error) {
        tempMsg = message;
      }

    if(typeof(tempMsg) == 'object')
    {
      if('detail' in tempMsg){
        erroMsg = erroMsg + tempMsg['detail'];
      }
      if('technicalReason' in tempMsg){
        erroMsg = erroMsg + ' - '+ tempMsg['technicalReason'];
      }
    }else{
      erroMsg = erroMsg + message;

    }
   
  }
  console.log('erroMsg',erroMsg);
 
  console.log('id',id);
  console.log('status',status);
  await addBexioCommentBulk(token,id,status,erroMsg,netcomId);

  return new Promise(async(resolve, reject) => {
    try {
      console.log('bankId',bankId);
      
      if(status == 'COMPLETED'){
        let isNotifyBexio = true;
        const getCompanyIdQryResult = await connectBexio.companyregistered.findMany({
          where: {
            netcomid: netcomId,
            AND: [
              {
                settings: {
                  not: Prisma.JsonNull, 
                },
              },
              {
                settings: {
                  path: ['notifyPayment'],
                  equals: 'false',
                },
              },
            ],
          },
          select: {
            settings: true,
          },
        });
        if(getCompanyIdQryResult.length > 0){
          isNotifyBexio = false;
        }
        console.log('isNotifyBexio',isNotifyBexio);
        if(isNotifyBexio)
        {
          options = {
            'method': 'POST',
            'url': `https://api.bexio.com/2.0/kb_invoice/${id}/payment`,
            'headers': {
              'Accept': 'application/json',
              'Authorization': 'Bearer '+token
            },
            body: JSON.stringify({
              "value": amount,
              "bank_account_id":bankId ? bankId : undefined
            })
          };
          console.log('optionsoptions',options);
        request(options, async function (error, response) {
          if (error) {  
            console.log('errorr',error);
            commonErrors['errorTitle'] = 'notifiBexio';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+JSON.stringify(params);
            warningMessage(commonErrors,error);
            resolve(false)
          }
          console.log('notifiBexionotifiBexio',options);
    
          console.log('notifiBexionotifiBexio',response.body);
          console.log('typeoftypeof',typeof(response.body));
  
          let resStatus = 'success' in JSON.parse(response.body) ? true : false;
          console.log('statusstatus',resStatus);
           if(response.statusCode == 201 || resStatus)
          {
          
            resolve(JSON.parse(response.body));
            console.log('JSON.parse(response.body)',JSON.parse(response.body));
          }
          else{
            commonErrors['errorTitle'] = 'notifiBexio';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+response.body.toString()+'-bexio param,'+JSON.stringify(params);
            warningMessage(commonErrors,error);
            resolve(false)
          }
  
        });
      }else{
        resolve(false);
      }
      }else if(status == 'ERROR' || status == 'INCORRECT' || status == 'REJECTED' || status == 'ERROR-INTERNAL'){
        options = {
          'method': 'POST',
          'url': `https://office.bexio.com/api.php/kb_invoice/${id}/mark_as_ebill_failed`,
          'headers': {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+token
          }
        };
        request(options, async function (error, response) {
          if (error) {  
            console.log('errorr',error);
            commonErrors['errorTitle'] = 'notifiBexio';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+JSON.stringify(params);
            warningMessage(commonErrors,error);
            resolve(false)
          }
          console.log('notifiBexionotifiBexio',options);
    
          console.log('notifiBexionotifiBexio',response.body);
          console.log('typeoftypeof',typeof(response.body));
          let resStatus;
          if(typeof(response.body) == 'object'){
            resStatus = 'success' in JSON.parse(response.body) ? true : false;

          }else{
            resStatus = false;
          }
          console.log('statusstatus',resStatus);
          
  
           if(response.statusCode == 201 || resStatus)
          {
          
            resolve(JSON.parse(response.body));
            console.log('JSON.parse(response.body)',JSON.parse(response.body));
          }
          else{
            commonErrors['errorTitle'] = 'notifiBexio';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+response.body.toString()+'-bexio param,'+JSON.stringify(params);
            warningMessage(commonErrors,error);
            resolve(false);
          }
  
        });
      }else{
        resolve(true);
      }
      console.log('options',options);
    } catch (error) {
      commonErrors['errorTitle'] = 'notifiBexio';
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+JSON.stringify(params);
      warningMessage(commonErrors,error);
      resolve(false)
    }
  }); 
}
export const checkRecipient = async (billerId, receiptId, contactId, accessToken) => {
  const pool = await connectMssql;
  const sql = require('mssql');
  let transaction = new sql.Transaction(pool);
  await transaction.begin();
 
  const getrecipient = `SELECT r.id,b.netcomid,r.fk_biller,r.islinked FROM recipient r 
  INNER JOIN biller b ON b.id = r.fk_biller 
  WHERE b.billerId = '${billerId}' AND r.recipientId = '${receiptId}'`;
  const getrecipientId = await pool.query(getrecipient);
  console.log("getrecipientId---",getrecipientId);
  let getCompanydata = await connectBexio.companyregistered.findMany({
    where: {
      netcomid: getrecipientId.recordset[0].netcomid, // Replace with your actual variable
    },
    select: {
      cid: true,
    },
  });
  const updateBexioConatct = async (bexioCustomerId, receiptId) => {
    return new Promise(async (resolve, reject) => {
      let data = {
        ebill_pid: receiptId
      }
      const options = {
        method: 'PATCH',
        url: `https://api.bexio.com/3.0/contact/${bexioCustomerId}`,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data)
      };
      await request(options, async function (error, response) {
        if (error) {
          console.log(error);
          commonErrors['errorTitle'] = 'from bexio pushInvoice API' + `' updateBexioConatct'+' '+'bexioCustomerId ----${bexioCustomerId}'+' '+'receiptId----${receiptId}'`;
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + 'billerId--' + billerId + '--receiptId--' + receiptId + '--contactId--' + contactId + '--accessToken--' + accessToken;
          warningMessage(commonErrors, error);
          resolve(false);
        }
        if (response.statusCode == 200) {
          let responseData = JSON.parse(response.body)
          resolve(responseData);
        }
        else {
          resolve(false);
        }
      })
    })
  }
  if (getrecipientId.recordset.length) {
    if (getrecipientId.recordset[0].islinked) {
      await transaction.commit();
     
      return true;
    }
    else {

   

      const getContactCheckResult = await connectBexio.contact_bc.findMany({
        where: {
          fk_companyregistered: getCompanydata[0].cid,
          rk_contact: contactId,
          recipient_id: receiptId,
          type: 'EBILL',
        },
        select: {
          cid: true,
        },
      });
     
      if (getContactCheckResult.length == 0) {
        await connectBexio.contact_bc.create({
          data: {
            fk_companyregistered: getCompanydata[0].cid,
            rk_contact: contactId,
            type: 'EBILL',
            recipient_id: receiptId,
          },
        });

      }
      const updateRecipientQuery = `UPDATE recipient SET islinked = '1' 
      WHERE recipientid ='${receiptId}'
       AND fk_biller = '${getrecipientId.recordset[0].fk_biller}'`;
      await new sql.Request(transaction).query(updateRecipientQuery)
      let bexioUpdate = await updateBexioConatct(contactId, receiptId)
      console.log("bexioUpdate from if-----", bexioUpdate);
      if (bexioUpdate) {
        await transaction.commit();
        
      }
      else {
        await transaction.rollback();
       
      }
     
      return bexioUpdate;
    }
  }
  else {
    const getBiller = `SELECT id,netcomid FROM biller 
                       WHERE billerId = '${billerId}'`;
    const getBillerId = await pool.query(getBiller);
    console.log("--------",getBillerId.recordset, receiptId);

    const getCompanyDetails = await connectBexio.companyregistered.findMany({
      where: {
        netcomid: getBillerId.recordset[0].netcomid, // Replace with your actual variable
      },
      select: {
        cid: true,
      },
    });
    const getContactCheckResult= await connectBexio.contact_bc.findMany({
      where: {
        fk_companyregistered: getCompanyDetails[0].cid,
        rk_contact: contactId,
        recipient_id: receiptId,
        type: 'EBILL',
      },
      select: {
        cid: true,
      },
    });
    
    if (getContactCheckResult.length == 0) {
          await connectBexio.contact_bc.create({
            data: {
              fk_companyregistered: getCompanyDetails[0].cid,
              rk_contact: contactId,
              type: 'EBILL',
              recipient_id: receiptId,
            },
          });
    }
    let bexioUpdate:any = await updateBexioConatct(contactId, receiptId)
    console.log("bexioUpdate from else-----",bexioUpdate);

    const getCountry = async (countryId) => { 
      return new Promise(async (resolve, reject) => {
      const options = {
        method: 'GET',
        url: `https://api.bexio.com/2.0/country/${countryId}`,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        }
      };
      console.log("options--",options);
      
      await request(options, async function (error, response) {
        if (error) {
          console.log(error);
          commonErrors['errorTitle'] = 'from bexio pushInvoice API' + `' get Country'+' '+'countryId ----${countryId}`;
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-countryId,' + countryId;
          warningMessage(commonErrors, error);
          resolve(false);
        }
        if (response.statusCode == 200) {
          let responseData = JSON.parse(response.body)
          resolve(responseData);
        }
        else {
          resolve(false);
        }
      })
     })
    }
    let getCountryData;
    if(bexioUpdate['country_id'] != null){
      getCountryData  = await getCountry(bexioUpdate['country_id'])
     }
    if (bexioUpdate) {
      let contactType = bexioUpdate['contact_type_id'] == 1 ? 'COMPANY' : 'PRIVATE';
      let firstname = bexioUpdate['name_1'] == null ? '': bexioUpdate['name_1']
      let lastname  = bexioUpdate['name_2'] == null ? '': bexioUpdate['name_2']
      let postcode = bexioUpdate['postcode'] == null ? '' : bexioUpdate['postcode']
      let city = bexioUpdate['city'] == null ? '' : bexioUpdate['city']
      let email = bexioUpdate['mail'] == null ? '': bexioUpdate['mail']
      let countryName = bexioUpdate['country_id'] != null ? getCountryData['iso_3166_alpha2']: ''
      let languages = [
        {id:1,language:'ger'},
        {id:2,language:'fre'},
        {id:3,language:'ita'},
        {id:5,language:'eng'},  
      ]
      let languageName;
      console.log("bexioUpdate['language_id'----",bexioUpdate['language_id']);
      
      if(bexioUpdate['language_id']!=null){
        languages.find(element =>{
          if(element.id == bexioUpdate['language_id']){
            languageName = element.language;
          }
        })
        languageName = languageName == undefined ? 'ger' : languageName; 
        console.log("gggggggg",languageName);  
      }
      else{
        languageName = 'ger'
        }
        const addReceipient = ` INSERT INTO recipient (fk_biller,recipientId,islinked,source,status) 
        VALUES('${getBillerId.recordset[0].id}','${receiptId}','${1}','BEX','SUBSCRITPTION')`;
        console.log("addReceipient----",addReceipient);
        // receipeint details are may be different in bexio and six, so we can't add details from bexio 
      console.log("addReceipient----",addReceipient);
      await new sql.Request(transaction).query(addReceipient);
        try {
          const addlogs = ` INSERT INTO log (billerId,recipientId,source,status) 
          VALUES('${billerId}','${receiptId}','BEX','')`;
          console.log("addReceipient----",addlogs);
          await new sql.Request(transaction).query(addlogs);
        } catch (error) {
          console.log('error while adding six logs');
        }
   

      await transaction.commit();
     
    }
    else {
      await transaction.rollback();
     
    }
   
    return bexioUpdate;
  }
}
export const setInvoiceEbillOt = async (invoice,coutryList,contactNumber,pdf,fileName,invoiceCid,billerDetails,formData,invoiceLogUid) => {
  console.log('EBILLLL');
  

  let emptyValue = 'NA'
  let taxIsAdded;
  let priceQuantity = '1'
  let orderUnit = {
    'Stk':'C62',
    'h':'HUR'
  }
  let billDetails = await getRefrenceNumber(pdf,invoice.document_nr,billerDetails);
  // console.log('invoiceinvoiceinvoice',invoice);
  let total = '';
  console.log("invoice['total_credit_vouchers'] == 0",invoice['total_credit_vouchers'] == 0);

  total = invoice['total_remaining_payments'];
  console.log('totttttal',total);

  console.log('billDetails',billDetails);
  
  console.log('REFERENCE_NUMBER',billerDetails);
  if(!billDetails)
  {
    console.log('QR_code_not_found');
    
    commonErrors['errorTitle'] = 'QR_code_not_found';
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'QR_code_not_found '+'-req param,'+JSON.stringify(formData);
    warningMessage(commonErrors,'QR_code_not_found');
    return false;
  }
  if(!billerDetails)
  {
    console.log('Biller');
    
    commonErrors['errorTitle'] = 'QR_code_not_found';
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'QR_code_not_found '+'-req param,'+JSON.stringify(formData);
    warningMessage(commonErrors,'QR_code_not_found');
    return false;
  }
  let obj = JSON.parse(JSON.stringify({
      "OPENTRANS": {
          "$": {
              "xmlns:iomarket": "http://tempuri.org/io-market/openTRANS_UDX",
              "xmlns:bmecat": "http://www.bmecat.org/bmecat/2005",
              "xmlns": "http://www.opentrans.org/XMLSchema/2.1"
          },
          "INVOICE": [{
              "$": {
                  "version": "2.1"
              },
              "INVOICE_HEADER": [{
                  "CONTROL_INFO":[],
                  "INVOICE_INFO": []
              }],
              "INVOICE_ITEM_LIST": [{
                  "INVOICE_ITEM": []
              }],
              "INVOICE_SUMMARY": JSON.parse(JSON.stringify([{
                  "TOTAL_ITEM_NUM": invoice.positions.length,
                  "NET_VALUE_GOODS": parseFloat(invoice.total_net).toFixed(2),
                  "TOTAL_AMOUNT": parseFloat(total).toFixed(2),
                  "TOTAL_TAX": {
                    "TAX_DETAILS_FIX":[]
                  }
              }]))
          }]
      }
  }))

let v = coutryList.filter(coutry => coutry.id == invoice.contact.country_id)
taxIsAdded = invoice.taxs.length;
  obj.OPENTRANS.INVOICE[0]['INVOICE_HEADER'][0]['CONTROL_INFO'].push(JSON.parse(JSON.stringify({
      "GENERATION_DATE": new Date(invoice.updated_at).toISOString(),
  }))),
  obj.OPENTRANS.INVOICE[0]['INVOICE_HEADER'][0]['INVOICE_INFO'].push(JSON.parse(JSON.stringify({
      "INVOICE_ID": invoice.document_nr,
      "INVOICE_DATE": new Date(invoice.updated_at).toISOString(),
      "INVOICE_TYPE": "invoice",
      "DELIVERY_DATE": [{
       "DELIVERY_START_DATE": new Date(invoice.updated_at).toISOString(),
       "DELIVERY_END_DATE": new Date(invoice.updated_at).toISOString(),
      }],
      "bmecat:LANGUAGE": 'deu',
      "PARTIES": [{
          "PARTY": [{
              "bmecat:PARTY_ID": [{
                  "_": billerDetails['billerid'],
                  "$": {
                      "type": "party_specific"
                  }
                 
              }],
              "PARTY_ROLE": "invoice_issuer",
              "ADDRESS": [{
                  "bmecat:NAME": invoice.companyProfile[0].name?invoice.companyProfile[0].name:undefined,
                  "bmecat:STREET": invoice.companyProfile[0].address?invoice.companyProfile[0].address:undefined,
                  "bmecat:ZIP": invoice.companyProfile[0].postcode?invoice.companyProfile[0].postcode:undefined,
                  "bmecat:CITY": invoice.companyProfile[0].city?invoice.companyProfile[0].city:undefined,
                  "bmecat:COUNTRY_CODED": coutryList.filter(coutry => coutry.name == invoice.companyProfile[0].country_name)[0].iso_3166_alpha2,
                  
              }]

          }, {
              "bmecat:PARTY_ID": [{
                  "_": billerDetails['recipientid'],
                  "$": {
                      "type": "party_specific"
                  }
              }],
              "PARTY_ROLE": "invoice_recipient",
              "ADDRESS": [{
                  "bmecat:NAME": invoice.contact.name_1,
                  "bmecat:NAME2": invoice.contact.name_2?invoice.contact.name_2:undefined,

                  "bmecat:STREET": invoice.contact.address?invoice.contact.address:undefined,
                  "bmecat:ZIP": invoice.contact.postcode?invoice.contact.postcode:undefined, //NOT IN BEXIO CONTACTS - REMOVED 
                  "bmecat:CITY": invoice.contact.city?invoice.contact.city:undefined,
                  "bmecat:COUNTRY_CODED": invoice.contact.country_id?coutryList.filter(coutry => coutry.id == invoice.contact.country_id)[0].iso_3166_alpha2:undefined
              }]
          }]
      }],
      "INVOICE_ISSUER_IDREF": [{
          "_": billerDetails['billerid'],
          "$": {
            "type": "party_specific"
        }
      }],
      "INVOICE_RECIPIENT_IDREF": [{
          "_": billerDetails['recipientid'],
          "$": {
              "type": "party_specific"
          }
      }],
      "bmecat:CURRENCY": invoice.currency['name'],
      "MIME_INFO":[{
        "MIME":[{
          "MIME_EMBEDDED":{
            "MIME_DATA":[{
              "_":pdf,
          
            }],
            "FILE_NAME":fileName?fileName:'temp'}
        }]
      }],
      "REMARKS": invoice.title ? invoice.title : undefined,
      "HEADER_UDX":  JSON.parse(JSON.stringify([{
        "EBILL.BILL_RECIPIENT_ID": billerDetails['recipientid'],
        "EBILL.QR_IBAN": billDetails['iban'],
        "EBILL.IBAN_REFERENCE_NUMBER": billDetails['ref'],
        "EBILL.QR_TYPE": billDetails['type'],
        "EBILL.DUE_DATE":invoice?.is_valid_to ? invoice.is_valid_to: '',
        "HEADER_UDX_OPT":[{
          "BEX_INVOICE_EBIIL_DOCUMENT_ID": invoiceLogUid ? invoiceLogUid : undefined
        }]
      }]))
  })))

  let allTax:any = []

    invoice.positions.forEach(element => {
      const index = allTax.findIndex(object => object.type === element.tax?.type);
      if (index === -1) {
          allTax.push({
              type: element.tax?.type,
              value: element.tax?.value,
          });
      }
  })
  let tempTaxArray = [];
 
 invoice.taxs.length!=0?
invoice.taxs.forEach(element => {
  JSON.parse(JSON.stringify(obj.OPENTRANS['INVOICE'][0]['INVOICE_SUMMARY'][0]['TOTAL_TAX']["TAX_DETAILS_FIX"].push(
    {
        "bmecat:TAX": element.percentage,
        "TAX_AMOUNT": element.value
    }
    )))
})
 :obj.OPENTRANS['INVOICE'][0]['INVOICE_SUMMARY'][0]['TOTAL_TAX']["TAX_DETAILS_FIX"]='';
  
  for (let index = 0; index < invoice.positions.length; index++) {
    let element = invoice.positions[index];
    let arr,status = true;
      console.log('987');
      obj.OPENTRANS.INVOICE[0]['INVOICE_ITEM_LIST'][0]['INVOICE_ITEM'].push(JSON.parse(JSON.stringify({
          "$": {
              "type": "order_item"
          },
          "LINE_ITEM_ID": element.pos?element.pos:index,
          "PRODUCT_ID": [{
              "bmecat:SUPPLIER_PID": element.article.intern_code?element.article.intern_code:undefined,
              "bmecat:DESCRIPTION_SHORT": element.article.intern_name?element.article.intern_name.substring(0, 145):undefined, 
              "bmecat:DESCRIPTION_LONG": element.article.intern_description? element.article.intern_description:undefined
          }],
          "QUANTITY": element.amount?Math.trunc(element.amount):1,
          "bmecat:ORDER_UNIT": orderUnit[element.unit_name]?orderUnit[element.unit_name]:'C62',
          "PRODUCT_PRICE_FIX": [JSON.parse(JSON.stringify({
              "bmecat:PRICE_AMOUNT": element.unit_price == null ? 0.00 : parseFloat(element.unit_price).toFixed(2),
              "TAX_DETAILS_FIX":element.tax?.value&&taxIsAdded>0? [{
                  "bmecat:TAX_TYPE": element.tax?.type,
                  "bmecat:TAX": element.tax?.value
                 
              }]:undefined,
  
        
          "bmecat:PRICE_QUANTITY": priceQuantity, 
          })),
        ],
        "PRICE_LINE_AMOUNT": element.position_total? parseFloat(element.position_total).toFixed(2) : 0.00,
        "DELIVERY_REFERENCE": [{
          "DELIVERY_DATE": [{
              "DELIVERY_START_DATE": new Date(invoice.updated_at).toISOString(),
              "DELIVERY_END_DATE": new Date(invoice.updated_at).toISOString()
          }]
        }]
      })))
    
       element.discount_in_percent==null?delete obj.OPENTRANS.INVOICE[0]['INVOICE_ITEM_LIST'][0]['INVOICE_ITEM'][obj.OPENTRANS.INVOICE[0]['INVOICE_ITEM_LIST'][0]['INVOICE_ITEM'].length-1]['PRODUCT_PRICE_FIX'][0]['ALLOW_OR_CHARGES_FIX']:'';
  }

  let builder = new xml2js.Builder({'xmldec.version':1.0} );
  var xml = builder.buildObject(obj);
  console.log(xml);

  return Buffer.from(xml).toString('base64');
 
}
export const issueEbillInvoice = async (access_token,id)=>{

  return new Promise(async(resolve, reject) => {
        var options = {
          'method': 'POST',
          'url': `https://api.bexio.com/2.0/kb_invoice/${id}/issue`,
          'headers': {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+access_token
          }
        };
        request(options, function (error, response) {
          if (error) {  
            commonErrors['errorTitle'] = 'getDefaultUser';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,';
            warningMessage(commonErrors,error);
            resolve(false)
          }
          if(response.statusCode==200)
          resolve(JSON.parse(response.body)[0]);
          else
          resolve(false)
        });
      });
}
export const markAsIssues = async (access_token,id)=>{

  return new Promise(async(resolve, reject) => {
        var options = {
          'method': 'POST',
          'url': `https://api.bexio.com/2.0/kb_invoice/${id}/mark_as_sent`,
          'headers': {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+access_token
          }
        };
        request(options, function (error, response) {
          if (error) {  
            commonErrors['errorTitle'] = 'markAsIssues';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,';
            warningMessage(commonErrors,error);
            resolve(false)
          }
          if(response.statusCode==200)
          resolve(JSON.parse(response.body)[0]);
          else
          resolve(false)
        });
      });
}
export const addBexioCommentBulk = async (token,id,status,message?,netcomId?) => {
  console.log('addBexioComment');
  let parms = {
    token:token,
    id:id,
    status:status,
    message:message,
    netcomId:netcomId
  }
  console.log('parms',parms);
  
  return new Promise(async(resolve, reject) => {
    try {
      console.log('config.BEXIO_COMMENTS',config.BEXIO_COMMENTS);
      let commentsData = JSON.parse(config.BEXIO_COMMENTS);
      console.log(commentsData[status].replace('[message]','{ '+message+' }'))
      let comments = commentsData[status].replace('[message]','{ '+message+' }')
      let invoiceData = await getInvoiceOT(token,id);
      console.log('addBexioComment');
      
      if(!invoiceData)
      {
        commonErrors['errorTitle'] = 'addBexioComment';
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'addBexioComment '+'-bexio param,'+JSON.stringify(parms);
        warningMessage(commonErrors,'error');
        resolve(false)
        return
      }
      let userData = await getUser(token,invoiceData['user_id']);
      console.log('userData',userData);
      
      if(!userData){
        userData = await getDefaultUser(token);
      }
      console.log('userData',userData);

      if(!userData)
      {
        commonErrors['errorTitle'] = 'addBexioComment';
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'addBexioComment '+'-bexio param,'+JSON.stringify(parms);
        warningMessage(commonErrors,'error');
        resolve(false)
        return
      }
      let options = {
        'method': 'POST',
        'url': `https://api.bexio.com/2.0/kb_invoice/${id}/comment`,
        'headers': {
          'Accept': 'application/json',
          'Authorization': 'Bearer '+token
        },
        body: JSON.stringify({
          "text": comments,
          "user_name":'iomarket AG'
        })
      };
             request(options, function (error, response) {
          if (error) {  
            console.log('errorr',error);
         
            commonErrors['errorTitle'] = 'addBexioComment';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+JSON.stringify(parms);
            warningMessage(commonErrors,error);
            resolve(false)
          }
         
          console.log('options',options);
    
          console.log('response',response.body);
    
          if(response.statusCode == 201)
          {
            resolve(JSON.parse(response.body));
            console.log('JSON.parse(response.body)',JSON.parse(response.body));
            return;
          }
          else{
            console.log('errorr',error);
            commonErrors['errorTitle'] = 'addBexioComment';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+(response?response.body.toString():'')+'-bexio param,'+JSON.stringify(parms);
            warningMessage(commonErrors,error);
            resolve(false)
            return;
          }
          resolve(false)
        })
      } catch (error) {
       
        console.log('errorrrrrrr',error);
        commonErrors['errorTitle'] = 'addBexioComment';
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+JSON.stringify(parms);
        warningMessage(commonErrors,error);
        resolve(false);
        return;
        
      }
    })

}
export const getUser = async (access_token,id)=>{
  return new Promise(async(resolve, reject) => {
        var options = {
          'method': 'GET',
          'url': `https://api.bexio.com/3.0/users/${id}`,
          'headers': {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+access_token
          }
        };
        request(options, function (error, response) {
          if (error) {  
            commonErrors['errorTitle'] = 'getUser';
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
export const getDefaultUser = async (access_token)=>{
  return new Promise(async(resolve, reject) => {
        var options = {
          'method': 'GET',
          'url': `https://api.bexio.com/3.0/users?order_by=lastname`,
          'headers': {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+access_token
          }
        };
        request(options, function (error, response) {
          if (error) {  
            commonErrors['errorTitle'] = 'getDefaultUser';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,';
            warningMessage(commonErrors,error);
            resolve(false)
          }
          if(response.statusCode==200)
          resolve(JSON.parse(response.body)[0]);
          else
          resolve(false)
        });
      });
}
export const getRefrenceNumber = async (pdf,invoiceNumber,billerDetails)=>{
    try {
  
      let data ={
        billerDetails:billerDetails,
        invoiceNumber:invoiceNumber
      }
      const buf = Buffer.from(pdf, 'base64');
      
      
      return new Promise(async(resolve, reject) => {
        const options = {
          method: 'POST',
          url: config.QRREADERURL+'bill',
          headers: {
            'Content-Type': 'application/pdf'
          },
          body:buf
      };
        request(options, function (error, response) {
          

          console.log("456",response.body.length);
          if(response.body.length < 3)
          {
         
            var s = new Date(new Date()); 
            let v = s.getFullYear()*10000000000 + (s.getMonth()+1)*100000000 + s.getDate()*1000000 + s.getHours()*10000 + s.getMinutes()*100 + s.getSeconds();
            let res = {
              iban:undefined,
              type:undefined,
              ref:undefined,
              referenceEbil:invoiceNumber+'_'+v

            }
            
            commonErrors['errorTitle'] = 'QR_code_not_found';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'QR_code_not_found '+'-req param,'+JSON.stringify(data);
            warningMessage(commonErrors,'QR_code_not_found');
            resolve(res);
          }
         
            let paymentDetails = response.body.split("\\n");
            console.log("paymentDetails.indexOf('SCOR')",paymentDetails.indexOf('SCOR'));
            
            let typeIndex = paymentDetails.indexOf('QRR') != -1 ?  paymentDetails.indexOf('QRR') : paymentDetails.indexOf('SCOR');
            console.log('typeIndex',typeIndex);
            if(typeIndex == -1){
              typeIndex = paymentDetails.indexOf('NON') != -1 ?  paymentDetails.indexOf('NON') : -1;
            }
            var s = new Date(new Date()); 
            console.log(s.getFullYear()*10000000000 + (s.getMonth()+1)*100000000 + s.getDate()*1000000 + s.getHours()*10000 + s.getMinutes()*100 + s.getSeconds())
            let v = s.getFullYear()*10000000000 + (s.getMonth()+1)*100000000 + s.getDate()*1000000 + s.getHours()*10000 + s.getMinutes()*100 + s.getSeconds();
            console.log('adasdsad',v);
            console.log('adasdsad',v);
            console.log('typeIndex',typeIndex);
            
            let res = {
              iban:paymentDetails[3],
              type:paymentDetails[typeIndex],
              ref:paymentDetails[typeIndex+1] ? paymentDetails[typeIndex+1] : undefined,
              referenceEbil:invoiceNumber+'_'+v

            }
            console.log('sdfsdfsdf');
            
            if(typeIndex == -1){

              commonErrors['errorTitle'] = 'QR_code_not_found';
              commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'QR_code_not_found '+'-req param,'+JSON.stringify(data);
              warningMessage(commonErrors,'QR_code_not_found');
              res = {
                iban:undefined,
                type:undefined,
                ref:undefined,
                referenceEbil:invoiceNumber+'_'+v
  
              }
              resolve(res);
            }
            console.log('res',res);
            
            resolve(res);
          

        });
      });
      
    } catch (error) {
      console.log('errorerror',error);
      commonErrors['errorTitle'] = 'getRefrenceNumber';
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_xml_not_found '+'-req param,'+invoiceNumber;
      warningMessage(commonErrors,'ebill_xml_not_found');
      fs.writeFile('assets/errorLog.txt', JSON.stringify(error), function () {
     
        resolve('');
      });
    }
}
export const getTaxListActive = async (access_token) => {

  return new Promise(async(resolve, reject) => {
        var options = {
          'method': 'GET',
          'url': `https://api.bexio.com/3.0/taxes?scope=active`,
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
          console.log("getTaxListA :: ",response.body);
          if(response.statusCode==200)
           resolve(JSON.parse(response.body));
          else
           resolve(false)

        });
      });
}
export const getContactDetails = async (access_token,id) => {    
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
        // res.send(response.body)
        //console.log(response.body);
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
      // res.send();
      resolve('');
    });
  }
}
export const setOrderId = async (id,billId) =>{
  console.log('error');

  try {
    const getcustomerIdResult = await connectBexio.documents_order_receive.updateMany({
      where: {
        cid: id,
      },
      data: {
        rk_order: billId,
        status: '2',
      },
    });
    return getcustomerIdResult
  } catch (error) {
    console.log(error);
      commonErrors['errorTitle'] = 'setOrderId';
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+billId;
      warningMessage(commonErrors,error);
    return 0;
  }
}
export function formatDate(date) {
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
export const moveFile = async (netcomId,fileName)=>{
  let formData ;
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
        //  'url':'http://192.168.2.63:5005/api/post-list/invitations',
        formData: formData
      };
      
      request(options, function (error, response) {
        if (error) {  
          commonErrors['errorTitle'] = 'moveFile';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+formData;
          warningMessage(commonErrors,error);
          resolve(false)
        }
      
        // res.send(response.body)
        //console.log(response.body);
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
export const setDeliveryNotesCidSendStatus = async (partyId,delivery_id,ordernumber,status,error?) => {
  let sendDeliveryNotesId;
  return new Promise( async function (resolve, reject) {
    try {
      console.log('partyIdpartyIdpartyId',partyId);
      console.log('delivery_iddelivery_id',delivery_id);
      const selectQryResult = await connectBexio.documents_dispatchnotification_send.findMany({
        where: {
          rk_deliverynotes: delivery_id,
          deliverynotes_type: 'EDI',
          companyregistered: {
            rk_party: Number(partyId),
          },
        },
        select: {
          cid: true, 
          companyregistered: {
            select: {
              cid: true, 
            },
          },
        },
      });

      console.log('selectQryResult',selectQryResult);
      if(selectQryResult.length == 0){
        const selectQryResultParty = await connectBexio.companyregistered.findMany({
          where: {
            rk_party: Number(partyId),
          },
        });
        console.log('selectQryResultParty',selectQryResultParty);
        
        const result = await connectBexio.documents_dispatchnotification_send.create({
          data: {
            rk_deliverynotes: delivery_id,
            deliverynotes_number: ordernumber,
            fk_companyregistered: selectQryResultParty[0].cid,
            deliverynotes_type: 'EDI',
            status: status, // assuming this is the correct type
          },
          select: {
            cid: true,
          },
        });
        console.log(result);

        sendDeliveryNotesId = result[0].cid;
      }
      else{
        sendDeliveryNotesId = selectQryResult[0].cid;
        await connectBexio.documents_dispatchnotification_send.updateMany({
          where: {
            fk_companyregistered:selectQryResult[0]?.companyregistered?.cid,
            rk_deliverynotes: delivery_id,
            deliverynotes_type: 'EDI',
          },
          data: {
            time_stamp: new Date(), // equivalent to NOW()
            status: status,        // make sure it's a string
          },
        });
      }
      resolve(sendDeliveryNotesId);
    } catch (error) {
      console.log(error);
      commonErrors['errorTitle'] = setInvoiceSendStatus.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+partyId+'-partyId'+delivery_id+'-deliveryId'+ordernumber+'orderNumber';
      warningMessage(commonErrors,error);
      resolve('');
    }
  });

}