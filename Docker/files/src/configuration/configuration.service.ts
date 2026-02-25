import { Injectable } from '@nestjs/common';
import { PrismaClientsService } from '../db/prisma-clients.service';
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
const fs = require('fs')
import connectMssql from '../db/mssql-client'
import status_code from '../common/utils/statusCodes';
const crypto = require("crypto");
import { resolve } from 'path';
// const fetchEmailContent = require('../common/utils/fetchEmailData');
import fetchEmailContent from "../common/utils/fetchEmailData";
const sendEmail = require('../common/utils/email');
import { setEbillRole, partyServiceUpdate, getUnitList, getActiveAccounts, getActiveArticle, getActiveSalesTaxBexio, getActiveItem, getBcDetails, getCountryLists, getContact, getContactDetails, contactListMapping } from 'src/common/utils/helperfn';
import { searchContact } from 'src/contact-import/contact-import.service';
import { ContactListTypes } from 'src/common/utils/types';

const { connectBexio, connectLibrary, connectGate2b, connectNewGate2b } =
  PrismaClientsService.getClients();
@Injectable()
export class ConfigurationService {
  async setConfiguration(req: Request, res: Response,): Promise<any> {

    try {
      let data = req.body
      let responseData = null

      let fomdata = {
        name: data.netcom_id,
        config: data.config,
        status: 1,
        module: 'BEX'
      }
      var options = {
        'method': 'POST',
        'url': `${config.OCTOPUS_URL}/create_config`,
        formData: fomdata
      };

      console.log('setConfiguration options', options);

      return new Promise(function (resolve, reject) {
        request(options, async function (error, response, body) {

          if (error) {
            commonErrors['errorTitle'] = 'setConfiguration';
            commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString();
            warningMessage(commonErrors, error);
            return resolve(error)
          }
          else {
            try {

              console.log('setConfiguration response.body', response.body);
              responseData = JSON.parse(response.body)


              res.send({
                status: 200,
                data: responseData,

              })
            }
            catch (error) {
              // return resolve(responseData)
              return res.send({
                status: 500,
                message: "Something went wrong in SetConfiguration function",
                error: error.toString()
              })
            }
          }
        })

      });

    }
    catch (error) {
      commonErrors['errorTitle'] = 'setConfiguration';
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString();
      warningMessage(commonErrors, error);

    }
  }
  async updateConfiguration(req: Request, res: Response,): Promise<any> {

    try {
      let data = req.body
      let responseData = null
      //console.log.log('data.confi',data.config);

      let fomdata = {
        name: data.netcom_id,
        config: data.config,
        status: 1,
        module: 'BEX'
      }

      var options = {
        'method': 'PUT',
        'url': `${config.OCTOPUS_URL}/update_config/${data.config_id}`,
        //   'headers': {
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json'
        //   },
        formData: fomdata
      };

      //console.log.log('options',options);

      return new Promise(function (resolve, reject) {
        request(options, async function (error, response, body) {

          if (error) {
            commonErrors['errorTitle'] = 'UpdateConfiguration';
            commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString();
            warningMessage(commonErrors, error);
            return resolve(error)
          }
          else {
            try {

              // console.log("UpdateConfiguration:",response.body);
              responseData = JSON.parse(response.body)


              res.send({
                status: 200,
                data: responseData,

              })
            }
            catch {
              // return resolve(responseData)
              return res.send({
                status: 500,
                message: "Something went wrong in Update Configuration function",
                error: error.toString()
              })
            }
          }
        })

      });

    }
    catch (error) {
      commonErrors['errorTitle'] = 'UpdateConfiguration';
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString();
      warningMessage(commonErrors, error);

    }
  }
  async getConfiguration(req: Request, res: Response,): Promise<any> {

    try {
      let data = req.body
      let responseData = null

      let formdata = {
        module: 'BEX',
        exact_name: data.netcom_id
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
            return resolve(error)
          }
          else {
            try {

              //console.log.log(response.body);
              responseData = JSON.parse(response.body)


              res.send({
                status: 200,
                data: responseData,

              })
            }
            catch (error) {
              // return resolve(responseData)

              return res.send({
                status: 500,
                message: "Something went wrong in Get Configuration function",
                error: error.toString()
              })
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
  async getediConfig(req: Request, res: Response,): Promise<any> {

    try {
      return res.status(status_code.OK).json({
        status_code: 200,
        message: 'common_sucess',
        status: true,
        data: JSON.parse(config.BEXIO_DOCTYPES),
      });
    } catch (error) {

      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'BEXIO_DOC_TYPE -req param,', JSON.stringify(req.body);
      warningMessage(commonErrors, 'BEXIO_DOC_TYPE');
      return res.status(status_code.INTERNAL_SERVER_ERROR).json({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
      });
    }
  }
  async getContactList(req: Request, res: Response,): Promise<any> {

    const data = req.body;

    try {

      // console.log('***********************',data);

      let docType = data.docType || 'Invoice';
      let direction = data.direction || 'Receive';
      let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));

      let dataCookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.cookies[config.EXPIRE_EXPIRES_COOKIE_NAME])));
      // console.log('***********************',dataCookie);

      let accessToken = cookie.access_Token;
      let isBexioUser = cookie.isBexioUser;
      const partyAccountCheckRaw = await connectBexio.contact_bc.findMany({
        where: {
          type: 'EDI',
          OR: [
            { rk_netcomidsender: dataCookie.netcomId },
            { rk_netcomidreceived: dataCookie.netcomId }
          ]
        },
        select: {
          cid: true,
          rk_netcomidsender: true,
          rk_netcomidreceived: true,
          rk_contact: true,
          receiver_customerid: true,
          status: true,
          rk_businessconnection: true,
          rk_sendercontactid: true,
          rk_receivercontactid: true,
        }
      });

      let beStruct = {}
      const partyAccountCheck = partyAccountCheckRaw.map(item => ({
        ...item,
        rk_sendercontactid: Number(item.rk_sendercontactid),
        rk_receivercontactid: Number(item.rk_receivercontactid)
      }));

      // console.log('*******************', partyAccountCheck);
      const getInviteCompanyBcResult = await connectBexio.contact_bc.findMany({
        where: {
          type: 'EDI',
          rk_businessconnection: {
            not: null
          },
          OR: [
            { rk_netcomidsender: dataCookie.netcomId },
            { rk_netcomidreceived: dataCookie.netcomId }
          ]
        },
        select: {
          rk_businessconnection: true
        }
      });
      const businessConnectionIds = getInviteCompanyBcResult
        .map(item => item.rk_businessconnection)
        .filter(id => id !== null);


      let resultBc: any = [];
      if (businessConnectionIds != null && businessConnectionIds.length > 0) {
        //console.log('businessConnectionIds', businessConnectionIds);
        let bcResult: any = await getBcDetails(businessConnectionIds, dataCookie.netcomId);
        //console.log('bcResult', bcResult);

        resultBc = bcResult['data'];
      }


      resultBc.forEach(async element => {
        beStruct[element.bc_id] = element;
      });

      let totalCount;
      if (isBexioUser) {

        let showFrom = req.body.records_per_page * (req.body.page_number - 1);
        let showTo = req.body.records_per_page;

        let resData;
        let countryList = {};
        resData = await getCountryLists(accessToken);
        //console.log('***********************resData',resData);

        if (!resData) {
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'countryList_not_found -req param,', JSON.stringify(req.body);
          warningMessage(commonErrors, 'countryList_not_found');
          return res.status(status_code.INTERNAL_SERVER_ERROR).json({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,

          });

        }
        if (resData == 401) {
          return res.status(401).json({
            status: true,
            data: [],
            message: "unauthorized",
          });
        }
        resData = JSON.parse(resData);
        resData['message'] != 'Unauthorized' ? resData.forEach((country) => {
          countryList[country.id] = country.name
        }) : '';
        let options;

        if (data['username'] != '' || data['email'] != '' || data['surname'] != '' || data['contact_type_id'] != '') {
          let searchJson: any[] = [];

          if (data['username'] != '' && data['username']) {
            searchJson.push({
              "field": "name_1",
              "value": data['username'],
              "criteria": "like"
            })
          }

          if (data['email'] != '' && data['email']) {
            searchJson.push({
              "field": "mail",
              "value": data.email,
              "criteria": "like"
            })
          }
          if (data['surname'] != '' && data['surname']) {
            searchJson.push({
              "field": "name_2",
              "value": data.surname,
              "criteria": "like"
            })
          }
          if (data['contact_type_id'] != "" && data['contact_type_id']) {
            searchJson.push({
              "field": "contact_type_id",
              "value": data.contact_type_id,
              "criteria": "equal"
            })
          }
          options = {
            'method': 'POST',
            'url': `${config.BEXIO_API}${data.api}/search/?limit=${showTo}&offset=${showFrom}&order_by=updated_at_desc`,

            'headers': {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + accessToken
            },
            body: JSON.stringify(searchJson)
          };

          totalCount = await contactListCountSearch(accessToken, searchJson, 0, 2000)
        } else {
          totalCount = await contactListCount(accessToken, 0, 2000);

          options = {
            'method': 'GET',
            'url': `${config.BEXIO_API}${data.api}/?limit=${showTo}&offset=${showFrom}&order_by=updated_at_desc`,

            'headers': {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + accessToken
            }
          }
        }
        request(options, async function (error, response) {
          if (error) {
            ////console.log.log('eror');
            commonErrors['errorTitle'] = req.originalUrl;
            commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + '-bexio param,' + showTo + ' ' + showFrom;
            warningMessage(commonErrors, error);
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({
              status: false,
              message: [response],

            });
          }

          if (response.statusCode != 200)
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({
              status: false,
              message: [response],

            });

          let resData = response.body.length != 0 && response.statusCode == '200' ? JSON.parse(response.body) : '';
          let senderStatus = '';
          let receiverStatus = '';


          for (let contactIndex in resData) {
            resData[contactIndex]['country'] = countryList[resData[contactIndex]['country_id']] ? countryList[resData[contactIndex]['country_id']] : '';
            //console.log('resData[contactIndex]', resData[contactIndex]['country']);
            //console.log('partyAccountCheck', partyAccountCheck);
            //console.log('partyAccountChecklength', partyAccountCheck.length);
            if (partyAccountCheck.length != 0) {


              for (let partyAccountIndex in partyAccountCheck) {
                if (direction == 'send') {

                  if ('bcActive' in resData[contactIndex]) {

                  } else {
                    resData[contactIndex]['bcActive'] = [];
                  }

                  if (partyAccountCheck[partyAccountIndex]['rk_netcomidsender'] == dataCookie.netcomId) {

                    if (partyAccountCheck[partyAccountIndex].rk_sendercontactid == resData[contactIndex].id) {
                      let tempIndex = partyAccountCheck[partyAccountIndex].rk_businessconnection
                      let tempBc = beStruct[tempIndex ? tempIndex : ''];
                      if (tempBc) {
                        if (docType == tempBc['company_details']['doc_type']['data']) {
                          resData[contactIndex]['bcActive'].push(beStruct[tempIndex ? tempIndex : '']);
                          resData[contactIndex]['bcDetailsSend'] = beStruct[tempIndex ? tempIndex : ''];

                        }
                      }

                    }
                  }
                }
                if (direction == 'receive') {
                  if ('bcActive' in resData[contactIndex]) {
                  } else {
                    resData[contactIndex]['bcActive'] = [];
                  }
                  if (partyAccountCheck[partyAccountIndex]['rk_netcomidreceived'] == dataCookie.netcomId) {
                    if (partyAccountCheck[partyAccountIndex].rk_receivercontactid == resData[contactIndex].id) {
                      let tempIndex = partyAccountCheck[partyAccountIndex].rk_businessconnection
                      let tempBc = beStruct[tempIndex ? tempIndex : ''];

                      if (tempBc) {
                        if (docType == tempBc['company_details']['doc_type']['data']) {

                          resData[contactIndex]['bcActive'].push(beStruct[tempIndex ? tempIndex : '']);
                        }
                      }
                    }
                  }
                }
              }
            } else {
              resData[contactIndex]['bcActive'] = [];
            }
          }
          let keys = Object.keys(req.body)
          let redisKey = req.body.partyId + "_" + req.url + "_";
          keys.forEach(element => {
            redisKey = req.body[element] ? redisKey + element + ':' + req.body[element] + '_' : redisKey
          });
          await redisClient.set(redisKey, JSON.stringify({
            status: 200,
            data: resData,
            totalCount: totalCount
          }), {
            EX: 24 * 60 * 60 * 2
          });
          res.send({
            status: 200,
            data: resData,
            totalCount: totalCount
          })
        });
      }
      else {
        return res.status(401).json({
          status: 'fail',
          message: 'unauthorized',
        });
      }

    } catch (error) {

      ////console.log.log('*****',error);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,', req.body;
      warningMessage(commonErrors, error);

      return res.status(status_code.INTERNAL_SERVER_ERROR).json({

        status_code: 500,
        message: JSON.stringify(error),
        status: false,
      })
    }
  }
  async getPayementComments(req: Request, res: Response,): Promise<any> {
    let encrToken = req.body;
    try {
      console.log('getPayementComments starts.......');
      const getStatusQryRslt: any = await connectBexio.companyregistered.findMany({
        where: {
          rk_party: Number(encrToken.partyId), // Ensure rk_party is a unique field or indexed
        },
        select: {
          settings: true, // Fetch only the settings JSON field
        },
      });

      console.log('getStatusQryRslt : ', getStatusQryRslt);
      // Ensure settings is treated as an object
      const settings = getStatusQryRslt[0]?.settings;
      console.log('getStatusQryRslt', settings);
      return res.status(status_code.OK).json({
        status_code: 200,
        data: {
          notifyPayment: settings?.notifyPayment ?? "false",
          notifyComments: settings?.notifyComments ?? "false",
        },
        status: true,
      });

    } catch (error) {
      ////console.log.log('error', error);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + encrToken;
      warningMessage(commonErrors, error);
      return res.status(status_code.INTERNAL_SERVER_ERROR).json({
        status_code: 500,
        status: false,
      });

    }

  }
  async changePayementComments(req: Request, res: Response): Promise<any> {
    const encrToken = req.body;

    try {
      // Fetch settings for the given party ID
      const getStatusQryRslt: any = await connectBexio.companyregistered.findMany({
        where: { rk_party: Number(encrToken.partyId) },
        select: { settings: true },
      });

      const existingSettingsRaw = getStatusQryRslt[0]?.settings;

      // Keep incoming values as strings "true"/"false" (or undefined if not provided)
      const payValRaw = encrToken.payementStatus;
      const commentValRaw = encrToken.commentStatus;
      const payVal = payValRaw === 'true' ? 'true' : payValRaw === 'false' ? 'false' : undefined;
      const commentVal = commentValRaw === 'true' ? 'true' : commentValRaw === 'false' ? 'false' : undefined;
      const partyIdNum = Number(encrToken.partyId);

      // Ensure we have an object to merge updates into
      let settingsObj: any = {};
      try {
        if (existingSettingsRaw == null) {
          settingsObj = {};
        } else if (typeof existingSettingsRaw === 'string') {
          settingsObj = existingSettingsRaw ? JSON.parse(existingSettingsRaw) : {};
        } else if (typeof existingSettingsRaw === 'object') {
          settingsObj = { ...existingSettingsRaw };
        } else {
          settingsObj = {};
        }
      } catch (parseErr) {
        settingsObj = {};
      }

      // Apply only provided updates (store as strings)
      let shouldUpdate = false;
      if (payVal !== undefined) {
        settingsObj.notifyPayment = payVal;
        shouldUpdate = true;
      }
      if (commentVal !== undefined) {
        settingsObj.notifyComments = commentVal;
        shouldUpdate = true;
      }

      if (shouldUpdate) {
        // Normalize existing values to string form as well to ensure stored values are strings
        if ('notifyPayment' in settingsObj) {
          settingsObj.notifyPayment = String(settingsObj.notifyPayment);
        }
        if ('notifyComments' in settingsObj) {
          settingsObj.notifyComments = String(settingsObj.notifyComments);
        }

        await connectBexio.$executeRaw`
          UPDATE companyregistered
          SET settings = ${JSON.stringify(settingsObj)}::jsonb
          WHERE rk_party = ${partyIdNum}
        `;
      }

      res.send({
        status_code: 200,
        status: true,
      });
    } catch (error) {
      console.log('error', error);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + encrToken;
      warningMessage(commonErrors, error);
      res.send({
        status_code: 500,
        status: false,
      });
    }
  }
  async getBillerDetails(req: Request, res: Response,): Promise<any> {
    let encrToken
    try {
      const pool = await connectMssql;
      encrToken = encryptionControl.decrypt(req.body.encrToken);
      console.log('encrToken', encrToken);

      // if (!encrToken || !('accId' in encrToken) || !('partyId' in encrToken)) {


      //   const getUserPermissionsResult = await connectLibrary.$queryRaw<any>`
      //     SELECT po.policy, par.cid 
      //     FROM partyapplication_account_role par
      //     INNER JOIN partyapplication_account pa ON par.fk_partyapplication_account = pa.cid
      //     INNER JOIN partyapplication p ON p.cid = pa.fk_partyapplication 
      //     INNER JOIN role_policy rp ON rp.fk_role = par.fk_role 
      //     INNER JOIN policy po ON po.cid = rp.fk_policy
      //     INNER JOIN role r ON r.cid = rp.fk_role 
      //     WHERE fk_account = ${BigInt(encrToken.roleAccId)}
      //     AND p.fk_party = ${BigInt(encrToken.rolePartyId)}
      //     AND r.name LIKE '%EBILL%'
      // `;
      //   console.log('getUserPermissionsResult', getUserPermissionsResult, encrToken.roleAccId, encrToken.rolePartyId);

      //   if (getUserPermissionsResult.length == 0) {
      //     return res.status(status_code.INTERNAL_SERVER_ERROR).json({
      //       status_code: 200,
      //       message: 'no_data_found_getUserPermissionsResult',
      //       status: false,
      //     });
      //   }
      // }

      const netcomId = encrToken?.netcomId;

      const getBasicDetails = `SELECT
        eb.legalname,
        eb.legalname as legalName,
        eb.status,
        eb.defaultlanguage,
        eb.subscriptionstatus,
        eb.billerid,
        eb.companyJSON,
        eb.statusChangeOn,
        eb.created,
        eb.lastupdate
      FROM
      biller eb
      WHERE
        netcomid = '${netcomId}'`;

      console.log('getBasicDetails', getBasicDetails);

      const getData = await pool.query(getBasicDetails);
      console.log('getData', getData.recordset.length);

      if (getData.recordset.length) {
        if (getData.recordset[0].companyJSON) {
          let jsonExtract = JSON.parse(getData.recordset[0].companyJSON)
          getData.recordset[0]['enterpriseIdentificationNumber'] = jsonExtract.enterpriseIdentificationNumber
        }
        let pythonData = await getPythonData(netcomId);
        console.log('pythonData', pythonData);

        let connectionData: any = null
        if (pythonData != null && pythonData["count"] != 0) {
          getData.recordset[0]["fk_doc_type"] = pythonData["results"][0].fk_doc_type.id.toString()
          getData.recordset[0]["fk_doc_format"] = pythonData["results"][0].fk_doc_format.id.toString()
          getData.recordset[0]["fk_netcomid_doc_interface"] = pythonData["results"][0].fk_netcomid_doc_interface.id.toString()
          getData.recordset[0]["include_pdf"] = pythonData["results"][0].include_pdf
          connectionData = {
            "name": pythonData["results"][0].name,
            "direction": pythonData["results"][0].direction.id,
            "fk_doc_type": pythonData["results"][0].fk_doc_type.id,
            "fk_doc_format": pythonData["results"][0].fk_doc_format.id,
            "fk_netcomid_doc_interface": pythonData["results"][0].fk_netcomid_doc_interface.id,
            "fk_encoding_details": pythonData["results"][0].fk_encoding_details.id,
            "fk_culture": pythonData["results"][0].fk_culture.id,
            "include_pdf": pythonData["results"][0].include_pdf,
            "allow_duplicate": pythonData["results"][0].allow_duplicate,
            "file_export_filename": pythonData["results"][0].file_export_filename,
            "create-pdf": pythonData["results"][0].config.service["create-pdf"]["create-pdf"],
            "create-signed-doc": pythonData["results"][0].config.service["create-signed-doc"]["create-signed-doc"],
            "export-doc-ref": pythonData["results"][0].config.service["export-doc-ref"]["export-doc-ref"],
            "validate-sign": pythonData["results"][0].config.service["validate-sign"]["validate-sign"],
            "netcom_id": pythonData["results"][0].netcom_id,
            "con_id": pythonData["results"][0].id,
            "process_name": pythonData["results"][0].fk_process_name,
            "ebill": "true",
            "signed-document": pythonData["results"][0].config.service["create-signed-doc"]["signed-document"],
            "signed-file-name": pythonData["results"][0].config.service["create-signed-doc"]["signed-file-name"],
            "attach-validation-report": pythonData["results"][0].config.service["create-signed-doc"]["attach-validation-report"],
            "export-validation-report": pythonData["results"][0].config.service["create-signed-doc"]["export-validation-report"],
            "validation-file-name": pythonData["results"][0].config.service["create-signed-doc"]["validation-file-name"]
          }
        }
        else {
          getData.recordset["fk_doc_type"] = ''
          getData.recordset["fk_doc_format"] = ''
          getData.recordset["fk_netcomid_doc_interface"] = ''
          getData.recordset["include_pdf"] = ''
        }
        console.log('getdata', getData);

        return res.status(status_code.OK).json({
          data: getData.recordset,
          pythonData: connectionData,
          status_code: 200,
          message: 'basic_informations',
          status: true,
        });
      }
      else {
        return res.status(status_code.INTERNAL_SERVER_ERROR).json({
          status_code: 200,
          message: 'no_data_found_getBasicDetails',
          status: false,
        });
      }

    }
    catch (error) {
      console.log("Error:: ", error)
      let responseValue = JSON.stringify(encrToken)
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + responseValue;
      warningMessage(commonErrors, error);
      return res.status(status_code.INTERNAL_SERVER_ERROR).json({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
      });
    }
  }
  async getInvitionCodeDetails(req: Request, res: Response,): Promise<any> {

    let data = req.body;
    let code = '';
    try {
      //console.log('data', data);

      if (data.code == 'undefined' || data.code == '' || data.code == null) {
        code = '';
      } else {
        code = data.code.toString();
      }

      return new Promise(async (resolve, reject) => {

        let formData = {
          invite_code: code,
          invited_netcom_id: data.netcom_id,
          doc_type: data.doc_type ? data.doc_type : '1',
          direction: data.direction ? data.direction : 'send'
        }
        console.log('formData', formData);

        let options = {
          'method': 'POST',
          'url': config.GATE2BURL + 'invite-details',
          formData: formData
        };
        request(options, async function (error, response, body) {
          if (error) {
            commonErrors['errorTitle'] = 'getInvitionCodeDetails';
            warningMessage(commonErrors, error);
            return resolve(false)
          }
          //console.log('body', body);
          return res.status(status_code.OK).json({
            status_code: 200,
            message: 'common_sucess',
            status: true,
            data: JSON.parse(body)['data'],
          });
        });


      });
    }

    catch (error) {

      //console.log(error);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + JSON.stringify(req.body);
      warningMessage(commonErrors, error);
      return res.status(status_code.INTERNAL_SERVER_ERROR).json({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
      });

    }

  }
  async inviteCompany(req: Request, res: Response,): Promise<any> {

    let cookie = null
    const data = req.body;

    try {
      let cookieData = req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME];

      if (!cookieData) {
        return res.status(status_code.INTERNAL_SERVER_ERROR).json({
          status_code: 500,
          message: 'Missing_cookie',
          status: false,
        })
      }

      let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(cookieData)));
      let accessToken = cookie.access_Token;
      let senderNr: any = await getContactDetails(accessToken, data.contactsId);
      if (senderNr.message == 'Unauthorized') {
        return res.status(401).send({
          message: senderNr.message,
          status: false,
        })
      }
      if (!senderNr) {
        commonErrors['errorTitle'] = 'inviteCompany';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'contact_not_found - req param,', req.body;
        warningMessage(commonErrors, 'contact_not_found');
        return res.status(status_code.INTERNAL_SERVER_ERROR).json({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,

        });

      }

      if (senderNr['id']) {

        let inviteSendStatus = false;

        const getPartyAccountId = await connectLibrary.$queryRaw<any[]>`
                SELECT pa.cid, p.objectid, lp.companyname
                FROM party_account pa
                INNER JOIN party p ON pa.fk_party = p.cid 
                INNER JOIN legalparty lp ON lp.fk_party = p.cid 
                INNER JOIN status s ON s.cid = pa.fk_status 
                WHERE pa.fk_account = ${BigInt(data.accountId)}
                  AND pa.fk_party = ${BigInt(data.partyId)}
                  AND s."statusLabel" = 'active'
              `;

        //console.log('getPartyAccountId', getPartyAccountId);

        const netComId = await connectGate2b.$queryRaw<any[]>`
              SELECT netcomid
              FROM ediparty
              WHERE rk_party = ${getPartyAccountId[0].objectid}::UUID
            `;

        //console.log('***8', netComId[0].netcomid);
        // console.log('senderNr',netComId);
        const getCompanyCodeResult = await connectBexio.companyregistered.findMany({
          where: {
            rk_party: Number(data.partyId),
          }
        });
        //console.log("getCompanyCodeResult.rows ", getCompanyCodeResult);


        const partyAccountCheck = await connectBexio.$queryRaw<any[]>`
                  SELECT * FROM contact_bc
                  WHERE fk_companyregistered = ${getCompanyCodeResult[0].cid}
                  AND rk_sendercontactid = ${BigInt(data.contactsId)}
                  AND type = 'EDI'
                `;

        //console.log("partyAccountCheck ", partyAccountCheck);
        let tempElement;
        for (let index = 0; index < partyAccountCheck.length; index++) {
          const element = partyAccountCheck[index];
          //console.log(getCompanyCodeResult[0].netcomid);
          //console.log(element.invite_code);
          if (element.invite_code) {
            let invitionDetails = await getInvitationDetails(element.invite_code);
            //console.log('invitionDetails', invitionDetails);

            if (invitionDetails?.results?.length && invitionDetails.results[0]?.fk_doc_type?.data === data?.docType) {
              tempElement = element;
              break;
            }
          }
        }
        //console.log('tempElement', tempElement);

        if (tempElement) {
          //console.log('tempElement[', tempElement['rk_businessconnection']);

          if (tempElement['rk_businessconnection'] != null) {

            inviteSendStatus = true;
          } else {

            inviteSendStatus = false;
            await connectNewGate2b.$executeRaw`
                    DELETE FROM invitations WHERE invite_code = ${tempElement.invitecode}`;

            await connectBexio.contact_bc.deleteMany({
              where: {
                cid: tempElement.cid,
                type: 'EDI'
              }
            });


          }
        } else {
          inviteSendStatus = false;

        }
        //console.log('inviteSendStatus', inviteSendStatus);

        if (!inviteSendStatus) {

          const invitationId = await connectBexio.contact_bc.create({
            data: {
              rk_party_account: getPartyAccountId[0].cid,
              rk_netcomidsender: netComId[0].netcomid,
              receiver_email: data.email,
              sendercustomerid: "1",
              rk_sendercontactid: data.contactsId,
              fk_companyregistered: getCompanyCodeResult[0].cid,
              receiver_customerid: String(senderNr['id']),
              type: 'EDI'
            },
            select: {
              cid: true
            }
          });
          //console.log('invitationId', invitationId);
          //console.log(invitationId);
          let idToPython = encodeURIComponent(encryptionControl.encrypt('bexioUser')) + '/' + encodeURIComponent(encryptionControl.encrypt(invitationId.cid.toString()));

          let doc_type = data.docType ? data.docType : 'Invoice';
          let direction = data.direction ? data.direction.toUpperCase() == 'SEND' ? 'IN' : 'OUT' : 'IN';
          // Build the invite config JSON directly instead of using .replace
          const parms = {
            config: {
              mode: "LIVE",
              payee_details: {
                company_payee: "self",
                partner_company_payee: ""
              },
              user_email: data.email,
              invited_company_name: data.invitedcompanyname,
              partner_netcomid: "",
              netcom_id: netComId[0].netcomid,
              name: getPartyAccountId[0].companyname,
              direction: direction,
              fk_doc_type: doc_type,
              fk_doc_format: "OpenTrans2.1",
              fk_netcomid_doc_interface: "WS",
              status: "1",
              fk_step_encoding: "utf-8",
              fk_culture: "en-us",
              "create-pdf": "0",
              "create-signed-doc": "0",
              "export-doc-ref": "0",
              "validate-sign": "0",
              language: "EN",
              ot_updator: {
                in_cust_id: "1",
                out_cust_id: senderNr['id'],
                in_customer_id: "",
                out_customer_id: "",
                bex_version: "ver1"
              },
              partner_email: data.email,
              third_party: "BEX",
              bexio_invite_id: idToPython,
              field_status: {
                data: [
                  {
                    business_connection_connectionStatus: { in: true, out: false, label: "business_connection_connectionStatus" },
                    business_connection_invitation_sent_received: { in: true, out: false, label: "business_connection_invitation_sent_received" },
                    business_connection_connection_active: { in: true, out: false, label: "business_connection_connection_active" },
                    business_connection_format_check: { in: false, out: false, label: "business_connection_format_check" },
                    business_connection_running_mode_test: { in: false, out: false, label: "business_connection_running_mode_test" },
                    business_connection_running_mode_live: { in: false, out: false, label: "business_connection_running_mode_live" }
                  }
                ]
              },
              inviter_netcom_id: data.inviterNetcomId,
              inviter_company_name: data.inviterCompanyName
            }
          };
          console.log('url', parms);
          let inviteStatus;
          if (doc_type != 'Invoice') {
            console.log('.......................');

            let params = { 'direction': data.direction.toUpperCase(), 'netcomId': netComId[0].netcomid, 'name': getPartyAccountId[0].companyname, 'doc_type': doc_type };
            console.log('params', params);

            await createConnector(params);
          }
          inviteStatus = await inviteCompanySend(JSON.stringify(parms));
          console.log('inviteStatus', inviteStatus);

          if (JSON.parse(inviteStatus).status) {
            let redisKey = req.body.partyId + "_/";
            await deleteRedis('inviteCompany', redisKey);

            await connectBexio.contact_bc.update({
              where: {
                cid: invitationId.cid
              },
              data: {
                invite_code: JSON.parse(inviteStatus).invite_code
              }
            });
            return res.status(status_code.OK).json({
              status_code: 200,
              message: 'success',
              status: true,
            });

          } else {

            commonErrors['errorTitle'] = 'inviteCompany';
            commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'send-invitation_failed - req param,', req.body;
            warningMessage(commonErrors, 'send-invitation_failed');

            return res
              .status(200)
              .json({
                status_code: 500,
                message: 'something_went_wrong',
                status: false
              });
          }
        } else {
          commonErrors['errorTitle'] = 'inviteCompany';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'error_in_inviteSendStatus - req param,', req.body;
          warningMessage(commonErrors, 'error_in_inviteSendStatus');
          return res
            .status(500)
            .json({
              status_code: 500,
              message: 'something_went_wrong',
              status: false
            });
        }


      } else {

        return res
          .status(200)
          .json({
            status_code: 500,
            message: 'already_invited',
            status: false
          });
      }


    } catch (error) {
      console.log(error);

      // commonErrors['errorTitle'] = req.originalUrl;
      // commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+cookie;
      // warningMessage(commonErrors,error);
      return res
        .status(200)
        .json({
          status_code: 500,
          message: 'something_went_wrong',
          status: false
        });
    }
  }
  async getBiller(req: Request, res: Response,): Promise<any> {
    let encrToken: any = null;
    encrToken = encryptionControl.decrypt(req.body.encrToken);
    console.log('encrToken', encrToken);
    console.log('req.body', req.body);

    try {
      const resetToken = crypto.randomBytes(15).toString('hex');
      const billerId = encrToken.billerId
      console.log("billerId:", billerId);

      const options = {
        method: 'GET',
        url: config.SIX_API_CERTIFICATE_BASE + `billers/${billerId}`,
        headers: {
          'x-networkpartner-id': config.NETWORK_PARTNER_ID,
          'X-Correlation-Id': resetToken,
        },
        key: fs.readFileSync(config.CERTIFICATE_PATH + config.SIX_API_KEY),
        cert: fs.readFileSync(config.CERTIFICATE_PATH + config.SIX_API_CERTIFICATE)
      };
      await request(options, async function (error, response) {
        if (error) {
          let responseValue = JSON.stringify(encrToken)
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param six,' + responseValue;
          warningMessage(commonErrors, error);

          return res.status(status_code.INTERNAL_SERVER_ERROR).json({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
          });
        }
        else {
          if (response.body) {
            return res.status(status_code.OK).json({
              data: JSON.parse(response.body),
              status_code: 200,
              message: 'get_biller_data',
              status: true,
            });
          }
          else {
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({
              data: 'some error in getbiller',
              status_code: 500,
              message: 'something_went_wrong',
              status: false,
            });
          }
        }
      })
    }
    catch (error) {
      let responseValue = JSON.stringify(encrToken)
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + responseValue;
      warningMessage(commonErrors, error);
      return res.status(status_code.INTERNAL_SERVER_ERROR).json({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
      });
    }
  }
  async getSectors(req: Request, res: Response,): Promise<any> {
    let accessToken
    // const data = req.body;
    try {
      const resetToken = crypto.randomBytes(15).toString('hex');
      const options = {
        method: 'GET',
        url: config.SIX_API_CERTIFICATE_BASE + `sectors`,
        headers: {
          'x-networkpartner-id': config.NETWORK_PARTNER_ID,
          'X-Correlation-Id': resetToken,
        },
        key: fs.readFileSync(config.CERTIFICATE_PATH + config.SIX_API_KEY),
        cert: fs.readFileSync(config.CERTIFICATE_PATH + config.SIX_API_CERTIFICATE)
      };
      await request(options, async function (error, response) {
        if (error) {
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param sector,' + accessToken;
          warningMessage(commonErrors, error);
          return res.status(status_code.INTERNAL_SERVER_ERROR).json({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
          });
        }
        else {
          if (response.body) {
            console.log("response.body:", response.body);

            return res.status(status_code.OK).json({
              data: JSON.parse(response.body),
              status_code: 200,
              message: 'get_sectors',
              status: true,
            });
          }
          else {
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({
              data: 'some error in getsectors',
              status_code: 500,
              message: 'something_went_wrong',
              status: false,
            });
          }
        }
      })
    }
    catch (error) {
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + accessToken;
      warningMessage(commonErrors, error);
      return res.status(status_code.INTERNAL_SERVER_ERROR).json({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
      });
    }
  }
  async updateBiller(req: Request, res: Response,): Promise<any> {
    let encrToken: any = null;
    const bodyData = req.body;
    try {
      const pool = await connectMssql;


      const resetToken = crypto.randomBytes(15).toString('hex');
      encrToken = encryptionControl.decrypt(req.body.encrToken);
      let companyId = encrToken.companyId;
      console.log('********companyId', companyId);
      const billerData = encrToken.data
      let billerId = JSON.parse(billerData)
      console.log('encrToken', encrToken);
      console.log('billerId', billerId);

      const options = {
        method: 'PUT',
        url: config.SIX_API_CERTIFICATE_BASE + `billers/${billerId.id}`,
        headers: {
          'Content-Type': 'application/json',
          'x-networkpartner-id': config.NETWORK_PARTNER_ID,
          'X-Correlation-Id': resetToken,
        },
        body: billerData,
        key: fs.readFileSync(config.CERTIFICATE_PATH + config.SIX_API_KEY),
        cert: fs.readFileSync(config.CERTIFICATE_PATH + config.SIX_API_CERTIFICATE)
      };
      await request(options, async function (error, response) {
        // console.log('response', response);
        console.log('response.body', response.body);
        console.log('response.statusCode', response.statusCode);

        if (error) {
          return res.status(status_code.INTERNAL_SERVER_ERROR).json({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
          });
        }
        else {
          let data = JSON.parse(response.body);
          console.log("response.body:::::::", companyId);

          if (data.id) {
            const responseData = [
              data.status,
              data.legalName,
              data.accounts[0]['iid'],
              data.billRecipientSubscriptionStatus,
              data.localizedData['defaultLanguage'],
              data,
              data.id
            ]
            let jsonReq = JSON.stringify(data)
            const updateBillerData = `UPDATE biller
                                    SET lastupdate = getdate(),status='${data.status}',legalname='${data.legalName}',
                                    uid ='${data.accounts[0]['iid']}',subscriptionstatus='${data.billRecipientSubscriptionStatus}',defaultlanguage='${data.localizedData.defaultLanguage}'
                                    ,companyJSON = '${jsonReq}'
                                    WHERE billerid='${data.id}'`

            await pool.query(updateBillerData, responseData);
            const companyIdNumber = Number(companyId);
            const getPartyEbillResult = await connectLibrary.$queryRaw<any>`SELECT cid
              FROM "ebillWallet"
              WHERE fk_party = ${companyIdNumber}`;
            //console.log('getPartyEbillResult:::',getPartyEbillResult);

            if (getPartyEbillResult.length <= 0) {
              await connectLibrary.$queryRaw<any>`INSERT INTO "ebillWallet" 
              (fk_party,"lastEntered","billerId") 
              VALUES (${companyIdNumber},date_trunc('month', now()::timestamp) + interval '6 hour',${data.id})`
            }
            let updateconnection = await updateConnection(encrToken);
            const checkBexioCompanyResult = await connectBexio.companyregistered.findMany({
              where: {
                rk_party: Number(encrToken.partyId), // Make sure this is the correct type
              },
            });
            if (checkBexioCompanyResult.length > 0) {
              await createBexiobiller(checkBexioCompanyResult[0].netcomid);
            }
            return res.status(status_code.OK).json({
              status_code: 200,
              data: updateconnection,
              message: 'updated_biller_successfully',
              status: true,
            });
          }
          else {
            let responseValue = JSON.stringify(encrToken);
            commonErrors['errorTitle'] = req.originalUrl;
            commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + JSON.stringify(data) + '-req param,' + responseValue;
            warningMessage(commonErrors, responseValue);
            var returnData = data.type.replace('/problems/', '');
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({
              status_code: 500,
              message: returnData.toLowerCase(),
              status: false,
            });
          }
        }
      })
    }
    catch (error) {
      let responseValue = JSON.stringify(encrToken)
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + responseValue;
      warningMessage(commonErrors, error);
      return res.status(status_code.INTERNAL_SERVER_ERROR).json({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
      });
    }
  }
  async checkContact(req: Request, res: Response,): Promise<any> {
    let cookieData = req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME];
    if (!cookieData) {
      return res.status(status_code.INTERNAL_SERVER_ERROR).json({
        status_code: 500,
        message: 'Missing_cookie',
        status: false,
      })
    }
    let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(cookieData)));
    try {
      let access_token = cookie.access_Token;

      let data = req.body.name.trim();
      console.log('access_tokenaccess_token', access_token);
      console.log('data', data);

      var options = {
        'method': 'POST',
        'url': `${config.BEXIO_API}2.0/contact/search`,
        'headers': {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + access_token
        },
        body: JSON.stringify([{
          "field": "name_1",
          "value": data,
          "criteria": "="
        }])
      }
      request(options, async function (error, response) {
        if (error) {
          commonErrors['errorTitle'] = 'getCountryLists';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + cookie;
          warningMessage(commonErrors, error);
          return res.status(200).json({
            status: false,
            message: '',
          }
          )
        }
        console.log('response.statusCode', response.statusCode);
        if (response.statusCode != 200) {
          return res.status(401).json({
            status: 'fail',
            message: 'unauthorized',
          }
          )
        } else {
          res.send({
            status_code: 200,
            data: JSON.parse(response.body).length,
            status: true,
          })
        }
      });
    } catch (error) {
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + cookie;
      warningMessage(commonErrors, error);
      res.send({
        status_code: 500,
        data: '',
        status: false,
      })
    }
  }
  async checkContactExist(req: Request, res: Response,): Promise<any> {
    let formData;
    try {
      let cookieData = req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME];
      if (!cookieData) {
        return res.status(status_code.INTERNAL_SERVER_ERROR).json({
          status_code: 500,
          message: 'Missing_cookie',
          status: false,
        })
      }
      let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(cookieData)));
      let accessToken = cookie.access_Token;
      formData = req.body;
      const contactData = await getContact(accessToken, formData.contact_id);
      console.log('contactData', contactData);

      if (!contactData) {
        res.send({
          status_code: 200,
          message: 'no contact',
          data: [],
          status: false,

        });
      }
      res.send({
        status_code: 200,
        data: contactData,
        message: 'contact found',
        status: true,
      });
    } catch (error) {
      console.log("tourList ", error);
      let responseValue = JSON.stringify(formData)
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + responseValue;
      warningMessage(commonErrors, error);
      return res.status(500).json({
        message: 'something_went_wrong',
        status: false
      });
    }
  }
  async createContact(req: Request, res: Response,): Promise<any> {
    let data = req.body;
    let cookieData = req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME];
    if (!cookieData) {
      return res.status(status_code.INTERNAL_SERVER_ERROR).json({
        status_code: 500,
        message: 'Missing_cookie',
        status: false,
      })
    }
    let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(cookieData)));
    try {
      let access_token = cookie.access_Token;
      let userId = jwt.decode(access_token)['company_user_id'];
      let coutryList;
      coutryList = await getCountryLists(access_token);
      if (!coutryList) {
        coutryList = '[]';
      }

      let countryId = JSON.parse(coutryList).filter(c => c.iso_3166_alpha2 == data.country_id);
      console.log(countryId);
      let tempName = '';
      if ('name_1' in data) {
        tempName = data.name_1;
      }
      if ('name' in data) {
        tempName = data.name;
      }
      var options = {
        'method': 'POST',
        'url': `${config.BEXIO_API}2.0/contact`,
        'headers': {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + access_token
        },
        body: JSON.stringify({

          "name_1": tempName,
          "name_2": (data.contact_type_id == 2 && data.name_2) ? data.name_2 : '',
          "contact_type_id": data.contact_type_id ? data.contact_type_id : '1',
          "postcode": data.postcode ? data.postcode : '',
          "city": data.city ? data.city : '',
          "country_id": countryId.length > 0 ? countryId[0].id : '',
          "mail": data.mail ? data.mail : '',
          "user_id": userId,
          "owner_id": userId
        })
      }

      request(options, function (error, response) {
        if (error) {
          console.log("error in create contact", error);

          commonErrors['errorTitle'] = 'bexio_contact';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + JSON.stringify(error) + '-bexio param' + access_token;
          warningMessage(commonErrors, error);

          return res.status(500).json({
            status: false,
            message: JSON.stringify(error) || "something_went_wrong",
          })
        }

        console.log("create contact response ", response);
        console.log("create contact response body", response.body);

        if (response.statusCode == 401) {
          return res.status(401).json({
            status: 'fail',
            message: 'unauthorized',
          });
        }

        if (response.statusCode != 201) {
          commonErrors['errorTitle'] = 'bexio_contact';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'bexio_contact_not_found -req param,' + JSON.stringify(req.body);
          warningMessage(commonErrors, 'bexio_contact_not_found');

          return res.status(500).json({
            status: false,
            message: 'something_went_wrong',
          })
        } else {

          res.send({
            status_code: 200,
            data: JSON.parse(response.body),
            status: true,
          })
        }

      });
    } catch (error) {
      console.log("create contact error", error);

      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + cookie;
      warningMessage(commonErrors, error);
      res.send({
        status_code: 500,
        data: '',
        status: false,
      })
    }
  }
  async createBusinessConnection(req: Request, res: Response,): Promise<any> {

    const data = req.body;
    try {
      let connectionData, invitationData;
      let inviteSenderDetails, direction, doc_type;
      console.log(data);
      invitationData = await getInvitations(data.code);
      if (invitationData == false) {
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'invitationData_not_found -req param,', JSON.stringify(req.body);
        warningMessage(commonErrors, 'invitationData_not_found');
        res.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
        return
      }
      direction = data.direction;
      doc_type = data.docType;

      const getPartyAccountId = await connectLibrary.$queryRaw<any[]>`
        SELECT pa.cid, p.objectid, lp.companyname
        FROM party_account pa
        INNER JOIN party p ON pa.fk_party = p.cid 
        INNER JOIN legalparty lp ON lp.fk_party = p.cid 
        INNER JOIN status s ON s.cid = pa.fk_status 
        WHERE pa.fk_account = ${BigInt(data.accountId)}
          AND pa.fk_party = ${BigInt(data.partyId)}
          AND s."statusLabel" = 'active'
      `;

      console.log('getPartyAccountId', getPartyAccountId);

      if (doc_type != 'Invoice') {
        let params = { 'direction': data.direction.toUpperCase(), 'netcomId': data.netcomId, 'name': getPartyAccountId[0].companyname, 'doc_type': doc_type };
        await createConnector(params);
      }
      let inviteData = JSON.parse(invitationData).results[0];

      console.log('invitationData', inviteData.mode);
      let statusJson
      statusJson = await getStatus(inviteData.id);
      console.log(statusJson);

      statusJson = JSON.parse(statusJson)

      let dataCookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.cookies[config.EXPIRE_EXPIRES_COOKIE_NAME])));
      connectionData = await getConnections(dataCookie.netcomId, doc_type);
      console.log('connectionData', connectionData);
      if (!connectionData) {
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'connectionData_not_found -req param,', JSON.stringify(req.body);
        warningMessage(commonErrors, 'connectionData_not_found');

        res.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
        return
      }
      inviteSenderDetails = JSON.parse(connectionData).results.length != 0 ? await getConnectionsDetailsOfInviteSender(data.code, data.netcomId) : '';
      if (!inviteSenderDetails) {
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'inviteSenderDetails_not_found -req param,', JSON.stringify(req.body);
        warningMessage(commonErrors, 'inviteSenderDetails_not_found');

        res.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
        return
      }
      console.log('inviteSenderDetails', inviteSenderDetails);
      if (JSON.parse(connectionData).results.length != 0 && JSON.parse(inviteSenderDetails).results[0].direction['id'] != 0) {
        let inviteData = JSON.parse(invitationData).results[0];
        console.log('in_custom_id', inviteData.g2b_connections_customerid['in_custom_id']);
        const getInviteNetcomId = await connectBexio.companyregistered.findMany({
          where: {
            netcomid: dataCookie.netcomId,
          },
          select: {
            cid: true,
          }
        });

        let tempConnectionDetails = JSON.parse(inviteSenderDetails);
        console.log('tempConnectionDetails', tempConnectionDetails);

        let tempPaye = { "company_payee": tempConnectionDetails.results[0].company_payee, "partner_company_payee": tempConnectionDetails.results[0].partner_company_payee, "company_direction": 0 };
        if (!tempConnectionDetails.results[0].company_payee) {
          tempPaye.company_payee = "self";
        }


        let formData = {
          out_id: JSON.parse(connectionData).results[0].id,
          out_cust_id: inviteData.g2b_connections_customerid['out_cust_id'],
          out_status: 1,
          in_id: inviteData.connection_id,
          in_cust_id: inviteData.g2b_connections_customerid['in_cust_id'],
          in_status: 1,
          merge_status: 1,
          invitation_id: inviteData.id,
          invitation_code: data.code,
          platform: JSON.stringify({ "type": "ext-party", "code": "BEX", "direction": "OUT" }),
          fk_companyregistered: getInviteNetcomId[0].cid,
          rk_contact: data.id,
          rk_partyreceived: data.partyId,
          ot_updator: JSON.stringify({ "in_custom_id": data.id, "out_custom_id": "1", "receiver_file_name": '' }),
          payee_details: JSON.stringify(tempPaye),
          mode: inviteData?.mode
        };
        console.log('inviteData', inviteData);
        console.log(formData);

        console.log('config.GATE2BURL', config.GATE2BURL + 'merge-connections');
        return new Promise(async (resolve, reject) => {
          var options = {
            'method': 'POST',
            'url': config.GATE2BURL + 'merge-connections',
            formData: formData

          };
          request(options, async function (error, response) {
            if (error) {
              commonErrors['errorTitle'] = 'merge-connections';
              commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + formData;
              warningMessage(commonErrors, error);

              res.send({
                status_code: 500,
                message: JSON.parse(response.body).message,
                status: false,
              });
              return
            }

            console.log(response.body);

            if (JSON.parse(response.body).status) {
              let redisKey = req.body.partyId + "_/";
              await deleteRedis('createBusinessConnection', redisKey);
              res.send({
                status_code: 200,
                message: 'common_success',
                status: true,
              });
            } else {
              res.send({
                status_code: 500,
                message: JSON.parse(response.body).message,
                status: false,
              });
            }

          });
        });
      } else {
        let msg = JSON.parse(inviteSenderDetails).results[0].direction['id'] == 0 ? 'sender_Error_msg' : '';
        res.send({
          status_code: 500,
          message: msg,
          status: false,
        });
      }
    } catch (error) {

      console.log(error);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + JSON.stringify(req.body);
      warningMessage(commonErrors, error);
      res.send({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
      });
    }
  }
  async createBiller(req: Request, res: Response,): Promise<any> {
    let encrToken;
    encrToken = encryptionControl.decrypt(req.body.encrToken);
    try {
      const pool = await connectMssql;
      // const postgresPool = await connectPostgres;
      // const ediParty = await connectGate2b;
      // const gate2BConnection = await gate2B;

      const correlationId = crypto.randomBytes(15).toString('hex');

      const options = {
        method: 'POST',
        url: config.SIX_API_CERTIFICATE_BASE + `billers`,
        headers: {
          'Content-Type': 'application/json',
          'x-networkpartner-id': config.NETWORK_PARTNER_ID,
          'X-Correlation-Id': correlationId,
        },
        body: encrToken.data,
        key: fs.readFileSync(config.CERTIFICATE_PATH + config.SIX_API_KEY),
        cert: fs.readFileSync(config.CERTIFICATE_PATH + config.SIX_API_CERTIFICATE)
      };
      await request(options, async function (error, response) {
        if (error) {
          console.log(error);
          return res.status(status_code.INTERNAL_SERVER_ERROR).json({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
          });
        }
        else {
          let data = JSON.parse(response.body);
          console.log('data', data);

          if (data.id) {
            let netcomId = encrToken.netcomId;
            let companyName = encrToken.companyName;
            let companyId = encrToken.companyId;
            let bexioCompanyName = null;
            const checkBexioCompanyResult = await connectBexio.companyregistered.findMany({
              where: {
                netcomid: netcomId
              },
              select: {
                cid: true
              }
            });

            console.log('checkBexioCompanyResult.rows', checkBexioCompanyResult);

            if (checkBexioCompanyResult.length != 0) {
              const getParentData = await connectGate2b.$queryRaw<any[]>`
                  SELECT rk_party  FROM network  WHERE name = ${config.BEXIO_CODE}`;
              console.log("getParentData:", getParentData);
              bexioCompanyName = getParentData[0]?.rk_party;
              console.log('bexioCompanyName', bexioCompanyName);
            }
            console.log('checkBexioCompanyResult.rows', checkBexioCompanyResult);
            let jsonReq = JSON.stringify(data);
            const getPartyEbillResult = await connectLibrary.$queryRaw<{ cid: number[] }[]>(
              Prisma.sql`
                  SELECT cid
                  FROM "ebillWallet"
                  WHERE fk_party =  ${Number(companyId)}
                  `
            );
            console.log('getPartyEbillResult.rows', getPartyEbillResult);
            console.log("req.body.partyIdLog:", req.body.partyIdLog);
            //    const userDetails = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
            //       SELECT 
            //         pa.isuser,
            //         pa.cid AS "partyAccountId",
            //         u.email,
            //         u.cid AS "userId",
            //         pa.fk_party AS "partyId",
            //         a.cid AS "accountId",
            //         u.language AS "userlanguage"
            //       FROM party_account pa
            //       INNER JOIN account a ON a.cid = pa.fk_account
            //       INNER JOIN public.user u ON u.cid = a.fk_user
            //       INNER JOIN status s ON s.cid = pa.fk_status
            //       WHERE pa.fk_party = ${parseInt(req.body.partyIdLog)}
            //         AND pa.fk_account = ${parseInt(req.body.accId)}
            //         AND s."statusLabel" = 'active'`);

            //     console.log('userDetails',userDetails);

            // const setebill =  await setEbillRole(userDetails[0].partyId, userDetails[0].accountId, userDetails[0].partyAccountId, userDetails[0].isuser, 'EBILL');
            const setPartyService = await partyServiceUpdate(req.body.partyIdLog, 'EBILL', 'EDI');
            console.log('setPartyService', setPartyService);
            // console.log('setebill',setebill);
            console.log('getPartyEbillResult.rows', getPartyEbillResult);
            if (getPartyEbillResult.length <= 0) {
              const partyEbill = await connectLibrary.$queryRaw<any>(
                Prisma.sql`
                INSERT INTO "ebillWallet" 
                  (fk_party, "lastEntered", "billerId") 
                VALUES (
                  ${Number(companyId)}, date_trunc('month', now()::timestamp) + interval '6 hour',${data.id}
                )
              `
              );

              console.log('partyEbill', partyEbill);
            }

            const checkDataIn = `SELECT b.id, b.netcomId FROM biller b WHERE b.netcomId ='${netcomId}'`;
            const checkDataInQry = await pool.query(checkDataIn);
            console.log('checkDataInQry', checkDataInQry);

            let updateDataQry;
            if (checkDataInQry.recordset.length > 0) {
              console.log('update');
              // Update the row
              const updateData = `UPDATE biller
                                SET biller.billerId = '${data.id}'
                                  ,status = '${data.status}'
                                  ,legalName = '${data.legalName.replace(/'/g, "''")}'
                                  ,uid = '${data.accounts[0].iid}'
                                  ,subscriptionStatus = '${data.billRecipientSubscriptionStatus}'
                                  ,defaultLanguage = '${data.localizedData.defaultLanguage}'
                                  ,companyJSON = '${jsonReq.replace(/'/g, "''")}'
                                  ,party_parent = ${bexioCompanyName}
                                  ,statusChangeOn = GETDATE()
                                  OUTPUT INSERTED.id 
                                WHERE netcomId = '${netcomId}' AND id = '${checkDataInQry.recordset[0].id}'`;
              console.log('update', updateData);
              updateDataQry = await pool.query(updateData);
              console.log('update');

            }
            else {
              console.log('Insert create');
              // Insert if no record is found with the netcomId.
              const addBiller = `INSERT INTO biller 
            (netcomid,billerId,status,legalName,uid,subscriptionStatus,defaultLanguage,companyJSON,party_parent,statusChangeOn) 
            OUTPUT INSERTED.id 
            VALUES('${netcomId}','${data.id}','${data.status}','${data.legalName.replace(/'/g, "''")}',${data.accounts[0].iid},'${data.billRecipientSubscriptionStatus}','${data.localizedData.defaultLanguage}','${jsonReq.replace(/'/g, "''")}',${bexioCompanyName},GETDATE())`;
              console.log('Insert create', addBiller);
              updateDataQry = await pool.query(addBiller);
              console.log('Insert create', updateDataQry);

            }
            let createdPythonResponse = await bexioCreatePythonData(netcomId, companyName, encrToken);
            console.log("createdPythonResponse---", createdPythonResponse, 'createdPythonResponse &&');
            if (checkBexioCompanyResult.length != 0) {
              await setConfig(updateDataQry.recordset[0].id)
              let updateBexio = await bexioUpdateBiller(req, data.id);
              console.log("updateBexio---", updateBexio);
              if (updateBexio != true) {
                let dataResponse = { "name": "io_market.ebill_pid", "value": `${data.id}` }
                commonErrors['errorTitle'] = req.originalUrl;
                commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + JSON.stringify(data) + '-bexioUpdateBiller params---' + dataResponse;
                console.log("commonErrors--", commonErrors);
                warningMessage(commonErrors, 'bexioUpdateBiller failed...');
              }
            }
            if (companyId != null) {

              await connectLibrary.$queryRaw<any>(
                Prisma.sql`
                     UPDATE commissionagent_party SET status = 'biller_created',"module" = 'EBILL' WHERE fk_party = ${Number(companyId)}
                      `
              );
            }
            const getCompanyDetails = await connectLibrary.$queryRaw<any>(
              Prisma.sql`
                    SELECT u."language",e.email,l.companyname  FROM party p 
                                    INNER JOIN email e ON e.fk_party = p.cid
                                    INNER JOIN "user" u ON e.fk_user = u.cid 
                                    INNER JOIN legalparty l ON l.fk_party  = p.cid  
                                    WHERE p.cid = ${Number(companyId)} AND e."_type" = 'company_contact'
                      `
            );
            let language = getCompanyDetails[0]?.language || 'de';
            let ComapnyEmail = getCompanyDetails[0]?.email;
            let companyname = getCompanyDetails[0]?.companyname;
            let keyDatas = {
              id: data.id,
              companyName: companyname
            }

            const mailData = await fetchEmailContent('biller_created_six', language, keyDatas);
            const message = mailData.message;
            const subject = mailData.subject;
            await sendEmail({
              email: config.DEBUG ? config.DEBUG_MAIL : ComapnyEmail,
              subject: subject,
              message,
            });

            console.log("CreateBiller ", message)
            await sendEmail({
              email: config.DEBUG ? config.DEBUG_MAIL : ComapnyEmail,
              subject: subject,
              message
            });

            return res.status(status_code.OK).json({
              status_code: 200,
              message: 'created_biller_successfully',
              status: true,
            });
          }
          else {

            // Insert into biller table if there is any issue in the biller creation at SIX.
            let formData = JSON.parse(encrToken.data);
            // Checks whether the netcomId is already present or not
            const checkDataExist = `SELECT b.id, b.netcomId FROM biller b WHERE b.netcomId = '${encrToken.netcomId}' AND b.status = 'DRAFT'`;
            const checkDataExistRow = await pool.query(checkDataExist);

            let newJSON = JSON.parse(encrToken.data);
            newJSON.error = response.body.replace(/'/g, " ");
            newJSON = decodeURIComponent(JSON.stringify(newJSON));
            if (checkDataExistRow.recordset.length > 0) {
              // update if the netcomID is present.
              const updateData = `UPDATE biller 
                                SET legalName='${formData.legalName.replace(/'/g, "''")}',
                                  uid='${formData.accounts[0].iid}',
                                  subscriptionStatus='${formData.billRecipientSubscriptionStatus}',
                                  defaultLanguage='${formData.localizedData.defaultLanguage}',
                                  companyJSON='${newJSON}'
                                WHERE netcomId='${encrToken.netcomId}' AND id='${checkDataExistRow.recordset[0].id}'`;
              const updateDataQry = await pool.query(updateData);
            }
            else {
              // Insert into biller table with status as 'DRAFT'
              const addBiller = `INSERT INTO biller (netcomid,status,legalName,uid,subscriptionStatus,defaultLanguage,companyJSON)
            VALUES('${encrToken.netcomId}','DRAFT','${formData.legalName.replace(/'/g, "''")}','${formData.accounts[0].iid}','${formData.billRecipientSubscriptionStatus}','${formData.localizedData.defaultLanguage}','${newJSON}')`;
              await pool.query(addBiller);
            }
            let responseValue = JSON.stringify(encrToken)
            commonErrors['errorTitle'] = req.originalUrl;
            commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + JSON.stringify(data) + '-req param six,' + responseValue;
            warningMessage(commonErrors, responseValue);
            var returnData = data.type.replace('/problems/', '');

            return res.status(status_code.INTERNAL_SERVER_ERROR).json({
              status_code: 500,
              message: returnData.toLowerCase(),
              status: false,
            });
          }
        }

      })

    }
    catch (error) {

      let responseValue = JSON.stringify(encrToken);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + responseValue;
      warningMessage(commonErrors, error);
      return res.status(status_code.INTERNAL_SERVER_ERROR).json({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
      });
    }
  }

  async getArticleDetails(req: Request, res: Response): Promise<any> {
    try {
      const { taxId, unitId, accountId, articleId } = req.body;
      const cookieData = req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME];
      if (!cookieData) {
        return res.status(500).send({
          status_code: 500,
          message: 'Missing_cookie',
          status: false,
        });
      }

      const cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(cookieData)));
      const accessToken = cookie.access_Token;
      let accountList: any[] = [];
      let unit: any;
      let tax: any;
      let article: any;
      let activeAccounts: any
      // Fetch account
      if (accountId && accountId != 'null') {
        activeAccounts = await getActiveAccounts(accessToken);
        console.log('activeAccounts', activeAccounts.status);
        if (activeAccounts?.status === true)
          accountList = activeAccounts?.data?.filter(item => item.id == accountId);
        console.log('activeAccounts', activeAccounts?.data?.filter(item => item.id == accountId));
      }

      // Fetch unit
      if (unitId && unitId != 'null') {
        console.log('Filtered Account:', unitId);
        unit = await getUnitList(accessToken, unitId);
        console.log('Unit:', unit);
      }

      // Fetch tax
      if (taxId && taxId != 'null') {
        tax = await getActiveSalesTaxBexio(accessToken, taxId);
        console.log('Tax:', tax);
      }

      if (articleId && articleId != 'null') {
        article = await getActiveItem(accessToken, articleId);
        console.log('article', article);


      }

      const result = {
        account: activeAccounts?.status === false ? null : accountList.length > 0 ? accountList[0] : null,
        unit: unit?.status === false ? null : unit || null,
        tax: tax?.status === false ? null : tax || null,
        article: article?.status === false ? null : article || null
      };

      return res.status(200).send({
        status: 200,
        data: result,
      });
    } catch (error) {
      const responseValue = JSON.stringify(req.body);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = `From: ${path.basename(__filename)} ${error.toString()} - req param: ${responseValue}`;
      warningMessage(commonErrors, error);

      return res.status(status_code.INTERNAL_SERVER_ERROR).json({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
      });
    }
  }

  async getActiveArticle(req: Request, res: Response): Promise<any> {
    try {
      let cookieData = req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME];
      const cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(cookieData)));
      if (!cookieData) {
        return res.status(500).send({
          status_code: 500,
          message: 'Missing_cookie',
          status: false,
        })
      }

      let accessToken = cookie.access_Token;
      const articleList: any = await getActiveArticle(accessToken);
      if (articleList?.status == false) {
        return res.status(articleList?.statuscode).send({
          status_code: articleList?.statuscode,
          message: articleList?.message,
          status: false,
        })
      }
      //console.log("articleList ",articleList);
      return res.status(200).send({
        status: 200,
        data: articleList,
      });
    } catch (error) {
      //console.log("Error getActiveArticle :: ",error);
    }
  }


  async getContacts(req: Request, res: Response): Promise<any> {

    try {
      let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
      let accessToken = cookie.access_Token;
      let decryptdata = req.body
      const { name, limit = 2000, offset = 0 } = req.body ?? {};
      let result;
      let data = [];

      console.log("decryptdata-------------", decryptdata);
      console.log("name-------------", name);
      if (name) {
        let contactList: any = await searchContact(accessToken, { name }, offset, limit)
        console.log("contactList-------------", contactList);
        if (contactList?.error) {
          return res.status(500).send({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
          })
        }
        if (contactList?.length !== 0) {
          result = contactListMapping(contactList) || []
        }
        return res.status(200).send({
          status: 200,
          data: result,
        });
      } else {
        let contactList: any = await getAllcontacts(accessToken, offset, limit, data);
        if (contactList === "Unauthorized") {
          return res.status(401).send({
            status_code: 401,
            message: 'Unauthorized',
            status: false,
          });
        } else {
          ////console.log("totalCount", totalCount);
          result = contactListMapping(contactList)
          return res.status(200).send({
            status: 200,
            data: result,
          });
        }

      }
    } catch (error) {
      if (error instanceof Error && error.message === 'Unauthorized') {
        return res.status(401).send({
          status_code: 401,
          message: 'Unauthorized',
          status: false,
        });
      }
      else {
        return res.status(500).send({
          status_code: 500,
          message: '',
          status: false,
        })
      }

    }


  }

  // API to update assets
  async updateAsset(req: Request, res: Response): Promise<any> {
    let accessToken
    let encrToken: any = null;
    try {
      encrToken = req.body;
      const resetToken = crypto.randomBytes(15).toString('hex');
      const billerId = encrToken.billerId;
      const assetId = encrToken.assetId;
      const filedata = req['files'][0];
      //console.log("filedata :: ",filedata)
      const options = {
        method: 'PUT',
        url: config.SIX_API_CERTIFICATE_BASE + `billers/${billerId}/assets/${assetId}`,
        headers: {
          'authorization': `Bearer ${accessToken}`,
          'x-networkpartner-id': config.NETWORK_PARTNER_ID,
          'X-Correlation-Id': resetToken,
        },
        body: filedata['buffer'],
        key: fs.readFileSync(config.CERTIFICATE_PATH + config.SIX_API_KEY),
        cert: fs.readFileSync(config.CERTIFICATE_PATH + config.SIX_API_CERTIFICATE)
      };

      if (path.extname(filedata.originalname) === ".jpeg") {
        options.headers['Content-Type'] = 'image/jpeg'
      }
      if (path.extname(filedata.originalname) === ".png") {
        options.headers['Content-Type'] = "image/png"
      }
      if (path.extname(filedata.originalname) === ".gif") {
        options.headers['Content-Type'] = "image/gif"
      }
      if (path.extname(filedata.originalname) === ".pdf") {
        options.headers['Content-Type'] = "application/pdf"
      }
      await request(options, async function (error, response) {
        if (error) {
          //console.log(error);
          let responseValue = JSON.stringify(encrToken)
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param six,' + responseValue;
          warningMessage(commonErrors, error);
          return res.status(status_code.INTERNAL_SERVER_ERROR).json({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
          });
        }
        else {
          if (response.statusCode == '204') {
            return res.status(status_code.OK).json({
              status_code: 200,
              message: 'updated_asset_successfully',
              status: true,
            });
          }
          if (response.statusCode == '500') {
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({
              status_code: 500,
              data: response,
              message: "something_went_wrong",
              status: true,
            });
          }
          else {
            let errorResponse = JSON.parse(response.body)
            var returnData = errorResponse.type.replace('/problems/', '');
            return res.status(status_code.INTERNAL_SERVER_ERROR).json({
              status_code: 500,
              message: returnData.toLowerCase(),
              status: true,
            });
          }
        }
      });
    } catch (error) {
      let responseValue = JSON.stringify(encrToken)
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + responseValue;
      warningMessage(commonErrors, error);
      return res.status(status_code.INTERNAL_SERVER_ERROR).json({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
      });
    }
  }
  async getAssets(req: Request, res: Response): Promise<any> {
    try {
      const resetToken = crypto.randomBytes(15).toString('hex');
      const billerId = req.body.billerId;
      const assetId = req.body.assetId;

      const options = {
        method: 'GET',
        url: `${config.SIX_API_CERTIFICATE_BASE}billers/${billerId}/assets/${assetId}`,
        headers: {
          'x-networkpartner-id': config.NETWORK_PARTNER_ID,
          'X-Correlation-Id': resetToken,
        },
        key: fs.readFileSync(config.CERTIFICATE_PATH + config.SIX_API_KEY),
        cert: fs.readFileSync(config.CERTIFICATE_PATH + config.SIX_API_CERTIFICATE),
      };

      const chunks: Buffer[] = [];

      const reqStream = request(options);

      reqStream.on('response', (response) => {
        if (response.statusCode !== 200) {
          return res.status(200).json({
            data: '',
            status_code: 200,
            message: 'asset_not_found',
            status: true,
          });
        }

        const contentType = response.headers['content-type'] || 'application/octet-stream';

        response.on('data', (chunk: Buffer) => {
          chunks.push(chunk);
        });

        response.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const base64 = buffer.toString('base64');
          const dataUrl = `data:${contentType};base64,${base64}`;

          return res.status(200).json({
            data: dataUrl,
            status_code: 200,
            message: 'fetch_asset_image',
            status: true,
          });
        });
      });

      reqStream.on('error', (error) => {
        const responseValue = JSON.stringify({ billerId, assetId });
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = `From: ${path.basename(__filename)} ${error.toString()} - req param six, ${responseValue}`;
        warningMessage(commonErrors, error);

        return res.status(500).json({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
      });

    } catch (error) {
      return res.status(500).json({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
      });
    }
  }
  async getConnectionList(req: Request, res: Response): Promise<any> {
    const encrToken = req.body;

    try {
      const cookie = JSON.parse(encryptionControl.decryptCookie(
        JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])
      ));
      const accessToken = cookie.access_Token;
      const page = parseInt(encrToken.page_number || '1');
      const limit = parseInt(encrToken.records_per_page || '5');
      const offset = (page - 1) * limit;
      const formData = {
        network: encrToken.network,
        company_doc_type: encrToken.docType,
        company_direction_key: encrToken.direction,
        netcom_id: encrToken.netcomId,
      };

      const options = {
        method: 'POST',
        url: config.GATE2BURL + 'company-g2b-connections',
        formData,
      };

      const connectData = await new Promise<any>((resolve, reject) => {
        request(options, (error, response, body) => {
          if (error) {
            commonErrors['errorTitle'] = 'getConnectionList';
            warningMessage(commonErrors, error);
            return reject(error);
          }
          try {
            return resolve(JSON.parse(body));
          } catch (parseError) {
            reject(parseError);
          }
        });
      });

      let contacts;
      if (encrToken.customerId) {
        const searchData = await getContactDetails(accessToken, encrToken.customerId);
        contacts = Array.isArray(searchData) ? searchData : [searchData];

        // Filter and enrich connectData
        const contactIds = new Set(contacts.map(c => c.id));
        const resultCustomer = new Map(contacts.map(c => [c.id, `${c.name_1 || ''} ${c.name_2 || ''}`.trim()]));
        const resultMail = new Map(contacts.map(c => [c.id, c.mail]));

        const updatedConnectData = connectData.data
          .filter(item => contactIds.has(Number(item.partner_company_details.customer_id)))
          .map(item => {
            const id = Number(item.partner_company_details.customer_id);
            return {
              ...item,
              customer_name: resultCustomer.get(id) || '',
              customer_mail: resultMail.get(id) || '',
            };
          });
        const paginatedData = updatedConnectData.slice(offset, offset + limit);
        return res.status(200).json({
          data: paginatedData,
          totalCount: updatedConnectData.length,
          status_code: 200,
          message: 'getConnectionList',
          status: true,
        });

      } else {
        contacts = await getAllcontacts(accessToken, 0, 2000, '');
        const resultCustomer = new Map(contacts?.map(c => [c.id, `${c.name_1 || ''} ${c.name_2 || ''}`.trim()]));
        const resultMail = new Map(contacts?.map(c => [c.id, c.mail]));

        const updatedConnectData = connectData.data.map(item => {
          const id = Number(item.partner_company_details.customer_id);
          return {
            ...item,
            customer_name: resultCustomer.get(id) || '',
            customer_mail: resultMail.get(id) || '',
          };
        });

        const paginatedData = updatedConnectData.slice(offset, offset + limit);
        return res.status(200).json({
          data: paginatedData,
          totalCount: updatedConnectData.length,
          status_code: 200,
          message: 'getConnectionList',
          status: true,
        });
      }

    } catch (error) {
      commonErrors['errorTitle'] = 'getConnectionList';
      commonErrors['errorDescription'] = `From: ${path.basename(__filename)} ${error} - req param`;
      warningMessage(commonErrors, error);
      return res.status(500).json({ status: false, message: 'Internal server error' });
    }
  }

}


