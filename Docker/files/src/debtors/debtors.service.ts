import { Injectable } from '@nestjs/common';
import { connectBexio, connectLibrary, connectGate2b, connectNewGate2b } from '../db/prisma-clients';
import { generators } from 'openid-client'
const code_verifier = generators.codeVerifier();
const code_challenge = generators.codeChallenge(code_verifier);
import config from '../common/config/index';
import { bexioInterfaceClient } from '../common/utils/bexioClient';
import * as request from 'request';
import { Request, Response } from 'express';
const encryptionControl = require("../common/utils/jwt-decode");
import fetchEmailContent from "../common/utils/fetchEmailData";
const sendEmail = require('../common/utils/email');
const jwt = require('jsonwebtoken');
import { Prisma } from '@prisma/client';
import redisClient from '../common/utils/redisDB';
import commonErrors from '../common/utils/commonError'
import warningMessage from '../common/utils/warningMessage'
const path = require('path')
var xml2js = require('xml2js');
import { getOctConfig,getInvoiceSearch,getContactSearch,constGetContactId, deliveryNotesListCountSearch, formatDate, getAllCurrency, getBcDetails, getContactById, getContactDetails, getRecipientList, getSendInvoiceList, getTagName, getTaxListActive, invoiceCountSearch, invoiceListCountSearch, moveFile, setDeliveryNotesCidSendStatus, setInvoiceSendStatus, setOrderId, getConnectionBc, getInvoicePdf,getContactGroupList,getUnitList,getActiveAccounts,getActiveArticle, setEbillInvoiceSendStatus, markAsPending, parseResponse, getContactIdsByChannel } from 'src/common/utils/helperfn';
import { PushWorkerHost } from '../common/utils/push.worker.host';
import { SendDeliveryNotesHost } from '../common/utils/sendDeliveryNotes.host';
import connectMssql from '../db/mssql-client'
import {getInvoiceOT,getUser,getDefaultUser} from 'src/common/utils/helperfn';
import status_code from 'src/common/utils/statusCodes';


