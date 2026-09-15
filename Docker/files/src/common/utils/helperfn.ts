const encryptionControl = require("../utils/jwt-decode");
import * as request from 'request';
import config from '../config/index';
const path = require('path')
import { PrismaClientsService } from '../../db/prisma-clients.service';
import { Prisma } from '@prisma/client';
import { bexioInterfaceClient } from './bexioClient';
const fs = require('fs')
import { resolve } from 'path';
var xml2js = require('xml2js');
import connectMssql from '../../db/mssql-client'
const crypto = require("crypto");
import redisClient from '../utils/redisDB';
import commonErrors from '../utils/commonError'
import warningMessage from '../utils/warningMessage'
const { DynamoDBService } = require('../../contact-import/dynamodb/dynamodb.service');
const { SalesforceService } = require('../../contact-import/salesforce/salesforce.service');
import { decode } from 'html-entities';

const { connectNewGate2b, connectBexio, connectLibrary } =
  PrismaClientsService.getClients();
export const getContactById = async (accessToken, contact_idList) => {

  return new Promise(async (resolve, reject) => {
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
        'Authorization': 'Bearer ' + accessToken
      },
      body: JSON.stringify(searchJson)
    };

    request(optionsContact, async function (error, response) {
      if (error) {
        commonErrors['errorTitle'] = 'getContactById';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + '-bexio param,' + accessToken;
        warningMessage(commonErrors, error);
        return resolve(error);
      }


      if (response.statusCode == 200) {
        return resolve(JSON.parse(response.body));
      } else {
        return resolve(false)
      }
    });
  });


}
export const getAllCurrency = async (access_token) => {

  return new Promise(async (resolve, reject) => {
    var options = {
      'method': 'GET',
      'url': `https://api.bexio.com/3.0/currencies`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + access_token
      }
    };
    request(options, function (error, response) {
      if (error) {
        commonErrors['errorTitle'] = 'getAllCurrency';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param';
        warningMessage(commonErrors, error);
        return resolve(false)
      }

      if (response?.statusCode == 200)
        return resolve(JSON.parse(response.body));
      else
        return resolve([])
    });
  });
}
export const getRecipientList = async (netcomId: string, contact_idList: number[]) => {
  try {
    // Ensure unique IDs and explicitly cast to number[]
    const uniqueIds: number[] = [...new Set(contact_idList)];
    //console.log('uniqueIds',uniqueIds);
    //console.log('uniqueIds',uniqueIds.length);
    if (uniqueIds.length === 0) return []; // Return empty array if no valid IDs

    const contacts = await connectBexio.contact_bc.findMany({
      where: {
        rk_contact: { in: uniqueIds },
        companyregistered: {
          is: { netcomid: netcomId }
        }

      },
      select: {
        recipient_id: true,
        rk_contact: true
      },
    });


    return contacts;
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};


export const invoiceCountSearch = async (token, search, offset, limit?) => {

  return new Promise(async (resolve, reject) => {
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
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + token;
        warningMessage(commonErrors, error);
        return resolve(false)
      }
      if (response?.statusCode == 200) {
        if (JSON.parse(response.body).length == limit) {
          let temp = this.invoiceCountSearch(token, offset + 2000, 2000)
          //  //////console.log(('11111111111111111111111111111');

        } else {
          offset = offset + JSON.parse(response.body).length;
          // //////console.log(('lengthhh',offset);
          return resolve(offset)
        }
        // //////console.log((JSON.parse(response.body).length);

        // resolve(JSON.parse(response.body).length)

      }
      else
        return resolve(false)
    });
  });
}
export const invoiceListCountSearch = async (token, offset, limit?) => {
  return new Promise(async (resolve, reject) => {
    var options = {
      'method': 'GET',
      'url': `${config.BEXIO_API}2.0/kb_invoice/?limit=${limit}&offset=${offset}&order_by=updated_at_desc`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    };

    request(options, async (error, response) => {
      if (error) {
        commonErrors['errorTitle'] = 'invoiceListCount';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + token;
        warningMessage(commonErrors, error);
        return resolve(false);
      }
      if (response.statusCode == 401) {
        return resolve(false);
      }
      if (response.statusCode == 200) {
        if (JSON.parse(response.body).length == limit) {
          let temp = await invoiceListCountSearch(token, offset + 2000, 2000);
          return resolve(temp);
        } else {
          offset = offset + JSON.parse(response.body).length;
          return resolve(offset);
        }
      }
      else
        return resolve(false);
    });
  });
}
export const getBcDetails = async (bc_id, netcomId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!bc_id) return resolve(false);
      let formData = {
        bc: bc_id.toString(),
        netcom_id: netcomId
      }
      let options = {
        'method': 'POST',
        'url': config.GATE2BURL + 'get-contact-bc',
        formData: formData
      };

      request(options, function (error, response, body) {
        if (error) {
          commonErrors['errorTitle'] = 'getBcDetails';
          warningMessage(commonErrors, error);
          return reject(error)
        }
        try {

          //console.log('output',config.GATE2BURL + 'get-contact-bc');
          const result = JSON.parse(response.body);
          resolve(result);
        } catch (err) {
          return reject(err)
        }

      });
    } catch (error) {
      commonErrors['errorTitle'] = 'getBcDetails';
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,'
      warningMessage(commonErrors, error);
      reject(error);
    }
  });
}
export const deliveryNotesListCountSearch = async (token, offset, limit?) => {
  return new Promise(async (resolve, reject) => {
    var options = {
      'method': 'GET',
      'url': `${config.BEXIO_API}2.0/kb_delivery/?limit=${limit}&offset=${offset}&order_by=updated_at_desc`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    };
    request(options, function (error, response) {
      if (error) {
        commonErrors['errorTitle'] = 'deliveryNotesList';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + token;
        warningMessage(commonErrors, error);
        return resolve(false);
      }
      if (response.statusCode == 200) {
        if (JSON.parse(response.body).length == limit) {
          let temp = invoiceListCountSearch(token, offset + 2000, 2000);
          return resolve(temp);
        } else {
          offset = offset + JSON.parse(response.body).length;
          return resolve(offset);
        }
      }
      else
        return resolve(false);
    });
  });
}