const contactListCountSearch = async (token, search, offset, limit?) => {
  return new Promise(async (resolve, reject) => {
    var options = {
      'method': 'POST',
      // 'url': 'https://api.bexio.com/2.0/contact/search',
      'url': `${config.BEXIO_API}2.0/contact/search?limit=${limit}&offset=${offset}&order_by=updated_at_desc`,
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
      if (response.statusCode == 200) {
        let parsedBody;
        try {
          parsedBody = JSON.parse(response.body);
        } catch (e) {
          warningMessage(commonErrors, 'Invalid JSON in response.body: ' + response.body);
          resolve(false);
          return;
        }
        if (Array.isArray(parsedBody) && parsedBody.length == limit) {
          let temp = contactListCountSearch(token, offset + 2000, 2000)
        } else {
          offset = offset + (Array.isArray(parsedBody) ? parsedBody.length : 0);
          return resolve(offset)
        }
      }
      else
        return resolve(false)
    });
  });
}
const contactListCount = async (token, offset, limit?) => {
  return new Promise(async (resolve, reject) => {

    var options = {
      'method': 'GET',
      'url': `${config.BEXIO_API}2.0/contact/?limit=${limit}&offset=${offset}&order_by=updated_at_desc`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    };
    request(options, async function (error, response) {
      if (error) {
        commonErrors['errorTitle'] = 'contactListCount';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + token;
        warningMessage(commonErrors, error);
        return resolve(false)
      }
      if (response.statusCode == 200) {
        if (JSON.parse(response.body).length == limit) {
          let temp = await contactListCount(token, offset + 200, 200);
          return resolve(temp)
        } else {
          offset = offset + JSON.parse(response.body).length;
          resolve(offset)
          return
        }
      }
      else
        resolve(false)
      return
    });
  });
}