@Injectable()
export class DebtorsService {
  constructor(private readonly pushWorkerHost: PushWorkerHost, private readonly sendDeliveryNotesHost: SendDeliveryNotesHost) {}
  async getInvoice(req: Request, res: Response): Promise<any> {
   let data = req.body;
    let partyId = req.body.partyId;
    let netcomId = req.body.netcomId;
    let arrayContactIds = [],invoiceContactListIds = [],tempContact = [] ,getNotInvoiceId = [],dbInvoice,configData = {};
    let invoiceListTemp;
    try {
      let cookieData = req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME];
      if (!cookieData) {
        return res.status(500).send({
          status_code: 500,
          message: 'Missing_cookie',
          status: false,
        });
      }
      let configDetails:any = await getOctConfig(netcomId);
      console.log("configdetails:",configDetails);
      
      if(configDetails.status && configDetails.records.length > 0){
        configData =  configDetails.records[0].config.serviceStatus
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

      let resultData: any[] = [];
      let totalCount;
      let sortColumn = data.sortColumn || 'updated_at';
      let sortType = data.sort || 'asc';

      let showFrom = req.body.records_per_page * (req.body.page_number - 1);
      let showTo = req.body.page_number==1 ? 2000: req.body.records_per_page ;
      console.log('showFrom', showFrom);
      console.log('showTo', showTo);
      let resultArray: any[] = [];

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
     console.log('invoiceList', invoiceList);
        const getInviteCompanyId = await connectLibrary.$queryRaw<{ cid: number[] }[]>(
          Prisma.sql`
                    SELECT array_agg(pa.cid) AS cid 
                    FROM party_account pa 
                    WHERE pa.fk_party = ${Number(partyId)}
                  `
        );
        console.log('getInviteCompanyId',getInviteCompanyId);
        console.log('netcomId',netcomId);

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
        const bcConnectionIds = getConnectionStatusList[0]?.bcConnection || [];
        let bcDetails;
        bcDetails = await getBcDetails(bcConnectionIds, netcomId);
       console.log('bcDetails',bcDetails);
        let tempBc = [0];
        if (bcDetails?.data?.length) {
          for (const element of bcDetails.data) {
            if (element?.company_details?.doc_type?.data === 'Invoice') {
              tempBc.push(element.bc_id);
            }
          }
        }
        const getConnectionBcResult = await getConnectionBc(getInviteCompanyId[0]?.cid || [], tempBc);
        console.log('getConnectionBcResult',getConnectionBcResult);
        resultArray = getConnectionBcResult[0]?.array_agg;
        console.log('resultArray',resultArray);
      let options;
      let searchJson: any[] = [];
      let getSendInvoiceListResult;

      if (data['invoiceStatus']) {
        getSendInvoiceListResult = await getSendInvoiceList(Number(partyId),data['invoiceStatus']);
        console.log('getSendInvoiceListResult', getSendInvoiceListResult);
        
        if(getSendInvoiceListResult.length > 0) {
          if (data['invoiceStatus'] == 'sent') {
           // console.log("invoiceStatus", data['invoiceStatus']);
            const sentJson = [
              {
                field: 'kb_item_status_id',
                value: [8, 9],
                criteria: 'in',
              },
            ];

            const paidOrPendingBexioInvoices: any = await getInvoiceSearch(accessToken,sentJson);
            console.log('paidOrPendingBexioInvoices',paidOrPendingBexioInvoices);
            const paidOrPendingBexioInvoicesIds = (paidOrPendingBexioInvoices) && (paidOrPendingBexioInvoices.length > 0) ? paidOrPendingBexioInvoices.map((inv) => inv.id) : [];
            console.log('invoiceContactListIds',paidOrPendingBexioInvoicesIds);
           
              if (!getSendInvoiceListResult[0].successOrPending[0].invoiceId) {
                getSendInvoiceListResult[0].successOrPending[0].invoiceId = [];
              }

              getSendInvoiceListResult[0].successOrPending[0].invoiceId.push(...paidOrPendingBexioInvoicesIds);


            searchJson.push(
              {
                field: 'id',
                value: getSendInvoiceListResult[0].successOrPending[0].invoiceId
                  ? getSendInvoiceListResult[0].successOrPending[0].invoiceId
                  : '',
                criteria: 'in',
              },
              {
                field: 'id',
                value: getSendInvoiceListResult[1].failedGate2b[0]?.invoiceId
                  ? getSendInvoiceListResult[1].failedGate2b[0]?.invoiceId
                  : '',
                criteria: 'not_in',
              },
            );
          }
          if (data['invoiceStatus'] == 'failed') {
            searchJson.push(
            {
              "field": "id",
              "value": getSendInvoiceListResult[0]?.invoiceId ? getSendInvoiceListResult[0].invoiceId : "",
              "criteria": "in"
            });
          }
          if (data['invoiceStatus'] == 'draft') {
            console.log("invoiceStatus no", data['invoiceStatus']);
    
            searchJson.push(
            //   {
            //   "field": "contact_id",
            //   "value": resultArray == null ? "" : resultArray,
            //   "criteria": "in"
            // },
            {
              "field": "id",
              "value": getSendInvoiceListResult[0]?.invoiceId ? getSendInvoiceListResult[0].invoiceId: "",
              "criteria": "not_in"
            },
            {
              "field": "kb_item_status_id",
              "value": 7,
              "criteria": "equal"
            },
          );
          }
        }
        
      }

      console.log("Query Datas",data);
      

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
          "value": data.dateFrom,
          "criteria": ">="
        });
      }
      if (data.dateTo) {
        searchJson.push({
          "field": "is_valid_from",
          "value": data.dateTo,
          "criteria": "<="
        });
      }
      if (data['customerId'] != '' && data['customerId']) {
        searchJson.push({
          "field": "contact_id",
          "value": data.customerId,
          "criteria": "="
        });
      }
    console.log('channel',data);
    
      if("channel" in data){
  
        const getInvoiceIdRslt = await connectBexio.$queryRaw<{ cid: number[] }[]>(
          Prisma.sql`
          SELECT array_agg(rk_invoice::int) AS invoices FROM documents_invoice_send ds 
          INNER JOIN companyregistered c ON ds.fk_companyregistered = c.cid
          WHERE netcomid = ${netcomId} AND UPPER(ds.invoice_type) = UPPER(${data.channel.toUpperCase()})
          `
          );
          console.log("getInvoiceIdRslt",getInvoiceIdRslt[0]['invoices']);

          if(getInvoiceIdRslt[0]['invoices']){
            console.log('22222222222222222222222');
             dbInvoice = getInvoiceIdRslt[0]['invoices']
            let searchJson: any[] = [];
            searchJson.push({
              "field": "id",
              "value": getInvoiceIdRslt[0]['invoices'],
              "criteria": "in"
            });

            invoiceListTemp = await getInvoiceSearch(accessToken,searchJson);
          }

          console.log("invoiceListTemp",invoiceListTemp);
          if(invoiceListTemp){
            invoiceContactListIds = invoiceListTemp?.map(inv => inv.contact_id);
            console.log("invoiceContactListIds",invoiceContactListIds);
          }
       
          
          if(data.channel.toLowerCase() == 'edi'){
            tempContact = getInvoiceIdRslt[0]['contacts'] != null ? getInvoiceIdRslt[0]['contacts'] : [];
          }else if(data.channel.toLowerCase() == 'print'){
             let contactGroupList: any = await getContactGroupList(accessToken);
            const targetNames = ['Print', 'Post'];

            const ids = contactGroupList
              ?.filter(group => targetNames.includes(group.name))
              .map(group => group.id);

             console.log("contactGroupList",contactGroupList);
             let searchContactgrp: any[] = [];
              searchContactgrp.push({
                "field": "contact_group_ids",
                "value": ids,
                "criteria": "in"
              });
            let contactIds:any = await getContactSearch(accessToken,searchContactgrp);
            arrayContactIds = contactIds?.map(contact => contact.id);
              console.log("arrayContactIds",arrayContactIds);
          }
       else if(data.channel.toLowerCase() == 'email'){
             let contactGroupList: any = await getContactGroupList(accessToken);
            const targetNames = ['email'];

            const ids = contactGroupList
              ?.filter(group => targetNames.includes(group.name))
              .map(group => group.id);

             console.log("contactGroupList",contactGroupList);
             let searchContactgrp: any[] = [];
              searchContactgrp.push({
                "field": "contact_group_ids",
                "value": ids,
                "criteria": "in"
              });
            let contactIds:any = await getContactSearch(accessToken,searchContactgrp);
            arrayContactIds = contactIds?.map(contact => contact.id);
              console.log("arrayContactIds",arrayContactIds);
          }
           else if(data.channel.toLowerCase() == 'ebill'){
             let contactGroupList: any = await getContactGroupList(accessToken);
            const targetNames = ['ebill'];

            const ids = contactGroupList
              ?.filter(group => targetNames.includes(group.name))
              .map(group => group.id);

             console.log("contactGroupList",contactGroupList);
             let searchContactgrp: any[] = [];
              searchContactgrp.push({
                "field": "contact_group_ids",
                "value": ids,
                "criteria": "in"
              });
            let contactIds:any = await getContactSearch(accessToken,searchContactgrp);
            arrayContactIds = contactIds?.map(contact => contact.id);
              console.log("arrayContactIds",arrayContactIds);
          }
      }
      console.log("arrayContactIds1111111111",arrayContactIds);
      console.log("arrayContactIds1111111111",invoiceContactListIds);
      if(arrayContactIds.length != 0 || invoiceContactListIds.length != 0){
        let tempArray = [...arrayContactIds,...invoiceContactListIds]
        if(data.channel.toLowerCase() == 'edi' || data.channel.toLowerCase() == 'print'||data.channel.toLowerCase() == 'email' || data.channel.toLowerCase() == 'ebill'){
           const getNotInvoiceIdRslt = await connectBexio.$queryRaw<{ cid: number[] }[]>(
          Prisma.sql`
          SELECT array_agg(rk_invoice::int) AS invoices FROM documents_invoice_send ds 
          INNER JOIN companyregistered c ON ds.fk_companyregistered = c.cid
          WHERE netcomid = ${netcomId} AND UPPER(ds.invoice_type) != UPPER(${data.channel.toUpperCase()})
          `
          );
          getNotInvoiceId = getNotInvoiceIdRslt[0]['invoices'];

          tempArray = [...tempArray,...tempContact]
        searchJson.push({
          "field": "contact_id",
          "value": tempArray,
          "criteria": "in"
        });
        
        if(getNotInvoiceId?.length > 0)
          searchJson.push({
            "field": "id",
            "value": getNotInvoiceId,
            "criteria": "not_in"
          });
      }else{
        if(dbInvoice){
          searchJson.push({
            "field": "id",
            "value": dbInvoice,
            "criteria": "in"
          });
        }
        
      }

      }
      let resData: any[] = [];
      console.log('searchJson:::',searchJson);
      if (searchJson.length > 0) {
      console.log('searchJson 2:::',searchJson);

          // totalCount = await invoiceCountSearch(accessToken, searchJson, 0, 2000);
          options = {
            'method': 'POST',
            'url': `${config.BEXIO_API}2.0/kb_invoice/search/?limit=${showTo}&offset=${showFrom}&order_by=${sortColumn}_${sortType}`,
            'headers': {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + accessToken
            },
            body: JSON.stringify(searchJson)
          };
          console.log("optionsoptions",options);
          
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

        console.log('resData', resData);

        const parseResponse = (response: any) => {
          if (response) {
            try {
              console.log('response:: type', typeof response);
              console.log('response:: type', response);
              // let parsedData = JSON.parse(response);
              // let parsedData = response;
              // console.log("response:: parsedData",response)
              if (Array.isArray(response)) {
                return response;
              } else if (
                response &&
                typeof response === 'object' &&
                response.message
              ) {
                return [];
              } else {
                return [];
              }
            } catch (error) {
              console.error('Error parsing response:', error);
            }
          }
          return [];
        };
          
        const parsed = JSON.parse(response.body) as any[];
        const perPage = Number(req.body.records_per_page);
        console.log('parsed', parsed.length);
        console.log('isarray:', Array.isArray(parsed));
        console.log('perPage', perPage);
        console.log('perPage', perPage);
        if (Array.isArray(parsed) && parsed.length > perPage) {
          totalCount = parsed.length;
          console.log('entered in if', totalCount);
          resData = parseResponse(parsed.slice(0, perPage));
        } else {
          console.log('entered in else', parsed.length);
          resData = parseResponse(parsed.slice(0, perPage));
          totalCount =
            req.body.page_number != 1
              ? Number(req.body.totalCount)
              : parsed.length | 0;
        }

      } else {
          // let totalCountInvoiceList = await invoiceListCountSearch(accessToken, 0, 2000) as number;
          // let totalCountInvoiceCount = await invoiceCountSearch(accessToken, searchJson, 0, 2000) as number;
          // totalCount = totalCountInvoiceList + totalCountInvoiceCount;
          console.log('searchJson:',searchJson);          

          const getOptions = {
            'method': 'GET',
            'url': `${config.BEXIO_API}2.0/kb_invoice/?limit=${showTo}&offset=${showFrom}&order_by=${sortColumn}_${sortType}`,
            'headers': {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + accessToken
            }
          };

          const parseResponse = (response: any) => {
            if (response) {
              try {
                console.log("response:: type", typeof response)
                console.log("response:: type",response)
                // let parsedData = JSON.parse(response);
                // let parsedData = response;
                // console.log("response:: parsedData",response)
                if (Array.isArray(response)) {
                  return response;
                } else if (response && typeof response === "object" && response.message) {
                return [];
                }else{
                  return [];

                }
              } catch (error) {
                console.error("Error parsing response:", error);
              }
            }
            return [];
          };

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
          console.log('getOptions',getOptions);

          console.log('getResponse',getResponse.statusCode);
          // console.log('getResponse message',getResponse);
         
          if (getResponse.statusCode == 401) {
            return res.status(401).json({
              status: true,
              data: [],
              message: "unauthorized",
            });
          }
        else if (getResponse.statusCode == 200) {
          const parsed = JSON.parse(getResponse.body) as any[];
          const perPage = Number(req.body.records_per_page);
          console.log('parsed', parsed.length);
          console.log("isarray:",Array.isArray(parsed));          
          console.log('perPage', perPage);
          console.log('perPage', perPage);
          if (Array.isArray(parsed) && (parsed.length > perPage)) {
            totalCount = parsed.length ;

            console.log('entered in if',totalCount);
            
            resData = parseResponse(parsed.slice(0, perPage));
          } else {
            console.log('entered in else',parsed.length);
            
            resData = parseResponse(parsed.slice(0, perPage));
            totalCount = req.body.page_number !=1? Number(req.body.totalCount): parsed.length | 0;
          }
        }

        else {
          console.log('getResponse', getResponse);
          console.log('getResponse body', getResponse.body);
          console.log('getResponse status', getResponse.statusCode);
          return res.status(getResponse.statusCode).json({
            status: true,
            data: getResponse.body,
            message: getResponse.statusMessage,
          });

        }
      }

      if (resData && resData.length > 0) {
          let status = JSON.parse(config.BEXIO_INVOICE_STATUS || '');
          let contact_idList: any = [];
          console.log('resultArrayresultArrayresultArray',resultArray);
        
          for (let invoice in resData) {
          resData[invoice]['allowSend'] =  true;
          // resData[invoice]['allowSend'] = resData[invoice]['isEbill'] ? true : resultArray?.map(Number).includes(Number(resData[invoice].contact_id)) ? true : true;
            contact_idList.push((resData[invoice].contact_id));
            resData[invoice]['statusLabel'] = status[resData[invoice].kb_item_status_id];
            resData[invoice]['timestamp'] = '';
            resData[invoice]['rk_globaltransaction'] = '';
            resData[invoice]['status'] = '';
            resData[invoice]['statusLabelInvoice'] = '';
            resData[invoice]['invoice_type'] = resultArray?.includes(resData[invoice].contact_id) ? 'EDI' : ''; 
            for (let qryInvoice in invoiceList) {
              if (invoiceList[qryInvoice]['rk_invoice'] == resData[invoice]['id']) {
                resData[invoice]['rk_globaltransaction'] = invoiceList[qryInvoice]['rk_globaltransaction'];
                resData[invoice]['status'] = invoiceList[qryInvoice]['status'];
                resData[invoice]['statusLabelInvoice'] = JSON.parse(config.INVOICE_STATUS || '')[invoiceList[qryInvoice]['status'] || ''];
                resData[invoice]['timestamp'] = invoiceList[qryInvoice]['time_stamp'];
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
        
        // Fetch the contact group list using the provided access token
        let contactGroupList: any = await getContactGroupList(accessToken);

        // If contact group list could not be retrieved, return 500 error response
        if (!contactGroupList) {
          return res.status(500).send({
              status: 500,
              data: []
          });
        }
                // Build lookup maps for fast enrichment
                const contactNameMap = new Map(contactList.map(e => [e.id, `${e.name_1 || ''}${e.name_2 ? ' ' + e.name_2 : ''}`]));
                const contactEmailMap = new Map(contactList.map(e => [e.id, e.mail || '']));
                const contactAddressExistMap = new Map(contactList.map(e => [e.id, !!(e?.name_1 && e?.street_name && e?.city && e?.country_id && e?.postcode)]));
                const contactGroupMap = new Map(
                  contactList.map(e => [
                    e.id,
                    e.contact_group_ids
                      ? e.contact_group_ids.split(',').map(id => contactGroupList.find(role => role.id === Number(id))?.name.toLowerCase()).filter(Boolean)
                      : []
                  ])
                );
          const currencyArr: any[] = await getAllCurrency(accessToken) as any[];
          const currencyMap = new Map(currencyArr.map(e => [e.id, e.name]));
          const recipientArr: any[] = await getRecipientList(req.body.netcomId, contact_idList) as any[];
          const recipientMap = new Map(recipientArr.map(e => [e.rk_contact, e.recipient_id]));

                // Enrich resultData efficiently
                resultData = resultData.map(second => {
                  const contactId = second["contact_id"];
                  const currencyId = second["currency_id"];
                  const groupNamesRaw = contactGroupMap.get(contactId);
                  const groupNames: string[] = Array.isArray(groupNamesRaw) ? groupNamesRaw : [];
                  let invoiceType = second.invoice_type;
                  let autoTag = second.auto_tag;

                  // Auto-tag logic
                  if (!invoiceType && groupNames.length) {
                    if (groupNames.includes('ebill')) invoiceType = 'ebill';
                    else if (groupNames.includes('email')) invoiceType = 'email';
                    else if (groupNames.includes('print') || groupNames.includes('post')) invoiceType = 'print';
                    autoTag = true;
                  }

                  return {
                    ...second,
                    companyName: contactNameMap.get(contactId) || '',
                    currency: currencyMap.get(currencyId) || '',
                    email: contactEmailMap.get(contactId) || '',
                    recipient_id: recipientMap.get(contactId) || '',
                    address_exist: contactAddressExistMap.get(contactId) || false,
                    invoice_type: invoiceType || '',
                    auto_tag: autoTag || false
                  };
                });

          let redisKey = req.body.partyId + "_" + req.url + "_";
        let keys = Object.keys(req.body);
          keys.forEach(element => {
          redisKey = req.body[element] ? redisKey + element + ':' + req.body[element] + '_' : redisKey;
          });
        
          await redisClient.set(redisKey, JSON.stringify({
            status: 200,
            data: resultData,
            configStatus:configData,
            totalCount: totalCount
          }), {
          EX: 24 * 60 * 60 * 2
          });

        return res.send({
            status: 200,
            data: resultData,
            totalCount: totalCount,
            configStatus:configData,
        });
      }else if(resultData.length === 0){
        
        return res.status(200).json({
            status: true,
            data: [],
            totalCount: totalCount
        });
      }else{
        throw new Error("resultData undefined")
      } 
    } catch (error) {
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString();
      warningMessage(commonErrors, error);

      return res.status(500).json({ 
        status: 500, 
        message: 'something_went_wrong' 
      });
    }
  }

  async getInvoiceTest(req: Request, res: Response): Promise<any> {
    let data = req.body;
    let partyId = data.partyId;
    let netcomId = data.netcomId;
    let arrayContactIds = [],invoiceContactListIds = [],tempContact = [] ,getNotInvoiceId = [],dbInvoice,configData = {};
    let invoiceListTemp;
    try {
      let cookieData = req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME];
      if (!cookieData) {
        return res.status(500).send({
          status_code: 500,
          message: 'Missing_cookie',
          status: false,
        });
      }
      let configDetails:any = await getOctConfig(netcomId);
      console.log("configdetails:",configDetails);
      
      if(configDetails.status && configDetails.records.length > 0){
        configData =  configDetails.records[0].config.serviceStatus
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

      let resultData: any[] = [];
      let totalCount;
      let sortColumn = data.sortColumn || 'updated_at';
      let sortType = data.sort || 'asc';

      let showFrom = data.records_per_page * (data.page_number - 1);
      let showTo = data.page_number==1 ? 2000: data.records_per_page ;
      console.log('showFrom', showFrom);
      console.log('showTo', showTo);
      let resultArray: any[] = [];

      const invoiceList = await connectBexio.documents_invoice_send.findMany({
        where: {
          companyregistered: {
            rk_party: Number(data?.partyId)
          }
        },
        include: {
          companyregistered: true
        }
      });

        const getInviteCompanyId = await connectLibrary.$queryRaw<{ cid: number[] }[]>(
          Prisma.sql`
                    SELECT array_agg(pa.cid) AS cid 
                    FROM party_account pa 
                    WHERE pa.fk_party = ${Number(partyId)}
                  `
        );
        console.log('getInviteCompanyId',getInviteCompanyId,);
        console.log('getInviteCompanyId',netcomId);

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
        bcDetails = await getBcDetails(bcConnectionIds, netcomId);

        let tempBc = [0];
        if (bcDetails?.data?.length) {
          for (const element of bcDetails.data) {
            if (element?.company_details?.doc_type?.data === 'Invoice') {
              tempBc.push(element.bc_id);
            }
          }
        }
        const getConnectionBcResult = await getConnectionBc(getInviteCompanyId[0]?.cid || [], tempBc);
        resultArray = getConnectionBcResult[0]?.array_agg;
     

      let options;
      let searchJson: any[] = [];
      let getSendInvoiceListResult;

      if (data['invoiceStatus']) {
        getSendInvoiceListResult = await getSendInvoiceList(Number(partyId),data['invoiceStatus']);
        console.log('getSendInvoiceListResult', getSendInvoiceListResult);
        
        if(getSendInvoiceListResult.length > 0) {
          if (data['invoiceStatus'] == 'sent') {
           // console.log("invoiceStatus", data['invoiceStatus']);
            const sentJson = [
              {
                field: 'kb_item_status_id',
                value: [8, 9],
                criteria: 'in',
              },
            ];

            const paidOrPendingBexioInvoices: any = await getInvoiceSearch(accessToken,sentJson);
            const paidOrPendingBexioInvoicesIds = (paidOrPendingBexioInvoices) && (paidOrPendingBexioInvoices.length > 0) ? paidOrPendingBexioInvoices.map((inv) => inv.id) : [];
            console.log('invoiceContactListIds',paidOrPendingBexioInvoicesIds);
           
              if (!getSendInvoiceListResult[0].successOrPending[0].invoiceId) {
                getSendInvoiceListResult[0].successOrPending[0].invoiceId = [];
              }

              getSendInvoiceListResult[0].successOrPending[0].invoiceId.push(...paidOrPendingBexioInvoicesIds);


            searchJson.push(
              {
                field: 'id',
                value: getSendInvoiceListResult?.[0]?.successOrPending?.[0]?.invoiceId || '',
                criteria: 'in',
              },
              {
                field: 'id',
                value: getSendInvoiceListResult?.[1]?.failedGate2b?.[0]?.invoiceId|| '',
                criteria: 'not_in',
              },
            );
          }
          if (data['invoiceStatus'] == 'failed') {
            searchJson.push(
            {
              "field": "id",
              "value": getSendInvoiceListResult?.[0]?.invoiceId || "",
              "criteria": "in"
            });
          }
          if (data['invoiceStatus'] == 'draft') {
            console.log("invoiceStatus no", data['invoiceStatus']);
    
            searchJson.push(
            //   {
            //   "field": "contact_id",
            //   "value": resultArray == null ? "" : resultArray,
            //   "criteria": "in"
            // },
            {
              "field": "id",
              "value": getSendInvoiceListResult?.[0]?.invoiceId ||"",
              "criteria": "not_in"
            },
            {
              "field": "kb_item_status_id",
              "value": 7,
              "criteria": "equal"
            },
          );
          }
        }
        
      }

      console.log("Query Datas",data);
      

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
          "value": data.dateFrom,
          "criteria": ">="
        });
      }
      if (data.dateTo) {
        searchJson.push({
          "field": "is_valid_from",
          "value": data.dateTo,
          "criteria": "<="
        });
      }
      if (data['customerId'] != '' && data['customerId']) {
        searchJson.push({
          "field": "contact_id",
          "value": data.customerId,
          "criteria": "="
        });
      }
    console.log('channel',data);
    
      if("channel" in data){
  
        const getInvoiceIdRslt = await connectBexio.$queryRaw<{ cid: number[] }[]>(
          Prisma.sql`
          SELECT array_agg(rk_invoice::int) AS invoices FROM documents_invoice_send ds 
          INNER JOIN companyregistered c ON ds.fk_companyregistered = c.cid
          WHERE netcomid = ${netcomId} AND UPPER(ds.invoice_type) = UPPER(${data.channel.toUpperCase()})
          `
          );
          console.log("getInvoiceIdRslt",getInvoiceIdRslt[0]['invoices']);

          if(getInvoiceIdRslt[0]['invoices']){
            console.log('22222222222222222222222');
            dbInvoice = getInvoiceIdRslt[0]['invoices']
            let searchJson: any[] = [];
            searchJson.push({
              "field": "id",
              "value": getInvoiceIdRslt[0]['invoices'],
              "criteria": "in"
            });

            invoiceListTemp = await getInvoiceSearch(accessToken,searchJson);
          }

          console.log("invoiceListTemp",invoiceListTemp);
          if(invoiceListTemp){
            invoiceContactListIds = invoiceListTemp?.map(inv => inv.contact_id);
            console.log("invoiceContactListIds",invoiceContactListIds);
          }
       
          
          if(data.channel.toLowerCase() == 'edi'){
            tempContact = getInvoiceIdRslt[0]['contacts'] != null ? getInvoiceIdRslt[0]['contacts'] : [];
          }else if(data.channel.toLowerCase() == 'print'){
            arrayContactIds =await getContactIdsByChannel(accessToken,"print");
            console.log("arrayContactIds",arrayContactIds);
          }
       else if(data.channel.toLowerCase() == 'email'){
            arrayContactIds = await getContactIdsByChannel(accessToken,"email");
              console.log("arrayContactIds",arrayContactIds);
          }
           else if(data.channel.toLowerCase() == 'ebill'){
            arrayContactIds = await getContactIdsByChannel(accessToken,"ebill");
              console.log("arrayContactIds",arrayContactIds);
          }
      }
      
      console.log("invoiceContactListIds",invoiceContactListIds);
      if(arrayContactIds.length != 0 || invoiceContactListIds.length != 0){
        let tempArray = [...arrayContactIds,...invoiceContactListIds]
        if(data.channel.toLowerCase() == 'edi' || data.channel.toLowerCase() == 'print'||data.channel.toLowerCase() == 'email' || data.channel.toLowerCase() == 'ebill'){
           const getNotInvoiceIdRslt = await connectBexio.$queryRaw<{ cid: number[] }[]>(
          Prisma.sql`
          SELECT array_agg(rk_invoice::int) AS invoices FROM documents_invoice_send ds 
          INNER JOIN companyregistered c ON ds.fk_companyregistered = c.cid
          WHERE netcomid = ${netcomId} AND UPPER(ds.invoice_type) != UPPER(${data.channel.toUpperCase()})
          `
          );
          getNotInvoiceId = getNotInvoiceIdRslt[0]['invoices'];
          console.log("getNotInvoiceIdRslt",getNotInvoiceIdRslt);
         console.log("getNotInvoiceId",getNotInvoiceId);
          tempArray = [...tempArray,...tempContact]
        searchJson.push({
          "field": "contact_id",
          "value": tempArray,
          "criteria": "in"
        });
        
        if(getNotInvoiceId?.length > 0)
          searchJson.push({
            "field": "id",
            "value": getNotInvoiceId,
            "criteria": "not_in"
          });
      }else{
        if(dbInvoice){
          searchJson.push({
            "field": "id",
            "value": dbInvoice,
            "criteria": "in"
          });
        }  
      }

      }
      let resData: any[] = [];
      console.log('searchJson 2:::',searchJson);
      const isSearch=searchJson.length > 0
      let url = isSearch
                ? `${config.BEXIO_API}2.0/kb_invoice/search/?limit=${showTo}&offset=${showFrom}&order_by=${sortColumn}_${sortType}`
                : `${config.BEXIO_API}2.0/kb_invoice/?limit=${showTo}&offset=${showFrom}&order_by=${sortColumn}_${sortType}`;

      options = {
            'method': isSearch?'POST' :'GET',
            'url': url,
            'headers': {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + accessToken
            },
          };

      if (isSearch) {
       options.body = JSON.stringify(searchJson);
      }
      const response = await new Promise<any>((resolve, reject) => {
          request(options, (error, response) => {
            if (error) reject(error);
            else resolve(response);
          });
        });
      
      if(response.statusCode==401){
        return res.status(401).json({
                status: true,
                data: [],
                message: 'unauthorized',
              });
      }else if(response.statusCode==200){       
          const parsed=JSON.parse(response.body)as any[]
          const perPage = Number(data.records_per_page);
          console.log('parsed------', parsed);
        console.log('perPage========', perPage);

        if(Array.isArray(parsed) && parsed.length>perPage){
          console.log('entered in if',totalCount);
          totalCount = parsed.length;
          resData = parseResponse(parsed.slice(0, perPage));
        }else {
          console.log('entered in else',totalCount);
          resData = parseResponse(parsed.slice(0, perPage));
          totalCount =
          data.page_number != 1
                ? Number(data.totalCount)
                : parsed.length | 0;
        }
      
      } else {
          console.log('getResponse', response);
          console.log('response body', response.body);
          console.log('response status', response.statusCode);
          return res.status(response.statusCode).json({
            status: true,
            data: response.body,
            message: response.statusMessage,
          });

      }

      if (resData && resData.length > 0) {
          let status = JSON.parse(config.BEXIO_INVOICE_STATUS || '');
          let contact_idList: any = [];
          console.log('resultArrayresultArrayresultArray',resultArray);
        
          for (let invoice in resData) {
          resData[invoice]['allowSend'] =  true;
          // resData[invoice]['allowSend'] = resData[invoice]['isEbill'] ? true : resultArray?.map(Number).includes(Number(resData[invoice].contact_id)) ? true : true;
            contact_idList.push((resData[invoice].contact_id));
            resData[invoice]['statusLabel'] = status[resData[invoice].kb_item_status_id];
            resData[invoice]['timestamp'] = '';
            resData[invoice]['rk_globaltransaction'] = '';
            resData[invoice]['status'] = '';
            resData[invoice]['statusLabelInvoice'] = '';
            resData[invoice]['invoice_type'] = resultArray?.includes(resData[invoice].contact_id) ? 'EDI' : ''; 
            for (let qryInvoice in invoiceList) {
              if (invoiceList[qryInvoice]['rk_invoice'] == resData[invoice]['id']) {
                resData[invoice]['rk_globaltransaction'] = invoiceList[qryInvoice]['rk_globaltransaction'];
                resData[invoice]['status'] = invoiceList[qryInvoice]['status'];
                resData[invoice]['statusLabelInvoice'] = JSON.parse(config.INVOICE_STATUS || '')[invoiceList[qryInvoice]['status'] || ''];
                resData[invoice]['timestamp'] = invoiceList[qryInvoice]['time_stamp'];
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
        
        // Fetch the contact group list using the provided access token
        let contactGroupList: any = await getContactGroupList(accessToken);

        // If contact group list could not be retrieved, return 500 error response
        if (!contactGroupList) {
          return res.status(500).send({
              status: 500,
              data: []
          });
        }
                // Build lookup maps for fast enrichment
                const contactNameMap = new Map(contactList.map(e => [e.id, `${e.name_1 || ''}${e.name_2 ? ' ' + e.name_2 : ''}`]));
                const contactEmailMap = new Map(contactList.map(e => [e.id, e.mail || '']));
                const contactAddressExistMap = new Map(contactList.map(e => [e.id, !!(e?.name_1 && e?.street_name && e?.city && e?.country_id && e?.postcode)]));
                const contactGroupMap = new Map(
                  contactList.map(e => [
                    e.id,
                    e.contact_group_ids
                      ? e.contact_group_ids.split(',').map(id => contactGroupList.find(role => role.id === Number(id))?.name.toLowerCase()).filter(Boolean)
                      : []
                  ])
                );
          const currencyArr: any[] = await getAllCurrency(accessToken) as any[];
          const currencyMap = new Map(currencyArr.map(e => [e.id, e.name]));
          const recipientArr: any[] = await getRecipientList(req.body.netcomId, contact_idList) as any[];
          const recipientMap = new Map(recipientArr.map(e => [e.rk_contact, e.recipient_id]));

                // Enrich resultData efficiently
                resultData = resultData.map(second => {
                  const contactId = second["contact_id"];
                  const currencyId = second["currency_id"];
                  const groupNamesRaw = contactGroupMap.get(contactId);
                  const groupNames: string[] = Array.isArray(groupNamesRaw) ? groupNamesRaw : [];
                  let invoiceType = second.invoice_type;
                  let autoTag = second.auto_tag;

                  // Auto-tag logic
                  if (!invoiceType && groupNames.length) {
                    if (groupNames.includes('ebill')) invoiceType = 'ebill';
                    else if (groupNames.includes('email')) invoiceType = 'email';
                    else if (groupNames.includes('print') || groupNames.includes('post')) invoiceType = 'print';
                    autoTag = true;
                  }

                  return {
                    ...second,
                    companyName: contactNameMap.get(contactId) || '',
                    currency: currencyMap.get(currencyId) || '',
                    email: contactEmailMap.get(contactId) || '',
                    recipient_id: recipientMap.get(contactId) || '',
                    address_exist: contactAddressExistMap.get(contactId) || false,
                    invoice_type: invoiceType || '',
                    auto_tag: autoTag || false
                  };
                });

        let redisKey = req.body.partyId + "_" + req.url + "_";
        let keys = Object.keys(req.body);
          keys.forEach(element => {
          redisKey = req.body[element] ? redisKey + element + ':' + req.body[element] + '_' : redisKey;
          });
        
          await redisClient.set(redisKey, JSON.stringify({
            status: 200,
            data: resultData,
            configStatus:configData,
            totalCount: totalCount
          }), {
          EX: 24 * 60 * 60 * 2
          });

        return res.send({
            status: 200,
            data: resultData,
            totalCount: totalCount,
            configStatus:configData,
        });
      }else if(resultData.length === 0){
        
        return res.status(200).json({
            status: true,
            data: [],
            totalCount: totalCount
        });
      }else{
        throw new Error("resultData undefined")
      } 
    } catch (error) {
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString();
      warningMessage(commonErrors, error);

      return res.status(500).json({ 
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

            console.log("Deptors Order response--------------",response);
            
            if(response.statusCode === 401)
            {
              return res.status(401).json({
                status: 'fail',
                message: 'unauthorized',
              })
            }


            if(response.statusCode != 200)
            {
              return res.status(200).json({
                data:[],
                totalCount:0
            });
            }
            contacts = JSON.parse(response.body);
           console.log('contacts',contacts);
            
            const getRegisteredId = await connectBexio.companyregistered.findMany({
              where: {
                rk_party: Number(data.partyId), // Equivalent to `WHERE rk_party = $1`
              },
              select: {
                cid: true, // Selects only `cid`
              },
            });
             console.log('getRegisteredId',getRegisteredId);
            
            const validDate = (date) => {
              const parsedDate = new Date(date);
              return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
            };
            
            const orderList = await connectBexio.documents_order_receive.findMany({
              where: {
                fk_companyregistered: getRegisteredId[0]?.cid,
                created_date: {
                  gte: data.startDate,
                  lte: data.endDate,
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
            
           console.log("orderList:", orderList);
            const orderListCount = await connectBexio.documents_order_receive.count({
              where: {
                fk_companyregistered: getRegisteredId[0]?.cid,
                created_date: {
                  gte: data.startDate,
                  lte: data.endDate,
                },
                rk_order: data.documentNo?.trim()
                  ? { contains: data.documentNo.trim(), mode: "insensitive" }
                  : undefined,
                ...(data.orderStatus === "Yes" ? { rk_order: { not: null } } : {}),
                ...(data.orderStatus === "No" ? { rk_order: null } : {}),
              },
            });
            console.log("Total Orders:", orderListCount);
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

    console.log("getDeliveryNotesList");  
    let cookie = null;
    let data = req.body;
    let partyId = req.body.partyId;
    
    let netcomId;
    console.log("req.body ",req.body);  
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
       console.log('deliveryNotesList',deliveryNotesList);
            

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
      console.log('getInviteCompanyId.rows[0].cid',getInviteCompanyId);
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
     console.log('getConnectionStatusList',getConnectionStatusList);
      const bcConnectionIds = getConnectionStatusList[0]?.bcConnection || [];
      let bcDetails;
      bcDetails = await getBcDetails(bcConnectionIds, getNetcomId[0].netcomid);

      console.log('bcDetails',bcDetails);

      let tempBc = [0];
    
      if(bcDetails?.data?.length){
        for (let index = 0; index < bcDetails['data'].length; index++) {
          const element = bcDetails['data'][index];
          //console.log("element :: ",element);      
          if(element['company_details']['doc_type']['data'] == 'DispatchNotification'){
            tempBc.push(element['bc_id'])
          }      
        }
      }
      
     

    //   const getConnectionBc = await connectBexio.$queryRaw<{array_agg: number[]}[]>(Prisma.sql`
    //   SELECT array_agg(rk_sendercontactid::int)
    //   FROM contact_bc cb
    //   WHERE cb.rk_party_account = ANY(ARRAY[${Prisma.join(getInviteCompanyId[0]?.cid || [])}])
    //   AND cb.type = 'EDI'
    //   ${tempBc.length ? Prisma.sql`AND cb.rk_businessconnection = ANY(ARRAY[${Prisma.join(tempBc)}])` : Prisma.empty}
    //   AND cb.rk_businessconnection IS NOT NULL
    // `);
    // //console.log('getConnectionBc',getConnectionBc);
    // let resultArray = getConnectionBc[0]?.array_agg;
    let resultArray=await getConnectionBc(getInviteCompanyId[0]?.cid || [], tempBc);
  console.log('resultArray',resultArray);

      if(isBexioUser){
         var options
        totalCount = await deliveryNotesListCountSearch(accessToken,0,2000);
        console.log('totalCount',totalCount);
        if(data.documentNo){
            let docNumber = data.documentNo;
          if (docNumber.includes('-')) {
            docNumber = docNumber.split('-')[1]; // take part after '-'
          }
          options = {
                    'method': 'GET',
                    // 'url': `${config.BEXIO_API}2.0/kb_delivery`,
                    'url': `${config.BEXIO_API}2.0/kb_delivery/${docNumber}`,
                    'headers': {
                      'Accept': 'application/json',
                      'Authorization': 'Bearer '+accessToken
                    }
            
                  }; 
        }
        else{
         options = {
          'method': 'GET',
          // 'url': `${config.BEXIO_API}2.0/kb_delivery`,
          'url': `${config.BEXIO_API}2.0/kb_delivery/?limit=${showTo}&offset=${showFrom}&order_by=updated_at_desc`,
          'headers': {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+accessToken
          }
  
        };   
        } 
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
        let resData = Array.isArray(JSON.parse(response.body))?JSON.parse(response.body):[JSON.parse(response.body)];    
        console.log('resData', resData);

// console.log('resData', resData);
          if(response.statusCode != 200)
            return res.status(response.statusCode).json({
            status: false,
            message: 'unauthorized',
            });
          let status = JSON.parse(config.BEXIO_ITEM_STATUS);
          for (let deliveryNotes in resData) {
            // console.log('**********************',typeof resData[deliveryNotes])
            // console.log('**********************', resData[deliveryNotes].contact_id)
             if (typeof resData[deliveryNotes] !== 'object' ) {
    continue;
  }
            tempStatus = false;
            // resData[deliveryNotes]['allowSend'] =  true;
            console.log('resultArray deliveryNotes',resultArray);
            console.log('test',resultArray?.includes((resData[deliveryNotes]?.contact_id)));
              console.log('**********************', resData[deliveryNotes]?.contact_id)
            resultArray?resData[deliveryNotes]['allowSend'] = resultArray[0]?.array_agg.includes((resData[deliveryNotes].contact_id)) ? true:false:false;
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
  // async sendInvoice(req: Request, res: Response): Promise<any> {
  //   const data = req.body;
  //   const bexioClient = await bexioInterfaceClient();
  //   const combinedResponse: any = {
  //     otherInvoiceResults: [],
  //     emailInvoice: [],
  //     ediResults: [],
  //     ebillResults: []
  //   };

  //   try {
  //     // Ensure arrays
  //    let autoTag = false
  //    const ebillProcessed: any[] = [];
  //     data.invoices = data.invoices ? JSON.parse(data.invoices) : [];
  //     data.printInvoices = data.printInvoices ? JSON.parse(data.printInvoices) : [];
  //     data.otherInvoice = data.otherInvoice ? JSON.parse(data.otherInvoice) : [];
  //     data.emailInvoices = data.emailInvoices ? JSON.parse(data.emailInvoices) : [];
  //     data.ebillInvoices = data.ebillInvoices ? JSON.parse(data.ebillInvoices) : [];
  //     console.log("invoices", data.invoices);
  //     console.log("printInvoices", data.printInvoices);
  //     console.log("otherInvoice", data.otherInvoice);
  //     console.log("emailInvoices", data.emailInvoices);
  //     console.log("ebillInvoices", data.ebillInvoices);
  //     // ------------------------------
  //     // 1. Process Autotag Print Invoices
  //     // ------------------------------
  //  console.log("printInvoiceslength", data.printInvoices.length);
  //     console.log("otherInvoicelength", data.otherInvoice.length);
  //     console.log("emailInvoiceslength", data.emailInvoices.length);
  //     console.log("ebillInvoiceslength", data.ebillInvoices.length);
  //     if (data.printInvoices.length) {
  //       for (const item of data.printInvoices) {
  //         const processedInvoice = await this.processPrintInvoice(item, data, req);
  //          console.log("processedInvoice", processedInvoice);
  //         combinedResponse.otherInvoiceResults.push(processedInvoice);
  //       }
  //     }
  //     // ------------------------------
  //     // 2. Process Other Invoices (check tags: email, print, ebill)
  //     // ------------------------------
  //     if (data.otherInvoice.length) {

  //       let getTag: any = await getTagName(data.netcomId,data.otherInvoice,autoTag);
  //        console.log("getTag", getTag);
  //         console.log("combinedResponse", combinedResponse);
  //       combinedResponse.otherInvoiceResults = [
  //         ...(combinedResponse.otherInvoiceResults || []),
  //         ...(getTag?.data || [])
  //       ];
       
  //       console.log("processInvoicesXXX1", combinedResponse);
  //       for (const item of getTag?.data || []) {
  //         const invoice = data.otherInvoice.find(inv => inv.doc_id === item.doc_id);
  //         if (!invoice) continue;

  //         switch (item.tag) {
  //           case 'email':
  //             console.log("getTagemail", getTag);
  //             const emailResult = await this.processEmailInvoice(invoice, data, req);
  //             console.log("emailResult", emailResult);
  //            // combinedResponse.emailInvoice.push(emailResult);
  //            // combinedResponse.otherInvoiceResults.push(emailResult);
  //               console.log("emailResultcombinedResponse", combinedResponse);
  //             break;
  //           case 'print':
  //               console.log("getTagprint", getTag);
  //             const printResult = await this.processPrintInvoice(invoice, data, req);
  //               console.log("printResult", printResult);
  //           //  combinedResponse.emailInvoice.push(printResult);
  //            // combinedResponse.otherInvoiceResults.push(printResult);
  //              console.log("printResultcombinedResponse", combinedResponse);
  //             break;
  //           case 'ebill':
  //             console.log("getTagebill", getTag);
  //             invoice.allow = item.allow;
  //               console.log("invoice.allow", invoice.allow);
  //             const ebillResult = await this.processEbillInvoice(invoice, data, bexioClient);
  //             console.log("ebillResult", ebillResult);
  //             ebillProcessed.push(...ebillResult);
  //             console.log("ebillProcessed", ebillProcessed);
  //             break;
  //         }
  //       }
  //     }
  //     // ------------------------------
  //     // 3. Process Autotag Email Invoices
  //     // ------------------------------
  //       if (data.emailInvoices.length) {
  //     for (const invoice of data.emailInvoices) {
  //       const result = await this.processEmailInvoice(invoice, data, req);
  //        console.log("emailResultss", result);
  //       combinedResponse.otherInvoiceResults.push(result);
  //           console.log("emailResultsscombinedResponse", combinedResponse);
  //     }
  //   }
  //     // ------------------------------
  //     // 4. Process Autotag eBill Invoices
  //          if (data.ebillInvoices.length) {
  //           //  Call getTagName API
  //           autoTag = true
  //           const getTag: any = await getTagName(data.netcomId, data.ebillInvoices,autoTag);
  //           console.log("getTag result:", getTag);

  //           //  Find if any tag is 'ebill'
  //           const billTagItem = getTag?.data?.find((item: any) => item.tag === 'ebill');
  //            if (billTagItem) {
  //              for (const invoice of data.ebillInvoices) {
  //                invoice.allow = billTagItem.allow;
  //                console.log(`Set allow for invoice ${invoice.doc_id}:`, invoice.allow);
  //              }
  //            } else {
  //              console.log('No eBill tag found. Invoices will be processed with allow undefined (skipped automatically).');
  //            }
  //           // Process all eBill invoices (skips invoices where allow=false or undefined)
  //           const results = await this.processEbillInvoices(data, bexioClient);
  //           results.forEach(data => combinedResponse.otherInvoiceResults.push(data)); 
  //           ebillProcessed.push(...results);
  //             console.log("ebillProcessed", ebillProcessed);// <-- make sure ebillResults is filled
  //         }

  //     // ------------------------------
  //     // 5. Process EDI Invoices
  //     // ------------------------------
  //     if (data.invoices.length) {
  //       combinedResponse.ediResults = await this.processEdiInvoices(data.invoices, data, req);
  //        console.log("combinedResponse.ediResults", combinedResponse);
  //     }
  //        console.log("ebillProcessed.length", ebillProcessed.length);
  //       if (ebillProcessed.length > 0) {
  //           console.log("ebillProcessed.length***", );
  //           const latestEbill = ebillProcessed[ebillProcessed.length - 1];
  //                console.log("latestEbill***",latestEbill );
  //           if(latestEbill?.accessToken && latestEbill?.refreshToken) {
  //               console.log("latestEbill***accessToken",latestEbill?.accessToken);
  //               console.log("latestEbill***refreshToken",latestEbill?.refreshToken);
  //               const bexioTokenCookie = {
  //                   access_Token: latestEbill.accessToken,
  //                   refresh_Token: latestEbill.refreshToken,
  //                   isBexioUser: true
  //               };

  //               res.cookie(
  //                   config.TOKEN_COOKIE_BEXIO_NAME,
  //                   encryptionControl.encrypt(JSON.stringify(bexioTokenCookie)),
  //                   {
  //                       domain: config.SESSION_DOMAIN,
  //                       maxAge: config.SESSION_EXPIRY,
  //                       httpOnly: true,
  //                       signed: true,
  //                       secure: true
  //                   }
  //               );
  //           }
  //       }

  //     return res.status(200).json({
  //       status_code: 200,
  //       message: 'common_success',
  //       status: true,
  //       data: combinedResponse
  //     });

  //   } catch (error) {
  //     console.error("sendInvoices error:", error);
  //     return res.status(500).json({ status: 500, message: 'something_went_wrong' });
  //   }
  // }
  // ------------------------------
  // Individual Functions
  // ------------------------------

  // private async processPrintInvoice(invoice, data, req): Promise<any> {
  //   const bodyParams = { partyId: data.partyId, accountId: data.accountId, netcomId: data.netcomId };
  //   // Call generic processInvoices function
  //   const invoice_uuid = await this.processInvoices(invoice, bodyParams, 'print');
  //   console.log("invoice_uuid:::", invoice_uuid);
  //   // Attach UUID and tag
  //   invoice['invoice_uuid'] = invoice_uuid[0];
  //   invoice['tag'] = 'print';
  //   // Trigger background worker
  //   this.pushWorkerHost.run(invoice, bodyParams, {
  //     cookies: req.cookies,
  //     signedCookies: req.signedCookies,
  //     url: req.url
  //   }, '', 'print');
  //   console.log("processPrintInvoice", invoice);
  //   return invoice;
  // }

  // private async processEmailInvoice(invoice, data, req): Promise<any> {
  //   const bodyParams = { partyId: data.partyId, accountId: data.accountId, netcomId: data.netcomId };
  //   const invoice_uuid = await this.processInvoices(invoice, bodyParams, 'email');
  //    console.log("invoice_uuid:::", invoice_uuid);
  //   invoice['invoice_uuid'] = invoice_uuid[0];
  //   invoice['tag'] = 'email';

  //   this.pushWorkerHost.run(invoice, bodyParams, {
  //     cookies: req.cookies,
  //     signedCookies: req.signedCookies,
  //     url: req.url
  //   }, '', 'email');
  // console.log("processEmailInvoice", invoice);
  //   return invoice;
  // }

 private async processEbillInvoice(invoice, data, bexioClient): Promise<any> {
  const pool = await connectMssql;
  const recipientToken = await connectBexio.companyregistered.findMany({
    where: { netcomid: data.netcomId },
    select: { refresh_token: true, rk_party: true }
  });
console.log('!invoice.allow',invoice.allow);
 if (!invoice.allow) {
    await setEbillInvoiceSendStatus(
      recipientToken[0]?.rk_party,
      invoice.doc_id,
      invoice.documentNumber,
      [invoice],
      '0',
      'no_subscription_found',
      invoice.contactId
    );
    console.log(`Skipped eBill processing for invoice ${invoice.doc_id} (allow=false)`);
    return null; //  stop here — skip rest of processing
  }

  // --- Continue normal processing ---
  await setEbillInvoiceSendStatus(
    recipientToken[0]?.rk_party,
    invoice.doc_id,
    invoice.documentNumber,
    [invoice],
    '1',
    '',
    invoice.contactId,
  );
  const tokenSet = await bexioClient.refresh(recipientToken[0]?.refresh_token);
  invoice.accessToken = tokenSet.access_token;
  invoice.refreshToken = tokenSet.refresh_token;

  const rk_csn = jwt.decode(tokenSet.access_token)['company_id'];
  await connectBexio.companyregistered.updateMany({
    where: { rk_csn },
    data: { refresh_token: tokenSet.refresh_token }
  });

  const getBillerData = await pool.query(`
      SELECT billerid FROM biller WHERE netcomid='${data.netcomId}' AND status='ACTIVE'
  `);
 const bodyParams = { partyId: recipientToken[0]?.rk_party};
  if (getBillerData.recordset.length > 0) {
    this.pushWorkerHost.run([invoice],bodyParams, {}, getBillerData.recordset[0].billerid, 'EBILL');
  }

  return invoice;
}
  private async processEbillInvoices(data, bexioClient): Promise<any[]> {
  const results: any[] = [];
  if (!data.ebillInvoices?.length) return results;

  for (const invoice of data.ebillInvoices) {
    try {
      const result = await this.processEbillInvoice(invoice, data, bexioClient);
       if (!result) {
        console.log(`Invoice skipped )`);
        results.push(invoice);
        continue; // go to next invoice
      }
      result['tag'] = 'EBILL';
      results.push(result);
    } catch (error) {
      console.error('Error processing eBill invoice:', error);
    }
  }

  return results;
}

  // private async processEdiInvoices(invoices, data, req): Promise<any[]> {
  //   const bodyParams = { partyId: data.partyId, accountId: data.accountId };
  //   // Call generic processInvoices function
  //   const results = await this.processInvoices(invoices, bodyParams, 'EDI');
  //   this.pushWorkerHost.run(invoices, bodyParams, {
  //     cookies: req.cookies,
  //     signedCookies: req.signedCookies,
  //     url: req.url
  //   }, '', 'EDI');
  //    console.log("processEdiInvoices", results);
  //   return results;
  // }

  private async processInvoices(obj: any | any[], bodyData, tag: string): Promise<any[]> {
    const invoices = Array.isArray(obj) ? obj : [obj];
    const results: any[] = [];

    for (const inv of invoices) {
      const docNumber = inv.documentNumber || '';
      const invoiceId = tag == 'EDI' ? inv.invoiceId : inv.doc_id;
       console.log('inv.invoiceId',inv.invoiceId);
        console.log('inv.doc_id',inv.doc_id);
         console.log('docNumber',docNumber);
      console.log('bodyData.partyId, invoiceId, docNumber',bodyData.partyId, invoiceId, docNumber, '1', '', tag, inv.contactId);
      const result = await setInvoiceSendStatus(bodyData.partyId, invoiceId, docNumber, '1', '', tag, inv.contactId,invoices);
      results.push(result);
    }
    console.log("processInvoices", results);
    return results;
  }
async sendInvoice(req: Request, res: Response): Promise<any> {
  const data = req.body;
  const bexioClient = await bexioInterfaceClient();

  const combinedResponse: any = {
    otherInvoiceResults: [],
    emailInvoice: [],
    ediResults: [],
    ebillResults: []
  };

  try {
    // Ensure all arrays
    let autoTag = false;
    const ebillProcessed: any[] = [];

    data.invoices = data.invoices ? JSON.parse(data.invoices) : [];
    data.printInvoices = data.printInvoices ? JSON.parse(data.printInvoices) : [];
    data.otherInvoice = data.otherInvoice ? JSON.parse(data.otherInvoice) : [];
    data.emailInvoices = data.emailInvoices ? JSON.parse(data.emailInvoices) : [];
    data.ebillInvoices = data.ebillInvoices ? JSON.parse(data.ebillInvoices) : [];
    console.log('data.invoices',data.invoices);
    console.log('data.printInvoices',data.printInvoices);
    console.log('data.otherInvoice',data.otherInvoice);
    console.log('data.emailInvoices',data.emailInvoices);
    console.log('data.ebillInvoices',data.ebillInvoices);
    const bodyParams = {
      partyId: data.partyId,
      accountId: data.accountId,
      netcomId: data.netcomId
    };

    // ------------------------------
    // 1. Process Print Invoices
    // ------------------------------
    if (data.printInvoices.length) {
      const printResults = await Promise.all(
        data.printInvoices.map(inv => this.processInvoices(inv, bodyParams, 'print'))
      );

      data.printInvoices.forEach((inv, i) => {
        inv['invoice_uuid'] = printResults[i][0];
        inv['tag'] = 'print';
        combinedResponse.otherInvoiceResults.push(inv);
        console.log('print auto combinedResponse.otherInvoiceResults',combinedResponse.otherInvoiceResults);
        this.pushWorkerHost.run(inv, bodyParams, { cookies: req.cookies, signedCookies: req.signedCookies, url: req.url }, '', 'print');
      });
    }

    // ------------------------------
    // 2. Process Other Invoices (email, print, ebill)
    // ------------------------------
    if (data.otherInvoice.length) {
      const getTag: any = await getTagName(data.netcomId, data.otherInvoice, autoTag);
      console.log('getTag',getTag);
          data.otherInvoice.forEach(inv => {
      const tagItem = getTag?.data?.find(t => t.doc_id === inv.doc_id);
      console.log('tagItem',tagItem);
      if (tagItem) {
        inv.allow = tagItem.allow;
      } 
    });

      console.log('data.otherInvoice',data.otherInvoice);
      const otherEmailInvoices = data.otherInvoice.filter(inv => getTag?.data?.find(t => t.doc_id == inv.doc_id && t.tag == 'email'));
      const otherPrintInvoices = data.otherInvoice.filter(inv => getTag?.data?.find(t => t.doc_id == inv.doc_id && t.tag == 'print'));
      const otherEbillInvoices = data.otherInvoice.filter(inv => getTag?.data?.find(t => t.doc_id == inv.doc_id && t.tag == 'ebill'));
      console.log('otherEmailInvoices',otherEmailInvoices);
      console.log('otherEmailInvoices',otherPrintInvoices);
      console.log('otherEmailInvoices',otherEbillInvoices);
      
      const [emailResults, printResults, ebillResults] = await Promise.all([
        Promise.all(otherEmailInvoices.map(inv => this.processInvoices(inv, bodyParams, 'email'))),
        Promise.all(otherPrintInvoices.map(inv => this.processInvoices(inv, bodyParams, 'print'))),
        Promise.all(otherEbillInvoices.map(inv => this.processEbillInvoice(inv, data, bexioClient)))
      ]);
      console.log('emailResults',emailResults);
      console.log('printResults',printResults);
      console.log('ebillResults',ebillResults);
      otherEmailInvoices.forEach((inv, i) => {
        inv['invoice_uuid'] = emailResults[i][0];
        inv['tag'] = 'email';
           console.log('email inv',inv);
        combinedResponse.otherInvoiceResults.push(inv);
        console.log('email combinedResponse.otherInvoiceResults',combinedResponse.otherInvoiceResults);
        this.pushWorkerHost.run(inv, bodyParams, { cookies: req.cookies, signedCookies: req.signedCookies, url: req.url }, '', 'email');
      });

      otherPrintInvoices.forEach((inv, i) => {
        inv['invoice_uuid'] = printResults[i][0];
        inv['tag'] = 'print';
        console.log('print inv',inv);
        
        combinedResponse.otherInvoiceResults.push(inv);
        console.log('print combinedResponse.otherInvoiceResults',combinedResponse.otherInvoiceResults);
        this.pushWorkerHost.run(inv, bodyParams, { cookies: req.cookies, signedCookies: req.signedCookies, url: req.url }, '', 'print');
      });

      ebillResults.forEach(inv => {
        if (!inv) return;
        inv['tag'] = 'EBILL';
          console.log('EBILL inv',inv);
        combinedResponse.otherInvoiceResults.push(inv);
        console.log('EBILL combinedResponse.otherInvoiceResults',combinedResponse.otherInvoiceResults);
        ebillProcessed.push(inv);
      });
          data.otherInvoice.forEach(inv => {
             console.log('no inv',inv);
      if (!combinedResponse.otherInvoiceResults.find(x => x.doc_id === inv.doc_id)) {
        console.log('no inv1',inv);
        combinedResponse.otherInvoiceResults.push(inv);
      }
    });
    }

    // ------------------------------
    // 3. Process Email Invoices
    // ------------------------------
    if (data.emailInvoices.length) {
      const emailResults = await Promise.all(
        data.emailInvoices.map(inv => this.processInvoices(inv, bodyParams, 'email'))
      );
      data.emailInvoices.forEach((inv, i) => {
        inv['invoice_uuid'] = emailResults[i][0];
        inv['tag'] = 'email';
           console.log('email inv',inv)
        combinedResponse.otherInvoiceResults.push(inv);
          console.log('email auto combinedResponse.otherInvoiceResults',combinedResponse.otherInvoiceResults);
        this.pushWorkerHost.run(inv, bodyParams, { cookies: req.cookies, signedCookies: req.signedCookies, url: req.url }, '', 'email');
      });
    }

    // ------------------------------
    // 4. Process eBill Invoices
    // ------------------------------
    if (data.ebillInvoices.length) {
      autoTag = true;
      const getTag: any = await getTagName(data.netcomId, data.ebillInvoices, autoTag);
      const billTagItem = getTag?.data?.find((item: any) => item.tag === 'ebill');
      if (billTagItem) data.ebillInvoices.forEach(inv => inv.allow = billTagItem.allow);

      const ebillResults = await this.processEbillInvoices(data, bexioClient);
      ebillResults.forEach(inv => {
        if (!inv) return;
        inv['tag'] = 'EBILL';
           console.log('ebillResults inv',inv)
        combinedResponse.otherInvoiceResults.push(inv);
         console.log('EBILL auto combinedResponse.otherInvoiceResults',combinedResponse.otherInvoiceResults);
        //this.pushWorkerHost.run([inv], bodyParams, {}, '', 'EBILL');
        ebillProcessed.push(inv);
      });
    }

    // ------------------------------
    // 5. Process EDI Invoices
    // ------------------------------
    if (data.invoices.length) {
      const ediResults = await Promise.all(
        data.invoices.map(inv => this.processInvoices(inv, { partyId: data.partyId, accountId: data.accountId }, 'EDI'))
      );
      data.invoices.forEach(inv => combinedResponse.ediResults.push(inv));
      this.pushWorkerHost.run(data.invoices, { partyId: data.partyId, accountId: data.accountId }, { cookies: req.cookies, signedCookies: req.signedCookies, url: req.url }, '', 'EDI');
    }

    // ------------------------------
    // 6. Set Bexio token cookie if any eBill processed
    // ------------------------------
    const validEbill = ebillProcessed.filter(inv => inv?.accessToken && inv?.refreshToken);
       console.log('validEbill',validEbill)
    if (validEbill.length > 0) {
      const latestEbill = validEbill[validEbill.length - 1];
      const bexioTokenCookie = {
        access_Token: latestEbill.accessToken,
        refresh_Token: latestEbill.refreshToken,
        isBexioUser: true
      };
      res.cookie(config.TOKEN_COOKIE_BEXIO_NAME, encryptionControl.encrypt(JSON.stringify(bexioTokenCookie)), {
        domain: config.SESSION_DOMAIN,
        maxAge: config.SESSION_EXPIRY,
        httpOnly: true,
        signed: true,
        secure: true
      });
    }

    return res.status(200).json({
      status_code: 200,
      message: 'common_success',
      status: true,
      data: combinedResponse
    });

  } catch (error) {
    console.error("sendInvoices error:", error);
    return res.status(500).json({ status: 500, message: 'something_went_wrong' });
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
     if (JSON.parse(response.body).message == "something_went_wrong") {
     console.log('response',response.body);

        return res.status(500).json({
          status: false,
          message: 'something_went_wrong',
        });
      }
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
        let tempTaxIdTmp = taxList?.filter((e) =>  (e.type == 'not_taxable_turnover' && e.value == 0) || (e.type == 'not_taxable_turnover' && e.value == (0 * 100)));
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
            return res.send({
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
            return res.send({
              status_code: 200,
              message: 'common_sucess',
              status: true,
              data: [],
            });
          }else{
            commonErrors['errorTitle'] = req.originalUrl;
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'SEND_G2B_ORDER -req param,',JSON.stringify(req.body);
            warningMessage(commonErrors,'SEND_G2B_ORDER');
           return res.send({
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
       return res.send({
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
          await setDeliveryNotesCidSendStatus(bodyData.partyId, element.delivery_id, element.documentNr, '1', '');
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
   return res.send({
              status_code: 200,
              message: 'common_sucess',
              status: true,
            });

  }
  async viewInvoicePdf(req: Request, res: Response,): Promise<any> {
    try {
      let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
      let accessToken = cookie.access_Token;
      let invoiceId =req.body.invoice_id;
      let pdf,fileName,pdfContent;
      pdf = await getInvoicePdf(accessToken,invoiceId);
      if(pdf.response == 401){
        
      
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'error_getInvoicePdf -req param,',JSON.stringify(req.body);
        warningMessage(commonErrors,'error_getInvoicePdf ');
        //return resolve('unauthorized');

        return res.status(status_code.UNAUTHORISED).json({
          status_code: 401,
          message: 'common_error',
        });
  
      }
      if(!pdf){
       
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'error_getInvoicePdf -req param,',JSON.stringify(req.body);
        warningMessage(commonErrors,'error_getInvoicePdf ');
      //  return resolve('pdf_not_found');
      return res.status(status_code.INTERNAL_SERVER_ERROR).json({
        status_code: 500,
        message: 'pdf_not_found',
      });
      }
      let pdf_parsed = JSON.parse(pdf);
      pdfContent = pdf_parsed.content;
      fileName = pdf_parsed.name;
      
      return res.status(status_code.OK).json({
        status_code: 200,
        message: 'common_success',
        status: true,
        data:{pdf_parsed,pdfContent,fileName},
      });

      
    } catch (error) {
      console.log("error in viewInvoicePdf :: ",error);      
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
   
  }
  async changeInvoiceSendStatus(req: Request, res: Response,): Promise<any> {
  
    let formData 
    formData = req.body;
    try {
        const referenceId = formData.referenceId ;
        let status;
        
        console.log('formData',formData);
        switch (formData.status.trim()) {
          case 'ERROR':
          case 'INCORRECT':
          case 'REJECTED':
            status = 0;
            break;
          case 'COMPLETED':
            status = 2;
            break;
          case 'OPEN ':
          case 'APPROVED':  
            status = 1;
          default:
            status = 1;
            break;
        }
        console.log('JSON.parse(formData.message)',JSON.parse(formData.message || '{}'));
         let errorBody = (JSON.parse(formData.message || '{}')).technicalReason || '';
          console.log('errorBody',errorBody);
          const refDataQueryResult = await connectBexio.documents_invoice_send.findMany({
            where: {
              reference_id: referenceId, 
            },
            include: {
              companyregistered: true,
            },
          });          
          
        if(refDataQueryResult.length>0){
          // Update status and fetch updated invoice(s) to get rk_invoice
          await connectBexio.documents_invoice_send.updateMany({
            where: {
              reference_id: referenceId,
            },
            data: {
              status: status,
              is_notifyed: true,
              response:errorBody
            },
          });

            // Fetch the updated record to get rk_invoice as a number
            const updatedInvoice = await connectBexio.documents_invoice_send.findFirst({
              where: { reference_id: referenceId },
              select: { rk_invoice: true },
            });
            const rkInvoice = updatedInvoice?.rk_invoice ? Number(updatedInvoice.rk_invoice) : undefined;
          const bankId = (refDataQueryResult[0]?.invoice_params as any)?.bank_id

            console.log('rkInvoice',rkInvoice);
            
          await notifiBexio(refDataQueryResult[0].companyregistered?.refresh_token, rkInvoice, formData.status.trim(), formData.message, refDataQueryResult[0].companyregistered?.netcomid, formData.amount, bankId);

          return res.status(200).json({
            status_code: 200,
            message: 'success',
            status: true
          });
        }else{
          console.log('errorr','error_refDataQueryResult');
          
          return res.status(200).json({
            status_code: 200,
            message: 'something_went_wrong',
            status: false
          });
        }
        
    } catch (error) {
      
        console.log(error);
        let responseValue = JSON.stringify(formData)
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+responseValue;
        warningMessage(commonErrors,error);
        return res.status(500).json({
            message: 'something_went_wrong',
            status: false
        });
    }
  }
  async markAsIssued(req: Request, res: Response,): Promise<any> {
    console.log('markAsIssued',req.body)
    try {
      let invoiceId = req.body.id,tokenSet,invoice;
      const bexioClient = await bexioInterfaceClient();

      const getInvoiceIdRslt = await connectBexio.$queryRaw<{ cid: number[] }[]>(
        Prisma.sql`
        SELECT * FROM documents_invoice_send ds 
        INNER JOIN companyregistered c ON ds.fk_companyregistered = c.cid
        WHERE ds.cid = ${invoiceId}::bigint
        `
        );
         console.log('getInvoiceIdRslt',getInvoiceIdRslt[0]["refresh_token"]);
        if(getInvoiceIdRslt.length != 0){

        console.log('getInvoiceIdRslt',getInvoiceIdRslt[0]["refresh_token"]);

        console.log(getInvoiceIdRslt);
          try {
          tokenSet = await bexioClient.refresh(getInvoiceIdRslt[0]["refresh_token"]);
          invoice = getInvoiceIdRslt[0]['rk_invoice'];
          console.log('invoice',invoice);
          
          } catch (error) {
            console.log('error',error);
            
            commonErrors['errorTitle'] = 'markAsIssues_token_issue';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+invoiceId;
            warningMessage(commonErrors,error);

            return res.status(500).json({
              status_code: 500,
              message: 'something_went_wrong',
              status: false,
              error:'token_issue'
            }); 
          }
          
          return new Promise(async(resolve, reject) => {
            var options = {
              'method': 'POST',
              'url': `https://api.bexio.com/2.0/kb_invoice/${invoice}/mark_as_sent`,
              'headers': {
                'Accept': 'application/json',
                'Authorization': 'Bearer '+tokenSet.access_token
              }
            };
            request(options, async function (error, response) {
              if (error) {  
                commonErrors['errorTitle'] = 'markAsIssues';
                commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+invoiceId;;
                warningMessage(commonErrors,error);
                return res.status(500).json({
                  status_code: 500,
                  message: 'something_went_wrong',
                  status: false,
                  error:error.toString()
                });
              }
              // res.send(response.body)
              //console.log(response.body);
              if(response.statusCode==200)
              {
                await markAsPending(tokenSet.access_token,invoice)
                return res.status(200).json({
                  status_code: 200,
                  status: true
                });
              }
              else
              {
                commonErrors['errorTitle'] = 'markAsIssues';
                commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'server error'+'-bexio param,'+invoiceId;;
                warningMessage(commonErrors,error);
                return res.status(500).json({
                  status_code: 500,
                  message: 'something_went_wrong',
                  status: false,
                  error:'server error'
                });
              }
            });
          });
        }else{
          let error = 'id missing'
          commonErrors['errorTitle'] = 'markAsIssues';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'-bexio param,'+req.body.id;;
          warningMessage(commonErrors,error);
          return res.status(500).json({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
            error:error
          });
        }  
    } catch (error) {
      console.log('error',error);
      commonErrors['errorTitle'] = 'markAsIssues';
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+req.body.id;;
      warningMessage(commonErrors,error);
      return res.status(500).json({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
        error:error.toString()

      });
    }
  }
  
}
const notifiBexio = async (refreshToken, id, status, message?, netcomId?, amount?, bankId?) => {
  console.log('notifiBexio:::', id, status, message, netcomId, amount, bankId);

  const bexioClient = await bexioInterfaceClient();
  let options;
  console.log('refreshToken', refreshToken);
  let params = {
    refreshToken: refreshToken,
    id: id,
    status: status,
    amount: amount,
  }
  let tempMsg, erroMsg = '';
  console.log('typeof(message)', typeof (message));

  if (message) {
    if (typeof (message) == 'object')
      tempMsg = message;
    else
      try {
        tempMsg = JSON.parse(message);

      } catch (error) {
        tempMsg = message;
      }

    if (typeof (tempMsg) == 'object') {
      if ('detail' in tempMsg) {
        erroMsg = erroMsg + tempMsg['detail'];
      }
      if ('technicalReason' in tempMsg) {
        erroMsg = erroMsg + ' - ' + tempMsg['technicalReason'];
      }
    } else {
      erroMsg = erroMsg + message;

    }

  }
  console.log('erroMsg', erroMsg);
  const tokenSet = await bexioClient.refresh(refreshToken);
  console.log('tokenSet', tokenSet);
  console.log('id', id);
  console.log('status', status);

  await addBexioComment(tokenSet.access_token, id, status, erroMsg, netcomId);


  return new Promise(async (resolve, reject) => {
    try {
      console.log('bankId', bankId);
      let isNotifyBexio = true;
      if (status == 'COMPLETED') {
        const getCompanyIdQryResult = await connectBexio.companyregistered.findMany({
          where: {
            netcomid: netcomId,
            settings: {
              // Using 'contains' to search for the 'notifyPayment' key with value 'false' in the JSON
              path: ['notifyPayment'],
              equals: 'false', // Checks if the value of 'notifyPayment' is 'false'
            },
          },
          select: {
            settings: true, // Fetching the settings JSON
          },
        });

        if (getCompanyIdQryResult.length > 0) {
          isNotifyBexio = false;
        }
        console.log('isNotifyBexio', isNotifyBexio);

        if (isNotifyBexio) {

          options = {
            'method': 'POST',
            'url': `https://api.bexio.com/2.0/kb_invoice/${id}/payment`,
            'headers': {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + tokenSet.access_token
            },
            body: JSON.stringify({
              "value": amount,
              "bank_account_id": bankId ? bankId : undefined
            })
          };
          console.log('optionsoptions', options);
          request(options, async function (error, response) {
            if (error) {
              console.log('errorr', error);
              commonErrors['errorTitle'] = 'notifiBexio';
              commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + JSON.stringify(params);
              warningMessage(commonErrors, error);
              return resolve(false)
            }
            console.log('notifiBexionotifiBexio', options);

            console.log('notifiBexionotifiBexio', response.body);
            console.log('typeoftypeof', typeof (response.body));

            let resStatus = 'success' in JSON.parse(response.body) ? true : false;
            console.log('statusstatus', resStatus);


            if (response.statusCode == 201 || resStatus) {
              console.log('JSON.parse(response.body)', JSON.parse(response.body));
              return resolve(JSON.parse(response.body));
            }
            else {
              commonErrors['errorTitle'] = 'notifiBexio';
              commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + response.toString() + '-bexio param,' + JSON.stringify(params, (key, value) =>
                typeof value === 'bigint' ? Number(value) : value
              );
              warningMessage(commonErrors, error);
              return resolve(false)
            }
          });
        } else {
          return resolve(false)
        }
      } else if (status == 'ERROR' || status == 'INCORRECT' || status == 'REJECTED' || status == 'ERROR-INTERNAL') {
        options = {
          'method': 'POST',
          'url': `https://office.bexio.com/api.php/kb_invoice/${id}/mark_as_ebill_failed`,
          'headers': {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + tokenSet.access_token
          }
        };
        request(options, async function (error, response) {
          if (error) {
            console.log('errorr', error);
            commonErrors['errorTitle'] = 'notifiBexio';
            commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + JSON.stringify(params, (key, value) =>
              typeof value === 'bigint' ? Number(value) : value
            );
            warningMessage(commonErrors, error);
            return resolve(false)
          }
          // res.send(response.body)
          //console.log(response.body);
          console.log('notifiBexionotifiBexio', options);

          console.log('notifiBexionotifiBexio', response.body);
          console.log('notifiBexionotifiBexio', response.statusCode);
          console.log('typeoftypeof', typeof (response.body));
          let resStatus;
          if (typeof (response.body) == 'object') {
            resStatus = 'success' in JSON.parse(response.body) ? true : false;

          } else {
            resStatus = false;
          }
          console.log('statusstatus', resStatus);


          if (response.statusCode == 200 || resStatus) {
            console.log('JSON.parse(response.body)', JSON.parse(response.body));

            return resolve(JSON.parse(response.body));
          }
          else {
            // resolve(false)
            commonErrors['errorTitle'] = 'notifiBexio';
            commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + response.body.toString() + '-bexio param,' + + JSON.stringify(params, (key, value) =>
              typeof value === 'bigint' ? Number(value) : value
            );
            warningMessage(commonErrors, error);
            return resolve(false);
          }

        });
      } else {
        return resolve(true);
      }
      console.log('options', options);


    } catch (error) {

      commonErrors['errorTitle'] = 'notifiBexio';
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + + JSON.stringify(params, (key, value) =>
        typeof value === 'bigint' ? Number(value) : value
      );
      warningMessage(commonErrors, error);
      return resolve(false)

    }
  });


}
const addBexioComment = async (token, id, status, message?, netcomId?) => {

  console.log('addBexioComment');
  let parms = {
    token: token,
    id: id,
    status: status,
    message: message,
    netcomId: netcomId
  }
  console.log('parms', parms);

  return new Promise(async (resolve, reject) => {
    try {
      // const tokenSet = await bexioClient.refresh(refreshToken);
      console.log('config.BEXIO_COMMENTS', config.BEXIO_COMMENTS);
      let commentsData = JSON.parse(config.BEXIO_COMMENTS);
      console.log(commentsData[status].replace('[message]', '{ ' + message + ' }'))
      let comments = commentsData[status].replace('[message]', '{ ' + message + ' }')
      let invoiceData = await getInvoiceOT(token, id);
      console.log('addBexioComment');

      if (!invoiceData) {
        commonErrors['errorTitle'] = 'addBexioComment';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + 'addBexioComment ' + '-bexio param,' + JSON.stringify(parms);
        warningMessage(commonErrors, 'error');
        resolve(false)
        return
      }
      let userData = await getUser(token, invoiceData['user_id']);
      console.log('userData', userData);

      if (!userData) {
        userData = await getDefaultUser(token);
      }
      console.log('userData', userData);

      if (!userData) {
        commonErrors['errorTitle'] = 'addBexioComment';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + 'addBexioComment ' + '-bexio param,' + JSON.stringify(parms);
        warningMessage(commonErrors, 'error');
        resolve(false)
        return
      }
      let isNotifyBexio = true;
      const getCompanyIdQryResult = await connectBexio.companyregistered.findMany({
        where: {
          netcomid: netcomId,
          settings: {
            path: ['notifyComments'], // Specify the key in the JSON
            equals: 'false', // Checks if the value of 'notifyComments' is 'false'
          },
        },
        select: {
          settings: true, // Fetch the settings JSON field
        },
      });


      if (getCompanyIdQryResult.length > 0) {
        isNotifyBexio = false;
      }
      console.log('isNotifyBexio', isNotifyBexio);

      let options = {
        'method': 'POST',
        'url': `https://api.bexio.com/2.0/kb_invoice/${id}/comment`,
        'headers': {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          "text": comments,
          "user_name": 'iomarket AG'
        })
      };
      // console.log(options);
      if (isNotifyBexio) {
        request(options, function (error, response) {
          if (error) {
            console.log('errorr', error);

            commonErrors['errorTitle'] = 'addBexioComment';
            commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + JSON.stringify(parms);
            warningMessage(commonErrors, error);
            return resolve(false)
          }
          // res.send(response.body)
          //console.log(response.body);
          console.log('options', options);

          console.log('response', response.body);

          if (response.statusCode == 201) {
             resolve(JSON.parse(response.body));
            console.log('JSON.parse(response.body)', JSON.parse(response.body));
            return;
          }
          else {
            console.log('errorr', error);
            commonErrors['errorTitle'] = 'addBexioComment';
            // commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+response?response.body.toString():''+'-bexio param,'+JSON.stringify(parms);
            commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + (response ? response.body.toString() : '') + '-bexio param,' + JSON.stringify(parms);
            warningMessage(commonErrors, error);
            resolve(false)
            return;
          }
        })
      } else {
        return resolve(false)
      }
    } catch (error) {

      console.log('errorrrrrrr', error);
      commonErrors['errorTitle'] = 'addBexioComment';
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + JSON.stringify(parms);
      warningMessage(commonErrors, error);
      resolve(false);
      return;

    }
  })


}