export const getTagName = async (netcom_id, details, autoTag) => {

  try {
    let data
    console.log('autoTag', autoTag);
    if (autoTag == true) {
      console.log('autoTag is true');
      data = {
        channel_preference: {
          sequence: ["eBill"],
          serviceStatus: { eBill: true }
        },
        module: 'BEX',
        file_list: details
      };
    }
    else {
      console.log('autoTag is false');
      data = {
        netcom_id: netcom_id,
        module: 'BEX',
        file_list: details
      };
    }
    const formData = {
      data: JSON.stringify(data) // Must stringify the entire object
    };
    var options = {
      'method': 'POST',
      'url': `${config.OCTOPUS_URL}/bexio_file_check`,
      formData: formData

    };

    return new Promise(function (resolve, reject) {
      request(options, async function (error, response, body) {

        if (error) {
          commonErrors['errorTitle'] = 'getPythonData';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString();
          warningMessage(commonErrors, error);
          return resolve(error)
        }
        else {
          try {
            return resolve(JSON.parse(response.body));

          }
          catch {
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
export const setInvoiceSendStatus = async (partyId, invoiceId, invoicenumber, status, error?, channel?, receiverId?, formData?) => {
  console.log('channel,invoiceId::::::::::::', channel, invoiceId, status);
  console.log('channel,invoiceId,partyId::::::::::::', partyId);
  console.log('invoicenumber::::::::::::', invoicenumber);
  console.log("formData:::::::::::::::", formData)
  let sendInvoiceId;
  return new Promise(async function (resolve, reject) {
    let errorBody = error || '';
    try {

      const selectQryResult = await connectBexio.documents_invoice_send.findMany({
        where: {
          rk_invoice: invoiceId,
          // invoice_type: channel,
          companyregistered: {
            rk_party: Number(partyId),
          },
        },
        select: {
          cid: true,
          object_id: true,
          invoice_params: true,
          companyregistered: {
            select: {
              cid: true,
            },
          },
        },
      });
      console.log("selectQryResult", selectQryResult);

      let oldLogs: any[] = [];
      if (selectQryResult.length && selectQryResult[0]?.invoice_params && selectQryResult[0]?.invoice_params["channel_change_logs"] && Array.isArray(selectQryResult[0]?.invoice_params["channel_change_logs"])) {
        const oldParams = selectQryResult[0].invoice_params;
        // oldLogs = oldParams["channel_change_logs"];
        oldLogs = [...oldParams["channel_change_logs"]];
      }

      // -------------------------------
      // 3. Add new channel log if failed_invoice_type != channel
      // -------------------------------
      if (
        formData?.failed_invoice_type &&
        channel &&
        formData.failed_invoice_type.toLowerCase() !== channel.toLowerCase()
      ) {
        console.log('oldLogs1', oldLogs);

        oldLogs.push({
          from: formData.failed_invoice_type,
          to: channel,
          user: formData.userId,
          timestamp: new Date().toISOString(),
        });
        console.log('oldLogs2', oldLogs);


      }

      if (selectQryResult.length == 0) {
        console.log('createany');

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
            invoice_type: channel,
            invoice_params: formData,
            status: Number(status),
            receiver_contactid: receiverId,
            response: errorBody,
            ...(channel === 'EBILL' && { is_notifyed: false })
          },
          select: {
            cid: true,
            object_id: true,
          },
        });
        console.log("SendInvoice Status result", result);

        sendInvoiceId = channel === 'EBILL' ? result.object_id : result.cid;
      }
      else {
        console.log('updateMany', selectQryResult[0]?.cid, channel, invoiceId, status);

        sendInvoiceId = channel === 'EBILL' ? selectQryResult[0]?.object_id : selectQryResult[0]?.cid;

        let invoiceParams: any = selectQryResult[0]?.invoice_params;
        if (!invoiceParams || Array.isArray(invoiceParams) || typeof invoiceParams !== 'object') {
          invoiceParams = {};
        }
        invoiceParams = {
          ...invoiceParams,
          ...formData,
          channel_change_logs: oldLogs
        };
        console.log('invoiceParams', invoiceParams);
        console.log('selectQryResult', selectQryResult);
        console.log('oldLogs', oldLogs);

        await connectBexio.documents_invoice_send.updateMany({
          where: {
            fk_companyregistered: selectQryResult[0].companyregistered?.cid,
            rk_invoice: invoiceId,
            // invoice_type: channel
          },
          data: {
            time_stamp: new Date(),
            status: Number(status),
            response: errorBody,
            invoice_type: channel,
            invoice_params: invoiceParams,
            ...(channel === 'EBILL' && { is_notifyed: false }),
            ...(channel === 'EBILL' && { reference_id: null })
          }
        });
        //console.log('updateRes',updateRes);

      }
      return resolve(sendInvoiceId);
    } catch (error) {
      reject(error);
      //console.log(error);
      commonErrors['errorTitle'] = setInvoiceSendStatus.name;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + partyId + '-partyId' + invoiceId + '-invoiceId' + invoicenumber + 'invoiceNumber';
      warningMessage(commonErrors, error);
      return resolve('');

    }
  });

}
export const pushEDIInvoiceProcess = async (invoices, bodyValues, headerParams, channel?) => {
  try {
    console.log("worker processing invoices...", invoices);

    let tempIds = invoices;

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
        const result = await pushEDIInvoice(tempParam, "", channel);
        console.log("result:", result);
      } catch (error) {
        console.error("Error processing invoice:", element.invoiceId, error);
      }
      //console.log("end processing invoice");
    }
  } catch (error) {
    console.error('Error in pushEDIInvoiceProcessxx:', error);
    throw error; // Ensure the error is thrown to be caught by the caller
  }
};

export const pushEDIInvoice = async (req, res, channel) => {
  return new Promise(async (resolve, reject) => {
    try {
      let decryptData = req;
      console.log('decryptData', decryptData);

      if (!req || !req.signedCookies || !decryptData.body.partyId) {
        return reject('Invalid input data');
      }

      let invoiceCid;
      try {
        let invoice, paymentType
        let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
        let accessToken = cookie.access_Token;
        const partyId = decryptData.body.partyId;
        const accountId = decryptData.body.accountId;
        const invoiceId = decryptData.body.invoiceId;
        invoice = await getInvoiceOT(accessToken, invoiceId);
        // //console.log('invoice::::',invoice);
        if (!invoice || !invoice.positions) {
          invoiceCid = await setInvoiceSendStatus(partyId, invoiceId, '', '0', 'invoice_invalid', channel);
          const logData = {
            ...commonErrors,
            errorTitle: req.originalUrl,
            errorDescription: 'From:' + path.basename(__filename) + ' ' + 'invoice_invalid -req param, ' + JSON.stringify(decryptData),
            netcomId: decryptData?.body?.netcomId,
            channel: channel,
            messagetype: "404",
            message: 'Not Found Bexio InvoiceAPI Failed',
            filename: invoice['document_nr']
          };
          warningMessage(logData, 'invoice_invalid');
          return resolve('invoice_invalid');
        }

        let invitionData: any = await getConnectionDetails(partyId, accountId, invoice.contact_id, req);

        if (invitionData.length != 0) {

          let customerIds = await constGetContactId(invitionData[0].rk_businessconnection);
          if (!customerIds) {
            const logData = {
              ...commonErrors,
              errorTitle: req.originalUrl,
              errorDescription: 'From:' + path.basename(__filename) + ' ' + 'customerIds_not_found -req param, ' + JSON.stringify(req.body),
              netcomId: decryptData?.body?.netcomId,
              channel: channel,
              messagetype: "503",
              message: "Service Unavailable ContactId",
              filename: invoice['document_nr']
            };
            warningMessage(logData, 'customerIds_not_found ');
            return resolve('customerIds_not_found');
          }
          //console.log(customerIds);
          //console.log('invitionData',invitionData);     
          let pdf, fileName, pdfContent;
          pdf = await getInvoicePdf(accessToken, invoiceId);
          if (pdf.response == 401) {

            invoiceCid = await setInvoiceSendStatus(partyId, invoiceId, invoice['document_nr'], '0', 'unauthorized', channel);
            const logData = {
              ...commonErrors,
              errorTitle: req.originalUrl,
              errorDescription: 'From:' + path.basename(__filename) + ' ' + 'unauthorized -req param, ' + JSON.stringify(req.body),
              netcomId: decryptData?.body?.netcomId,
              channel: channel,
              messagetype: "401",
              message: 'Unauthorized Bexio',
              filename: invoice['document_nr']
            };
            warningMessage(logData, 'unauthorized ');
            return resolve('unauthorized');
          }
          if (!pdf) {
            invoiceCid = await setInvoiceSendStatus(partyId, invoiceId, invoice['document_nr'], '0', 'pdf_not_found', channel);
            const logData = {
              ...commonErrors,
              errorTitle: req.originalUrl,
              errorDescription: 'From:' + path.basename(__filename) + ' ' + 'pdf_not_found -req param, ' + JSON.stringify(req.body),
              netcomId: decryptData?.body?.netcomId,
              channel: channel,
              messagetype: "406",
              message: 'Not Acceptable PDF Missing',
              filename: invoice['document_nr']
            };
            warningMessage(logData, 'pdf_not_found ');
            return resolve('pdf_not_found');
          }
          let pdf_parsed = JSON.parse(pdf);
          pdfContent = pdf_parsed.content;
          fileName = pdf_parsed.name;
          let coutryList;
          coutryList = await getCountryLists(accessToken);
          if (!coutryList) {
            invoiceCid = await setInvoiceSendStatus(partyId, invoiceId, invoice['document_nr'], '0', 'country_list_not_found', channel);
            //console.log('coutryList');
            const logData = {
              ...commonErrors,
              errorTitle: req.originalUrl,
              errorDescription: 'From:' + path.basename(__filename) + ' ' + 'country_list_not_found -req param,' + JSON.stringify(req.body),
              netcomId: decryptData?.body?.netcomId,
              channel: channel,
              messagetype: "406",
              message: 'Not Acceptable Country Missing',
              filename: invoice['document_nr']
            };
            warningMessage(logData, 'country_list_not_found');
            return resolve('country_not_found');
          }
          coutryList = JSON.parse(coutryList);
          let bank
          bank = await getBank(accessToken, invoice.bank_account_id);
          if (!bank) {
            invoiceCid = await setInvoiceSendStatus(partyId, invoiceId, invoice['document_nr'], '0', 'bexio_bank_error', channel);
            const logData = {
              ...commonErrors,
              errorTitle: req.originalUrl,
              errorDescription: 'From:' + path.basename(__filename) + ' ' + 'bank_not_found -req param,' + JSON.stringify(req.body),
              netcomId: decryptData?.body?.netcomId,
              channel: channel,
              messagetype: "406",
              message: 'Not Acceptable Invalid Bank',
              filename: invoice['document_nr']
            };
            warningMessage(logData, 'bexio_bank_error');
            return resolve('bexio_bank_error');
          }
          // invoice['bank'] = 'iban_nr' in bank ? bank : '';
          if ('iban_nr' in bank) {
            invoice['bank'] = bank;
          }
          else {
            invoiceCid = await setInvoiceSendStatus(partyId, invoiceId, invoice['document_nr'], '0', 'bexio_bank_error', channel);
            return resolve('bexio_bank_error');
          }
          //console.log('123');
          //console.log('invoice.currency_id',invoice.currency_id);

          let currency = await getCurrency(accessToken, invoice.currency_id);
          if (!currency) {
            invoiceCid = await setInvoiceSendStatus(partyId, invoiceId, invoice['document_nr'], '0', 'currency_not_found', channel);
            const logData = {
              ...commonErrors,
              errorTitle: req.originalUrl,
              errorDescription: 'From:' + path.basename(__filename) + ' ' + 'currency_not_found -req param,' + JSON.stringify(req.body),
              netcomId: decryptData?.body?.netcomId,
              channel: channel,
              messagetype: "406",
              message: 'Not Acceptable Currency Missing',
              filename: invoice['document_nr']
            };
            warningMessage(logData, 'currency_not_found');
            return resolve('currency_not_found');
          }
          invoice['currency'] = currency;
          let temp = await getloginUserCompanyDetails(accessToken);
          //console.log(temp);  
          if (!temp) {
            invoiceCid = await setInvoiceSendStatus(partyId, invoiceId, invoice['document_nr'], '0', 'company_details_not_found', channel);
            const logData = {
              ...commonErrors,
              errorTitle: req.originalUrl,
              errorDescription: 'From:' + path.basename(__filename) + ' ' + 'company_details_not_found -req param,' + JSON.stringify(req.body),
              netcomId: decryptData?.body?.netcomId,
              channel: channel,
              messagetype: "406",
              message: 'Not Acceptable Company Details Missing',
              filename: invoice['document_nr']
            };
            warningMessage(logData, 'company_details_not_found');
            return resolve('company_details_not_found');
          }
          invoice['companyProfile'] = temp;
          invoice['companyProfile'] = JSON.parse(invoice['companyProfile']);
          paymentType = await getPaymentType(accessToken, invoice.payment_type_id);
          if (!paymentType) {
            invoiceCid = await setInvoiceSendStatus(partyId, invoiceId, invoice['document_nr'], '0', 'payment_type_not_found', channel);
            const logData = {
              ...commonErrors,
              errorTitle: req.originalUrl,
              errorDescription: 'From:' + path.basename(__filename) + ' ' + 'payment_type_not_found -req param,' + JSON.stringify(req.body),
              netcomId: decryptData?.body?.netcomId,
              channel: channel,
              messagetype: "406",
              message: 'Not Acceptable PaymentType Missing',
              filename: invoice['document_nr']
            };
            warningMessage(logData, 'payment_type_not_found');
            return resolve('payment_type_not_found');
          }
          let tempPaymentType = paymentType.filter(e => e.id == invoice.payment_type_id);
          invoice['paymentType'] = tempPaymentType;
          let contact = await getContact(accessToken, invoice.contact_id);

          if (!contact) {
            invoiceCid = await setInvoiceSendStatus(partyId, invoiceId, invoice['document_nr'], '0', 'contact_not_found', channel);
            const logData = {
              ...commonErrors,
              errorTitle: req.originalUrl,
              errorDescription: 'From:' + path.basename(__filename) + ' ' + 'contact_not_found -req param,' + JSON.stringify(req.body),
              netcomId: decryptData?.body?.netcomId,
              channel: channel,
              messagetype: "406",
              message: 'Not Acceptable Contact Missing',
              filename: invoice['document_nr']
            };
            warningMessage(logData, 'contact_not_found');
            return resolve('contact_not_found');
          }
          invoice['contact'] = contact;
          await Promise.all(invoice.positions.map(async (items) => {
            //console.log('items.tax_id',items.tax_id);
            if (items.tax_id) {
              let tempTax = await getTaxs(accessToken, items.tax_id);
              if (!tempTax) {
                invoiceCid = await setInvoiceSendStatus(partyId, invoiceId, invoice['document_nr'], '0', 'tax_not_Found', channel);
                const logData = {
                  ...commonErrors,
                  errorTitle: req.originalUrl,
                  errorDescription: 'From:' + path.basename(__filename) + ' ' + 'tax_not_Found -req param,' + JSON.stringify(req.body),
                  netcomId: decryptData?.body?.netcomId,
                  channel: channel,
                  messagetype: "406",
                  message: 'Not Acceptable Tax Missing',
                  filename: invoice['document_nr']
                };
                warningMessage(logData, 'tax_not_Found');
                return resolve('tax_not_Found');
              }
              items['tax'] = tempTax;
            }
            let tempItem;
            //console.log('tempItem',tempItem);
            if ('article_id' in items) {
              tempItem = await getProducts(accessToken, items.article_id);
              items['article'] = tempItem;
              // //console.log('articleas',items['article']);

            } else {
              //console.log('items',items);

              items['article'] = {}
              items['article']['intern_name'] = items.text;
              items['article']['intern_description'] = items.text;

            }


            return resolve(true);
          }));

          invoiceCid = await setInvoiceSendStatus(partyId, invoiceId, invoice['document_nr'], '1', '', channel);
          let xml;

          let billDetails = await getRefrenceNumber(pdfContent, invoice['document_nr']);
          xml = await setInvoiceToOt(invoice, coutryList, invitionData[0], pdfContent, fileName, customerIds, invoiceCid, channel, billDetails);
          //  //console.log('xml',xml);
          if (xml == false) {
            invoiceCid = await setInvoiceSendStatus(partyId, invoiceId, invoice['document_nr'], '0', 'xml_not_found', channel);
            const logData = {
              ...commonErrors,
              errorTitle: req.originalUrl,
              errorDescription: 'From:' + path.basename(__filename) + 'xml_not_found ' + '-invoices param,' + JSON.stringify(invoice),
              netcomId: decryptData?.body?.netcomId,
              channel: channel,
              messagetype: "406",
              message: 'Not Acceptable XML Missing',
              filename: invoice['document_nr']
            };
            warningMessage(logData, 'xml_not_found');
            return resolve('xml_not_found');
          }
          let invoiceFilePushD: any = await invoiceFilePush(invitionData[0].rk_netcomidsender, 'WS', xml, invoice['document_nr'], channel.toUpperCase());
          if (invoiceFilePushD?.message == 'no_active_interface') {
            let invoiceCid = await setInvoiceSendStatus(partyId, invoiceId, '', '0', 'no_active_interface', channel);
            const logData = {
              ...commonErrors,
              errorTitle: req.originalUrl,
              errorDescription: 'From:' + path.basename(__filename) + 'no_active_interface ' + '-invoices param,' + JSON.stringify(invoice),
              netcomId: decryptData?.body?.netcomId,
              channel: channel,
              messagetype: "503",
              message: "Service Unavailable Filepush",
              filename: invoice['document_nr']
            };
            warningMessage(logData, 'no_active_interface');
            resolve(invoiceCid);
            return;
          }

          if (!invoiceFilePushD) {
            let invoiceCid = await setInvoiceSendStatus(partyId, invoiceId, '', '0', 'file_push_error', channel);
            const logData = {
              ...commonErrors,
              errorTitle: req.originalUrl,
              errorDescription: 'From:' + path.basename(__filename) + 'file_push_error ' + '-invoices param,' + JSON.stringify(invoice),
              netcomId: decryptData?.body?.netcomId,
              channel: channel,
              messagetype: "503",
              message: 'Service Unavailable Filepush',
              filename: invoice['document_nr']
            };
            warningMessage(logData, 'file_push_error');
            resolve(invoiceCid);
            return;
          }
          console.log('invoiceFilePushD', invoiceFilePushD);
          await markAsIssued(accessToken, invoiceId);
          let redisKey = req.body.partyId + "_/";
          await deleteRedis('sendInvoice', redisKey);
        }
        else {
          invoiceCid = await setInvoiceSendStatus(partyId, invoiceId, invoice['document_nr'], '0', 'invoice_push_error', channel);
          const logData = {
            ...commonErrors,
            errorTitle: req.originalUrl,
            errorDescription: 'From:' + path.basename(__filename) + 'invoice_push_error ' + '-invoices param,' + JSON.stringify(invoice),
            netcomId: decryptData?.body?.netcomId,
            channel: channel,
            messagetype: "503",
            message: 'Service Unavailable BusinessConnection InActive',
            filename: invoice['document_nr']
          };
          warningMessage(logData, 'invoice_push_error');
          return resolve('invoice_push_error');
        }
      }
      catch (error) {
        console.error('Error in pushEDIInvoice:', error);
        return reject(error); // Ensure the promise is rejected.
      }
    } catch (error) {
      console.error('Error in pushEDIInvoice:', error);
      reject(error); // Ensure the promise is rejected.
    }
  });
}
export const getInvoiceOT = async (access_token, invoiceId) => {
  return new Promise(async (resolve, reject) => {
    var options = {
      'method': 'GET',
      'url': `https://api.bexio.com/2.0/kb_invoice/${invoiceId}`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + access_token
      }
    };
    //  console.log('optionsoptions',options);

    request(options, function (error, response) {
      // //console.log("response::::",response.statusCode,response.body);

      if (error) {
        ////console.log('errorerrorerror',error);

        commonErrors['errorTitle'] = 'getInvoiceOT';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + invoiceId;
        warningMessage(commonErrors, error);
        return resolve(false)
      }
      if (response.statusCode == 200) {
        ////console.log('JSON.parse(response.body)',JSON.parse(response.body));
        return resolve(JSON.parse(response.body));

      }
      else {
        return resolve(false)

      }
    });
  });
}
export const getConnectionDetails = async (partyId, accountId, contactId, req, channel?) => {
  try {
    console.log(contactId);
    let dataCookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.cookies[config.EXPIRE_EXPIRES_COOKIE_NAME])));
    console.log('dataCookie', dataCookie);

    const partyObjectId = await connectBexio.contact_bc.findMany({
      where: {
        rk_netcomidsender: dataCookie.netcomId,
        rk_sendercontactid: contactId,
        type: channel ?? 'EDI',
        rk_businessconnection: {
          not: null,
        },
      },
    });
    console.log('partyObjectId', partyObjectId);

    return partyObjectId;
  } catch (error) {
    commonErrors['errorTitle'] = getConnectionDetails.name;
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + contactId;
    warningMessage(commonErrors, error);
    ////console.log(error);

  }
}
export const constGetContactId = async (code) => {
  try {
    ////console.log(code);
    const getCustomerIdResult = await connectNewGate2b.$queryRaw<any>(Prisma.sql`
  SELECT json_extract_path("ot_updator"::json,'in_custom_id') AS senderId,
  json_extract_path("ot_updator"::json,'out_custom_id')  AS receiverId
FROM  g2b_business_connections 
  WHERE id = ${Number(code)}
  `);
    return getCustomerIdResult
  } catch (error) {
    commonErrors['errorTitle'] = constGetContactId.name;
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + code;
    warningMessage(commonErrors, error);
  }
}
export const getInvoicePdf = async (accessToken, invoiceId) => {
  try {
    return new Promise((resolve) => {
      const options = {
        method: 'GET',
        url: `https://api.bexio.com/2.0/kb_invoice/${invoiceId}/pdf`,
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + accessToken,
        },
      };
      console.log("getInvoicePdf options:", options);


      request(options, function (error, response) {
        if (error) {
          commonErrors['errorTitle'] = 'getInvoicePdf';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + invoiceId;
          warningMessage(commonErrors, error);
          return resolve(false)
        }

        if (!response) {
          console.error('No response received for invoice:', invoiceId);
          return resolve(false);
        }

        console.log('response.statusCode pdf::::', response.statusCode);

        if (response.statusCode == 200) {
          return resolve(response.body);
        } else if (response.statusCode == 401) {
          return resolve({ response: response.statusCode, message: 'unauthorized' });
        } else {
          return resolve(false);
        }
      });
    });
  } catch (error) {
    commonErrors['errorTitle'] = getInvoicePdf.name;
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + accessToken + ' ' + invoiceId;
    warningMessage(commonErrors, error);
    return false;


  }
}
export const getCountryLists = async (access_token) => {
  try {
    return new Promise(async (resolve, reject) => {
      var options = {
        'method': 'GET',
        'url': `https://api.bexio.com/2.0/country`,
        'headers': {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + access_token
        }
      };
      request(options, function (error, response) {
        if (error) {
          commonErrors['errorTitle'] = 'getCountryLists';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + access_token;
          warningMessage(commonErrors, error);
          return resolve(false)
        }
        if (response.statusCode == 200) {
          return resolve(response.body);
        } else if (response.statusCode == 401) {
          return resolve(response.statusCode);
        } else {
          return resolve(false)
        }

      });
    });
  } catch (error) {
    commonErrors['errorTitle'] = "getCountryLists";
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + access_token;
    warningMessage(commonErrors, error);
    return resolve('');
  }
}
export const getBank = async (access_token, id) => {
  ////console.log(id);
  return new Promise(async (resolve, reject) => {

    var options = {
      'method': 'GET',
      'url': `https://api.bexio.com/3.0/banking/accounts/${id}`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + access_token
      }
    };
    request(options, function (error, response) {
      //console.log('response getBank',response.body);
      //console.log('response.statusCode',response.statusCode);

      if (error) {
        commonErrors['errorTitle'] = 'getBank';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + id;
        warningMessage(commonErrors, error);
        return resolve(false)
      }
      if (response.statusCode == 200)
        return resolve(JSON.parse(response.body));
      else
        return resolve(false);
    });
  });
}
export const getCurrency = async (access_token, id) => {

  return new Promise(async (resolve, reject) => {
    var options = {
      'method': 'GET',
      'url': `https://api.bexio.com/3.0/currencies/${id}`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + access_token
      }
    };
    request(options, function (error, response) {
      if (error) {
        commonErrors['errorTitle'] = 'getCountryLists';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,', id;
        warningMessage(commonErrors, error);
        return resolve(false)
      }
      if (response.statusCode == 200)
        return resolve(JSON.parse(response.body));
      else
        return resolve(false)
    });
  });
}
export const getloginUserCompanyDetails = async (access_token) => {
  try {

    return new Promise(async (resolve, reject) => {

      var options = {
        'method': 'GET',
        'url': 'https://api.bexio.com/2.0/company_profile',
        'headers': {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + access_token
        }
      };

      request(options, function (error, response) {
        if (error) {
          commonErrors['errorTitle'] = "getloginUserCompanyDetails";
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + access_token;
          warningMessage(commonErrors, error);
          return resolve(false);
        }
        if (response.statusCode == 200)
          return resolve(response.body)
        else
          return resolve(false)

      });
    });

  } catch (error) {
    commonErrors['errorTitle'] = "getloginUserCompanyDetails";
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + access_token;
    warningMessage(commonErrors, error);
    return resolve('');
  }
}
export const getPaymentType = async (access_token, id) => {

  return new Promise(async (resolve, reject) => {
    var options = {
      'method': 'GET',
      'url': `https://api.bexio.com/2.0/payment_type`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + access_token
      }
    };
    request(options, function (error, response) {
      if (error) {
        commonErrors['errorTitle'] = 'getPaymentType';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + access_token;
        warningMessage(commonErrors, error);
        return resolve(false)
      }
      if (response.statusCode == 200)
        return resolve(JSON.parse(response.body));
      else
        return resolve(false)
    });
  });
}
export const getContact = async (access_token, id) => {

  return new Promise(async (resolve, reject) => {
    var options = {
      'method': 'GET',
      'url': `https://api.bexio.com/2.0/contact/${id}`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + access_token
      }
    };
    request(options, function (error, response) {
      if (error) {
        commonErrors['errorTitle'] = 'getContact';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + id;
        warningMessage(commonErrors, error);
        return resolve(false)
      }
      console.log('responseof contact', response);

      if (response.statusCode == 200)
        return resolve(JSON.parse(response.body));
      else
        return resolve(false)
    });
  });
}
export const getProducts = async (access_token, id) => {
  ////console.log('IDDD',id);

  return new Promise((resolve, reject) => {
    var options = {
      'method': 'GET',
      'url': `https://api.bexio.com/2.0/article/${id}`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + access_token
      }
    };
    request(options, function (error, response) {
      if (error) {
        commonErrors['errorTitle'] = 'getProducts';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + id;
        warningMessage(commonErrors, error);
        return resolve(false)
      }
      if (response.statusCode == 200)
        return resolve(JSON.parse(response.body));
      else
        return resolve(false);


    });
  });
}
export const getTaxs = async (access_token, id) => {

  return new Promise(async (resolve, reject) => {
    var options = {
      'method': 'GET',
      'url': `https://api.bexio.com/3.0/taxes/${id}`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + access_token
      }
    };
    request(options, function (error, response) {
      if (error) {
        commonErrors['errorTitle'] = 'getTaxs';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + id;
        warningMessage(commonErrors, error);
        return resolve(false)
      }
      ////console.log(response?.body);

      if (response?.statusCode == 200)
        return resolve(JSON.parse(response?.body));
      else
        return resolve(false)

    });
  });
}
export const setInvoiceToOt = async (invoice, coutryList, invitionData, pdf, fileName, customerIds, invoiceCid, channel, billDetails) => {
  console.log('invitionData', invitionData);
  console.log('billDetails', billDetails);
  console.log('billDetails ref', billDetails['ref']);
  let emptyValue = 'NA'
  let taxIsAdded;

  let priceQuantity = '1'
  let orderUnit = {
    'Stk': 'C62',
    'h': 'HUR'
  }
  //console.log('setInvoiceToOt : invitionData -> ',invitionData);
  let total = '';
  //console.log("invoice['total_credit_vouchers'] == 0",invoice['total_credit_vouchers'] == 0);

  total = invoice['total_remaining_payments'];
  //console.log('totalqqqqqqqqqqqqqq',total);

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
            "TAX_DETAILS_FIX": []
          }
        }]))
      }]
    }
  }))

  let v = coutryList.filter(coutry => coutry.id == invoice.contact.country_id)
  taxIsAdded = invoice.taxs.length;

  obj.OPENTRANS.INVOICE[0]['INVOICE_HEADER'][0]['INVOICE_INFO'].push(JSON.parse(JSON.stringify({
    "INVOICE_ID": invoice.document_nr,
    "INVOICE_DATE": new Date(invoice.is_valid_from).toISOString(),
    "INVOICE_TYPE": "invoice",
    "DELIVERY_DATE": [{
      "DELIVERY_START_DATE": new Date(invoice.is_valid_from).toISOString(),
      "DELIVERY_END_DATE": new Date(invoice.is_valid_from).toISOString(),
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
          "bmecat:NAME": invoice.companyProfile[0].name ? invoice.companyProfile[0].name : undefined,
          "bmecat:STREET": invoice.companyProfile[0].address ? invoice.companyProfile[0].address : undefined,
          "bmecat:ZIP": invoice.companyProfile[0].postcode ? invoice.companyProfile[0].postcode : undefined,
          "bmecat:CITY": invoice.companyProfile[0].city ? invoice.companyProfile[0].city : undefined,

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
          "bmecat:NAME2": invoice.contact.name_2 ? invoice.contact.name_2 : undefined,
          "bmecat:STREET": invoice.contact.street_name ? `${invoice.contact.street_name} ${invoice.contact.house_number ?? ''}`.trim() : undefined,
          "bmecat:ZIP": invoice.contact.postcode ? invoice.contact.postcode : undefined, //NOT IN BEXIO CONTACTS - REMOVED 
          "bmecat:CITY": invoice.contact.city ? invoice.contact.city : undefined,
          // "bmecat:COUNTRY": invoice.contact.country_id?coutryList.filter(coutry => coutry.id == invoice.contact.country_id)[0].name:undefined,
          "bmecat:COUNTRY_CODED": invoice.contact.country_id ? coutryList.filter(coutry => coutry.id == invoice.contact.country_id)[0].iso_3166_alpha2 : undefined,
          "bmecat:EMAIL": invoice.contact.mail ? invoice.contact.mail : undefined,

        }]
      }]
    }],
    "INVOICE_ISSUER_IDREF": [{
      "_": invitionData.sendercustomerid
    }],
    "INVOICE_RECIPIENT_IDREF": [{
      "_": invitionData.receiver_customerid,
      "$": {
        "type": "supplier_specific"
      }
    }],
    "bmecat:CURRENCY": invoice.currency['name'],
    "PAYMENT": invoice.bank != '' ? [{
      "ACCOUNT": [{
        "HOLDER": invoice.bank?.owner ? invoice.bank.owner : '',
        "BANK_ACCOUNT": [{
          "_": invoice.bank?.iban_nr ? invoice.bank.iban_nr : '',
          "$": {
            "type": "iban"
          }
        }],
        "BANK_CODE": [{
          "_": invoice.bank?.bank_nr ? invoice.bank.bank_nr : '',
          "$": {
            "type": "bic"
          }
        }],
        "BANK_NAME": invoice.bank?.bank_name ? invoice.bank.bank_name : '',
        // "BANK_COUNTRY": invoice.bank.currency_id NOT IN BEXIO BANK - REMOVED
      }],
      "PAYMENT_TERMS": [{
        "TIME_FOR_PAYMENT": [{
          "DAYS": ["30"]
        }],
        "VALUE_DATE": invoice.is_valid_to
      }]
    }] : undefined,
    "MIME_INFO": [{
      "MIME": [{
        "MIME_EMBEDDED": {
          "MIME_DATA": [{
            "_": pdf,
            //   "$": {
            //     "contentType": "application/pdf"
            // }
          }],
          "FILE_NAME": fileName ? fileName : 'temp'
        }
      }]
    }],
    "REMARKS": invoice.title ? invoice.title : undefined,
    "HEADER_UDX": customerIds.length != 0 || invoiceCid ? [{
      "HEADER_UDX_OPT": [{
        "BEX_VERSION": "VER1",
        "BEX_INVOICE_DOCUMENT_ID": invoiceCid ? invoiceCid : undefined
      }],
      "SENDER_CUSTOM_ID_1": customerIds[0]?.senderid ? customerIds[0].senderid : undefined,
      "RECEIVER_CUSTOM_ID_1": customerIds[0]?.receiverid ? customerIds[0].receiverid : undefined,
      "QR_REFERENCE": billDetails['ref'] ?? undefined
    }] : undefined
  })))
  let allTax: any = []
  //console.log('customerIds.length',customerIds.length);

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



  invoice.taxs.length != 0 ?
    invoice.taxs.forEach(element => {
      JSON.parse(JSON.stringify(obj.OPENTRANS['INVOICE'][0]['INVOICE_SUMMARY'][0]['TOTAL_TAX']["TAX_DETAILS_FIX"].push(
        {
          "bmecat:TAX": element.percentage,
          "TAX_AMOUNT": element.value
        }
      )))
    })
    : obj.OPENTRANS['INVOICE'][0]['INVOICE_SUMMARY'][0]['TOTAL_TAX']["TAX_DETAILS_FIX"] = '';


  //console.log('123',obj.OPENTRANS['INVOICE'][0]['INVOICE_SUMMARY'][0]);

  for (let index = 0; index < invoice.positions.length; index++) {
    let element = invoice.positions[index];
    console.log('element*', element);

    let arr, status = true;


    obj.OPENTRANS.INVOICE[0]['INVOICE_ITEM_LIST'][0]['INVOICE_ITEM'].push(JSON.parse(JSON.stringify({
      "$": {
        "type": "order_item"
      },
      "LINE_ITEM_ID": element.pos ? element.pos : index,
      "PRODUCT_ID": [{
        "bmecat:SUPPLIER_PID": element?.article?.intern_code ? element.article.intern_code.substring(0, 23) : undefined,
        ...(element?.article?.deliverer_code
          ? {
            "bmecat:INTERNATIONAL_PID": {
              "_": element?.article?.deliverer_code,
              "$": {
                "type": "ean"
              }
            }
          }
          : {}),
        "bmecat:DESCRIPTION_SHORT": element?.article?.intern_name ? decode(element.article.intern_name).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').substring(0, 145) : undefined, // product id mandatory field so just added intername as description short
        "bmecat:DESCRIPTION_LONG": element?.text ? decode(element.text).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '') : (element?.article?.intern_description ? decode(element.article.intern_description).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '') : undefined)
      }],
      "QUANTITY": element.amount ? Math.trunc(element.amount) : 1,
      "bmecat:ORDER_UNIT": orderUnit[element.unit_name] ? orderUnit[element.unit_name] : 'C62', // add defult value directly
      "PRODUCT_PRICE_FIX": [JSON.parse(JSON.stringify({
        "bmecat:PRICE_AMOUNT": element.unit_price == null ? 0.00 : parseFloat(element.unit_price).toFixed(2),
        "ALLOW_OR_CHARGES_FIX": [{
          "ALLOW_OR_CHARGE": [{
            "$": {
              "type": "allowance"
            },
            "ALLOW_OR_CHARGE_TYPE": 'cash_discount',
            "ALLOW_OR_CHARGE_VALUE": {
              "AOC_PERCENTAGE_FACTOR": element.discount_in_percent,
            }

          }]
        }],
        "TAX_DETAILS_FIX": element.tax?.value && taxIsAdded > 0 ? [{
          "bmecat:TAX_TYPE": element.tax?.type,
          "bmecat:TAX": element.tax?.value
          // "TAX_AMOUNT": element.tax_value
        }] : undefined,


        "bmecat:PRICE_QUANTITY": priceQuantity, // add defult value directly.
      })),
      ],
      "PRICE_LINE_AMOUNT": element.position_total ? parseFloat(element.position_total).toFixed(2) : 0.00,
      "ORDER_REFERENCE": [{
        "ORDER_ID": invoice.document_nr,
        "LINE_ITEM_ID": index
      }]



    })))
    // element.article.intern_description==''?delete obj.OPENTRANS.INVOICE[0]['INVOICE_ITEM_LIST'][0]['INVOICE_ITEM'][obj.OPENTRANS.INVOICE[0]['INVOICE_ITEM_LIST'][0]['INVOICE_ITEM'].length-1]['PRODUCT_ID'][0]['bmecat:DESCRIPTION_LONG']:'';
    element.discount_in_percent == null ? delete obj.OPENTRANS.INVOICE[0]['INVOICE_ITEM_LIST'][0]['INVOICE_ITEM'][obj.OPENTRANS.INVOICE[0]['INVOICE_ITEM_LIST'][0]['INVOICE_ITEM'].length - 1]['PRODUCT_PRICE_FIX'][0]['ALLOW_OR_CHARGES_FIX'] : '';
  }

  let builder = new xml2js.Builder({ 'xmldec.version': 1.0 });
  var xml = builder.buildObject(obj);
  return Buffer.from(xml).toString('base64');

}
export async function invoiceFilePush(netcomId, service, data, filename, type) {
  // //console.log('netcomId',netcomId);
  // //console.log('service',service); 
  // //console.log('data',data);
  // //console.log('filename',filename);
  // //console.log('type',type);

  let formData
  return new Promise(async (resolve, reject) => {
    formData = {
      netcom_id: netcomId,
      interface: service,
      data: data,
      filename: filename + '.xml',
      module: type
    }
    // console.log('bexio-file-drop formData',formData);

    let options = {
      'method': 'POST',
      'url': config.GATE2BURL + 'bexio-file-drop',
      // 'headers': headers,
      formData: formData
    };
    request(options, function (error, response) {
      try {
        console.log('response1python', response)
        console.log('response1python1', error)
        if (error) {
          const logData = {
            ...commonErrors,
            errorTitle: 'bexio-file-drop',
            errorDescription: 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + JSON.stringify(formData),
            netcomId: netcomId,
            filename: filename + '.xml',
            channel: type,
            messagetype: "503",
            message: 'Service Unavailable Filepush'
          };
          warningMessage(logData, error);
          return resolve(false)
        }
        return resolve(JSON.parse(response?.body))
      } catch (error) {
        reject(error)
      }

    });
  });
}
export const deleteRedis = async (api, key) => {
  const checkAPI = JSON.parse(fs.readFileSync('./assets/iom_E76FAD2A-41E9-E211-84C9-D8D385E0B238.json'));
  let delApis = checkAPI.realated[api];

  const redis_client = await redisClient;

  try {
    delApis.split(",").forEach(async element => { // <--- make this async
      const pattern = key + element + '*';
      ////console.log(pattern);

      const data = await redis_client.keys(pattern); // use await instead of callback
      data.forEach(async apis => {
        await redis_client.del(apis); // also await here
      });
    });
  } catch (error) {
    ////console.log(error);
  }
};