const createConnector = async (params) => {
  try {
    let config_key = 'BEXIO_CONNECTION_CONFIG_ORDER_' + params.direction;
    let connectorConfig = config[config_key]
      .replace('$netcom_id$', params.netcomId)
      .replace("$name$", params.name)
      .replace("$doc_type$", params.doc_type);

    let formdata = {
      data: connectorConfig
    }
    console.log('formdata', formdata);

    let options = {
      'method': 'POST',
      'url': config.GATE2BURL + 'third-party-connector',
      formData: formdata
    };
    return new Promise(function (resolve, reject) {
      request(options, async function (error, response, body) {
        if (!error && response.statusCode == 200) {
          return resolve(body);
          //console.log('body', body);

        } else {
          //console.log('error', error);

          reject(error);
        }
      });
    });
  } catch (error) {
    commonErrors['errorTitle'] = createConnector.name;
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + params;
    warningMessage(commonErrors, error);
    return resolve('');
  }
}
const inviteCompanySend = async (params) => {
  //console.log('inviteCompanySend');
  try {
    let fomdata = {
      data: params
    }
    // console.log(fomdata);

    let options = {
      'method': 'POST',
      'url': config.GATE2BURL + 'send-invitation',

      formData: fomdata
    };
    //console.log(options);

    return new Promise(function (resolve, reject) {
      request(options, async function (error, response, body) {

        //console.log('response*', response);

        if (!error && response.statusCode == 200) {
          return resolve(body);
          //console.log('body', body);

        } else {
          //console.log('error', error);

          reject(error);
        }
      });
    });
  } catch (error) {
    commonErrors['errorTitle'] = inviteCompanySend.name;
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + params;
    warningMessage(commonErrors, error);
    //console.log(error);

  }
}
const deleteRedis = async (api, key) => {
  const checkAPI = JSON.parse(fs.readFileSync('./assets/iom_E76FAD2A-41E9-E211-84C9-D8D385E0B238.json'));
  let delApis = checkAPI.realated[api];
  //console.log('delApis', delApis);
  //console.log('data', key);

  const redis_client = await redisClient;

  try {
    delApis.split(",").forEach(async element => { // <--- make this async
      const pattern = key + element + '*';
      //console.log(pattern);

      const data = await redis_client.keys(pattern); // use await instead of callback
      data.forEach(async apis => {
        await redis_client.del(apis); // also await here
      });
    });
  } catch (error) {
    //console.log(error);
  }
};
const getInvitationDetails = async (code): Promise<any | false> => {
  //console.log('code', code);
  return new Promise(async (resolve, reject) => {
    let formData = {
      invite_code: code ? code.toString() : ''
    }
    let options = {
      'method': 'POST',
      'url': config.GATE2BURL + 'post-list/connections',
      // 'url': 'http://192.168.2.64:5005/api/'+'invite-details',
      formData: formData
    };
    //console.log('options', options);

    request(options, function (error, response) {
      if (error) {
        commonErrors['errorTitle'] = 'getInvitationDetails';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + code;
        warningMessage(commonErrors, error);
        return resolve(false)
      }

      // res.send(response.body)
      ////console.log(response.body);
      //console.log(response.body);

      if (response.statusCode == 200) {


        // console.log('JSON.parse(response.body', JSON.parse(response.body))
        return resolve(JSON.parse(response.body));
      } else {
        reject(false)
      }

    });
  });
}
const getPythonData = async (netcomId) => {
  return new Promise(async (resolve, reject) => {
    let responseData = null
    try {
      let search = ""
      let page_number = "1"
      let records_per_page = "5"
      let limit = "5"
      let offset = "0"
      let netcom_id = netcomId
      let ebill = "true"
      let formData = {
        search: search,
        page_number: page_number,
        records_per_page: records_per_page,
        limit: limit,
        offset: offset,
        netcom_id: netcom_id,
        ebill: ebill
      }
      const options = {
        'method': 'POST',
        'url': config.GATE2BURL + 'post-list/connections',
        formData: formData
      };
      console.log('getPythonData options', options);

      await request(options, async function (error, response) {


        if (error) {
          commonErrors['errorTitle'] = 'getPythonData';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString();
          warningMessage(commonErrors, error);
          return resolve(error)
        }
        else {

          try {
            responseData = JSON.parse(response.body)
            //console.log('response',responseData);
            return resolve(responseData)
          }
          catch {
            return resolve(responseData)
          }
        }
      })
    }
    catch (error) {
      commonErrors['errorTitle'] = 'getPythonData';
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString();
      warningMessage(commonErrors, error);
      return resolve(responseData)
    }
  })
}
const updateConnection = async (data) => {
  //console.log('updateConnection');
  // console.log('data',data);

  return new Promise(async (resolve, reject) => {
    let responseData = null
    try {
      //console.log('data.form',data.form);

      let tempData = JSON.parse(data.form).data;
      let formData = {
        con_id: tempData.con_id,
        doc_type: tempData.fk_doc_type,
        doc_format: tempData.fk_doc_format,
        doc_interface: tempData.fk_netcomid_doc_interface,
        include_pdf: tempData.include_pdf
      }
      //console.log('formData',formData);
      const options = {
        method: 'POST',
        url: `${config.GATE2BURL}update-ebill-connection`,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        formData: formData
      };
      await request(options, async function (error, response) {
        if (error) {
          commonErrors['errorTitle'] = 'updateConnection';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString();
          warningMessage(commonErrors, error);
          return resolve(false)
        }
        else {
          responseData = JSON.parse(response.body)
          return resolve(true)
        }
      })
    }
    catch (error) {
      commonErrors['errorTitle'] = 'getPythonData';
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString();
      warningMessage(commonErrors, error);
      return resolve(false)
    }
  })
}
const createBexiobiller = async (data) => {
  return new Promise(async (resolve, reject) => {
    let responseData = null
    try {
      // let tempData = JSON.parse(data).data;
      let formData = {
        netcomid: data

      }
      //console.log('formData-createBexiobiller',formData);
      const options = {
        method: 'POST',
        url: `${config.GATE2BURL}create-bexio-ebill-connector`,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        formData: formData
      };
      await request(options, async function (error, response) {
        if (error) {
          commonErrors['errorTitle'] = 'updateConnection';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString();
          warningMessage(commonErrors, error);
          return resolve(false)
        }
        else {
          responseData = JSON.parse(response.body)
          return resolve(true)
        }
      })
    }
    catch (error) {
      commonErrors['errorTitle'] = 'getPythonData';
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString();
      warningMessage(commonErrors, error);
      return resolve(false)
    }
  })
}

