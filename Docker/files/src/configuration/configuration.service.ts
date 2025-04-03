import { Injectable } from '@nestjs/common';
import { connectBexio, connectLibrary, connectGate2b, connectNewGate2b } from '../db/prisma-clients';
import config from '../common/config/index';
import * as request from 'request';
import { Request, Response } from 'express';
const encryptionControl = require("../common/utils/jwt-decode");
const jwt = require('jsonwebtoken');
const mailchimp = require("@mailchimp/mailchimp_marketing");
import { Prisma } from '@prisma/client';
const redisClient = require('../common/utils/redisDB');
import commonErrors from '../common/utils/commonError'
import warningMessage from '../common/utils/warningMessage'
const path = require('path')
@Injectable()
export class ConfigurationService {
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


            console.log('encrToken.payementStatus', encrToken.payementStatus);
            console.log('encrToken.payementStatus', encrToken.commentStatus);
            if (getStatusQryRslt?.settings !== null) {

                if (encrToken.payementStatus == 'true' || encrToken.payementStatus == 'false') {
                    let payementStatus = encrToken.payementStatus == 'true' ? '"true"' : '"false"';
                    console.log('payementStatus', payementStatus);

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
    // async getBillerDetails(req: Request, res: Response,): Promise<any> {
    //     let encrToken 
    //     try {
    //     //   const pool = await dbConn;
    //     //   const ioDb = await connectPostgres;
    //     //   console.log('req.body.encrToken',req.body.encrToken);
          
    //       encrToken = encryptionControl.decrypt(req.body.encrToken);
      
    //       if (!encrToken || !('accId' in encrToken) || !('partyId' in encrToken)) {

          
    //         const getUserPermissionsResult = await connectLibrary.$queryRaw<any>`
    //         SELECT po.policy, par.cid 
    //         FROM partyapplication_account_role par
    //         INNER JOIN partyapplication_account pa ON par.fk_partyapplication_account = pa.cid
    //         INNER JOIN partyapplication p ON p.cid = pa.fk_partyapplication 
    //         INNER JOIN role_policy rp ON rp.fk_role = par.fk_role 
    //         INNER JOIN policy po ON po.cid = rp.fk_policy
    //         INNER JOIN role r ON r.cid = rp.fk_role 
    //         WHERE fk_account = ${encrToken.accId}
    //         AND p.fk_party = ${encrToken.partyId}
    //         AND r.name LIKE '%EBILL%'
    //     `;
        
    //         if(getUserPermissionsResult.length == 0){
    //             res.send({
    //             status_code: 200,
    //             message: 'no_data_found',
    //             status: true,
    //           });
    //         }
    //       }
      
    //       const netcomId = encrToken?.netcomId;
      


    //       const getData = await c.$queryRaw<any>`
    //       SELECT
    //           eb.legalname,
    //           eb.legalname as legalName,
    //           eb.status,
    //           eb.defaultlanguage,
    //           eb.subscriptionstatus,
    //           eb.billerid,
    //           eb.companyJSON,
    //           eb.statusChangeOn,
    //           eb.created,
    //           eb.lastupdate
    //       FROM biller eb
    //       WHERE netcomid = ${netcomId}`;
    //       if (getData.recordset.length) {
    //         if (getData.recordset[0].companyJSON) {
    //           let jsonExtract = JSON.parse(getData.recordset[0].companyJSON)
    //           getData.recordset[0]['enterpriseIdentificationNumber'] = jsonExtract.enterpriseIdentificationNumber
    //         }
    //        let pythonData = await getPythonData(netcomId);
    //        let connectionData  = null   
    //        if(pythonData != null && pythonData["count"] != 0){
    //         getData.recordset[0]["fk_doc_type"] = pythonData["results"][0].fk_doc_type.id.toString()
    //         getData.recordset[0]["fk_doc_format"] = pythonData["results"][0].fk_doc_format.id.toString()
    //         getData.recordset[0]["fk_netcomid_doc_interface"] = pythonData["results"][0].fk_netcomid_doc_interface.id.toString()
    //         getData.recordset[0]["include_pdf"] = pythonData["results"][0].include_pdf
    //         connectionData = {
    //           "name": pythonData["results"][0].name,
    //           "direction": pythonData["results"][0].direction.id,
    //           "fk_doc_type": pythonData["results"][0].fk_doc_type.id,
    //           "fk_doc_format": pythonData["results"][0].fk_doc_format.id,
    //           "fk_netcomid_doc_interface": pythonData["results"][0].fk_netcomid_doc_interface.id,
    //           "fk_encoding_details": pythonData["results"][0].fk_encoding_details.id,
    //           "fk_culture": pythonData["results"][0].fk_culture.id,
    //           "include_pdf": pythonData["results"][0].include_pdf,
    //           "allow_duplicate": pythonData["results"][0].allow_duplicate,
    //           "file_export_filename": pythonData["results"][0].file_export_filename,
    //           "create-pdf": pythonData["results"][0].config.service["create-pdf"]["create-pdf"],
    //           "create-signed-doc": pythonData["results"][0].config.service["create-signed-doc"]["create-signed-doc"],
    //           "export-doc-ref":pythonData["results"][0].config.service["export-doc-ref"]["export-doc-ref"],
    //           "validate-sign": pythonData["results"][0].config.service["validate-sign"]["validate-sign"],
    //           "netcom_id":pythonData["results"][0].netcom_id,
    //           "con_id": pythonData["results"][0].id,
    //           "process_name": pythonData["results"][0].fk_process_name,
    //           "ebill":"true",
    //           "signed-document": pythonData["results"][0].config.service["create-signed-doc"]["signed-document"],
    //           "signed-file-name": pythonData["results"][0].config.service["create-signed-doc"]["signed-file-name"],
    //           "attach-validation-report": pythonData["results"][0].config.service["create-signed-doc"]["attach-validation-report"],
    //           "export-validation-report": pythonData["results"][0].config.service["create-signed-doc"]["export-validation-report"],
    //           "validation-file-name": pythonData["results"][0].config.service["create-signed-doc"]["validation-file-name"]
    //        }
    //        }
    //        else{
    //         getData.recordset["fk_doc_type"] = ''
    //         getData.recordset["fk_doc_format"] = ''
    //         getData.recordset["fk_netcomid_doc_interface"] = ''
    //         getData.recordset["include_pdf"] = '' 
    //        }     
    //        res.send({
    //           data: getData.recordset,
    //           pythonData:connectionData,
    //           status_code: 200,
    //           message: 'basic_informations',
    //           status: true,
    //         });
    //       }
    //       else {
    //         res.send({
    //           status_code: 200,
    //           message: 'no_data_found',
    //           status: true,
    //         });
    //       }
      
    //     }
    //     catch (error) {
    //       let responseValue = JSON.stringify(encrToken)
    //       commonErrors['errorTitle'] = req.originalUrl;
    //       commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + responseValue;
    //       warningMessage(commonErrors, error);
    //       res.send({
    //         status_code: 500,
    //         message: 'something_went_wrong',
    //         status: false,
    //       });
    //     }
    //   }

}
const getPythonData = async(netcomId)=>{
    return new Promise(async (resolve, reject) => {
    let responseData = null
    try {
    let search = ""
    let page_number= "1"
    let records_per_page = "5"
    let limit = "5"
    let offset = "0"
    let netcom_id = netcomId
    let ebill = "true"
      const options = {
        method: 'POST',
        url: `${config.GATE2BURL}post-list/connections`,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        form: { 
          'search': search,
          'page_number':page_number,
          'records_per_page':records_per_page,
          'limit':limit,
          'offset':offset,
          'netcom_id':netcom_id,
          'ebill':ebill
        }
      };
      await request(options, async function (error, response) {
        if(error){
          commonErrors['errorTitle'] = 'getPythonData';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString();
          warningMessage(commonErrors, error);
          return resolve(error)
        }
        else{
          try{
          responseData = JSON.parse(response.body)
          return resolve(responseData)
          }
          catch{
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