export const pushEmailInvoice = async (invoices, bodyValues, headerParams, channel) => {
  return new Promise(async (resolve, reject) => {
    const decryptData = invoices;
    const invoice_id = invoices?.doc_id;
    const bill_recipient_email = invoices?.bill_recipient_email ?? '';
    const invoice_uuid = invoices?.invoice_uuid;
    const partyId = bodyValues?.partyId;
    let pdf, fileName, pdfContent;
    try {
      console.log('invoices::::', invoices, channel);


      let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(headerParams.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
      let accessToken = cookie.access_Token;

      pdf = await getInvoicePdf(accessToken, invoice_id);
      // console.log('pdf::::', pdf, invoice_id);
      if (pdf?.response == 401) {
        console.log('unauthorized');
        let invoiceCid = await setInvoiceSendStatus(partyId, invoice_id, '', '0', 'unauthorized', channel);
        const logData = {
          ...commonErrors,
          errorTitle: invoices.originalUrl,
          errorDescription: 'From:' + path.basename(__filename) + ' unauthorized' + '-invoices param,' + JSON.stringify(decryptData),
          netcomId: bodyValues?.netcomId,
          channel: channel,
          messagetype: "401",
          message: 'Unauthorized Bexio',
          filename: invoices?.documentNumber
        };
        warningMessage(logData, 'unauthorized');
        resolve('unauthorized' + invoiceCid);
        return;
      }
      if (!pdf) {
        console.log('pdf not found');

        let invoiceCid = await setInvoiceSendStatus(partyId, invoice_id, '', '0', 'pdf_not_found', channel);
        const logData = {
          ...commonErrors,
          errorTitle: invoices.originalUrl,
          errorDescription: 'From:' + path.basename(__filename) + ' pdf_not_found' + '-invoices param,' + JSON.stringify(decryptData),
          netcomId: bodyValues?.netcomId,
          channel: channel,
          messagetype: "406",
          message: 'Not Acceptable PDF Missing',
          filename: invoices?.documentNumber
        };
        warningMessage(logData, 'pdf_not_found');
        resolve('pdf_not_found' + invoiceCid);
        return;
      }

      pdfContent = JSON.parse(pdf).content;
      fileName = JSON.parse(pdf).name;

      let coutryList;
      coutryList = await getCountryLists(accessToken);
      if (!coutryList) {
        let invoiceCid = await setInvoiceSendStatus(partyId, invoice_id, '', '0', 'country_list_not_found', channel);
        const logData = {
          ...commonErrors,
          errorTitle: invoices.originalUrl,
          errorDescription: 'From:' + path.basename(__filename) + 'country_list_not_found ' + '-invoices param,' + JSON.stringify(decryptData),
          netcomId: bodyValues?.netcomId,
          channel: channel,
          messagetype: "406",
          message: 'Not Acceptable Country Missing',
          filename: invoices?.documentNumber
        };
        warningMessage(logData, 'country_list_not_found');
        return;
      }
      coutryList = JSON.parse(coutryList);
      const invoice: any = await getInvoiceOT(accessToken, invoice_id);
      let contact = await getContact(accessToken, invoice?.contact_id);
      if (!invoice) {
        console.log('Invoice not found');
        let invoiceCid = await setInvoiceSendStatus(partyId, invoice_id, '', '0', 'invoice_not_found', channel);
        const logData = {
          ...commonErrors,
          errorTitle: invoices.originalUrl,
          errorDescription: 'From:' + path.basename(__filename) + 'invoice_not_found' + '-invoices param,' + JSON.stringify(decryptData),
          netcomId: bodyValues?.netcomId,
          channel: channel,
          messagetype: "406",
          message: 'Not Acceptable Invoice Missing',
          filename: invoice['document_nr']
        };
        warningMessage(logData, 'invoice_not_found');
        resolve('invoice_not_found' + invoiceCid);
        return;
      }
      if (!contact) {
        console.log('contact not found');
        let invoiceCid = await setInvoiceSendStatus(partyId, invoice_id, '', '0', 'contact_not_found', channel);
        const logData = {
          ...commonErrors,
          errorTitle: invoices.originalUrl,
          errorDescription: 'From:' + path.basename(__filename) + 'contact_not_found' + '-invoices param,' + JSON.stringify(decryptData),
          netcomId: bodyValues?.netcomId,
          channel: channel,
          messagetype: "406",
          message: 'Not Acceptable Contact Missing',
          filename: invoice['document_nr']
        };
        warningMessage(logData, 'contact_not_found');
        return;
      }
      invoice.contact = contact;
      let temp = await getloginUserCompanyDetails(accessToken);
      console.log("getloginUserCompanyDetails:", typeof (temp));
      console.log("getloginUserCompanyDetails:", temp);
      if (!temp) {
        let invoiceCid = await setInvoiceSendStatus(partyId, invoice_id, invoice['document_nr'], '0', 'company_details_not_found', channel);
        const logData = {
          ...commonErrors,
          errorTitle: invoices.originalUrl,
          errorDescription: 'From:' + path.basename(__filename) + ' ' + 'company_details_not_found -req param,' + JSON.stringify(decryptData),
          netcomId: bodyValues?.netcomId,
          channel: channel,
          messagetype: "406",
          message: 'Not Acceptable Company Details Missing',
          filename: invoice['document_nr']
        };
        warningMessage(logData, 'company_details_not_found');
        return resolve('company_details_not_found');
      }
      invoice['companyProfile'] = temp;
      invoice['companyProfile'] = JSON.parse(invoice['companyProfile']);
      let currency = await getCurrency(accessToken, invoice.currency_id);
      if (!currency) {
        let invoiceCid = await setInvoiceSendStatus(partyId, invoice_id, invoice['document_nr'], '0', 'currency_not_found', channel);
        const logData = {
          ...commonErrors,
          errorTitle: invoices.originalUrl,
          errorDescription: 'From:' + path.basename(__filename) + ' ' + 'currency_not_found -req param,' + JSON.stringify(decryptData),
          netcomId: bodyValues?.netcomId,
          channel: channel,
          messagetype: "406",
          message: 'Not Acceptable Currency Missing',
          filename: invoice['document_nr']
        };
        warningMessage(logData, 'currency_not_found');
        return resolve('currency_not_found');
      }
      invoice['currency'] = currency;
      let xml: any = await setInvoiceEmailOt(invoice, bill_recipient_email, coutryList, pdfContent, fileName, {}, '', invoice_uuid);

      if (xml == false) {
        let invoiceCid = await setInvoiceSendStatus(partyId, invoice_id, '', '0', 'xml_not_found', channel);
        const logData = {
          ...commonErrors,
          errorTitle: invoices.originalUrl,
          errorDescription: 'From:' + path.basename(__filename) + ' ' + 'xml_not_found -req param,' + JSON.stringify(decryptData),
          netcomId: bodyValues?.netcomId,
          channel: channel,
          messagetype: "406",
          message: ' Not Acceptable XML Missing',
          filename: invoice['document_nr']
        };
        warningMessage(logData, 'xml_not_found');
        resolve('xml_not_found' + invoiceCid);

        return;
      }

      let filePush: any = await invoiceFilePush(bodyValues.netcomId, 'WS', xml, invoice.document_nr, channel);
      console.log('filePush::::', filePush, channel);
      console.log('type:', typeof filePush);
      console.log('filePush?.message', filePush?.message);
      if (filePush?.message == 'no_active_interface') {
        let invoiceCid = await setInvoiceSendStatus(partyId, invoice_id, '', '0', 'no_active_interface', channel);
        const logData = {
          ...commonErrors,
          errorTitle: invoices.originalUrl,
          errorDescription: 'From:' + path.basename(__filename) + ' no_active_interface' + '-invoices param,' + JSON.stringify(decryptData),
          netcomId: bodyValues?.netcomId,
          channel: channel,
          messagetype: "503",
          message: "Service Unavailable Filepush",
          filename: invoice['document_nr']
        };
        warningMessage(logData, 'no_active_interface');
        resolve(invoiceCid);
        return;
      }
      if (filePush) {
        let invoiceCid = await setInvoiceSendStatus(partyId, invoice_id, '', '1', '', channel);
        console.log('invoiceCid::::', invoiceCid);
        await markAsIssued(accessToken, invoice_id);
        resolve(invoiceCid);
        return;
      }

      if (!filePush) {
        let invoiceCid = await setInvoiceSendStatus(partyId, invoice_id, '', '0', 'file_push_error', channel);
        const logData = {
          ...commonErrors,
          errorTitle: invoices.originalUrl,
          errorDescription: 'From:' + path.basename(__filename) + ' file_push_error' + '-invoices param,' + JSON.stringify(decryptData),
          netcomId: bodyValues?.netcomId,
          channel: channel,
          messagetype: "503",
          message: "Service Unavailable Filepush",
          filename: invoice['document_nr']
        };
        warningMessage(logData, 'file_push_error');
        resolve(invoiceCid);
        return;
      }
    } catch (error) {
      await setInvoiceSendStatus(partyId, invoice_id, '', '0', 'push_email_invoice', channel);
      console.error('Error in pushEmailInvoice:', error);
      return reject(error);
    }
  });
};
export const pushEbillInvoiceProcess = async (invoices, billerId, bodyValues, channel) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('pushEbillInvoiceProcess', invoices);
      let tempIds = invoices
      for (let index = 0; index < tempIds.length; index++) {
        const element = tempIds[index];
        console.log('element.accessToken', element.accessToken);
        console.log('element.contactId', element.contactId);
        let contact: any = await getContact(element.accessToken, element.contactId);
        console.log('contact::::1', contact);
        // If contact exists, check for required keys

        const tempParam = {
          body: {
            invoice_id: element.doc_id,
            biller_pid: billerId,
            contact_pid: element.bill_recipient_id ?? "",
            contact_email: element.bill_recipient_email ?? "",
            invoice_uuid: "",
            allow: element.allow,
            token: element.accessToken,
            document_number: element.documentNumber
          }
        }
        if (!contact?.city || !contact?.country_id || !contact?.postcode) {
          console.log('contact missing address or postal');
          console.log('channel detail', channel);
          let invoiceCid = await setInvoiceSendStatus(bodyValues?.partyId, element.doc_id, '', '0', 'contact_missing_address_or_postal', 'EBILL', '', tempParam);
          const logData = {
            ...commonErrors,
            errorTitle: invoices.originalUrl,
            errorDescription: 'From:' + path.basename(__filename) + ' contact_missing_address_or_postal ' + '-invoices param,',
            netcomId: bodyValues?.netcomId,
            channel: 'EBILL',
            messagetype: "406",
            message: "Not Acceptable Contact Details Missing",
            filename: invoices.documentNumber
          };
          warningMessage(logData, 'contact_missing_address_or_postal');
          return resolve('contact_missing_address_or_postal' + invoiceCid);

        }
        let v = await pushEbillInvoice(tempParam, '')
      }
      resolve(true)
    } catch (error) {
      reject(error)
    }
  })
}
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
        return resolve(false)
      }
      else {
        if (response.statusCode == 200) {
          let resData = JSON.parse(response.body)

          if (resData.items[0].ebillSubmissionStatus != 'NOT_ALLOWED') {
            return resolve(true)
          }
          else {
            return resolve(false)
          }
        }
        else {
          return resolve(false)
        }
      }
    })
  })
}