const getInvitations = async (code) => {
  try {
    let formData = {
      invite_code: code
    }
    return new Promise(async (resolve, reject) => {
      var options = {
        'method': 'POST',
        'url': config.GATE2BURL + 'post-list/invitations',

        formData: formData
      };
      request(options, function (error, response) {
        if (error) {
          commonErrors['errorTitle'] = 'getInvitations';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + code;
          warningMessage(commonErrors, error);
          return resolve(false)
        }

        return resolve(response.body);

      });
    });
  } catch (error) {
    commonErrors['errorTitle'] = getInvitations.name;
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + code;
    warningMessage(commonErrors, error);
    return
  }
}
const getStatus = async (code) => {
  let formData: any = null
  try {
    formData = {
      invite_id: code
    }
    return new Promise(async (resolve, reject) => {
      var options = {
        'method': 'POST',
        'url': config.GATE2BURL + 'fetch-field-status',
        formData: formData
      };
      request(options, function (error, response) {
        if (error) {
          commonErrors['errorTitle'] = 'getStatus';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio params,' + formData;
          warningMessage(commonErrors, error);
          return resolve(false)
        }
        // res.send(response.body)
        //console.log(response.body);

        return resolve(response.body);

      });
    });
  } catch (error) {
    commonErrors['errorTitle'] = getStatus.name;
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + formData;
    warningMessage(commonErrors, error);
    return resolve('');
  }
}
const getConnections = async (netcomId, docType) => {
  let formData: any = null
  try {
    let doc_type = JSON.parse(config.BEXIO_DOCTYPES).filter(a => a.key.toLowerCase() == docType.toLowerCase());
    formData = {
      netcom_id: netcomId,
      direction: 'OUTPUT',
      active_only: 'true',
      doc_type: doc_type[0]['id'],
      //doc_format:config.DOC_FORMAT,
      show_all: 'true',
      module: 'BEX'
    }
    console.log('formData post-list/connections', formData);

    return new Promise(async (resolve, reject) => {
      var options = {
        'method': 'POST',
        'url': config.GATE2BURL + 'post-list/connections',
        formData: formData

      };
      request(options, function (error, response) {
        if (error) {
          commonErrors['errorTitle'] = 'post-list/connections';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + formData;
          warningMessage(commonErrors, error);
          return resolve(false)
        }

        return resolve(response.body);

      });
    });
  } catch (error) {
    commonErrors['errorTitle'] = getConnections.name;
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + netcomId;
    warningMessage(commonErrors, error);


  }
}
const getConnectionsDetailsOfInviteSender = async (code, netComId) => {
  let formData: any = null
  try {

    formData = {
      invite_code: code,
      logged_in_netcom_id: netComId,
    }
    console.log('invite_code', formData);

    return new Promise(async (resolve, reject) => {
      var options = {
        'method': 'POST',
        'url': config.GATE2BURL + 'post-list/connections',
        formData: formData

      };
      request(options, function (error, response) {
        if (error) {
          commonErrors['errorTitle'] = 'getLoginUserInfo';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + formData;
          warningMessage(commonErrors, error);
          return resolve(response.body);
        }
        // res.send(response.body)
        return resolve(response.body);

      });
    });
  } catch (error) {
    commonErrors['errorTitle'] = getConnectionsDetailsOfInviteSender.name;
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + formData;
    warningMessage(commonErrors, error);
  }
}
const bexioCreatePythonData = async (
  netcomId: string,
  companyName: string,
  encrToken: { config: string; docTypeFormat?: string }
): Promise<boolean> => {
  return new Promise<boolean>(async (resolve, reject) => {
    let data: any;
    try {
      if (companyName === 'Bexio') {
        data = JSON.parse(config.BEXIO_CREATE_BUSSINESS_CONNECTION || '');
      } else {
        data = JSON.parse(config.CREATE_BUSSINESS_CONNECTION || '');
        const response: any = JSON.parse(encrToken.config);
        data.config.platform["config"] = {};
        data.config["fk_doc_type"] = response.fk_doc_type || '';
        data.config["fk_doc_format"] = response.fk_doc_format || '';
        data.config["fk_netcomid_doc_interface"] = response.fk_netcomid_doc_interface || '';
        data.config["include_pdf"] = response.include_pdf || 0;
      }
      data.config['netcom_id'] = `${netcomId}`;
      let docTypeFormat: any = encrToken.docTypeFormat ? JSON.parse(encrToken.docTypeFormat) : '';
      let doc_type = docTypeFormat ? docTypeFormat.doc_type : (data.config["fk_doc_type"] ? data.config["fk_doc_type"].toUpperCase() : '');
      let doc_format = docTypeFormat ? docTypeFormat.doc_format : data.config["fk_doc_format"];
      data.config['name'] = `EBILL_$SEND$_${doc_type}_${doc_format}_${netcomId}`;
      const options = {
        method: 'POST',
        url: `${config.GATE2BURL}no-invite-process`,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        form: { 'data': JSON.stringify(data) }
      };
      await request(options, async function (error: any, response: any) {
        if (error) {
          let responseValue = JSON.stringify(data);
          commonErrors['errorTitle'] = 'bexioCreatePythonData';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + responseValue;
          warningMessage(commonErrors, error);
          return resolve(false);
        } else {
          let dataValue = JSON.parse(response.body);
          if (dataValue.status) {
            return resolve(true);
          } else {
            let responseValue = JSON.stringify(data);
            commonErrors['errorTitle'] = 'bexioCreatePythonData';
            commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'something wrong' + responseValue;
            warningMessage(commonErrors, responseValue);
            return resolve(false);
          }
        }
      });
    } catch (error: any) {
      let responseValue = JSON.stringify(data);
      commonErrors['errorTitle'] = 'bexioCreatePythonData';
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + 'req param-' + responseValue;
      warningMessage(commonErrors, error);
      return resolve(false);
    }
  }).catch((err) => {
    warningMessage(commonErrors, err);
    return false;
  });
};
const bexioUpdateBiller = async (req, billerId) => {
  return new Promise(async (resolve, reject) => {
    let cookie;
    try {
      cookie = JSON.parse(encryptionControl.decryptCookie(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME]));
      let accessToken = cookie.access_Token;
      let data = {
        "name": "io_market.ebill_pid",
        "value": `${billerId}`
      }
      const options = {
        method: 'POST',
        url: `https://office.bexio.com/api.php/external_api_settings`,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(data)
      };
      await request(options, async function (error, response) {
        if (error) {
          //console.log("response from bexio update biller error----",error);
          commonErrors['errorTitle'] = req.originalUrl + `' bexioUpdateBiller'+' '+'billerId ----${billerId}'`;
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + cookie.access_Token;
          commonErrors['errorCode'] = config.ERROR_BEXIO_BILLER
          warningMessage(commonErrors, error);
          return resolve(false);
        }
        else {
          //console.log("response from bexio update biller----",response.body);
          return resolve(true);
        }
      })
    }
    catch {
      return resolve(false);
    }
  })
}
const getAllcontacts = async (token, offset, limit?, data?) => {
  return new Promise(async (resolve, reject) => {

    var options = {
      'method': 'GET',
      'url': `${config.BEXIO_API}2.0/contact/?limit=${limit}&offset=${offset}&order_by=updated_at_desc`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    };
    request(options, async function (error, response) {
      if (error) {
        commonErrors['errorTitle'] = 'contactListCount';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + token;
        warningMessage(commonErrors, error);
        return resolve(false)
      }
      if (response.statusCode === 200) {
        const currentData = JSON.parse(response.body);
        data = [...data, ...currentData];
        if (currentData.length === limit) {
          // More data likely exists, fetch next page
          const nextData = await getAllcontacts(token, offset + limit, limit, data);
          return resolve(nextData);
        }
        else {
          return resolve(data);
        }
      }

      if (response.statusCode === 401) {
        console.log("Unauthorized access, please check your token.");
        return resolve("Unauthorized");
        // return reject(new Error('Unauthorized'));

      } else {
        return resolve(false);
      }

    });
  });
}


