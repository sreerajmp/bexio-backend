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
const fs = require('fs')
import connectMssql from '../db/mssql-client'
@Injectable()
export class ConfigurationService {

  async setConfiguration(req: Request, res: Response,): Promise<any> {

    try {
      let data = req.body
      let responseData = null

      let fomdata = {
        name: data.netcom_id,
        config: JSON.stringify(data.config),
        status: 1,
        module: 'BEX'
      }
      var options = {
        'method': 'POST',
        'url': `${config.OCTOPUS_URL}/create_config`,
        formData: fomdata
      };

      //console.log.log('options',options);

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

              //console.log.log(response.body);
              responseData = JSON.parse(response.body)


              res.send({
                status: 200,
                data: responseData,

              })
            }
            catch {
              return resolve(responseData)
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
        config: JSON.stringify(data.config),
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

              //console.log.log(response.body);
              responseData = JSON.parse(response.body)


              res.send({
                status: 200,
                data: responseData,

              })
            }
            catch {
              return resolve(responseData)
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
            catch {
              return resolve(responseData)
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
      res.send({
        status_code: 200,
        message: 'common_sucess',
        status: true,
        data: JSON.parse(config.BEXIO_DOCTYPES),
      });
    } catch (error) {

      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'BEXIO_DOC_TYPE -req param,', JSON.stringify(req.body);
      warningMessage(commonErrors, 'BEXIO_DOC_TYPE');
      return res.status(500).json({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
      });
    }
  }
  async getContactList(req: Request, res: Response,): Promise<any> {

    const data = req.body;

    try {
      let docType = data.docType || 'Invoice';
      let direction = data.direction || 'Receive';
      let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
      let dataCookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.cookies[config.EXPIRE_EXPIRES_COOKIE_NAME])));
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