export const pushEbillInvoice = async (req, res) => {
  console.log('pushEbillInvoice', req.body);

  return new Promise(async (resolve, reject) => {

    let formData
    formData = req.body;
    let invoiceCid: any;
    try {

      let invoice, paymentType
      const ebillPool = await connectMssql;
      const decryptData = req.body;
      console.log('decryptData', decryptData);

      let billerDetails = {
        'recipientid': decryptData.contact_pid,
        'contact_email': decryptData.contact_email,
        'billerid': decryptData.biller_pid,
        'allow': decryptData.allow
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
        invoiceCid = await setInvoiceSendStatus(partyId, decryptData.invoice_id, '', '0', 'biller_not_found', 'EBILL', '', decryptData);
        const logData = {
          ...commonErrors,
          errorTitle: req.originalUrl,
          errorDescription: 'From:' + path.basename(__filename) + 'biller_not_found ' + '-req param,' + JSON.stringify(decryptData),
          netcomId: getBillerResult.recordset[0].netcomid,
          channel: 'EBILL',
          messagetype: "406",
          message: 'Not Acceptable Biller Details Missing',
          filename: decryptData.document_number
        };
        warningMessage(logData, 'biller_not_found');
        resolve('biller_not_found')
        return
      }
      let accessToken = '';
      if ('token' in decryptData) {
        accessToken = decryptData.token;

      }
    
      ////console.log("checkRecipientData----", checkRecipientData);

      if (result.length == 0) {
        invoiceCid = await setInvoiceSendStatus(partyId, decryptData.invoice_id, '', '0', 'refreshToken_not_found', 'EBILL', '', decryptData);
        const logData = {
          ...commonErrors,
          errorTitle: req.originalUrl,
          errorDescription: 'From:' + path.basename(__filename) + 'refreshToken_not_found ' + '-req param,' + JSON.stringify(decryptData),
          netcomId: getBillerResult.recordset[0].netcomid,
          channel: 'EBILL',
          messagetype: "511",
          message: 'Network Authentication Required',
          filename: decryptData.document_number
        };
        warningMessage(logData, 'refreshToken_not_found');
        resolve('refreshToken_not_found')
        return
      }
      const invoiceId = decryptData.invoice_id;
      console.log('accessToken', accessToken);
      ////console.log('invoiceId', invoiceId);

      invoice = await getInvoiceOT(accessToken, invoiceId);
      console.log('invoice', invoice);
      if (!invoice) {
        invoiceCid = await setInvoiceSendStatus(partyId, decryptData.invoice_id, '', '0', 'invoice_not_found', 'EBILL', '', decryptData);
        const logData = {
          ...commonErrors,
          errorTitle: req.originalUrl,
          errorDescription: 'From:' + path.basename(__filename) + 'invoice_not_found' + '-req param,' + JSON.stringify(decryptData),
          netcomId: getBillerResult.recordset[0].netcomid,
          channel: 'EBILL',
          messagetype: "406",
          message: 'Not Acceptable Invoice Missing',
          filename: invoice['document_nr']
        };
        warningMessage(logData, 'invoice_not_found');
        return resolve('invoice_not_found')
      }


      let pdf, fileName, pdfContent;
      pdf = await getInvoicePdf(accessToken, invoiceId);
      if (pdf?.response == 401) {
        console.log('unauthorized');
        invoiceCid = await setInvoiceSendStatus(partyId, decryptData.invoice_id, '', '0', 'unauthorized', 'EBILL', '', decryptData);
        const logData = {
          ...commonErrors,
          errorTitle: req.originalUrl,
          errorDescription: 'From:' + path.basename(__filename) + ' unauthorized' + '-invoices param,' + JSON.stringify(decryptData),
          netcomId: getBillerResult.recordset[0].netcomid,
          channel: 'EBILL',
          messagetype: "401",
          message: 'Unauthorized Bexio',
          filename: invoice['document_nr']
        };
        warningMessage(logData, 'unauthorized');
        resolve('unauthorized' + invoiceCid);
        return;
      }
      if (!pdf) {
        invoiceCid = await setInvoiceSendStatus(partyId, decryptData.invoice_id, '', '0', 'pdf_not_found', 'EBILL', '', decryptData);
        const logData = {
          ...commonErrors,
          errorTitle: req.originalUrl,
          errorDescription: 'From:' + path.basename(__filename) + 'pdf_not_found' + '-req param,' + JSON.stringify(decryptData),
          netcomId: getBillerResult.recordset[0].netcomid,
          channel: 'EBILL',
          messagetype: "406",
          message: 'Not Acceptable PDF Missing',
          filename: invoice['document_nr']
        };
        warningMessage(logData, 'pdf_not_found');
        return resolve('pdf_not_found')
      }
      pdfContent = JSON.parse(pdf).content;
      fileName = JSON.parse(pdf).name;

      let coutryList;
      coutryList = await getCountryLists(accessToken);
      if (!coutryList) {
        invoiceCid = await setInvoiceSendStatus(partyId, decryptData.invoice_id, '', '0', 'country_list_not_found', 'EBILL', '', decryptData);
        const logData = {
          ...commonErrors,
          errorTitle: req.originalUrl,
          errorDescription: 'From:' + path.basename(__filename) + 'country_list_not_found' + '-req param,' + JSON.stringify(decryptData),
          netcomId: getBillerResult.recordset[0].netcomid,
          channel: 'EBILL',
          messagetype: "406",
          message: 'Not Acceptable Country Missing',
          filename: invoice['document_nr']
        };
        warningMessage(logData, 'country_list_not_found');
        return resolve('country_list_not_found' + invoiceCid);

      }
      coutryList = JSON.parse(coutryList);

      let currency = await getCurrency(accessToken, invoice.currency_id);
      if (!currency) {
        invoiceCid = await setInvoiceSendStatus(partyId, decryptData.invoice_id, '', '0', 'currency_not_found', 'EBILL', '', decryptData);
        const logData = {
          ...commonErrors,
          errorTitle: req.originalUrl,
          errorDescription: 'From:' + path.basename(__filename) + 'currency_not_found' + '-req param,' + JSON.stringify(decryptData),
          netcomId: getBillerResult.recordset[0].netcomid,
          channel: 'EBILL',
          messagetype: "406",
          message: 'Not Acceptable Currency Missing',
          filename: invoice['document_nr']
        };
        warningMessage(logData, 'currency_not_found');
        return resolve('currency_not_found' + invoiceCid);

      }
      invoice['currency'] = currency;
      let temp = await getloginUserCompanyDetails(accessToken);
      if (!temp) {
        invoiceCid = await setInvoiceSendStatus(partyId, decryptData.invoice_id, '', '0', 'company_details_not_found', 'EBILL', '', decryptData);
        const logData = {
          ...commonErrors,
          errorTitle: req.originalUrl,
          errorDescription: 'From:' + path.basename(__filename) + 'company_details_not_found' + '-req param,' + JSON.stringify(decryptData),
          netcomId: getBillerResult.recordset[0].netcomid,
          channel: 'EBILL',
          messagetype: "406",
          message: 'Not Acceptable Company Details Missing',
          filename: invoice['document_nr']
        };
        warningMessage(logData, 'company_details_not_found');
        return resolve('company_details_not_found');
      }
      invoice['companyProfile'] = temp;
      invoice['companyProfile'] = JSON.parse(invoice['companyProfile']);
      let contact = await getContact(accessToken, invoice.contact_id);
      if (!contact) {
        invoiceCid = await setInvoiceSendStatus(partyId, decryptData.invoice_id, '', '0', 'contact_not_found', 'EBILL', '', decryptData);
        const logData = {
          ...commonErrors,
          errorTitle: req.originalUrl,
          errorDescription: 'From:' + path.basename(__filename) + 'contact_not_found' + '-req param,' + JSON.stringify(decryptData),
          netcomId: getBillerResult.recordset[0].netcomid,
          channel: 'EBILL',
          messagetype: "406",
          message: 'Not Acceptable Contact Missing',
          filename: invoice['document_nr']
        };
        warningMessage(logData, 'contact_not_found');
        return resolve('contact_not_found');
      }
      invoice['contact'] = contact;
      if (invoice.positions.length != 0) {
        for (const items of invoice.positions) {
          if (items.tax_id) {
            let tempTax = await getTaxs(accessToken, items.tax_id);
            if (!tempTax) {
              invoiceCid = await setInvoiceSendStatus(partyId, decryptData.invoice_id, '', '0', 'tax_not_found', 'EBILL', '', decryptData);
              const logData = {
                ...commonErrors,
                errorTitle: req.originalUrl,
                errorDescription: 'From:' + path.basename(__filename) + 'tax_not_found' + '-req param,' + JSON.stringify(decryptData),
                netcomId: getBillerResult.recordset[0].netcomid,
                channel: 'EBILL',
                messagetype: "406",
                message: 'Not Acceptable Tax Missing',
                filename: invoice['document_nr']
              };
              warningMessage(logData, 'tax_not_found');
              return resolve('tax_not_found');
            }
            items['tax'] = tempTax;
          }
          let tempItem;
          if ('article_id' in items) {
            tempItem = await getProducts(accessToken, items.article_id);
            if (tempItem) {
              items['article'] = tempItem;
            }
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
      let invoiceCidSucess = await setInvoiceSendStatus(partyId, invoiceId, invoice['document_nr'], '1', '', 'EBILL', '', decryptData);
      console.log('billerDetails', billerDetails);
      invoice.partyId = partyId
      xml = await setInvoiceEbillOt(invoice, coutryList, '', pdfContent, fileName, '', billerDetails, decryptData, invoiceCidSucess);
      if (xml == false) {
        invoiceCid = await setInvoiceSendStatus(partyId, decryptData.invoice_id, '', '0', 'xml_not_found', 'EBILL', '', decryptData);
        const logData = {
          ...commonErrors,
          errorTitle: req.originalUrl,
          errorDescription: 'From:' + path.basename(__filename) + 'xml_not_found' + '-req param,' + JSON.stringify(decryptData),
          netcomId: getBillerResult.recordset[0].netcomid,
          channel: 'EBILL',
          messagetype: "406",
          message: 'Not Acceptable XML Missing',
          filename: invoice['document_nr']
        };
        warningMessage(logData, 'xml_not_found');
        return resolve('xml_not_found');
      }
      let filePush: any = await invoiceFilePush(getBillerResult.recordset[0].netcomid, 'WS', xml, invoice['document_nr'], 'EBILL');
      if (filePush?.message == 'no_active_interface') {
        let invoiceCid = await setInvoiceSendStatus(partyId, decryptData.invoice_id, '', '0', 'no_active_interface', 'EBILL');
        const logData = {
          ...commonErrors,
          errorTitle: req.originalUrl,
          errorDescription: 'From:' + path.basename(__filename) + 'no_active_interface' + '-req param,' + JSON.stringify(decryptData),
          netcomId: getBillerResult.recordset[0].netcomid,
          channel: 'EBILL',
          messagetype: "503",
          message: "Service Unavailable Filepush",
          filename: invoice['document_nr']
        };
        warningMessage(logData, 'no_active_interface');
        resolve(invoiceCid);
        return;
      }

      if (!filePush) {
        let invoiceCid = await setInvoiceSendStatus(partyId, decryptData.invoice_id, '', '0', 'file_push_error', 'EBILL');
        const logData = {
          ...commonErrors,
          errorTitle: req.originalUrl,
          errorDescription: 'From:' + path.basename(__filename) + 'file_push_error' + '-req param,' + JSON.stringify(decryptData),
          netcomId: getBillerResult.recordset[0].netcomid,
          channel: 'EBILL',
          messagetype: "503",
          message: 'Service Unavailable Filepush',
          filename: invoice['document_nr']
        };
        warningMessage(logData, 'file_push_error');
        resolve(invoiceCid);
        return;
      }
      await markAsIssued(accessToken, decryptData.invoice_id,'EBILL');
      return resolve(true)
    } catch (error) {
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + formData;
      warningMessage(commonErrors, error);
      return resolve('push_ebill_invoice')
    }
  });
}
export const setEbillInvoiceSendStatus = async (partyId, invoiceId, invoicenumber, formData, status, error?, receiverId?) => {
  let sendInvoiceId;
  console.log('invoiceId', invoiceId);
  console.log('responseBody error', error);
  let responseBody = error || '';
  console.log('responseBody', responseBody);
  return new Promise(async function (resolve, reject) {
    try {
      const selectQryResult = await connectBexio.documents_invoice_send.findMany({
        where: {
          rk_invoice: invoiceId,
          // invoice_type: 'EBILL',
          companyregistered: {
            rk_party: Number(partyId),
          },
        },
        select: {
          cid: true,
          object_id: true,
          rk_invoice: true,
          companyregistered: {
            select: {
              cid: true,
            },
          },
        },
      });

      if (selectQryResult.length == 0) {
        console.log('create');

        const selectCompanyregisteredQryResult = await connectBexio.companyregistered.findMany({
          where: {
            rk_party: Number(partyId),

          }
        });
        const result = await connectBexio.documents_invoice_send.create({
          data: {
            rk_invoice: invoiceId,
            invoice_number: invoicenumber,
            fk_companyregistered: Number(selectCompanyregisteredQryResult[0].cid),
            invoice_type: 'EBILL',
            invoice_params: formData,
            response: responseBody,
            status: Number(status),
            receiver_contactid: receiverId,
            is_notifyed: false,
          },
          select: {
            object_id: true,
          },
        });
        sendInvoiceId = result.object_id;
      } else {
        sendInvoiceId = selectQryResult[0].object_id;
        console.log('updateMany');
        console.log('Number(invoiceId)', Number(invoiceId));
        console.log('bigint(invoiceId)', BigInt(invoiceId));
        console.log('responseBody', responseBody);
        const updateResult = await connectBexio.documents_invoice_send.updateMany({
          where: {
            fk_companyregistered: selectQryResult[0].companyregistered?.cid,
            rk_invoice: BigInt(invoiceId),
          },
          data: {
            time_stamp: new Date(),
            invoice_params: formData,
            is_notifyed: false,
            reference_id: null,
            response: responseBody,
            status: Number(status),
            invoice_type: 'EBILL',
          },
        });
        console.log("updateResult:", updateResult);
      }

      return resolve(sendInvoiceId);
    } catch (error) {
      console.log(error);
      commonErrors['errorTitle'] = setEbillInvoiceSendStatus.name;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + partyId + '-partyId' + invoiceId + '-invoiceId' + invoicenumber + 'invoiceNumber';
      warningMessage(commonErrors, error);
      return resolve('');

    }
  });

}
export const notifiBexioBulk = async (token, id, status, message?, netcomId?, amount?, bankId?) => {
  let options;
  ////console.log('refreshToken',token);
  let params = {
    refreshToken: token,
    id: id,
    status: status,
    amount: amount,
  }
  let tempMsg, erroMsg = '';
  ////console.log('typeof(message)',typeof(message));

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
  ////console.log('erroMsg',erroMsg);

  ////console.log('id',id);
  ////console.log('status',status);
  await addBexioCommentBulk(token, id, status, erroMsg, netcomId);

  return new Promise(async (resolve, reject) => {
    try {
      ////console.log('bankId',bankId);

      if (status == 'COMPLETED') {
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
        if (getCompanyIdQryResult.length > 0) {
          isNotifyBexio = false;
        }
        ////console.log('isNotifyBexio',isNotifyBexio);
        if (isNotifyBexio) {
          options = {
            'method': 'POST',
            'url': `https://api.bexio.com/2.0/kb_invoice/${id}/payment`,
            'headers': {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
              "value": amount,
              "bank_account_id": bankId ? bankId : undefined
            })
          };
          ////console.log('optionsoptions',options);
          request(options, async function (error, response) {
            if (error) {
              ////console.log('errorr',error);
              commonErrors['errorTitle'] = 'notifiBexio';
              commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + JSON.stringify(params);
              warningMessage(commonErrors, error);
              return resolve(false)
            }
            let resStatus = 'success' in JSON.parse(response.body) ? true : false;
            if (response.statusCode == 201 || resStatus) {

              return resolve(JSON.parse(response.body));
            }
            else {
              commonErrors['errorTitle'] = 'notifiBexio';
              commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + response.body.toString() + '-bexio param,' + JSON.stringify(params);
              warningMessage(commonErrors, error);
              return resolve(false)
            }

          });
        } else {
          return resolve(false);
        }
      } else if (status == 'ERROR' || status == 'INCORRECT' || status == 'REJECTED' || status == 'ERROR-INTERNAL') {
        options = {
          'method': 'POST',
          'url': `https://office.bexio.com/api.php/kb_invoice/${id}/mark_as_ebill_failed`,
          'headers': {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        };
        request(options, async function (error, response) {
          if (error) {
            commonErrors['errorTitle'] = 'notifiBexio';
            commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + JSON.stringify(params);
            warningMessage(commonErrors, error);
            return resolve(false)
          }

          console.log('notifiBexionotifiBexio statusCode', response.statusCode);
          console.log('notifiBexionotifiBexio', response.body);
          let resStatus;
          if (typeof (response.body) == 'object') {
            resStatus = 'success' in JSON.parse(response.body) ? true : false;

          } else {
            resStatus = false;
          }

          if (response.statusCode == 201 || resStatus) {

            return resolve(JSON.parse(response.body));
          }
          else {
            commonErrors['errorTitle'] = 'notifiBexio';
            commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + response.body.toString() + '-bexio param,' + JSON.stringify(params);
            warningMessage(commonErrors, error);
            return resolve(false);
          }

        });
      } else {
        return resolve(true);
      }
      ////console.log('options',options);
    } catch (error) {
      commonErrors['errorTitle'] = 'notifiBexio';
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + JSON.stringify(params);
      warningMessage(commonErrors, error);
      return resolve(false)
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
  let getCompanydata = await connectBexio.companyregistered.findMany({
    where: {
      netcomid: getrecipientId.recordset[0].netcomid,
    },
    select: {
      cid: true,
    },
  });

  if (getrecipientId.recordset.length) {
    if (getrecipientId.recordset[0].islinked) {
      await transaction.commit();
      return true;
    } else {
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
      await transaction.commit();
      return true;
    }
  } else {
    const getBiller = `SELECT id,netcomid FROM biller 
                       WHERE billerId = '${billerId}'`;
    const getBillerId = await pool.query(getBiller);
    const getCompanyDetails = await connectBexio.companyregistered.findMany({
      where: {
        netcomid: getBillerId.recordset[0].netcomid,
      },
      select: {
        cid: true,
      },
    });
    const getContactCheckResult = await connectBexio.contact_bc.findMany({
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

    const addReceipient = ` INSERT INTO recipient (fk_biller,recipientId,islinked,source,status) 
        VALUES('${getBillerId.recordset[0].id}','${receiptId}','${1}','BEX','SUBSCRITPTION')`;
    ////console.log("addReceipient----",addReceipient);
    // receipeint details are may be different in bexio and six, so we can't add details from bexio 
    ////console.log("addReceipient----",addReceipient);
    await new sql.Request(transaction).query(addReceipient);
    try {
      const addlogs = ` INSERT INTO log (billerId,recipientId,source,status) 
          VALUES('${billerId}','${receiptId}','BEX','')`;
      ////console.log("addReceipient----",addlogs);
      await new sql.Request(transaction).query(addlogs);
    } catch (error) {
      ////console.log('error while adding six logs');
    }
    await transaction.commit();
    return true;
  }
}

export const setInvoiceEbillOt = async (invoice, coutryList, contactNumber, pdf, fileName, invoiceCid, billerDetails, formData, invoiceLogUid) => {
  console.log('EBILLLL', billerDetails);
  let taxIsAdded;
  let priceQuantity = '1'
  let orderUnit = {
    'Stk': 'C62',
    'h': 'HUR'
  }
  let billDetails = await getRefrenceNumber(pdf, invoice.document_nr, billerDetails);
  let total = '';
  total = invoice['total_remaining_payments'];
  console.log('REFERENCE_NUMBER', billerDetails);
  if (!billDetails) {
    invoiceCid = await setInvoiceSendStatus(invoice.partyId, invoice.document_nr, '', '0', 'QR_code_not_found', 'EBILL', '', formData);
    commonErrors['errorTitle'] = 'QR_code_not_found';
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + 'QR_code_not_found' + '-req param,' + JSON.stringify(formData);
    warningMessage(commonErrors, 'QR_code_not_found');
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
          "CONTROL_INFO": [],
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
            "TAX_DETAILS_FIX": []
          }
        }]))
      }]
    }
  }))

  let v = coutryList.filter(coutry => coutry.id == invoice.contact.country_id)
  taxIsAdded = invoice.taxs.length;
  obj.OPENTRANS.INVOICE[0]['INVOICE_HEADER'][0]['CONTROL_INFO'].push(JSON.parse(JSON.stringify({
    "GENERATION_DATE": new Date(invoice.is_valid_from).toISOString(),
  }))),
    obj.OPENTRANS.INVOICE[0]['INVOICE_HEADER'][0]['INVOICE_INFO'].push(JSON.parse(JSON.stringify({
      "INVOICE_ID": invoice.document_nr,
      "INVOICE_DATE": new Date(invoice.is_valid_from).toISOString(),
      "INVOICE_TYPE": "invoice",
      "DELIVERY_DATE": [{
        "DELIVERY_START_DATE": new Date(invoice.is_valid_from).toISOString(),
        "DELIVERY_END_DATE": new Date(invoice.is_valid_from).toISOString(),
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
            "bmecat:NAME": invoice.companyProfile[0].name ? invoice.companyProfile[0].name : undefined,
            "bmecat:STREET": invoice.companyProfile[0].address ? invoice.companyProfile[0].address : undefined,
            "bmecat:ZIP": invoice.companyProfile[0].postcode ? invoice.companyProfile[0].postcode : undefined,
            "bmecat:CITY": invoice.companyProfile[0].city ? invoice.companyProfile[0].city : undefined,
            "bmecat:COUNTRY_CODED": coutryList.filter(coutry => coutry.name == invoice.companyProfile[0].country_name)[0].iso_3166_alpha2,

          }]

        }, {
          "bmecat:PARTY_ID": [{
            "_": billerDetails['recipientid'] || "0000000000000000",
            "$": {
              "type": "party_specific"
            }
          }],
          "PARTY_ROLE": "invoice_recipient",
          "ADDRESS": [{
            "bmecat:NAME": invoice.contact.name_1,
            "bmecat:NAME2": invoice.contact.name_2 ? invoice.contact.name_2 : undefined,

            "bmecat:STREET": invoice.contact.street_name ? `${invoice.contact.street_name} ${invoice.contact.house_number ?? ''}`.trim() : undefined,
            "bmecat:ZIP": invoice.contact.postcode ? invoice.contact.postcode : undefined, //NOT IN BEXIO CONTACTS - REMOVED 
            "bmecat:CITY": invoice.contact.city ? invoice.contact.city : undefined,
            "bmecat:COUNTRY_CODED": invoice.contact.country_id ? coutryList.filter(coutry => coutry.id == invoice.contact.country_id)[0].iso_3166_alpha2 : undefined
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
        "_": billerDetails['recipientid'] || "0000000000000000",
        "$": {
          "type": "party_specific"
        }
      }],
      "bmecat:CURRENCY": invoice.currency['name'],
      "MIME_INFO": [{
        "MIME": [{
          "MIME_EMBEDDED": {
            "MIME_DATA": [{
              "_": pdf,

            }],
            "FILE_NAME": fileName ? fileName : 'temp'
          }
        }]
      }],
      "REMARKS": invoice.title ? invoice.title : undefined,
      "HEADER_UDX": JSON.parse(JSON.stringify([{
        ...(billerDetails['allow'] == 'bill_recipient_id'
          ? { "EBILL.BILL_RECIPIENT_ID": billerDetails['recipientid'] }
          : { "EBILL.BILL_RECIPIENT_EMAIL": billerDetails['contact_email'] }),
        "EBILL.QR_IBAN": billDetails['iban'],
        "EBILL.IBAN_REFERENCE_NUMBER": billDetails['ref'],
        "EBILL.QR_TYPE": billDetails['type'],
        "EBILL.DUE_DATE": invoice?.is_valid_to ? invoice.is_valid_to : '',
        "HEADER_UDX_OPT": [{
          "BEX_VERSION": "VER1",
          "BEX_INVOICE_EBIIL_DOCUMENT_ID": invoiceLogUid ? invoiceLogUid : undefined
        }]
      }]))
    })))

  let allTax: any = []

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

  invoice.taxs.length != 0 ?
    invoice.taxs.forEach(element => {
      JSON.parse(JSON.stringify(obj.OPENTRANS['INVOICE'][0]['INVOICE_SUMMARY'][0]['TOTAL_TAX']["TAX_DETAILS_FIX"].push(
        {
          "bmecat:TAX": element.percentage,
          "TAX_AMOUNT": element.value
        }
      )))
    })
    : obj.OPENTRANS['INVOICE'][0]['INVOICE_SUMMARY'][0]['TOTAL_TAX']["TAX_DETAILS_FIX"] = '';

  for (let index = 0; index < invoice.positions.length; index++) {
    let element = invoice.positions[index];
    console.log('element-------', element);
    let arr, status = true;
    ////console.log('987');
    obj.OPENTRANS.INVOICE[0]['INVOICE_ITEM_LIST'][0]['INVOICE_ITEM'].push(JSON.parse(JSON.stringify({
      "$": {
        "type": "order_item"
      },
      "LINE_ITEM_ID": element.pos ? element.pos : index,
      "PRODUCT_ID": [{
        "bmecat:SUPPLIER_PID": element?.article?.intern_code ? element.article.intern_code : undefined,
        "bmecat:DESCRIPTION_SHORT": element?.article?.intern_name ? decode(element.article.intern_name).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').substring(0, 145) : undefined,
        "bmecat:DESCRIPTION_LONG": element?.text ? decode(element.text).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '') : (element?.article?.intern_description ? decode(element.article.intern_description).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '') : undefined)
      }],
      "QUANTITY": element?.amount ? Math.trunc(element.amount) : 1,
      "bmecat:ORDER_UNIT": orderUnit[element.unit_name] ? orderUnit[element.unit_name] : 'C62',
      "PRODUCT_PRICE_FIX": [JSON.parse(JSON.stringify({
        "bmecat:PRICE_AMOUNT": element?.unit_price == null ? 0.00 : parseFloat(element.unit_price).toFixed(2),
        "TAX_DETAILS_FIX": element?.tax?.value && taxIsAdded > 0 ? [{
          ...(element?.tax?.code ? { "bmecat:TAX_CATEGORY": element.tax.code } : {}),
          "bmecat:TAX_TYPE": element?.tax?.type,
          "bmecat:TAX": element?.tax?.value

        }] : undefined,


        "bmecat:PRICE_QUANTITY": priceQuantity,
      })),
      ],
      "PRICE_LINE_AMOUNT": element?.position_total ? parseFloat(element.position_total).toFixed(2) : 0.00,
      "DELIVERY_REFERENCE": [{
        "DELIVERY_DATE": [{
          "DELIVERY_START_DATE": new Date(invoice.updated_at).toISOString(),
          "DELIVERY_END_DATE": new Date(invoice.updated_at).toISOString()
        }]
      }]
    })))

    element.discount_in_percent == null ? delete obj.OPENTRANS.INVOICE[0]['INVOICE_ITEM_LIST'][0]['INVOICE_ITEM'][obj.OPENTRANS.INVOICE[0]['INVOICE_ITEM_LIST'][0]['INVOICE_ITEM'].length - 1]['PRODUCT_PRICE_FIX'][0]['ALLOW_OR_CHARGES_FIX'] : '';
  }

  let builder = new xml2js.Builder({ 'xmldec.version': 1.0 });
  var xml = builder.buildObject(obj);
  ////console.log(xml);

  return Buffer.from(xml).toString('base64');

}
export const markAsSent = async (access_token, id) => {

  return new Promise(async (resolve, reject) => {
    var options = {
      'method': 'POST',
      'url': `https://api.bexio.com/2.0/kb_invoice/${id}/mark_as_sent`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + access_token
      }
    };
    request(options, function (error, response) {
      try {

        if (error) {
          commonErrors['errorTitle'] = 'markAsSent';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,';
          warningMessage(commonErrors, error);
          return resolve(false)
        }
        if (response.statusCode == 200)
          return resolve(JSON.parse(response.body)[0]);
        else
          return resolve(false)
      } catch (err) {
        reject(err)
      }
    });
  });
}
export const addBexioCommentBulk = async (token, id, status, message?, netcomId?) => {
  let parms = {
    token: token,
    id: id,
    status: status,
    message: message,
    netcomId: netcomId
  }

  return new Promise(async (resolve, reject) => {
    try {
      let commentsData = JSON.parse(config.BEXIO_COMMENTS);
      let comments = commentsData[status].replace('[message]', '{ ' + message + ' }')
      let invoiceData = await getInvoiceOT(token, id);

      if (!invoiceData) {
        commonErrors['errorTitle'] = 'addBexioComment';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + 'addBexioComment ' + '-bexio param,' + JSON.stringify(parms);
        warningMessage(commonErrors, 'error');
        resolve(false)
        return
      }
      let userData = await getUser(token, invoiceData['user_id']);

      if (!userData) {
        userData = await getDefaultUser(token);
      }

      if (!userData) {
        commonErrors['errorTitle'] = 'addBexioComment';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + 'addBexioComment ' + '-bexio param,' + JSON.stringify(parms);
        warningMessage(commonErrors, 'error');
        resolve(false)
        return
      }
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
      request(options, function (error, response) {
        if (error) {
          commonErrors['errorTitle'] = 'addBexioComment';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + JSON.stringify(parms);
          warningMessage(commonErrors, error);
          return resolve(false)
        }

        if (response.statusCode == 201) {
          resolve(JSON.parse(response.body));
          return;
        }
        else {
          commonErrors['errorTitle'] = 'addBexioComment';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + (response ? response.body.toString() : '') + '-bexio param,' + JSON.stringify(parms);
          warningMessage(commonErrors, error);
          resolve(false)
          return;
        }
        // resolve(false)
      })
    } catch (error) {

      commonErrors['errorTitle'] = 'addBexioComment';
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + JSON.stringify(parms);
      warningMessage(commonErrors, error);
      resolve(false);
      return;

    }
  })

}
export const getUser = async (access_token, id) => {
  return new Promise(async (resolve, reject) => {
    var options = {
      'method': 'GET',
      'url': `https://api.bexio.com/3.0/users/${id}`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + access_token
      }
    };
    request(options, function (error, response) {
      if (error) {
        commonErrors['errorTitle'] = 'getUser';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + id;
        warningMessage(commonErrors, error);
        return resolve(false)
      }
      if (response.statusCode == 200)
        return resolve(JSON.parse(response.body));
      else
        return resolve(false)
    });
  });
}
export const getDefaultUser = async (access_token) => {
  return new Promise(async (resolve, reject) => {
    var options = {
      'method': 'GET',
      'url': `https://api.bexio.com/3.0/users?order_by=lastname`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + access_token
      }
    };
    request(options, function (error, response) {
      if (error) {
        commonErrors['errorTitle'] = 'getDefaultUser';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,';
        warningMessage(commonErrors, error);
        return resolve(false)
      }
      if (response.statusCode == 200)
        return resolve(JSON.parse(response.body)[0]);
      else
        return resolve(false)
    });
  });
}
export const getRefrenceNumber = async (pdf, invoiceNumber, billerDetails?) => {
  try {

    let data = {
      billerDetails: billerDetails ? billerDetails : '',
      invoiceNumber: invoiceNumber
    }
    const buf = Buffer.from(pdf, 'base64');


    return new Promise(async (resolve, reject) => {
      const options = {
        method: 'POST',
        url: config.QRREADERURL + 'bill',
        headers: {
          'Content-Type': 'application/pdf'
        },
        body: buf
      };
      request(options, function (error, response) {


        if (response.body.length < 3) {

          var s = new Date(new Date());
          let v = s.getFullYear() * 10000000000 + (s.getMonth() + 1) * 100000000 + s.getDate() * 1000000 + s.getHours() * 10000 + s.getMinutes() * 100 + s.getSeconds();
          let res = {
            iban: undefined,
            type: undefined,
            ref: undefined,
            referenceEbil: invoiceNumber + '_' + v

          }

          commonErrors['errorTitle'] = 'QR_code_not_found';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + 'QR_code_not_found ' + '-req param,' + JSON.stringify(data);
          warningMessage(commonErrors, 'QR_code_not_found');
          return resolve(res);
        }

        let paymentDetails = response.body.split("\\n");

        let typeIndex = paymentDetails.indexOf('QRR') != -1 ? paymentDetails.indexOf('QRR') : paymentDetails.indexOf('SCOR');
        if (typeIndex == -1) {
          typeIndex = paymentDetails.indexOf('NON') != -1 ? paymentDetails.indexOf('NON') : -1;
        }
        var s = new Date(new Date());
        let v = s.getFullYear() * 10000000000 + (s.getMonth() + 1) * 100000000 + s.getDate() * 1000000 + s.getHours() * 10000 + s.getMinutes() * 100 + s.getSeconds();


        let res = {
          iban: paymentDetails[3],
          type: paymentDetails[typeIndex],
          ref: paymentDetails[typeIndex + 1] ? paymentDetails[typeIndex + 1] : undefined,
          referenceEbil: invoiceNumber + '_' + v

        }
        console.log('res1', res)
        if (typeIndex == -1) {

          commonErrors['errorTitle'] = 'QR_code_not_found';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + 'QR_code_not_found ' + '-req param,' + JSON.stringify(data);
          warningMessage(commonErrors, 'QR_code_not_found');
          res = {
            iban: undefined,
            type: undefined,
            ref: undefined,
            referenceEbil: invoiceNumber + '_' + v

          }
          return resolve(res);
        }
        console.log('res', res)
        return resolve(res);


      });
    });

  } catch (error) {
    JSON.stringify(error)
    commonErrors['errorTitle'] = 'getRefrenceNumber';
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + 'get_refrence_number ' + '-req param,' + invoiceNumber;
    warningMessage(commonErrors, 'get_refrence_number');
    return resolve('');
  }
}
export const getTaxListActive = async (access_token) => {

  return new Promise(async (resolve, reject) => {
    var options = {
      'method': 'GET',
      'url': `https://api.bexio.com/3.0/taxes?scope=active`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + access_token
      }
    };
    request(options, function (error, response) {
      if (error) {
        commonErrors['errorTitle'] = 'taxes';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + access_token;
        warningMessage(commonErrors, error);
        return resolve(false)
      }
      if (response.statusCode == 200)
        return resolve(JSON.parse(response.body));
      else
        return resolve(false)

    });
  });
}
export const getContactDetails = async (access_token, id) => {

  try {
    return new Promise(async (resolve, reject) => {
      var options = {
        'method': 'GET',
        'url': `https://api.bexio.com/2.0/contact/${id}`,
        'headers': {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + access_token
        }
      };
      request(options, function (error, response) {
        if (error) {
          commonErrors['errorTitle'] = 'getContactDetails';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + id;
          warningMessage(commonErrors, error);
          return resolve(false)
        }

        if (response.statusCode == 200) {

          return resolve(JSON.parse(response.body));
        }
        else if (response.statusCode == 401) {
          return resolve(JSON.parse(response.body));

        }
        else {
          return resolve(false)
        }

      });
    });
  } catch (error) {
    commonErrors['errorTitle'] = getContactDetails.name;
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + access_token + id;
    warningMessage(commonErrors, error);

    return resolve('');
  }
}
export const setOrderId = async (id, billId) => {

  try {
    const getcustomerIdResult = await connectBexio.documents_order_receive.updateMany({
      where: {
        cid: Number(id),
      },
      data: {
        rk_order: billId,
        status: '2',
      },
    });
    return getcustomerIdResult
  } catch (error) {
    commonErrors['errorTitle'] = 'setOrderId';
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + billId;
    warningMessage(commonErrors, error);
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
export const moveFile = async (netcomId, fileName) => {
  let formData;
  try {
    formData = {
      netcom_id: netcomId,
      filename: fileName
    }

    return new Promise(async (resolve, reject) => {
      var options = {
        'method': 'POST',
        'url': config.GATE2BURL + 'move-file',
        //  'url':'http://192.168.2.63:5005/api/post-list/invitations',
        formData: formData
      };

      request(options, function (error, response) {
        if (error) {
          commonErrors['errorTitle'] = 'moveFile';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + formData;
          warningMessage(commonErrors, error);
          return resolve(false)
        }

        return resolve(response.body);

      });
    });
  } catch (error) {
    commonErrors['errorTitle'] = 'moveFile';
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + netcomId + fileName;
    warningMessage(commonErrors, error);
    return resolve('');
  }
}
export const setDeliveryNotesCidSendStatus = async (partyId, delivery_id, ordernumber, status, error?) => {
  let sendDeliveryNotesId;
  return new Promise(async function (resolve, reject) {
    try {
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

      if (selectQryResult.length == 0) {
        const selectQryResultParty = await connectBexio.companyregistered.findMany({
          where: {
            rk_party: Number(partyId),
          },
        });

        const result = await connectBexio.documents_dispatchnotification_send.create({
          data: {
            rk_deliverynotes: delivery_id,
            deliverynotes_number: ordernumber,
            fk_companyregistered: selectQryResultParty[0].cid,
            deliverynotes_type: 'EDI',
            status: Number(status), // assuming this is the correct type
          },
          select: {
            cid: true,
          },
        });
        sendDeliveryNotesId = result[0].cid;
      }
      else {
        sendDeliveryNotesId = selectQryResult[0].cid;
        await connectBexio.documents_dispatchnotification_send.updateMany({
          where: {
            fk_companyregistered: selectQryResult[0]?.companyregistered?.cid,
            rk_deliverynotes: delivery_id,
            deliverynotes_type: 'EDI',
          },
          data: {
            time_stamp: new Date(), // equivalent to NOW()
            status: Number(status),        // make sure it's a string
          },
        });
      }
      return resolve(sendDeliveryNotesId);
    } catch (error) {
      commonErrors['errorTitle'] = setInvoiceSendStatus.name;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + partyId + '-partyId' + delivery_id + '-deliveryId' + ordernumber + 'orderNumber';
      warningMessage(commonErrors, error);
      return resolve('');
    }
  });

}

export const setPurchaseOrderBulk = async (purchaseOrder, bodyValues, headerParams) => {

  // bodyValues = JSON.parse(bodyValues);
  let tempIds = JSON.parse(purchaseOrder);

  for (let index = 0; index < tempIds.length; index++) {
    const element = tempIds[index];
    const tempParam = {
      cookies: headerParams['cookies'], // Include cookies
      signedCookies: headerParams['signedCookies'], // Include signed cookies
      url: headerParams['url'],
      originalUrl: headerParams['originalUrl'],
      body: {
        partyId: bodyValues.partyId,
        accountId: bodyValues.accountId,
        order_id: element.orderId,
      },
    };

    const result = await pushPurchaseOrderBulk(tempParam, "");
  }

};
export const pushPurchaseOrderBulk = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    let cookie
    let decryptData;
    let purchaseorderCid;
    decryptData = req.body;

    try {
      let purchaseOrder, paymentType;
      cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
      let accessToken = cookie.access_Token;
      const partyId = decryptData.partyId;
      const accountId = decryptData.accountId;
      const purchaseOrderId = decryptData.order_id || 1;
      purchaseOrder = await getOrderOT(accessToken, purchaseOrderId); // Get order from bexio using orderId
      if (!purchaseOrder) { // If there is no purchaseOrder with this orderId, return with error
        purchaseorderCid = await setOrderSendStatus(partyId, purchaseOrderId, '', '0', 'error_in_order_OT');
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'error_in_order_OT -req param,', JSON.stringify(req.body);
        commonErrors['messagetype'] = "469";
        warningMessage(commonErrors, 'error_in_order_OT');

        return resolve('error_in_order_OT');
      }
      console.log("getConnectionDetails", purchaseOrder.contact_id, req);

      let invitationData: any = await getConnectionDetails(partyId, accountId, purchaseOrder.contact_id, req); // Get the connection details using contact_id, party and account
      console.log("invitationData: ", invitationData);
      let customerIds = await constGetContactId(invitationData[0].rk_businessconnection); // Get customer Id using businessConnection
      if (invitationData != undefined) { // If there is any invitationData then do
        let pdf, fileName, pdfContent;

        /* Fetch country data from bexio using accessToken */
        let countryList;
        countryList = await getCountryLists(accessToken);

        if (!countryList) { // If country list not found, return with error.
          purchaseorderCid = await setOrderSendStatus(partyId, purchaseOrderId, purchaseOrder['document_nr'], '0', 'country_list_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'country_list_not_found -req param,', JSON.stringify(req.body);
          warningMessage(commonErrors, 'country_list_not_found');
          return resolve('country_list_not_found');
        }



        /* Fetch currency from bexio using id. */
        let currency = await getCurrency(accessToken, purchaseOrder.currency_id);
        if (!currency) {
          purchaseorderCid = await setOrderSendStatus(partyId, purchaseOrderId, purchaseOrder['document_nr'], '0', 'currency_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'currency_not_found -req param,', JSON.stringify(req.body);
          warningMessage(commonErrors, 'currency_not_found');

          return resolve('currency_not_found');
        }
        purchaseOrder['currency'] = currency;

        /* Get user details from access token */
        let temp = await getloginUserCompanyDetails(accessToken);
        if (!temp) {
          purchaseorderCid = await setOrderSendStatus(partyId, purchaseOrderId, purchaseOrder['document_nr'], '0', 'company_details_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'company_details_not_found -req param,', JSON.stringify(req.body);
          warningMessage(commonErrors, 'company_details_not_found');

          return resolve('company_details_not_found');
        }
        purchaseOrder['companyProfile'] = temp;
        purchaseOrder['companyProfile'] = JSON.parse(purchaseOrder['companyProfile']);
        /* Fetch payment type from purchaseOrder */
        paymentType = await getPaymentType(accessToken, purchaseOrder.payment_type_id);
        if (!paymentType) {
          purchaseorderCid = await setOrderSendStatus(partyId, purchaseOrderId, purchaseOrder['document_nr'], '0', 'payment_type_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'payment_type_not_found -req param,', JSON.stringify(req.body);
          warningMessage(commonErrors, 'payment_type_not_found');

          return resolve('payment_type_not_found');
        }

        let tempPaymentType = paymentType.filter(e => e.id == purchaseOrder.payment_type_id);
        purchaseOrder['paymentType'] = tempPaymentType;

        /* Fetch contact using contact id from purchaseOrder */
        let contact = await getContact(accessToken, purchaseOrder.contact_id);
        if (!contact) {
          purchaseorderCid = await setOrderSendStatus(partyId, purchaseOrderId, purchaseOrder['document_nr'], '0', 'contact_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'contact_not_found -req param,', JSON.stringify(req.body);
          warningMessage(commonErrors, 'contact_not_found');

          return resolve('contact_not_found');
        }
        purchaseOrder['contact'] = contact;
        let user = true;
        if (!user) {
          purchaseorderCid = await setOrderSendStatus(partyId, purchaseOrderId, purchaseOrder['document_nr'], '0', 'user_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'user_not_found -req param,', JSON.stringify(req.body);
          warningMessage(commonErrors, 'user_not_found');

          return resolve('user_not_found');
        }
        purchaseOrder['user'] = user;

        /* Loop over positions in purchaseOrder */
        let taxIsAdded = false;
        for (const items of purchaseOrder.positions.required) {
          ////console.log('items.tax_id',items.tax_id);
          if (items.tax_id) { // Check tax is there or not
            /* Fetch tax using tax id */
            let tempTax = await getTaxs(accessToken, items.tax_id);
            taxIsAdded = true;
            if (!tempTax) {
              purchaseorderCid = await setOrderSendStatus(partyId, purchaseOrderId, purchaseOrder['document_nr'], '0', 'tax_not_Found');

              // addlogs(logs,decryptData.partyId,decryptData.accountId);
              commonErrors['errorTitle'] = req.originalUrl;
              commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'tax_not_Found -req param,', JSON.stringify(req.body);
              warningMessage(commonErrors, 'tax_not_Found');
              return resolve('tax_not_Found');
            }
            items['tax'] = tempTax;
          }
          let tempItem;
          if ('article_id' in items) {
            tempItem = await getProducts(accessToken, items.article_id);
            if (tempItem) {
              items['article'] = tempItem;
            }
          } else {
            items['article'] = {}
            items['article']['article_id'] = items.id;
            items['article']['amount'] = items.amount;
            items['article']['intern_name'] = items.text;
            items['article']['intern_description'] = items.text;

          }
        }
        purchaseorderCid = await setOrderSendStatus(partyId, purchaseOrderId, purchaseOrder['document_nr'], '1');

        /* Create XML from data */
        let xml;
        xml = await setOrderToOt(purchaseOrder, countryList, invitationData[0], pdfContent, fileName, customerIds, purchaseorderCid, taxIsAdded);
        if (xml == false) {
          purchaseorderCid = await setOrderSendStatus(partyId, purchaseOrderId, purchaseOrder['document_nr'], '0', 'xml_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'xml_not_found-req param,', JSON.stringify(req.body);
          warningMessage(commonErrors, 'xml_not_found');

          return resolve('xml_not_found');
        }
        const sendOrderRes = await invoiceFilePush(invitationData[0].rk_netcomidsender, 'WS', xml, purchaseOrder['document_nr'], 'EDI');

        let redisKey = req.body.partyId + "_/";
        await deleteRedis('sendOrder', redisKey);
        console.log("sendOrderRes", sendOrderRes);

        return resolve(true);
      }
      else {

        // addlogs(logs,decryptData.partyId,decryptData.accountId);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'ORDER_FOR_OPEN_TRANSACTION -req param,', JSON.stringify(req.body);
        warningMessage(commonErrors, 'ORDER_FOR_OPEN_TRANSACTION');
        return resolve('purchase_order_push_error')
      }
    } catch (error) {
      console.error('Error in pushPurchaseOrderBulk:', error);
      reject(error); // Ensure the promise is rejected.
    }
  });
}
export const setOrderSendStatus = async (partyId, orderId, ordernumber, status, error?) => {
  let sendOrderId;
  return new Promise(async function (resolve, reject) {
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

      if (selectQryResult.length == 0) {
        const selectQryResultParty = await connectBexio.companyregistered.findMany({
          where: {
            rk_party: Number(partyId),
          },
        });

        const result = await connectBexio.documents_order_send.create({
          data: {
            rk_order: orderId,
            order_number: ordernumber,
            fk_companyregistered: selectQryResultParty[0]?.cid, // Make sure this exists
            order_type: 'EDI',
            status: Number(status),
          },
          select: {
            cid: true, // This is the equivalent of RETURNING cid
          },
        });
        ////console.log(result);
        sendOrderId = result[0].cid;
      }
      else {
        sendOrderId = selectQryResult[0]?.cid;


        await connectBexio.documents_order_send.updateMany({
          where: {
            fk_companyregistered: selectQryResult[0]?.companyregistered?.cid,
            rk_order: orderId,
            order_type: 'EDI',
          },
          data: {
            time_stamp: new Date(), // equivalent to NOW()
            status: Number(status),        // make sure it's a string
          },
        });

      }

      return resolve(sendOrderId);
    } catch (error) {
      commonErrors['errorTitle'] = ' setInvoiceSendStatus';
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + partyId + '-partyId' + orderId + '-orderId' + ordernumber + 'orderNumber';
      warningMessage(commonErrors, error);
      return resolve('');
    }
  });

}

const setOrderToOt = async (order, coutryList, contactDetails, pdf, fileName, customerIds, orderId, taxIsAdded) => {

  let tempString = JSON.stringify(order.delivery_address_manual)
  let tempArray;

  if (tempString.indexOf("\\r\\n") != -1) {
    tempArray = tempString.substring(1, tempString.length - 1).replace(/\\r\\n/g, "___________");
  }
  else if (tempString.indexOf("\\n") != -1) {
    tempArray = tempString.substring(1, tempString.length - 1).replace(/\\n/g, "___________");
  }
  else if (tempString.indexOf("\\r") != -1) {
    tempArray = tempString.substring(1, tempString.length - 1).replace(/\\r/g, "___________");
  }
  else {
    tempArray = tempString;
  }

  let deliveryAddress2 = tempArray.split("___________");

  let tempAdress = deliveryAddress2.filter((e) => e.length != 0);
  if (tempAdress.length == 4) {
    tempAdress.splice(1, 0, " ")
  }

  let countryCode = tempAdress[5] ? coutryList.filter(coutry => coutry.name == tempAdress[5].replace(/\n/g, "").replace(/\r/g, "").trim())[0]?.iso_3166_alpha2 : ''

  coutryList = JSON.parse(coutryList);
  let emptyValue = 'NA'
  let priceQuantity = '1'



  let orderUnit = {
    'Stk': 'C62',
    'h': 'HUR'
  }
  let obj: any = {
    "OPENTRANS": {
      "$": {
        "xmlns:iomarket": "http://tempuri.org/io-market/openTRANS_UDX",
        "xmlns:bmecat": "http://www.bmecat.org/bmecat/2005",
        "xmlns": "http://www.opentrans.org/XMLSchema/2.1"
      },
      "ORDER": [{
        "$": {
          "version": "2.1",
          "type": "release"
        },
        "ORDER_HEADER": [{
          "CONTROL_INFO": [],
          "ORDER_INFO": []
        }],
        "ORDER_ITEM_LIST": [{
          "ORDER_ITEM": []
        }],
        "ORDER_SUMMARY": []

      }]
    }
  };

  let v = coutryList.filter(coutry => coutry.id == order.contact.country_id)

  ////console.log("\ntaxIsAdded:: "+taxIsAdded);

  ////console.log('contactDetailscontactDetailscontactDetails',contactDetails);

  obj.OPENTRANS.ORDER[0]['ORDER_HEADER'][0]['ORDER_INFO'].push(JSON.parse(
    JSON.stringify({
      "ORDER_ID": order.document_nr,
      "ORDER_DATE": new Date(order.updated_at).toISOString(),
      "DELIVERY_DATE": [{
        "DELIVERY_START_DATE": new Date(order.updated_at).toISOString(),
        "DELIVERY_END_DATE": new Date(order.updated_at).toISOString()
      }],
      "bmecat:LANGUAGE": 'deu',
      "PARTIES": [{
        "PARTY": [{
          "bmecat:PARTY_ID": [{
            "_": contactDetails.rk_netcomidsender,
            "$": {
              "type": "supplier_specific"
            }
          }],
          "PARTY_ROLE": "buyer",
          "ADDRESS": [{
            "bmecat:NAME": order.companyProfile[0].name ? order.companyProfile[0].name : undefined,
            "bmecat:STREET": order.companyProfile[0].address ? order.companyProfile[0].address : undefined,
            "bmecat:ZIP": order.companyProfile[0].postcode ? order.companyProfile[0].postcode : undefined,
            "bmecat:CITY": order.companyProfile[0].city ? order.companyProfile[0].city : undefined,
            "bmecat:COUNTRY_CODED": coutryList.filter(coutry => coutry.name == order.companyProfile[0].country_name)[0].iso_3166_alpha2
          }]
        }, {
          "bmecat:PARTY_ID": [{
            "_": contactDetails.rk_netcomidreceived,
            "$": {
              "type": "buyer_specific"
            }
          }],
          "PARTY_ROLE": "supplier",
          "ADDRESS": [{
            "bmecat:NAME": order.contact.name_1,
            "bmecat:NAME2": order.contact.name_2 ? order.contact.name_2 : undefined,

            // "CONTACT_DETAILS": [{
            //     "bmecat:CONTACT_NAME": invoice.contact.name_1,
            //     "bmecat:FIRST_NAME": invoice.contact.name_1,
            //     "bmecat:EMAILS": [{
            //         "bmecat:EMAIL": invitionData.receiveremail
            //     }]
            // }],
            "bmecat:STREET": order.contact.street_name ? `${order.contact.street_name} ${order.contact.house_number ?? ''}`.trim() : undefined,
            "bmecat:ZIP": order.contact.postcode ? order.contact.postcode : undefined, //NOT IN BEXIO CONTACTS - REMOVED 
            "bmecat:CITY": order.contact.city ? order.contact.city : undefined,
            // "bmecat:COUNTRY": invoice.contact.country_id?coutryList.filter(coutry => coutry.id == invoice.contact.country_id)[0].name:undefined,
            "bmecat:COUNTRY_CODED": order.contact.country_id ? coutryList.filter(coutry => coutry.id == order.contact.country_id)[0].iso_3166_alpha2 : undefined
          }]
        }, {
          "bmecat:PARTY_ID": [{
            "_": contactDetails.rk_netcomidsender,
            "$": {
              "type": "buyer_specific"
            }
          }],
          "PARTY_ROLE": "final_delivery",
          "ADDRESS": [{
            "bmecat:NAME": tempAdress[0]?.trim() ? tempAdress[0]?.replace(/\n/g, "")?.replace(/\r/g, "").trim() : undefined,
            "bmecat:NAME2": tempAdress[1]?.trim() ? tempAdress[1]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined,
            "bmecat:STREET": tempAdress[2]?.trim() ? tempAdress[2]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined,
            "bmecat:ZIP": tempAdress[3]?.trim() ? tempAdress[3]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined,
            "bmecat:CITY": tempAdress[4]?.trim() ? tempAdress[4]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined,
            "bmecat:COUNTRY_CODED": countryCode ? countryCode : undefined
          }]
        }]
      }],
      "ORDER_PARTIES_REFERENCE": [{
        "bmecat:BUYER_IDREF": contactDetails.sendercustomerid,
        "bmecat:SUPPLIER_IDREF": contactDetails.receiver_customerid
      }],
      "bmecat:CURRENCY": order.currency['name'],
      "REMARKS": order.title ? order.title : undefined,
      "HEADER_UDX": customerIds.length != 0 || orderId ? [{
        "HEADER_UDX_OPT": [{
          "BEX_VERSION": "VER1",
          "BEX_ORDER_DOCUMENT_ID": orderId ? orderId : undefined
        }],
        "SENDER_CUSTOM_ID_1": customerIds[0]?.senderid ? customerIds[0].senderid : undefined,
        "RECEIVER_CUSTOM_ID_1": customerIds[0]?.receiverid ? customerIds[0].receiverid : undefined
      }] : undefined
    })
  ));
  //////console.log(JSON.stringify(obj.OPENTRANS));
  ////console.log("-----------------------------------------------------------");
  let allTax: any = [];
  order.positions.required.forEach(element => {
    const index = allTax.findIndex(object => object.type === element.tax?.type);
    if (index === -1) {
      allTax.push({
        type: element.tax?.type,
        value: element.tax?.value,
      });
    }
  })
  let tempTaxArray = [];
  let totalAmount: any = '0.00';

  ////console.log("order.positions",order.positions.required)
  for (let index = 0; index < order.positions.required.length; index++) {
    let element = order.positions.required[index];
    delete element.internal_pos
    ////console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    ////console.log(JSON.stringify(element));    
    ////console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    ////console.log("....... :: "+element.tax?.value);

    totalAmount = parseFloat(totalAmount) + parseFloat(element.position_total);
    let arr, status = true;
    ////console.log('element.articleelement.article',element);

    obj.OPENTRANS.ORDER[0]['ORDER_ITEM_LIST'][0]['ORDER_ITEM'].push(JSON.parse(JSON.stringify({
      "LINE_ITEM_ID": element.pos ? element.pos : index,
      "PRODUCT_ID": [{
        "bmecat:SUPPLIER_PID": element?.article?.article_id ? element.article.article_id : element.article.id,
        ...(element?.article?.id
          ? {
            "bmecat:INTERNATIONAL_PID": {
              "_": element?.article?.id,
              "$": {
                "type": "ean"
              }
            }
          }
          : {}),
        "bmecat:DESCRIPTION_SHORT": element?.article?.intern_name ? decode(element.article.intern_name).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').substring(0, 145) : undefined, // product id mandatory field so just added intername as description short
        "bmecat:DESCRIPTION_LONG": element?.text ? decode(element.text).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '') : (element?.article?.intern_description ? decode(element.article.intern_description).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '') : undefined)
      }],
      "QUANTITY": element?.article?.amount ? element.article.amount : element.amount,
      "bmecat:ORDER_UNIT": orderUnit[element.unit_name] ? orderUnit[element.unit_name] : 'CT',
      "PRODUCT_PRICE_FIX": [JSON.parse(JSON.stringify({
        "bmecat:PRICE_AMOUNT": element?.unit_price == null ? 0.00 : parseFloat(element.unit_price).toFixed(2),
        "TAX_DETAILS_FIX": element?.tax?.value && taxIsAdded ? [{
          "bmecat:TAX": element?.tax?.value
          // "TAX_AMOUNT": element.tax_value
        }] : undefined,
      }))],
      "PRICE_LINE_AMOUNT": element?.position_total ? parseFloat(element.position_total).toFixed(2) : 0.00
    })))
  }
  obj.OPENTRANS['ORDER'][0]['ORDER_SUMMARY'].push(JSON.parse(JSON.stringify({
    "TOTAL_ITEM_NUM": order.positions.required.length,
    "TOTAL_AMOUNT": parseFloat(order.positions.total).toFixed(2)
  })))
  // return

  let builder = new xml2js.Builder({ 'xmldec.version': 1.0 });
  ////console.log("JSON.stringify(obj):: ",JSON.stringify(obj))
  var xml = builder.buildObject(obj);
  ////console.log("xml:  ---------------------------\n",xml);
  return Buffer.from(xml).toString('base64');
}
export const getOrderOT = async (accessToken, orderId) => {
  try {
    return new Promise(async (resolve, reject) => {
      var options = {
        'method': 'GET',
        'url': `https://api.bexio.com/3.0/purchase_orders/${orderId}`,
        'headers': {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      };
      //////console.log('optionsoptions',options);


      request(options, function (error, response) {
        if (error) {
          ////console.log('errorerrorerror',error);
          commonErrors['errorTitle'] = 'getOrderOT';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + orderId;
          warningMessage(commonErrors, error);
          return resolve(error);
        }
        //////console.log('responseresponse',response);

        if (response.statusCode == 200) {
          return resolve(JSON.parse(response.body));
        }
        else {
          return resolve(false);
        }
      })
    });
  } catch (error) {
    commonErrors['errorTitle'] = 'getOrderOT';
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + orderId;
    warningMessage(commonErrors, error);
    return;
  }
}
export const setDeliveryNotesBulk = async (deliveryNotes, bodyValues, headerParams) => {
  //console.log("worker processing invoices...");
  //console.log('deliveryNotes',deliveryNotes);
  //console.log('bodyValues',bodyValues);

  let tempIds = JSON.parse(deliveryNotes);

  for (let index = 0; index < tempIds.length; index++) {
    const element = tempIds[index];
    const tempParam = {
      cookies: headerParams['cookies'], // Include cookies
      signedCookies: headerParams['signedCookies'], // Include signed cookies
      url: headerParams['url'],
      originalUrl: headerParams['originalUrl'],
      body: {
        partyId: bodyValues.partyId,
        accountId: bodyValues.accountId,
        delivery_id: element.delivery_id,
      },
    };

    //console.log("start processing delivery notes");
    const result = await pushDeliveryNotesBulk(tempParam, "");
    console.log("result:", result);

    //console.log("end processing delivery notes");
  }
};
export const pushDeliveryNotesBulk = async (req, res) => {
  return new Promise(async (resolve, reject) => {
    let cookie;
    let decryptData;
    let deliveryNotesCid;
    decryptData = req.body;

    try {
      let deliveryNotes, paymentType;
      cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
      let accessToken = cookie.access_Token;
      const partyId = decryptData.partyId;
      const accountId = decryptData.accountId;
      const delivery_id = decryptData.delivery_id || 1;
      deliveryNotes = await getDeliveryNotesOT(accessToken, delivery_id); // Get deliveryNotes from bexio using orderId

      if (!deliveryNotes) { // If there is no deliveryNotes with this orderId, return with error
        deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId, delivery_id, '', '0', 'error_in_deliveryNotes_OT');
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'error_in_deliveryNotes_OT -req param,', JSON.stringify(req.body);
        commonErrors['messagetype'] = "471";
        warningMessage(commonErrors, 'error_in_deliveryNotes_OT');
        return resolve('error_in_deliveryNotes_OT');
      }
      let invitationData: any = await getConnectionDetails(partyId, accountId, deliveryNotes.contact_id, req); // Get the connection details using contact_id, party and account
      let customerIds
      if (invitationData.length > 0)
        customerIds = await constGetContactId(invitationData[0].rk_businessconnection); // Get customer Id using businessConnection
      else
        if (!customerIds) { // If there is no customerIds, return with error
          deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId, delivery_id, deliveryNotes['document_nr'], '0', 'customerIds_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'customerIds_not_found -req param,', JSON.stringify(req.body);
          commonErrors['messagetype'] = "472";
          warningMessage(commonErrors, 'customerIds_not_found');

          return resolve('customerIds_not_found');
        }
      if (invitationData != undefined) { // If there is any invitationData then do
        let pdf, fileName, pdfContent;
        pdf = await getDeliveryNotesPdf(accessToken, delivery_id); // Fetch pdf file for deliveryNotes from bexio.

        if (!pdf) { // If there is no pdf, return with error
          deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId, delivery_id, deliveryNotes['document_nr'], '0', 'pdf_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'pdf_not_found -req param,', JSON.stringify(req.body);
          warningMessage(commonErrors, 'pdf_not_found');
          return resolve('pdf_not_found');
        }

        pdfContent = JSON.parse(pdf).content; // Assign pdf content.
        fileName = JSON.parse(pdf).name; // Assign pdf name.

        /* Fetch country data from bexio using accessToken */
        let countryList;
        countryList = await getCountryLists(accessToken);

        if (!countryList) { // If country list not found, return with error.
          deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId, delivery_id, deliveryNotes['document_nr'], '0', 'country_list_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'country_list_not_found -req param,', JSON.stringify(req.body);
          warningMessage(commonErrors, 'country_list_not_found');
          return resolve('country_list_not_found');
        }
        let bank;
        //console.log("deliveryNotes.currency_id :: ",deliveryNotes.currency_id);
        /* Fetch currency from bexio using id. */
        let currency = await getCurrency(accessToken, deliveryNotes.currency_id);
        if (!currency) {
          deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId, delivery_id, deliveryNotes['document_nr'], '0', 'currency_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'currency_not_found -req param,', JSON.stringify(req.body);
          warningMessage(commonErrors, 'currency_not_found');

          return resolve('currency_not_found');
        }
        deliveryNotes['currency'] = currency;

        /* Get user details from access token */
        let temp = await getloginUserCompanyDetails(accessToken);
        if (!temp) {
          deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId, delivery_id, deliveryNotes['document_nr'], '0', 'company_details_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'company_details_not_found -req param,', JSON.stringify(req.body);
          commonErrors['messagetype'] = "458";
          warningMessage(commonErrors, 'company_details_not_found');

          return resolve('company_details_not_found');
        }
        deliveryNotes['companyProfile'] = temp;
        deliveryNotes['companyProfile'] = JSON.parse(deliveryNotes['companyProfile']);
        /* Fetch payment type from deliveryNotes */
        paymentType = await getPaymentType(accessToken, deliveryNotes.payment_type_id);
        if (!paymentType) {
          deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId, delivery_id, deliveryNotes['document_nr'], '0', 'payment_type_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'payment_type_not_found -req param,', JSON.stringify(req.body);
          commonErrors['messagetype'] = "470";
          warningMessage(commonErrors, 'payment_type_not_found');

          return resolve('payment_type_not_found');
        }

        let tempPaymentType = paymentType.filter(e => e.id == deliveryNotes.payment_type_id);
        deliveryNotes['paymentType'] = tempPaymentType;

        /* Fetch contact using contact id from deliveryNotes */
        let contact = await getContact(accessToken, deliveryNotes.contact_id);
        if (!contact) {
          deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId, delivery_id, deliveryNotes['document_nr'], '0', 'contact_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'contact_not_found -req param,', JSON.stringify(req.body);
          commonErrors['messagetype'] = "459";
          warningMessage(commonErrors, 'contact_not_found');

          return resolve('contact_not_found');
        }
        deliveryNotes['contact'] = contact;
        let user = true;
        if (!user) {
          deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId, delivery_id, deliveryNotes['document_nr'], '0', 'user_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'user_not_found -req param,', JSON.stringify(req.body);
          warningMessage(commonErrors, 'user_not_found');

          return resolve('user_not_found');
        }
        deliveryNotes['user'] = user;

        /* Loop over positions in deliveryNotes */
        for (const items of deliveryNotes.positions) {
          //console.log('items.tax_id',items.tax_id);
          if (items.tax_id) { // Check tax is there or not
            /* Fetch tax using tax id */
            let tempTax = await getTaxs(accessToken, items.tax_id);
            if (!tempTax) {
              deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId, delivery_id, deliveryNotes['document_nr'], '0', 'tax_not_Found');
              // addlogs(logs,decryptData.partyId,decryptData.accountId);
              commonErrors['errorTitle'] = req.originalUrl;
              commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'tax_not_Found -req param,', JSON.stringify(req.body);
              commonErrors['messagetype'] = "460";
              warningMessage(commonErrors, 'tax_not_Found');
              return resolve('tax_not_Found');
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
        deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId, delivery_id, deliveryNotes['document_nr'], '1');

        /* Create XML from data */
        let xml;
        xml = await setDeliveryNotesToOt(deliveryNotes, countryList, invitationData[0], pdfContent, fileName, customerIds, deliveryNotesCid);
        if (xml == false) {
          deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId, delivery_id, deliveryNotes['document_nr'], '0', 'xml_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'xml_not_found -req param,', JSON.stringify(req.body);
          commonErrors['messagetype'] = "461";
          warningMessage(commonErrors, 'xml_not_found');
          return resolve('xml_not_found');
        }
        await invoiceFilePush(invitationData[0].rk_netcomidsender, 'WS', xml, deliveryNotes['document_nr'], 'EDI');
        let redisKey = req.body.partyId + "_/";
        await deleteRedis(req.url.substr(1, req.url.length), redisKey);
        return resolve(true);
      }
      else {

        // addlogs(logs,decryptData.partyId,decryptData.accountId);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'ORDER_FOR_OPEN_TRANSACTION -req param,', JSON.stringify(req.body);
        warningMessage(commonErrors, 'ORDER_FOR_OPEN_TRANSACTION');
        return resolve('deliveryNotes_push_error')
      }
    } catch (error) {
      console.error('Error in pushDeliveryNotesBulk:', error);
      reject(error); // Ensure the promise is rejected.
    }
  });
}
const getDeliveryNotesOT = async (accessToken, delivery_id) => {
  try {
    return new Promise(async (resolve, reject) => {
      var options = {
        'method': 'GET',
        'url': `https://api.bexio.com/2.0/kb_delivery/${delivery_id}`,
        'headers': {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      };

      request(options, function (error, response) {
        if (error) {
          commonErrors['errorTitle'] = 'getDeliveryNotesCidOT';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + delivery_id;
          warningMessage(commonErrors, error);
          return resolve(error);
        }
        if (response.statusCode == 200) {
          return resolve(JSON.parse(response.body));
        }
        else {
          return resolve(false);
        }
      })
    });
  } catch (error) {
    commonErrors['errorTitle'] = 'getDeliveryNotesOT';
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + delivery_id;
    warningMessage(commonErrors, error);
    return;
  }
}
const getDeliveryNotesPdf = async (accessToken, delivery_id) => {
  try {
    return new Promise(async (resolve, reject) => {
      var options = {
        'method': 'GET',
        'url': `https://api.bexio.com/2.0/kb_delivery/${delivery_id}/pdf`,
        'headers': {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      };

      request(options, function (error, respons) {
        if (error) {
          commonErrors['errorTitle'] = 'getOrderResposnePdf';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + delivery_id;
          warningMessage(commonErrors, error);
          return resolve(error);
        }
        if (respons.statusCode == 200) {
          return resolve(respons.body);
        }
        else {
          return resolve(false);
        }
      })
    });
  } catch (error) {
    commonErrors['errorTitle'] = 'getOrderResposnePdf';
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + delivery_id;
    warningMessage(commonErrors, error);
    return;
  }

}
const setDeliveryNotesToOt = async (deliveryNotes, coutryList, contactDetails, pdf, fileName, customerIds, delivery_id) => {

  coutryList = JSON.parse(coutryList);
  //console.log("gghghgh");
  let emptyValue = 'NA'
  let taxIsAdded;
  let priceQuantity = '1'
  let deliveryNotesUnit = {
    'Stk': 'C62',
    'h': 'HUR'
  }
  let obj: any = {
    "OPENTRANS": {
      "$": {
        "xmlns:iomarket": "http://tempuri.org/io-market/openTRANS_UDX",
        "xmlns:bmecat": "http://www.bmecat.org/bmecat/2005",
        "xmlns": "http://www.opentrans.org/XMLSchema/2.1"
      },
      "DISPATCHNOTIFICATION": [{
        "$": {
          "version": "2.1"
        },
        "DISPATCHNOTIFICATION_HEADER": [{
          "CONTROL_INFO": [],
          "DISPATCHNOTIFICATION_INFO": []
        }],
        "DISPATCHNOTIFICATION_ITEM_LIST": [{
          "DISPATCHNOTIFICATION_ITEM": []
        }],
        "DISPATCHNOTIFICATION_SUMMARY": []

      }]
    }
  };

  let v = coutryList.filter(coutry => coutry.id == deliveryNotes.companyProfile[0].country_id)
  taxIsAdded = deliveryNotes.taxs.length;
  //console.log("\ntaxIsAdded:: "+taxIsAdded);
  //console.log("JSON.stringify(deliveryNotes) ",JSON.stringify(deliveryNotes.contact));
  //console.log(coutryList[0]);


  obj.OPENTRANS.DISPATCHNOTIFICATION[0]['DISPATCHNOTIFICATION_HEADER'][0]['CONTROL_INFO'].push(JSON.parse(JSON.stringify({
    "GENERATOR_INFO": new Date(deliveryNotes.updated_at).toISOString()
  })))
  //console.log("-------------------------\n"+new Date(deliveryNotes.updated_at).toISOString()+"\n----------------");
  let deliveryAddress = {};
  let tempString = JSON.stringify(deliveryNotes.delivery_address)
  let tempArray = "";
  //console.log("tempString",tempString);


  if (tempString.indexOf("\\r\\n") != -1) {
    tempArray = tempString.substring(1, tempString.length - 1).replace(/\\r\\n/g, "___________");
  }
  else if (tempString.indexOf("\\n") != -1) {
    tempArray = tempString.substring(1, tempString.length - 1).replace(/\\n/g, "___________");
  }
  else if (tempString.indexOf("\\r") != -1) {
    tempArray = tempString.substring(1, tempString.length - 1).replace(/\\r/g, "___________");
  }
  else {
    tempArray = tempString;
  }

  //console.log('tempArray',tempArray);
  let deliveryAddress2 = tempArray.split("___________");
  //console.log("deliveryAddress2",deliveryAddress2);

  let tempAdress = deliveryAddress2.filter((e) => e.length != 0);
  //console.log('tempAdress',tempAdress);
  if (tempAdress.length == 4) {
    tempAdress.splice(1, 0, " ")
  }
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let isEmailAdded = pattern.test(tempAdress[1]);
  let tempStreet;
  let tempZip;
  let tempCity;
  let countryCode;
  let secondName;
  if (isEmailAdded) {
    tempStreet = tempAdress[3]?.trim() ? tempAdress[3]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined;
    tempZip = tempAdress[4]?.trim() ? tempAdress[4]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined;
    tempCity = tempAdress[5]?.trim() ? tempAdress[5]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined;
    countryCode = tempAdress[6] ? coutryList.filter(coutry => coutry.iso_3166_alpha2 == tempAdress[6].replace(/\n/g, "").replace(/\r/g, "").trim())[0]?.iso_3166_alpha2 : undefined;
  } else {
    if (tempAdress.length == 5) {
      countryCode = tempAdress[4] ? coutryList.filter(coutry => coutry.iso_3166_alpha2 == tempAdress[4].replace(/\n/g, "").replace(/\r/g, "").trim())[0]?.iso_3166_alpha2 : undefined;
      tempStreet = tempAdress[1]?.trim() ? tempAdress[1]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined;
      tempZip = tempAdress[2]?.trim() ? tempAdress[2]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined;
      tempCity = tempAdress[3]?.trim() ? tempAdress[3]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined;
    } else {
      countryCode = tempAdress[5] ? coutryList.filter(coutry => coutry.iso_3166_alpha2 == tempAdress[5].replace(/\n/g, "").replace(/\r/g, "").trim())[0]?.iso_3166_alpha2 : undefined;
      secondName = tempAdress[1]?.trim() ? tempAdress[1]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined;
      tempStreet = tempAdress[2]?.trim() ? tempAdress[2]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined;
      tempZip = tempAdress[3]?.trim() ? tempAdress[3]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined;
      tempCity = tempAdress[4]?.trim() ? tempAdress[4]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined;
    }
  }
  obj.OPENTRANS.DISPATCHNOTIFICATION[0]['DISPATCHNOTIFICATION_HEADER'][0]['DISPATCHNOTIFICATION_INFO'].push(JSON.parse(
    JSON.stringify({
      "DISPATCHNOTIFICATION_ID": deliveryNotes.document_nr,
      "DISPATCHNOTIFICATION_DATE": new Date(deliveryNotes.updated_at).toISOString(),
      "bmecat:LANGUAGE": 'deu',
      "DELIVERY_DATE": [{
        "DELIVERY_START_DATE": new Date(deliveryNotes.is_valid_from).toISOString(),
        "DELIVERY_END_DATE": new Date(deliveryNotes.is_valid_from).toISOString()
      }],
      "PARTIES": [{
        "PARTY": [{
          "bmecat:PARTY_ID": [{
            "_": contactDetails.rk_netcomidsender,
            "$": {
              "type": "supplier_specific"
            }
          }],
          "PARTY_ROLE": "supplier",
          "ADDRESS": [{
            "bmecat:NAME": deliveryNotes.companyProfile[0].name_1 ? deliveryNotes.companyProfile[0].name_1 : undefined,
            "bmecat:NAME2": deliveryNotes.companyProfile[0].name_2 ? deliveryNotes.companyProfile[0].name_2 : undefined,
            "bmecat:STREET": deliveryNotes.companyProfile[0].address ? deliveryNotes.companyProfile[0].address : undefined,
            "bmecat:ZIP": deliveryNotes.companyProfile[0].postcode ? deliveryNotes.companyProfile[0].postcode : undefined,
            "bmecat:CITY": deliveryNotes.companyProfile[0].city ? deliveryNotes.companyProfile[0].city : undefined,
            "bmecat:COUNTRY_CODED": coutryList.filter(coutry => coutry.id == deliveryNotes.companyProfile[0].country_id)[0].iso_3166_alpha2
          }]
        }, {
          "bmecat:PARTY_ID": [{
            "_": contactDetails.rk_netcomidreceived,
            "$": {
              "type": "buyer_specific"
            }
          }],
          "PARTY_ROLE": "buyer",
          "ADDRESS": [{
            "bmecat:NAME": deliveryNotes.contact.name_1 ? deliveryNotes.contact.name_1 : undefined,
            "bmecat:NAME2": deliveryNotes.contact.name_2 ? deliveryNotes.contact.name_2 : undefined,
            "bmecat:STREET": deliveryNotes.contact.street_name ? `${deliveryNotes.contact.street_name} ${deliveryNotes.contact.house_number ?? ''}`.trim() : undefined,
            "bmecat:ZIP": deliveryNotes.contact.postcode ? deliveryNotes.contact.postcode : undefined, //NOT IN BEXIO CONTACTS - REMOVED 
            "bmecat:CITY": deliveryNotes.contact.city ? deliveryNotes.contact.city : undefined,
            "bmecat:COUNTRY_CODED": deliveryNotes.contact.country_id ? coutryList.filter(coutry => coutry.id == deliveryNotes.companyProfile[0].country_id)[0].iso_3166_alpha2 : undefined
          }]
        }, {
          "bmecat:PARTY_ID": [{
            "_": contactDetails.rk_netcomidsender,
            "$": {
              "type": "party_specific"
            }
          }],
          "PARTY_ROLE": "delivery",
          "ADDRESS": [{
            "bmecat:NAME": tempAdress[0]?.trim() ? tempAdress[0]?.replace(/\n/g, "")?.replace(/\r/g, "").trim() : undefined,
            "bmecat:NAME2": secondName,
            "CONTACT_DETAILS": isEmailAdded ? [{
              "bmecat:CONTACT_NAME": tempAdress[0]?.trim() ? tempAdress[0]?.replace(/\n/g, "")?.replace(/\r/g, "").trim() : undefined,
              "bmecat:PHONE": tempAdress[2]?.replace(/\n/g, "") ? tempAdress[2] : undefined,
              "bmecat:EMAILS": tempAdress[1]?.trim() ? [{
                "bmecat:EMAIL": tempAdress[1]?.trim() ? tempAdress[1]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined
              }] : undefined,
            }] : undefined,
            "bmecat:STREET": tempStreet,
            "bmecat:ZIP": tempZip,
            "bmecat:CITY": tempCity,
            "bmecat:COUNTRY_CODED": countryCode ? countryCode : undefined
          }]
        }]
      }],
      "bmecat:SUPPLIER_IDREF": contactDetails.sendercustomerid,
      "bmecat:BUYER_IDREF": contactDetails.receiver_customerid,
      "SHIPMENT_PARTIES_REFERENCE": [{
        "DELIVERY_IDREF": contactDetails.rk_netcomidsender
      }],
      "REMARKS": deliveryNotes.title ? deliveryNotes.title : undefined,
      "HEADER_UDX": [{
        "HEADER_UDX_OPT": [{
          "BEX_VERSION": "VER1",
          "BEX_DISPATCHNOTIFICATION_DOCUMENT_ID": delivery_id
        }],
        "SENDER_CUSTOM_ID_1": contactDetails.sendercustomerid,
        "RECEIVER_CUSTOM_ID_1": contactDetails.receiver_customerid,
      }]
    })
  ));
  // //console.log(JSON.stringify(obj.OPENTRANS));
  //console.log("-----------------------------------------------------------");
  let allTax: any = [];
  deliveryNotes.positions.forEach(element => {
    const index = allTax.findIndex(object => object.type === element.tax?.type);
    if (index === -1) {
      allTax.push({
        type: element.tax?.type,
        value: element.tax?.value,
      });
    }
  })
  let tempTaxArray = [];
  let totalAmount: any = '0.00';
  for (let index = 0; index < deliveryNotes.positions.length; index++) {
    let element = deliveryNotes.positions[index];
    //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    //console.log(element);    
    //console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")

    totalAmount = parseFloat(totalAmount) + parseFloat(element.position_total);
    let arr, status = true;
    obj.OPENTRANS.DISPATCHNOTIFICATION[0]['DISPATCHNOTIFICATION_ITEM_LIST'][0]['DISPATCHNOTIFICATION_ITEM'].push(JSON.parse(JSON.stringify({
      "LINE_ITEM_ID": element.pos ? element.pos : index,
      "PRODUCT_ID": [{
        "bmecat:SUPPLIER_PID": element.internal_pos ? element.internal_pos : undefined,
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
        "bmecat:DESCRIPTION_LONG": element.text ? element.text.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '') : undefined

      }],
      "QUANTITY": element.amount ? Math.trunc(element.amount) : 1,
      "bmecat:ORDER_UNIT": deliveryNotesUnit[element.unit_name] ? deliveryNotesUnit[element.unit_name] : 'C62',
      "ORDER_REFERENCE": [{
        "ORDER_ID": element.id,
        "LINE_ITEM_ID": element.pos ? element.pos : index
      }],
      "SHIPMENT_PARTIES_REFERENCE": [{
        "DELIVERY_IDREF": contactDetails.rk_netcomidsender
      }]
    })))
  }
  obj.OPENTRANS['DISPATCHNOTIFICATION'][0]['DISPATCHNOTIFICATION_SUMMARY'].push(JSON.parse(JSON.stringify({
    "TOTAL_ITEM_NUM": deliveryNotes.positions.length
  })))
  // return

  let builder = new xml2js.Builder({ 'xmldec.version': 1.0 });
  //console.log("JSON.stringify(obj):: ",JSON.stringify(obj))
  var xml = builder.buildObject(obj);
  //console.log("xml:  ---------------------------\n",xml);
  return Buffer.from(xml).toString('base64');
}

export const getSendInvoiceList = async (partyId: number, status: string): Promise<any[]> => {
  try {
    let result
    if (status == 'sent') {

      const [successOrPending, failedGate2b] = await Promise.all([
        connectBexio.$queryRaw<any[]>(
          Prisma.sql`SELECT array_agg(rk_invoice::text) AS "invoiceId" 
               FROM documents_invoice_send ds
               INNER JOIN companyregistered c ON c.cid = ds.fk_companyregistered
               WHERE c.rk_party = ${partyId} AND ds.status IN (1, 2)`,
        ),
        connectBexio.$queryRaw<any[]>(
          Prisma.sql`SELECT array_agg(rk_invoice::text) AS "invoiceId" 
               FROM documents_invoice_send ds
               INNER JOIN companyregistered c ON c.cid = ds.fk_companyregistered
               WHERE c.rk_party = ${partyId} AND ds.status = 0`,
        ),
      ]);
      result = [{ successOrPending: successOrPending }, { failedGate2b: failedGate2b }]
    }
    else if (status == 'failed') {


      result = await connectBexio.$queryRaw<any[]>(
        Prisma.sql`SELECT array_agg(rk_invoice::text) AS "invoiceId" 
                       FROM documents_invoice_send ds
                       INNER JOIN companyregistered c ON c.cid = ds.fk_companyregistered
                       WHERE c.rk_party = ${partyId} AND ds.status = 0`
      )
    }
    else if (status == 'draft') {
      console.log('draft', status);

      result = await connectBexio.$queryRaw<any[]>(
        Prisma.sql`SELECT array_agg(rk_invoice::text) AS "invoiceId" 
                       FROM documents_invoice_send ds
                       INNER JOIN companyregistered c ON c.cid = ds.fk_companyregistered
                       WHERE c.rk_party = ${partyId}`
      );
    }
    // Serialize BigInt values to strings
    return result;
    // return result.map(row => ({
    //     ...row,
    //     invoiceId: row.invoiceId.map((id: BigInt) => id.toString())
    // }));
  } catch (error) {
    console.error('Error fetching send invoice list:', error);
    throw new Error('Failed to fetch send invoice list');
  }
};

export async function getConnectionBc(inviteCompanyIds: number[], tempBc: number[]): Promise<any[]> {
  try {
    return await connectBexio.$queryRaw<{ array_agg: number[] }[]>(Prisma.sql`
        SELECT array_agg(rk_sendercontactid::int)
        FROM contact_bc cb
        WHERE cb.rk_party_account = ANY(ARRAY[${Prisma.join(inviteCompanyIds || [])}])
        AND cb.type = 'EDI'
        ${tempBc.length ? Prisma.sql`AND cb.rk_businessconnection = ANY(ARRAY[${Prisma.join(tempBc)}])` : Prisma.empty}
        AND cb.rk_businessconnection IS NOT NULL
    `);
  } catch (error) {
    console.error('Error fetching send getConnectionBc:', error);
    throw new Error('Failed to fetch send getConnectionBc');
  }

}
export const setInvoiceEmailOt = async (invoice, bill_recipient_email, coutryList, pdf, fileName, billerDetails, formData, invoiceLogUid) => {
  console.log('EMAIL:::', invoice?.companyProfile);


  let emptyValue = 'NA'
  let taxIsAdded;
  let priceQuantity = '1'
  let orderUnit = {
    'Stk': 'C62',
    'h': 'HUR'
  }
  //  let billDetails = await getRefrenceNumber(pdf,invoice.document_nr,billerDetails);
  //////console.log('invoiceinvoiceinvoice',invoice);
  let total = '';

  total = invoice['total_remaining_payments'];

  ////console.log('billDetails',billDetails);

  ////console.log('REFERENCE_NUMBER',billerDetails);
  //  if(!billDetails)
  //  {

  //    commonErrors['errorTitle'] = 'QR_code_not_found';
  //    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'QR_code_not_found '+'-req param,'+JSON.stringify(formData);
  //    warningMessage(commonErrors,'QR_code_not_found');
  //    return false;
  //  }
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
          "CONTROL_INFO": [],
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
            "TAX_DETAILS_FIX": []
          }
        }]))
      }]
    }
  }))

  // let v = coutryList.filter(coutry => coutry.id == invoice.contact.country_id)
  taxIsAdded = invoice.taxs.length;
  obj.OPENTRANS.INVOICE[0]['INVOICE_HEADER'][0]['CONTROL_INFO'].push(JSON.parse(JSON.stringify({
    "GENERATION_DATE": new Date(invoice.is_valid_from).toISOString(),
  }))),
    obj.OPENTRANS.INVOICE[0]['INVOICE_HEADER'][0]['INVOICE_INFO'].push(JSON.parse(JSON.stringify({
      "INVOICE_ID": invoice.document_nr,
      "INVOICE_DATE": new Date(invoice.is_valid_from).toISOString(),
      "INVOICE_TYPE": "invoice",
      "DELIVERY_DATE": [{
        "DELIVERY_START_DATE": new Date(invoice.is_valid_from).toISOString(),
        "DELIVERY_END_DATE": new Date(invoice.is_valid_from).toISOString(),
      }],
      "bmecat:LANGUAGE": 'deu',
      "PARTIES": [{
        "PARTY": [{
          "bmecat:PARTY_ID": [{
            "_": billerDetails['billerid'] ?? '00000000',
            "$": {
              "type": "party_specific"
            }

          }],
          "PARTY_ROLE": "invoice_issuer",
          "ADDRESS": [{
            "bmecat:NAME": invoice?.companyProfile[0].name || undefined,
            "bmecat:STREET": invoice?.companyProfile[0].address || undefined,
            "bmecat:ZIP": invoice?.companyProfile[0].postcode || undefined,
            "bmecat:CITY": invoice?.companyProfile[0].city || undefined,
            "bmecat:COUNTRY_CODED": coutryList.filter(coutry => coutry.name == invoice?.companyProfile[0].country_name)?.[0]?.iso_3166_alpha2 || undefined,
          }]

        }, {
          "bmecat:PARTY_ID": [{
            "_": invoice?.contact_id || '00000000',
            "$": {
              "type": "party_specific"
            }
          }],
          "PARTY_ROLE": "invoice_recipient",
          "ADDRESS": [{
            "bmecat:NAME": invoice?.contact?.name_1 ?? undefined,
            "bmecat:NAME2": invoice?.contact?.name_2 ?? undefined,

            "bmecat:STREET": invoice.contact.street_name ? `${invoice.contact.street_name} ${invoice.contact.house_number ?? ''}`.trim() : undefined,
            "bmecat:ZIP": invoice?.contact?.postcode ? invoice.contact.postcode : undefined, //NOT IN BEXIO CONTACTS - REMOVED 
            "bmecat:CITY": invoice?.contact?.city ? invoice.contact.city : undefined,
            "bmecat:COUNTRY_CODED": invoice?.contact?.country_id ? coutryList.filter(coutry => coutry.id == invoice.contact.country_id)[0].iso_3166_alpha2 : undefined
          }]
        }]
      }],
      "INVOICE_ISSUER_IDREF": [{
        "_": billerDetails['recipientid'] ?? "0000000000000000",
        "$": {
          "type": "party_specific"
        }
      }],
      "INVOICE_RECIPIENT_IDREF": [{
        "_": billerDetails['recipientid'] ?? "0000000000000000",
        "$": {
          "type": "party_specific"
        }
      }],
      "bmecat:CURRENCY": invoice?.currency['name'] || undefined,
      "MIME_INFO": [{
        "MIME": [{
          "MIME_EMBEDDED": {
            "MIME_DATA": [{
              "_": pdf,

            }],
            "FILE_NAME": fileName ? fileName : 'temp'
          }
        }]
      }],
      "REMARKS": invoice.title ? invoice.title : undefined,
      "HEADER_UDX": JSON.parse(JSON.stringify([{
        "EBILL.BILL_RECIPIENT_ID": billerDetails['recipientid'] ?? undefined,
        //  "EBILL.QR_IBAN": billDetails['iban']??undefined,
        //  "EBILL.IBAN_REFERENCE_NUMBER": billDetails['ref']??undefined,
        //  "EBILL.QR_TYPE": billDetails['type']??undefined,
        "EBILL.DUE_DATE": invoice?.is_valid_to ? invoice.is_valid_to : '',
        "HEADER_UDX_OPT": [{
          "BEX_VERSION": "VER1",
          "BEX_INVOICE_DOCUMENT_ID": invoiceLogUid ? invoiceLogUid : undefined,
          "RECEIVER_MAIL_ID": bill_recipient_email ?? '',
        }]
      }]))
    })))

  let allTax: any = []

  invoice.positions.forEach(element => {
    const index = allTax.findIndex(object => object.type === element.tax?.type);
    if (index === -1) {
      allTax.push({
        type: element.tax?.type,
        value: element.tax?.value,
      });
    }
  })

  invoice.taxs.length != 0 ?
    invoice.taxs.forEach(element => {
      JSON.parse(JSON.stringify(obj.OPENTRANS['INVOICE'][0]['INVOICE_SUMMARY'][0]['TOTAL_TAX']["TAX_DETAILS_FIX"].push(
        {
          "bmecat:TAX": element.percentage,
          "TAX_AMOUNT": element.value
        }
      )))
    })
    : obj.OPENTRANS['INVOICE'][0]['INVOICE_SUMMARY'][0]['TOTAL_TAX']["TAX_DETAILS_FIX"] = '';

  for (let index = 0; index < invoice.positions.length; index++) {
    let element = invoice.positions[index];
    obj.OPENTRANS.INVOICE[0]['INVOICE_ITEM_LIST'][0]['INVOICE_ITEM'].push(JSON.parse(JSON.stringify({
      "$": {
        "type": "order_item"
      },
      "LINE_ITEM_ID": element.pos ? element.pos : index,
      "PRODUCT_ID": [{
        "bmecat:SUPPLIER_PID": element?.article?.intern_code ? element.article.intern_code : undefined,
        "bmecat:DESCRIPTION_SHORT": element?.article?.intern_name ? decode(element.article.intern_name).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').substring(0, 145) : undefined,
        "bmecat:DESCRIPTION_LONG": element?.text ? decode(element.text).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '') : (element?.article?.intern_description ? decode(element.article.intern_description).replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '') : undefined)
      }],
      "QUANTITY": element.amount ? Math.trunc(element.amount) : 1,
      "bmecat:ORDER_UNIT": orderUnit[element.unit_name] ? orderUnit[element.unit_name] : 'C62',
      "PRODUCT_PRICE_FIX": [JSON.parse(JSON.stringify({
        "bmecat:PRICE_AMOUNT": element.unit_price == null ? 0.00 : parseFloat(element.unit_price).toFixed(2),
        "TAX_DETAILS_FIX": element.tax?.value && taxIsAdded > 0 ? [{
          "bmecat:TAX_TYPE": element.tax?.type,
          "bmecat:TAX": element.tax?.value

        }] : undefined,


        "bmecat:PRICE_QUANTITY": priceQuantity,
      })),
      ],
      "PRICE_LINE_AMOUNT": element.position_total ? parseFloat(element.position_total).toFixed(2) : 0.00,
      "DELIVERY_REFERENCE": [{
        "DELIVERY_DATE": [{
          "DELIVERY_START_DATE": new Date(invoice.updated_at).toISOString(),
          "DELIVERY_END_DATE": new Date(invoice.updated_at).toISOString()
        }]
      }]
    })))

    element.discount_in_percent == null ? delete obj.OPENTRANS.INVOICE[0]['INVOICE_ITEM_LIST'][0]['INVOICE_ITEM'][obj.OPENTRANS.INVOICE[0]['INVOICE_ITEM_LIST'][0]['INVOICE_ITEM'].length - 1]['PRODUCT_PRICE_FIX'][0]['ALLOW_OR_CHARGES_FIX'] : '';
  }

  let builder = new xml2js.Builder({ 'xmldec.version': 1.0 });
  var xml = builder.buildObject(obj);

  return Buffer.from(xml).toString('base64');

}
export const setEbillRole = async (partyId, accountId, partyAccount, roleValue, module) => {
  console.log('partyId', partyId);
  console.log('accountId', accountId);
  console.log('partyAccount', partyAccount);

  try {
    let userRoles;
    if (!roleValue) {
      userRoles = "'EBILL_ADMIN'";
    } else {
      userRoles = "'EBILL_USER'";
    }
    console.log('userRoles', userRoles);

    // Get role data
    const roleData = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
      SELECT r.name, rav.fk_application_version, r.cid AS "roleId" 
      FROM public.role_policy rp
      INNER JOIN public.role r ON r.cid = rp.fk_role
      INNER JOIN public.policy p ON p.cid = rp.fk_policy
      INNER JOIN role_application_version rav ON rav.fk_role = r.cid
      WHERE r.name IN (${Prisma.raw(userRoles)})
      AND r.fk_party IS NULL
    `);

    console.log('roleData', roleData);

    // Check if party application exists
    const existingPartyApplication = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
      SELECT cid 
      FROM partyapplication p 
      WHERE fk_party = ${partyId} 
      AND fk_application_version = ${roleData[0].fk_application_version}
    `);
    console.log('existingPartyApplication', existingPartyApplication);

    let partyApplicationId;
    if (existingPartyApplication.length === 0) {
      // Insert new party application
      const newPartyApplication = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
        INSERT INTO partyapplication (fk_party, fk_application_version)
        VALUES (${partyId}, ${roleData[0].fk_application_version})
        RETURNING cid
      `);
      partyApplicationId = newPartyApplication[0].cid;
    } else {
      partyApplicationId = existingPartyApplication[0].cid;
    }
    console.log('partyApplicationId', partyApplicationId);

    // Insert party application account
    const partyApplicationAccount = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
      INSERT INTO partyapplication_account 
        (fk_partyapplication, fk_account, fk_party_account)
      VALUES (${partyApplicationId}, ${accountId}, ${partyAccount})
      RETURNING cid
    `);
    console.log('partyApplicationId2');

    // Insert party application account role
    await connectLibrary.$queryRaw(Prisma.sql`
      INSERT INTO partyapplication_account_role 
        (fk_partyapplication_account, fk_role)
      VALUES (${partyApplicationAccount[0].cid}, ${roleData[0].roleId})
    `);

    return true;
  } catch (error) {
    console.log('error in setEbillRole:', error);
    return false
  }
};
export const partyServiceUpdate = async (
  partyResponse: any,
  service: string,
  app: string
): Promise<boolean> => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("partyServiceUpdate", partyResponse);
      console.log("partyServiceUpdate", BigInt(partyResponse ?? 0));
      console.log("partyServiceUpdate", Number(partyResponse ?? 0));

      const serviceName = service;
      const partyId = Number(partyResponse);
      const appName = app;
      const getExisted = await connectLibrary.$queryRaw<any>(Prisma.sql`
        SELECT paa.cid, aps.cid as appserviceid, a.cid as appid
        FROM party_applicationversion_appservice paa
        INNER JOIN applicationversion_appservice aa ON aa.cid = paa.fk_applicationversion_appservice
        INNER JOIN appservice aps ON aps.cid = aa.fk_appservice
        INNER JOIN application_version av ON av.cid = aa.fk_application_version
        INNER JOIN application a ON a.cid = av.fk_application
        WHERE paa.fk_party = ${partyId} AND aps.code = ${serviceName} AND a.code = ${appName}
      `);
      console.log("getExisted", getExisted);

      if (getExisted.length) {
        console.log("Service already exists for this party.", getExisted);
        return resolve(true)
      }

      const getAppServiceId = await connectLibrary.$queryRaw<any>(Prisma.sql`
        SELECT aa.cid
        FROM applicationversion_appservice aa
        INNER JOIN appservice aps ON aps.cid = aa.fk_appservice
        INNER JOIN application_version av ON av.cid = aa.fk_application_version
        INNER JOIN application a ON a.cid = av.fk_application
        WHERE aps.code = ${serviceName} AND a.code = ${appName}
      `);
      console.log("getAppServiceId", getAppServiceId);

      const updateData = await connectLibrary.$executeRaw(
        Prisma.sql`
          INSERT INTO party_applicationversion_appservice (fk_party, fk_applicationversion_appservice)
          VALUES (${partyId}, ${getAppServiceId[0].cid})
        `
      );
      console.log("updateData", updateData);

      return resolve(true);
    } catch (error) {
      commonErrors['errorTitle'] = 'partyServiceUpdate';
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + partyResponse;
      warningMessage(commonErrors, error);
      return resolve(error);
    }
  });
};