const setConfig = async (billerId) => {

  return new Promise(async (resolve, reject) => {
    let data = {};
    try {
      // data = JSON.parse(config.EBILL_REPORT_CONFIG)
      let response = JSON.parse(config.EBILL_REPORT_CONFIG)
      data['biller_id'] = billerId;
      data['config'] = config.EBILL_REPORT_CONFIG;
      data['platform'] = 'BEX_VER1';
      data['status'] = '1';


      const options = {
        method: 'POST',
        url: `${config.GATE2BURL_PYTHON_URL}/create_config`,
        // url: `http://192.168.2.63:5000/create_config`,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        form: data
      };
      console.log('options', options);

      await request(options, async function (error, response) {
        console.log('error', error);
        console.log('response', response);


        if (error) {
          let responseValue = JSON.stringify(data)
          commonErrors['errorTitle'] = ' setConfig';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + responseValue;
          warningMessage(commonErrors, error);
          return resolve(false);
        }
        else {
          let dataValue = JSON.parse(response.body)
          if (dataValue.status) {
            return resolve(true);
          }
          else {
            let responseValue = JSON.stringify(data)
            commonErrors['errorTitle'] = 'setConfig';
            commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'something wrong' + responseValue;
            warningMessage(commonErrors, responseValue);
            return resolve(false);
          }
        }
      })
    }
    catch (error) {
      let responseValue = JSON.stringify(data)
      commonErrors['errorTitle'] = 'setConfig';
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + 'req param-' + responseValue;
      warningMessage(commonErrors, error);
      return reject(false);
    }
  })
}
