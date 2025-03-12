// gedewex773@yeafam.com
const jwt = require('jsonwebtoken');
const request = require('request');
import config from '../../common/config/index';
const  encryptionControl  = require("../../common/utils/jwt-decode");
import postgresBexio from '../../common/loaders/postgresBexio';
let bexioClienService = require("../../common/utils/bexioClient");
let bexioClient = null;
bexioClienService.edit().then( data => bexioClient = data)
import { resolve } from 'path';
import connectPostgres from '../../common/loaders/postgres';
import connectGate2b from '../../common/loaders/postgresDb';
import postgresGate2b from '../../common/loaders/postgresGate2b';
const redisClient = require('../../common/loaders/redisDB');
const mailTemplate = require('../../common/utils/mailtemplate.json');
const sendEmail = require('../../common/utils/email');
const path = require('path')
import commonErrors from '../../common/utils/commonError'
import warningMessage from '../../common/utils/warningMessage'
import connectEbill from '../../common/loaders/ebil_postgres';

const notifiBexioErrors = async(req,res) => {
    let formData = null
  
    try {
       let objectIds:any;
       let updateIds = [];

      //  v = await getErrorInvoices();
      // objectIds = "'a6ae91db-e7d1-45c9-b1e6-78e05a457863','301db6a7-e488-4f6a-8c36-951f72e84a96','0f6a6f31-6e8b-46c1-8a20-3a909dc11d1a','be313e24-de48-4662-b71d-8f40001a70cc'"

      //  let objectIds = "'6e402c63-2fc8-48ec-9c29-ee18dfe88c6b','a6ae91db-e7d1-45c9-b1e6-78e05a457863','301db6a7-e488-4f6a-8c36-951f72e84a96','0f6a6f31-6e8b-46c1-8a20-3a909dc11d1a','be313e24-de48-4662-b71d-8f40001a70cc'"
     
        objectIds = await getErrorInvoices();
        let temp = JSON.parse(objectIds).return_result;
        console.log('temp',temp);
        const rkObjectIds = Object.values(temp).map((item: { rk_objectid: string }) => item.rk_objectid.toString());
        let tempObjectId = rkObjectIds.map((x) => `'${x}'`).join(',')
        const checkExisted = `SELECT c.refreshtoken,ds.rk_invoice,ds.cid FROM companyregistered c INNER JOIN 
        documents_invoice_send ds ON ds.fk_companyregistered = c.cid
        WHERE ds.objectid IN (${tempObjectId})
        AND ds."isNotifyed" = false`
      
        // const checkExisted = `SELECT c.refreshtoken,ds.rk_invoice,ds.cid FROM companyregistered c INNER JOIN 
        //   documents_invoice_send ds ON ds.fk_companyregistered = c.cid
        //   WHERE ds.objectid IN (${objectIds})
        //   AND ds."isNotifyed" = false`
        const bexioPool = await postgresBexio;
        // const tokenSet = await bexioClient.refresh('eyJhbGciOiJub25lIn0.eyJqdGkiOiI5MmY0MDY0Zi0yN2E5LTRjOWItOTAxMi05MTg3NDg1YzU5OTAifQ.');
          
        const getInvoiceDetails = await bexioPool.query(checkExisted)
        console.log('getInvoiceDetails.rows',getInvoiceDetails.rows);
        
        if(getInvoiceDetails.rows){
            // let result = JSON.parse(objectIds)
            // console.log('result',result.data.length);
            if(getInvoiceDetails.rows.length>0){
                for  (let index = 0; index < getInvoiceDetails.rows.length; index++) {
                    const element = getInvoiceDetails.rows[index];
                    console.log('refreshTokenQueryResult.rows[0].refreshtoken',getInvoiceDetails.rows[index].refreshtoken);

                        if(getInvoiceDetails.rows[index].refreshtoken){
                            try {
                              const tokenSet = await bexioClient.refresh(getInvoiceDetails.rows[index].refreshtoken);
                              // console.log('tokenSet',tokenSet);
                              let data = await notifiBexio(tokenSet.access_token,getInvoiceDetails.rows[index].rk_invoice);
                              console.log('data',data);
                              
                              if(data)
                              updateIds.push(getInvoiceDetails.rows[index].cid)
                            } catch (error) {
                              console.log('error',error);
                              
                            }
                            // console.log('tokenSet',tokenSet);
                            // let data = await notifiBexio(tokenSet.access_token,1);
                            // console.log(data);
                            
                        }
                    // }
                }
                console.log('updateIds',updateIds);
                const updateNotifyQry = `UPDATE documents_invoice_send 
                  SET "isNotifyed" = true
                  WHERE cid IN (${updateIds})`
                  const updateNotifyResult = await bexioPool.query(updateNotifyQry)
                 console.log(updateNotifyResult.rows);
                

            }

        }
  
            return res.status(200).json({
                data: 'returnStruct',
                status_code: 200,
                message: 'success',
                status: true,
            });
        
        
        
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
  const getErrorInvoices = async ()=>{
    let searchData = {
      level:'ERROR',
      action:'PUSHINVOICE'
    }
    let returnData = {
      rk_objectid:'true'
    }
    let formData = {
      searchData :JSON.stringify(searchData),
      returnData :JSON.stringify(returnData),
    }

    return new Promise(async(resolve, reject) => {
      var options = {
        'method': 'POST',
         'url': config.LOG_GET_URL,
        //  'url': 'http://192.168.2.247:9500/getdata',
  
        'headers': {
          'Accept': 'application/json',
        }, formData: formData
      };
  
      request(options, async function (error, response) {
        console.log("response",response.body);
        
        if (error) {  
          commonErrors['errorTitle'] = 'contactListCount';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+'token';
          warningMessage(commonErrors,error);
          resolve(false)
        }
        console.log('response.body',response.body);
        console.log('response.statusCode',response.statusCode);
        
        if(response.statusCode==200){
            
            resolve(response.body)

        }
        else
        resolve(false)
      });
    });
  }
 
  const notifiBexio = async (access_token,id)=>{

    return new Promise(async(resolve, reject) => {
          var options = {
            'method': 'GET',
            'url': `https://api.bexio.com/2.0/contact/1`,
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
            // res.send(response.body)
            //console.log(response.body);
            if(response.statusCode==200)
            {
              resolve(JSON.parse(response.body));
              console.log('JSON.parse(response.body)',JSON.parse(response.body));
              
            }
            else
            resolve(false)
          });
        });
  }
module.exports={
    notifiBexioErrors,
    getErrorInvoices,
    notifiBexio
}