// Function to fetch contact groups from bexio

export const getContactGroupList = async (accessToken) => {
  try {
    return new Promise(async (resolve, reject) => {
      var options = {
        'method': 'GET',
        'url': `https://api.bexio.com/2.0/contact_group`,
        'headers': {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      };
      request(options, function (error, response) {
        if (error) {
          commonErrors['errorTitle'] = 'getContactGroupList';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString();
          warningMessage(commonErrors, error);
          return resolve(error);
        }
        if (response.statusCode == 200) {
          return resolve(JSON.parse(response.body));
        }
        else {
          return resolve(false);
        }
      })
    });
  } catch (error) {
    commonErrors['errorTitle'] = 'getContactGroupList';
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString();
    warningMessage(commonErrors, error);
    return;
  }
}


// Function to fetch units from the bexio

export const getUnitList = async (access_token, unitId) => {

  return new Promise(async (resolve, reject) => {
    var options = {
      'method': 'GET',
      'url': `${config.BEXIO_API}2.0/unit/${unitId}`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + access_token
      }
    };
    request(options, function (error, response) {
      if (error) {
        commonErrors['errorTitle'] = 'taxes';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + access_token;
        warningMessage(commonErrors, error);
        return resolve(false)
      }
      // res.send(response.body)
      ////console.log("getTaxListA :: ",response.body);
      if (response.statusCode == 200)
        return resolve(JSON.parse(response.body));
      else {
        let returnObject = {
          statuscode: response.statusCode,
          message: response.statusMessage,
          status: false
        }
        return resolve(returnObject)
      }

    });
  });
}
// Function to fetch accounts
export const getActiveAccounts = async (access_token) => {

  return new Promise(async (resolve, reject) => {
    var options = {
      'method': 'GET',
      'url': `https://api.bexio.com/2.0/accounts`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + access_token
      }
    };
    request(options, function (error, response) {
      if (error) {
        commonErrors['errorTitle'] = 'taxes';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + access_token;
        warningMessage(commonErrors, error);
        return resolve(false)
      }
      // res.send(response.body)
      // console.log("response.statusCode :: ",response.statusCode);

      if (response.statusCode == 200) {
        let returnData = {
          statuscode: response.statusCode,
          data: JSON.parse(response.body),
          message: response.statusMessage,
          status: true
        }
        return resolve(returnData)
      }
      else {
        let returnObject = {
          statuscode: response.statusCode,
          message: response.statusMessage,
          status: false
        }
        return resolve(returnObject);
      }
    });
  });
}