      console.log('*******************', partyAccountCheck);
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
      if (businessConnectionIds != null) {
        let bcResult: any = await getBcDetails(businessConnectionIds, dataCookie.netcomId);
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

        if (!resData) {
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'countryList_not_found -req param,', JSON.stringify(req.body);
          warningMessage(commonErrors, 'countryList_not_found');
          res.send({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,

          });
          return
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
            //console.log.log('eror');
            commonErrors['errorTitle'] = req.originalUrl;
            commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + '-bexio param,' + showTo + ' ' + showFrom;
            warningMessage(commonErrors, error);
            return res.status(200).json({
              status: false,
              message: [response],

            });
          }

          if (response.statusCode != 200)
            return res.status(200).json({
              status: false,
              message: [response],

            });

          let resData = response.body.length != 0 && response.statusCode == '200' ? JSON.parse(response.body) : '';
          let senderStatus = '';
          let receiverStatus = '';


          for (let contactIndex in resData) {
            resData[contactIndex]['country'] = countryList[resData[contactIndex]['country_id']] ? countryList[resData[contactIndex]['country_id']] : '';
            console.log('resData[contactIndex]', resData[contactIndex]['country']);
            console.log('partyAccountCheck', partyAccountCheck);
            console.log('partyAccountChecklength', partyAccountCheck.length);
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

      //console.log.log('*****',error);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,', req.body;
      warningMessage(commonErrors, error);

      res.send({

        status_code: 500,
        message: JSON.stringify(error),
        status: false,
      })
    }
  }
  async getPayementComments(req: Request, res: Response,): Promise<any> {
    let encrToken = req.body;

    try {

      const getStatusQryRslt = await connectBexio.companyregistered.findFirst({
        where: {
          rk_party: Number(encrToken.partyId), // Ensure rk_party is a unique field or indexed
        },
        select: {
          settings: true, // Fetch only the settings JSON field
        },
      });

      // Ensure settings is treated as an object
      const settings = (getStatusQryRslt?.settings as Record<string, any>) || {};

      res.send({
        status_code: 200,
        data: {
          notifyPayment: settings.notifyPayment ?? "true",
          notifyComments: settings.notifyComments ?? "true",
        },
        status: true,
      });

    } catch (error) {
      //console.log.log('error', error);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + encrToken;
      warningMessage(commonErrors, error);
      res.send({
        status_code: 500,
        status: false,
      });

    }

  }
  async changePayementComments(req: Request, res: Response,): Promise<any> {

    let encrToken = req.body;

    try {

      const getStatusQryRslt = await connectBexio.companyregistered.findFirst({
        where: {
          rk_party: Number(encrToken.partyId), // Ensure rk_party is a unique field or indexed
        },
        select: {
          settings: true, // Fetch only the settings JSON field
        },
      });


      //console.log.log('encrToken.payementStatus', encrToken.payementStatus);
      //console.log.log('encrToken.payementStatus', encrToken.commentStatus);
      if (getStatusQryRslt?.settings !== null) {

        if (encrToken.payementStatus == 'true' || encrToken.payementStatus == 'false') {
          let payementStatus = encrToken.payementStatus == 'true' ? '"true"' : '"false"';
          //console.log.log('payementStatus', payementStatus);

          const existingSettings =
            typeof getStatusQryRslt?.settings === "string"
              ? JSON.parse(getStatusQryRslt.settings)
              : getStatusQryRslt?.settings || {};

          const updatedCompany = await connectBexio.companyregistered.updateMany({
            where: { rk_party: encrToken.partyId },
            data: {
              settings: {
                set: {
                  ...existingSettings, // Now it's an object
                  notifyPayment: payementStatus, // Update only notifyPayment
                },
              },
            },
          });

        }
        if (encrToken.commentStatus == 'true' || encrToken.commentStatus == 'false') {
          let commentStatus = encrToken.commentStatus == 'true' ? '"true"' : '"false"';
          const existingSettings =
            typeof getStatusQryRslt?.settings === "string"
              ? JSON.parse(getStatusQryRslt.settings)
              : getStatusQryRslt?.settings || {};

          await connectBexio.companyregistered.updateMany({
            where: { rk_party: encrToken.partyId },
            data: {
              settings: {
                set: {
                  ...existingSettings,
                  notifyComments: commentStatus,
                },
              },
            },
          });
        }
      }
      else {
        const notifyPayment = encrToken.payementStatus ? encrToken.payementStatus : true;
        const notifyComments = encrToken.commentStatus ? encrToken.commentStatus : true;
        const existingSettings =
          typeof getStatusQryRslt.settings === "string"
            ? JSON.parse(getStatusQryRslt.settings)
            : getStatusQryRslt.settings ?? {};

        await connectBexio.companyregistered.updateMany({
          where: { rk_party: encrToken.partyId },
          data: {
            settings: {
              set: {
                ...existingSettings,
                notifyPayment,
                notifyComments,
              },
            },
          },
        });
      }
      res.send({
        status_code: 200,
        status: true,
      });

    } catch (error) {
      //console.log.log('error', error);
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
       console.log('pool',pool);
       
      //   const ioDb = await connectPostgres;
      //   //console.log.log('req.body.encrToken',req.body.encrToken);

        encrToken = encryptionControl.decrypt(req.body.encrToken);
    console.log('encrToken',encrToken);

        if (!encrToken || !('accId' in encrToken) || !('partyId' in encrToken)) {


          const getUserPermissionsResult = await connectLibrary.$queryRaw<any>`
          SELECT po.policy, par.cid 
          FROM partyapplication_account_role par
          INNER JOIN partyapplication_account pa ON par.fk_partyapplication_account = pa.cid
          INNER JOIN partyapplication p ON p.cid = pa.fk_partyapplication 
          INNER JOIN role_policy rp ON rp.fk_role = par.fk_role 
          INNER JOIN policy po ON po.cid = rp.fk_policy
          INNER JOIN role r ON r.cid = rp.fk_role 
          WHERE fk_account = ${BigInt(encrToken.roleAccId)}
          AND p.fk_party = ${BigInt(encrToken.rolePartyId)}
          AND r.name LIKE '%EBILL%'
      `;
console.log('getUserPermissionsResult',getUserPermissionsResult);

          if(getUserPermissionsResult.length == 0){
            return res.send({
              status_code: 200,
              message: 'no_data_found',
              status: true,
            });
          }
        }

        const netcomId = encrToken?.netcomId;

console.log('****************************');


        
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

       // console.log('getBasicDetails',getBasicDetails);
        
        const getData = await pool.query(getBasicDetails);
       console.log('getData',getData.recordset.length);

        if (getData.recordset.length) {
          if (getData.recordset[0].companyJSON) {
            let jsonExtract = JSON.parse(getData.recordset[0].companyJSON)
            getData.recordset[0]['enterpriseIdentificationNumber'] = jsonExtract.enterpriseIdentificationNumber
          }
         let pythonData = await getPythonData(netcomId);
         console.log('pythonData',pythonData);
         
         let connectionData:any = null   
         if(pythonData != null && pythonData["count"] != 0){
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
            "export-doc-ref":pythonData["results"][0].config.service["export-doc-ref"]["export-doc-ref"],
            "validate-sign": pythonData["results"][0].config.service["validate-sign"]["validate-sign"],
            "netcom_id":pythonData["results"][0].netcom_id,
            "con_id": pythonData["results"][0].id,
            "process_name": pythonData["results"][0].fk_process_name,
            "ebill":"true",
            "signed-document": pythonData["results"][0].config.service["create-signed-doc"]["signed-document"],
            "signed-file-name": pythonData["results"][0].config.service["create-signed-doc"]["signed-file-name"],
            "attach-validation-report": pythonData["results"][0].config.service["create-signed-doc"]["attach-validation-report"],
            "export-validation-report": pythonData["results"][0].config.service["create-signed-doc"]["export-validation-report"],
            "validation-file-name": pythonData["results"][0].config.service["create-signed-doc"]["validation-file-name"]
         }
         }
         else{
          getData.recordset["fk_doc_type"] = ''
          getData.recordset["fk_doc_format"] = ''
          getData.recordset["fk_netcomid_doc_interface"] = ''
          getData.recordset["include_pdf"] = '' 
         }   
         console.log('getdata',getData);
           
         return res.send({
            data: getData.recordset,
            pythonData:connectionData,
            status_code: 200,
            message: 'basic_informations',
            status: true,
          });
        }
        else {
          return  res.send({
            status_code: 200,
            message: 'no_data_found',
            status: true,
          });
        }

      }
      catch (error) {
        let responseValue = JSON.stringify(encrToken)
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + responseValue;
        warningMessage(commonErrors, error);
        res.send({
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
      console.log('data', data);

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
          'url': config.PYTHON_API + 'invite-details',
          // 'url': 'http://192.168.2.64:5005/api/'+'invite-details',

          formData: formData
        };
        request(options, async function (error, response, body) {
          if (error) {
            commonErrors['errorTitle'] = 'getInvitionCodeDetails';
            warningMessage(commonErrors, error);
            resolve(false)
          }
          console.log('body', body);
          res.send({
            status_code: 200,
            message: 'common_sucess',
            status: true,
            data: JSON.parse(body)['data'],
          });
        });


      });
    }

    catch (error) {

      console.log(error);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + JSON.stringify(req.body);
      warningMessage(commonErrors, error);
      return res.status(200).json({
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
        res.status(500).send({
          status_code: 500,
          message: 'Missing_cookie',
          status: false,
        })
      }

      let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(cookieData)));
      let accessToken = cookie.access_Token;
      let senderNr:any = await getContactDetails(accessToken, data.contactsId);
      if(senderNr.message=='Unauthorized'){
        return res.status(401).send({
          message: senderNr.message,
          status: false,
        })
      }
      if (!senderNr) {
        commonErrors['errorTitle'] = 'inviteCompany';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'contact_details_not_found - req param,', req.body;
        warningMessage(commonErrors, 'contact_details_not_found');

      return res.status(500).send({
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

        console.log('getPartyAccountId', getPartyAccountId);

        const netComId = await connectGate2b.$queryRaw<any[]>`
              SELECT netcomid
              FROM ediparty
              WHERE rk_party = ${getPartyAccountId[0].objectid}::UUID
            `;

        console.log('***8', netComId[0].netcomid);
        // console.log('senderNr',netComId);
        const getCompanyCodeResult = await connectBexio.companyregistered.findMany({
          where: {
            rk_party: Number(data.partyId),
          }
        });
        console.log("getCompanyCodeResult.rows ", getCompanyCodeResult);

        // const partyAccountCheck = await connectBexio.contact_bc.findMany({
        //   where: {
        //     fk_companyregistered: Number(getCompanyCodeResult[0].cid),
        //     rk_sendercontactid: Number(data.contactsId),
        //     type: 'EDI',
        //   },
        // });
        const partyAccountCheck = await connectBexio.$queryRaw<any[]>`
                  SELECT * FROM contact_bc
                  WHERE fk_companyregistered = ${getCompanyCodeResult[0].cid}
                  AND rk_sendercontactid = ${BigInt(data.contactsId)}
                  AND type = 'EDI'
                `;

        console.log("partyAccountCheck ", partyAccountCheck);
        let tempElement;
        for (let index = 0; index < partyAccountCheck.length; index++) {
          const element = partyAccountCheck[index];
          console.log(getCompanyCodeResult[0].netcomid);
          console.log(element.invite_code);
          if (element.invite_code) {
            let invitionDetails = await getInvitationDetails(element.invite_code);
            console.log('invitionDetails', invitionDetails);

            if (invitionDetails?.results?.length && invitionDetails.results[0]?.fk_doc_type?.data === data?.docType) {
              tempElement = element;
              break;
            }
          }
        }
        console.log('tempElement', tempElement);

        if (tempElement) {
          console.log('tempElement[', tempElement['rk_businessconnection']);

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
        console.log('inviteSendStatus', inviteSendStatus);

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
          console.log('invitationId', invitationId);
          console.log(invitationId);
          let idToPython = encodeURIComponent(encryptionControl.encrypt('bexioUser')) + '/' + encodeURIComponent(encryptionControl.encrypt(invitationId.cid.toString()));

          let doc_type = data.docType ? data.docType : 'Invoice';
          let direction = data.direction ? data.direction.toUpperCase() == 'SEND' ? 'IN' : 'OUT' : 'IN';
          let parms = (config.BEXIO_INVITE_CONFIG || '')
            .replace('$netcom_id$', netComId[0].netcomid)

            .replace("$name$", getPartyAccountId[0].companyname)
            .replace("$language$", 'EN')
            .replace("$in_customer_id$", "1")
            .replace("$partner_email$", data.email)
            .replace("$bexio_invite_id$", idToPython)
            .replace("$out_customer_id$", senderNr['id'])
            .replace("$user_email$", data.email)
            .replace("$invited_company_name$", data.invitedcompanyname)
            .replace("$customer_name$", data.userName)
            .replace("$direction$", direction)
            .replace("$doc_type$", doc_type);


          parms = JSON.parse(parms);

          parms['config']['inviter_netcom_id'] = data.inviterNetcomId;
          parms['config']['inviter_company_name'] = data.inviterCompanyName;
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
            return res.status(200).json({
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
}

const getBcDetails = async (bc_id, netcomId) => {

  try {

    return new Promise(async (resolve, reject) => {
      if (bc_id) {
        let formData = {
          bc: bc_id.toString(),
          netcom_id: netcomId
        }
        let options = {
          'method': 'POST',
          'url': config.PYTHON_API + 'get-contact-bc',
          formData: formData
        };

        request(options, async function (error, response, body) {
          if (error) {
            commonErrors['errorTitle'] = 'getBcDetails';
            warningMessage(commonErrors, error);
            resolve(false)
          } else {
            resolve(JSON.parse(response.body));
          }
        });
      } else {
        resolve(false)
      }

    });
  } catch (error) {
    commonErrors['errorTitle'] = 'getBcDetails';
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + 'access_token';
    warningMessage(commonErrors, error);

  }
}
const getCountryLists = async (access_token) => {
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
          resolve(false)
        }
        if (response.statusCode == 200)
          resolve(response.body);
        else
          resolve(false)

      });
    });
  } catch (error) {
    commonErrors['errorTitle'] = 'getCountryLists';
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + access_token;
    warningMessage(commonErrors, error);

  }
}
const contactListCountSearch = async (token, search, offset, limit?) => {
  return new Promise(async (resolve, reject) => {
    var options = {
      'method': 'POST',
      // 'url': 'https://api.bexio.com/2.0/contact/search',
      'url': `https://api.bexio.com/2.0/contact/search?limit=${limit}&offset=${offset}&order_by=updated_at_desc`,
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
        resolve(false)
      }
      if (response.statusCode == 200) {
        if (JSON.parse(response.body).length == limit) {
          let temp = contactListCountSearch(token, offset + 2000, 2000)
          //console.log.log('11111111111111111111111111111');

        } else {
          offset = offset + JSON.parse(response.body).length;
          //console.log.log('lengthhh',offset);
          resolve(offset)
        }
        // //console.log.log(JSON.parse(response.body).length);

        // resolve(JSON.parse(response.body).length)

      }
      else
        resolve(false)
    });
  });
}
const contactListCount = async (token, offset, limit?) => {
  return new Promise(async (resolve, reject) => {
    //console.log.log('limit',limit);
    //console.log.log('offset',offset);
    var options = {
      'method': 'GET',
      'url': `https://api.bexio.com/2.0/contact/?limit=${limit}&offset=${offset}&order_by=updated_at_desc`,
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
        resolve(false)
      }
      //console.log.log('resultLength',JSON.parse(response.body).length);

      if (response.statusCode == 200) {
        //console.log.log('JSON.parse(response.body).length',JSON.parse(response.body).length);
        //console.log.log('limit',limit);


        if (JSON.parse(response.body).length == limit) {
          let temp = await contactListCount(token, offset + 2000, 2000);
          //console.log.log('temp2565',temp);
          resolve(temp)
          //console.log.log('afterResole',temp);

        } else {
          offset = offset + JSON.parse(response.body).length;
          //console.log.log('lengthhh',offset);
          resolve(offset)
          return
        }
        // //console.log.log(JSON.parse(response.body).length);

        // resolve(JSON.parse(response.body).length)
        // resolve(offset)
      }
      else
        resolve(false)
    });
  });
}
const getContactDetails = async (access_token, id) => {
  console.log('access_token:',access_token,id);

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
          resolve(false)
        }
        if (response.statusCode == 200){
          resolve(JSON.parse(response.body));

        }
        else if(response.statusCode == 401){
          resolve(JSON.parse(response.body));

        }

      });
    });
  } catch (error) {
    commonErrors['errorTitle'] = getContactDetails.name;
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + access_token + id;
    warningMessage(commonErrors, error);

  }
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
    let options = {
      'method': 'POST',
      'url': config.PYTHON_API + 'third-party-connector',
      formData: formdata
    };
    return new Promise(function (resolve, reject) {
      request(options, async function (error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(body);
          console.log('body', body);

        } else {
          console.log('error', error);

          reject(error);
        }
      });
    });
  } catch (error) {
    commonErrors['errorTitle'] = createConnector.name;
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + params;
    warningMessage(commonErrors, error);
    console.log(JSON.stringify(commonErrors));
    console.log(error);
  }
}
const inviteCompanySend = async (params) => {
  console.log('inviteCompanySend');
  try {
    let fomdata = {
      data: params
    }
    // console.log(fomdata);

    let options = {
      'method': 'POST',
      'url': config.PYTHON_API + 'send-invitation',

      formData: fomdata
    };
    console.log(options);

    return new Promise(function (resolve, reject) {
      request(options, async function (error, response, body) {

        console.log('response*', response);

        if (!error && response.statusCode == 200) {
          resolve(body);
          console.log('body', body);

        } else {
          console.log('error', error);

          reject(error);
        }
      });
    });
  } catch (error) {
    commonErrors['errorTitle'] = inviteCompanySend.name;
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + params;
    warningMessage(commonErrors, error);
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


const getInvitationDetails = async (code): Promise<any | false> => {
  console.log('code', code);


  return new Promise(async (resolve, reject) => {
    let formData = {
      invite_code: code ? code.toString() : ''
    }
    let options = {
      'method': 'POST',
      'url': config.PYTHON_API + 'post-list/connections',
      // 'url': 'http://192.168.2.64:5005/api/'+'invite-details',
      formData: formData
    };
    console.log('options', options);

    request(options, function (error, response) {
      if (error) {
        commonErrors['errorTitle'] = 'getInvitationDetails';
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-bexio param,' + code;
        warningMessage(commonErrors, error);
        resolve(false)
      }

      // res.send(response.body)
      //console.log(response.body);
      console.log(response.body);

      if (response.statusCode == 200)

       // console.log('JSON.parse(response.body', JSON.parse(response.body))
       resolve(JSON.parse(response.body));
      else
      reject(false)

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
        method: 'POST',
        url: `${config.GATE2BURL}/post-list/connections`,
       
        formData: formData
      };
      //console.log('options',options);
      
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