export const getActiveArticle = async (access_token) => {

  return new Promise(async (resolve, reject) => {
    var options = {
      'method': 'GET',
      'url': `https://api.bexio.com/2.0/article`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + access_token
      }
    };
    request(options, function (error, response) {
      if (error) {
        commonErrors['errorTitle'] = 'taxes';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + access_token;
        warningMessage(commonErrors, error);
        return resolve(false)
      }
      // res.send(response.body)
      ////console.log("getTaxListA :: ",response.body);
      if (response.statusCode == 200)
        return resolve(JSON.parse(response.body));
      else {
        let returnObject = {
          statuscode: response.statusCode,
          message: response.statusMessage,
          status: false
        }
        return resolve(returnObject)
      }

    });
  });
}

export const getActiveSalesTaxBexio = async (access_token, tax_id) => {

  return new Promise(async (resolve, reject) => {
    var options = {
      'method': 'GET',
      'url': `${config.BEXIO_API}3.0/taxes/${tax_id}`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + access_token
      }
    };
    request(options, function (error, response) {
      if (error) {
        commonErrors['errorTitle'] = 'taxes';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + access_token;
        warningMessage(commonErrors, error);
        return resolve(false)
      }
      // res.send(response.body)
      ////console.log("getTaxListA :: ",response.body);
      if (response.statusCode == 200){
        console.log("response.body :: ",response.body);
        return resolve(JSON.parse(response.body));
      }
      else {
        let returnObject = {
          statuscode: response.statusCode,
          message: response.statusMessage,
          status: false
        }
        return resolve(returnObject)
      }

    });
  });
}
export const getActiveItem = async (access_token, article_id) => {

  return new Promise(async (resolve, reject) => {
    var options = {
      'method': 'GET',
      'url': `${config.BEXIO_API}2.0/article/${article_id}`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + access_token
      }
    };
    request(options, function (error, response) {
      if (error) {
        commonErrors['errorTitle'] = 'taxes';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + access_token;
        warningMessage(commonErrors, error);
        return resolve(false)
      }

      if (response.statusCode == 200)
        return resolve(JSON.parse(response.body));
      else {
        let returnObject = {
          statuscode: response.statusCode,
          message: response.statusMessage,
          status: false
        }
        return resolve(returnObject)
      }

    });
  });
}
export const getContactSearch = async (accessToken, searchJson) => {

  return new Promise(async (resolve, reject) => {

    let optionsContact = {
      'method': 'POST',
      'url': `${config.BEXIO_API}2.0/contact/search`,
      // 'url': `${config.BEXIO_API}${data.api}`,
      // url = `${url}`;
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      },
      body: JSON.stringify(searchJson)
    };
    console.log('optionsContact', optionsContact);
    request(optionsContact, async function (error, response) {
      if (error) {
        commonErrors['errorTitle'] = 'getContactById';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + '-bexio param,' + accessToken;
        warningMessage(commonErrors, error);
        return resolve(error);
      }


      if (response.statusCode == 200) {
        return resolve(JSON.parse(response.body));
      } else {
        return resolve(false)
      }
    });
  });


}
export const getInvoiceSearch = async (accessToken, searchJson) => {
  return new Promise(async (resolve, reject) => {
    let optionsContact = {
      'method': 'POST',
      'url': `${config.BEXIO_API}2.0/kb_invoice/search`,
      // 'url': `${config.BEXIO_API}${data.api}`,
      // url = `${url}`;
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      },
      body: JSON.stringify(searchJson)
    };
    console.log('optionsContact', optionsContact);
    request(optionsContact, async function (error, response) {
      if (error) {
        commonErrors['errorTitle'] = 'getContactById';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + '-bexio param,' + accessToken;
        warningMessage(commonErrors, error);
        return resolve(error);
      }
      console.log("response.body", response.statusCode);

      if (response.statusCode == 200) {
        return resolve(JSON.parse(response.body));
      } else {
        return resolve(false)
      }
    });
  });

}
export const getOctConfig = async (netComId) => {

  try {
    let responseData = {};
    let formdata = {
      module: 'BEX',
      exact_name: netComId
    };

    const queryParams = new URLSearchParams(formdata).toString();
    var options = {
      'method': 'GET',
      'url': `${config.OCTOPUS_URL}/read_config?${queryParams}`,

    };

    //console.log.log('options',options);

    return new Promise(function (resolve, reject) {
      request(options, async function (error, response, body) {

        if (error) {
          commonErrors['errorTitle'] = 'getConfiguration';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString();
          warningMessage(commonErrors, error);
          return reject(error)
        }
        else {
          try {

            //console.log.log(response.body);
            responseData = JSON.parse(response.body)

            return resolve(responseData)
          }
          catch {
            return resolve(false)
          }
        }
      })

    });

  }
  catch (error) {
    commonErrors['errorTitle'] = 'getConfiguration';
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString();
    warningMessage(commonErrors, error);

  }
}
export const updateInvoicePosition = async (partyId, invoiceId, article, access_token, channel) => {
  console.log('invoiceId', invoiceId);

  return new Promise(async (resolve, reject) => {
    var options = {
      'method': 'POST',
      'url': `https://api.bexio.com/2.0/kb_invoice/${invoiceId}/kb_position_article`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + access_token
      },
      body: JSON.stringify(article)
    };
    console.log('options', options);

    request(options, async function (error, response) {

      if (error || response.statusCode != 201) {
        if (error) {
          console.log('error', error);

          commonErrors['errorTitle'] = 'kb_position_article';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + access_token;
        }
        else {
          console.log('response error kb_position_article', response);
          commonErrors['errorTitle'] = 'kb_position_article';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + 'kb_position_article' + '-bexio param,' + access_token;
        }
        warningMessage(commonErrors, error);
        return resolve(false)
      }
      console.log("response.statusCode :: ", response.statusCode);

      if (response.statusCode == 201) {
        return resolve(JSON.parse(response.body));
        console.log("kb_position_article :: ", response.body);
      }
      else if (response.statusCode == 422) {
        let invoiceCid = await setInvoiceSendStatus(partyId, invoiceId, '', '0', 'invalid_article', channel);
        commonErrors['errorTitle'] = 'kb_position_article';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + 'invalid_article' + '-invoices param,';
        commonErrors['messagetype'] = "473";
        warningMessage(commonErrors, 'invalid_article');
        resolve('invalid_article' + invoiceCid);
        return;
      }
    });
  });
}
export const pushPrintInvoice = async (invoices, bodyValues, headerParams, channel) => {
  return new Promise(async (resolve, reject) => {
    const decryptData = invoices;
    const invoice_id = invoices?.doc_id;
    const bill_recipient_email = invoices?.bill_recipient_email ?? '';
    const invoice_uuid = invoices?.invoice_uuid;
    const partyId = bodyValues?.partyId;
    try {
      console.log('pushPrintInvoice', bodyValues);
      let article: any = null;
      let pdf, fileName, pdfContent;
      let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(headerParams.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
      let accessToken = cookie.access_Token;
      const invoice: any = await getInvoiceOT(accessToken, invoice_id);
      if (!invoice) {
        let invoiceCid = await setInvoiceSendStatus(partyId, invoice_id, '', '0', 'invoice_not_found', channel);
        const logData = {
          ...commonErrors,
          errorTitle: invoices.originalUrl,
          errorDescription: 'From:' + path.basename(__filename) + ' invoice_not_found ' + '-invoices param,' + JSON.stringify(decryptData),
          netcomId: bodyValues?.netcomId,
          channel: channel,
          messagetype: "406",
          message: "Not Acceptable Invoice Missing",
          filename: invoice['document_nr']
        };
        warningMessage(logData, 'invoice_not_found');
        resolve('invoice_not_found' + invoiceCid);
        return
      }
      console.log('invoice::::', typeof (invoice.positions));
      console.log('invoice::::', invoice.positions);
      let contact: any = await getContact(accessToken, invoice.contact_id);
      if (!contact) {
        console.log('contact not found');
        let invoiceCid = await setInvoiceSendStatus(partyId, invoice_id, '', '0', 'contact_not_found', channel);
        const logData = {
          ...commonErrors,
          errorTitle: invoices.originalUrl,
          errorDescription: 'From:' + path.basename(__filename) + 'contact_not_found' + '-invoices param,' + JSON.stringify(decryptData),
          netcomId: bodyValues?.netcomId,
          channel: channel,
          messagetype: "406",
          message: "Not Acceptable Contact Missing",
          filename: invoice['document_nr']
        };
        warningMessage(logData, 'contact_not_found');
        resolve('print_contact_not_found' + invoiceCid);
        return;
      }

      console.log('contact::::', contact);
      // If contact exists, check for required keys
      if (!contact?.name_1 || !contact?.street_name || !contact?.city || !contact?.country_id || !contact?.postcode) {
        console.log('contact missing address or postal');
        let invoiceCid = await setInvoiceSendStatus(partyId, invoice_id, '', '0', 'contact_missing_address_or_postal', channel);
        const logData = {
          ...commonErrors,
          errorTitle: invoices.originalUrl,
          errorDescription: 'From:' + path.basename(__filename) + ' print_contact_missing_address_or_postal ' + '-invoices param,' + JSON.stringify(decryptData),
          netcomId: bodyValues?.netcomId,
          channel: channel,
          messagetype: "406",
          message: "Not Acceptable Contact Details Missing",
          filename: invoice['document_nr']
        };
        warningMessage(logData, 'contact_missing_address_or_postal');
        resolve('print_contact_missing_address_or_postal' + invoiceCid);
        return;
      }
      let formData = {
        netcom_id: bodyValues.netcomId,
        doc_type: 'Invoice',
      };
      let options = {
        method: 'POST',
        url: config.GATE2BURL + 'get-print-settings',
        form: { form: JSON.stringify(formData) }
      };
      request(options, async function (error, response) {
        console.log('error', error);
        console.log('response.getArticle', response.statusCode);

        // Parse response.body and extract "Article" from client_json
        try {
          if (error) {
            console.log('error article', error);
            await setInvoiceSendStatus(partyId, invoice_id, '', '0', 'print_article_error', channel);
            const logData = {
              ...commonErrors,
              errorTitle: 'getArticle',
              errorDescription: 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + accessToken,
              netcomId: bodyValues?.netcomId,
              channel: channel,
              messagetype: "503",
              message: "Service Unavailable Print Settings",
              filename: invoice['document_nr']
            };
            warningMessage(logData, error);
            return resolve(error);
          }

          if (response.statusCode == 200) {
            const resp = JSON.parse(response.body);
            console.log('Extracted article:', article);
            console.log('resp', resp);
            article = resp?.data?.client_json?.Article
            if (article) {
              // Validate that article has all required fields and none are empty/undefined/null
              console.log('article herererere', article);
              const invPosUpdate: any = null
              let isArticleFound = false;
              for (const item of invoice.positions) {
                if (item.article_id == article.article_id) {
                  console.log('Matching position found for item:', item);
                  isArticleFound = true;
                  break;
                }
              }
              if (!isArticleFound) {
                console.log('No matching position found for item:');
                console.log('article', article);
                let articleDetail: any = await getActiveItem(accessToken, article.article_id);
                if (articleDetail && articleDetail.id && articleDetail.sale_price && articleDetail.tax_id && articleDetail.unit_id && articleDetail.account_id) {
                  console.log('articleDetail::::', articleDetail);

                  let printArticle = {
                    "amount": '1.000000',
                    "unit_id": articleDetail.unit_id,
                    "account_id": articleDetail.account_id,
                    "tax_id": articleDetail.tax_id,
                    "text": articleDetail?.name,
                    "unit_price": articleDetail.sale_price,
                    "discount_in_percent": '0.000000',
                    "article_id": articleDetail.id
                  }
                  const invPosUpdate = await updateInvoicePosition(partyId, invoice_id, printArticle, accessToken, channel);
                  console.log('invPosUpdate::::', invPosUpdate);
                  if (!invPosUpdate) {
                    console.error('Article update failed:', articleDetail);
                    let invoiceCid = await setInvoiceSendStatus(partyId, invoice_id, '', '0', 'article_update_failed', channel);
                    const logData = {
                      ...commonErrors,
                      errorTitle: invoices.originalUrl,
                      errorDescription: 'From:' + path.basename(__filename) + 'article_update_failed ' + '-invoices param,' + JSON.stringify(decryptData),
                      netcomId: bodyValues?.netcomId,
                      channel: channel,
                      messagetype: "404",
                      message: "Not Found Bexio ArticleAPI Failed",
                      filename: invoice['document_nr']
                    };
                    warningMessage(logData, 'article_update_failed');
                    resolve('article_update_failed' + invoiceCid);
                    return;
                  }
                }
                else {
                  console.error('Article is missing required fields or has empty values:', articleDetail);
                  // Stop the process if articleDetail is invalid or null
                  let invoiceCid = await setInvoiceSendStatus(partyId, invoice_id, '', '0', 'invalid_article', channel);
                  const logData = {
                    ...commonErrors,
                    errorTitle: invoices.originalUrl,
                    errorDescription: 'From:' + path.basename(__filename) + 'invalid_article' + '-invoices param,' + JSON.stringify(decryptData),
                    netcomId: bodyValues?.netcomId,
                    channel: channel,
                    messagetype: "406",
                    message: "Not Acceptable Article Missing",
                    filename: invoice['document_nr']
                  };
                  warningMessage(logData, 'invalid_article');
                  resolve('invalid_article' + invoiceCid);
                  return;
                }
              }
            } else {
              console.log('Article not found in config, skipping update.');
            }
          }
          pdf = await getInvoicePdf(accessToken, invoice_id);
          // console.log('pdf::::', pdf, invoice_id);
          if (pdf?.response == 401) {
            console.log('unauthorized');
            let invoiceCid = await setInvoiceSendStatus(partyId, invoice_id, '', '0', 'unauthorized', channel);
            const logData = {
              ...commonErrors,
              errorTitle: invoices.originalUrl,
              errorDescription: 'From:' + path.basename(__filename) + 'unauthorized' + '-invoices param,' + JSON.stringify(decryptData),
              netcomId: bodyValues?.netcomId,
              channel: channel,
              messagetype: "401",
              message: 'Unauthorized Bexio',
              filename: invoice['document_nr']
            };
            warningMessage(logData, 'unauthorized');
            resolve('unauthorized' + invoiceCid);
            return;
          }
          if (!pdf) {
            console.log('pdf not found');
            let invoiceCid = await setInvoiceSendStatus(partyId, invoice_id, '', '0', 'pdf_not_found', channel);
            const logData = {
              ...commonErrors,
              errorTitle: invoices.originalUrl,
              errorDescription: 'From:' + path.basename(__filename) + 'pdf_not_found' + '-invoices param,' + JSON.stringify(decryptData),
              netcomId: bodyValues?.netcomId,
              channel: channel,
              messagetype: "406",
              message: 'Not Acceptable PDF Missing',
              filename: invoice['document_nr']
            };
            warningMessage(logData, 'pdf_not_found');
            resolve('pdf_not_found' + invoiceCid);
            return;
          }
          pdfContent = JSON.parse(pdf).content;
          fileName = JSON.parse(pdf).name;

          let coutryList;
          coutryList = await getCountryLists(accessToken);
          if (!coutryList) {
            let invoiceCid = await setInvoiceSendStatus(partyId, invoice_id, '', '0', 'country_list_not_found', channel);
            const logData = {
              ...commonErrors,
              errorTitle: invoices.originalUrl,
              errorDescription: 'From:' + path.basename(__filename) + 'country_list_not_found ' + '-invoices param,' + JSON.stringify(decryptData),
              netcomId: bodyValues?.netcomId,
              channel: channel,
              messagetype: "406",
              message: 'Not Acceptable Country Missing',
              filename: invoice['document_nr']
            };
            warningMessage(logData, 'country_list_not_found');
            resolve('country_list_not_found' + invoiceCid);
            return;
          }
          coutryList = JSON.parse(coutryList);

          invoice.contact = contact;
          let temp = await getloginUserCompanyDetails(accessToken);
          console.log("getloginUserCompanyDetails:", typeof (temp));
          console.log("getloginUserCompanyDetails:", temp);
          if (!temp) {
            let invoiceCid = await setInvoiceSendStatus(partyId, invoice_id, invoice['document_nr'], '0', 'company_details_not_found', channel);
            const logData = {
              ...commonErrors,
              errorTitle: invoices.originalUrl,
              errorDescription: 'From:' + path.basename(__filename) + ' ' + 'company_details_not_found -req param,' + JSON.stringify(decryptData),
              netcomId: bodyValues?.netcomId,
              channel: channel,
              messagetype: "406",
              message: 'Not Acceptable Company Details Missing',
              filename: invoice['document_nr']
            };
            warningMessage(logData, 'company_details_not_found');
            return resolve('company_details_not_found');
          }
          invoice['companyProfile'] = temp;
          invoice['companyProfile'] = JSON.parse(invoice['companyProfile']);
          let currency = await getCurrency(accessToken, invoice.currency_id);
          if (!currency) {
            let invoiceCid = await setInvoiceSendStatus(partyId, invoice_id, invoice['document_nr'], '0', 'currency_not_found', channel);
            const logData = {
              ...commonErrors,
              errorTitle: invoices.originalUrl,
              errorDescription: 'From:' + path.basename(__filename) + ' ' + 'currency_not_found -req param,' + JSON.stringify(decryptData),
              netcomId: bodyValues?.netcomId,
              channel: channel,
              messagetype: "406",
              message: 'Not Acceptable Currency Missing',
              filename: invoice['document_nr']
            };
            warningMessage(logData, 'currency_not_found');
            return resolve('currency_not_found');
          }
          invoice['currency'] = currency;
          let xml: any = await setInvoiceEmailOt(invoice, bill_recipient_email, coutryList, pdfContent, fileName, {}, '', invoice_uuid);

          if (xml == false) {
            let invoiceCid = await setInvoiceSendStatus(partyId, invoice_id, '', '0', 'xml_not_found', channel);
            const logData = {
              ...commonErrors,
              errorTitle: invoices.originalUrl,
              errorDescription: 'From:' + path.basename(__filename) + 'xml_not_found ' + '-invoices param,' + JSON.stringify(decryptData),
              netcomId: bodyValues?.netcomId,
              channel: channel,
              messagetype: "406",
              message: 'Not Acceptable XML Missing',
              filename: invoice['document_nr']
            };
            warningMessage(logData, 'xml_not_found');
            resolve('xml_not_found' + invoiceCid);
            return
          }

          let filePush: any = await invoiceFilePush(bodyValues.netcomId, 'WS', xml, invoice.document_nr, channel);
          if (filePush?.message == 'no_active_interface') {
            let invoiceCid = await setInvoiceSendStatus(partyId, invoice_id, '', '0', 'no_active_interface', channel);
            const logData = {
              ...commonErrors,
              errorTitle: invoices.originalUrl,
              errorDescription: 'From:' + path.basename(__filename) + 'no_active_interface' + '-invoices param,' + JSON.stringify(decryptData),
              netcomId: bodyValues?.netcomId,
              channel: channel,
              messagetype: "503",
              message: "Service Unavailable Filepush",
              filename: invoice['document_nr']
            };
            warningMessage(logData, 'no_active_interface');
            resolve(invoiceCid);
            return;
          }
          console.log('filePush::::', filePush, channel);

          if (filePush) {
            // let invoiceCid = await setInvoiceSendStatus(partyId, invoice_id, '', '1', '', channel);
            // console.log('invoiceCid::::', invoiceCid);
            await markAsIssued(accessToken, invoice_id);
            resolve(invoice_id);
            return;
          }

          if (!filePush) {
            let invoiceCid = await setInvoiceSendStatus(partyId, invoice_id, '', '0', 'file_push_error', channel);
            const logData = {
              ...commonErrors,
              errorTitle: invoices.originalUrl,
              errorDescription: 'From:' + path.basename(__filename) + 'file_push_error' + '-invoices param,' + JSON.stringify(decryptData),
              netcomId: bodyValues?.netcomId,
              channel: channel,
              messagetype: "503",
              message: "Service Unavailable Filepush",
              filename: invoice['document_nr']
            };
            warningMessage(logData, 'file_push_error');
            resolve(invoiceCid);
            return;
          }

        } catch (err) {
          await setInvoiceSendStatus(partyId, invoice_id, '', '0', 'push_print_invoice', channel);
          console.error('Failed to parse response or extract Article:', err);
        }

      });
      console.log("options", options);
      console.log('invoices::::', invoices, channel);

    } catch (error) {
      await setInvoiceSendStatus(partyId, invoice_id, '', '0', 'push_print_invoice', channel);
      console.error('Error in pushEmailInvoice:', error);
      reject(error);
    }
  });
};

export function isArticleMatch(item: any, article: any): boolean {
  console.log('item::::', item);
  console.log('article::::', article);
  console.log('item.amount::::', item.amount, article.amount);
  console.log('item.unit_id::::', item.unit_id, article.unit_id);
  console.log('item.account_id::::', item.account_id, article.account_id);
  console.log('item.tax_id::::', item.tax_id, article.tax_id);
  console.log('item.text::::', item.text, article.text);
  console.log('item.unit_price::::', item.unit_price, article.unit_price);
  console.log('item.discount_in_percent::::', item.discount_in_percent, article.discount_in_percent);
  return (Number(item.amount) == Number(article.amount) &&
    String(item.unit_id) == String(article.unit_id) &&
    String(item.account_id) == String(article.account_id) &&
    String(item.tax_id) == String(article.tax_id) &&
    String(item.text || '') == String(article.text || '') &&
    Number(item.unit_price) == Number(article.unit_price) &&
    Number(item.discount_in_percent) == Number(article.discount_in_percent))

}

export async function pushContactToBexio(
  netcomid: string,
  contacts: Array<{
    Name: string;
    Iso_Email__c?: string;
    BillingAddress?: { street?: string; postalCode?: string; city?: string };
    [key: string]: any;
  }>
): Promise<any[]> {
  // 1. Fetch refresh_token from companyregistered table using netcomid
  console.log('pushContactToBexio called with netcomid:', netcomid);
  console.log('contacts:', contacts);

  const company = await connectBexio.companyregistered.findFirst({
    where: { netcomid },
    select: { refresh_token: true }
  });

  if (!company || !company.refresh_token) {
    console.error(`No refresh_token found for netcomid: ${netcomid}`);
    return [{ success: false, error: 'No refresh_token found' }];
  }

  // 2. Exchange refresh_token for access_token (Bexio OAuth2) using bexioClient
  const bexioClient = await bexioInterfaceClient();
  let tokenSet
  try {
    tokenSet = await bexioClient.refresh(company.refresh_token || '');
  } catch (err) {
    console.error('Failed to get Bexio access token:', err);
    return [{ success: false, error: 'Failed to get access token' }];
  }
  const accessToken = tokenSet.access_token;

  // 3. Only push contact if search result for that name does not exist
  if (contacts && Array.isArray(contacts)) {
    const results: any[] = [];
    for (const contact of contacts) {

      const fullName = contact.Name?.trim() || '';

      let firstName1 = '';
      let lastName1 = '';


      const separatorMatch = fullName.match(/\s+(?:&|and|und)\s+/i);

      if (separatorMatch) {
        // Treat as couple
        const separator = separatorMatch[0];
        const parts = fullName.split(separator);
        if (parts.length === 2) {
          firstName1 = parts[0].trim() + ' &';
          lastName1 = parts[1].trim();
        } else {
          firstName1 = fullName;
        }
      } else {
        // Normal single person name logic
        const parts = fullName.split(/\s+/);
        if (parts.length === 1) {
          firstName1 = parts[0];
        } else if (/^\d/.test(parts[0])) {
          lastName1 = parts[0];
          firstName1 = parts.slice(1).join(' ');
        } else if (/^\d/.test(parts[parts.length - 1])) {
          lastName1 = parts[parts.length - 1];
          firstName1 = parts.slice(0, -1).join(' ');
        } else if (parts.length >= 3) {
          firstName1 = parts[0];
          lastName1 = parts.slice(1).join(' ');
        } else {
          firstName1 = parts[0];
          lastName1 = parts.slice(1).join(' ');
        }
      }
      console.log('lastName1', lastName1);
      console.log('firstName1', firstName1);
      const nameToCheck2: string = lastName1;
      const nameToCheck1: string = firstName1;
      const searchOptions = {
        method: 'POST',
        url: `https://api.bexio.com/2.0/contact/search`,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        // body: JSON.stringify([
        //   {
        //     "field": "name_1",
        //     "value": nameToCheck2,
        //     "criteria": "="
        //   },
        //   {
        //     "field": "name_2",
        //     "value": nameToCheck1,
        //     "criteria": "="
        //   },
        // ])
        body: JSON.stringify([
          {
            "field": "nr",
            "value": contact.Iso_SAP_Partner_ID__c,
            "criteria": "="
          },
        ])
      };

      let existingContacts: any[] = [];
      let retryCount = 0;
      const maxRetries = 3;
      try {
        while (retryCount < maxRetries) {
          try {
            existingContacts = await new Promise<any[]>((resolve, reject) => {
              request(
                searchOptions,
                (err: any, resp: any, body: any) => {
                  console.log('searchOptions', searchOptions);
                  console.log('search response', resp && resp.statusCode, body);

                  if (err) return reject(err);
                  if (resp.statusCode === 200) {
                    return resolve(JSON.parse(body));
                  } else if (resp.statusCode === 429) {
                    return reject({ retry: true });
                  } else {
                    return reject(body);
                  }
                }
              );
            });
            break;
          } catch (err: any) {
            if (err && err.retry) {
              retryCount++;
              await new Promise(res => setTimeout(res, 60000));
            } else {
              throw err;
            }
          }
        }
        if (!existingContacts || existingContacts.length === 0) {
          console.log(`No existing contacts found for name: ${nameToCheck1}. Proceeding to push contact.`);
          console.log(`No existing contacts found for name: ${contact.Iso_SAP_Partner_ID__c}. Proceeding to push contact.`);
          // Prepare Bexio contact payload from Salesforce record
          // In Bexio: name_1 = last name, name_2 = first name
          // If two users: user1 (first/last) and user2 (first/last)
          // Place user2's name in name_1 (last name), user1's name in name_2 (first name, with '&')
          // const firstName1 = contact.Iso_Account_1st_First_Name__c || '';
          // const lastName1 = contact.Iso_Account_1st_Last_Name__c || '';
          // const firstName2 = contact.Iso_Account_2nd_FName__c || '';
          // const lastName2 = contact.Iso_Account_2nd_LName__c || '';

          // let name_1 = '';
          // let name_2 = '';

          // if (firstName2 || lastName2) {
          // // Two users: user2 goes to name_1, user1 goes to name_2 with '&'
          // name_1 = `${lastName2} ${firstName2}`.trim();
          // name_2 = `${firstName1} ${lastName1}`.trim();
          // if (name_2) name_2 = `${name_2}&`;
          // } else {
          // // Only user1: last name to name_1, first name to name_2
          // name_1 = lastName1;
          // name_2 = firstName1;
          // }
          let address = contact.BillingAddress?.street?.trim() || '';
          let parts = address.split(' ').filter(p => p.trim() !== '');

          let streetName = '';
          let houseNumber = '';

          if (parts.length > 1) {
            houseNumber = parts.pop() || ''; // safely remove last word
            streetName = parts.join(' ');
          } else {
            streetName = address;
          }

          streetName = streetName.trim();
          houseNumber = houseNumber.trim();


          console.log('streetName:', streetName);
          console.log('houseNumber:', houseNumber);

          const bexioContact = {
            name_1: lastName1 || null,
            name_2: firstName1 || null,
            mail: contact.Iso_Email__c || null,
            nr: contact.Iso_SAP_Partner_ID__c || null,
            street_name: streetName || null,
            house_number: houseNumber || null,
            postcode: contact.BillingAddress?.postalCode,
            city: contact.BillingAddress?.city || null,
            contact_type_id: 2,
            user_id: 1,
            owner_id: 1,
          };

          const pushOptions = {
            method: 'POST',
            url: `https://api.bexio.com/2.0/contact`,
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(bexioContact)
          };

          try {
            let result: any;
            let retryCount = 0;
            while (retryCount < maxRetries) {
              try {
                result = await new Promise<any>((resolve, reject) => {
                  request(
                    pushOptions,
                    (err: any, resp: any, body: any) => {
                      console.log('pushOptions', pushOptions);
                      console.log('push response', resp && resp.statusCode, body);

                      if (err) return reject(err);
                      if (resp.statusCode === 201 || resp.statusCode === 200) {
                        return resolve(JSON.parse(body));
                      } else if (resp.statusCode === 429) {
                        return reject({ retry: true });
                      } else {
                        return reject(body);
                      }
                    }
                  );
                });
                break;
              } catch (err: any) {
                if (err && err.retry) {
                  retryCount++;
                  await new Promise(res => setTimeout(res, 60000));
                } else {
                  throw err;
                }
              }
            }
            results.push({ success: true, data: result, record: contact });
          } catch (err) {
            results.push({ success: false, error: err, record: contact });
          }
        } else {
          console.log(`Contact with name ${nameToCheck1} already exists in Bexio. Skipping push.`);
          console.log(`Contact with name ${nameToCheck2} already exists in Bexio. Skipping push.`);
          console.log('Existing contacts:', existingContacts);

          results.push({ success: false, error: 'Contact with same name already exists', data: existingContacts, record: contact });
        }
      } catch (err) {
        results.push({ success: false, error: err, record: contact });
        continue;
      }
    }
    return results;
  }
  return [];
}


export async function processNextPendingJob(job: any) {
  console.log(`Processing job: ${JSON.stringify(job)}`);

  const dynamoDBService = new DynamoDBService();
  const salesforceService = new SalesforceService();

  // Mark as in_progress
  await dynamoDBService.updateJobStatus(job.cid, 'in_progress');
  const contacts = await salesforceService.fetchContacts({ companyName: job.companyName, netcomid: job.netcomid });
  console.log(`Processing contact: ${JSON.stringify(contacts)}`);

  if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
    console.log(`No contacts found for job ${job.cid}. Marking as done.`);
    await dynamoDBService.updateJobStatus(job.cid, 'done');
    return { success: false, message: 'No contacts found' };
  }

  // const pushResult = await pushContactToBexio(job.netcomid, contacts);
  const pushResult = await pushSchedulerContactToBexio(job.netcomid, contacts);

  if (pushResult) {
    console.log(`Job ${job.cid} completed successfully with result: ${JSON.stringify(pushResult)}`);
    await dynamoDBService.updateJobStatus(job.cid, 'done');
  }

  return pushResult;
}
export async function saleforceContactImport(netcomId, companyName) {
  console.log(`netcomId: ${netcomId}`);
  console.log(`companyName: ${companyName}`);

  const salesforceService = new SalesforceService();


  const contacts = await salesforceService.fetchContacts({ companyName, netcomId });
  console.log(`Processing contact: ${JSON.stringify(contacts)}`);

  if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
    return { success: false, message: 'No contacts found' };
  }

  const pushResult = await pushSchedulerContactToBexio(netcomId, contacts);

  if (pushResult) {
    return { success: false, message: 'completed successfully' };

  }

  return pushResult;
}
export async function pushSchedulerContactToBexio(
  netcomid: string,
  contacts: Array<{
    Name: string;
    Iso_Email__c?: string;
    BillingAddress?: { street?: string; postalCode?: string; city?: string; country?: string, countryCode?: string };
    Iso_SAP_Partner_ID__c?: string;
    [key: string]: any;
  }>
): Promise<any[]> {
  const results: any[] = [];
  console.log('pushContactToBexio called with netcomid:', netcomid);

  const company = await connectBexio.companyregistered.findFirst({
    where: { netcomid },
    select: { refresh_token: true }
  });
  console.log('company', company);
  if (!company?.refresh_token) {
    return [{ success: false, error: 'No refresh_token found' }];
  }

  const bexioClient = await bexioInterfaceClient();
  let tokenSet;
  try {
    tokenSet = await bexioClient.refresh(company.refresh_token);
  } catch (err) {
    return [{ success: false, error: 'Failed to get access token' }];
  }
  const accessToken = tokenSet.access_token;
  console.log('accessToken', accessToken);
  if (!contacts?.length) return [];

  // Get all SAP IDs
  const ids = contacts.map(c => c.Iso_SAP_Partner_ID__c).filter(Boolean);
  console.log('ids', ids.length);
  console.log('ids', ids);
  //  Search existing contacts in Bexio
  let existingContacts: any[] = [];
  if (ids.length) {
    const searchOptions = {
      method: 'POST',
      url: `https://api.bexio.com/2.0/contact/search`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{ field: 'nr', value: ids, criteria: 'in' }])
    };

    let retryCount = 0;
    const maxRetries = 3;
    while (retryCount < maxRetries) {
      try {
        existingContacts = await new Promise<any[]>((resolve, reject) => {
          request(searchOptions, (err, resp, body) => {
            if (err) return reject(err);
            if (resp.statusCode === 200) {
              console.log('JSON.parse(body)', JSON.parse(body));
              return resolve(JSON.parse(body));
            }
            else if (resp.statusCode === 429) return reject({ retry: true });
            else return reject(body);
          });
        });
        break;
      } catch (err: any) {
        if (err?.retry) {
          retryCount++;
          await new Promise(res => setTimeout(res, 60000));
        } else throw err;
      }
    }
  }

  const existingIds = existingContacts.map(c => c.nr);
  console.log('existingIds', existingIds);
  //  Filter new contacts
  const newContacts = contacts.filter(c => !existingIds.includes(c.Iso_SAP_Partner_ID__c));
  console.log('newContacts.length', newContacts.length);
  console.log('newContacts.length', newContacts);
  if (!newContacts.length) {
    console.log('No new contacts to push to Bexio.');
    return [];
  }
  const saleforceContact = [
    ...new Map(
      contacts
        .map(c => ({
          country_code: c.BillingAddress?.countryCode?.trim(),
          country_name: c.BillingAddress?.country?.trim()
        }))
        .filter(c => c.country_code && c.country_name)
        .map(c => [c.country_code, c])
    ).values()
  ];

  console.log('saleforceContact', saleforceContact);
  let countryList;
  countryList = await getCountryLists(accessToken);
  if (countryList) {
    countryList = JSON.parse(countryList);
  } else {
    countryList = [];
  }

  console.log('coutryList.', countryList);
  const existingcountryList = countryList.map(c => c.iso_3166_alpha2);
  console.log('existingcoutryList', existingcountryList);
  const newCountries = saleforceContact.filter(c => !existingcountryList.includes(c.country_code));
  console.log('New countries to add:', newCountries);

  if (!newCountries.length) {
    console.log('No new country to push to Bexio.');
  }
  else {
    await Promise.all(
      newCountries.map(contact =>
        createCountry(
          accessToken,
          contact.country_name,
          contact.country_code,
          contact.country_code
        )
      )
    );
  }

  //  Prepare payload
  // Prepare all contacts (each async operation returns a promise)
  const bexioPayloadPromises = newContacts.map(async contact => {
    const fullName = contact.Name?.trim() || '';
    let firstName1 = '';
    let lastName1 = '';

    const separatorMatch = fullName.match(/\s+(?:&|and|und)\s+/i);
    if (separatorMatch) {
      const separator = separatorMatch[0];
      const parts = fullName.split(separator);
      if (parts.length === 2) {
        firstName1 = parts[0].trim() + ' &';
        lastName1 = parts[1].trim();
      } else firstName1 = fullName;
    } else {
      const parts = fullName.split(/\s+/);
      if (parts.length === 1) firstName1 = parts[0];
      else if (/^\d/.test(parts[0])) {
        lastName1 = parts[0];
        firstName1 = parts.slice(1).join(' ');
      } else if (/^\d/.test(parts[parts.length - 1])) {
        lastName1 = parts[parts.length - 1];
        firstName1 = parts.slice(0, -1).join(' ');
      } else if (parts.length >= 3) {
        firstName1 = parts[0];
        lastName1 = parts.slice(1).join(' ');
      } else {
        firstName1 = parts[0];
        lastName1 = parts.slice(1).join(' ');
      }
    }

    let address = contact.BillingAddress?.street?.trim() || '';
    let parts = address.split(' ').filter(p => p.trim() !== '');
    console.log('address', address);
    console.log('parts', parts);
    let streetName = '';
    let houseNumber = '';

    if (parts.length > 1) {
      houseNumber = parts.pop() || ''; // safely remove last word
      streetName = parts.join(' ');
    } else {
      streetName = address;
    }
    streetName = streetName.trim();
    houseNumber = houseNumber.trim();

    // Wait for country list
    let countryList: any = await getCountryLists(accessToken);
    if (countryList) {
      countryList = JSON.parse(countryList);
    } else {
      countryList = [];
    }

    let countryCode = contact.BillingAddress?.countryCode?.trim() || '';
    const countryObj = countryList.find(c => c.iso_3166_alpha2 === countryCode);
    const countryId = countryObj?.id;
    console.log('countryId', countryId);
    console.log('streetName', streetName);
    console.log('houseNumber', houseNumber);

    const data = {
      name_1: lastName1 || null,
      name_2: firstName1 || null,
      mail: contact.Iso_Email__c || null,
      nr: contact.Iso_SAP_Partner_ID__c || null,
      street_name: streetName || null,
      house_number: houseNumber || null,
      postcode: contact.BillingAddress?.postalCode || null,
      city: contact.BillingAddress?.city || null,
      country_id: countryId || null,
      contact_type_id: 2,
      user_id: 1,
      owner_id: 1
    };

    console.log('Prepared contact payload:', data);

    return data;
  });

  // Wait until all contacts are processed
  const bexioPayload = await Promise.all(bexioPayloadPromises);
  console.log('bexioPayload', JSON.stringify(bexioPayload));

  if (!bexioPayload || bexioPayload.length === 0) {
    return results;
  }

  const BATCH_SIZE = 50;
  const maxRetries = 3;

  for (let i = 0; i < bexioPayload.length; i += BATCH_SIZE) {
    const batch = bexioPayload.slice(i, i + BATCH_SIZE);
    const pushOptions = {
      method: 'POST',
      url: 'https://api.bexio.com/2.0/contact/_bulk_create',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(batch)
    };

    let retryCount = 0;
    try {
      let result;
      while (retryCount < maxRetries) {
        try {
          result = await new Promise((resolve, reject) => {
            request(pushOptions, (err, resp, body) => {
              if (err) return reject(err);
              if (resp.statusCode === 200 || resp.statusCode === 201) {
                try {
                  resolve(JSON.parse(body));
                } catch (parseErr) {
                  // if body is not JSON, resolve raw body
                  resolve(body);
                }
              } else if (resp.statusCode === 429) {
                return reject({ retry: true, statusCode: resp.statusCode });
              } else {
                reject({ statusCode: resp.statusCode, body });
              }
            });
          });
          break;
        } catch (err: any) {
          if (err?.retry) {
            retryCount++;
            console.warn(`Rate limited, retry ${retryCount}/${maxRetries} for batch starting at index ${i}`);
            await new Promise(res => setTimeout(res, 60000));
          } else {
            throw err;
          }
        }
      }
      results.push({ success: true, data: result, batchStart: i, batchSize: batch.length });
    } catch (err) {
      console.error(`Failed to push batch starting at ${i}:`, err);
      results.push({ success: false, error: err, batchStart: i, batchSize: batch.length });
    }
  }

  console.log('results', results);
  return results;
}

export const createCountry = async (access_token, name, name_short, country_code) => {
  try {
    return new Promise(async (resolve, reject) => {
      var options = {
        'method': 'POST',
        'url': `https://api.bexio.com/2.0/country`,
        'headers': {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + access_token
        },
        body: JSON.stringify({
          "name": name,
          "name_short": name_short,
          "iso3166_alpha2": country_code
        })
      };
      request(options, function (error, response) {
        if (error) {
          commonErrors['errorTitle'] = 'getCountryLists';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + access_token;
          warningMessage(commonErrors, error);
          return resolve(false)
        }
        if (response.statusCode == 200)
          return resolve(response.body);
        else
          return resolve(false)

      });
    });
  } catch (error) {
    commonErrors['errorTitle'] = "getCountryLists";
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + access_token;
    warningMessage(commonErrors, error);
    return resolve('');
  }
}


export const parseResponse = (response: any) => {
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

const CHANNEL_GROUP = {
  print: ["print", "post"],
  email: ["email"],
  ebill: ["ebill"]
}

export const getContactIdsByChannel = async (accessToken: string, channel: string) => {
  const targetChannel = CHANNEL_GROUP[channel.toLowerCase()]
  if (!targetChannel) return []

  let contactGroupList: any = await getContactGroupList(accessToken);
  console.log("channel", channel);
  console.log("targetChannel", targetChannel);
  console.log("contactGroupList", contactGroupList);

  const ids = contactGroupList
    ?.filter(group => targetChannel.includes(group.name.toLowerCase()))
    .map(group => group.id);
  console.log("contactGroupList ids ::", ids);

  let searchContactgrp: any[] = [{
    field: "contact_group_ids",
    value: ids,
    criteria: "in"
  }];

  let contactIds: any = await getContactSearch(accessToken, searchContactgrp);
  console.log("contactIds ::", contactIds);

  return contactIds?.map(contact => contact.id) || []
}

export const validDate = (date: string, isEnd?: boolean) => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return undefined
  if (isEnd) {
    parsedDate.setHours(23, 59, 59, 999)
  }
  return parsedDate;
};

export const getInvoicesQuery = async (
  channel: string,
  netcomId: number,
  include: boolean,
  contactId?: string,
  status?: number
) => {

  const prismaContactId = contactId ? Prisma.sql`AND ds.receiver_contactid = ${Number(contactId)}` : Prisma.empty
  const prismaStatus = status !== undefined ? Prisma.sql`AND ds.status = ${status}` : Prisma.empty;
  const normalizedChannel =
    channel.toLowerCase() === "print"
      ? ["PRINT", "POST"]
      : [channel.toUpperCase()];

  return await connectBexio.$queryRaw<{ invoices: number[]; contacts: number[]; invoice_type: string[] }[]>(
    Prisma.sql`
    SELECT array_agg(ds.rk_invoice::int) AS invoices, array_agg(ds.receiver_contactid::int) AS contacts, array_agg(ds.invoice_type) AS invoice_type
    FROM documents_invoice_send ds
    INNER JOIN companyregistered c ON ds.fk_companyregistered = c.cid
    WHERE c.netcomid = ${netcomId}
      ${prismaContactId}
      ${prismaStatus}
      AND ${include
        ? Prisma.sql`UPPER(ds.invoice_type) IN (${Prisma.join(normalizedChannel.map(v => Prisma.sql`${v}`))})`
        : Prisma.sql`UPPER(ds.invoice_type) NOT IN (${Prisma.join(normalizedChannel.map(v => Prisma.sql`${v}`))})`
      }
  `
  );
};

export function escapeLikeChars(text) {
  return text.replace(/[_%]/g, "\\$&")
}

export const getStatusLabel = (status: number) => {
  if (status === 0) {
    return "Fehlgeschlagen"
  } else if (status === 1) {
    return "In Bearbeitung"
  } else if (status === 2) {
    return "Abgeschlossen"
  }
  return null;
}

export const markAsIssued = async (access_token, id,channel?) => {
  console.log('markAsIssued');
  console.log('id', id);
  let invoiceId = Number(id);
if (channel == 'EBILL') {
  const invoice: any = await getInvoiceOT(access_token, id);

  if (invoice?.kb_item_status_id == 8) {
    await revertIssue(access_token, id);
  }
}
  return new Promise((resolve, reject) => {
    var options = {
      method: 'POST',
      url: `https://api.bexio.com/2.0/kb_invoice/${id}/issue`,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + access_token
      }
    };

    request(options, function (error, response) {
      console.log('************************');

      if (error) {
        commonErrors['errorTitle'] = 'markAsIssued';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,';
        warningMessage(commonErrors, error);
        return resolve(false);
      }
      console.log('response', response);
      if (response.statusCode === 200) {
        try {
          const resBody = JSON.parse(response.body);
          return resolve(resBody);
        } catch (parseError) {
          console.error('Failed to parse response:', response.body);
          commonErrors['errorTitle'] = 'markAsIssued';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' Failed to parse response: ' + response.body;
          warningMessage(commonErrors, parseError);
          return resolve(false);
        }
      } else if (response.statusCode === 400) {
        const msg = response.body ? JSON.stringify(response.body) : '';
        console.log(msg);
        commonErrors['errorTitle'] = 'markAsIssued';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + msg + ' -bexio param,';
        warningMessage(commonErrors, msg);
        return resolve(false);
      } else {
        commonErrors['errorTitle'] = 'markAsIssued';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' Unexpected status: ' + response.statusCode + ' -bexio param,';
        warningMessage(commonErrors, response.body);
        return resolve(false);
      }
    });
  });
};
export const revertIssue = async (access_token, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const options = {
        method: 'POST',
        url: `https://api.bexio.com/2.0/kb_invoice/${id}/revert_issue`,
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + access_token,
        },
      };

      request(options, function (error, response) {
        if (error) {
          commonErrors['errorTitle'] = 'revertIssue';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + id;
          warningMessage(commonErrors, error);
          return resolve(false);
        }

        console.log('responseof revertIssue', response);

        try {
          if (response && response.statusCode === 200) {
            try {
              const parsed = response.body ? JSON.parse(response.body) : response.body;
              return resolve(parsed);
            } catch (parseErr) {
              commonErrors['errorTitle'] = 'revertIssue';
              commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' Failed to parse response: ' + response.body;
              warningMessage(commonErrors, parseErr);
              return resolve(false);
            }
          } else {
            commonErrors['errorTitle'] = 'revertIssue';
            commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' Unexpected status: ' + (response ? response.statusCode : 'no response') + ' -bexio param,' + id;
            warningMessage(commonErrors, response);
            return resolve(false);
          }
        } catch (innerErr) {
          commonErrors['errorTitle'] = 'revertIssue';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + innerErr.toString() + '-bexio param,' + id;
          warningMessage(commonErrors, innerErr);
          return resolve(false);
        }
      });
    } catch (err) {
      commonErrors['errorTitle'] = 'revertIssue';
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + err.toString() + '-bexio param,' + id;
      warningMessage(commonErrors, err);
      return resolve(false);
    }
  });
}

export const contactListMapping = (contactList: any) => {
  return contactList.map((contact) => ({
    id: contact.id,
    name: (contact.name_1 ? contact.name_1 : '') + ' ' + (contact.name_2 ? contact.name_2 : '')
  }))
}