// gedewex773@yeafam.com
const jwt = require('jsonwebtoken');
const request = require('request');
import config from '../../common/config/index';
const  encryptionControl  = require("../../common/utils/jwt-decode");
let { Issuer, generators } = require('openid-client');
const code_verifier = generators.codeVerifier();
const code_challenge = generators.codeChallenge(code_verifier);
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
const { Kafka } = require("kafkajs")

const sendEmail = require('../../common/utils/email');
var xml2js = require('xml2js');
const path = require('path')
import commonErrors from '../../common/utils/commonError'
import warningMessage from '../../common/utils/warningMessage'
import { errorMonitor } from 'stream';
import connectEbill from '../../common/loaders/ebil_postgres';
const crypto = require("crypto");
import addlogs from '../../common/utils/addLogs';
import logs from '../../common/utils/actionLogTemplate';
import dbConn from '../../common/loaders/ebil_postgres';
import { isArray } from 'util';
// const worker = require('node:worker_threads'); 
const getConfigData = require('../../common/utils/getCommissionAgentData');
const mailchimp = require("@mailchimp/mailchimp_marketing");

const { Worker, isMainThread } = require('worker_threads');

// const redisClient = require('../../common/loaders/redisDB');

// var jwt = require('jsonwebtoken');
var open = require('open');
const fs = require('fs')
const fetchEmailContent = require('../../common/utils/fetchEmailData');

// lavoy97140@xindax.com
const testApi = async (access_token,id)=>{
  // let params = JSON.parse(config.BEXIO_CONNECTION_CONFIG);
  //  let parms = config.BEXIO_CONNECTION_CONFIG
  //             .replace('$netcom_id$','41420-0000411883-78')
  //             .replace("$name$",'TEST company')

  // params.config.netcom_id = '41420-0000411883-78';
  // params.config.name = 'TEST company';
  // console.log(JSON.stringify(params));
  // await setBusinessConnector1(parms);

  // let v ='<OPENTRANS xmlns:iomarket="http://tempuri.org/io-market/openTRANS_UDX" xmlns:bmecat="http://www.bmecat.org/bmecat/2005" xmlns="http://www.opentrans.org/XMLSchema/2.1"><INVOICE version="2.1" ><INVOICE_HEADER><INVOICE_INFO><INVOICE_ID>INV22030101</INVOICE_ID><INVOICE_DATE>2022-03-02T00:00:00</INVOICE_DATE><PARTIES><PARTY><bmecat:PARTY_ID type="netcomid">41420-0000411424-04</bmecat:PARTY_ID><ADDRESS><bmecat:NAME>io-market AG</bmecat:NAME><bmecat:STREET>Kanalstrasse 32</bmecat:STREET><bmecat:ZIP>9490</bmecat:ZIP><bmecat:CITY>Vaduz</bmecat:CITY><bmecat:COUNTRY>Liechtenstein</bmecat:COUNTRY><bmecat:COUNTRY_CODED>LI</bmecat:COUNTRY_CODED><bmecat:VAT_ID>CHE-354.618.912 MWST</bmecat:VAT_ID></ADDRESS></PARTY><PARTY><bmecat:PARTY_ID type="supplier_specific">1000394</bmecat:PARTY_ID><PARTY_ROLE>invoice_recipient</PARTY_ROLE><ADDRESS><bmecat:NAME>io-market AG</bmecat:NAME><CONTACT_DETAILS><bmecat:CONTACT_NAME>Kohler</bmecat:CONTACT_NAME><bmecat:FIRST_NAME>Daniel</bmecat:FIRST_NAME><bmecat:EMAILS><bmecat:EMAIL>d.kohler@io-market.com</bmecat:EMAIL></bmecat:EMAILS></CONTACT_DETAILS><bmecat:STREET>Kanalstrasse 32</bmecat:STREET><bmecat:ZIP>9490</bmecat:ZIP><bmecat:CITY>Vaduz</bmecat:CITY><bmecat:COUNTRY>Liechtenstein</bmecat:COUNTRY><bmecat:COUNTRY_CODED>LI</bmecat:COUNTRY_CODED></ADDRESS></PARTY></PARTIES><INVOICE_ISSUER_IDREF type="netcomid">41420-0000411424-04</INVOICE_ISSUER_IDREF><INVOICE_RECIPIENT_IDREF type="supplier_specific">1000394</INVOICE_RECIPIENT_IDREF><bmecat:CURRENCY>CHF</bmecat:CURRENCY><PAYMENT><ACCOUNT><HOLDER>io-market AG</HOLDER><BANK_ACCOUNT type="iban">LI1330172000020779447</BANK_ACCOUNT><BANK_CODE type="bic">LILALI2XXXX</BANK_CODE><BANK_NAME>Liechtensteinische Landesbank</BANK_NAME><BANK_COUNTRY>LI</BANK_COUNTRY></ACCOUNT><PAYMENT_TERMS><TIME_FOR_PAYMENT><DAYS>30</DAYS></TIME_FOR_PAYMENT><VALUE_DATE>2022-04-01T00:00:00</VALUE_DATE></PAYMENT_TERMS></PAYMENT><HEADER_UDX><IOM.SYS><PAYED status="true/false"><CARD type="VISA/MasterCard"><CARD_NUM>0000 00000 0000 0000</CARD_NUM><CARD_HOLDER_NAME>Daniel Kohler</CARD_HOLDER_NAME><TRANSACTION_NUM>123456789</TRANSACTION_NUM></CARD><PAYPAL></PAYPAL><CRYPTO></CRYPTO></PAYED></IOM.SYS></HEADER_UDX></INVOICE_INFO></INVOICE_HEADER><INVOICE_ITEM_LIST><INVOICE_ITEM type="order_item"><LINE_ITEM_ID>10</LINE_ITEM_ID><PRODUCT_ID><bmecat:SUPPLIER_PID>123</bmecat:SUPPLIER_PID><bmecat:DESCRIPTION_SHORT>Abo IOM - Februar 2022</bmecat:DESCRIPTION_SHORT><bmecat:DESCRIPTION_LONG>Abo für IOM Service monatlich</bmecat:DESCRIPTION_LONG></PRODUCT_ID><QUANTITY>1</QUANTITY><bmecat:ORDER_UNIT>C62</bmecat:ORDER_UNIT><PRODUCT_PRICE_FIX><bmecat:PRICE_AMOUNT>10.0</bmecat:PRICE_AMOUNT><TAX_DETAILS_FIX><bmecat:TAX_TYPE>vat</bmecat:TAX_TYPE><bmecat:TAX>0.077</bmecat:TAX><TAX_AMOUNT>0.77</TAX_AMOUNT></TAX_DETAILS_FIX><bmecat:PRICE_QUANTITY>1</bmecat:PRICE_QUANTITY></PRODUCT_PRICE_FIX><PRICE_LINE_AMOUNT>10.0</PRICE_LINE_AMOUNT></INVOICE_ITEM><INVOICE_ITEM type="order_item"><LINE_ITEM_ID>20</LINE_ITEM_ID><PRODUCT_ID><bmecat:SUPPLIER_PID>321</bmecat:SUPPLIER_PID><bmecat:DESCRIPTION_SHORT>Abo EDI - Februar 2022</bmecat:DESCRIPTION_SHORT><bmecat:DESCRIPTION_LONG>Abo für EDI Service monatlich</bmecat:DESCRIPTION_LONG></PRODUCT_ID><QUANTITY>1</QUANTITY><bmecat:ORDER_UNIT>C62</bmecat:ORDER_UNIT><PRODUCT_PRICE_FIX><bmecat:PRICE_AMOUNT>10.0</bmecat:PRICE_AMOUNT><TAX_DETAILS_FIX><bmecat:TAX_TYPE>vat</bmecat:TAX_TYPE><bmecat:TAX>0.077</bmecat:TAX><TAX_AMOUNT>0.77</TAX_AMOUNT></TAX_DETAILS_FIX><bmecat:PRICE_QUANTITY>1</bmecat:PRICE_QUANTITY></PRODUCT_PRICE_FIX><PRICE_LINE_AMOUNT>10.0</PRICE_LINE_AMOUNT></INVOICE_ITEM><INVOICE_ITEM type="order_item"><LINE_ITEM_ID>30</LINE_ITEM_ID><PRODUCT_ID><bmecat:SUPPLIER_PID>111</bmecat:SUPPLIER_PID><bmecat:DESCRIPTION_SHORT>Book</bmecat:DESCRIPTION_SHORT><bmecat:DESCRIPTION_LONG>Book</bmecat:DESCRIPTION_LONG></PRODUCT_ID><QUANTITY>1</QUANTITY><bmecat:ORDER_UNIT>C62</bmecat:ORDER_UNIT><PRODUCT_PRICE_FIX><bmecat:PRICE_AMOUNT>10.0</bmecat:PRICE_AMOUNT><TAX_DETAILS_FIX><bmecat:TAX_TYPE>vat</bmecat:TAX_TYPE><bmecat:TAX>0.025</bmecat:TAX><TAX_AMOUNT>0.25</TAX_AMOUNT></TAX_DETAILS_FIX><bmecat:PRICE_QUANTITY>1</bmecat:PRICE_QUANTITY></PRODUCT_PRICE_FIX><PRICE_LINE_AMOUNT>10.0</PRICE_LINE_AMOUNT></INVOICE_ITEM></INVOICE_ITEM_LIST><INVOICE_SUMMARY><TOTAL_ITEM_NUM>3</TOTAL_ITEM_NUM><NET_VALUE_GOODS>30.00</NET_VALUE_GOODS><TOTAL_AMOUNT>31.80</TOTAL_AMOUNT><TOTAL_TAX><TAX_DETAILS_FIX><bmecat:TAX_TYPE>vat</bmecat:TAX_TYPE><bmecat:TAX>0.025</bmecat:TAX><TAX_AMOUNT>0.25</TAX_AMOUNT></TAX_DETAILS_FIX></TOTAL_TAX><TOTAL_TAX><TAX_DETAILS_FIX><bmecat:TAX_TYPE>vat</bmecat:TAX_TYPE><bmecat:TAX>0.077</bmecat:TAX><TAX_AMOUNT>1.54</TAX_AMOUNT></TAX_DETAILS_FIX></TOTAL_TAX></INVOICE_SUMMARY></INVOICE></OPENTRANS>'
}
const authorization = async (req,res,next)=>{
  try {

        let url = bexioClient.authorizationUrl({
            scope: config.BEXIO_SCOPE,
            resource: 'https://idp.bexio.com/authorize',
            code_challenge,
            code_challenge_method: 'S256',
        });
       res.send({data:url});
       
      } catch (error) {
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString();
        warningMessage(commonErrors,error);
        fs.writeFile('assets/errorLog.txt', JSON.stringify(error), function () {
          res.send();
        });
    }
    
}

const bexioRedirect = async (req, res, next) => {
  let params = null;
  let pool = await connectPostgres;
  let data =req.body
  try {

      console.log('bexioRedirect');
      
      let issuer = await Issuer.discover('https://idp.bexio.com');
      console.log('API_URL',config.API_URL);
      params = bexioClient.callbackParams(req);
      console.log('params',params);
      console.log('redirect',`${config.API_URL}api/v1/gate2bAPI/bexio-redirect`);
      let tokenSet = await bexioClient.callback(`${config.API_URL}api/v1/gate2bAPI/bexio-redirect`, params, {
          code_verifier
      });
      console.log('tokenSet');
      console.log(tokenSet);
      let companyDetails;
      let temp = await getloginUserCompanyDetails(tokenSet.access_token);
      if(!temp)
      {
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'getloginUserCompanyDetails_not_found -req param,',JSON.stringify(req.body);
        warningMessage(commonErrors,'getloginUserCompanyDetails_not_found');
        res.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
        return;
      }
      companyDetails = temp;
      console.log(companyDetails);
      let tempJson = JSON.parse(companyDetails)[0];
      if(tempJson['country_name'] == '' || tempJson['name'] == '' || tempJson['address'] == '' || tempJson['city'] == '' || tempJson['postcode'] == '' || tempJson['country_id'] == '')
      {
        
        res.redirect(`${config.BEXIO_APP_URL}#/login/unauthorized`);
        return;
      }
      const validation = async (data, fields) => {
          let status;
          for (const element of fields) {

              if (!data[element]) {
                console.log(element);
                return false;

              }
          }
          return true;
      };
      let validationCompanyStatus;
      console.log(JSON.parse(companyDetails));
      
      let coutryCode = await getConutryCode(tokenSet.access_token, JSON.parse(companyDetails)[0]['country_name'])
      if(!coutryCode)
      {
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'getConutryCode_not_found -req param,',JSON.parse(req.body);
        warningMessage(commonErrors,'getConutryCode_not_found');
        res.end({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
      });
      return
      }
      companyDetails ? validationCompanyStatus = await validation(JSON.parse(companyDetails)[0], ['name', 'address', 'city', 'postcode', 'country_id']) : '';
      console.log('validationCompanyStatus',validationCompanyStatus);
      console.log('companyDetails',companyDetails);
      let token = tokenSet.refresh_token;
      let userDetails
      userDetails = await getLoginUserInfo(tokenSet.access_token)
      console.log(tokenSet.access_token);
      if(!userDetails)
      {
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'getLoginUserInfo_not_found -req param,',JSON.stringify(req.body);
        warningMessage(commonErrors,'getLoginUserInfo_not_found');
        res.end({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
      }); 
      return
      }
      let validationUserStatus;
      userDetails ? validationUserStatus = await validation(JSON.parse(userDetails), ['given_name', 'family_name', 'email']) : '';
      console.log('validationCompanyStatus',validationCompanyStatus);
      console.log('userDetails',userDetails);

      
      if (validationUserStatus && validationCompanyStatus) {
          let rolesDetails;
          rolesDetails = await getLoginUserRoles(tokenSet.access_token);
          if(!rolesDetails)
          {
            commonErrors['errorTitle'] = req.originalUrl;
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'getLoginUserRoles_not_found -req param,',JSON.stringify(req.body);
            warningMessage(commonErrors,'getLoginUserRoles_not_found');
            res.end({
              status_code: 500,
              message: 'something_went_wrong',
              status: false,
          });
          return
          }
          
          let isAdmin;
          if (rolesDetails.indexOf('is_superadmin') != -1) {
              isAdmin = true;
          } else {
              isAdmin = false;
          }
          
          let companyCreateStatus = await checkCompanyStatus(JSON.parse(companyDetails)[0]['name'],isAdmin);
          console.log('companyCreateStatus',companyCreateStatus);
          if(companyCreateStatus)
          {  
            let bexioPool = await postgresBexio;
            let token = tokenSet.access_token;
            let refreshToken = tokenSet.refresh_token;

            let rk_csn = jwt.decode(token )['company_id']
            var check = `SELECT *  FROM companyregistered WHERE rk_csn =$1`;
            const isCompanyAlreadyExists = await bexioPool.query(check, [rk_csn]);
            if(isCompanyAlreadyExists.rows.length == 0)  
            {
              
              const insertData = `INSERT INTO activation(detail) VALUES($1) RETURNING objectid`
              const getUserResult = await pool.query(insertData, [userDetails]);
              
              let bexioTokenCookie = { 
                access_Token:tokenSet.access_token,
                refresh_Token:tokenSet.refresh_token,
                isBexioUser:true
              }
              console.log('cokieeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
              
              let billingCookie = { 
                bexio:true,
                objectid:getUserResult.rows[0].objectid
              }
              res.cookie(config.BILLING_COOKIE_NAME, encryptionControl.encrypt(JSON.stringify(billingCookie)), {
                domain: config.SESSION_DOMAIN,
                maxAge: config.SESSION_EXPIRY,
                httpOnly: false,
                signed: false,
                secure: false
              });
              res.cookie(config.TOKEN_COOKIE_BEXIO_NAME, encryptionControl.encrypt(JSON.stringify(bexioTokenCookie)), {
                  domain: config.SESSION_DOMAIN,
                  maxAge: config.SESSION_EXPIRY,
                  httpOnly: true,
                  signed: true,
                  secure: true
              });
              let defaultConfig = await getConfigData(config.DOMAIN_NAME);
              let bexioURL = config.BILLING_APP;
              res.redirect(`${bexioURL}`);
              console.log('login into billing');
              return;
             }else{
                let responseResult = await bexioUserCreate(userDetails, companyDetails, tokenSet.access_token, isAdmin, coutryCode,res,req)
                console.log('responseResult', responseResult);
                if(responseResult.status)
                  {
                    logs.action = 'BEXIO_LOGIN';
                    logs.level = 'NOTIFICATION';
                    logs.item = 'EDI';
                    // addlogs(logs,data.rolePartyId,data.roleAccId);
                    console.log('BEXIO_APP_URL',config.BEXIO_APP_URL);
                    console.log(`${config.BEXIO_APP_URL}#/landing/${encodeURIComponent(encryptionControl.encrypt(refreshToken))}/${encodeURIComponent(encryptionControl.encrypt(responseResult.partyAccountId.toString()))}`);
                    res.redirect(`${config.BEXIO_APP_URL}#/landing/${encodeURIComponent(encryptionControl.encrypt(refreshToken))}/${encodeURIComponent(encryptionControl.encrypt(responseResult.partyAccountId.toString()))}/${encodeURIComponent(encryptionControl.encrypt(responseResult.isNewCompany.toString()))}`)
                  }
                else
                  {
                console.log('111');
                  
                    res.redirect(`${config.BEXIO_APP_URL}#/login/error`);
                    return;
                  }
             }


          

          
              // something went wrong
          }
          else{
            res.redirect(`${config.BEXIO_APP_URL}#/login/permissiondenied`);
            return;

            // permission
        }
      } else {
        console.log('258258');
        
          res.redirect(`${config.BEXIO_APP_URL}#/login/unauthorized`);
          return;
          // Correct
      }

  } catch (error) {
   
      logs.action = 'BEXIO_LOGIN';
      logs.level = 'ERROR';
      logs.item = 'EDI';
      // addlogs(logs,data.rolePartyId,data.roleAccId);
      console.log('error',error);
      console.log(config.BEXIO_APP_URL);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+params;  
        warningMessage(commonErrors,error);
       res.redirect(`${config.BEXIO_APP_URL}#/login/error`);
    
  }
};
const bexioCompanyCreate = async (req, res, next) => {
  let params = null;
  let pool = await connectPostgres;
  let data =req.body,decryptData;

  try {
      decryptData = encryptionControl.decrypt(req.body.encrToken);
      if('subScriptionType' in decryptData && 'planId' in decryptData)
      {

        let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
        let refreshToken = cookie.refresh_Token;
        const tokenSet = await bexioClient.refresh(refreshToken);
        console.log(tokenSet);
        let planId = decryptData?.planId;
        let subScriptionType = decryptData?.subScriptionType;
        // console.log('bexioRedirect');
        
        // let issuer = await Issuer.discover('https://idp.bexio.com');
        // console.log('API_URL',config.API_URL);
        // params = bexioClient.callbackParams(req);
        // console.log('params',params);
        // console.log('redirect',`${config.API_URL}api/v1/gate2bAPI/bexio-redirect`);
        // let tokenSet = await bexioClient.callback(`${config.API_URL}api/v1/gate2bAPI/bexio-redirect`, params, {
        //     code_verifier
        // });
        // console.log('tokenSet');
        // console.log(tokenSet);

        let companyDetails;
        let temp = await getloginUserCompanyDetails(tokenSet.access_token);
        if(!temp)
        {
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'getloginUserCompanyDetails_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'getloginUserCompanyDetails_not_found');
          res.send({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
          });
          return;
        }
        companyDetails = temp;
        console.log(companyDetails);
        let tempJson = JSON.parse(companyDetails)[0];
        if(tempJson['country_name'] == '' || tempJson['name'] == '' || tempJson['address'] == '' || tempJson['city'] == '' || tempJson['postcode'] == '' || tempJson['country_id'] == '')
        {
          
          res.redirect(`${config.BEXIO_APP_URL}#/login/unauthorized`);
          return;
        }
        const validation = async (data, fields) => {
            let status;
            for (const element of fields) {

                if (!data[element]) {
                  console.log(element);
                  return false;

                }
            }
            return true;
        };
        let validationCompanyStatus;
        console.log(JSON.parse(companyDetails));
        
        let coutryCode = await getConutryCode(tokenSet.access_token, JSON.parse(companyDetails)[0]['country_name'])
        if(!coutryCode)
        {
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'getConutryCode_not_found -req param,',JSON.parse(req.body);
          warningMessage(commonErrors,'getConutryCode_not_found');
          res.end({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
        });
        return
        }
        companyDetails ? validationCompanyStatus = await validation(JSON.parse(companyDetails)[0], ['name', 'address', 'city', 'postcode', 'country_id']) : '';
        console.log('validationCompanyStatus',validationCompanyStatus);
        console.log('companyDetails',companyDetails);
        let token = tokenSet.refresh_token;
        let userDetails
        userDetails = await getLoginUserInfo(tokenSet.access_token)
        console.log(tokenSet.access_token);
        if(!userDetails)
        {
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'getLoginUserInfo_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'getLoginUserInfo_not_found');
          res.end({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
        }); 
        return
        }
        let validationUserStatus;
        userDetails ? validationUserStatus = await validation(JSON.parse(userDetails), ['given_name', 'family_name', 'email']) : '';
        console.log('validationCompanyStatus',validationCompanyStatus);
        console.log('userDetails',userDetails);

        
        if (validationUserStatus && validationCompanyStatus) {
            let rolesDetails;
            rolesDetails = await getLoginUserRoles(tokenSet.access_token);
            if(!rolesDetails)
            {
              commonErrors['errorTitle'] = req.originalUrl;
              commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'getLoginUserRoles_not_found -req param,',JSON.stringify(req.body);
              warningMessage(commonErrors,'getLoginUserRoles_not_found');
              res.end({
                status_code: 500,
                message: 'something_went_wrong',
                status: false,
            });
            return
            }
            
            let isAdmin;
            if (rolesDetails.indexOf('is_superadmin') != -1) {
                isAdmin = true;
            } else {
                isAdmin = false;
            }
            
            let companyCreateStatus = await checkCompanyStatus(JSON.parse(companyDetails)[0]['name'],isAdmin);
            console.log('companyCreateStatus',companyCreateStatus);
            if(companyCreateStatus)
            {  
              let responseResult = await bexioUserCreate(userDetails, companyDetails, tokenSet.access_token, isAdmin, coutryCode,res,req)
              console.log('responseResult', responseResult);
              if(responseResult.status)
                {
                  const options = {
                    domain: config.SESSION_DOMAIN,
                  };
                 
                  let billingCookie = JSON.parse(encryptionControl.decryptCookie(req.cookies[config.BILLING_COOKIE_NAME]));
                  console.log("Object ID:", billingCookie.objectid );
                  const delUserDetailsQry = `DELETE FROM activation WHERE objectid = $1`
                  await pool.query(delUserDetailsQry, [billingCookie.objectid ]);
                  // res.clearCookie(config.BILLING_COOKIE_NAME, options);
                  logs.action = 'BEXIO_LOGIN';
                  logs.level = 'NOTIFICATION';
                  logs.item = 'EDI';
                  // addlogs(logs,data.rolePartyId,data.roleAccId);
                  console.log('BEXIO_APP_URL',config.BEXIO_APP_URL);
                  console.log(`${config.BEXIO_APP_URL}#/landing/${encodeURIComponent(encryptionControl.encrypt(token))}/${encodeURIComponent(encryptionControl.encrypt(responseResult.partyAccountId.toString()))}`);
                  res.send({
                    status_code: 200,
                    message: 'success',
                    status: true,
                    redirectUrl:`${config.BEXIO_APP_URL}#/landing/${encodeURIComponent(encryptionControl.encrypt(token))}/${encodeURIComponent(encryptionControl.encrypt(responseResult.partyAccountId.toString()))}/${encodeURIComponent(encryptionControl.encrypt(responseResult.isNewCompany.toString()))}`
                  });
                  return;
                  // res.redirect(`${config.BEXIO_APP_URL}#/landing/${encodeURIComponent(encryptionControl.encrypt(token))}/${encodeURIComponent(encryptionControl.encrypt(responseResult.accountId.toString()))}/${encodeURIComponent(encryptionControl.encrypt(responseResult.isNewCompany.toString()))}`)
                }
              else
                {
              console.log('111');
                
                  // res.redirect(`${config.BEXIO_APP_URL}#/login/error`);
                  res.send({
                    status_code: 200,
                    message: 'success',
                    status: true,
                    redirectUrl:`${config.BEXIO_APP_URL}#/login/error`
                  });
                  return;

                }
                // something went wrong
            }
            else{
              res.send({
                status_code: 200,
                message: 'success',
                status: true,
                redirectUrl:`${config.BEXIO_APP_URL}#/login/permissiondenied`
              });
              return;
              // res.redirect(`${config.BEXIO_APP_URL}#/login/permissiondenied`);
              // return;

              // permission
          }
        } else {
          console.log('258258');
          
            // res.redirect(`${config.BEXIO_APP_URL}#/login/unauthorized`);
            res.send({
              status_code: 200,
              message: 'success',
              status: true,
              redirectUrl:`${config.BEXIO_APP_URL}#/login/unauthorized`
            });
            return;
            // Correct
          }
      }else{
        res.send({
          status_code: 500,
          message: 'validation_error',
          status: false,
          
        });
      }


  } catch (error) {
   
      logs.action = 'BEXIO_LOGIN';
      logs.level = 'ERROR';
      logs.item = 'EDI';
      // addlogs(logs,data.rolePartyId,data.roleAccId);
      console.log('error',error);
      console.log(config.BEXIO_APP_URL);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+params;  
        warningMessage(commonErrors,error);
       res.redirect(`${config.BEXIO_APP_URL}#/login/error`);
    
  }
};
async function checkCompanyStatus(companyName,isAdmin){
  try {
    
    let pool = await connectPostgres;

    
      var checkCompanyDetails = `SELECT * 
      FROM legalParty
      WHERE companyname = $1`;
    
    const checkUserDetails = await pool.query(checkCompanyDetails, [companyName]);
    console.log(checkUserDetails.rows);
    
    if(checkUserDetails.rows.length != 0)
    {
      return true;
    }else if(isAdmin){
      return true;
    }else{
      return false;
      
    }
    
  } catch (error) {
      commonErrors['errorTitle'] = checkCompanyStatus.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+companyName;
      warningMessage(commonErrors,error);
    console.log(error);
    throw error;
  }
}
async function getConutryCode(token,country){
  // country_id: 1,
  // country_name: 'Schweiz',
  return new Promise(async(resolve, reject) => {
    var options = {
      'method': 'POST',
      'url': 'https://api.bexio.com/2.0/country/search',
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer '+token,
        'Content-Type': 'text/plain'
      },
      body: `[{"field": "name","value": "${country}","criteria": "="}]`
    
    };
    request(options, function (error, response) {
      if (error) {  
        commonErrors['errorTitle'] = 'getConutryCode';
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+token+' '+country;
        warningMessage(commonErrors,error);
        resolve(false)
      }
    
      // if(JSON.parse(response.body)[0].length != 0)
      if(response?.statusCode==200)
      {console.log(response.body);
      
        resolve (JSON.parse(response.body)[0]?.iso_3166_alpha2);}
       else
       resolve(false)
    });
  });
  }
async function getLoginUserInfo(token) {
  return new Promise(async(resolve, reject) => {

    var options = {
      'method': 'GET',
      'url': 'https://idp.bexio.com/userinfo',
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer '+token
      }
  
    };
    request(options, function (error, response) {
      if (error) {  
        commonErrors['errorTitle'] = 'getLoginUserInfo';
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+token;
        warningMessage(commonErrors,error);
        resolve(false)
      }
    
      if(response.statusCode==200)
         return resolve(response.body)
      else
        return resolve(false)
      // console.log('loginuserResult',response.body);
      
     
      
      // res.send(response.body)
    });
  });
}
const getAccessToken = async (req,res)=>{
  let cookie = null;
  let isNewCompany;
  const postgresPool = await connectPostgres;
  let formData = req.body;
  try {
    // let pool = await connectPostgres;
   
    console.log(req.cookies);
    isNewCompany = encryptionControl.decryptCookie(decodeURIComponent(formData['isNewCompany']));

    console.log('isNewCompanyisNewCompany',isNewCompany);
    
    let pool = await connectPostgres;
    cookie = JSON.parse(encryptionControl.decryptCookie(req.cookies[config.EXPIRE_EXPIRES_COOKIE_NAME]));
     console.log(cookie);
     var checkUserDetails = ` SELECT pa.isuser,pa.cid AS partyAccountId,email,u.cid AS userId,pa.fk_party AS partyId,a.cid AS accountId,u."language" as userlanguage 
     FROM party_account pa
      INNER JOIN account a
      ON a.cid = pa.fk_account
      INNER JOIN public.user u ON u.cid = a.fk_user
      INNER JOIN status s ON s.cid = pa.fk_status
     WHERE pa.fk_party = $1
      AND pa.fk_account = $2
      AND s."statusLabel" = 'active'`;

     const userDetails = await pool.query(checkUserDetails, [cookie.partyID,cookie.accId]);
     const data = {
      email: userDetails.rows[0].email,
      userId: userDetails.rows[0].userid,
    };
    const accessToken = jwt.sign(data, config.SECRET_JWT, { expiresIn: config.JWTExpiration });
    const refreshToken = jwt.sign(data, config.SECRET_REFRESH_JWT, {
        expiresIn: config.JWTRefreshExpiration,
    });
    req.session.isAuth = true;

    let tokenCookie = { 
      accessToken:accessToken,
      refreshToken:refreshToken,
      userMail: userDetails.rows[0].email,
      partyID: userDetails.rows[0].partyid,
      userID: userDetails.rows[0].userid,
      accId: userDetails.rows[0].accountid,
      isBexioCompany:true,
      netcomId:cookie.netcomid

    }
    res.cookie(config.TOKEN_COOKIE_NAME, encryptionControl.encrypt(JSON.stringify(tokenCookie)), {
        domain: config.SESSION_DOMAIN,
        maxAge: config.SESSION_EXPIRY,
        httpOnly: true,
        signed: true,
        secure: true
    });
    let email = userDetails.rows[0].email;
    console.log('email',email);
    console.log('req.sessionID',req.sessionID);
    console.log(req.sessionID);

    let userLanguage = userDetails.rows[0].userlanguage ? userDetails.rows[0].userlanguage : 'de';
    
  
    const searchQuery = `SELECT * FROM authTable 
                WHERE  mail= $1 AND sessionId = $2`;
    const selectResult = await postgresPool.query(searchQuery, [email, req.sessionID]);
    // console.log('selectResult',selectResult);
    console.log('selectResult.rowCount',selectResult.rowCount);
    if (selectResult.rowCount === 0) {
        const insertAuthQry = `INSERT INTO
                    authTable (mail, refreshToken, sessionId, accessToken) 
                    VALUES( $1,$2,$3,$4)`;
    console.log('INSERT start');

        await postgresPool.query(insertAuthQry, [email, refreshToken, req.sessionID, accessToken]);
    console.log('INSERT end');

    } else {
        const updateQry = `UPDATE  authTable 
                  SET refreshToken = $1,
                  accessToken = $2
                  WHERE mail= $3 AND sessionId = $4`;
        await postgresPool.query(updateQry, [refreshToken, accessToken, email, req.sessionID]);
        const deleteOldTokens50thFromGeneratedNow = `
            DELETE FROM public.authtable
            WHERE mail = $1
            AND  "id" NOT IN (
            SELECT "id" FROM public.authtable
            WHERE mail = $1
            ORDER BY timestamp DESC
            LIMIT 50)`;
        await postgresPool.query(deleteOldTokens50thFromGeneratedNow, [email]);

  }
  if(isNewCompany == "true"){
    await  gate2bRegisterInBexio(userLanguage || 'de',formData.module,userDetails.rows[0].email);
  }
    console.log('formData.module',formData.module);
  
    if(formData.module == 'EBILL')
    {
      let checkRoleQry = `SELECT * 
      FROM 
      partyapplication_account_role par
      INNER JOIN partyapplication_account paa ON par.fk_partyapplication_account = paa.cid
      INNER JOIN party_account pa ON paa.fk_party_account = pa.cid
      INNER JOIN role_spr rs ON rs.fk_role = par.fk_role
      INNER JOIN spr s ON s.cid = rs.fk_spr
      INNER JOIN role r on par.fk_role = r.cid
      INNER JOIN status st on st.cid = pa.fk_status
      WHERE pa.fk_account=$1 AND s.code = 'EN' AND pa.fk_party =$2  AND r.name IN('EBILL_ADMIN','EBILL_USER')`

    const checkRoleData = await pool.query(checkRoleQry,[userDetails.rows[0].accountid,userDetails.rows[0].partyid]);
    console.log('checkRoleData',checkRoleData.rows);
    if(checkRoleData.rows.length == 0){
      await setEbillRole(userDetails.rows[0].partyid,userDetails.rows[0].accountid,userDetails.rows[0].partyaccountid,userDetails.rows[0].isuser,formData.module);
      await partyServiceUpdate(userDetails.rows[0].partyid,'EBILL','EDI');

    }
    }
   
    
    await getUserPermissions(userDetails.rows[0].partyid,userDetails.rows[0].accountid);
    res.send({
      status_code: 200,
      message: '',
      status: true,
      data:encryptionControl.encrypt(userDetails.rows[0].partyid)
  });

  } catch (error) { 
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+cookie;
    warningMessage(commonErrors,error);
    console.log(error);
    res.send({
      status_code: 500,
      message: JSON.stringify(error),
      status: false,
  });
    
  }
}

const getToken = async (req,res,next)=>{
  let partyAccountId = null;
  let isNewCompany;
  let data =req.body;
  partyAccountId = encryptionControl.decryptCookie(decodeURIComponent(req.body['partyAccount']));
  let pool = await connectPostgres;
  try {
   
    // console.log('isNewCompany',isNewCompany);
    
    // let invitedId = encryptionControl.decryptCookie(decodeURIComponent(req.body['invitedId']));

    
     let gate2b = await connectGate2b;
     let bexioPool = await postgresBexio;
     

    //  console.log(invitedId);
     
  
     var checkUserDetails = `SELECT email,u.cid AS userId,pa.fk_party AS partyId,a.cid AS accountId,p.objectid
      FROM party_account pa
        INNER JOIN account a
        ON a.cid = pa.fk_account
        INNER JOIN public.user u ON u.cid = a.fk_user
        INNER JOIN party p ON p.cid = pa.fk_party
        INNER JOIN status s ON s.cid = pa.fk_status 
       WHERE pa.cid=$1 AND s."statusLabel" = 'active'`;
      console.log('partyAccount',partyAccountId);
    
     const userDetails = await pool.query(checkUserDetails, [partyAccountId]);
     var getNetcomId = `SELECT netcomid 
      FROM ediparty 
      WHERE rk_party =$1`
     const netcomId = await gate2b.query(getNetcomId, [userDetails.rows[0]?.objectid]);
     console.log('netcomId',netcomId.rows[0].netcomid);
     
      let decode = encryptionControl.decryptCookie(decodeURIComponent(req.body['token']));
      console.log('decode',decode);
      
      let token = decodeURIComponent(req.body['token']);
      const tokenSet = await bexioClient.refresh(decode);

        let bexioTokenCookie = { 
          access_Token:tokenSet.access_token,
          refresh_Token:tokenSet.refresh_token,
          isBexioUser:true
        
        }
        const updateRefreshToken = `UPDATE companyregistered SET refreshtoken = $1
        WHERE rk_csn = $2`
      let rk_csn = jwt.decode(tokenSet.access_token)['company_id']

      await bexioPool.query(updateRefreshToken, [tokenSet.refresh_token,rk_csn]);
        const data = {
          email: userDetails.rows[0].email,
          userId: userDetails.rows[0].userid,
      };
        const accessToken = jwt.sign(data, config.SECRET_JWT, { expiresIn: config.JWTExpiration });
        const refreshToken = jwt.sign(data, config.SECRET_REFRESH_JWT, {
            expiresIn: config.JWTRefreshExpiration,
        });

        let tokenCookie = { 
          accessToken:accessToken,
          refreshToken:refreshToken,
          userMail: userDetails.rows[0].email,
          partyID: userDetails.rows[0].partyid,
          userID: userDetails.rows[0].userid,
          accId: userDetails.rows[0].accountid,
          isBexioCompany:true
        }
        const options = {
          domain: config.SESSION_DOMAIN,
        };
        res.clearCookie(config.BILLING_COOKIE_NAME, options);
        // Creating cookie for Bexio
          await getUserPermissions(userDetails.rows[0].partyid,userDetails.rows[0].accountid)
          res.cookie(config.TOKEN_COOKIE_BEXIO_NAME, encryptionControl.encrypt(JSON.stringify(bexioTokenCookie)), {
            domain: config.SESSION_DOMAIN,
            maxAge: config.SESSION_EXPIRY,
            httpOnly: true,
            signed: true,
            secure: true
        });
          const datetimeToken = {
            cookieCreatedTime: new Date(new Date(new Date().getTime() + 15 * 60000).toUTCString()),
            userMail: userDetails.rows[0].email,
            partyID: userDetails.rows[0].partyid,
            userID: userDetails.rows[0].userid,
            accId: userDetails.rows[0].accountid,
            isBexioCompany:true,
            netcomId:netcomId.rows[0].netcomid
        };

          res.cookie(config.EXPIRE_EXPIRES_COOKIE_NAME, encryptionControl.encrypt(JSON.stringify(datetimeToken)), {
            domain: config.SESSION_DOMAIN,
            maxAge: config.SESSION_EXPIRY,
            secure: false,
            httpOnly: false,
            signed: false,
        });
      
    res.send({
      status_code: 200,
      message: '',
      data:encryptionControl.encrypt(userDetails.rows[0].partyid),
      status: true,
      showPopUp:true,
      showEbill:config.IS_EBILL_DISABLED,
    });

} catch (error) {
         
        logs.action = 'GET_TOKEN';
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        // addlogs(logs,data.rolePartyId,data.roleAccId);
    console.log(error);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+partyAccountId;
        warningMessage(commonErrors,error);
    res.send({
      status_code: 500,
      message: JSON.stringify(error),
      status: false,
  });
    // fs.writeFile('assets/errorLog.txt', JSON.stringify(error), function () {
    //   res.send();
    // });
  }

}
// eyJhbGciOiJub25lIn0.eyJqdGkiOiIyMmUyMDc3MS1mODFiLTQ4NWMtODcwZi1jNGQ2MmU5MTg4ZmYifQ.
const testEncrypt = async (req,res,next)=>{
  //console.log('isExpired is:', isJwtExpired('eyJraWQiOiI2ZGM2YmJlOC1iMjZjLTExZTgtOGUwZC0wMjQyYWMxMTAwMDIiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ2ZWhpbGVzMzEzQG1hbm5hd28uY29tIiwibG9naW5faWQiOiJiYjZjYTMxZC1jZmI2LTQxNWYtOGE4My1hNjUyNTdlZTMyYWYiLCJjb21wYW55X2lkIjoibnNsbnV1cGhpdmZvIiwidXNlcl9pZCI6MzExOTI3LCJhenAiOiI0ZDg2ZGI5Mi02Y2Q3LTQxNmEtODg1NS02NmVlNWE5YTkyMTkiLCJzY29wZSI6ImtiX29yZGVyX2VkaXQga2JfaW52b2ljZV9zaG93IG9wZW5pZCBjb250YWN0X3Nob3cgb2ZmbGluZV9hY2Nlc3MgcHJvZmlsZSBrYl9hcnRpY2xlX29yZGVyX3Nob3cga2Jfb2ZmZXJfc2hvdyBrYl9vcmRlcl9zaG93IGVtYWlsIiwiaXNzIjoiaHR0cHM6XC9cL2lkcC5iZXhpby5jb20iLCJleHAiOjE2NDUwOTc5MzYsImlhdCI6MTY0NTA5NDMzNiwiY29tcGFueV91c2VyX2lkIjoxLCJqdGkiOiJlYzA2MjJlOC03ZGVlLTQ0ZWMtODBmYS0yZTVlMWM5ZDNmNjIifQ.BZLB2sRxcWEyHUkaBiuiP7rEwq191rpOZlpOwcNeIZsp861VGyKDST6dS46LXGw4nlVP74C2tnmmTEzbGAolNp7A4VTuCGVYEYHrmvMuVhJQxgO2bkc9X1LaCwSuNe4HQNip7lu5WDJXrrGB487UL6ps0v67RTk5spSo2by-iHUnqQkQD9iku6mxA6gP-Ee5Zk_2uetU5_sFl5mogmppGcx741Zh7b5Ex55QN9HYAjYfQz9bkUbyln5KC_y8SrRYi46bDhT5kBNdVbYz1Yc30rJulZivjn02OG7PGiAtaNlqIr8VT-57uM0g7V7zoXpMly9dQ7W2-B-O-8mcU291YMIiKSZ6HwlSXCVN_7VlIoLFBP9YBrGMlTEvqp26UJgfXad3hKcQLv8AzvWARoESWSQ0v1RTTSFHyx4YEHZ7azOrx7LWeubt7w8-2tZvmXigTX0ezPTeFKjDz41L7qUOXk6JkDj2D_qF6gvBZbWPesTfUGYI3VpVNRlhADsES3mjozSJXr4zNlEDdou5YTWKHOnu4csOqnYsTr4_biBRXYcPDdaMTRW_hTmjBQlIrnsD8hta1CNZrxrHpAvmZ9mZbx6L48cvl9cAdyWcf1sq6fenQGQt1x0_CQIGIkEGBEmDcXEySIA0J2YLnXPwqGGoP2HAGqsS0Zxszv1Y6FYSmBc'));
  // jwt.verify('', res, async (err, decode) => {
  //   //console.log(err );
  //   //console.log( decode);

    
  // })
  var options = {
    'method': 'GET',
    'url': 'https://api.bexio.com/2.0/contact',
    'headers': {
      'Accept': 'application/json',
      'Authorization': 'Bearer eyJraWQiOiI2ZGM2YmJlOC1iMjZjLTExZTgtOGUwZC0wMjQyYWMxMTAwMDIiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ2ZWhpbGVzMzEzQG1hbm5hd28uY29tIiwibG9naW5faWQiOiJiYjZjYTMxZC1jZmI2LTQxNWYtOGE4My1hNjUyNTdlZTMyYWYiLCJjb21wYW55X2lkIjoibnNsbnV1cGhpdmZvIiwidXNlcl9pZCI6MzExOTI3LCJhenAiOiI0ZDg2ZGI5Mi02Y2Q3LTQxNmEtODg1NS02NmVlNWE5YTkyMTkiLCJzY29wZSI6ImtiX29yZGVyX2VkaXQga2JfaW52b2ljZV9zaG93IG9wZW5pZCBjb250YWN0X3Nob3cgb2ZmbGluZV9hY2Nlc3MgcHJvZmlsZSBrYl9hcnRpY2xlX29yZGVyX3Nob3cga2Jfb2ZmZXJfc2hvdyBrYl9vcmRlcl9zaG93IGVtYWlsIiwiaXNzIjoiaHR0cHM6XC9cL2lkcC5iZXhpby5jb20iLCJleHAiOjE2NDUwODAyNzUsImlhdCI6MTY0NTA3NjY3NSwiY29tcGFueV91c2VyX2lkIjoxLCJqdGkiOiI5ZDY1Mjg2My0xNDY4LTRlZGMtODA2OS04NGM5YTk2ZmMyZjQifQ.EUTye44q4CMbAs9ACSlJ4QSIXUgY65gEJn-ZsN4TUGYmgY16_5mFVG239QvbW-LlAhR2BJqbfjm7HH0LgOvfJV_yTUli56sWAl_OCYz4mTh73OB_iAZm95uKD6PmVpEpXyBZ6MX5OwdfvJqT17CwYqRm9QktdeRhkATPJGiuo1tY-hlyKsRU9NQAcKHrVvH-3gFatWS30U0fNlkk5w1Pc1gRuF_wsHPw2He0mRhxorLCpvvj6Jp5pN3-QkNWW-zOqkPAVyh7EEpBvdjm0VALuZhsOMTRkE_fGfLBq3JiYyzCWuwqM8EISczh9AX9flGlY0qJ746U0cZwXrqceq18kU22eyaKCDwZg2_cP1yU49kbBlr0oAlI3BTcw6KIiAyH1-cn0EIIvrU7t5JzicaXS9X2aF_fKAJe3b7Q5QGJUOoIo0EBq7slYVsY3s4JmF7y7QQSmtGO-Jx72qQcRPZzkKj3pVQb-7LGmpNrJtPAdxOzzFFxcde16vRvCBxVu7aEXZ_T6kcnvv18iQowuUMaPXlcGBVsyML7hyyTQwOZcHwli7LctT5muP-UIveMQACc1jkuBCQ4uQ6Pb0Zq7PtIhBTeDRvzBlLD5ID5VfuvAhdVtjRykiqcNG34OFcS_tU4LSN89Rq2WVtze0aqFBZUMKV397vlwBfTgkWlFcggToY'
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);
    res.send(response)
  });

  // let issuer = await Issuer.discover('https://idp.bexio.com');
  // let   client2 = new issuer.Client({
  //     client_id: '4d86db92-6cd7-416a-8855-66ee5a9a9219',
  //     client_secret: 'JlwF2zMsf4LKweYCNNTCHKfdXLBnEqy6Gug2wuhRhZtr-J0nI388YH2X17LlVDNwylondFjWto4f3UeqQhf9JQ',
  //     redirect_uris: ['http://localhost:3000/api/v1/gate2bAPI/bexio-redirect']
  // });

  // // let de = encryptionControl.decrypt(decode);
  // // //console.log(de);
  // // let cli = await  client.addPaymentNewType();
  //  //console.log('client2',client2);
  // const refresh_token1 = await client2.refresh('eyJhbGciOiJub25lIn0.eyJqdGkiOiIyMmUyMDc3MS1mODFiLTQ4NWMtODcwZi1jNGQ2MmU5MTg4ZmYifQ.');
  // //console.log('refresh_token1',refresh_token1);
  // //console.log('clientsadasdasdsadsadsad',bexioClient);
  //  const refresh_token = await bexioClient.refresh('eyJhbGciOiJub25lIn0.eyJqdGkiOiJjY2VlZWNiYy0xMmY1LTRkY2ItYjEyNC0yZjc5Zjk2YjczMzEifQ.');
  // //console.log(refresh_token);

  // let str = 'dadasdasd'
  // let de = encryptionControl.encrypt(str);
  // let en = encryptionControl.decryptCookie(de);
  // res.send({str:refresh_token,de:de,en:en})
  

}
const bexioApi1 = async (req,res)=>{
  let pool = await connectPostgres;
  let gate2b = await connectGate2b;
  let bexioPool = await postgresBexio;
  const data = req.body;
  console.log(data.partyId);
  let newGate2b = await postgresGate2b;
  try {
    const getInviteCompanyIdQry = `SELECT * FROM
    companyregistered 
    WHERE rk_party = $1`

    let getInviteNetcomId = await bexioPool.query(getInviteCompanyIdQry,[data.partyId]);
    let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
    
    let dataCookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.cookies[config.EXPIRE_EXPIRES_COOKIE_NAME])));

    let accessToken = cookie.access_Token;
    let isBexioUser = cookie.isBexioUser;

    // const getInviteCompanyIdQry = `SELECT array_agg(pa.cid) AS cid FROM
    // party_account pa
    // WHERE pa.fk_party = $1`
    // let getInviteCompanyId = await pool.query(getInviteCompanyIdQry,[data.partyId]);

    console.log(getInviteNetcomId.rows[0].cid);
    console.log(dataCookie.netcomId);

    const getInviteCompany = `SELECT cid,rk_netcomidsender AS sender,
      rk_netcomidreceived AS receiver,rk_contact,receivercustomerid,status,rk_businessconnection,rk_sendercontactid,rk_receivercontactid
    FROM contact_bc
      WHERE  (rk_netcomidsender = $1 OR rk_netcomidreceived = $1)
      AND type = 'EDI'`
    let partyAccountCheck = await bexioPool.query(getInviteCompany,[dataCookie.netcomId]);
    
    let beStruct = {}

    const getInviteCompanyBc = `SELECT array_agg(rk_businessconnection) AS cid
      FROM contact_bc
    WHERE  (rk_netcomidsender = $1 OR rk_netcomidreceived = $1) AND rk_businessconnection IS NOT NULL
    AND  type = 'EDI'`
    let getInviteCompanyBcResult = await bexioPool.query(getInviteCompanyBc,[dataCookie.netcomId]);
  console.log('netcomId',dataCookie.netcomId);
  
    const getInviteCompanyBcDetails = `SELECT g2bConnBC.id AS bcId,g2bConnIn.id AS in_connection_id,g2bConnOut.id AS out_connection_id,
      g2bConnIn."netcomId" AS in_netcomid,
      lpIn."companyname" AS in_legalname,
      g2bConnOut."netcomId" AS out_netcomid,
      lpOut."companyname" AS out_legalname,
      CASE WHEN g2bConnIn."netcomId" = '${dataCookie.netcomId}' THEN g2bConnIn."direction" WHEN g2bConnOut."netcomId" = '${dataCookie.netcomId}' THEN g2bConnOut."direction" END AS "company_direction",
      CASE WHEN g2bConnIn."netcomId" = '${dataCookie.netcomId}' THEN g2bConnOut."direction" WHEN g2bConnOut."netcomId" = '${dataCookie.netcomId}' THEN g2bConnIn."direction" END AS "partner_company_direction",
      CASE WHEN g2bConnIn."netcomId" = '${dataCookie.netcomId}' THEN docTypeIn.type WHEN g2bConnOut."netcomId" = '${dataCookie.netcomId}' THEN docTypeOut.type END AS company_document_type,
      CASE WHEN g2bConnOut."netcomId" = '${dataCookie.netcomId}' THEN docTypeIn.type WHEN g2bConnIn."netcomId" = '${dataCookie.netcomId}' THEN docTypeOut.type END AS partner_company_document_type,
      CASE WHEN g2bConnIn."netcomId" = '${dataCookie.netcomId}' THEN docFormatIn.format WHEN g2bConnOut."netcomId" = '${dataCookie.netcomId}' THEN docFormatOut.format END AS company_document_format,
      2 AS invitation_status,
      0 AS invitation_id,
      g2bConnBC.id AS bc_id,
      '' AS "invitation_role",
      0 AS invite_code,
      '' AS invited_email,
      (g2bConnBC."ot_updator"):: text AS ot_updator,
      (g2bConnBC."payee_details"):: text AS payee_details,

      
      CASE WHEN g2bConnIn."netcomId" = '${dataCookie.netcomId}' THEN g2bConnBC."IN_customerId"
      WHEN g2bConnOut."netcomId" = '${dataCookie.netcomId}' THEN
      (
        g2bConnBC."ot_updator" ->> 'out_custom_id'
      ):: text
    
      END AS myCustomerId,


      CASE WHEN g2bConnIn."netcomId" = '${dataCookie.netcomId}' THEN
      g2bConnBC."OUT_customerId"
      WHEN g2bConnOut."netcomId" = '${dataCookie.netcomId}'  THEN
      (
        g2bConnBC."ot_updator" ->> 'in_custom_id'
      ):: text 
      END AS myPartnerCustomerId,

      g2bConnBC."created_time" FROM
      g2b_connections g2bConnIn
      INNER JOIN ediparty edipartyIn ON edipartyIn.netcomid = g2bConnIn."netcomId"
      INNER JOIN legalparty lpIn ON lpIn.fk_ediparty = edipartyIn.cid
      INNER JOIN g2b_business_connections g2bConnBC ON g2bConnIn.id = g2bConnBC."FK_g2b_connections_IN"
      INNER JOIN g2b_connections g2bConnOut ON g2bConnOut.id = g2bConnBC."FK_g2b_connections_OUT"
      INNER JOIN ediparty edipartyOut ON edipartyOut.netcomid = g2bConnOut."netcomId"
      INNER JOIN legalparty lpOut ON lpOut.fk_ediparty = edipartyOut.cid
      INNER JOIN doc_type docTypeIn ON docTypeIn.id = g2bConnIn."FK_doc_type"
      INNER JOIN doc_type docTypeOut ON docTypeOut.id = g2bConnOut."FK_doc_type"
      INNER JOIN doc_format docFormatIn ON docFormatIn.id = g2bConnIn."FK_doc_format"
      INNER JOIN doc_format docFormatOut ON docFormatOut.id = g2bConnOut."FK_doc_format"
      WHERE
      g2bConnBC.id IN (${getInviteCompanyBcResult.rows[0].cid})`
    //  console.log(getInviteCompanyBcDetails);
     
    let getInviteCompanyBcDetailsResult = await newGate2b.query(getInviteCompanyBcDetails);
    // console.log(getInviteCompanyBcDetailsResult.rows);
    
    getInviteCompanyBcDetailsResult.rows.forEach(async element => {
      beStruct[element.bcid] = element;
    });
    
    partyAccountCheck = partyAccountCheck.rows
    // console.log('party',partyAccountCheck);
    // const partyAccountCheck = await pool.query(getInviteCompany,[data.partyId,contactData.name_1]);
 

      if(isBexioUser)
      {

        console.log(accessToken);
        let resData ;
        let countryList = {};
        resData = await getCountryLists(accessToken);
        if(!resData)
        {
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'getCountryLists_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'getCountryLists_not_found');
          res.send({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
        
        });
        return
        }
        resData = JSON.parse(resData);
        resData['message'] != 'Unauthorized' ?resData.forEach((country) => {
          countryList[country.id] = country.name
        }):'';
          var options = {
            'method': 'GET',
            // 'url': `${config.BEXIO_API}${data.api}/?limit=${showTo}&offset=${showFrom}&order_by=updated_at_desc`,
            'url': `${config.BEXIO_API}${data.api}`,
            // url = `${url}`;
            'headers': {
              'Accept': 'application/json',
              'Authorization': 'Bearer '+accessToken
            }
          };
          // 'url': `${config.BEXIO_API}${data.api}?order_by=updated_at_desc`,

          request(options, function (error, response) {
            if (error) throw new Error(error);
            //  res.send(response.body)

            // console.log('partyAccountCheck',partyAccountCheck.rows);
            // partyAccountCheck
            if(response.statusCode != 200)
            return res.status(200).json({
              status: false,
              message: [response],
              
          });
            let resData = response.body.length != 0 && response.statusCode == '200'? JSON.parse(response.body) : '';
            let senderStatus='';
            let receiverStatus='';

            for (let contactIndex in resData) {
              senderStatus = '';
              receiverStatus = '';

              resData[contactIndex]['country'] = countryList[resData[contactIndex]['country_id']];
              for (let partyAccountIndex in partyAccountCheck) {
                // if(partyAccountCheck[partyAccountIndex].rk_contact == resData[contactIndex].id)
                // {
                  // console.log('partyAccountCheck[partyAccountIndex].sender',partyAccountCheck[partyAccountIndex].sender);
                  // console.log('dataCookie.netcomId',dataCookie.netcomId);

                  if(partyAccountCheck[partyAccountIndex].sender == dataCookie.netcomId)
                  {
                    if(partyAccountCheck[partyAccountIndex].rk_sendercontactid == resData[contactIndex].id)
                    {
                      
                      if(partyAccountCheck[partyAccountIndex].rk_businessconnection != '' && partyAccountCheck[partyAccountIndex].rk_businessconnection != null)
                      {
                        senderStatus = 'common_status_active';

                        resData[contactIndex]['bcDetailsSend'] != '' ? resData[contactIndex]['bcDetailsSend'] = beStruct[partyAccountCheck[partyAccountIndex].rk_businessconnection] : '';

                        // break;

                      }
                      // else if(partyAccountCheck[partyAccountIndex].status == 2){
                      //   senderStatus = 'common_status_deleted';
                      //   // break;

                      // }else if(partyAccountCheck[partyAccountIndex].status == 0){
                      //   senderStatus = 'common_status_inactive';
                      //   // break;

                      // }
                      else{
                        senderStatus = 'contacts_reinvite';
                      }
                    }
                  }else{
                    senderStatus == "" ? senderStatus = 'contact_invite_for_sale':'';
                 }
                  // console.log('partyAccountCheck[partyAccountIndex].receiver',partyAccountCheck[partyAccountIndex].receiver);
                  // console.log('dataCookie.netcomId',dataCookie.netcomId);

                  
                if(partyAccountCheck[partyAccountIndex].receiver == dataCookie.netcomId){
                  if(partyAccountCheck[partyAccountIndex].rk_receivercontactid == resData[contactIndex].id)
                  {
                    //  break;
                    // console.log('common_status_activecommon_status_active');
                    
                    if(partyAccountCheck[partyAccountIndex].rk_businessconnection != '' && partyAccountCheck[partyAccountIndex].rk_businessconnection != null)
                    {

                      receiverStatus = 'common_status_active';
                      
                      resData[contactIndex]['bcDetailsReceiver'] != '' ?  resData[contactIndex]['bcDetailsReceiver'] = beStruct[partyAccountCheck[partyAccountIndex].rk_businessconnection] : '';
                      
                    //  break;

                    }
                    // else if(partyAccountCheck[partyAccountIndex].status == 2){
                    //   receiverStatus = 'common_status_deleted';
                    //   // break;

                    // }else if(partyAccountCheck[partyAccountIndex].status == 0){
                    //   receiverStatus = 'common_status_inactive';
                    //   // break;

                    // }
                    else{
                      receiverStatus = 'contact_accept_for_purchase';
                    }
                    // receiverStatus = 'common_status_active';
                  }
                }else{
                   receiverStatus == "" ? receiverStatus = 'contact_accept_for_purchase':'';
                  //  senderStatus == "" ? senderStatus = 'contact_not_invited':'';
                }
              // }else{

              //   // receiverStatus == "" ? receiverStatus = 'contact_accept_for_purchase':'';
              // }
              }  
              senderStatus == ''?senderStatus = 'contact_invite_for_sale':'';
              receiverStatus == ''? receiverStatus = 'contact_accept_for_purchase':'';
              resData[contactIndex]['active'] = senderStatus;
              resData[contactIndex]['receiverStatus'] = receiverStatus;

            }
            // res.send(resData)
            res.send({
              status: 200,
              data:resData
          })
          });
        }
        else{
          return res.status(401).json({
            status: 'fail',
            message: 'unauthorized',
        });
        }
    // }else{
    //   let showFrom = req.body.limit * (req.body.page-1);
    //   let showTo = req.body.limit;
    //   let url = `${config.BEXIO_API}${req.body.api}`;
    //   if(showTo)
    //   {
    //     url = `${url}/?limit=${showTo}&offset=${showFrom}&order_by=updated_at_desc`;
    //   }
    //   //console.log(url);
      
    //   var options = {
    //     'method': 'GET',
    //     'url': url,
    //     'headers': {
    //       'Accept': 'application/json',
    //       'Authorization': 'Bearer ' + accessToken
    //     }
    //   };
    //   request(options, function (error, response) {
    //     if (error) throw new Error(error);
    //     res.send(response.body)
        
    //   });
    //  }

  } catch (error) {
      logs.action = 'BEXIO';
      logs.level = 'ERROR';
      logs.item = 'EDI';
      // //addlogs(logs,data.rolePartyId,data.roleAccId);
      commonErrors['errorTitle'] = bexioApi1.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+JSON.stringify(req.body);
      warningMessage(commonErrors,error);

    // fs.writeFile('assets/errorLog.txt', JSON.stringify(error), function () {
    //   res.send();
    // });
    console.log(error);
        // commonErrors['errorTitle'] = req.originalUrl;
        // commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString();
        // warningMessage(commonErrors);
    res.send({

      status_code: 500,
      message: JSON.stringify(error),
      status: false,
  })
  }
}
const bexioApi = async (req,res)=>{
  let pool = await connectPostgres;
  const data = req.body;
  try {
    
    
    let gate2b = await connectGate2b;
    let bexioPool = await postgresBexio;
  
    console.log(data.partyId);
    let newGate2b = await postgresGate2b;


    const getInviteCompanyIdQry = `SELECT * FROM
    companyregistered
    WHERE rk_party = $1`

    let getInviteNetcomId = await bexioPool.query(getInviteCompanyIdQry,[data.partyId]);
    let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
    
    let dataCookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.cookies[config.EXPIRE_EXPIRES_COOKIE_NAME])));

    let accessToken = cookie.access_Token;
    let isBexioUser = cookie.isBexioUser;

    // const getInviteCompanyIdQry = `SELECT array_agg(pa.cid) AS cid FROM
    // party_account pa
    // WHERE pa.fk_party = $1`
    // let getInviteCompanyId = await pool.query(getInviteCompanyIdQry,[data.partyId]);

    console.log(getInviteNetcomId.rows[0].cid);
    console.log(dataCookie.netcomId);

    const getInviteCompany = `SELECT cid,rk_netcomidsender AS sender,
      rk_netcomidreceived AS receiver,rk_contact,receivercustomerid,status,rk_businessconnection,rk_sendercontactid,rk_receivercontactid
    FROM contact_bc
      WHERE  (rk_netcomidsender = $1 OR rk_netcomidreceived = $1)
      AND type = 'EDI'`
    let partyAccountCheck = await bexioPool.query(getInviteCompany,[dataCookie.netcomId]);
    
    let beStruct = {}

    const getInviteCompanyBc = `SELECT array_agg(rk_businessconnection) AS cid
      FROM contact_bc
    WHERE  (rk_netcomidsender = $1 OR rk_netcomidreceived = $1) AND rk_businessconnection IS NOT NULL
    AND  type = 'EDI'`
    let getInviteCompanyBcResult = await bexioPool.query(getInviteCompanyBc,[dataCookie.netcomId]);
  console.log('netcomId',dataCookie.netcomId);
  
    const getInviteCompanyBcDetails = `SELECT g2bConnBC.id AS bcId,g2bConnIn.id AS in_connection_id,g2bConnOut.id AS out_connection_id,
      g2bConnIn."netcomId" AS in_netcomid,
      lpIn."companyname" AS in_legalname,
      g2bConnOut."netcomId" AS out_netcomid,
      lpOut."companyname" AS out_legalname,
      CASE WHEN g2bConnIn."netcomId" = '${dataCookie.netcomId}' THEN g2bConnIn."direction" WHEN g2bConnOut."netcomId" = '${dataCookie.netcomId}' THEN g2bConnOut."direction" END AS "company_direction",
      CASE WHEN g2bConnIn."netcomId" = '${dataCookie.netcomId}' THEN g2bConnOut."direction" WHEN g2bConnOut."netcomId" = '${dataCookie.netcomId}' THEN g2bConnIn."direction" END AS "partner_company_direction",
      CASE WHEN g2bConnIn."netcomId" = '${dataCookie.netcomId}' THEN docTypeIn.type WHEN g2bConnOut."netcomId" = '${dataCookie.netcomId}' THEN docTypeOut.type END AS company_document_type,
      CASE WHEN g2bConnOut."netcomId" = '${dataCookie.netcomId}' THEN docTypeIn.type WHEN g2bConnIn."netcomId" = '${dataCookie.netcomId}' THEN docTypeOut.type END AS partner_company_document_type,
      CASE WHEN g2bConnIn."netcomId" = '${dataCookie.netcomId}' THEN docFormatIn.format WHEN g2bConnOut."netcomId" = '${dataCookie.netcomId}' THEN docFormatOut.format END AS company_document_format,
      2 AS invitation_status,
      0 AS invitation_id,
      g2bConnBC.id AS bc_id,
      '' AS "invitation_role",
      0 AS invite_code,
      '' AS invited_email,
      (g2bConnBC."ot_updator"):: text AS ot_updator,
      (g2bConnBC."payee_details"):: text AS payee_details,

      
      CASE WHEN g2bConnIn."netcomId" = '${dataCookie.netcomId}' THEN g2bConnBC."IN_customerId"
      WHEN g2bConnOut."netcomId" = '${dataCookie.netcomId}' THEN
      (
        g2bConnBC."ot_updator" ->> 'out_custom_id'
      ):: text
    
      END AS myCustomerId,


      CASE WHEN g2bConnIn."netcomId" = '${dataCookie.netcomId}' THEN
      g2bConnBC."OUT_customerId"
      WHEN g2bConnOut."netcomId" = '${dataCookie.netcomId}'  THEN
      (
        g2bConnBC."ot_updator" ->> 'in_custom_id'
      ):: text 
      END AS myPartnerCustomerId,

      g2bConnBC."created_time" FROM
      g2b_connections g2bConnIn
      INNER JOIN ediparty edipartyIn ON edipartyIn.netcomid = g2bConnIn."netcomId"
      INNER JOIN legalparty lpIn ON lpIn.fk_ediparty = edipartyIn.cid
      INNER JOIN g2b_business_connections g2bConnBC ON g2bConnIn.id = g2bConnBC."FK_g2b_connections_IN"
      INNER JOIN g2b_connections g2bConnOut ON g2bConnOut.id = g2bConnBC."FK_g2b_connections_OUT"
      INNER JOIN ediparty edipartyOut ON edipartyOut.netcomid = g2bConnOut."netcomId"
      INNER JOIN legalparty lpOut ON lpOut.fk_ediparty = edipartyOut.cid
      INNER JOIN doc_type docTypeIn ON docTypeIn.id = g2bConnIn."FK_doc_type"
      INNER JOIN doc_type docTypeOut ON docTypeOut.id = g2bConnOut."FK_doc_type"
      INNER JOIN doc_format docFormatIn ON docFormatIn.id = g2bConnIn."FK_doc_format"
      INNER JOIN doc_format docFormatOut ON docFormatOut.id = g2bConnOut."FK_doc_format"
      WHERE
      g2bConnBC.id IN (${getInviteCompanyBcResult.rows[0].cid})`
    //  console.log(getInviteCompanyBcDetails);
     
    let getInviteCompanyBcDetailsResult = await newGate2b.query(getInviteCompanyBcDetails);
    // console.log(getInviteCompanyBcDetailsResult.rows);
    
    getInviteCompanyBcDetailsResult.rows.forEach(async element => {
      beStruct[element.bcid] = element;
    });
    
    partyAccountCheck = partyAccountCheck.rows
    // console.log('party',partyAccountCheck);
    // const partyAccountCheck = await pool.query(getInviteCompany,[data.partyId,contactData.name_1]);
 
      let totalCount;
      if(isBexioUser)
      {
        
        let showFrom = req.body.records_per_page * (req.body.page_number-1);
        let showTo = req.body.records_per_page;
        console.log(accessToken);
        let resData ;
        let countryList = {};
        resData = await getCountryLists(accessToken);
        if(!resData)
        {
          commonErrors['errorTitle'] = bexioApi.name;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'countryList_not_found -req param,',req.body;
          warningMessage(commonErrors,'countryList_not_found');
          res.send({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
        
        });
        return
        }
        resData = JSON.parse(resData);
        resData['message'] != 'Unauthorized' ?resData.forEach((country) => {
          countryList[country.id] = country.name
        }):'';
        let options;
        if(data['username'] != '' || data['email'] != '' || data['surname']!='' || data['contact_type_id'] != '')
        {
          let searchJson = [];
           
          if(data['username'] != '' && data['username']){
            searchJson.push({
              "field":"name_1",
              "value":data.username,
              "criteria":"like"
            })
          }
           console.log("data['mail']",data['email']);
          
          if(data['email'] != '' && data['email']){
            searchJson.push({
              "field":"mail",
              "value":data.email,
              "criteria":"like"
            })
          }
          if(data['surname'] != '' && data['surname']){
            searchJson.push({
              "field":"name_2",
              "value":data.surname,
              "criteria":"like"
            })
          }
          if( data['contact_type_id'] != "" && data['contact_type_id']){
            searchJson.push({
              "field":"contact_type_id",
              "value":data.contact_type_id,
              "criteria":"equal"
            })
          }
          options = {
            'method': 'POST',
            'url': `${config.BEXIO_API}${data.api}/search/?limit=${showTo}&offset=${showFrom}&order_by=updated_at_desc`,
            // 'url': `${config.BEXIO_API}${data.api}`,
            // url = `${url}`;
            'headers': {
              'Accept': 'application/json',
              'Authorization': 'Bearer '+accessToken
            },
            // body: JSON.stringify([{
            //   "field":"name_1",
            //   "value":data.name,
            //   "criteria":"like"
            // },{
            //   "field":"mail",
            //   "value":data.email,
            //   "criteria":"like"
            // }])
            body: JSON.stringify(searchJson)
          };

        totalCount = await contactListCountSearch(accessToken,searchJson,0,2000)
        // totalCount = await  contactListCountSearch(accessToken,0,2000);

      }else{
        // totalCount = await contactListCount(accessToken,0)
        totalCount = await  contactListCount(accessToken,0,2000);
        console.log('totalCount',totalCount);
        
        options = {
          'method': 'GET',
          'url': `${config.BEXIO_API}${data.api}/?limit=${showTo}&offset=${showFrom}&order_by=updated_at_desc`,
          // 'url': `${config.BEXIO_API}${data.api}`,
          // url = `${url}`;
          'headers': {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+accessToken
            } 
          }
        }
        // if(!totalCount){
        //   res.send({
        //     status_code: 500,
        //     message: 'something_went_wrong',
        //     status: false,
        //   });
        // return

        // }
        console.log('totalCount',totalCount);
          // 'url': `${config.BEXIO_API}${data.api}?order_by=updated_at_desc`,

          request(options, async function (error, response) {
            if (error) {
              console.log('eror');
              commonErrors['errorTitle'] = bexioApi.name;
              commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'-bexio param,'+showTo+' '+showFrom;
              warningMessage(commonErrors,error);
              return res.status(200).json({
                status: false,
                message: [response],
                
              });
            }
            //  res.send(response.body)
           
            // console.log('partyAccountCheck',partyAccountCheck.rows);
            // partyAccountCheck
            if(response.statusCode != 200)
            return res.status(200).json({
              status: false,
              message: [response],
              
          });
          
            let resData = response.body.length != 0 && response.statusCode == '200'? JSON.parse(response.body) : '';
            let senderStatus='';
            let receiverStatus='';

            for (let contactIndex in resData) {
              senderStatus = '';
              receiverStatus = '';

              resData[contactIndex]['country'] = countryList[resData[contactIndex]['country_id']] ? countryList[resData[contactIndex]['country_id']] : '';
              for (let partyAccountIndex in partyAccountCheck) {
                // if(partyAccountCheck[partyAccountIndex].rk_contact == resData[contactIndex].id)
                // {
                  // console.log('partyAccountCheck[partyAccountIndex].sender',partyAccountCheck[partyAccountIndex].sender);
                  // console.log('dataCookie.netcomId',dataCookie.netcomId);

                  if(partyAccountCheck[partyAccountIndex].sender == dataCookie.netcomId)
                  {
                    if(partyAccountCheck[partyAccountIndex].rk_sendercontactid == resData[contactIndex].id)
                    {
                      
                      if(partyAccountCheck[partyAccountIndex].rk_businessconnection != '' && partyAccountCheck[partyAccountIndex].rk_businessconnection != null)
                      {
                        senderStatus = 'common_status_active';

                        resData[contactIndex]['bcDetailsSend'] != '' ? resData[contactIndex]['bcDetailsSend'] = beStruct[partyAccountCheck[partyAccountIndex].rk_businessconnection] : '';

                        // break;

                      }
                      // else if(partyAccountCheck[partyAccountIndex].status == 2){
                      //   senderStatus = 'common_status_deleted';
                      //   // break;

                      // }else if(partyAccountCheck[partyAccountIndex].status == 0){
                      //   senderStatus = 'common_status_inactive';
                      //   // break;

                      // }
                      else{
                        senderStatus = 'contacts_reinvite';
                      }
                    }
                  }else{
                    senderStatus == "" ? senderStatus = 'contact_invite_for_sale':'';
                 }
                  // console.log('partyAccountCheck[partyAccountIndex].receiver',partyAccountCheck[partyAccountIndex].receiver);
                  // console.log('dataCookie.netcomId',dataCookie.netcomId);

                  
                if(partyAccountCheck[partyAccountIndex].receiver == dataCookie.netcomId){
                  if(partyAccountCheck[partyAccountIndex].rk_receivercontactid == resData[contactIndex].id)
                  {
                    //  break;
                    // console.log('common_status_activecommon_status_active');
                    
                    if(partyAccountCheck[partyAccountIndex].rk_businessconnection != '' && partyAccountCheck[partyAccountIndex].rk_businessconnection != null)
                    {

                      receiverStatus = 'common_status_active';
                      
                      resData[contactIndex]['bcDetailsReceiver'] != '' ?  resData[contactIndex]['bcDetailsReceiver'] = beStruct[partyAccountCheck[partyAccountIndex].rk_businessconnection] : '';
                      
                    //  break;

                    }
                    // else if(partyAccountCheck[partyAccountIndex].status == 2){
                    //   receiverStatus = 'common_status_deleted';
                    //   // break;

                    // }else if(partyAccountCheck[partyAccountIndex].status == 0){
                    //   receiverStatus = 'common_status_inactive';
                    //   // break;

                    // }
                    else{
                      receiverStatus = 'contact_accept_for_purchase';
                    }
                    // receiverStatus = 'common_status_active';
                  }
                }else{
                   receiverStatus == "" ? receiverStatus = 'contact_accept_for_purchase':'';
                  //  senderStatus == "" ? senderStatus = 'contact_not_invited':'';
                }
              // }else{

              //   // receiverStatus == "" ? receiverStatus = 'contact_accept_for_purchase':'';
              // }
              }  
              senderStatus == ''?senderStatus = 'contact_invite_for_sale':'';
              receiverStatus == ''? receiverStatus = 'contact_accept_for_purchase':'';
              resData[contactIndex]['active'] = senderStatus;
              resData[contactIndex]['receiverStatus'] = receiverStatus;

            }
            // res.send(resData)
            let keys = Object.keys(req.body)
            // let redisKey = req.url+"_"+req.body.partyId+"_";
            let redisKey = req.body.partyId+"_"+req.url+"_";
            console.log('redisKey',redisKey);
            keys.forEach(element => {
                redisKey = req.body[element]? redisKey +element+':'+ req.body[element] + '_' : redisKey
            });
            await redisClient.setex(redisKey,24*60*60*2,JSON.stringify({
              status: 200,
              data:resData,
              totalCount:totalCount
          } ));
            res.send({
              status: 200,
              data:resData,
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
    // }else{
    //   let showFrom = req.body.limit * (req.body.page-1);
    //   let showTo = req.body.limit;
    //   let url = `${config.BEXIO_API}${req.body.api}`;
    //   if(showTo)
    //   {
    //     url = `${url}/?limit=${showTo}&offset=${showFrom}&order_by=updated_at_desc`;
    //   }
    //   //console.log(url);
      
    //   var options = {
    //     'method': 'GET',
    //     'url': url,
    //     'headers': {
    //       'Accept': 'application/json',
    //       'Authorization': 'Bearer ' + accessToken
    //     }
    //   };
    //   request(options, function (error, response) {
    //     if (error) throw new Error(error);
    //     res.send(response.body)
        
    //   });
    //  }
 
  } catch (error) {
         
      logs.action = 'BEXIO';
      logs.level = 'ERROR';
      logs.item = 'EDI';
      // //addlogs(logs,data.rolePartyId,data.roleAccId);
      console.log('*****',error);
      commonErrors['errorTitle'] = bexioApi.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,',req.body;
      warningMessage(commonErrors,error);
    // fs.writeFile('assets/errorLog.txt', JSON.stringify(error), function () {
    //   res.send();
    // });
   
        // commonErrors['errorTitle'] = req.originalUrl;
        // commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString();
        // warningMessage(commonErrors);
    res.send({

      status_code: 500,
      message: JSON.stringify(error),
      status: false,
  })
  }
}

  const bexioApiTest = async (req,res)=>{
    var request = require('request');
    var options = {
    'method': 'POST',
    'url': 'https://api.bexio.com/2.0/contact/search',
    'headers': {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer eyJraWQiOiI2ZGM2YmJlOC1iMjZjLTExZTgtOGUwZC0wMjQyYWMxMTAwMDIiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ2ZWhpbGVzMzEzQG1hbm5hd28uY29tIiwibG9naW5faWQiOiJiYjZjYTMxZC1jZmI2LTQxNWYtOGE4My1hNjUyNTdlZTMyYWYiLCJjb21wYW55X2lkIjoibnNsbnV1cGhpdmZvIiwidXNlcl9pZCI6MzExOTI3LCJhenAiOiI0YjI4ZTA5Ny1iNzlhLTRhYTktOTI0NC04Yzc2YTkxNzU1N2QiLCJzY29wZSI6ImtiX29yZGVyX2VkaXQga2JfaW52b2ljZV9zaG93IG9wZW5pZCBjb250YWN0X3Nob3cgb2ZmbGluZV9hY2Nlc3MgcHJvZmlsZSBrYl9hcnRpY2xlX29yZGVyX3Nob3cga2Jfb2ZmZXJfc2hvdyBrYl9vcmRlcl9zaG93IGVtYWlsIiwiaXNzIjoiaHR0cHM6XC9cL2lkcC5iZXhpby5jb20iLCJleHAiOjE2NDU1MDcxMDMsImlhdCI6MTY0NTUwMzUwMywiY29tcGFueV91c2VyX2lkIjoxLCJqdGkiOiJiMmU5MmIzZS04NDBmLTRjZDEtOWE1MS1lMTljMjZkY2RhNTIifQ.KMFE46MKE0RSe-Qp4sjO3Y457CG_entFhztpgYW9EysCmP-doUrlcKVgd7K4MQfbLPUQrGZN-Y8AkzK8ywLXoav6XyRF0RSpAUCLt29lrwVH1bV01Vd_TI7GjYZRIkLtRaqVsKboH1Mb3h7IfeumdVM0_LU8VOQJ7tvEFxuyvCtgBFoSjCpnSNV4ibgxa1MyhYGf_SzeVFZG1gb8qugcocIbcbwOsmnBz9TJkpD58yAKk1Axa12Nb_piMJy-wwLnYAI22Yc1-Nk__rl260Cw-oyb-CMecyw0w1X0LGHlxrL-PeF4qiGC3pswsJmgOHdEXlRp9T4Ga9nBuBAdZ-qFGhmEGAOkPktKtaSZKo77POV_-FQULBtQh89UezjOf6u6Aeo7qMxneV9RjIJyIRxr3w-LEway52bovanR27kKCmny1PjNWgILAWDZuUaAgKlG-gx8fw1PHCE_jn0G2rCFdmjX45BP1g4DPuWrohTAOmFYttsjKlChAnQ9AHJmfKXynQOl5WTAjh8VzxyWQNkDOq4jDp966DeOM0v3XqCGdxfCwpsEeCZgbSJRalc4T_A0NYJCIr2ZCWdiAahSdhE8Q-rb8FtIbJrqlrwmEIstWZVGxXXPk_RrbN-YEkZyt8f6i4Y5J8poJSqF8H0AwLn1Dx8_nrO9ZUlpw8h2OLulJmE'
    },
    body: JSON.stringify({
      "field": "name_1",
      "value": "term"
    })

  };
  // //console.log(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_NAME])));
  // //console.log(req.body.api);
  // let access_token = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_NAME]))).access_token;
  
  // var options = {
  //   'method': 'GET',
  //   'url': 'https://api.bexio.com/2.0/company_profile',
  //   'headers': {
  //     'Accept': 'application/json',
  //     'Authorization': 'Bearer eyJraWQiOiI2ZGM2YmJlOC1iMjZjLTExZTgtOGUwZC0wMjQyYWMxMTAwMDIiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ2ZWhpbGVzMzEzQG1hbm5hd28uY29tIiwibG9naW5faWQiOiJiYjZjYTMxZC1jZmI2LTQxNWYtOGE4My1hNjUyNTdlZTMyYWYiLCJjb21wYW55X2lkIjoibnNsbnV1cGhpdmZvIiwidXNlcl9pZCI6MzExOTI3LCJhenAiOiI0ZDg2ZGI5Mi02Y2Q3LTQxNmEtODg1NS02NmVlNWE5YTkyMTkiLCJzY29wZSI6ImtiX29yZGVyX2VkaXQga2JfaW52b2ljZV9zaG93IG9wZW5pZCBjb250YWN0X3Nob3cgb2ZmbGluZV9hY2Nlc3MgcHJvZmlsZSBrYl9hcnRpY2xlX29yZGVyX3Nob3cga2Jfb2ZmZXJfc2hvdyBrYl9vcmRlcl9zaG93IGVtYWlsIiwiaXNzIjoiaHR0cHM6XC9cL2lkcC5iZXhpby5jb20iLCJleHAiOjE2NDU0MjEzNTgsImlhdCI6MTY0NTQxNzc1OCwiY29tcGFueV91c2VyX2lkIjoxLCJqdGkiOiI4ZjMzM2Q1ZS04NWRjLTQ1OWEtYmFlOS1hYzg4MjkyM2JjYzIifQ.J6Bx6cieskjYanfMjPVQnD4P1YD5VGOtp7ZKqdvI9TWdGxEKduffXi1936hnp7D3tkfIxA2VP9BBHLVm5b7Gq9z6wzmp_vFf5MBX5T2-v_FgSiC3p7M2cXQVxrrcJ44wPtxwUQtGlGOApn9pPA_9IN4VOZji_EcM1fiElGui88_BGIP6kDOrPTbQYAptRkoENMBzD96pkAMgZgUtASg2QMk3gJivigX-l-VsOFnuU1rHR8K6bZ92GkXvnKz8e_RuF6rJjv1kv_hKWEDiZGqxp7UXAmZOuwughkEv6bN9ZFNuIF6npesofrus5vOXJGjNhARSeZXf6qs_Nv2Q8mF4iPHkSZtOaaYPeD5Gja8A5bjakB8CspCe6jnsW9dnG02v5vjGnu2qt9tWosxxTs8snbIvifXAv9FDS0p-1KgCoG0G8D95ObQu9uRHKvOmH0-Y_sjqvzKCzTFhLBoRqjBKS66WWbdLlfSbn54qFJXLb9fodaeU0W8z1iI7WA5pLjxjMnxKhjeKBcdam8nMea_4UbGYOruYKIF9Ss91e3AXTAtWYDNaYcCo1tn0GrKOTii1n4yGQYBfPo9tLX_f3fmSk8jzo5X--ONIUufUNhBkp90ejlZDjCyEH5Z6ttkh1G8DNlEJ95J8DFvtx2P6MeYsBaOiYsPr_EF85QZkG_ewaZQ'
  //   }
  // };
  // request(options, function (error, response) {
  //   if (error) throw new Error(error);
  //   res.send(response.body)
  // });

  // let rk_csn = jwt.decode(accessToken)['company_id']
  
  // const pool = await postgresBexio;
  // var check = `SELECT cid 
  //   FROM bexioCompany
  //   WHERE rk_csn =$1`;

  // const isAlreadyExist = await pool.query(check, [rk_csn]);


  

}
const getLoginUserRoles = async (access_token)=>{
  //  let access_token = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_NAME]))).access_token;
  let companyUserId; 
  try {
      companyUserId = jwt.decode(access_token)['company_user_id']
      return new Promise(async(resolve, reject) => {
        var options = {
          'method': 'GET',
          'url': 'https://api.bexio.com/3.0/users/'+companyUserId,
          'headers': {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+access_token
          }
        };
        request(options, function (error, response) {
          if (error) {
            commonErrors['errorTitle'] = getLoginUserRoles.name;
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+companyUserId;
            warningMessage(commonErrors,error);
            resolve(false);
          }
          // res.send(response.body)
          //console.log(response.body);
          if(response.statusCode != 200)
             resolve(false);
          else
              resolve(response.body);

        });
      });
    } catch (error) {
      commonErrors['errorTitle'] = getLoginUserRoles.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+access_token;
      warningMessage(commonErrors,error);
      fs.writeFile('assets/errorLog.txt', JSON.stringify(error), function () {
        // res.send();
        resolve('');
      });
    }
}

const getloginUserCompanyDetails = async (access_token)=>{
  try{
  //  let access_token = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_NAME]))).access_token;
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
        
        // res.send(response.body)
      });
    });
    
  } catch (error) {
      commonErrors['errorTitle'] = getloginUserCompanyDetails.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+access_token;
      warningMessage(commonErrors,error);

    fs.writeFile('assets/errorLog.txt', JSON.stringify(error), function () {
      // res.send();
      resolve('');
    });
  }
}
const readFile = async (res)=>{
  	    fs.readFile('assets/errorLog.txt', 'utf8' , (err, data) => {
	    if (err) {
	        //console.error(err)
	        return
	    }
	   res.send(data)
	    })
}
// const userRegistration = async (accessToken)=>{
//   //console.log('userRegistration');

//     return new Promise(async(resolve, reject) => {
//       console.log('companydetails123');

//       // try 
//       //   {
//           // let accessToken = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_NAME]))).access_token;
//           const pool = await postgresBexio;
//           const selectQry = `SELECT cid,rk_party
//             FROM bexioCompany
//             WHERE rk_csn =$1`;
//           let rk_csn = jwt.decode(accessToken)['company_id']
        
//           let isAlreadyExist = await pool.query(selectQry, [rk_csn]);
//           let party;
//           let netcomeAddress ;
//           // If company is not registered then create company in io library

//           if(isAlreadyExist.rowCount == 0)
//           {

//             let  companydetails = await getloginUserCompanyDetails(accessToken);
//             party = await partyCreate(companydetails[0]);
//             console.log(party);
            
//             const ediPartyId = await netcomeCreate(party.partyResponse);
//             netcomeAddress = await netcomGate2b(companydetails[0], party.partyResponse, ediPartyId);
//             await saveLegal(party.partyResponse, companydetails[0]);
//             console.log(party.partyResponse);
            
//           }
//           // Check user is registered or not
//           let userDetails = await getLoginUserRoles(accessToken);
//           let userStatusObj = await userCreations(userDetails)
          
//           const userId = await saveUserWithAccount(userDetails ,userStatusObj);
//           const accountId = await account(userId, party.partyResponse, userDetails , party.addressMain, netcomeAddress);

//             // Registration Fn
//             // let userRegistartionStatus  = await setUserCompanyData(userDetails,companydetails);

//             const insQry = `INSERT INTO 
//               bexioCompany(rk_party,rk_csn)
//               VALUES($1,$2)`;
//               await pool.query(insQry, [1,rk_csn]);
//               resolve(true)

//           // }else{
//           //   resolve(true)
//           // }
//       //   } catch (error) {
//       //     //console.log(error);
          
//       //     reject(false)
    
//       //  }
//     });
 
// }
const refreshTokenCreate = async (req,res)=>{
    let data =req.body;
    let refresh_token = null
    const pool = await connectPostgres;
    let dataCookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.cookies[config.EXPIRE_EXPIRES_COOKIE_NAME])));
  // return new Promise(async(resolve, reject) => {
    try 
      {
        refresh_token = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME]))).refresh_Token;
        console.log(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
    
       const tokenSet = await bexioClient.refresh(refresh_token);
       console.log(tokenSet);
       let bexioPool = await postgresBexio;
     
      let bexioTokenCookie = { 
        access_Token:tokenSet.access_token,
        refresh_Token:tokenSet.refresh_token,
        isBexioUser:true
      
      }
        const updateRefreshToken = `UPDATE companyregistered SET refreshtoken = $1
        WHERE rk_csn = $2`
       let rk_csn = jwt.decode(tokenSet.access_token)['company_id']

       await bexioPool.query(updateRefreshToken, [tokenSet.refresh_token,rk_csn]);
        res.cookie(config.TOKEN_COOKIE_BEXIO_NAME, encryptionControl.encrypt(JSON.stringify(bexioTokenCookie)), {
          domain: config.SESSION_DOMAIN,
          maxAge: config.SESSION_EXPIRY,
          httpOnly: true,
          signed: true,
          secure: true
      });
      res.send({ status: true })

      } catch (error) {
        
      
          logs.action = 'REFRESH_TOKEN_CREATE';
          logs.level = 'ERROR';
          logs.item = 'EDI';
          // //addlogs(logs,data.rolePartyId,data.roleAccId);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+refresh_token;
        warningMessage(commonErrors,error);
        console.log('error',error);
        return res.status(401).json({
          status: 'fail',
          message: 'unauthorized',
      });

        // reject()
  
     }
    // });

}
const apiTest = async (res,req)=>{
  const pool = await connectPostgres;

  // SELECT Id FROM MyTable WHERE Id = ANY($1::int[])',[ids]
  let userRoles;
  let roleValue = true;
  console.log(roleValue);
  let getRoleQry = `SELECT r.name,rav.fk_application_version,r.cid AS roleId FROM public.role_policy rp
  INNER JOIN public.role r ON r.cid = rp.fk_role
  INNER JOIN public.policy p ON p.cid = rp.fk_policy
  INNER JOIN role_application_version rav ON rav.fk_role =r.cid
  WHERE r.name = ANY($1::character varying[])`
  if(roleValue)
  {
    userRoles = ['COMPANY_BEXIO_ADMIN','EDI_ADMIN','PROFILE_READONLY','BEXIO_ADMIN'];
  }else{
    userRoles = ['COMPANY_READONLY','EDI_USER','PROFILE_READONLY','BEXIO_USER'];
  }
  
  const roleData = await pool.query(getRoleQry, [userRoles]);
  roleData.rows.forEach(element => {
   
  });
  // var request = require('request');
  // var options = {
  //   'method': 'POST',
  //   'url': 'https://api.bexio.com/2.0/contact/search',
  //   'headers': {
  //     'Accept': 'application/json',
  //     'Content-Type': 'application/json',
  //     'Authorization': 'Bearer eyJraWQiOiI2ZGM2YmJlOC1iMjZjLTExZTgtOGUwZC0wMjQyYWMxMTAwMDIiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ2ZWhpbGVzMzEzQG1hbm5hd28uY29tIiwibG9naW5faWQiOiJiYjZjYTMxZC1jZmI2LTQxNWYtOGE4My1hNjUyNTdlZTMyYWYiLCJjb21wYW55X2lkIjoibnNsbnV1cGhpdmZvIiwidXNlcl9pZCI6MzExOTI3LCJhenAiOiI0YjI4ZTA5Ny1iNzlhLTRhYTktOTI0NC04Yzc2YTkxNzU1N2QiLCJzY29wZSI6ImtiX29yZGVyX2VkaXQga2JfaW52b2ljZV9zaG93IG9wZW5pZCBjb250YWN0X3Nob3cgb2ZmbGluZV9hY2Nlc3MgcHJvZmlsZSBrYl9hcnRpY2xlX29yZGVyX3Nob3cga2Jfb2ZmZXJfc2hvdyBrYl9vcmRlcl9zaG93IGVtYWlsIiwiaXNzIjoiaHR0cHM6XC9cL2lkcC5iZXhpby5jb20iLCJleHAiOjE2NDU1MDcxMDMsImlhdCI6MTY0NTUwMzUwMywiY29tcGFueV91c2VyX2lkIjoxLCJqdGkiOiJiMmU5MmIzZS04NDBmLTRjZDEtOWE1MS1lMTljMjZkY2RhNTIifQ.KMFE46MKE0RSe-Qp4sjO3Y457CG_entFhztpgYW9EysCmP-doUrlcKVgd7K4MQfbLPUQrGZN-Y8AkzK8ywLXoav6XyRF0RSpAUCLt29lrwVH1bV01Vd_TI7GjYZRIkLtRaqVsKboH1Mb3h7IfeumdVM0_LU8VOQJ7tvEFxuyvCtgBFoSjCpnSNV4ibgxa1MyhYGf_SzeVFZG1gb8qugcocIbcbwOsmnBz9TJkpD58yAKk1Axa12Nb_piMJy-wwLnYAI22Yc1-Nk__rl260Cw-oyb-CMecyw0w1X0LGHlxrL-PeF4qiGC3pswsJmgOHdEXlRp9T4Ga9nBuBAdZ-qFGhmEGAOkPktKtaSZKo77POV_-FQULBtQh89UezjOf6u6Aeo7qMxneV9RjIJyIRxr3w-LEway52bovanR27kKCmny1PjNWgILAWDZuUaAgKlG-gx8fw1PHCE_jn0G2rCFdmjX45BP1g4DPuWrohTAOmFYttsjKlChAnQ9AHJmfKXynQOl5WTAjh8VzxyWQNkDOq4jDp966DeOM0v3XqCGdxfCwpsEeCZgbSJRalc4T_A0NYJCIr2ZCWdiAahSdhE8Q-rb8FtIbJrqlrwmEIstWZVGxXXPk_RrbN-YEkZyt8f6i4Y5J8poJSqF8H0AwLn1Dx8_nrO9ZUlpw8h2OLulJmE'
  //   },
  //   'body': JSON.stringify([{
  //     "field": "name_1",
  //     "value": "t"
  //   }])

  // };
  //   request(options, function (error, response) {
  //   if (error) throw new Error(error);
  //   //console.log(response.body);
    
  //   // res.send(response.body)
  // });
}

const bexioUserCreate = async (userDetails,companyDetails,accessToken,isAdmin,coutryCode,res,req)=>{
  console.log('0');

  let pool = await connectPostgres;
  let gate2b = await connectGate2b;
  let bexioPool = await postgresBexio;
  let newGate2b = await postgresGate2b;
  let legalname,streetno,phoneNumber;
  let isNewCompany = false,paymentData,orderId;
  console.log('1');

  let email = JSON.parse(userDetails).email;
  let givenname = JSON.parse(userDetails).given_name;
  console.log("req.body",req.body);
  if ('PaymentRecord' in req.body) {
    paymentData = encryptionControl.decryptCookie(req.body.PaymentRecord)
  }
  if ('orderId' in req.body) {
    orderId = encryptionControl.decryptCookie(req.body.orderId)
  }
  let isGerman = true;
  let technicalContactId;
  let billingContactId;
  let companyContactId;
  pool.query("begin");
  gate2b.query("begin");
  bexioPool.query("begin");
  newGate2b.query("begin");

  
  let rk_csn = jwt.decode(accessToken)['company_id']
  let partyId,netcomIdG2b,newCompany,companyNameGate2b,userBexioPermission;
    try {
        let party;
        let partyUser = true;
        let accountIdFinal = 0;
        let netcomeAddress;
        var check = `SELECT * 
          FROM companyregistered
          WHERE rk_csn =$1`;
          // let isAdmin = 
         const isCompanyAlreadyExists = await bexioPool.query(check, [rk_csn]);
         let isPartyExists
          if(isCompanyAlreadyExists.rows.length == 0)  
          {

              console.log('2');
              var check = `SELECT lp.companyName,a.city,a.zip,country_code, lp.fk_party,p.objectid
              FROM legalparty lp 
                INNER JOIN address a
                ON a.fk_party = lp.fk_party
                INNER JOIN party p 
                ON p.cid = lp.fk_party
              WHERE _type = 'main'
               AND companyname = $1
               AND a.city = $2
               AND a.zip = $3
               AND a.country_code = $4
               AND p.isdisabled = false`;
             
               let companyDeatails = JSON.parse(companyDetails)[0];
              const isPartyExists = await pool.query(check, [companyDeatails.name,companyDeatails.city,companyDeatails.postcode,coutryCode]);
              console.log('checkcheck',check);
              console.log('checkcheck',companyDeatails.name);
              console.log('checkcheck',companyDeatails.city);
              console.log('checkcheck',companyDeatails.postcode);
              console.log('checkcheck',coutryCode);
              console.log('companyDeatails.name',companyDeatails.name);
              console.log('companyDeatails.city',companyDeatails.city);
              console.log('companyDeatails.zip',companyDeatails.zip);
              console.log('coutryCode',coutryCode);
              console.log('isPartyExists',isPartyExists);
              console.log('isPartyExists',isPartyExists.rows.length);
              legalname = companyDeatails.legal_form;
              streetno = companyDeatails.address.split(' ').length > 1 ? companyDeatails.address.split(' ').pop():'';
              phoneNumber = companyDeatails.phone_fixed;
              // if(companyDeatails.name.split(' ').length > 1)
              // {
              //     let tempCompanyName = companyDeatails.name.split(' ');
              //     tempCompanyName.pop();
              //     companyDeatails.name = tempCompanyName.join(" ")
              // }
              console.log(companyDeatails.address.split(' ').length);
              console.log(streetno);
              
              if(companyDeatails.address.split(' ').length > 1)
              {
                  console.log('streetno');

                  let tempStreet = companyDeatails.address.split(' ');
                  tempStreet.pop();
                  companyDeatails.address = tempStreet.join(" ")

              }
              console.log('companyDeatails',companyDeatails);
            
              if(isPartyExists.rows.length == 0)
              {
                newCompany = true;
                isNewCompany = true;
                let currency
                if(coutryCode === 'CH' || 'LI'){
                  currency = 'CHF'
                }
                else{
                    currency = 'EUR'   
                }
                const getCurrency = `SELECT c.cid 
                  FROM currency c
                  WHERE c."label" = $1`
                const getCurrencyCode = await pool.query(getCurrency,[currency])
                console.log('getCurrencyCode',getCurrencyCode);
                
                party = await partyCreate(companyDeatails,coutryCode,email,getCurrencyCode.rows[0].cid);
                partyId = party.companyCreated;
                await partyServiceUpdate(partyId,'EDI','EDI');
                await addReferenceDetails(partyId)
                // await addFreePlanParty(partyId)

                async function addReferenceDetails(companyId){
                  const getRefernceAgent = ` SELECT cid FROM commissionagent c WHERE referralcode = 'bexio' `
                  const getAgentDetails = await pool.query(getRefernceAgent)
                  if(getAgentDetails.rows.length){
                      const addReference = ` INSERT INTO commissionagent_party (fk_commissionagent,fk_party,status) VALUES ($1,$2,$3)`
                      await pool.query(addReference,[getAgentDetails.rows[0].cid,companyId,'company_created'])
                  }
                  else{
                      let responseError ='Reference code incurrect or invalid'
                      commonErrors['errorTitle'] = 'bexio create';
                      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+responseError;
                      warningMessage(commonErrors,responseError); 
                  }
                }

                console.log('5555555555555555555555555555555555555');

                const ediPartyId = await netcomeCreate(party.partyResponse,getCurrencyCode.rows[0].cid);
                console.log('ediPartyIdediPartyId',ediPartyId);
              
                // NEW GATE2B INSERT
                const getObjectId = 'SELECT p.objectid FROM party p WHERE p.cid=$1';
                const objectId = await pool.query(getObjectId, [partyId]);
                console.log('objectIdobjectIdobjectId',objectId);
                console.log('getObjectIdgetObjectId',getObjectId);
                console.log('partyIdpartyId',partyId);
                const qryNetwork = `SELECT cid 
                  FROM network 
                  WHERE name = $1`
                const networkIdG2b  =  await newGate2b.query(qryNetwork, ['Bexio']);
                const add = 'INSERT INTO ediparty (fk_network,rk_party,netcomid,fk_currency) VALUES($1,$2,$3,$4) RETURNING *';
                const newGate2bId = await newGate2b.query(add, [networkIdG2b.rows[0].cid, objectId.rows[0].objectid, ediPartyId.netcomid,getCurrencyCode.rows[0].cid]);
                console.log('4444444444444444444444444444444');
                
                netcomeAddress = await netcomGate2b(companyDeatails, party.partyResponse, ediPartyId,coutryCode,newGate2bId.rows[0].cid,email);
                console.log('ediPartyId',ediPartyId);
                

                await saveLegal(party.partyResponse, companyDeatails);
                // let interFaceId = await getInterface();
                // console.log('interface',interFaceId['results']);
                // const interFace = interFaceId['results'].filter(e => e.key_channel.includes("WS"));
                // const connectorId = await addInterface(interFace[0].key_channel,ediPartyId.netcomid,1);
                // let params = JSON.parse(config.BEXIO_CONNECTION_CONFIG);
                // params.config.netcom_id = ediPartyId.netcomid;
                // params.config.name = ediPartyId.netcomid;
                // console.log(params);

                netcomIdG2b = ediPartyId.netcomid;
                companyNameGate2b = companyDeatails.name;

                partyUser = false;
              }else{
                const getNetComIdQry = `SELECT netcomid  FROM ediparty  WHERE  rk_party = $1`
                const objectId = await gate2b.query(getNetComIdQry, [isPartyExists.rows[0].objectid]);
                console.log('objectId',isPartyExists.rows[0]);

                console.log('objectId',objectId.rows);
                
                netcomIdG2b = objectId.rows[0].netcomid;
                console.log(netcomIdG2b);
                
                newCompany = false;
                partyId = isPartyExists.rows[0].fk_party;
                party = {
                  addressMain: '',
                  partyResponse: partyId,
                  addressCid: '',
                  billingCid: '',
                  technicalCid: '',
                  companyCreated:partyId
                }
              }

              console.log('partyId1',partyId);
              
             await setBexioCompany(partyId,rk_csn,netcomIdG2b);
              console.log('setBexioCompany');
              let data = {
                errorTitle: 'Created Company:' + ' ' + companyDeatails.name,
                errorDescription: "created new company",
                serverName: config.SERVER_NAME,
                systemName: config.SYSTEM_NAME,
                errorCategory: config.NOT_CATEGORY,
                errorCode: config.NOT_CODE,
                errorSource: config.ERROR_SOURCE,
                dockerName: config.DOCKER_NAME,
                senderCompany: '',
                receiverCompany: '',
                contactEmail: '',
                errorFile: ''
            }

            console.log("data :: ",data);
              // warningMessage(data,null)
              companyConfirmation(companyDeatails.name, companyDeatails.postcode, companyDeatails.city, companyDeatails.city, coutryCode)
            // await createBexioUser(accessToken)
            logs.action = 'BEXIO';
            logs.level = 'ERROR';
            logs.item = 'EDI';
            //addlogs(logs,partyId);
          }else{
            partyId = isCompanyAlreadyExists.rows[0].rk_party;
            let checkBlockedParty = `SELECT p.cid FROM party p  
            WHERE p.isblocked = true AND p.cid =$1`;
            let isDisabledParty = await pool.query(checkBlockedParty, [partyId]);
            if(isDisabledParty.rows.length){
              pool.query("rollback");
              gate2b.query("rollback");
              bexioPool.query("rollback");
              newGate2b.query("rollback");
                return({
                status_code: 500,
                message: 'blocked_party',
                status: false,
            });
            }
            // var checkParty = `SELECT isdisabled FROM party 
            // WHERE cid = $1 AND isdisabled = false`;
            // const isDisabledParty = await pool.query(checkParty, [partyId]);
            // console.log('isDisabledParty',isDisabledParty.rows.length);
            

            // if(isDisabledParty.rows.length == 0){
            //   pool.query("rollback");
            //   gate2b.query("rollback");
            //   bexioPool.query("rollback");
            //   newGate2b.query("rollback");
            //   return ({
            //     status_code: 500,
            //     message: 'something_went_wrong1',
            //     status: false,
            // });
            // }

            partyId = isCompanyAlreadyExists.rows[0].rk_party;
            console.log('partyIdelse',partyId);
            let companyDeatails = JSON.parse(companyDetails)[0];
            let streetNo = companyDeatails.address.split(' ').length > 1 ? companyDeatails.address.split(' ').pop():'';
            if(companyDeatails.address.split(' ').length > 1)
            {
                console.log('streetno');

                let tempStreet = companyDeatails.address.split(' ');
                tempStreet.pop();
                companyDeatails.address = tempStreet.join(" ")

            }
            let addressUpdate =[
              companyDeatails.address,
              streetNo,
              companyDeatails.postcode,
              companyDeatails.city,
              coutryCode,
              partyId
            ]
            let netComId = isCompanyAlreadyExists.rows[0].netcomid;
            // start update edi db change
            const getEdiPartyId = `SELECT cid  FROM ediparty e WHERE e.netcomid = $1`
            const ediPartyId = await gate2b.query(getEdiPartyId,[netComId]);
            console.log('55');
            console.log('netComId',netComId);

            const updateEdiAddressMain = `UPDATE address SET street=$1,streetno=$2,zip=$3,city = $4,country_code = $5 WHERE fk_ediparty = $6 AND "_type" = 'main'`
            console.log('44');
            console.log('44',companyDeatails);
            console.log('companyDeatails',companyDeatails);
            console.log('streetNo',streetNo);
            console.log('coutryCode',coutryCode);
            console.log('ediPartyId.rows[0].cid',ediPartyId.rows[0].cid);

            await gate2b.query(updateEdiAddressMain,[companyDeatails.address,streetNo,companyDeatails.postcode, companyDeatails.city,coutryCode,ediPartyId.rows[0].cid]);
            //  end update edi db change
            console.log('33');

            const updateAddressMain = `UPDATE address SET street=$1,streetno=$2,zip=$3,city =$4,country_code =$5 WHERE fk_party = $6 AND "_type" = 'main'`
            console.log('addressUpdate',addressUpdate);
            

            await pool.query(updateAddressMain,addressUpdate);
            console.log('33');

            const updateAddressBilling = `UPDATE address SET street=$1,streetno=$2,zip=$3,city =$4,country_code =$5 WHERE fk_party = $6 AND "_type" = 'billing'`
            await pool.query(updateAddressBilling,addressUpdate);
            console.log('33');

            const updateAddressTechnical = `UPDATE address SET street=$1,streetno=$2,zip=$3,city =$4,country_code =$5 WHERE fk_party = $6 AND "_type" = 'technical'`
            await pool.query(updateAddressTechnical,addressUpdate);
            console.log('companyDeatails.legal_form',companyDeatails.legal_form);
            const legalPartyData = [
              companyDeatails.name || '',
              companyDeatails.tax_number || '',
              companyDeatails.ust_id_nr || '',
              companyDeatails.legal_form,
              partyId
            ];
            const legalEdiPartyData = [
              companyDeatails.name || '',
              companyDeatails.tax_number || '',
              companyDeatails.ust_id_nr || '',
              companyDeatails.legal_form,
              ediPartyId.rows[0].cid
            ];
            const contactData=[
              coutryCode || '',
              companyDeatails.phone_fixed || '',
              partyId,
            ]
            const contactEdiData=[
              coutryCode || '',
              companyDeatails.phone_fixed || '',
              ediPartyId.rows[0].cid,
            ]
            console.log('legalPartyData',legalPartyData);
            

              const updateLegalParty = ` UPDATE legalparty SET companyname = $1,tax_number = $2,vat_id = $3,legalname = $4 where fk_party = $5 `
              await pool.query(updateLegalParty,legalPartyData);
              const updateEdiLegalParty = ` UPDATE legalparty SET companyname = $1,tax_number = $2,vat_id = $3,legalname = $4 where fk_ediparty = $5 `
              await gate2b.query(updateEdiLegalParty,legalEdiPartyData);
              const addContactNumber = `UPDATE phone SET country_code = $1,phone = $2  WHERE fk_party =$3`;
              await pool.query(addContactNumber,contactData);
              const addEdiContactNumber = `UPDATE phone SET country_code = $1,phone = $2  WHERE fk_ediparty =$3`;
              await gate2b.query(addEdiContactNumber,contactEdiData);

              console.log('112');
              console.log('userDetails',userDetails);

              console.log('companyDeatails.mail',companyDeatails.mail);
              console.log('JSON.parse(userDetails).email',JSON.parse(userDetails).email);

              
             let tempMail = companyDeatails.mail ? companyDeatails.mail: JSON.parse(userDetails).email;
             console.log('tempMail.mail',tempMail);

              const updateEmail = `UPDATE email SET email = $1 WHERE fk_party = $2 AND "_type" = 'company_contact'`
              await pool.query(updateEmail,[tempMail,partyId])
              const newEdiPartyId = await newGate2b.query(getEdiPartyId,[netComId]);
              let emailConatct =`UPDATE email SET email = $1 WHERE fk_ediparty = $2 AND "_type" = 'company_contact'`  
              await gate2b.query(emailConatct, [tempMail,ediPartyId.rows[0].cid]);
              await newGate2b.query(emailConatct, [tempMail,newEdiPartyId.rows[0].cid]);
              const legalNewEdiPartyData = [
                companyDeatails.name || '',
                companyDeatails.tax_number || '',
                companyDeatails.ust_id_nr || '',
                legalname,
                newEdiPartyId.rows[0].cid
              ];
              //update legal party in new gate2b
              console.log('112');

              await newGate2b.query(updateEdiLegalParty,legalNewEdiPartyData);
              const updateWebsite = ` UPDATE party SET website = $1 WHERE cid = $2 `
              await pool.query(updateWebsite,[companyDeatails.url,partyId]) 
              const updateGate2bWebsite = ` UPDATE ediparty SET website = $1 WHERE cid = $2 `
              await gate2b.query(updateGate2bWebsite,[companyDeatails.url,ediPartyId.rows[0].cid])  
              await newGate2b.query(updateGate2bWebsite,[companyDeatails.url, newEdiPartyId.rows[0].cid])



            console.log('22');

            party = {
              addressMain: '',
              partyResponse: partyId,
              addressCid: '',
              billingCid: '',
              technicalCid: '',
              companyCreated:partyId
            }
            netcomeAddress = await getPartyId(partyId);
          }

              let userId = await userCheck(JSON.parse(userDetails));
              if(!userId)
              {
                userId = await saveUser(JSON.parse(userDetails));
              }
              let userAccountStatus = await checkUserAccount(userId)
              // partyId = partyId ;
              console.log('partyId2',partyId);
              console.log('userAccountStatus',userAccountStatus);

  
              let accountId;
              
              if(!userAccountStatus)
              {
                console.log('paraccountaccountaccountaccountaccountaccountaccountaccountty',party);
                
                const accountIdResult = await account(userId, party, JSON.parse(userDetails), netcomeAddress,jwt.decode(accessToken)['user_id']);
                console.log('accountIdResult',accountIdResult);
              
                accountId = accountIdResult.accountId;
                partyId = accountIdResult.partyKey ;
              }else{
                accountId = userAccountStatus;
  
              }
              accountIdFinal = await savePartyAcc(partyId, accountId,isAdmin,partyUser);

           
              // let checkInvitationStatus  = await checkInvitation(JSON.parse(companyDetails)[0].name,partyId);
              console.log(newCompany);
              console.log(netcomIdG2b);
              console.log(companyNameGate2b);
              
              if(newCompany && accountIdFinal != 0 )
              {
                console.log('inside');
                // await sendEmailConfirmation(email,isGerman);
                let getLanguage =`SELECT  u."language",u.email,cid
                FROM "user" u
                WHERE u.email = $1`
                const userLanguage = await pool.query(getLanguage,[email]);
                // await gate2bRegisterInBexio(userLanguage.rows[0])
                let parmsSend = config.BEXIO_CONNECTION_CONFIG_SEND
                .replace('$netcom_id$',netcomIdG2b)
                .replace("$name$",companyNameGate2b)
                console.log('parms',parmsSend.slice(1,-1));
                console.log('parms',parmsSend);
                await setBusinessConnector(parmsSend);
                let parms = config.BEXIO_CONNECTION_CONFIG_RECEIVE
                .replace('$netcom_id$',netcomIdG2b)
                .replace("$name$",companyNameGate2b)
                console.log('parms',parms.slice(1,-1));
                console.log('parms',parms);
                await setBusinessConnector(parms);
                // console.log(config.SUPERADMIN);
                    
                // let getSuperRoleDetils = `SELECT array_agg(CID) AS roles
                //     FROM role 
                //     WHERE name IN (${config.SUPERADMIN})`;
                // const superRoleresult = await pool.query(getSuperRoleDetils);
                // console.log("superRoleresult",superRoleresult.rows);
                // let getAccountDetils = `SELECT a.cid AS accId,u.cid AS userId
                //     FROM account a INNER JOIN "user" u ON u.cid= a.fk_user
                //     WHERE u.email=$1`;
                // const accountRoleresult = await pool.query(getAccountDetils, [config.SUPPORTACCOUNTEMAIL]);
                // console.log("accountRoleresult",accountRoleresult.rows);
                // return
                // await updateIsSysUserStatus(partyId,accountRoleresult.rows[0].accid,superRoleresult.rows[0].roles);
                await contactUpdate(accountId, partyId, JSON.parse(userDetails).email,phoneNumber);
                await contactUpdateUser(userLanguage.rows[0].cid,partyId)
                logs.action = 'BEXIO.LOGIN';
                logs.level = 'NOTIFICATION';
                logs.item = 'EDI';
              }else{
                logs.action = 'BEXIO.LOGIN';
                logs.level = 'NOTIFICATION';
                logs.item = 'EDI';
              }
        
            // }
            pool.query("commit");
            gate2b.query("commit");
            bexioPool.query("commit");
            newGate2b.query("commit");

            if(isCompanyAlreadyExists.rows.length == 0)  
            {
              let  decryptData = encryptionControl.decrypt(req.body.encrToken);
              console.log('decryptData',decryptData);
              
              if(decryptData?.planId && decryptData?.subScriptionType)
              {
                await addSubscriptionParty(partyId,accountId,decryptData?.planId,decryptData?.subScriptionType,netcomIdG2b);
              }
            }
            // pool.query("rollback");
            // gate2b.query("rollback");
            // bexioPool.query("rollback");
            // newGate2b.query("rollback");
            
              // logs.action = 'CREATE_BEXIO';
              // logs.level = 'NOTIFICATION';
              // logs.item = 'EDI';
              addlogs(logs,partyId,accountIdFinal);
            if(accountIdFinal != 0)
            {


                        
              const getPartyAccountQryFinal = `SELECT pa.cid,fk_status FROM party_account pa
                INNER JOIN status s ON s.cid = pa.fk_status  
                WHERE  fk_party=$1 AND fk_account=$2 AND s."statusLabel" = 'active'`
              const partyAccountResult = await pool.query(getPartyAccountQryFinal, [partyId,accountId]);
              return ({
                statusCode: 201,
                message: 'register_account_and_user_created',
                status: true,
                accountId:accountIdFinal,
                isNewCompany:isNewCompany,
                partyAccountId:partyAccountResult.rows[0].cid
              });
            }else{
              commonErrors['errorTitle'] = 'bexioUserCreate';
              commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'error_in_savePartyAcc -req param,userDetails - '+JSON.stringify(userDetails)+' ,companyDetails - '+JSON.stringify(companyDetails)+' ,accessToken - '+JSON.stringify(accessToken)+' ,isAdmin - '+JSON.stringify(isAdmin)+' ,coutryCode - '+JSON.stringify(coutryCode);
              warningMessage(commonErrors,'error_in_savePartyAcc');
              return ({
                  status_code: 500,
                  message: 'something_went_wrong',
                  status: false,
              });
            }
          
        // } else {
        //     pool.query("rollback")
        //     gate2b.query("rollback")
        //     return res
        //         .status(500)
        //         .json({
        //             statusCode: 500,
        //             message: 'all data rollbacked',
        //             status: false
        //         });
        // }
        
    } catch (error) {
      
        // Logger.errorAndMail(error);
        console.log('error',error);
        pool.query("rollback");
        gate2b.query("rollback");
        bexioPool.query("rollback");
        newGate2b.query("rollback");
        logs.action = 'BEXIO.ACCOUNT.CREATE';
        logs.level = 'ERROR';
        logs.item = 'EDI';
        //addlogs(logs,partyId);
      commonErrors['errorTitle'] = bexioUserCreate.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString();
      warningMessage(commonErrors,error); 
      return ({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
      });
    }
// }
async function getBusinessConnecterConfiguration(method) {
  try {
   

    let  options = {
        'method': 'POST',
        'url': config.PYTHON_API+method,
        // 'headers': headers,
      };
    return new Promise(function (resolve, reject) {
      request(options, async function (error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(body);
          console.log(body);
          
        } else {
            console.log(error);
            
          reject(error);
        }
      });
    });
    
  } catch (error) {

      commonErrors['errorTitle'] = getBusinessConnecterConfiguration.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req python'+method;
      warningMessage(commonErrors,error);

  }
}
async function addInterface(channel,netcomId,status) {
  let formData = null
  try {
     formData = {
      netcom_id:netcomId,
      interface:channel,
      status:status,
      emails:''
    }

    let  options = {
        'method': 'POST',
        'url': config.PYTHON_API+'add-netcomid-interface',
        // 'headers': headers,
        formData: formData
      };
    return new Promise(function (resolve, reject) {
      request(options, async function (error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(body);
          console.log(body);
          
        } else {
            console.log(error);
            
          reject(error);
        }
      });
    });
  } catch (error) {
      commonErrors['errorTitle'] = addInterface.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+formData;
      warningMessage(commonErrors,error);
  }
}
async function getInterface() {
  console.log('123');
  
  // try {
    let formData = {
      // connection_id:,
      // customer_id:csn
    }

    let  options = {
        'method': 'POST',
        'url': config.PYTHON_API+'post-list/document-interface'
        // 'headers': headers,
      };
    return new Promise(function (resolve, reject) {
      request(options, async function (error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(JSON.parse(body));
          
        } else {
          console.log('error',error);
            
          reject(error);
        }
      });
    });
  // } catch (error) {
  // console.log(error);
    
  // }
}
async function setBusinessConnector(params) {
  try {
    // params['config']['include_pdf']="0"
    let fomdata={
      data:params
    }
    console.log('stringfuu',fomdata);
    
    let  options = {
        'method': 'POST',
         'url': config.PYTHON_API+'third-party-connector',
        // 'url':'http://192.168.2.63:5005/api/bexio-connector',
        // 'headers': headers,
        formData: fomdata
      };
    return new Promise(function (resolve, reject) {
      request(options, async function (error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(body);
          console.log('response',body);
          
        } else {
            console.log('error',error);
            
          reject(error);
        }
      });
    });
  
    
  } catch (error) {
      commonErrors['errorTitle'] = setBusinessConnector.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+params;
      warningMessage(commonErrors,error);
    console.log(error);
    
  }
}


async function checkUserAccount(userId) {
  // try {
    console.log('userId',userId);
    
    const checkUserAccountQry = `SELECT cid 
    FROM account
    WHERE fk_user = $1
    AND isdisabled = false`;
    let accountDetails = await pool.query(checkUserAccountQry, [userId]);
    console.log('checkUserAccount',accountDetails.rows.length);
    
    if(accountDetails.rows.length > 0)
    {
      return accountDetails.rows[0].cid;
    }else{
      return '';
    }
  // } catch (error) {
  //   console.log(error);
    
  // }
}

 
async function setBexioCompany(partyId,rk_csn,netcomIdG2b) {
  
  // try {
    const insQry = `INSERT INTO 
    companyregistered(rk_party,rk_csn,netcomid)
      VALUES($1,$2,$3)`;
      await bexioPool.query(insQry, [partyId,rk_csn,netcomIdG2b]);
  // } catch (error) {
  //   return true;
  // }
    return true;
  
}
async function getPartyId(partyId) {
  // try {
    console.log(partyId);
    
    const getObjectIdQry = `SELECT objectid 
      FROM party u
      WHERE cid = $1`;
    let getObjectId = await pool.query(getObjectIdQry, [partyId]);
    let partyResult;
    console.log(getObjectId.rows);
   
    if(getObjectId.rows.length > 0)
    {
      console.log(getObjectId.rows[0].objectid);
      
      const getPartyQry = `SELECT a.cid AS partyId FROM ediparty ep 
        INNER JOIN address a ON
        a.fk_ediparty = ep.cid
        WHERE ep.rk_party = $1`;
        partyResult = await gate2b.query(getPartyQry, [getObjectId.rows[0].objectid]);

    }
    console.log(partyResult.rows[0]);
    
    return partyResult.rows[0].partyid;
  // } catch (error) {
  //   pool.query("rollback");
  //   gate2b.query("rollback");
  //   bexioPool.query("rollback");
  // }
}
async function userCheck(decryptData) {
  // try {
    console.log(decryptData.email);
    
    let data = null;
    const check = `SELECT cid
                   FROM "user" u
                   WHERE email=$1 AND u."isUserActive" = true`;
    const isAlreadyExist = await pool.query(check, [decryptData.email]);
    if (isAlreadyExist.rows.length) {
      return data = isAlreadyExist.rows[0].cid;
    }else{
      data = '';
    }
    return data;
  // } catch (error) {
  //   pool.query("rollback");
  //   gate2b.query("rollback");
  //   bexioPool.query("rollback");
  //   return false;

  // }
    
}
async function partyCreate(decryptData,countryCode,email,currency) {
  
  // try {
    let addressCid;
    let technicalCid;
    let billingCid;
    let personalAddressCid
 
  //   const pool = await connectPostgres;
    const isnatural = false;
    const party = [
        null,
        null,
        decryptData.partyisconfirmeddate,
        decryptData.partyisdisableddate,
        decryptData.ismergeddate,
        isnatural,
        decryptData.url,
        true,
        currency
    ];
    const addressData = [
        '',
        'main',
        decryptData.number || '',
        decryptData.address || '',
        decryptData.line2 || '',
        decryptData.line3 || '',
        decryptData.address || '',
        streetno || '',
        decryptData.postcode || '',
        decryptData.city || '',
        decryptData.state || '',
        countryCode || '',
    ];
    const billingData = [
        '',
        'billing',
        decryptData.number || '',
        decryptData.address || '',
        decryptData.line2 || '',
        decryptData.line3 || '',
        decryptData.address || '',
        streetno || '',
        decryptData.postcode || '',
        decryptData.city || '',
        decryptData.state || '',
        countryCode || '',
    ];
    const technical = [
        '',
        'technical',
        decryptData.number || '',
        decryptData.address || '',
        decryptData.line2 || '',
        decryptData.line3 || '',
        decryptData.address || '',
        streetno || '',
        decryptData.postcode || '',
        decryptData.city || '',
        decryptData.state || '',
        countryCode || '',
    ];
    let personalAddress = [
        null,
        'personalAddress',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
    ];
    const partyCreation = ` INSERT INTO party 
                    (fk_party_parent, fk_address_main, isconfirmeddate, isdisableddate, ismergeddate, isnaturalperson,website,isconfirmed,fk_currency)
                     VALUES ($1, $2, $3, $4, $5, $6,$7,$8,$9) RETURNING cid `

    const addressSaveQuery = ` INSERT INTO address 
                       (fk_party,_type,number,line1,line2,line3,street,streetno,zip,city,state,country_code)
                        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING cid `

    console.log('111111111111111',addressData);


    const companyCreated = await pool.query(partyCreation, party);
    addressData[0] = companyCreated.rows[0].cid;
    const saveAddress = await pool.query(addressSaveQuery, addressData);
    const addressMain = saveAddress.rows[0].cid;
    addressCid = addressMain;

    billingData[0] = companyCreated.rows[0].cid;
    const billingAddress = await pool.query(addressSaveQuery, billingData);
    const billingMain = billingAddress.rows[0].cid;
    billingCid = billingMain;

    let emailNumberInsQry =`INSERT INTO email 
      (fk_party,_type,email) 
    VALUES($1,$2,$3) 
      RETURNING cid`   
    let companyContact = await pool.query(emailNumberInsQry, [companyCreated.rows[0].cid,'company_contact',email]);
    companyContactId = companyContact.rows[0].cid; 
    // const personalAddressResult = await pool.query(addressSaveQuery, personalAddress);
    // const personalAddressdata = personalAddressResult.rows[0].cid;
    // personalAddressCid = personalAddressdata;

    technical[0] = companyCreated.rows[0].cid;
    const technicalAddress = await pool.query(addressSaveQuery, technical);
    const technicalMain = technicalAddress.rows[0].cid;
    technicalCid = technicalMain;

    const updateComapny = 'UPDATE party SET fk_address_main=$1 WHERE party.cid=$2 RETURNING cid';
    await pool.query(updateComapny, [addressMain, companyCreated.rows[0].cid]);
    const partyResponse = companyCreated.rows[0].cid;


    let technicalContact = await pool.query(emailNumberInsQry, [companyCreated.rows[0].cid,'technical_contact',email]);
    technicalContactId = technicalContact.rows[0].cid;
    let billingContact = await pool.query(emailNumberInsQry, [companyCreated.rows[0].cid,'billing_contact',email]);
    billingContactId = billingContact.rows[0].cid;

    let data = {
        addressMain: addressMain,
        partyResponse: partyResponse,
        addressCid: addressCid,
        billingCid: billingCid,
        technicalCid: technicalCid,
        companyCreated:companyCreated.rows[0].cid
    }
    return data
  // } catch (error) {
  //     // pool.query("rollback");
  //     // gate2b.query("rollback");
  //     // bexioPool.query("rollback");
  //     return false;
  // }
}
  async function contactUpdate(accountID, companyID, email,mobileNumber) {
  console.log('hera');
  
    // const validationResult = await validation(decryptData);
    // if (!validationResult) {

    const getUser = `SELECT u.cid FROM "user" u
    INNER JOIN account a ON a.fk_user=u.cid WHERE a.cid=$1 AND a.isdisabled = false`;
    const getUserResult = await pool.query(getUser, [accountID]);
    const userCid = getUserResult.rows[0].cid;
    //         const contactUpdate = `UPDATE "user" u
    // SET givenname=$1, familyname=$2
    // WHERE cid=$3 RETURNING cid`;
    // const contactData = [decryptData.firstname, decryptData.lastname,userCid];
    //         await pool.query(contactUpdate, contactData);
    const checkEmail = `SELECT email from email WHERE fk_party=$1 AND _type='company_contact'` ;
    const checkEmailResult = await pool.query(checkEmail, [companyID]);
    const ediparty = `SELECT objectid FROM party p WHERE p.cid = $1`
    const getResult = await pool.query(ediparty,[companyID]);
    const ediPartyId = `SELECT cid FROM ediparty e WHERE rk_party = $1`
    const getEdiPartyResult = await gate2b.query(ediPartyId,[getResult.rows[0].objectid]);
    const getEdiResult = await newGate2b.query(ediPartyId,[getResult.rows[0].objectid]);
    let gate2bId = getEdiPartyResult.rows[0].cid;
    let newGate2bId = getEdiResult.rows[0].cid;
    if(checkEmailResult.rows.length > 0)
    {
        let emailNumberUpdateQry =`UPDATE email SET email = $1,fk_user=$2 WHERE fk_party=$3 `   
        await pool.query(emailNumberUpdateQry, [email,userCid,companyID]);
        let emailUpdateQry =`UPDATE email SET email = $1 WHERE fk_ediparty=$2 AND _type = 'company_contact'` 
        await gate2b.query(emailUpdateQry, [email,gate2bId]);
        await newGate2b.query(emailUpdateQry, [email,newGate2bId]);
    }else{
        let emailNumberInsQry =`INSERT INTO email (fk_party,_type,email,fk_user) VALUES($1,$2,$3,$4)`   
        await pool.query(emailNumberInsQry, [companyID,'company_contact',email,userCid]);
        let emailConatct =`INSERT INTO email (fk_ediparty,_type,email) VALUES($1,$2,$3) RETURNING cid`  
        await gate2b.query(emailConatct, [gate2bId,'company_contact',email]);
        await newGate2b.query(emailConatct, [newGate2bId,'company_contact',email]);

    }
    const checkPhone = `SELECT cid FROM phone WHERE fk_party = $1  AND _type = 'company_contact'` ;
    const result = await pool.query(checkPhone, [companyID]);
    if(result.rows.length > 0)
    {
        let mobileNumberUpdateQry =`UPDATE phone SET phone = $1,fk_user=$2 WHERE fk_party=$3 AND _type = 'company_contact'` 
        await pool.query(mobileNumberUpdateQry, [mobileNumber,userCid,companyID]);
    }else{
        const mobileNumberUpdate=`INSERT INTO phone (fk_party,"_type",phone,fk_user) VALUES($1,$2,$3,$4)` 
        const mobileDetails = [companyID, 'company_contact', mobileNumber, userCid];
        await pool.query(mobileNumberUpdate, mobileDetails);
    }
    const checkPhoneMain = `select cid from phone where fk_party=$1  AND _type = 'main'` ;
    const resultMain = await pool.query(checkPhoneMain, [companyID]);
    console.log(resultMain.rows);
    
    if(resultMain.rows.length > 0)
    {
      console.log('resultMain.rows');
      
        let mobileNumberUpdateQry =`UPDATE phone SET phone = $1,fk_user=$2 WHERE fk_party=$3 AND _type = 'main'` 
        await pool.query(mobileNumberUpdateQry, [mobileNumber,userCid,companyID]);
    }else{
      console.log('resultMain.rows else`');
      console.log('mobileNumber',mobileNumber);


        const mobileNumberUpdate=`INSERT INTO phone (fk_party,"_type",phone,fk_user) VALUES($1,$2,$3,$4)` 
        const mobileDetails = [companyID, 'main', mobileNumber, userCid];
        await pool.query(mobileNumberUpdate, mobileDetails);
    }
  };

  async function contactUpdateUser(userId,companyID) {
    const chekUserIsEmptyBilling = `SELECT * FROM address WHERE fk_party = $1 AND "_type" = 'billing'`
    const chekUserIsEmptyBillingResult = await pool.query(chekUserIsEmptyBilling, [companyID]);
    console.log(chekUserIsEmptyBillingResult.rows[0].fk_user);
    console.log(chekUserIsEmptyBillingResult.rows[0]);

    console.log('666666666666666');
    
    if(!chekUserIsEmptyBillingResult.rows[0].fk_user){
      // update address userid
      console.log('55555555555555555555555555');
      console.log(userId);
      
      const updateAddressWithUserId = 'UPDATE address SET fk_user=$1 WHERE  address.cid=$2 returning cid';
      await pool.query(updateAddressWithUserId, [userId, chekUserIsEmptyBillingResult.rows[0].cid]);
  }
    const chekUserIsEmptyTechnical = `SELECT * FROM address WHERE fk_party = $1 AND "_type" = 'technical'`
    const chekUserIsEmptyTechnicalResult = await pool.query(chekUserIsEmptyTechnical, [companyID]);

    if(!chekUserIsEmptyTechnicalResult.rows[0].fk_user){
      // update address userid
      console.log('666666666666666666');
      console.log(userId);

      const updateAddressWithUserId = 'UPDATE address SET fk_user=$1 WHERE  address.cid=$2 returning cid';
      await pool.query(updateAddressWithUserId, [userId, chekUserIsEmptyTechnicalResult.rows[0].cid]);
      }
    };
async function saveLegal(partyResponse, decryptData) {

  // try {
  console.log('decryptDataName',decryptData.name);
    
 
  //   const pool = await connectPostgres;
    const legalPartyData = [
        partyResponse || '',
        decryptData.name || '',
        decryptData.tax_number || '',
        decryptData.ust_id_nr || '',
        legalname
    ];
    const legalPartyInsert = `INSERT INTO legalparty 
                            (fk_party,companyname,tax_number,vat_id,legalname)
                            VALUES ($1,$2,$3,$4,$5) RETURNING cid`;
    const legalparty = await pool.query(legalPartyInsert, legalPartyData);
    return legalparty
//   } catch (error) {
//       // pool.query("rollback");
//       // gate2b.query("rollback");
//       // bexioPool.query("rollback");
//       return false;
// }
}
async function saveUser(decryptData) {
  // try {
    
  
    const currentDate = new Date();
  //   const pool = await connectPostgres;
    let sex = decryptData.gender.slice(0, 3);
    const values = [
        decryptData.given_name || '',
        decryptData.family_name || '',
        decryptData.email,
        sex,
        currentDate
    ];
    const userSave = `INSERT INTO "user" 
                    (givenname,familyname,email,sex,email_verified) 
                    VALUES ($1,$2,$3,$4,$5) RETURNING cid`
    addMailChimp(decryptData.given_name,decryptData.family_name,decryptData.email)
    const result = await pool.query(userSave, values)
    let userCid = result.rows[0].cid;

    return userCid

  // } catch (error) {
    
  //     // pool.query("rollback");
  //     // gate2b.query("rollback");
  //     // bexioPool.query("rollback");
  //     return false;
  // }
}


async function account(resultdata,partyData,decryptData,netcomeAddress,bexioUserId) {
  console.log('account');
  console.log(resultdata);


  
// try {
  

  // const pool = await connectPostgres;
  // const gate2b = await connectGate2b;
      const valuesaccount = [
          resultdata  || '',
          decryptData.authenticateid  || '',
          decryptData.commonname  || '',
          decryptData.email  || ''
          
      ];
      console.log('1');
      
      if(partyData.addressCid){
          const updateAddressWithUserId = `UPDATE address 
                                           SET fk_user=$1 
                                           WHERE address.cid=$2 RETURNING cid`;
         await pool.query(updateAddressWithUserId, [resultdata, partyData.addressCid]);
        
      }
      console.log('2');

      if(partyData.billingCid){
          const updateBillingWithUserId = `UPDATE address
                                           SET fk_user=$1 WHERE 
                                           address.cid=$2 RETURNING cid`;
         await pool.query(updateBillingWithUserId, [resultdata, partyData.billingCid]);
      }
      console.log('3');

      if(partyData.technicalCid){
          const updateTechnicalWithUserId = `UPDATE address
                                             SET fk_user=$1 WHERE  
                                             address.cid=$2 RETURNING cid`;
         await pool.query(updateTechnicalWithUserId, [resultdata, partyData.technicalCid]);
      }
      console.log('4');
        
     console.log(valuesaccount);
     
      const accountData=`INSERT INTO account
                        (fk_user,authenticateid,commonname,notificationemail) 
                         VALUES ($1,$2,$3,$4) RETURNING cid`
      const accountSave = await pool.query(accountData, valuesaccount);
      console.log('5');
  
      if(partyData.addressMain){
        const updateAddressWithUserId = `UPDATE address 
        SET fk_user = $1 
        WHERE address.cid=$2 RETURNING cid`;
        await pool.query(updateAddressWithUserId, [resultdata, partyData.addressMain]);
      }
     
      console.log('6');

      const updatePersonalWithUserId = `INSERT INTO address (fk_party,_type,number,line1,line2,line3,street,streetno,zip,city,state,country_code,fk_user)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING cid`
      let personalAddress = [
        null,
        'personalAddress',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
    ];


    console.log('7');
    
     const personalAddressResult = await pool.query(updatePersonalWithUserId,[...personalAddress,resultdata]);
     const personalAddressdata = personalAddressResult.rows[0].cid;
     let personalAddressCid = personalAddressdata;
     console.log('9');

      const updateAddressGate2b = `UPDATE address
                                   SET rk_user=$1
                                   WHERE address.cid=$2  RETURNING cid`;
      await gate2b.query(updateAddressGate2b, [resultdata, netcomeAddress]);
      const partyKey = partyData.partyResponse;
      let getBexioIdQry = `SELECT cid FROM 
          social_account_provider 
          WHERE provider = $1`;
          console.log('8');

      const getBexioId = await pool.query(getBexioIdQry,['Bexio']);

      let emailNumberInsQry =`UPDATE email SET fk_user = $1 WHERE email.cid = $2 RETURNING cid` 
      if(companyContactId){
          await pool.query(emailNumberInsQry, [resultdata, companyContactId]);    
      }
      if(technicalContactId){
          await pool.query(emailNumberInsQry, [resultdata, technicalContactId]); 
      }
      if(billingContactId){
          await pool.query(emailNumberInsQry, [resultdata, billingContactId]); 
      }

      const linkedaccount = [accountSave.rows[0].cid, getBexioId.rows[0].cid,bexioUserId];
      const linkedInSave =
          'INSERT INTO social_account (fk_account, fk_social_account_provider,authid) VALUES($1, $2,$3) RETURNING cid';
      await pool.query(linkedInSave, linkedaccount);
      console.log('10');

      let data={
          partyKey:partyKey,
          accountId:accountSave.rows[0].cid
      }
      console.log('done account');
      
      return data
    // } catch (error) {
    //     console.log(error);
    //     let data={
    //       partyKey:'',
    //       accountId:''
    //   }
    //     // pool.query("rollback");
    //     // gate2b.query("rollback");
    //     // bexioPool.query("rollback");
    //     throw error
     
    //     return data;
    // }
}
//uncoment for dummy import
 async function netcomeCreate (companyId,currency){


    const getObjectId = 'SELECT p.objectid FROM party p WHERE p.cid=$1';
    const objectId = await pool.query(getObjectId, [companyId]);


    const qryNetwork = `SELECT cid 
      FROM network 
      WHERE name = $1`
    const networkId  =  await gate2b.query(qryNetwork, ['Bexio']);
    const add = 'INSERT INTO ediparty (fk_network,rk_party,fk_currency,netcomid) VALUES($1,$2,$3,$4) RETURNING *';

    

    const checkTokenData1 = await gate2b.query(add, [networkId.rows[0].cid, objectId.rows[0].objectid,currency,'']);
   console.log('checkTokenData1.rows[0].cid',checkTokenData1.rows[0].cid);
   

    const netComNetwork = config.NETCOM_NETWORK; // dont change
    const netComCustomerOffset = config.NETCOM_CUSTOMER_OFFSET; // dont change
    const modulo1 = config.MODULO;
    const netComNumber = checkTokenData1.rows[0].cid; // unique key from party table cid
    const netcome = config.NETCOM_VALUE;
    const netcomFinal = parseInt(netComCustomerOffset) + netComNumber;
    const addNetcomWithZero = netcomFinal.toString().padStart(10, '0');
    const finalNetcom = netComNetwork + addNetcomWithZero;
    const beforeModulo = finalNetcom + '00';
    const moduloResult = parseInt(netcome) - (parseInt(beforeModulo) % parseInt(modulo1));
    const finalOut = finalNetcom.substr(0, 5) + '-' + finalNetcom.substr(5, 14) + '-' + moduloResult;

    const edipartyNetwork = `INSERT INTO ediparty_network
      (fk_ediparty,fk_network)
      VALUES($1,$2)`;


    const edipartyNetworkResult  =  await gate2b.query(edipartyNetwork, [checkTokenData1.rows[0].cid,networkId.rows[0].cid]);
    // interconectId = interconectId.rows.length == 0 ?  '' :interconectId.rows[0].cid;
    console.log('netComNumber',netComNumber);
    console.log('finalOutfinalOut',finalOut);
    checkTokenData1.rows[0]['netcomid'] = finalOut;
    const updateQtry =`UPDATE ediparty SET netcomid=$1 WHERE cid=${netComNumber}`
    await gate2b.query(updateQtry,[finalOut]);
    console.log('32');
    console.log('updateQtry',updateQtry);

 
    return checkTokenData1.rows[0];

}; 



// async function netcomeCreate (companyId,currency){
//   // try {
    
 
//   //   const pool = await connectPostgres;
//   //   const gate2b = await connectGate2b;
//     const netComNetwork = config.NETCOM_NETWORK; // dont change
//     const netComCustomerOffset = config.NETCOM_CUSTOMER_OFFSET; // dont change
//     const modulo1 = config.MODULO;
//     const netComNumber = companyId; // unique key from party table cid
//     const netcome = config.NETCOM_VALUE;
//     const netcomFinal = parseInt(netComCustomerOffset) + netComNumber;
//     const addNetcomWithZero = netcomFinal.toString().padStart(10, '0');
//     const finalNetcom = netComNetwork + addNetcomWithZero;
//     const beforeModulo = finalNetcom + '00';
//     const moduloResult = parseInt(netcome) - (parseInt(beforeModulo) % parseInt(modulo1));
//     const finalOut = finalNetcom.substr(0, 5) + '-' + finalNetcom.substr(5, 14) + '-' + moduloResult;
//     const getObjectId = 'SELECT p.objectid FROM party p WHERE p.cid=$1';
//     const objectId = await pool.query(getObjectId, [netComNumber]);
//     // const qryGetInterconectId = `SELECT cid 
//     //   FROM interconnect 
//     //   WHERE interconnectid = $1`
//     // let interconectId  =  await gate2b.query(qryGetInterconectId, ['gate2b 2.0']);

//     const qryNetwork = `SELECT cid 
//       FROM network 
//       WHERE name = $1`
//     const networkId  =  await gate2b.query(qryNetwork, ['Bexio']);
//     const add = 'INSERT INTO ediparty (fk_network,rk_party,netcomid,fk_currency) VALUES($1,$2,$3,$4) RETURNING *';

    
//     const edipartyNetwork = `INSERT INTO ediparty_network
//     (fk_ediparty,fk_network)
//     VALUES($1,$2)`;
//     const checkTokenData1 = await gate2b.query(add, [networkId.rows[0].cid, objectId.rows[0].objectid, finalOut,currency]);

//     const edipartyNetworkResult  =  await gate2b.query(edipartyNetwork, [checkTokenData1.rows[0].cid,networkId.rows[0].cid]);
//     // interconectId = interconectId.rows.length == 0 ?  '' :interconectId.rows[0].cid;
//     console.log('32');

//     return checkTokenData1.rows[0];
// //   } catch (error) {
// //       pool.query("rollback");
// //       gate2b.query("rollback");
// //       bexioPool.query("rollback");
// //       return false;
// // }
// };

// save netcome address with company
async function netcomGate2b(decryptData, companyId, ediPartyId,coutryCode,newGate2Id,email) {
  //   const pool = await connectPostgres;
  //   const gate2b = await connectGate2b;
  // try {
    

    const netcomAddress = `INSERT INTO address 
                           (fk_ediparty, _type, number, line1, line2, line3, street, streetno, zip, city, state, country_code)
                           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING cid`;
    const netcomAddressData = [
        ediPartyId.cid,
        'main',
        decryptData.number || '',
        decryptData.line1 || '',
        decryptData.line2 || '',
        decryptData.line3 || '',
        decryptData.street || '',
        streetno || '',
        decryptData.zip || '',
        decryptData.city || '',
        decryptData.state || '',
        coutryCode || '',
    ];
    const addressResult = await gate2b.query(netcomAddress, netcomAddressData);
    const netcomSavedId = addressResult.rows[0].cid;
    const legalPartygateData = [ediPartyId.cid, decryptData.name, decryptData.tax_number, decryptData.ust_id_nr,legalname];
    const legalParty = 'INSERT INTO legalparty (fk_ediparty,companyname,tax_number,vat_id,legalname) VALUES ($1,$2,$3,$4,$5)';
    await gate2b.query(legalParty, legalPartygateData);
    const currentDate = new Date();
    const saveEmailgate = [ediPartyId.cid, email, currentDate,'main'];
    const saveEmail = 'INSERT INTO email (fk_ediparty,email,email_verified,_type) VALUES ($1,$2,$3,$4)';
    console.log('oldg2b');

    await gate2b.query(saveEmail, saveEmailgate);
    const saveGate2bDeatils = [companyId, ediPartyId.objectid];
    const savedGate2b = 'INSERT INTO "_party_gate2b" (fk_party,rk_uid) VALUES ($1,$2) RETURNING cid';
    await pool.query(savedGate2b, saveGate2bDeatils);
    console.log('newg2b');

    legalPartygateData[0] = newGate2Id;
    saveEmailgate[0] = newGate2Id;
    await newGate2b.query(legalParty, legalPartygateData);
    await newGate2b.query(saveEmail, saveEmailgate);
    console.log('newg2b');

    const addContactNumber = `INSERT INTO phone 
     (fk_ediparty,_type,country_code,phone)
     VALUES ($1,$2,$3,$4) 
     RETURNING cid`;
    const contactData=[
    ediPartyId.cid,
    'main',
    coutryCode || '',
    decryptData.phone_fixed || '',
    ]

    await gate2b.query(addContactNumber,contactData);

    let emailConatct =`INSERT INTO email (fk_ediparty,_type,email) VALUES($1,$2,$3) RETURNING cid`  
    await gate2b.query(emailConatct, [ediPartyId.cid,'company_contact',email]);
    await newGate2b.query(emailConatct, [newGate2Id,'company_contact',email]);
    return netcomSavedId;
//   } catch (error) {
//       pool.query("rollback");
//       gate2b.query("rollback");
//       bexioPool.query("rollback");
//       return false;
// }
};

async function savePartyAcc(partyValue, acc,role,partyUser) {
  //   const pool = await connectPostgres;
  console.log('savePartyAcc');
  
  // try {
    const partyValuesSelect = [partyValue, acc];
    const getActiveStatus = `SELECT cid FROM status 
      WHERE 
      "statusLabel"=$1`
    const statusId = await pool.query(getActiveStatus, ['active']);
    const partyValues = [partyValue, acc,statusId.rows[0].cid,partyUser];

    const getPartyAccountQry = `SELECT pa.cid,fk_status FROM party_account pa
      INNER JOIN status s ON s.cid = pa.fk_status  
       WHERE  fk_party=$1 AND fk_account=$2 AND s."statusLabel" = 'active'`
    const partyResult = await pool.query(getPartyAccountQry, partyValuesSelect);
    if(partyResult.rows.length == 0){
      const partyAcc = `INSERT INTO party_account 
          (fk_party,fk_account,fk_status,isuser) 
        VALUES
          ($1,$2,$3,$4) RETURNING cid`;
          console.log('partyValues',partyValues);
          
      const partyAccount = await pool.query(partyAcc, partyValues);
      await partyApplicationDetails(partyValue,acc,partyAccount.rows[0].cid,role);
      console.log('savePartyAccDone');
      
      return partyAccount.rows[0].cid;

    }else{

      if(partyResult.rows[0].fk_status == statusId.rows[0].cid)
        return partyResult.rows[0].cid;
      else
       return 0;

    }

  // } catch (error) {
  //   console.log(error);
  //   throw error
    
  //     return false;
  // }
}
async function partyApplicationDetails (partyId,  accountId, partyAccount, roleValue) {
  const pool = await connectPostgres;

  let userRoles;
  return new Promise(async function (resolve, reject) {
    console.log('role',roleValue);
    
    if(roleValue)
    {
      userRoles = config.BEXIO_ADMIN_ROLE;
    }else{
      userRoles = config.BEXIO_USER_ROLE;
    }
    // WHERE name IN (${config.SUPERADMIN})`;

    let getRoleQry = `SELECT r.name,rav.fk_application_version,r.cid AS roleId FROM public.role_policy rp
    INNER JOIN public.role r ON r.cid = rp.fk_role
    INNER JOIN public.policy p ON p.cid = rp.fk_policy
    INNER JOIN role_application_version rav ON rav.fk_role = r.cid
    WHERE r.name IN (${userRoles})
    AND r.fk_party IS NULL`
    
    const roleData = await pool.query(getRoleQry);
    console.log('userRoles',userRoles);

    console.log('roleData',getRoleQry);

    console.log('roleData',roleData.rows);

    let getPartyApplicationStatus = `SELECT * FROM 
      partyapplication
      WHERE fk_party = $1
      AND fk_application_version = $2`;
    const insertPartyApplication = `INSERT INTO
      partyapplication
      (fk_party,fk_application_version) 
      VALUES($1,$2) RETURNING cid `;

    const insertPartyApplicationAccount = `INSERT INTO 
      partyapplication_account
      (fk_partyapplication,fk_account,fk_party_account) 
      VALUES($1,$2,$3) RETURNING cid `;

    const insertPartyApplicationAccountRole = `INSERT INTO 
      partyapplication_account_role
      (fk_partyapplication_account,fk_role) 
      VALUES($1,$2) `;

    roleData.rows.forEach(async(element) => {
      let partyApplicationId
      partyApplicationId = await pool.query(getPartyApplicationStatus, [partyId, element.fk_application_version]);
      if(partyApplicationId.rows.length == 0)
      {
        partyApplicationId = await pool.query(insertPartyApplication, [partyId, element.fk_application_version]);
      }

      let partyApplication = partyApplicationId.rows[0].cid;
      const partyApplicationAccountId = await pool.query(insertPartyApplicationAccount, [
          partyApplication,
          accountId,
          partyAccount,
      ]);
      let partyApplicationAccount = partyApplicationAccountId.rows[0].cid;
      await pool.query(insertPartyApplicationAccountRole, [partyApplicationAccount, element.roleid]);
    });
    resolve(1)
  });

};
async function addFreePlanParty(partyValue) {
  console.log('addFreePlanParty');
  console.log(partyValue);
  return new Promise(async (resolve, reject) => {
  
    const getFreePlan = `SELECT  avp."cid" AS freeappplanid
        ,avp.fk_plan AS planid
        FROM application_version_plan avp
        INNER JOIN plan p
        ON avp.fk_plan=p.cid
        WHERE avp.name='Free'
        AND p.code IN ('EDI')`;
    const getFreeplanDetails = await pool.query(getFreePlan);
    const getPlanStatusQry = `SELECT cid 
        FROM plan_status 
        WHERE status = 'Active'`
    const statusResult = await pool.query(getPlanStatusQry);
    let statusId = statusResult.rows[0].cid;

    getFreeplanDetails.rows.forEach(async(element) => {
        const partyPlan = `INSERT INTO 
            party_application_version_plan 
                (fk_application_version_plan,fk_party,enddate,fk_plan_status) 
            VALUES ($1,$2,now() + INTERVAL '29 DAY',$3)`;
            await pool.query(partyPlan, [element.freeappplanid,partyValue,statusId]);
            const partyWallet = `INSERT INTO 
                "partyWallet"
                    (fk_party,balance,"currentPlanAmount",fk_plan) 
                VALUES ($1,$2,$3,$4)`;
            await pool.query(partyWallet, [partyValue,0,0,element.planid]);
    })

      // const getPaymentMethodeQry = `SELECT cid 
      // FROM paymentmethod 
      // WHERE type = 'Invoice'`
      // const getPaymentMethode = await pool.query(getPaymentMethodeQry);

      // const setPartyMethodeQry = `INSERT INTO party_paymentmethod 
      // (fk_party,"fk_paymentMethod") 
      // VALUES
      // ($1,$2)`
      // const setPartyMethode = await pool.query(setPartyMethodeQry,[partyValue,getPaymentMethode.rows[0].cid]);
      resolve(true)
    });


  // return partyAccount;
}
async function addSubscriptionParty(partyValue,accountValue,planId,subScriptionType,netcomIdG2b) {
  return new Promise(async (resolve, reject) => {

      if (subScriptionType == 'PLAN') {

          let formData = {

              planId: planId,
              rolePartyId: partyValue,
              roleAccId: accountValue,
              user_email: email,
              language:'DE'
          };
          console.log('********************formData', formData);
          let planResponse = await planPurchase(formData);
          console.log('********************regResponse', planResponse);
      }
      else {
        let billingCookie = JSON.parse(encryptionControl.decryptCookie(req.cookies[config.BILLING_COOKIE_NAME]));
        const getActivation = `SELECT paymentData, detail FROM activation WHERE objectid = $1`;
        const activationResult = await pool.query(getActivation, [billingCookie.objectid]);
        console.log("Object ID:", billingCookie.objectid);
        let paymentDetails = activationResult.rows[0]?.paymentdata;

        // Update activation table if paymentData exists
        if (paymentDetails) {
          const updateActivationTableQry = `UPDATE activation 
          SET paymentdata = 
                          jsonb_set(
                              jsonb_set(
                                  cast(paymentdata AS jsonb), 
                                  '{rolePartyId}', 
                                  to_jsonb('${partyValue}'::text), 
                                  true
                              ), 
                              '{roleAccId}', 
                              to_jsonb('${accountValue}'::text), 
                              true
                          )
          WHERE objectid = '${billingCookie.objectid}' RETURNING paymentdata`;

          const updateResult = await pool.query(updateActivationTableQry);
          paymentDetails = updateResult.rows[0]?.paymentdata; 

          // console.log('********************paymentDetails', paymentDetails);
          // let encryptedPaymentData = {
          //   payementData: encryptionControl.encrypt(JSON.stringify(paymentDetails)) 
          // };
          // console.log('******************** failure paymentData:', encryptedPaymentData);
          let packageSuccess = await packagePayment(paymentDetails);
          console.log('******************** packagePayment Response for paymentData:', packageSuccess);
        }

       
        let formData = {

          addonId: planId,
          rolePartyId: partyValue,
          roleAccId: accountValue,
          user_email: email,
          language: 'DE',
          user_first_name: givenname,
          orderId:orderId,
          ...(paymentData && { payedResponse: paymentData })
        };

       
        // let encryptedFormData = {
        //   payementData: encryptionControl.encrypt(JSON.stringify(formData))
        // };

        // console.log('******************** Sending packagePayment with formData:', encryptedFormData);
        let packageResponse = await packagePayment(formData);
        console.log('******************** packagePayment Response for formData:', packageResponse);

      }
      resolve(true)
  });

}
async function updateIsSysUserStatus ( partyId,accId,role ) {
  // try {
      
      // const pool = await connectPostgres; 
      const getStatusQry = `  SELECT cid FROM status WHERE "statusLabel" = 'active'`
      const statusResult = await pool.query(getStatusQry);

      const checkAccount = `  SELECT cid
                                  ,fk_party
                                  ,fk_account
                              FROM party_account
                              WHERE fk_party=$1
                              AND fk_account=$2`;
      const checkAccountResult = await pool.query(checkAccount,[partyId, accId]);
      if(accId){
          var getCompany;
          if(checkAccountResult.rows.length > 0){
              const updatepartyAccount = `UPDATE party_account SET issystemuser= $3,fk_status = $4 WHERE fk_party=$1 AND fk_account=$2 `;
              getCompany = await pool.query(updatepartyAccount,[partyId, accId,true,statusResult.rows[0].cid]);
          }
          else{
              
              const addPartyAccount = 'INSERT INTO party_account(fk_party,fk_account,issystemuser) VALUES($1,$2,$3)RETURNING cid';
              getCompany = await pool.query(addPartyAccount, [partyId, accId,true]);
          }
          if(getCompany.rows.length !== 0 || checkAccountResult.rows.length != 0){
              await addUserRole(partyId,accId,role);
          }
      }
  // } catch (error) {
  //     console.log(error);
  //     commonErrors['errorTitle'] = req.originalUrl;
  //     commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+encrToken;
  //     warningMessage(commonErrors,error);
  //     return res.status(statusCode.OK).json({
  //         status_code: 500,
  //         message: 'something_went_wrong',
  //         status: false,
  //     });
  // }
};       
async function addUserRole ( partyId,accId,roles ) {
  // const pool= await connectPostgres;
  // let bexioPool = await postgresBexio;

  //  try {
      // let inbuiltRoles;
      // let companyAdmin
      // const formData = req.body;
      // let partyApplicationAccount = decryptData.partyApplicationAccountId;
      // roles = role
      console.log(roles);
      
      roles.length == 0 ? roles.push(0):'';
      // const checkBexio = ` SELECT rk_party FROM companyregistered c WHERE rk_party = $1 `
      // const isbexio = await bexioPool.query(checkBexio,[partyId])
      // let roleLabel = '';
      // if(isbexio.rows.length){
      //     roleLabel = 'COMPANY_BEXIO_ADMIN';
      // }
      // else{
      //     roleLabel = 'COMPANY_ADMIN';
      // }
      // const getAdminRole = `SELECT r.cid  FROM "role" r WHERE r."name" = $1`
      // const getRoleName = await pool.query(getAdminRole,[roleLabel]);
      // const roleId = getRoleName.rows[0].cid
      // const getCompanyAdmin = `SELECT count(pa.cid) AS admincount FROM partyapplication_account_role par
      // INNER JOIN partyapplication_account pa ON pa.cid = par.fk_partyapplication_account
      // INNER JOIN "role" r ON r.cid  = par.fk_role
      // INNER JOIN partyapplication p ON p.cid = pa.fk_partyapplication
      // INNER JOIN party_account pac ON pac.cid = pa.fk_party_account
      // INNER JOIN status s ON s.cid = pac.fk_status
      // WHERE p.fk_party = $1 AND r."name" = $3 AND s."statusLabel" = 'active' AND pa.fk_account !=$2`
      // const companyAdminCount = await pool.query(getCompanyAdmin, [partyId,accId,roleLabel]); 
      // console.log(companyAdminCount.rows[0]);
      // if(companyAdminCount.rows[0].admincount == 0){
      //     const found = roles.find(element => element == roleId);
      //     if(found === roleId){
      //         companyAdmin = true;
      //     }
      //     else{
      //         return res.status(500).json({
      //             message: `last_company_admin_role`,
      //             status: false
      //         });
      //     }
      //     }
      //     else{
      //         companyAdmin = true; 
      //     }
      // if(companyAdmin){
      // pool.query('begin');
      let deleteRolesQry = `DELETE FROM partyapplication_account_role
           WHERE cid IN(
            SELECT par.cid from partyapplication_account_role par
                  INNER JOIN partyapplication_account pa ON par.fk_partyapplication_account = pa.cid
                  INNER JOIN partyapplication p ON p.cid = pa.fk_partyapplication 
              WHERE fk_account = $1
                  AND  fk_party = $2)
                  RETURNING *`

          let deleteRolesResult = await pool.query(deleteRolesQry,[accId,partyId]);
          let deletePartyAccountQry = `DELETE 
          FROM partyapplication_account 
          WHERE cid IN(
              SELECT paa.cid 
              FROM partyapplication_account paa 
              INNER JOIN party_account pa ON pa.cid = paa.fk_party_account  
              WHERE paa. fk_account = $1 AND pa.fk_party = $2
          )`
          let deletePartyAccount = await pool.query(deletePartyAccountQry,[accId,partyId]);

          // let checkBexioCompany = `SELECT cid FROM companyregistered
          //     WHERE rk_party = $1`
      
          // let checkBexioCompanyResult = await bexioPool.query(checkBexioCompany,[partyId]);
          
          // let selectInbuiltRolesQry = `SELECT cid FROM role
          //     WHERE name = $1`

          // inbuiltRoles = checkBexioCompanyResult.rows.length > 0 ?  'PROFILE_READONLY' : 'PROFILE_USER'
          // let selectInbuiltRolesQryResult = await pool.query(selectInbuiltRolesQry,[inbuiltRoles]);

          // selectInbuiltRolesQryResult.rows.length > 0 ? roles.push(selectInbuiltRolesQryResult.rows[0].cid) : '';

          console.log('roles',roles);
             if(roles.length != 0) 
             {

              let adminRoleDetils =`SELECT  
              rav.fk_application_version
             ,r.cid AS roleid
              FROM role_policy rp
              INNER JOIN "role" r
              ON r.cid = rp.fk_role
              INNER JOIN "policy" p
              ON p.cid = rp.fk_policy
              INNER JOIN role_application_version rav
              ON rav.fk_role = r.cid
              WHERE r.cid = ANY($1::integer[])`
              const result = await pool.query(adminRoleDetils, [roles]);

              console.log('result',result.rows);
              
              
              const partyApplicationDetails = ` SELECT cid 
                  FROM 
                      partyapplication  p 
                  WHERE 
                      fk_party = $1 
                  AND fk_application_version = $2 `;
                  console.log('result',result.rows);

              const partyAccountDetailsQry = ` SELECT p.cid 
                                               FROM 
                                               party_account  p 
                                               INNER JOIN status s 
                                               ON s.cid = p.fk_status
                                               WHERE 
                                               fk_party = $1 
                                               AND fk_account = $2
                                               AND s."statusLabel" ='active' `;
              const partyAccountDetails = await pool.query(partyAccountDetailsQry,[partyId,accId])
            
              const insertPartyApplicationAccount = ` INSERT INTO partyapplication_account
                                          (fk_partyapplication,fk_account,fk_party_account) 
                                          VALUES($1,$2,$3) RETURNING cid `;
              const insertPartyApplicationAccountRole = ` INSERT INTO partyapplication_account_role
                                              (fk_partyapplication_account,fk_role) 
                                              VALUES($1,$2) `;

              let partyApplicationExist,partyApplictionExist;
              for (const element of result.rows)
                  {
                      partyApplictionExist = await pool.query(partyApplicationDetails,[partyId,element.fk_application_version])
                      if(partyApplictionExist.rows.length != 0){
                      partyApplicationExist = partyApplictionExist.rows[0].cid
                  }
                  console.log('partyApplicationExist',partyApplicationExist);
                  
                  const partyApplicationAccountId = await pool.query(insertPartyApplicationAccount,[partyApplicationExist,accId,partyAccountDetails.rows[0].cid]);
                  let partyApplicationAccount = partyApplicationAccountId.rows[0].cid;

                  
                   await pool.query(insertPartyApplicationAccountRole, [partyApplicationAccount, element.roleid]);

              }
              
              // let updateRolesQry = `
              //     INSERT INTO 
              //         partyapplication_account_role
              //             (fk_partyapplication_account,fk_role)
              //     SELECT pac.cid AS partyAccountId,r.cid AS roleId FROM public.role_policy rp
              //         INNER JOIN public.role r ON r.cid = rp.fk_role
              //         INNER JOIN public.policy p ON p.cid = rp.fk_policy
              //         INNER JOIN role_application_version rav ON rav.fk_role = r.cid
              //         INNER JOIN partyapplication pa ON pa.fk_application_version = rav.fk_application_version
              //         INNER JOIN partyapplication_account pac ON pac.fk_partyapplication = pa.cid
              //     WHERE r.cid IN (${roles})
              //         AND pac.fk_account = $1
              //         AND  pa.fk_party = $2
              //         RETURNING *`
              // let selectRolesResult = await pool.query(updateRolesQry,[formData.accountId,formData.partyId]);
              // console.log(selectRolesResult.rows);
             }
              // pool.query('COMMIT')
              
              // let a  = await getUserPermissions(partyId,accId);
  //  return res.status(200).json({  
  //     status_code: 200,
  //     message: 'add_new_role', 
  //     status: true 
  //  })
  // }
//   }
//     catch(error){
//         console.log(error)

//          pool.query('ROLLBACK')
//          commonErrors['errorTitle'] = req.originalUrl;
//          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+formData;
//          warningMessage(commonErrors,error);
//     Logger.errorAndMail(error);
//       return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
//         message: 'something went wrong',
//         status: false
//       });
//      }
}
}
async function sendEmailConfirmation(mail,isGerman)
  {
    let message,subject;
    console.log(message);
    message = isGerman ?  mailTemplate.bexioInviteGn : mailTemplate.bexioInviteEn;
    subject = isGerman ?  mailTemplate.bexioInviteGnSubject : mailTemplate.bexioInviteEnSubject;
    await sendEmail({
      email: mail,
      subject: subject,
      message,
    });
  }

  const inviteCompany = async (req, res) => {
    let cookie = null
    const data = req.body;
    const pool = await connectPostgres;
    let bexioPool = await postgresBexio;
  
    try {
        cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
        let accessToken = cookie.access_Token;
       
        console.log("data.contactsId:: ",data.contactsId);
        
        let senderNr = await getContactDetails(accessToken,data.contactsId);
        if(!senderNr)
        {
          commonErrors['errorTitle'] = inviteCompany.name;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'contact_details_not_found - req param,',req.body;
          warningMessage(commonErrors,'contact_details_not_found');
          logs.action = 'bexio.dashboard.invite';
          logs.level = 'ERROR';
          logs.item = 'EDI';
          addlogs(logs,data.rolePartyId,data.roleAccId);
          res.send({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
        
          });
          return
        }
  
        if(senderNr['id'])
        {
          let pool = await connectPostgres;
          let gate2b = await connectGate2b;
          let newG2b = await postgresGate2b;
          let inviteSendStatus = false;  
          pool.query("begin");
          bexioPool.query("begin");
  
          let getPartyAccountIdQry = `SELECT pa.cid,p.objectid,lp.companyname
            FROM party_account pa
              INNER JOIN party p ON pa.fk_party = p.cid 
              INNER JOIN legalparty lp ON lp.fk_party = p.cid 
              INNER JOIN status s ON s.cid = pa.fk_status 
            WHERE pa.fk_account = $1
              AND pa.fk_party = $2 AND s."statusLabel" = 'active'`
        
          const getPartyAccountId = await pool.query(getPartyAccountIdQry, [data.accountId, data.partyId]);
          console.log('getPartyAccountId',getPartyAccountId.rows);
          console.log('accountId',data.accountId);
          console.log('partyId',data.partyId);
          console.log("senderNr['id']",senderNr['id']);
          let getNetcomIdQry = `SELECT netcomid 
            FROM ediparty 
            WHERE rk_party = $1`
          const netComId = await gate2b.query(getNetcomIdQry, [getPartyAccountId.rows[0].objectid]);
          console.log(netComId.rows[0].netcomid);
    
          const getCompanyCode = `SELECT * FROM 
            companyregistered
            WHERE rk_party = $1`
          const getCompanyCodeResult = await bexioPool.query(getCompanyCode, [data.partyId]);
          console.log("getCompanyCodeResult.rows ",getCompanyCodeResult.rows);
    
          const inviteCompanyCheck = `SELECT * FROM 
          contact_bc
            WHERE fk_companyregistered = $1
            AND rk_sendercontactid = $2
            AND type = 'EDI'`
          const partyAccountCheck = await bexioPool.query(inviteCompanyCheck, [getCompanyCodeResult.rows[0].cid,data.contactsId]);
          let tempElement;
          for (let index = 0; index < partyAccountCheck.rows.length; index++) {
            const element = partyAccountCheck.rows[index];
            console.log(getCompanyCodeResult.rows[0].netcomid);
            console.log(element['invitecode']);
            
            let invitionDetails = await getInvitationDetails(element['invitecode']);
            console.log('invitionDetails',invitionDetails['results'][0]['fk_doc_type']['data']);
            if(invitionDetails['results'][0]['fk_doc_type']['data'] == data['docType'])
            {
              tempElement = element;
              break;
            }
          }
          console.log('tempElement',tempElement);
          
          if (tempElement) {
           
            if(tempElement['rk_businessconnection'] != null)
            {
              inviteSendStatus = true;
            }else{
              inviteSendStatus = false;
              const deleteInvite = `DELETE FROM  
              invitations
              WHERE invite_code = $1`
              console.log('testParty',tempElement.invitecode);
  
              await newG2b.query(deleteInvite, [tempElement.invitecode]);
              const inviteCompanyDelete = `DELETE FROM  
              contact_bc
              WHERE cid = $1
                AND type = 'EDI'`
              await bexioPool.query(inviteCompanyDelete, [tempElement.cid]);
            }
          }else{
            inviteSendStatus = false;
    
          }
            if(!inviteSendStatus)
            {
              const inviteCompanyInsert = `INSERT INTO 
              contact_bc 
                (rk_party_account,"rk_netcomidsender","receiveremail","sendercustomerid",rk_sendercontactid,fk_companyregistered,"receivercustomerid",type)
              VALUES($1,$2,$3,$4,$5,$6,$7,$8)
                RETURNING cid`
               
              const invitationId = await bexioPool.query(inviteCompanyInsert, [getPartyAccountId.rows[0].cid,  netComId.rows[0].netcomid,data.email,"1",data.contactsId,getCompanyCodeResult.rows[0].cid,senderNr['id'],'EDI']);
         
              console.log(encodeURIComponent(encryptionControl.encrypt('bexioUser/'+invitationId.rows[0].cid.toString())));
              let idToPython = encodeURIComponent(encryptionControl.encrypt('bexioUser'))+'/'+encodeURIComponent(encryptionControl.encrypt(invitationId.rows[0].cid.toString()));
              // let connectionStatusResult =  {"data":{"business_connection_connectionStatus":{ "in":0,"out":0,"label":"business_connection_connectionStatus"},"business_connection_invitation_sent_received":{"in":0,"out":0,"label":"business_connection_invitation_sent_received"},"business_connection_connection_active":{"in":0,"out":0,"label":"business_connection_connection_active"},"business_connection_format_check":{"in":0,"out":0,"label":"business_connection_format_check"},"business_connection_running_mode_test":{"in":0,"out":0,"label":"business_connection_running_mode_test"},"business_connection_running_mode_live":{"in":0,"out":0,"label":"business_connection_running_mode_live"},"business_connection_TXCost":{"in":0,"out":0,"label":"business_connection_TXCost"}}}
              // connectionStatusResult.data.business_connection_connectionStatus['in'] = 1;
              // connectionStatusResult.data.business_connection_invitation_sent_received['in'] = 1; 
              // connectionStatusResult.data.business_connection_connection_active['in'] = 1; 
              // connectionStatusResult.data.business_connection_TXCost['in'] = 1; 
              let doc_type = data.docType ? data.docType : 'Invoice';
              let direction = data.direction ? data.direction.toUpperCase() == 'SEND' ? 'IN' : 'OUT' : 'IN';
              let parms = config.BEXIO_INVITE_CONFIG
              .replace('$netcom_id$',netComId.rows[0].netcomid)
              // .replace("$name$",getPartyAccountId.rows[0].companyname)
              .replace("$name$",getPartyAccountId.rows[0].companyname)
              .replace("$language$",'EN')
              .replace("$in_customer_id$","1")
              .replace("$partner_email$",data.email)
              .replace("$bexio_invite_id$",idToPython)
              .replace("$out_customer_id$",senderNr['id'])
              .replace("$user_email$",data.email)
              .replace("$invited_company_name$",data.invitedcompanyname)
              .replace("$customer_name$",data.userName)
              .replace("$direction$",direction)
              .replace("$doc_type$",doc_type);
             
              
              parms = JSON.parse(parms);
              // parms['config']['field_status'] = connectionStatusResult;
              parms['config']['inviter_netcom_id'] = data.inviterNetcomId;
              parms['config']['inviter_company_name'] = data.inviterCompanyName;
              console.log('url',parms);
              let inviteStatus;
              if( doc_type != 'Invoice'){
                let params = {'direction': data.direction.toUpperCase(),'netcomId':netComId.rows[0].netcomid,'name':getPartyAccountId.rows[0].companyname,'doc_type':doc_type};
                await createConnector(params);
              }
              inviteStatus = await inviteCompanySend(JSON.stringify(parms));            
              console.log('inviteStatus',inviteStatus);
              
              if(JSON.parse(inviteStatus).status)
              {
                let temp = req.url.substr(1,req.url.length);
                console.log('temp',temp);
                let redisKey = req.body.partyId+"_/";
                await deleteRedis(req.url.substr(1,req.url.length),redisKey);
                const inviteCompanyDelete = `UPDATE contact_bc
                  SET invitecode = $1
                  WHERE cid = $2`
                await bexioPool.query(inviteCompanyDelete, [JSON.parse(inviteStatus).invite_code,invitationId.rows[0].cid]);
                pool.query("commit");
                bexioPool.query("commit");
  
                logs.action = 'bexio.dashboard.invite';
                logs.level = 'NOTIFICATION';
                logs.item = 'EDI';
                addlogs(logs,data.rolePartyId,data.roleAccId);

                return res.status(200).json({
                  status_code: 200,
                  message: 'success',
                  status: true,
              });
    
              }else{
                  pool.query("rollback");
                  bexioPool.query("rollback");
                  commonErrors['errorTitle'] = inviteCompany.name;
                  commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'send-invitation_failed - req param,',req.body;
                  warningMessage(commonErrors,'send-invitation_failed');
                  logs.action = 'bexio.dashboard.invite';
                  logs.level = 'ERROR';
                  logs.item = 'EDI';
                  addlogs(logs,data.rolePartyId,data.roleAccId);
                  return res
                    .status(200)
                    .json({
                        status_code: 500,
                        message: 'something_went_wrong',
                        status: false
                    });
              }
            }else{
              pool.query("rollback");
              bexioPool.query("rollback");
              logs.action = 'bexio.dashboard.invite';
              logs.level = 'ERROR';
              logs.item = 'EDI';
              addlogs(logs,data.rolePartyId,data.roleAccId);
              commonErrors['errorTitle'] = inviteCompany.name;
              commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'error_in_inviteSendStatus - req param,',req.body;
              warningMessage(commonErrors,'error_in_inviteSendStatus');
              return res
                .status(200)
                .json({
                    status_code: 500,
                    message: 'something_went_wrong',
                    status: false
                });
            }
             
            
        }else{
          pool.query("rollback");
          bexioPool.query("rollback");
          logs.action = 'bexio.dashboard.invite';
          logs.level = 'ERROR';
          logs.item = 'EDI';
          addlogs(logs,data.rolePartyId,data.roleAccId);
          return res
          .status(200)
          .json({
              status_code: 500,
              message: 'already_invited',
              status: false
          });
        }
        
  
    } catch (error) {
      pool.query("rollback");
      bexioPool.query("rollback");
          logs.action = 'bexio.dashboard.invite';
          logs.level = 'ERROR';
          logs.item = 'EDI';
          addlogs(logs,data.rolePartyId,data.roleAccId);
          console.log(error);
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+cookie;
          warningMessage(commonErrors,error);
        return res
            .status(200)
            .json({
                status_code: 500,
                message: 'something_went_wrong',
                status: false
        });
    }
  }
async function inviteCompanySend(params) {
  // return new Promise(async (resolve, reject) => {
    console.log('inviteCompanySend');

    try {
      let fomdata={
        data:params
      }
      console.log(fomdata);
      
      let  options = {
          'method': 'POST',
          'url': config.PYTHON_API+'send-invitation',
          // 'url':'http://192.168.2.63:5005/api/send-invitation',
          // 'headers': headers,
          formData: fomdata
        };
      return new Promise(function (resolve, reject) {
        request(options, async function (error, response, body) {
          if (!error && response.statusCode == 200) {
            resolve(body);
            console.log('body',body);
            
          } else {
              console.log('error',error);
              
            reject(error);
          }
        });
      });
    
      
    } catch (error) {
      commonErrors['errorTitle'] = inviteCompanySend.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+params;
      warningMessage(commonErrors,error);
      console.log(error);
      
    }
  // });
}

async function createConnector(params){
  try {
    let config_key = 'BEXIO_CONNECTION_CONFIG_ORDER_'+params.direction;
    let connectorConfig = config[config_key]
    .replace('$netcom_id$',params.netcomId)
    .replace("$name$",params.name)
    .replace("$doc_type$",params.doc_type);

    let formdata={
      data:connectorConfig
    }
    let  options = {
      'method': 'POST',
      'url': config.PYTHON_API+'third-party-connector',
      // 'url':'http://192.168.2.64:5005/api/third-party-connector',
      // 'headers': headers,
      formData: formdata
    };
    return new Promise(function (resolve, reject) {
      request(options, async function (error, response, body) {
        if (!error && response.statusCode == 200) {
          resolve(body);
          console.log('body',body);
          
        } else {
            console.log('error',error);
            
          reject(error);
        }
      });
    });
  } catch (error) {
    commonErrors['errorTitle'] = createConnector.name;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+params;
    warningMessage(commonErrors,error);
    console.log(JSON.stringify(commonErrors));
    console.log(error);
  }
}

const getBills = async (req,res)=>{
  let cookie = null
  let data = req.body;
   
  
  const pool = await connectPostgres;
  try {
    cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
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
      let bexioPool = await postgresBexio;
      let g2bPool = await postgresGate2b;
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
          
          const getRegisteredIdQry = `SELECT cid FROM 
          companyregistered WHERE rk_party = $1`
          const getRegisteredId = await bexioPool.query(getRegisteredIdQry,[data.partyId]);

          // const getBcQry = `SELECT array_agg(rk_businessconnection) AS businessconnection FROM documents_invoice_receive
          // WHERE fk_companyregistered = $1 
          //   AND rk_businessconnection IS NOT NULL`

          // const getBc = await bexioPool.query(getBcQry,[getRegisteredId.rows[0].cid]);
          
          const getSenderIdQry = `SELECT l.companyname,gc."netcomId",json_extract_path("ot_updator"::json,'in_custom_id') as sender_custom_id,* 
          FROM g2b_business_connections bc 
            INNER JOIN g2b_connections gc ON gc.id = bc."FK_g2b_connections_IN"
            INNER JOIN ediparty e ON gc."netcomId" = e.netcomid
            INNER JOIN legalParty l ON l.fk_ediparty = e.cid
          WHERE bc.id = $1`
          // const getSenderId = await g2bPool.query(getSenderIdQry);
          
          const inviteCompanyDelete = `SELECT  *  
          FROM(
            SELECT *,ROW_NUMBER() OVER(ORDER BY createddate desc) AS row_number 
            FROM documents_invoice_receive dir
          WHERE dir.fk_companyregistered = $1
          ` + (data.dateFrom ? `AND date(dir.createddate) >= '${data.dateFrom}'` : '') + `
          ` + (data.dateTo ? `AND date(dir.createddate) <= '${data.dateTo}'` : '') + `
          ` + (data.documentNo ? `AND LOWER(dir.documentnumber) LIKE LOWER('%${(data.documentNo)}%')` : '') + `
          ` + (data.billStatus == "Yes" ? ` AND rk_invoice IS NOT NULL` : '') +`
          ` + (data.billStatus == "No" ? ` AND rk_invoice IS NULL` : '') +`
            ) AS tmpQry
            WHERE row_number BETWEEN $2
            AND $3`
            console.log('inviteCompanyDelete',inviteCompanyDelete);
            
          const billsList = await bexioPool.query(inviteCompanyDelete,[getRegisteredId.rows[0].cid,showFrom,showTo]);



          // const inviteCompanyDelete = `
          //   SELECT *,ROW_NUMBER() OVER(ORDER BY rk_invoice desc) AS row_number 
          //   FROM documents_invoice_receive 
          // WHERE fk_companyregistered = $1
          //   `
          //   const billsList = await bexioPool.query(inviteCompanyDelete,[getRegisteredId.rows[0].cid]);
          const getBillsCount = `
            SELECT count(cid) AS total
            FROM documents_invoice_receive dir
          WHERE fk_companyregistered = $1
          ` + (data.dateFrom ? `AND date(dir.createddate) >= '${data.dateFrom}'` : '') + `
          ` + (data.dateTo ? `AND date(dir.createddate) <= '${data.dateTo}'` : '') + `
          ` + (data.documentNo ? `AND LOWER(dir.documentnumber) LIKE LOWER('%${(data.documentNo)}%')` : '') + `
          ` + (data.billStatus == "Yes" ? ` AND rk_invoice IS NOT NULL` : '') +`
          ` + (data.billStatus == "No" ? ` AND rk_invoice IS NULL` : '') +``
          
          const billsListCount = await bexioPool.query(getBillsCount,[getRegisteredId.rows[0].cid]);
          console.log(billsListCount.rows[0].total);

          for (let index = 0; index < billsList.rows.length; index++) {
            const element = billsList.rows[index];
            element['companyName'] = '';
            element['netcomId'] = '';
            const getBc = await g2bPool.query(getSenderIdQry,[element.rk_businessconnection]);
           
            if(getBc.rows.length != 0)
            {
              element['companyName'] = getBc.rows[0].companyname;
              element['netcomId'] = getBc.rows[0].netcomId;
              if(!element['rk_invoice'])
              {
                let temp = contacts.filter(e => e.id == getBc.rows[0].sender_custom_id);
                element['contactName'] = temp.length != 0 ? temp[0].name_1:'';
                element['contactId'] = temp.length != 0 ? getBc.rows[0].sender_custom_id:'';
                element['connectioStatus'] = 'active';
              }else{
                element['contactId'] = '';
                let temp = contacts.filter(e => e.id == getBc.rows[0].sender_custom_id);
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
            data:billsList.rows,
            totalCount:billsListCount.rows[0].total
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
 
    logs.action = 'GET_BILLS';
    logs.level = 'ERROR';
    logs.item = 'EDI';
    // //addlogs(logs,data.rolePartyId,data.roleAccId);
    console.log(error);
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+cookie;
    warningMessage(commonErrors,error);
    return res
    .status(200)
    .json({ status: 500, message: 'something_went_wrong' });
      
  }
}
const getInvoice = async (req,res)=>{
  let cookie = null
  let data = req.body
  let partyId = req.body.partyId;
 
  const pool = await connectPostgres;
  try {
    cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
    let accessToken = cookie.access_Token;
    let isBexioUser = cookie.isBexioUser;
    const bexioPool = await postgresBexio;
    let resultData = [],tempStatus = false;
    let totalCount;
    let sortColumn = 'updated_at';
    let sortType = 'asc';

    /* let totalCount = await invoiceListCount(accessToken);
    if(!totalCount){
      res.send({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
      });
      return;
    }
    console.log('totalCount',totalCount); */
    let showFrom = req.body.records_per_page * (req.body.page_number-1);
    let showTo = req.body.records_per_page;
    sortColumn = req.body?.sortColumn;
    sortType = req.body?.sort;

    const selectInvoiceStatus = `SELECT * FROM documents_invoice_send ds 
    INNER JOIN companyregistered c ON ds.fk_companyregistered = c.cid
    WHERE c.rk_party = $1 AND ds.invoicetype = 'EDI'`;
    const invoiceList = await bexioPool.query(selectInvoiceStatus, [partyId]);


    const getNetcomIdQry = `SELECT * FROM  companyregistered 
    WHERE rk_party = $1`;
    const getNetcomId = await bexioPool.query(getNetcomIdQry, [partyId]);
    console.log('partyId',partyId);

    console.log('getNetcomIdQry',getNetcomIdQry);
    console.log('getNetcomId',getNetcomId.rows[0].netcomid);

    // NEW

    const getInviteCompanyIdQry = `SELECT array_agg(pa.cid) AS cid FROM
    party_account pa
    WHERE pa.fk_party = $1`
    let getInviteCompanyId = await pool.query(getInviteCompanyIdQry,[partyId]);
  
  console.log('getInviteCompanyId.rows[0].cid',getInviteCompanyId.rows[0].cid);
  
    const getConnectionStatus = `SELECT  array_agg(rk_businessconnection) AS bcConnection FROM
      contact_bc cb
      WHERE cb.rk_party_account IN(${getInviteCompanyId.rows[0].cid})
      AND type = 'EDI'
      AND rk_businessconnection IS NOT NULL`
    let getConnectionStatusList = await bexioPool.query(getConnectionStatus);
    // console.log('getConnectionStatusList.rows[0].bcConnection',getConnectionStatusList.rows[0].bcconnection);
    // console.log('invoiceList.rows[0].netcomid',invoiceList.rows[0].netcomid);
    console.log('bcDetails12121222');
    let bcDetails;
    bcDetails = await getBcDetails(getConnectionStatusList.rows[0].bcconnection,getNetcomId.rows[0].netcomid);

    console.log('bcDetails12121222',bcDetails['data']);
    let tempBc = [];
    // tempBc.push([0]['bc_id']);

    // tempBc.push(bcDetails['data'].filter((e,idx) => (e['company_details']['doc_type']['data'] == 'Invoice')[idx]['bc_id']))

    // console.log('tempBc',tempBc);
    tempBc.push(0);
    if(bcDetails){
      for (let index = 0; index < bcDetails['data'].length; index++) {
        const element = bcDetails['data'][index];
        if(element['company_details']['doc_type']['data'] == 'Invoice'){
          tempBc.push(element['bc_id'])
        }
        
      }
    }
 
    console.log('tempBc',tempBc);
    
    const getConnectionBcQry = `SELECT  array_agg(rk_sendercontactid) FROM
      contact_bc cb
      WHERE cb.rk_party_account IN(${getInviteCompanyId.rows[0].cid})
      AND type = 'EDI'
      AND rk_businessconnection IN(${tempBc})
      AND rk_businessconnection IS NOT NULL`
    console.log('getConnectionBc',getConnectionBcQry);

    let getConnectionBc = await bexioPool.query(getConnectionBcQry);
    console.log('getConnectionBc',getConnectionBc.rows);
   
    let resultArray = getConnectionBc.rows[0].array_agg;
    if(isBexioUser)
    {
    
      let options;
 

      if(data['documentNo'] != '' || data['invoiceTitle'] != '' || data['dateFrom'] != '' || data['dateTo'] != '' || data['comapnyUser'] != '' || data['invoiceStatus'] == 'Yes' || data['invoiceStatus'] == 'No')
      {
        const getSendInvoiceQry = `SELECT array_agg(rk_invoice) AS invoiceId FROM documents_invoice_send ds
        INNER JOIN companyregistered c ON c.cid = ds.fk_companyregistered
        WHERE c.rk_party = ${partyId}
        AND ds.status = 2
        AND invoicetype = 'EDI'`
        let getSendInvoiceList = await bexioPool.query(getSendInvoiceQry);
        console.log("getSendInvoiceQry",getSendInvoiceList.rows[0].invoiceid);

        let searchJson = [];
         
        if(data['documentNo'] != '' && data['documentNo']){
          searchJson.push({
            "field":"document_nr",
            "value": data.documentNo,
            "criteria":"like"
          })
        }
        if(data['invoiceTitle'] != '' && data['invoiceTitle']){
          searchJson.push({
            "field":"title",
            "value":data.invoiceTitle,
            "criteria":"like"
          })
        }
       
        if( data['dateFrom'] != "" && data['dateFrom']){
          searchJson.push({
            "field":"is_valid_from",
            "value" :new Date(data.dateFrom),
            "criteria":">="
          })
        }
        if( data['dateTo'] != "" && data['dateTo']){
          searchJson.push({
            "field":"is_valid_from",
            "value":new Date(data.dateTo),
            "criteria":"<="
          })
        }
        if(data['comapnyUser'] != '' && data['comapnyUser']){


          searchJson.push({
            "field":"user_id",
            "value":data.comapnyUser,
            "criteria":"="
          })
        }
        if(data['invoiceStatus'] == 'Yes'){

          console.log('typeof',resultArray==null);
          
          searchJson.push({
            "field":"contact_id",
            "value":resultArray==null ? "" : resultArray,
            "criteria":"in"
          },
          {
            "field":"id",
            "value":getSendInvoiceList.rows[0].invoiceid ? getSendInvoiceList.rows[0].invoiceid : "",
            "criteria":"in"
          })
        }
        if(data['invoiceStatus'] == 'No'){
          
          searchJson.push({
            "field":"contact_id",
            "value":resultArray==null ? "" : resultArray,
            "criteria":"in"
          },
          {
            "field":"id",
            "value":getSendInvoiceList.rows[0].invoiceid ? getSendInvoiceList.rows[0].invoiceid : "",
            "criteria":"not_in"
          })
        }
        console.log('searchJsonsearchJson',searchJson.length);
        if(searchJson.length != 0)
        {
          totalCount = await invoiceCountSearch(accessToken,searchJson,0,2000)
          options = {
            'method': 'POST',
            'url': `${config.BEXIO_API}2.0/kb_invoice/search/?limit=${showTo}&offset=${showFrom}&order_by=${sortColumn}_${sortType}`,
           
            'headers': {
              'Accept': 'application/json',
              'Authorization': 'Bearer '+accessToken
            },
            body: JSON.stringify(searchJson)
          };
        }else{
          totalCount = await invoiceListCountSearch(accessToken,0,2000);
          options = {
            
            'method': 'GET',
            // 'url': `${config.BEXIO_API}2.0/kb_invoice`,
            'url': `${config.BEXIO_API}2.0/kb_invoice/?limit=${showTo}&offset=${showFrom}&order_by=${sortColumn}_${sortType}`,
            'headers': {
              'Accept': 'application/json',
              'Authorization': 'Bearer '+accessToken
            }
  
          }; 
        }
      
        console.log('totalCount',options);
        console.log('totalCount',totalCount);
      
        // totalCount = await  contactListCountSearch(accessToken,0,2000);

      }
      else{
        totalCount = await invoiceListCountSearch(accessToken,0,2000);
        options = {
          'method': 'GET',
          // 'url': `${config.BEXIO_API}2.0/kb_invoice`,
          'url': `${config.BEXIO_API}2.0/kb_invoice/?limit=${showTo}&offset=${showFrom}&order_by=${sortColumn}_${sortType}`,
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
          return res.status(200).json({
            status: false,
            message: 'something_went_wrong',
            error: JSON.stringify(error)
        });
        }
        let resData = JSON.parse(response.body);
        if(response.statusCode != 200)
        return res.status(200).json({
          status: true,
          status_code : response.statusCode,
          data: [],
          message: 'unauthorized',
        });
        //'url': `${config.BEXIO_API}2.0/kb_invoice?order_by=updated_at_desc`,
        let status = JSON.parse(config.BEXIO_INVOICE_STATUS);
        let contact_idList = [];
        for (let invoice in resData) {
          tempStatus = false;
          resultArray?resData[invoice]['allowSend'] = resultArray.includes((resData[invoice].contact_id).toString()) ? true:false:false;
          contact_idList.push((resData[invoice].contact_id));
          resData[invoice]['statusLabel'] = status[resData[invoice].kb_item_status_id];
          resData[invoice]['timestamp'] = '';
          //resData[invoice]['companyName'] = resData[invoice]['contact_address'].split("\n")[0];
          resData[invoice]['rk_globaltransaction'] = '';
          resData[invoice]['status'] = '';
          resData[invoice]['statusLabelInvoice'] = '';        
          for(let qryInvoice in invoiceList.rows ){
              if(invoiceList.rows[qryInvoice]['rk_invoice'] == resData[invoice]['id']){
                resData[invoice]['rk_globaltransaction'] = invoiceList.rows[qryInvoice]['rk_globaltransaction'];
                resData[invoice]['status'] = invoiceList.rows[qryInvoice]['status'];
                resData[invoice]['statusLabelInvoice'] = JSON.parse(config.INVOICE_STATUS)[invoiceList.rows[qryInvoice]['status']];
                resData[invoice]['timestamp'] = invoiceList.rows[qryInvoice]['timestamp'];
                resData[invoice]['type'] = invoiceList.rows[qryInvoice]['type'];
                resData[invoice]['response'] = invoiceList.rows[qryInvoice]['response']; // Added response from documents_invoice_send to show the error message in the front end.

                if(invoiceList.rows[qryInvoice]['status'] == 2)
                {
                  resData[invoice]['allowSend'] = false;
                }
                if(!tempStatus && invoiceList.rows[qryInvoice]['type'] == 'EBILL'){
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
        console.log('redisKey',redisKey);
        keys.forEach(element => {
            redisKey = req.body[element]? redisKey +element+':'+ req.body[element] + '_' : redisKey
        });
        await redisClient.setex(redisKey,24*60*60*2,JSON.stringify({
          status: 200,
          data:resData,
          totalCount:totalCount
        } ));
        
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
  
    logs.action = 'GET_INVOICE';
    logs.level = 'ERROR';
    logs.item = 'EBILL';
    // //addlogs(logs,data.rolePartyId,data.roleAccId);
    console.log(error);
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+cookie;
    warningMessage(commonErrors,error);
    return res
    .status(200)
    .json({ status: 500, message: 'something_went_wrong' });
      
  }
}

const getCountryLists = async (access_token)=>{
  //  let access_token = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_NAME]))).access_token;
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
          // res.send(response.body)
          //console.log(response.body);
          // console.log('response.body',response.body);
          
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
        // res.send();
        resolve('');
      });
    }
}
const bexioLogout_ = async (req,res)=>{
  let cookie = null;
  const pool = await connectPostgres;
  let data = req.body
  try {
    cookie = JSON.parse(encryptionControl.decryptCookie(req.signedCookies[config.TOKEN_COOKIE_NAME]));
    const options = {
      domain: config.SESSION_DOMAIN,
    };
    let sessionId = req.signedCookies[config.SESSION_COOKIE_NAME];
    res.clearCookie(config.SESSION_COOKIE_NAME, options);
    res.clearCookie(config.TOKEN_COOKIE_NAME, options);
    res.clearCookie(config.EXPIRE_EXPIRES_COOKIE_NAME, options);
    res.clearCookie(config.TOKEN_COOKIE_BEXIO_NAME, options);

    req.session.destroy();
  
    const deleteQry = `DELETE FROM authTable 
    WHERE  mail= $1 AND sessionId = $2`;

  // if (sessionId && req.sessionID && sessionId === req.sessionID) {
      await pool.query(deleteQry, [cookie.userMail, sessionId]);
      return res.send({ status: true });
  } catch (error) {
   
        logs.action = 'BEXIO_LOG_OUT';
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        // //addlogs(logs,data.rolePartyId,data.roleAccId);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+cookie;
        warningMessage(commonErrors,error);
      return res.send({ status: true });
    
  }
  

  // } else {
  //     res.end();
  // }
  
}
const bexioLogout = async (req, res) => {
  const pool = await connectPostgres;
  let sessionId = req.signedCookies[config.SESSION_COOKIE_NAME];
  // let cookie = req.signedCookies[config.TOKEN_COOKIE_NAME];
  const redis_client = await redisClient;
  let redisKey = req.body.partyId+"_";
  redis_client.KEYS(redisKey+ "*", (err, data) => {
      data.forEach(apis => {
      redis_client.del(apis)
      });
      console.log('inside');
  })
  if(!req.signedCookies[config.TOKEN_COOKIE_NAME]){
      return res.send({ status: true });
  }
  const cookie = JSON.parse(encryptionControl.decryptCookie(req.signedCookies[config.TOKEN_COOKIE_NAME]));
  let mtcCookie = req.cookies[config.EXPIRE_MTC_COOKIE_NAME] ? encryptionControl.decryptCookie(req.cookies[config.EXPIRE_MTC_COOKIE_NAME]) : '';
  console.log('mtcCookie',mtcCookie);
  const options = {
      domain: config.SESSION_DOMAIN,
  };
  res.clearCookie(config.EXPIRE_EXPIRES_COOKIE_NAME, options);

  if(mtcCookie == '')
  {
      console.log('if');
      
      const deleteQry = `DELETE FROM authTable 
      WHERE  mail= $1 AND sessionId = $2`;
      if (sessionId && req.sessionID && sessionId === req.sessionID) {
          await pool.query(deleteQry, [cookie.userMail, sessionId]);
          sessionId = 'sess:' + sessionId;
      
          res.clearCookie(config.SESSION_COOKIE_NAME, options);
          res.clearCookie(config.TOKEN_COOKIE_NAME, options);
          req.session.destroy();
          return res.send({ status: true });
      } else {
      console.log('else');
      return res.send({ status: true });
          // res.end();
      }
  }else{
      console.log('else2');
      return res.send({ status: true });
      // res.end(); 
  }
 
  // res.end();

};
const createAccessToken = async (req, res) => {
  let cookie = null;
  const pool = await connectPostgres;
  try {
      // fs.appendFile('./assets/log.txt', '\r\n'+'In accessToken'+JSON.stringify(req.signedCookies), err => {
      //     if (err) {
      //       console.error(err)
      //       return
      //     }
      //     return true
      //     //file written successfully
      //   })
      cookie = JSON.parse(encryptionControl.decryptCookie(req.signedCookies[config.TOKEN_COOKIE_NAME]));
      console.log('123');
      console.log('cookiecookie',cookie);

      jwt.verify(cookie['accessToken'], config.SECRET_JWT, res, async (err, decode) => {
          if (err) {
              const sessionId = req.signedCookies[config.SESSION_COOKIE_NAME];
              const pool = await connectPostgres;
              const searchQry = `SELECT * FROM authTable 
                               WHERE  mail= $1 AND sessionId = $2`;
              const selectResult = await pool.query(searchQry, [cookie.userMail, sessionId]);
              if (selectResult.rows[0].refreshtoken === cookie['refreshToken']) {
                  jwt.verify(
                      selectResult.rows[0].refreshtoken,
                      config.SECRET_REFRESH_JWT,
                      res,
                      async (err, decode) => {
                          if (err) {
                              return res.status(401).json({
                                  status: 'fail',
                                  message: 'unauthorized',
                                  error: err,
                              });
                          }

                          const data = {
                              email: cookie.userMail,
                          };
                          const accessToken = jwt.sign(data, config.SECRET_JWT, {
                              expiresIn: config.JWTExpiration,
                          });
                          const token = cookie;
                          token['accessToken'] = accessToken;
                          res.cookie(config.TOKEN_COOKIE_NAME, encryptionControl.encrypt(JSON.stringify(token)), {
                              domain: config.SESSION_DOMAIN,
                              maxAge: config.SESSION_EXPIRY,
                              secure: true,
                              httpOnly: true,
                              signed: true,
                          });
                          const dateTimeCookie = JSON.parse(
                              encryptionControl.decryptCookie(req.cookies[config.EXPIRE_EXPIRES_COOKIE_NAME]),
                          );
                          const datetimeToken = {
                              cookieCreatedTime: new Date(new Date(new Date().getTime() + 15 * 60000).toUTCString()),
                              userMail: dateTimeCookie['userMail'],
                              partyID: dateTimeCookie['partyID'],
                              userID: dateTimeCookie['userID'],
                              accId: dateTimeCookie['accId'],
                              netcomId: dateTimeCookie['netcomId']
                          };

                          res.cookie(
                              config.EXPIRE_EXPIRES_COOKIE_NAME,
                              encryptionControl.encrypt(JSON.stringify(datetimeToken)),
                              {
                                  domain: config.SESSION_DOMAIN,
                                  maxAge: config.SESSION_EXPIRY,
                                  secure: false,
                                  httpOnly: false,
                                  signed: false,
                              },
                          );
                          const postgresPool = await connectPostgres;
                          const updateQry = `UPDATE  authTable 
                                          SET accessToken = $1
                                          WHERE mail= $2 AND sessionId = $3`;
                          await postgresPool.query(updateQry, [accessToken, cookie.userMail, sessionId]);
                          res.send({
                              status: 'true',
                              message: 'success',
                              // data:encryptionControl.encrypt(cookie['partyID'])
                              data:'partyID' in cookie ?  encryptionControl.encrypt(cookie['partyID']) : ''
                          });
                      },
                  );
              } else {
                  return res.status(401).json({
                      status: 'fail',
                      message: 'unauthorized',
                      error: 'Token mismatch',
                  });
              }
          } else {
            console.log('123');
            res.send({
              status: 'true',
              message: 'success',
              data:'partyID' in cookie ?  encryptionControl.encrypt(cookie['partyID']) : ''
          });
          }
      });
  } catch (error) {
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+cookie;
        warningMessage(commonErrors,error);
      return res.status(401).json({
          status: 'fail',
          message: 'unauthorized',
          error: error,
      });
  }
};
// const invoiceToOt = async (req,res)=>{
//   let obj =  {
//     "OPENTRANS": {
//         "$": {
//             "xmlns:iomarket": "http://tempuri.org/io-market/openTRANS_UDX",
//             "xmlns:bmecat": "http://www.bmecat.org/bmecat/2005",
//             "xmlns": "http://www.opentrans.org/XMLSchema/2.1"
//         },
//         "INVOICE": [{
//             "$": {
//                 "version": "2.1"
//             },
//             "INVOICE_HEADER": [{
//                 "INVOICE_INFO": []
//             }],
//             "INVOICE_ITEM_LIST": [{
//                 "INVOICE_ITEM": []
//             }],
//             "INVOICE_SUMMARY": []
//         }]
//     }
// }

//   console.log('123');
//   let accessToken = 'eyJraWQiOiI2ZGM2YmJlOC1iMjZjLTExZTgtOGUwZC0wMjQyYWMxMTAwMDIiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJwaXRheG9rNTM2QHNvbmdzaWduLmNvbSIsImxvZ2luX2lkIjoiZDNmMTZjNDQtZTVlZi00OGYwLWExN2EtZGRjMGU3ZGE5ZWJhIiwiY29tcGFueV9pZCI6IjlpazIzYXNubGV2aiIsInVzZXJfaWQiOjMxNjU5MSwiYXpwIjoiY2Y5OTlkYWUtNWUxZC00ZjAxLWExMDEtY2VhNTE0MWVhY2QzIiwic2NvcGUiOiJrYl9vcmRlcl9lZGl0IGtiX2ludm9pY2Vfc2hvdyBvcGVuaWQgcHJvZmlsZSBvZmZsaW5lX2FjY2VzcyBjb250YWN0X3Nob3cgYXJ0aWNsZV9zaG93IGtiX2FydGljbGVfb3JkZXJfc2hvdyBrYl9vZmZlcl9zaG93IGVtYWlsIGtiX29yZGVyX3Nob3ciLCJpc3MiOiJodHRwczpcL1wvaWRwLmJleGlvLmNvbSIsImV4cCI6MTY0ODExOTk0MiwiaWF0IjoxNjQ4MTE2MzQyLCJjb21wYW55X3VzZXJfaWQiOjEsImp0aSI6ImUyYzEwY2MxLWYxMmEtNGEzNi04ZDlkLTY1YTRkOGZlNmYyYyJ9.Ri5yC0k4dyGtfF149-LuSJGkqosZ_tgUpTk-uBBpcgR7WQEx030sc-CTOC7j_gvlkjt1TmzBZ9KKj_22wtyAih4QW9lJ6gpx1-DpYjHPqwJQCeqLRk-mvwl3k5tWc-sem_fAct7yjXL0uV4vX_AZhQpuDsKCdqJwR-jCLJ_o3QO2pq3MOB3VS_pfqy9YlFMubqcaKy_mcxnKgmCWKGCYeaYlNwA4z7cTa21cYAb4iJTuTJ3HFdJ4BBM-_KtOrBaQiYAu3-o9_uXzdFO8pL9mhkwjMlDDQH6ff3WOUcpkUGz4TvmZXBqHRfx0Nasfmn1HKpPgmRGPUQ5pvbwa8pjnrxryD-g79ZVee8sL_d5_CE86rAWTDZmH3GlrZcd55uUeTPvkgcS-kx-wPOocJ0VAhmohusaAe5TBmtXe52n3Fz8G4uh195pj4kbOEu4bfKqQ1HLemuBwLbyL8RGLRtoybZRelYJlHLiw55n-qeiwChLE2XAptdG25zMADLiuRHxKPV6EypHyKsV6Usg96O3vJc2xmakSDmW2AL4A0lxAz9OwEiR4EG2WyNIWPw50ZVzlqR1lGjqEk-6iCDwZGI-oFVMgzhXonFGjsocoOKtyYzJQ7dzgqPx6LU7nvnYWCh1-QlkhQv6UmRD6hOE0LR_X6sI85GTzi7DvbURm6U0FcWI'
//   // let accessToken = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME]))).access_Token;
//   let  invoice,bank,currency,paymentType,contact,user;
//    invoice = await getInvoiceOT(accessToken,'');
//   console.log(invoice);
  
//   // console.log(invoice);
   
//   let inv =JSON.parse(invoice);
//   let invoiceOt = inv;
//   // console.log('invoiceOtinvoiceOt',invoiceOt);
//   bank = await getBank(accessToken,inv.bank_account_id)
//   if(!bank)
//   {
//     res.send({
//       status_code: 500,
//       message: 'something_went_wrong',
//       status: false,
  
//     });
//     return
//   }
//   console.log('bank',bank);
//   // invoiceOt['bank'] = bank;
//    invoiceOt['bank'] = bank;

//   currency = await getCurrency(accessToken,inv.currency_id)
//   if(!currency)
//   {
//     res.send({
//       status_code: 500,
//       message: 'something_went_wrong',
//       status: false,
  
//     });
//     return
//   }
//   invoiceOt['currency'] = currency;
//   let temp = await getloginUserCompanyDetails(accessToken);
//   if(!temp)
//   {
//     res.send({
//       status_code: 500,
//       message: 'something_went_wrong',
//       status: false,
//     });
//     return;
//   }
//   invoiceOt['companyProfile'] = temp;
//   invoiceOt['companyProfile'] = JSON.parse(invoiceOt['companyProfile'])
//   // Loop 
//   paymentType = await getPaymentType(accessToken,inv.payment_type_id);
//   if(!paymentType)
//   {
//     res.send({
//       status_code: 500,
//       message: 'something_went_wrong',
//       status: false,
  
//   });
//   return
  
//   }
//   console.log(paymentType);
  
//   invoiceOt['paymentType'] = paymentType.filter(e => e.id.includes(inv.payment_type_id));
//   console.log(invoiceOt['paymentType']);
  
//   console.log('paymentType',paymentType);
//   console.log('payment_type_id',inv.payment_type_id);
  

//   // console.log(paymentType);
//   contact = await getContact(accessToken,inv.contact_id);
//   if(!contact)
//   {
//     res.send({
//       status_code: 500,
//       message: 'something_went_wrong',
//       status: false,
  
//   });
//   return
  
//   }
//   // console.log('contact',contact);
//   invoiceOt['contact'] = contact;

//   user = await getUser(accessToken,inv.user_id);
//   if(!user)
//   {
//     res.send({
//       status_code: 500,
//       message: 'something_went_wrong',
//       status: false,
  
//   });
//   return
  
//   }
//   // console.log('user',user);
//   invoiceOt['user'] = user;
// //  await getProducts(accessToken,)
// //  await getTaxs(accessToken,inv.)

//   for (const items of invoiceOt.positions) {
//     let tempTax =  await getTaxs(accessToken,items.tax_id);
//     if(!tempTax)
//     {
//       res.send({
//         status_code: 500,
//         message: 'something_went_wrong',
//         status: false,
//       });
//       return
//     }
//     items['tax'] = tempTax;
//     let tempItem = await getProducts(accessToken,items.article_id);
//     if(!tempItem)
//     {
//       res.send({
//         status_code: 500,
//         message: 'something_went_wrong',
//         status: false,
    
//     });
//     return
//     }
//     items['article'] = tempItem;
//   }

//   logs.action = 'INVOICE_TOOt';
//   logs.level = 'NOTIFICATION';
//   logs.item = 'EBILL';
//   // //addlogs(logs,data.rolePartyId,data.roleAccId);
//   }
//   catch(error){

//     logs.action = 'INVOICE_TOOt';
//     logs.level = 'ERROR';
//     logs.item = 'EBILL';
//     // //addlogs(logs,data.rolePartyId,data.roleAccId);
//   }


  
// // console.log('positions123',invoiceOt);
//   // setInvoiceToOt(){
//     // await setInvoiceToOt(invoiceOt)
//   // }
// }
// const setInvoiceToOt = async (invoice)=>{
//   // let 

//   let obj =  {
//     "OPENTRANS": {
//         "$": {
//             "xmlns:iomarket": "http://tempuri.org/io-market/openTRANS_UDX",
//             "xmlns:bmecat": "http://www.bmecat.org/bmecat/2005",
//             "xmlns": "http://www.opentrans.org/XMLSchema/2.1"
//         },
//         "INVOICE": [{
//             "$": {
//                 "version": "2.1"
//             },
//             "INVOICE_HEADER": [{
//                 "INVOICE_INFO": []
//             }],
//             "INVOICE_ITEM_LIST": [{
//                 "INVOICE_ITEM": []
//             }],
//             "INVOICE_SUMMARY": []
//         }]
//     }
// }

// console.log('invoice',invoice.document_nr);

// obj.OPENTRANS.INVOICE[0]['INVOICE_HEADER'][0]['INVOICE_INFO'].push({ 
//   "INVOICE_ID": invoice.document_nr,
//   "INVOICE_DATE": invoice.updated_at,
//   "PARTIES": [{
//       "PARTY": [{
//           "bmecat:PARTY_ID": [{
//               "_": 'NET_COM_ID_TBA',
//               "$": {
//                   "type": "netcomid"
//               }
//           }],
//           "ADDRESS": [{
//               "bmecat:NAME": invoice.companyProfile.name_1,
//               "bmecat:STREET": invoice.companyProfile.address_nr,
//               "bmecat:ZIP": invoice.companyProfile.postcode,
//               "bmecat:CITY": invoice.companyProfile.city,
//               "bmecat:COUNTRY": invoice.companyProfile.country_name,
//               "bmecat:COUNTRY_CODED":invoice.companyProfile.country_id,
//               "bmecat:VAT_ID": invoice.contact.ust_id_nr
//           }]
//       }, {
//           "bmecat:PARTY_ID": [{
//               "_": 'RECIPIENT_ID_TBA',
//               "$": {
//                   "type": "supplier_specific"
//               }
//           }],
//           "PARTY_ROLE": ["invoice_recipient"],
//           "ADDRESS": [{
//               "bmecat:NAME": invoice.contact.name_1,
//               "CONTACT_DETAILS": [{
//                   "bmecat:CONTACT_NAME": invoice.contact.name_1,
//                   "bmecat:FIRST_NAME": invoice.contact.name_2,
//                   "bmecat:EMAILS": [{
//                       "bmecat:EMAIL": invoice.contact.mail
//                   }]
//               }],
//               "bmecat:STREET": invoice.contact.address,
//               "bmecat:ZIP": invoice.contact.postcode,
//               "bmecat:CITY": invoice.contact.city,
//               "bmecat:COUNTRY": invoice.contact.country_id,
//               "bmecat:COUNTRY_CODED": invoice.contact.country_id
//           }]
//       }]
//   }],
//   "INVOICE_ISSUER_IDREF": [{
//       "_": 'NET_COM_ID_TBA',
//       "$": {
//           "type": "netcomid"
//       }
//   }],
//   "INVOICE_RECIPIENT_IDREF": [{
//       "_": 'PARTY_ID_TBA',
//       "$": {
//           "type": "supplier_specific"
//       }
//   }],
//   "bmecat:CURRENCY": invoice.currency['name'],
//   "PAYMENT": [{
//       "ACCOUNT": [{
//           "HOLDER": invoice.bank.owner,
//           "BANK_ACCOUNT": [{
//               "_": invoice.bank.bank_account_nr,
//               "$": {
//                   "type": "iban"
//               }
//           }],
//           "BANK_CODE": [{
//               "_": invoice.bank.bank_nr,
//               "$": {
//                   "type": "bic"
//               }
//           }],
//           "BANK_NAME": invoice.bank.name,
//           "BANK_COUNTRY":invoice.bank.currency_id
//       }],
//       "PAYMENT_TERMS": [{
//           "TIME_FOR_PAYMENT": [{
//               "DAYS": ["30"]
//           }],
//           "VALUE_DATE": invoice.is_valid_to
//       }]
//   }],
//   "HEADER_UDX": [{
//       "IOM.SYS": [{
//           "PAYED": [{
//               "$": {
//                   "status": invoice?.payedStatus
//               },
//               "CARD": [{
//                   "$": {
//                       "type": invoice?.cardType
//                   },
//                   "CARD_NUM": invoice?.cardNumber,
//                   "CARD_HOLDER_NAME": invoice?.cardHolderName,
//                   "TRANSACTION_NUM": invoice?.transactionNumber
//               }],
//               "PAYPAL": [""],
//               "CRYPTO": [""]
//           }]
//       }]
//   }]
// })
// console.log('invoiceEnd',typeof(invoice));

//   // invoice.forEach(element => {
//   //     obj.OPENTRANS.INVOICE[0]['INVOICE_HEADER'][0]['INVOICE_INFO'].push({ 
//   //             "INVOICE_ID": element.document_nr,
//   //             "INVOICE_DATE": element.updated_at,
//   //             "PARTIES": [{
//   //                 "PARTY": [{
//   //                     "bmecat:PARTY_ID": [{
//   //                         "_": 'NET_COM_ID_TBA',
//   //                         "$": {
//   //                             "type": "netcomid"
//   //                         }
//   //                     }],
//   //                     "ADDRESS": [{
//   //                         "bmecat:NAME": element.companyProfile.name_1,
//   //                         "bmecat:STREET": element.companyProfile.address_nr,
//   //                         "bmecat:ZIP": element.companyProfile.postcode,
//   //                         "bmecat:CITY": element.companyProfile.city,
//   //                         "bmecat:COUNTRY": element.companyProfile.country_name,
//   //                         "bmecat:COUNTRY_CODED":element.companyProfile.country_id,
//   //                         "bmecat:VAT_ID": element.contact.ust_id_nr
//   //                     }]
//   //                 }, {
//   //                     "bmecat:PARTY_ID": [{
//   //                         "_": 'RECIPIENT_ID_TBA',
//   //                         "$": {
//   //                             "type": "supplier_specific"
//   //                         }
//   //                     }],
//   //                     "PARTY_ROLE": ["invoice_recipient"],
//   //                     "ADDRESS": [{
//   //                         "bmecat:NAME": element.contact.name_1,
//   //                         "CONTACT_DETAILS": [{
//   //                             "bmecat:CONTACT_NAME": element.contact.name_1,
//   //                             "bmecat:FIRST_NAME": element.contact.name_2,
//   //                             "bmecat:EMAILS": [{
//   //                                 "bmecat:EMAIL": element.contact.mail
//   //                             }]
//   //                         }],
//   //                         "bmecat:STREET": element.contact.address,
//   //                         "bmecat:ZIP": element.contact.postcode,
//   //                         "bmecat:CITY": element.contact.city,
//   //                         "bmecat:COUNTRY": element.contact.country_id,
//   //                         "bmecat:COUNTRY_CODED": element.contact.country_id
//   //                     }]
//   //                 }]
//   //             }],
//   //             "INVOICE_ISSUER_IDREF": [{
//   //                 "_": 'NET_COM_ID_TBA',
//   //                 "$": {
//   //                     "type": "netcomid"
//   //                 }
//   //             }],
//   //             "INVOICE_RECIPIENT_IDREF": [{
//   //                 "_": 'PARTY_ID_TBA',
//   //                 "$": {
//   //                     "type": "supplier_specific"
//   //                 }
//   //             }],
//   //             "bmecat:CURRENCY": JSON.parse(element.currency).name,
//   //             "PAYMENT": [{
//   //                 "ACCOUNT": [{
//   //                     "HOLDER": element.bank.owner,
//   //                     "BANK_ACCOUNT": [{
//   //                         "_": element.bank.bank_account_nr,
//   //                         "$": {
//   //                             "type": "iban"
//   //                         }
//   //                     }],
//   //                     "BANK_CODE": [{
//   //                         "_": element.bank.bank_nr,
//   //                         "$": {
//   //                             "type": "bic"
//   //                         }
//   //                     }],
//   //                     "BANK_NAME": element.bank.name,
//   //                     "BANK_COUNTRY":element.bank.currency_id
//   //                 }],
//   //                 "PAYMENT_TERMS": [{
//   //                     "TIME_FOR_PAYMENT": [{
//   //                         "DAYS": ["30"]
//   //                     }],
//   //                     "VALUE_DATE": element.is_valid_to
//   //                 }]
//   //             }],
//   //             "HEADER_UDX": [{
//   //                 "IOM.SYS": [{
//   //                     "PAYED": [{
//   //                         "$": {
//   //                             "status": element?.payedStatus
//   //                         },
//   //                         "CARD": [{
//   //                             "$": {
//   //                                 "type": element?.cardType
//   //                             },
//   //                             "CARD_NUM": element?.cardNumber,
//   //                             "CARD_HOLDER_NAME": element?.cardHolderName,
//   //                             "TRANSACTION_NUM": element?.transactionNumber
//   //                         }],
//   //                         "PAYPAL": [""],
//   //                         "CRYPTO": [""]
//   //                     }]
//   //                 }]
//   //             }]
//   //     })
//   //     })
//   let builder = new xml2js.Builder();
//   var xml = builder.buildObject(obj);
//   console.log(xml)
//       console.log('OT',JSON.stringify(obj));
      
// }
const getInvoiceOT = async (access_token,invoiceId)=>{

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
          if (error) {  
            console.log('errorerrorerror',error);
            
            commonErrors['errorTitle'] = 'getInvoiceOT';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+invoiceId;
            warningMessage(commonErrors,error);
            resolve(false)
          }
          // res.send(response.body)
          if(response.statusCode==200)
          {
            console.log('JSON.parse(response.body)',JSON.parse(response.body));
            resolve(JSON.parse(response.body));
            
          }
          else {
            // console.log('response.body1111111111111',response.body);
            resolve(false)

            }
        });
      });
}

const getBank = async (access_token,id)=>{
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
          if (error) {  
            commonErrors['errorTitle'] = 'getBank';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+id;
            warningMessage(commonErrors,error);
            resolve(false)
          }
          // res.send(response.body)
          //console.log(response.body);
          if(response.statusCode==200)
          resolve(JSON.parse(response.body));
          else
          resolve(false);
        });
      });
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
          // res.send(response.body)
          //console.log(response.body);
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
          // res.send(response.body)
          //console.log(response.body);
          if(response.statusCode==200)
          resolve(JSON.parse(response.body));
          else
          resolve(false)
        });
      });
}

const getUser = async (access_token,id)=>{

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
          // res.send(response.body)
          //console.log(response.body);
          if(response.statusCode==200)
          resolve(JSON.parse(response.body));
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
          // 'url':`https://api.bexio.com/2.0/kb_invoice/42/${id}`,
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
          // res.send(response.body)
          //console.log(response.body);
          // console.log('response',response);
          
          if(response.statusCode==200)
          resolve(JSON.parse(response.body));
          else
          resolve(false);


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
          // res.send(response.body)
          //console.log(response.body);
          console.log(response?.body);
          
          if(response?.statusCode==200)
          resolve(JSON.parse(response?.body));
          else
          resolve(false)

        });
      });
}
const getInvoiceForOpenTrans = async (req,res)=>{
  let cookie = null 
  let decryptData = null
  let invoiceCid 
  decryptData = req.body;
  const pool = await connectPostgres;
  const data = req.body;
  try {
      let status,errorMsg;
      let invoice,paymentType,companyDetails;
      cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
      // const decryptData = encryptionControl.decrypt(req.body.encrToken);
    
      let accessToken = cookie.access_Token;
      const partyId = decryptData.partyId;
      const accountId = decryptData.accountId;
      // const invoiceId = decryptData.invoiceId;
      const invoiceId = decryptData.invoiceId;
      invoice = await getInvoiceOT(accessToken,invoiceId);
       
      if(!invoice)
      {
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'error_getInvoiceOT -req param,',JSON.stringify(decryptData);
        warningMessage(commonErrors,'error_getInvoiceOT');
        res.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
       });
      return
      }
       
      // console.log('invoice',invoice);
      console.log('partyId',partyId);
      console.log('accountId',accountId);
      console.log('contact_id',invoice.contact_id);

      let invitionData = await getConnectionDetails(partyId,accountId,invoice.contact_id,req);
      console.log(invitionData);
      let customerIds = await constGetContactId(invitionData[0].rk_businessconnection);
      console.log(customerIds);
      console.log('invitionData',invitionData);
      
      if(invitionData != undefined)
      {
        
        let pdf,fileName,pdfContent;
        pdf = await getInvoicePdf(accessToken,invoiceId);
        if(!pdf)
        {
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'error_getInvoicePdf -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'error_getInvoicePdf ');
          console.log('pdf');
          res.send({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
        
          });
          return
        
        }
        pdfContent = JSON.parse(pdf).content;
        fileName = JSON.parse(pdf).name;
        // let pdf ='dasd'
        // console.log(invitionData[0]);
        let coutryList;
        coutryList = await getCountryLists(accessToken);
        if(!coutryList)
        {
          console.log('coutryList');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'countryList_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'countryList_not_found');
          res.send({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
        
        });
        return
        }
        coutryList = JSON.parse(coutryList);
        let bank
        bank = await getBank(accessToken,invoice.bank_account_id);
        if(!bank)
        {
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'bank_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'bank_not_found');
          res.send({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
        
        });
        return
        }
        // invoice['bank'] = 'iban_nr' in bank ? bank : '';
        if('iban_nr' in bank)
        {
          invoice['bank'] = bank;
        }else{
          res.send({
            status_code: 500,
            message: 'bexio_bank_error',
            status: false,
          });
          return
        }
        console.log('123');
        console.log('invoice.currency_id',invoice.currency_id);
        
        let currency = await getCurrency(accessToken,invoice.currency_id);
        if(!currency)
        {
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'currency_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'currency_not_found');
          res.send({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
        
          });
          return
        }
        invoice['currency'] = currency;
        let temp = await getloginUserCompanyDetails(accessToken);
        console.log(temp);
        

        if(!temp)
        {
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'getloginUserCompanyDetails_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'getloginUserCompanyDetails_not_found');
          res.send({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
          });
          return;
        }
        invoice['companyProfile'] = temp;
        invoice['companyProfile'] = JSON.parse(invoice['companyProfile']);
        paymentType = await getPaymentType(accessToken,invoice.payment_type_id);
        if(!paymentType)
        {
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'getPaymentType_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'getPaymentType_not_found');
          res.send({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
        
        });
        return
        
        }
        let tempPaymentType = paymentType.filter(e => e.id == invoice.payment_type_id);
        invoice['paymentType'] = tempPaymentType;
        let contact = await getContact(accessToken,invoice.contact_id);
        if(!contact)
        {
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'contact_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'contact_not_found');
          res.send({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
        
        });
        return
        
        }
        invoice['contact'] = contact;
        // let user = await getUser(accessToken,invoice.user_id);
        let user = true;
        if(!user)
        {
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'user_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'user_not_found');
          res.send({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
        
        });
        return
        
        }
        invoice['user'] = user;
        // companyDetails = await getloginUserCompanyDetails(accessToken)
    
        for (const items of invoice.positions) {
          console.log('items.tax_id',items.tax_id);
          if(items.tax_id){
            let tempTax = await getTaxs(accessToken,items.tax_id);
            if(!tempTax)
            {
              commonErrors['errorTitle'] = req.originalUrl;
              commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'tax_not_Found -req param,',JSON.stringify(req.body);
              warningMessage(commonErrors,'tax_not_Found');
              res.send({
                status_code: 500,
                message: 'something_went_wrong',
                status: false,
              });
              return
            }
            items['tax'] = tempTax;
          }
          
          
           let tempItem;
          console.log('tempItem',tempItem);
          if('article_id' in items)
          {
            tempItem = await getProducts(accessToken,items.article_id);
            items['article'] = tempItem;
            // console.log('articleas',items['article']);
            
          }else{
            console.log('items',items);
            
            items['article'] = {}
            items['article']['intern_name'] = items.text;
            items['article']['intern_description'] = items.text;

          }
          // return
          // if(!tempItem)
          // {
          //   res.send({
          //     status_code: 500,
          //     message: '',
          //     status: false,
          
          // });
          // return
          // }
         
        }
        // console.log('pdfpdf',pdf);
        // console.log('final',JSON.stringify(invoice));
        
        
        //  console.log('invoice',JSON.stringify(invoice));
        // console.log('invoiceinvoice',invoice);
        invoiceCid = await setInvoiceSendStatus(partyId,invoiceId,invoice['document_nr'],'1');
        let xml;

        xml = await setInvoiceToOt(invoice,coutryList,invitionData[0],pdfContent,fileName,customerIds,invoiceCid);
        //  console.log('xml',xml);
        if(xml == false){
          res.send({
            status_code: 500,
            message: 'bexio_item_error',
            status: false,
          });
          return
        }
   
        
        await invoiceFilePush(invitionData[0].rk_netcomidsender,'WS',xml,invoice['document_nr'],'EDI');
        // const pool = await connectPostgres;

        // const insertQry =`INSERT INTO 
        //   party_invoicesend
        //     (fk_party,invoiceId)
        //   VALUES
        //     ($1,$2)`
        // await pool.query(insertQry,[partyId,invoiceId]);
        // console.log();

        // res.send(xml)
        // let temp = req.url.substr(1,req.url.length);
        // console.log('temp',temp);
        let redisKey = req.body.partyId+"_/";
        await deleteRedis(req.url.substr(1,req.url.length),redisKey);
        
            res.send({
              status_code: 200,
              message: '',
              status: true,
          });
        
        }else{
          res.send({
            status_code: 500,
            message: 'invoice_push_error',
            status: false,
        });
      }
      /*********************************push */
    
        logs.action = 'bexio.invoice.send';
        logs.level = 'NOTIFICATION';
        logs.item = 'EDI';
        addlogs(logs,partyId,accountId);
  } catch (error) {
      logs.action = 'bexio.invoice.send';
      logs.level = 'ERROR';
      logs.item = 'EDI';
      addlogs(logs,decryptData.partyId,decryptData.accountId);
        console.log('error',error);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+decryptData;
      warningMessage(commonErrors,error);
      res.send({
        status_code: 500,
        message: '',
        status: false,
      });
  }

}

const setInvoiceSendStatus = async (partyId,invoiceId,invoicenumber,status,error?) => {
  let sendInvoiceId = '';

    return new Promise(async function (resolve, reject) {
     const bexioPool = await postgresBexio;
     const pool = await connectPostgres;
      let errorBody = error || '';
     try {
          bexioPool.query('begin');
          const selectQry = `SELECT c.cid,ds.cid as invoicesendid FROM documents_invoice_send ds 
            INNER JOIN companyregistered c ON ds.fk_companyregistered = c.cid
            WHERE c.rk_party = $1
            AND rk_invoice = $2
            AND ds.invoicetype = 'EDI'`
          const selectQryResult = await bexioPool.query(selectQry,[partyId,invoiceId]);
          let insertQry;

          if(selectQryResult.rows.length == 0){

            const selectQry = `SELECT * FROM companyregistered
              WHERE rk_party = $1`
            const selectQryResult = await bexioPool.query(selectQry,[partyId]);

            insertQry =`INSERT INTO 
            documents_invoice_send
              (rk_invoice,invoicenumber,fk_companyregistered,invoicetype,status,response)
            VALUES
              ($1,$2,$3,$4,$5,$6)
              RETURNING cid`
            let result = await bexioPool.query(insertQry,[invoiceId,invoicenumber,selectQryResult.rows[0].cid,'EDI',status,errorBody]);
            console.log(result);
            
            sendInvoiceId = result.rows[0].cid;
          }
          else{
            sendInvoiceId = selectQryResult.rows[0].invoicesendid;
            let updateQry =`UPDATE 
              documents_invoice_send
                SET timestamp = NOW(),
                response = $3,
                status = $4            
              WHERE fk_companyregistered = $1
                AND rk_invoice = $2
                AND invoicetype='EDI'`
            await bexioPool.query(updateQry,[selectQryResult.rows[0].cid,invoiceId,errorBody,status]);

          }
          bexioPool.query('COMMIT', err => {
            if (err) {
              console.error('Error committing transaction')
            }
          })
          resolve(sendInvoiceId);
          /***********************Push invoice********************************/
        } catch (error) {
          bexioPool.query('ROLLBACK', err => {
            if (err) {
              console.error('Error committing transaction')
            }
          })
          console.log(error);
          commonErrors['errorTitle'] = setInvoiceSendStatus.name;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+partyId+'-partyId'+invoiceId+'-invoiceId'+invoicenumber+'invoiceNumber';
          warningMessage(commonErrors,error);
          resolve('');
          
        }
    });

}
const setInvoiceToOt = async (invoice,coutryList,invitionData,pdf,fileName,customerIds,invoiceCid) => {
  console.log('invoice',JSON.stringify(invoice));

  let emptyValue = 'NA'
  let taxIsAdded;
  // let orderUnit = 1
  let priceQuantity = '1'
  let orderUnit = {
    'Stk':'C62',
    'h':'HUR'
  }
console.log('setInvoiceToOt : invitionData -> ',invitionData);
let total = '';
console.log("invoice['total_credit_vouchers'] == 0",invoice['total_credit_vouchers'] == 0);

// if(invoice['total_credit_vouchers'] == 0)
// {
//   console.log('if');
  
//   total = invoice['total'];
// }else{
//   console.log('else');

//   total = invoice['total_remaining_payments'];

// }
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
                  // "bmecat:COUNTRY": invoice.companyProfile[0].country_name?invoice.companyProfile[0].country_name:undefined,
                  "bmecat:COUNTRY_CODED": coutryList.filter(coutry => coutry.name == invoice.companyProfile[0].country_name)[0].iso_3166_alpha2,
                  // "bmecat:VAT_ID":invoice.companyProfile[0].ust_id_nr?invoice.companyProfile[0].ust_id_nr:undefined 
                  
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

                  // "CONTACT_DETAILS": [{
                  //     "bmecat:CONTACT_NAME": invoice.contact.name_1,
                  //     "bmecat:FIRST_NAME": invoice.contact.name_1,
                  //     "bmecat:EMAILS": [{
                  //         "bmecat:EMAIL": invitionData.receiveremail
                  //     }]
                  // }],
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
  let allTax = []
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
  
  // invoice.taxs.forEach(element => {
  //   tempTaxArray.push({
  //     "TAX_DETAILS_FIX": {
  //         "TAX_AMOUNT": element.value,
  //         "bmecat:TAX": element.percentage
  //     }
  // })
  // })

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
async function testApi2(req) {

  let parms = config.BEXIO_CONNECTION_CONFIG_SEND
              .replace('$netcom_id$','netcomIdG2b')
              .replace("$name$",'companyNameGate2b')
              
              console.log('parms',parms.slice(1,-1));

              console.log('parms',parms);
              // await setBusinessConnector(parms);
//    const pool = await connectPostgres;
// //  const qry = `INSERT INTO test ("name_ch","name") values(pgp_sym_encrypt($1,$2),pgp_sym_encrypt($1,$2))`
//   const qry1 = `select pgp_sym_decrypt("name",'RxT8d{)DVKhjb[&%vGTk=D7{') from  test`


//   const userPermissionCheck = `SELECT count(av.cid) FROM application_version av 
//   INNER JOIN application a
//   ON av.fk_application = a.cid
//   INNER JOIN partyapplication pa
//   ON pa.fk_application_version = av.cid
//   INNER JOIN partyapplication_account paa 
//   ON paa.fk_partyapplication = pa.cid
//   INNER JOIN party_account pac
//   ON pac.cid = paa.fk_party_account
//   WHERE paa.fk_account = 389
//   AND pac.fk_party = 407
//   AND code = 'EDI'`;
  
}

async function setBusinessConnector1(params) {
  console.log(params);
  
  try {
    // let formDa = new
  
    let fomdata={
      data:params
    }

    let keys =Object.keys(params)

    // keys.forEach(element => {
    //   formData[element] = params[element];
    // });
    console.log('stringfuu',params);
    let  options = {
        'method': 'POST',
        'url':'http://192.168.2.63:5005/api/bexio-connector',
        // 'headers': headers,
        formData: fomdata
      };
    // let  options = {
    //   'method': 'POST',
    //   'url':'http://testadmin-bexio.io-procurement.com:3000/api/v1/gate2bAPI/testApi2',
    //   // 'headers': headers,
    //   formData: fomdata
    // };
    return new Promise(function (resolve, reject) {
      request(options, async function (error, response, body) {
        console.log(options);
        
        if (!error && response.statusCode == 200) {
          resolve(body);
          console.log('response',body);
          
        } else {
            console.log('error',error);
            
          reject(error);
        }
      });
    });
  
    
  } catch (error) {
      commonErrors['errorTitle'] = setBusinessConnector1.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+params;
      warningMessage(commonErrors,error);
    console.log(error);
    
  }
}
// const getInvoiceDownload = async (accessToken,invoiceId)=>{

// }
const getInvoicePdf = async (accessToken,invoiceId)=>{
  try {
    // let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
    // let accessToken = cookie.access_Token;
    // let isBexioUser = cookie.isBexioUser;
    // if(isBexioUser)
    // {
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
    // }else{
    //   return false;
    // }
  })
   
  } catch (error) {
      commonErrors['errorTitle'] = getInvoicePdf.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+accessToken+' '+invoiceId;
      warningMessage(commonErrors,error);
      return false;

      
  }
}
const getUserPermissions = async (partyId,accId) => {
  return new Promise( async (resolve, reject) => {
      try {
          const validation = async (partyId,accId) => {
              if (!partyId && !accId) {
                  return true;
              }
          };
          const validationResult = await validation(partyId,accId);
          if( !validationResult ){
              const pool = await connectPostgres;
              const redis_client = await redisClient;
              const getUserPermissions = `SELECT po.policy,par.cid from partyapplication_account_role par
                                          INNER JOIN partyapplication_account pa ON par.fk_partyapplication_account = pa.cid
                                          INNER JOIN partyapplication p ON p.cid = pa.fk_partyapplication 
                                          INNER JOIN role_policy rp ON rp.fk_role = par.fk_role 
                                          INNER JOIN policy po ON po.cid = rp.fk_policy
                                          WHERE fk_account = $1
                                          AND  p.fk_party = $2`
              const getUserPermissionsResult = await pool.query(getUserPermissions,[accId,partyId]);
              
              const redisKey = 'permissions_'+partyId+'_'+accId;
              const roleObject = {};
              roleObject[redisKey] = {};
              if( getUserPermissionsResult.rows.length > 0){
                  getUserPermissionsResult.rows.forEach(element => {
                      let policy = element.policy;
                      let effect = {};
                      if( policy != null){
                          policy.Statement.forEach(ps => {
                              if (ps.Effect in roleObject[redisKey]){
                                  roleObject[redisKey][ps.Effect] = roleObject[redisKey][ps.Effect].concat(ps.Action)
                              }else{
                                  effect[ps.Effect] = ps.Action;
                                  roleObject[redisKey][ps.Effect] = ps.Action;
                              }
                          });
                      }
                          
                  });
                  let effectObject = Object.keys(roleObject[redisKey]);
                  effectObject.forEach( ele => {
                      roleObject[redisKey][ele] = [...new Set(roleObject[redisKey][ele])]
                  })
                  await redis_client.setex(redisKey,24*60*60*2,JSON.stringify(roleObject[redisKey]));
              }
              resolve(redisKey);
          }
      } catch (error) {
      commonErrors['errorTitle'] = getUserPermissions.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+partyId+' '+accId;
      warningMessage(commonErrors,error);
          reject(error)
          // return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
          //     message: 'something went wrong',
          //     status: false
          // });
      }
  })
  
}
const getConnectionDetails = async (partyId,accountId,contactId,req) => {
  try {
    console.log(contactId);
    
    const pool = await connectPostgres;
    let bexioPool = await postgresBexio;
    
    // NEW

  //   const getInviteCompanyIdQry = `SELECT array_agg(pa.cid) AS cid FROM
  //   party_account pa
  //   WHERE pa.fk_party = $1`
  //   let getInviteCompanyId = await pool.query(getInviteCompanyIdQry,[partyId]);
  
  // console.log(getInviteCompanyId.rows[0].cid);
  let dataCookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.cookies[config.EXPIRE_EXPIRES_COOKIE_NAME])));
    console.log(dataCookie.netcomId);
    console.log(config.G2B_COMMON_ACTIVE);
    console.log(dataCookie.netcomId);

    
    const getConnectionStatus = `SELECT  * FROM
          contact_bc 
      WHERE rk_netcomidsender = '${dataCookie.netcomId}'
      AND rk_sendercontactid = ${contactId}
          AND type = 'EDI'
          AND rk_businessconnection IS NOT NULL`

    console.log("getConnectionStatus ",getConnectionStatus);    
    let partyObjectId = await bexioPool.query(getConnectionStatus);
    // // 

    
    // const getPartyObjectId = `select * from contact_bc pai
    //   INNER JOIN party_account pa 
    //   ON pa.cid = pai.fk_party_account
    //   WHERE pa.fk_party = $1
    //   AND rk_contact = $2
    //   AND pai.active = true`
    // const getPartyObjectId = `select * from party_account_invitation pai
    // INNER JOIN party_account pa 
    // ON pa.cid = pai.fk_party_account
    // WHERE pa.fk_account = $1 
    // AND pa.fk_party = $2
    // AND bexiocontactid = $3`

    // const partyObjectId = await pool.query(getPartyObjectId,[partyId,contactId]);
    return partyObjectId.rows;
  } catch (error) {
      commonErrors['errorTitle'] = getConnectionDetails.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+contactId;
      warningMessage(commonErrors,error);
    console.log(error);
    
  }
}
async function invoiceFilePush(netcomId,service,data,filename,type) {
  let formData = null
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
const copyData = async (partyId,accId) => {    
  const pool = await connectPostgres;
  let bexioPool = await postgresBexio;

  const getInviteCompanyIdQry = `SELECT * FROM
  party_account_invitation `
  
  const getInviteCompanyIdQryIns = `INSERT INTO contact_bc
  (rk_contact,rk_party_account,rk_partyreceived,rk_netcomidsender,sendercustomerid,rk_netcomidreceived,receivercustomerid,receiveremail,status,createddate)
  VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`
   let getInviteCompanyId = await pool.query(getInviteCompanyIdQry);
   let data;
  for (let index = 0; index < getInviteCompanyId.rows.length; index++) {
     data = getInviteCompanyId.rows[index];
     let satus=1
     if(data.active)
     {
      satus =1
     }else{
      satus = 0
     }
    let getInviteCompanyIdResult = await bexioPool.query(getInviteCompanyIdQryIns,[data.bexiocontactid,data.fk_party_account,data.fk_partyreceived,data.rk_netcomidsender,data.sendercustomerid,data.rk_netcomidreceived,data.receivercustomerid,data.receiveremail,satus,data.timestamp]);

  }
}

const createBill = async (req,res) => {
  let data = req.body;
  let cookie = null
  try {
    cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
    let accessToken = cookie.access_Token;
    let isBexioUser = cookie.isBexioUser;

console.log(req.body);



    // if(isBexioUser)
    // {
    // console.log('123');

    //   var options = {
    //     'method': 'POST',
    //     'url': `${config.BEXIO_API}4.0/purchase/bills`,
    //     'headers': {
    //       'Accept': 'application/json',
    //       "Content-Type": "application/json",
    //       'Authorization': 'Bearer '+accessToken
    //     },
    //     body:JSON.stringify({
    //       "supplier_id": 11,
    //       "vendor_ref": "7712589",
    //       "contact_partner_id": 8,
    //       "bill_date": "2022-04-21",
    //       "due_date": "2022-05-11",
    //       "amount_man": 337,
    //       "manual_amount": true,
    //       "currency_code": "CHF",
    //       "item_net": true,
    //        "address": {
             
    //           "firstname_suffix": "John",
    //           "country_code": "CH",
    //           "type": "PRIVATE"
    //       },
    //       "line_items": [{
    //           "position": 10,
    //           "title": "Huawei P20",
    //           "amount": 370
    //       }, {
    //           "position": 20,
    //           "title": "PanzerGlass Displayschutz",
    //           "amount": 32
    //       }]
    //   })
    //   //   body: JSON.stringify({
    //   //     "supplier_id": 11, //Contact Id
    //   //     "vendor_ref": "Reference text",
    //   //     "title": "Bill 42",
    //   //     "contact_partner_id":  8, // User Id
    //   //     "bill_date": "2019-02-12",
    //   //     "due_date": "2019-03-14",
    //   //     "amount_man": 23.8,
    //   //     "amount_calc": 32.08,
    //   //     "manual_amount": true,
    //   //     "currency_code": "CHF",
    //   //     "exchange_rate": 2.3455347621,
    //   //     "base_currency_amount": 212.78,
    //   //     "item_net": false,
    //   //     // "purchase_order_id": 637,
    //   //     "qr_bill_information": "\/\/S1\/10\/10201409\/11\/190512\/20\/1400.000-53\/30\/106017086\/31\/180508\/32\/7.7\/40\/2:10;0:30",
    //   //     "address": {
             
    //   //         "firstname_suffix": "John",
    //   //         "country_code": "CH",
    //   //         "type": "PRIVATE"
    //   //     },
    //   //     "line_items": [
    //   //         {
    //   //             "position": 1,
    //   //             "title": "First line item title",
    //   //             "tax_id": 15,
    //   //             "amount": 56.8,
    //   //             "booking_account_id": 16
    //   //         },
    //   //         {
    //   //             "position": 2,
    //   //             "title": "Second line item title",
    //   //             "tax_id": 15,
    //   //             "amount": 48.8,
    //   //             "booking_account_id": 14
    //   //         }
    //   //     ],
    //   //     "discounts": [
    //   //         {
    //   //             "position": 1,
    //   //             "amount": 56.8
    //   //         }
    //   //     ],
    //   //     "payment": {
    //   //         "type": "IBAN",
    //   //         "bank_account_id": 12,
    //   //         "fee": "BY_SENDER",
    //   //         "execution_date": "2019-03-15",
    //   //         "exchange_rate": 2.3455394587,
    //   //         "amount": 3.9,
    //   //         "account_no": 12345678125678900,
    //   //         "iban": "CH121234567812345678900",
    //   //         "name": "LeSS Organisation",
    //   //         "address": "1147 Super Street",
    //   //         "postcode": "9999",
    //   //         "city": "Tel Aviv",
    //   //         "country_code": "CH",
    //   //         "message": "This is a message.",
    //   //         "booking_text": "Further education.",
    //   //         "salary_payment": false,
    //   //         "reference_no": "1212345675321984798456",
    //   //         "note": "Some note text"
    //   //     }
    //   // })
    //    };
    //   request(options, function (error, response) {
    //     if (error) throw new Error(error);
    //       res.send(response.body);
    
    //   });
    // }else{
    //   return res.status(401).json({
    //     status: 'fail',
    //     message: 'unauthorized',
    // });
    // }
    logs.action = 'bexio.invoice.send';
    logs.level = 'NOTIFICATION';
    logs.item = 'EDI';
    // //addlogs(logs,data.rolePartyId,data.roleAccId);
   
  } catch (error) {
    logs.action = 'CREATE_BILL';
    logs.level = 'ERROR';
    logs.item = 'EDI';
    // //addlogs(logs,data.rolePartyId,data.roleAccId);
    console.log(error);
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,',+cookie;
    warningMessage(commonErrors,error);
    return res
    .status(500)
    .json({ status_code: 500, message: 'something_went_wrong', status: false });
      
  }
}
const constGetContactId = async (code) =>{
  try {
    console.log(code);
    
      let newGate2b = await postgresGate2b;
      const getcustomerId = `SELECT json_extract_path("ot_updator"::json,'in_custom_id') AS senderId,
        json_extract_path("ot_updator"::json,'out_custom_id')  AS receiverId
      FROM  g2b_business_connections 
        WHERE id = $1`
    const getcustomerIdResult = await newGate2b.query(getcustomerId,[code]);
    return getcustomerIdResult.rows
  } catch (error) {
      commonErrors['errorTitle'] = constGetContactId.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+code;
      warningMessage(commonErrors,error);
  }
}
const setBillId = async (id,billId) =>{
  console.log('error');

  try {
    let bexioPool = await postgresBexio;
      const getcustomerId = `UPDATE documents_invoice_receive 
      SET rk_invoice = $1,
        status = $2
        WHERE cid = $3`
    const getcustomerIdResult = await bexioPool.query(getcustomerId,[billId,2,id]);
    return getcustomerIdResult.rows
  } catch (error) {
    console.log(error);
      commonErrors['errorTitle'] = setBillId.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+billId;
      warningMessage(commonErrors,error);
    return 0;
  }
}
const xmlToJson = async (req,res) => {
       let formData = null;
       const pool = await connectPostgres;
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
              // 'url': `http://192.168.2.63:5005/api/file-download`,
              formData: formData
            };
            request(options, function (error, response) {
              if (error) {  
                commonErrors['errorTitle'] = 'xmlToJson';
                commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+formData;
                warningMessage(commonErrors,error);
                logs.action = 'bexio.bill.create';
                logs.level = 'ERROR';
                logs.item = 'EDI';
                addlogs(logs,reqData.rolePartyId,reqData.roleAccId);
                res.send({
                  status_code: 500,
                  message: 'something_went_wrong',
                  status: false,
              
                });
                return
              }
    
                // console.log(JSON.parse(response.body));
    
                let data = JSON.parse(response.body).data;
              // let data =`PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/Pgo8T1BFTlRSQU5TIHhtbG5zOmlvbWFya2V0PSJodHRwOi8vdGVtcHVyaS5vcmcvaW8tbWFya2V0L29wZW5UUkFOU19VRFgiIHhtbG5zOmJtZWNhdD0iaHR0cDovL3d3dy5ibWVjYXQub3JnL2JtZWNhdC8yMDA1IiB4bWxucz0iaHR0cDovL3d3dy5vcGVudHJhbnMub3JnL1hNTFNjaGVtYS8yLjEiPiAKICA8SU5WT0lDRSB2ZXJzaW9uPSIyLjEiPgogICAgPElOVk9JQ0VfSEVBREVSPgogICAgICA8SU5WT0lDRV9JTkZPPgogICAgICAgIDxJTlZPSUNFX0lEPlJFLTAwMDAyPC9JTlZPSUNFX0lEPgogICAgICAgIDxJTlZPSUNFX0RBVEU+MjAyMi0wNC0yMFQwNDoyNjoyMC4wMDBaPC9JTlZPSUNFX0RBVEU+CiAgICAgICAgPFBBUlRJRVM+CiAgICAgICAgICA8UEFSVFk+CiAgICAgICAgICAgIDxibWVjYXQ6UEFSVFlfSUQgdHlwZT0ibmV0Y29taWQiPjQxNDIwLTAwMDA0MTIwMDQtMTA8L2JtZWNhdDpQQVJUWV9JRD4KICAgICAgICAgICAgPFBBUlRZX1JPTEU+aW52b2ljZV9pc3N1ZXI8L1BBUlRZX1JPTEU+CiAgICAgICAgICAgIDxBRERSRVNTPgogICAgICAgICAgICAgIDxibWVjYXQ6TkFNRT5CZXhpb19nYXRlMmJfVEVTVF9TZW5kZXJfTkVXPC9ibWVjYXQ6TkFNRT4KICAgICAgICAgICAgICA8Ym1lY2F0OlNUUkVFVD5hc2RzYWQ8L2JtZWNhdDpTVFJFRVQ+CiAgICAgICAgICAgICAgPGJtZWNhdDpaSVA+MTIzNDU2PC9ibWVjYXQ6WklQPgogICAgICAgICAgICAgIDxibWVjYXQ6Q0lUWT5zYWRzYWQ8L2JtZWNhdDpDSVRZPgogICAgICAgICAgICAgIDxibWVjYXQ6Q09VTlRSWV9DT0RFRD5DSDwvYm1lY2F0OkNPVU5UUllfQ09ERUQ+CiAgICAgICAgICAgIDwvQUREUkVTUz4KICAgICAgICAgIDwvUEFSVFk+CiAgICAgICAgICA8UEFSVFk+CiAgICAgICAgICAgIDxibWVjYXQ6UEFSVFlfSUQgdHlwZT0ic3VwcGxpZXJfc3BlY2lmaWMiPjQxNDIwLTAwMDA0MTIwNTAtNjY8L2JtZWNhdDpQQVJUWV9JRD4KICAgICAgICAgICAgPFBBUlRZX1JPTEU+aW52b2ljZV9yZWNpcGllbnQ8L1BBUlRZX1JPTEU+CiAgICAgICAgICAgIDxBRERSRVNTPgogICAgICAgICAgICAgIDxibWVjYXQ6TkFNRT5UZXN0X0RlbW9fSW5kPC9ibWVjYXQ6TkFNRT4KICAgICAgICAgICAgICA8Ym1lY2F0OkNPVU5UUllfQ09ERUQ+Q0g8L2JtZWNhdDpDT1VOVFJZX0NPREVEPgogICAgICAgICAgICA8L0FERFJFU1M+CiAgICAgICAgICA8L1BBUlRZPgogICAgICAgIDwvUEFSVElFUz4KICAgICAgICA8SU5WT0lDRV9JU1NVRVJfSURSRUY+V09SS19GTE9XX1RFU1RfMTwvSU5WT0lDRV9JU1NVRVJfSURSRUY+CiAgICAgICAgPElOVk9JQ0VfUkVDSVBJRU5UX0lEUkVGIHR5cGU9InN1cHBsaWVyX3NwZWNpZmljIj5meTlqamtkNThiZWw8L0lOVk9JQ0VfUkVDSVBJRU5UX0lEUkVGPgogICAgICAgIDxibWVjYXQ6Q1VSUkVOQ1k+Q0hGPC9ibWVjYXQ6Q1VSUkVOQ1k+CiAgICAgICAgPFBBWU1FTlQ+CiAgICAgICAgICA8QUNDT1VOVD4KICAgICAgICAgICAgPEhPTERFUj5NdXN0ZXIgSGFuczwvSE9MREVSPgogICAgICAgICAgICA8QkFOS19BQ0NPVU5UIHR5cGU9ImliYW4iPkdCMzNCVUtCMjAyMDE1NTU1NTU1NTU8L0JBTktfQUNDT1VOVD4KICAgICAgICAgICAgPEJBTktfQ09ERSB0eXBlPSJiaWMiPkJVS0JHQjIyPC9CQU5LX0NPREU+CiAgICAgICAgICAgIDxCQU5LX05BTUU+QkFSQ0xBWVMgQkFOSyBVSyBQTEM8L0JBTktfTkFNRT4KICAgICAgICAgIDwvQUNDT1VOVD4KICAgICAgICAgIDxQQVlNRU5UX1RFUk1TPgogICAgICAgICAgICA8VElNRV9GT1JfUEFZTUVOVD4KICAgICAgICAgICAgICA8REFZUz4zMDwvREFZUz4KICAgICAgICAgICAgPC9USU1FX0ZPUl9QQVlNRU5UPgogICAgICAgICAgICA8VkFMVUVfREFURT4yMDIyLTA1LTE5PC9WQUxVRV9EQVRFPgogICAgICAgICAgPC9QQVlNRU5UX1RFUk1TPgogICAgICAgIDwvUEFZTUVOVD4KICAgICAgICA8TUlNRV9JTkZPPgogICAgICAgICAgPE1JTUU+CiAgICAgICAgICAgIDxNSU1FX0VNQkVEREVEPgogICAgICAgICAgICAgIDxNSU1FX0RBVEE+SlZCRVJpMHhMalVLSmVMano5TUtDakVnTUNCdlltb0tQRHd2Vkhsd1pTQXZRMkYwWVd4dlp3b3ZVR0ZuWlhNZ01pQXdJRklLTDA5MWRHeHBibVZ6SURRZ01DQlNQajRLWlc1a2IySnFDZ28xSURBZ2IySnFDanc4TDB4bGJtZDBhQ0EzSURBZ1Vnb3ZSbWxzZEdWeUlDOUdiR0YwWlVSbFkyOWtaUW92Vkhsd1pTQXZUMkpxVTNSdENpOU9JRElLTDBacGNuTjBJRGsrUGdwemRISmxZVzBLZUp3elV6RGdNbEV3TitTeXNkRVB5U3pKU1ZYUXlNd3J5ODlNVGxVSWN0VTFBQUlqVFM3OWdNU2kxTHdTQlJNRkE0VWdMbjJYMU9JU2hXaGpFRWRCUHlJeUNzZ3dOUWR5WSszc3dNWlVGcVFxNlB1WGx1Ums1cVVXYyttN1pSWUIxWnRCOVBva0l0ak8rYVZBUXcyQnVnQWREQ01FQ21WdVpITjBjbVZoYlFwbGJtUnZZbW9LQ2pjZ01DQnZZbW9LTVRFM0NtVnVaRzlpYWdvS01pQXdJRzlpYWdvOFBDOVVlWEJsSUM5UVlXZGxjd292UzJsa2N5QmJNeUF3SUZKZENpOURiM1Z1ZENBeFBqNEtaVzVrYjJKcUNnbzRJREFnYjJKcUNqdzhMMHhsYm1kMGFDQTVJREFnVWdvdlJtbHNkR1Z5SUM5R2JHRjBaVVJsWTI5a1pUNCtDbk4wY21WaGJRcDRuSlZXWFUvYlNoQjl6NitZUnlPVnZmdmgvVEF2RlFaS3ViUVZLcTZ1cXFxS0hIdHBmRXZzMUY0WDh1ODd6aGU3MUtRcUQ0RGd6SnlaTTJkbWsyWVRUWWxSaW9IU2pPZ2tOcENWazMvZU1FZ0l4Uy9JN2laUlpqczNQYmVMWm5wVmwwZVEvVCs1eUNacE5oR0pJcHpHQ3JSV1JHbWxON0hjajAzdFk5Vk12K1hPOHRrMHU3ak5wcmUyTG0wNy9YRHgzMmdxSlluWnB3ckt5THV5eThmNXBTUjBHeFF4TG1LcFBGak1EZEZDaXhDR3FieHNPeFdrcElReFNTSFdnZ2dqRFZEQ2paRFEyc25kRTRwUmtraW1EcU5pUk1YS3NNTW9nZHBKRStzL29LUWdrakwrSnhRalhERXpqa3I5TmpWUkprNTJBMlBzU2VhcS90bFVoWVdQRjhmRDM3aW41RDVjU0NMSHZWTGlwRSs4RUdZTVNiUk1ncGlJVTBKam5CMzNzd3VxaVpSSm1ENHFtdHJsaFlPbGJidW1QZ25tS29sU3hvVDR3YXl3ZHV4c2JUM0cyVmdIL01udDBUSmY1Yk43QzdQVmVPVStsbUd2OHVYS2ZXalJkNjVaMkJicWZqR3o3WGpwZnNBZ0loVWoxY1k2SVlsZ2NvMDZ0M2tMTDYza1BrSWFJcllSWDZKc250ZmZZZFgwY05lMHc4OFdYSXZWRWZnOC9INDBPVVlER0pRUTl0T3ZPbGprcFlWK0NYbUhZZmYzelVOM2N2UVZzbitmVXcyU2JLbWVMZit5NllpdktJdUpaRm9ISVZGcHU2S3RscTVxYWw5U3hDWUdsemJBL3VqejJsVnVGUndCM0ZpbG5nSDd1a0xMdE5pSnI3ckJkY0RiRUVKZDQvTDdEUmJPM3I0WkVWTWtrdUNNNklqZDJWaDdJVDVReEExelc3Wk4yUmR1Tk5SSXdzYXBialpSVURTbFBZSGxsRkVXNktWSW9uQ2pmZkpvV0d1NGRkOTlFYWdaR013eklDNGs5VkJyWHdvTVBvaDZLbHR4UWhWZTR0ODczaG1xNnhmZzhzZGorMmdYU3pkSzVTWDVqV28vQ3o3TWtJMjhEMStpODJidDhYbiswMEplcitCSGoycWpyYnJYY0drZFZQWFc2WGdpTmVEYysySU9ENVdiUTQ4MkhYRTJUd3hSVzY3b3VxcEx2S1BmOHJic1J1cmlSaE96dzRiblo3MnNnV3FjTUlFWFh3empFWHZSOUYrL21seFFvdEQ4WVNibVo5bzhtcTlnOHlwQytPcXRmU1B3S2NNOWU3bVltM2xUQnpkZHhJaGxuQjZneGRWVk1oYWMrVE1VdzBXTjhhSWVhQndQVlhBb2NWeWFHMzZBS2ozOWVQYnU5UE10cEtjZnJ1SFROZHk4Ty9QVnhrc1l4MHJDWUp4eDB0T2lhUHJhUWZOUWgyZWFvNytWcGl5TURkamY0eG5GRS84MnIzMVhjSVh2citUcUFHbDZkUlpRR1d3UU96MUFsWDY2VGkvVDhPSGgrSCtCMi9reXp4WEtFZzR2SVFidGQ0RG9NaFVDQmpiRTRKU1psQkkvTWF5LzdSTDlBaHpMWTNFS1pXNWtjM1J5WldGdENtVnVaRzlpYWdvS09TQXdJRzlpYWdvNU1UVUtaVzVrYjJKcUNnb3pJREFnYjJKcUNqdzhMMVI1Y0dVZ0wxQmhaMlVLTDFCaGNtVnVkQ0F5SURBZ1Vnb3ZUV1ZrYVdGQ2IzZ2dXekFnTUNBMU9UVXVNREF3TUNBNE5ESXVNREF3TUYwS0wwTnZiblJsYm5SeklEZ2dNQ0JTQ2k5U1pYTnZkWEpqWlhNZ1BEd3ZSbTl1ZENBOFBDOUdNU0F4TUNBd0lGSUtMMFl5SURFeElEQWdVajQrQ2k5UWNtOWpVMlYwSUZzdlVFUkdJQzlVWlhoMFhUNCtQajRLWlc1a2IySnFDZ294TUNBd0lHOWlhZ284UEM5VWVYQmxJQzlHYjI1MENpOVRkV0owZVhCbElDOVVjblZsVkhsd1pRb3ZRbUZ6WlVadmJuUWdMMUJZUVVGQlFTdEJjbWxoYkUxVUNpOUZibU52WkdsdVp5QXZUV0ZqVW05dFlXNUZibU52WkdsdVp3b3ZSbWx5YzNSRGFHRnlJRE15Q2k5TVlYTjBRMmhoY2lBeU5UVUtMMWRwWkhSb2N5QmJNamMzSURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXlOemNnTUNBeU56Y2dNQ0ExTlRZZ05UVTJJRFUxTmlBMU5UWWdOVFUySURVMU5pQTFOVFlnTlRVMklEVTFOaUExTlRZZ01qYzNJREFnTUNBd0lEQWdOVFUySURBZ05qWTJJRFkyTmlBM01qSWdOekl5SURBZ01DQTNOemNnTnpJeUlESTNOeUF3SURZMk5pQTFOVFlnT0RNeklEY3lNaUF3SURZMk5pQXdJRGN5TWlBMk5qWWdOakV3SURjeU1pQXdJREFnTUNBMk5qWWdNQ0F3SURBZ01DQXdJRFUxTmlBd0lEVTFOaUExTlRZZ05UQXdJRFUxTmlBMU5UWWdNamMzSURVMU5pQTFOVFlnTWpJeUlEQWdOVEF3SURJeU1pQTRNek1nTlRVMklEVTFOaUExTlRZZ05UVTJJRE16TXlBMU1EQWdNamMzSURVMU5pQTFNREFnTnpJeUlEVXdNQ0ExTURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3WFFvdlJtOXVkRVJsYzJOeWFYQjBiM0lnTVRJZ01DQlNQajRLWlc1a2IySnFDZ294TWlBd0lHOWlhZ284UEM5VWVYQmxJQzlHYjI1MFJHVnpZM0pwY0hSdmNnb3ZSbTl1ZEU1aGJXVWdMMEZ5YVdGc1RWUUtMMEZ6WTJWdWRDQTVNRFVLTDBSbGMyTmxiblFnTFRJeE1Rb3ZTWFJoYkdsalFXNW5iR1VnTUFvdlUzUmxiVllnTUFvdlEyRndTR1ZwWjJoMElEQUtMMFpzWVdkeklETXlDaTlHYjI1MFFrSnZlQ0JiTFRZMk5DQXRNekkwSURJd01qZ2dNVEF6TjEwS0wwWnZiblJHYVd4bE1pQXhNeUF3SUZJK1BncGxibVJ2WW1vS0NqRXpJREFnYjJKcUNqdzhMMHhsYm1kMGFDQXhOQ0F3SUZJS0wwWnBiSFJsY2lBdlJteGhkR1ZFWldOdlpHVUtMMHhsYm1kMGFERWdNekEwTlRJK1BncHpkSEpsWVcwS2VKeTh2QWw4Vk5YNU4zN091Y3ZNM0xremMyZkpiSmtrZHpMWlNBSUpXUWdEVVFZaFFaWUFza21RU0VJeVdTRDd3aVpJVURZUkZXMUZzVlpCVVVGRkFnUU1pSlZTcW5XaDBHcXQycXEwNGxxcC9GcEtXekV6NzNQT25ZU2dmWCsvLy92L3Y1Ly9UTzY5enozM3JNL3pmWjd6UE9mY0NjSUlJUmwxSXc2RnFwdXFXaWUvOFB4WGtQSVdRdGhXdmF4VDNkNzYyMlZBbjBOSXpLMXRyV3RhbnI3M0h3anBGWVNFbnJyR2xiV25yT1ZWQ0psT0lCVHFyUTlYMWJ3UnZMd05vZW1kVU1lb2VraXdOY25INGY1NXVFK3BiK3BjRVYzbWNzUDlXYmovb3JHbHVncUpPNDRnTktNUDdyOXVxbHJSeXArVGY0VFF6TjF3cnpaWE5ZVi9qdXVLNGY0VVF2R20xcGFPem1nbTJvN1EwbmZvODliMmNPdGY5clg5R2U0dklTVDFReHBHZER4MFJBaUw2SC84NENFMEFSYndncWpUR3lTamJETFRKQXRTckRZN1FvNDRKM0s1UFY0VWozd0ppVW0wYlZiRWo1SURLYWxwNlJuRE1sRlc5dkFST2JrajgvSUxDa2NWalE3K3oyMy8vL01SamlFUEhGN2hHZVRoMHhEd1B2bzVIRi9RYTZRaCtnVjlUcStFU3IwdmRpQzBCKzNERFdnZmVnV2R4QmVoMUg1MEZQV2lYeUVYbW9nZVJhdlJqOUVtSktJRmtISVhtZ1ZmQWRKL2pEM1JYcFNEZGdFamQ2SFRrUGRtZERzNmhwellIZjBTclVVYnVMZWgxQVprUXNsb1BKcUpXdEE5ZUZxMEN5MUVIL04zb2lJMERUV2pWdHdkblIrOU4vcEFkRGQ2Q2gzbGZoWHRSMGJrUmRYd1BSMzlxL0JlOUk5b09KUjRFTzFBSCtNSERJZFJDRnJwaHB3L1JlM29FYTZDeDlHNjZMZlFBejlhRG4zZ1VSazZqVStRTEtnOWpEN0hicnlhbXdDMVBCbnRpWjZDWEQ1VWdlclJJK2dZTHNTVGlGOVlHQzJMbmtaT2FHTUYxTG9ESFVSSDROdUhYa1lmWUZtNEdOMGR2WWc4S0J0Tmh2SDBvbC9qRTF5a2YxMWtIR1UwY0drWUNzS1RGdlF6OUJvNml3UDQ1NlJGa0lVOElTU3NpcjZESEdna21ndTlmUVpLZm9iL1NXNkg3MXJ1VmI0MGVnTXlBMS91cDl4R3YwUi93bDZjZzJmZ2VXUVlhU0dQY2UxSUR5Mk9oRzhOYWdCK1B3eTFmNFN6OEJFaWt6UGNrL3h6L0JVeElYSXVhZ2FKcEtHZm9KK2luMk1UakZURkhmZ08vQzcraEV3Z2k4aFB5Sis1SC9ONytkL3FxbURVdDZJbWRBOTZEdjBUMi9Cb2ZCTytCZGZqMVhnVHZoL3Z3S2Z4V2Z3RkdVL21rS1hrRzY2ZWErTmU1bStBNzJ5K2c3OVQyQ2pjTFg0Um1SODVGZmxONUovUnZPaEdkQlBnWVIzMC9rSDBHSXpzS0RxRDNvZnZ4K2pQV01CR2JJYXZpdjE0THI0TnZyZmplL0FUZUEvZWkzdWhsYlA0ei9oTC9EZjhEM3lGZ1A0UmtjUVRQMG1HYjRDMGsrWGt4K1JSY2dhK1o4blg1TitjaTB2bXNyaENycGdyNTFxZ1Y1dTRiZkE5elAySjkvSm4rQ2p3T1UvWUxqd3U3QkdlRTA0S0YwVlpkNGNlNmQvNjdzbit6UDZQSWlpeU9iSTljakRTRy8wVGlnTVplb0VMU2FnWWVsOEYzeVVnNysyQXVQM29iU3dENzd3NEUxK1Bwd0ZuRnVFbHVBMnZBRTZ1eDQvZ3AxamZYOERIZ1V1L3g5OUFuMDNFeC9vOGdoU1NHOGdNK041S3dxU05iQ01Qa0Y3eUx2bVcwM0ZHenNMRmNabmNKSzZDQzNPZDNFcHVPOWZEdmNWOXlQMlp1OHg5Qjk4b0wvRkpmREtmeG1meGsvaEZmQmYvR1A4NS83bXdVSGhUK0ZTVXhDWnhvOWduL3BkdWxPNTYzVXpkVGJvSzNYMjZJN3AzOUpXQXpsK2d3K2pGb1RxUHozSHJ1Qkx1TUxxWDVQTWU4bXZ5YThEeklsVERsUkZBS3RtRE41TTF1SmVrQ0N2RXNXUXNubzR1OG1uQTYxZko0K1F5R2N1VjRhbDRObHBDUm1xMWlRNytXYmdVODc5QUYvampNTFpmUTgwclJCbmZUcjRSWlhRUUl3TFdEditTeStXenVEZlJCOXpIV01mdlFuL2dKZXpDRjhnejNFeEF3Y3Y4OWNKODVPY2VSUzl3YlhnTk9reEt3R0pmMFc4RkhFL0h6NEpkbUlQejhMKzRLT0xJZEVCUkVmY0p1aE10SmUraEM2REhtOUZEdUlhdlEvZWlmTHdhZlk2ZUJxMFlKalNMbVdJY2ZwMDA4RnVJSGZjaXd1K0YwUVZ4Q3VZRUIxcVBLN2hIeEcvSSs2Z0xuZUVsOUJIM1BQVCtESG1CSytNdkNyTndQV2pBR3JRUnRVWFhvWlhDZlA2M3VBNXhlQjVLNWMrQmRWdk41ZkYrdUs0RnE3SVFiTm9SME81allBZkdjMldRNGdia1RBTmN6QVVMOFFoOEh3WTd3UU9DR2tESGJ
              // 3WXI5bXZVSzg0aGZhaE9NR093T2dqeGIwWm1vUVhScDlHT2FCMXFqajZBaG9NOTJCUmREVFh1UVoraSs5QWV2Q0Z5RzJwRmlhQTVIK0ZwUWlrNUk1UkdoNU10NUgweW0yeS9WcjdBN1ZUc1JsL0I5d1ZVaXE0WFhrSmIrTitqMldoY2RHdjBkNER1RExDd085QmlOQVdkaDFIK0ZWcTRrVHVCOGlQVHlZRm9LZGNLNC8wWTNSUjlKcHFFSlZRZmJVUXowSEgwbEU1QVZicXMwUGp4b1hIWFgxYzhka3h3ZEZGaFFYN2V5TnljRWNPenN6S0haYVNucGFZRWt2MXFVbUtDTDk3cmNidWNjUTY3emFwWXpDYlpLQm4wT2xIZ09ZSlJka21ndEZMdFNhdnM0ZE1DTjk0NG5ONEhxaUNoYWtoQ1pZOEtTYVhYNXVsUksxazI5ZHFjSWNoWis3MmNJUzFuYURBblZ0UmlWRHc4V3kwSnFEMm5Kd2JVUHJ6Z3B2bEEzek14VUs3MlhHQjBHYU8zTWRvRXROOFBCZFFTZC8xRXRRZFhxaVU5cGN2cXQ1UlVUb1RxRGhpbENZRUpZV2w0TmpvZ0dZRTBBdFhqQ3JRZXdLN3JNU09JcTJUTUFZTDBKdWhVanpjd3NhVEhFNWhJZTlERHBaWlUxZlRNdkdsK3ljUjR2Nzk4ZUhZUG5sQWRXTnlEQWpmMFdMSllGalNCTmRNalR1alJzV2JVQmpvYWRMZDZJUHZFbHExOUNscGNtU1hYQkdxcUZzN3Y0YXJLYVJ2V0xHaDNZbzlyMVhuMzFWdW8zRFpoL3FhaFQrTzVMU1h1QnBYZWJ0bXlTZTNaZWRQOG9VLzk5RnhlRG5WQVdaSmFXcm1sRkpyZUNreWNPbHVGMXNpRzh2azllQU0wcWRLUjBGRnA0d3NIU21oSzVSSzF4eEM0SVZDL1pVa2xpTWE3cFFmTld1ay82UFdHamtiUElXK0p1bVhPL0lDL1oxeDhvTHhxb3UrQUEyMlp0ZktRSjZSNnJuMHlQUHVBWXRVWWU4QnNpUkd5YVNnUkhuekdLSmFkVWxObkRYSVcweDRGSmdNZ2V0UnFGWG95UHdCakdrMVA0ZEZvUy9Wb3lBYWZjZ3lsZW1wQUlnMDloZ21WVzVReE5KMlc3eEZTbFlDNjVSOElFQkM0OFBXMUtWV3hGREZWK1FlaUpNWEpJTlRnK1FEZGs1WFZrNWxKSWFLYkFES0ZQbDdQN2d1SFp5L3JJNEZBcTZMQ0JkaUhaZ0p2cThySDVBRDcvWDRxNEx2N1FtZ3gzUFIwM3pSZnUxZlI0dmlES0pTVFZkNURLdW1URXdOUDR1YlNKOTBEVHdhTFZ3WUF5YjNNbjQzcjBhY04vbGtVcDcya2Zrd1BkdjQzajhQYTg2bXpBMU52V2pCZkxkbFNHZVB0MURuWDNHblBSdzgraTFFOTlnbnp1WGdTbzBnOHg1NENLQmNPWnFZMzgrVWVQaFgrUkFicW1qNmRIbERKVXJCYTJxTlUzcWlkeXlXLy8vOWhvYjdvUlZxS1hhNFdpM1d6WjB6V3RmZGpyN20vcG52eUZnNDZESlBnMURrTHRteVJybmtHVU5NYW5CeTdBT0xSblBsK2RVSVBtZ3VhbVFwL2ZkRVRvK2xSSHQ4VEFwWk5vQmtBZjFwUzdQYWFqUEV4dWh3K0ZKM0RzMHZCMEczWlVocFFTN2RVYnFucWkzWXZEcWhLWU10UmNwS2MzTkphVWprQW5MN29zYnZqZTBxM2xnT3Y2dkdZNFloZzVud0tDTHhaSGJxaGwrRHpvcTZQN0FqWmtjQ2Y1NUNrNDg5ajVOR0x3bm5DSFlkSjNRQXUzZ2premxJdUYvY1hUMWN1RlpmMUY2TnhRQ3Zmd1dsa3J0L3F0NmJDQ2NPVTlwM0tuZmd1SktBclNPVlAwSERwMmNoSCtFN3dxeVUwL2JBRURUNG45dUdab1RUTUZST0NKVnlNSk1MQkRSSkg2OGJNQUorakJXYlFuZEM1bmNaZEQwT1RseW91blZjdUZDdlFJRDByRjVUK0M5aHFDNDdNelMvTWozT0l1dlJSbzRxT25KNTVjMTV3RkhmNmROdmRhV1dlcWx1ZzNXUFErQ1pvbDBPcElUZWh6UlJybGU5SC9FNTR2cE5uOVYrdXFMZ0FWV3ZWSFR0OStqUU42K1pHUCtldHdnbWtvQVIwdUZkVVBZb1BJSE9RcU1hZmdibHl3bUdEd3hJOUYxck1pNXZJWnVObXkrdG13YUF6dWttSmZWcmNGTStFK0RuMmhYRUxQYlBpbCtxV0dxdnRqWEZMUFpYeEs4bHljWmx4bFdXVCtMQnV1L0s2K3dQeXJ2aXU4UThXcnplUkZ4eUpKcE9yd3hEeUJ3cHlEUmdaRkFNeGJFdXlkaUNRZXNnTXFTb0VMZ1J0UzN6dGJ0YnRyQXR3YXN1aW5hZmR4eFZ0RUppTXBoOE1oMTJ4amNyUGN6cHRjUW9SQThucGFYYkZtWjgzeXFxa0JaSjE0dHlsYis5Y2RyRHpoaVZ2NzNwbjVmMUg5NjVldlhmdjdhdW5WSkMzTVkrdmUzN1JvVWowZzBnazhvdDlENytJZnhwNTZKdUw0T3N2K1d2RFJpclBqNEZCVjRBM0V1b0lxVnpJWkMxWXlxOGw5NUVkZXY1NUhodVFLQkRPSUdDWjREY2sxbmNiSFJIQ0twVDF5a0xJWkNrUUJvYVVLMkFWUWgwaWVJekhjREhlQUJpYnJweUhVV1d4c1drNEcrY0tZbXVRamhCVlpQa0RWbEhVRllMTTg4bVYzdkZ2ejNub3p6bWQvRzNYcjA1NllkSWJpMmovSVBibmRkQy9SUFI1YU5SWVlhejRrdkNLK0pMdU5mM3JQdDFrdVZ5ZVkxNHExNWhYMlZiWjc3SWR0MzNxL1RUK29sZCt4ZmlpbmNRclBpVkJTVlRFbjBISXBnTUI2K0ZxaUY0TWVSTWxSUytLYi9pOERwL1BxL2Q1T1V6MFhoOW5TbFQ2eU81RE02elkyb2ZkaDAySkRnRWw5cEdYUWhaTVpLbkQ5VGIwaDhvVHYwVFdRZnl2NE5FaDJYcDRISVJXTFdRdDRja3hrb0tTOEgwSE5JRmVBb0ZtRlN1WExqRFZHbmVoditLODFVYkhEcWRONWhGWjVqWEtLUTM1YUVES28xRUZybWhQamZPbkZRRkhSbzBxTEFEeE1wVUEyWU55aURyNDQzWGZGUkZYNnBPUGZMTm54MjEzUElxUDJ2LzFtN2N2My9qTXlTY1dKdTdiTjc2NCtzVHRwejZ0WGZxalI3Zll6N3ovMWI3NXp4N2Z2YmxxSkhCeVh2UXozZ21jekVKdmh6SUVrOU5VWXRwbzRrdXNOMXVYeFhPem5JM0tFa2VOczh1MDBySFJ0TVZ4Vi94VEprbFF1VDVRQ2lOZERlRjFPR0NTTVdWUUNDcDdDZE5nMTRRTGUyVTVqbmNmSTd1Umg5U0hVdUlTZlFLZk9NeGs2MWlrdHFoRTdkWjFwREVkU01Nb1RVa2phZHVHdS92dzZJT2V0L0V4UEJvaFFJN3hxakprOStFSERnem93NldZUmx5cTBKU2lIL2dYekFHRFFSbXA4UkZRQkp3RElPRTJlNUdUYWdSam1hNW9rQnpnSG1XZmpwNVJJRGx0WG0vU2cwdlg3bjlpVGY0MGg4M1kwYmR4U2NOV1I2Ly9xeGRXdkxHMHR1YU9iWkV2M3YxNUZOL3AzckdwNTQ3VnV4eVBrUlZycXU5WXYxNDkvRnJkd1pwRmo0NUlmUG5lRTVGL2ZBWTk5Z0k2RmVFWWFJOEpYUXFOc3MyWDYrVkg1TDN5NjdJd2padG0rakhQMlFCYlNCWTVuU0FaT1IyU1paUHBEWTUzY0J6UG1SQ1JUYnlPZTRtOEJBRSt3VHRERXVKNXlJTGVrUGcrVXZ1aUlFaWhoS1FDcVE4WGhVeTZVSEtnUU5mdEw5UnRzeENxY1NhVG93QVJoYWlFSTRmTmZYZ3I0OXpYRmNDOXJLeExBTDNQRktadllPQXZGMXVEbEdQQjRLWVJXVHdBejJLeEFPOWdkajJLVE5HUER0cUNwcjdvT3lGamZwQkxIaDdrK0lTRTRpejRsQU5uSVUvSUlZZU1RYmw3WmxBT3BRWGxaQjljaHdleldBNllKZ3B4dmpVL0xtRGxySmhzNzE5UGZ2cWpWMS90alJUaVJVOXhSNzZiOGxSa0Y2akdnLzFMQVRUVUR2dUZwMEdYdndvbFRQV3VUTmlTc04zK2pQMFg4cnZ5SCtMMUJydmJuT25sRExsQ3J2RVlxQ3NIMEZQc1Vwek5ibi9EYkhHWTdRNnp4UVQ0QzluTlVtSmN5THpUVE14bVN5Z094OFg1YktDbUwxcDQvRGJGSmlodktNQW4ra3pXUlVxTHNsYTVUK0VWd0tHYjRkQ05rVnR4RS9jMjFYWWNGeUlMZmhCUVBQcWcrZkIvd21QU3RYaThpa2c2ZlFFT3gxMEFSRlpZNFlDSjdQd20vWWdzQVppTG1GWXpoY1p0RlVPQkNXaTArK1A4SENBU3hUbDBZTW5UNXI0Y3Q2UHhqdDU5VzIvZW1ySDNYdkorLzRzejF0OS9BdXM3NzduMHEzN2NyV3k1KzlRVGp4eWNNYzVKL3V2NXlMS0ZrY3UvZWUzK2crZm9yRllHM0l3RGZVNUFtZWhnS0gycEIwL1VoZUltZWlhcUMyeHoxS1ZjamE1R3Y4UldvM2JxdTN3YjlCdDk3K3JmY1ZwMW9OQzk2V3BBOVZQTnRtWWtoa3d6VFFTZ0ZJL2ZYa1I1QjBwc0VCTGpoZVJFaHdtRHBvYmkwT0hVRG9YeFRzRklVUlNpYk11V0tMTVNjVEFralhNdGNyVzQxcnA0Vng5Sk9aUVZtODB1REhBcXBycE1aWE1xTGd5d2hhcXNMaTJkelY2aWptcW9qZHEzUURLeUtrVlVYN0ZqQ05lNEs0ZmMyWk9YemhzL2R6RVpmN3l1dDMvNTJmVi9pcHovNlYxZjdQdXd2MmpHdmRQYmR6OXgyNnBuK2RubUpibGx1ZGYvOVkvVmxaRi8vbmJMaGR2eFZMd2E3LzM1bnBQZmZWanhiSG5mWXcvdjMwL25sQ3JRV3Fmd0RPaHNhOGg4eW9SNStDTjYzZ0FhU2MxOUxzRzhRVFoxY0J5aHc1N0JERHhIdkJaOWgrRXZhQVplaEJjUmJoeGNXdkJhbUdBOTVoaEt3SldxYUNzdXUzUmh1bktaem5ZS0RKN2EvcUExcUJsNmlvWkNmNXlJT0ZFWEdHV3pGVlZ4aDdkR0xrd2RaVG5LM2ZIM3UvaHY5MjE5TUdLTFhPbjd3ejc4Rlg3dFVlclJ6UVlwZTBES0xoUkF1ZWpqVUZHaEV3OXpUblpPVHZ0TS9qSlhNT1RpTldnTlhzMTM2dHVNN1hLWGFaWHJiclFGYitVMzZ0Y1oxOHNiVGZlNDNySythcmNsZzdnUCtsUXZ2YWhxRHIwTVY5TW9CaEtIcVRKS2RDTTVQbkhFemhGNGhNMmZLQW9aaVRaVFlzY3JCbXpvSTNVaEphdkRFbElCQUJhTUxJcUZXUHJ3L1VmeTNCMDk0T25CODRNcEhYR0RYazFjS0k3RWJSczU2TldBOWFac3VXckdiY0dLbkFzeGF4U0Rnd2FKOWpiVWh0UFNDZ3RpczkyQXVVYVFZbmNNUWNOUWFPQWxyWTJmdlhMaXE2Vk5tKzZKWEg3Ly9jamwreGR2WEZxLzRhN2F1czFqSm0rYnZXN1B2anZXUHNQRkQzdDR5YzRQUHQ1Wis5Q3c3Rk9iajBjUnhpZnUrem1lVTcvK3prWFZtOVovRnkzYk51UHA3anVlM1JQekZqM000OGhFUHdzVmpQRk9jNFlDdHpodkR0UnlqYzRtYjExZ2xYZE40bGJ2M1ltUE9QZDZqM3UvY242bVhsYnQxemtmYys1emNtT0cxWWdrblpxdkFQRFc3VmRGTlNOeGhua1J0VlUrMENrQnZ6MVRVN05lYXFHU2p1RWdNb0tXV2I5bm5iS3A3dlZTMWJNT3N0WWFzaExydHF6WHZqOUJYaGhxakFaVURGVzA0Wmp0dVo0VUZxUlQ1WUlyQXQ3YXJNeUpUTU9NZzNHTXRhMzduS3VyWnErWk9RcVBlcW5weUhkWTkrcDlGMjViOVY5UFBQOEJlZk9wemhVSDk2NWVzd3ZQVmxZMVQxdjdYcXZzbnJjVTY5LzdHQ3VQUkQ2Si9DM3llZVRRQzY5d0JUODVjdXJSclZURENEb0thcmFSVDJNUnllaVF5Z3RJMUJtSVdNeHp4Vmprd1hmUFFlTVFvVDdrTG4wc0xtaWoybkpCWWRGQWtHSEREaTQ4QjhkUmNPTzU4dE9udjNzRzNIbUNGb0QyeXNMYklKOWt0RDZVQTVLSUo2dTlxK1BKWW04NG5peVZxOHhrQWJpRlpKUjVvcG5FZS9RNkhpbnBWaXN5RFhQZ1JPRDgvbERBbit3dlRwS1NpcE9UMVdLL1B4SGRtdGdzM2VwYWtxTGNxb0x6dHlSdzh3TE5paW1YS1pPTGFjRFN6d0tXeThXTXkrZXR6UGVvZ0ErcXFNQ0EyYUpSUlpUTlZ6ME9uaUxZVEhSMEFQZzluT2djbWZMUzZOM0xPeDV4SC9YODg4M2ZZN1RnenZtanZLVHZORzVJc1MwcEd6TTI2Nm5GWXhvZTM3YkRlZnFEcjU2dWZLSnorcFRLeHNoRGRNVFJmb2p2eXNITDBDRXpUZ3hWNXlpNVNwMiszbENwYk9hMkthOExyNG9ubEl1S1VTK1U0M2xrcGxKdjdGSCtMdi9kOUhlemdaZDVFMi9takpKQjRIbHc0dlNpVGljRHJSZGxIVVNOcWs1MlFBTGhPSldYSFpERGtDZ0kra1NSRS90SWE4aUE5UEtYSVlJSk9ZYU5vRERHa0UxV1VWakh6WnJKbitFLzVybHRQT2I3TUE0Wlo4b25kQi9MM0RZWnkvUmVzZWpPNk1oYVhiZU82SDVrZWZmM21uZzljTUNmRzBUczlTZ0FXdmU0WXUrRmNlY1pkeTlzRWtaa3dkUzVhWVE3SytZWGc5VU1ibEpPblRLZk9yVkowSzdBOHFrOXh0bFRleElobk8vbExaeGVkd3g4ZWhUOUYwVjhPVzV2cXdqZ2ZCemcvSnpkejZXbGl6cU81UCtHelAvd3VmNmY3SG9mLzllTzBtUmZ2bkRzMjFKOFBES1JMTURiank2LzUyN0E2SFpBMUpmQVh5dWJTOWVGWnZKOGFXQmVvRGJRWVZodkVCdThYVUtyb2NONHAzQ25VVXgzR2poM2VtYWlNOEZnc05zU016T0hEYU03Z3NDbHBNUkVLOUs3MDhRNXFXbXlOenNoVVdVeFVrWFcySVVNVEN6V3ZseDJZU0FnZ0FPUUJNQXFEdVpZZzlTajFSeGFRRlMrMVQvRVl6V1RBUGJuYWVGQVdnQWNyandOYWtCdkoybDczdXlvcmR0dzM4M2RQOThhK1JHK2J0M29LVk5MNzNnczhnZmNkR3ZhaEFWajVqeTROYkpQT0ZaK05IenIwL25weDd2ckRsU081R1pabmJWbGsxdUdYZG1wazBjdkxaMjFjaVNkRld1am53dkxRSzhTVUYrb3Nwb3NTUUQ5ekROVm8xYlVtZENOMWlkc1E0OEl6M0ZQbVk1eXZhYlhUR2ZSK1lTL0oxak50Z1JyUWdLWEtXWllNMzFxMGlUVFBNZk5jZk04OWNMU2hOdHNkOXNlNFhhWUgvSHR3YnZKSHV2dnpIYmtRRjdGb1hoNWNHQS9PcGdSeE5TMnBXY0VGUXZDZkx3OVVlYmlFM21Ea21hWmd0SlVqTEUzeVpXbTZySGVrMWk5VUp0ZnkramtXbEUyNEZob2VwaVZWVUhEWmR5T1hTSWZTRTRCN3RoU1FBVmR1alNxa0NUT1lhTTJqdTg5ZVYza0Y1OWVpUHorSi92eGhKTi94TmxqWDhrLythTzlueXhzK216amszOG1aT1EzVjM2T20zLzdLWjU3NE55YnczYys4RVRrbS90ZmlueTU1VGhZbmNkQUJ4Y0FSaXpBbi9XaE5EVUpUOUJyZ3JjcWlSYWtoNDdDYk9sTlNsQmljays4S25kcVNnYUZQakozd3NyUUtDNWVweGYxZ3A3WDg2TEg3WFVUMFNqSmtrbml4RGludzJsM2NtSTg1L0pqbXhsT2JyM1BqNTJTMVkreXNtQ3NtZkJaaHhsSVhFNlhFeHduQWhCSjllZkZRa2J3cXZ5UDRYOC90K0QyOHM2TzZhdnVQNzBoY2dBSDczOXFaRW5aUTQzVDkwWGVFbzdGSlV4YkhEbHo2cGxJWkc5VjNyNVJJMHUrZlBxemYyWW1VaFEwQVFxT0FncFMwWHVoa25oSGZCeXBUTWUzNnUzWXhxV2tJTC9OUlZJUmpCcUxya1F6QjY2Q0FlTzA5TlFVRld3SVVkTXJ3VTlxNzA3SDZRbHBxb1FsVDFyMUxRTnlLMU1xZ0JsbGdIZnFDc1pjZ1p4aWRxdkZjMEhxSXdGekp2S0JlSi9YNS9GeG9weW1wTWFsSmFYcFUvbTBRS3JibE9CSFRvdmRENWtkZGxVSGQ4bENxaC83ak1BbGh4Vk9pUWEvSDZWd2NFSTBQQUZ1Z2ZWbXNRejdVTDRCVGdwVHJkZmd4T25TalNBQUZJaXZBU284UUtYSXlrMGpUZmRGenU1OEwvSjQ3eUU4OHcrUFkveEEybjcvNGlNdEcwNHU5NC9laE1uOXQxKzhub3g3SHZlZmErODRpbTk5NzEzYzBWdlg5K1BjMXU2eW05YlAyUHo0cWNpL3VxdUtzSlZ5ZFRlZ0p4blFZMFQxTk9JQzBOdmpDbmd1MFNEdGxNNUtSQklJTWVvQkRxcE9KMVowbTdDSkdEVVlVUVdKZzd5b1FsWk5XQVZudmRMVWF1TEhscnV6S3RvZzBHUHdxcmhjekVJOXdCYzRWd3hqT0F1Q01xc2ZqZ0NjZDU4azM1NDgyUzhLeC9xZkpndStMU1dIK3N1ZzhsZWdhK3VnVnh6NjhXRk1rSjdRbFp4RG82OWpLenFIOGd1MDYvQmM3Wm94VExzR1VyVnJRcUoyZFh1MUZhQWNrMUtnQ3R1RS9RSmdBV2FYKzlCTzFJUDRIQWlsWnFLUDBVVWsyRlJJM0FiTlBjRy9XODZVQTZMTGc5MHd0MVNVdDdVWDkxY015SW1HclNOejZRaGVPVW50TmZRVmJMUXdpM0lRYndpTjVKS0xnbnJEbUhTcFVCd2xUWkp1NWpaeXYrZDB5NlQzdWZjbExrUFl5bThSbnVXLzBnc1Nqd3Y1ZDNsaW9JNnV3ZVl2NEZSNkF1TnpTQTdhYU9vaHVOZkhyank5SnJEcmlVTTJKMDMvS0hTZEIxcEtUYjFPYi9CNHJnT0VHQ1NEWGhJNG5sY0Z5UUVCdWtFUFFoTmhHaFVsQ1FtRXgwUm4xQ085eEJFalJoREZqd2xaY2dXOFUrZ1JUZ2puQkY2WW9xZHB4bHdkVm1HQzdORnh1ajZ5TVdRMHFzeG95R1Azc05rUy9MbTJDOVFub3ZBdHBxSXRMcVlIYUF5ZEtlbmFFVnpkTEpiWDZaVmlmVEhNakc2WUdlTmhaanlLK09oN284dVpZV1FmR3NOYkRja3drbXhQa0tkSGNud1FaUGJSRVNlUXpxQklCMnEwQmZYSmppQWZjZ1Rwd0ErbkFoa1h6THI2S2FjcWhkdmFLMUFiQ0lvS0Ivc3gvT21zMjArUzk3Q3Vmd2U1STRyNkwxOEVsQTBqdis5LzRidUh5V2RmUlhpa1NZL1BCT2tKS0Q4a1l3TElGNUJlcGY0RGVTWmsxaEV1WmpURklVYnpzd3JOWm1wQThNZEJLNzhGTVB4OUgyUjhHQ
              // 0hSQXZVcHVDdTBGaEdMM2tIaTlmd3llYVA4SzVrenlKUGx5Ulp1R0o5cXlqYlA1MjdobDVsV21EZVo5RVlpNklPbVVlWVpaQ29Ib2JLK3pIU0RXWHFZN09DMjY3YnI5M0RQNkVRYnNaak51UUlCd1JLOWJETGxDbm9nOWZJc3l5d2NBa2RJVDE4Tk1wcE1ack9DOUFaU2FldTJFZHN4c2dlWjhNaURncXJ2d3lORGtteVExSkM4MW9pTng4Zzg4TmlNOElUMGdmdGtnUEJKdGJRcVdPa2o4MTVVaFVxaFcrQ0VQckxua0pYcXM0Y3VqbGNVdTJIb3pFTUMyanQ0Yzc0Qy9DVkFnRExrNndVdmlxSmgweHJtTjhGbFpDNjY2aUM5ak9Ub0ZhU1B2Z3NlNUx2TVA1cmFJOE96REFZUlUvUmZCOHdTVFkydEFyMXp4QjgwWi92WlN0Q1JvcUE1cjRpUmg0ZERhbXkxSjZzY1BDeVFQcHQ4c05NMXFnajd3YjdnQUxZK2pGUHdMYmxPVHlHRXhjSkxrWG43SS9PRlkxZitkditOTTMvQ2ZmZHRLZi9tbFVMKzNCV1ZZZ0hDV2lFSlpHZEFYeDJ3R2FubEtBUURwNmRlcUU0UGlxUUhwNW5URzNoQ0REbzl6Nm1pS0ZTb1Jxd2FaeG9yamEzR2JxTmcxQnRVelRUS1VKSUJSeHFyR1pRc1pnL2JMZzBhUkJzTk5jR1Q1RWRvRE1KVUczcjFvZElnbUlFVFIwcUQrbENlUnVZRmRhQWkxRE01NGdFeVR5TnBhb0NSSVdNZ3FETTc0TERUKzB0SDdFQW1hR1FDa0hHVS9OZUJRWjJKYVIrYmlNb0J3cGdhWTJ4OTlEV09ISHZ0dXdpd1p4Mi9GbGpUZmFWYjh5LzRmdUNLQ2JuUnphSENzSFdwZzB4VnBqcHVVVzV4OEVZNUVZQ0pYRzdxYnlDOUxVM3ZWYjBZL3J4dVUweHpQRVBkekxZS2NEUzF4UWR0anIzcVY3b1N3UjBpZnI4VjZFRnZnUXg3b0t6eGdmSy9SbDZQYk1hM0hYK3NZdHJJOVpHN2hHTm1XL2hJMDB1Ui92N25PYngxN2NJNzQwelEwMTBnUDNBcG9aL0plRnJJWWpPYXNXMlViMEZTcmI0cGliZjFSZjk4eU9ZdGdPdkZROG5wQlZaNm41QmVvTVN1bHRnVm5yOTNLQ0ZOZXc3NWxkaVZQZzkxQUpGcW51S2JvczQyTHZRMStkb05LOHdyTFJ1a3paYUhUSHN0ZlpZdnpKOWJGTE1zcTFhTHcycTFXQzJ5d1JaUC9GNm5KRUpzYTVJRnQ4SGdkSGs5aVM0WDhpY3pucm5kRm90Wm41aG1mbFNzVUZOYVU3cFR1SlJrZDR4M0FXcDFxWmRDZHloZ052V2NkMU4vamVwWWpJV1FERzQ2Vzc3WFZ1L3BPaDlsNnFCMTFGWktKWDNJRXJRb1k2eTJNVlRxdUkwcGx4bkE0L1VFclFBdkd4em1rQytvZ0tsVmtwUGdHTVJMK1JDM0h4dzdlNEFiUVVBNkFTWXB0dHpoMzBXMm5IcHIxUnR2bDJYTW5SYTlkSEp1ODgzRC9WUC9oSGR0MkQ3OW9TY2p1Y0t4R2I5YStlaTdDYWtwMDdzaWJYamsrcTJqamJyK0xpNi9hT1drZXJiYnN6RDZPZjhYOE81eVVTVDBhRFZYelhkd25UeWZtbDdJQlgwVHVNbTZhUWtsU1JOVFN0Tm5jK1c2aFFrM1o5eGxOMmVZMGxKSUNwZWVPc3BTRUppWVdwS3pRSjBYbUp2YWFGeGlXbXF1ZFlUZEs0MnJUS3NzYTVTdWxJN1VqZHdXNDEybUxaWjdsQTBwZDZZK1lOcHUyUjZYbUpwaU5oa0ZQM2pMOFhxZHlITkV4S2tweVpBbUNvbnh3KzhERkY5d291RUtWdkZNWElsYjhUWXM0ajdjRTBvZG5wam81SVRFNFliNE5POFVReG9haG9kNTgveHBOcHhtbTBNRjV4azU2RjZlaDdEeW1zaUFiaFBBY1lsdUU0RE1hRUNwQlZoc1lhVE5YcFJJOHZOaS9uSktPbHQyWXZzRXNaZ2h6dUZ5OGk0bURSRTh4YlNGTDVvVy9XcE55N096Wnk0Y0cybThxYUh1OXIvOStNbC9ieFNPV2ZidDdka1ZISTNmbjkrOWF1T1ZuNzRXK2ZzTy9IdWwrWjZiYitpWVdGSVhjRlZsRlQwWmJ2bDVUY05iNjh4MzM3dnVsaG41K1VzenhoNWUxbldtby9OTEdFTXU2UDB4RnR2UENKa0VrZ2pzUWV4RkdrTWY2VGlrYWlIMmk2S0tTUTVkYmNQNE1OWWNRM2lxUDdKRDAza0tYYVgvZk1WbkN0dFpIVGV3alZ2b2ovTmJpVDJTd0crSnhBdW1mZnUrL1R0RndTN3c4YWszNmtCdElTbk5NcCtmcjM5ZHp6dXBRWFdDUVMzZ3grcEwrU242WlphbmhTOHNPaGtSSzEwVzlZa0dSeHFwVUoxWWRjNTBra3BucTdQYnlUbE56Tk9uWlExUVZxcUlvNVlZWkpKVlFWMytpalptaVM2TVl5WUl0QVRuV3gxRWM3N0JIbXBMZVZhKzhtUk41TW83djQ1ODIzcHkwcjQxN3g0UmpuMTM0TVBJZDAvZWkwMWZjak8rTy9qSzRjVW5zWVAyWFFUclV3cDlsM0hCRVhBQk9YNHN1SEdmSDdLNXFMdjJlY2dNQk8rQkUwZFBCbXBsM016RGV5OVVDZ1NmQVNkYkdqOU1ueW5sbVBsNlhDL1dHejhTZVlIbk9GR3ZNNGlpUWVRTXFtUjBTSkpSNUVRRFJEWFlRUWdXWmFPSVFUVFkyRWM4SVlNa0dUZ0NnakwzRVhmSUlCdG1oYVJ1Y09QNzhPR1F5V2lVVmNUTm1rSHVJd1RtL2NNSE1aV1crNGpKZk5KZkNZWW02ektWRndCVXUzeEc1UVVUKzZWaXRqMW9vMXMwZXJBdUFwM1RLYkdKcm9Bb2NKcmE0NExwMjBmWFB2U3lRZWFQUlM4aExucUpMZmVWVTJCalpvTU16Tk9EQS96WWp3NTRxSGtwSHpSVGZpdk8xMlp1bUkvSTJQNDN2OGIrbVNVMzNJcDlmKzUva1RSeFpaSFMxYXM3dHVIOTN4M3EveEh3Ty9xblNBT0E1eS9ndEh2QmN4dUhpRmRBSG43Q2VMYTFDNTNQS2Jzd01wY0RvQ1h4ZXlNTmQ5eEJWLyttUkwvZ2ZmejFLQU1WNFlUUXZRYVRJZE5qOG1ZT00yVm1ndjhWVnhRL0puTnlab1dwSW5PSnFTR3pNbmVMYWVPd1I1dy84ZTQxeFQzdGVUYmppT2VsakZPZU14bS9qZnN3UXovUmlaTmNTZTZzN015Q0lCL01uc3pmbUQxUFg1NVZxMi9JV2ladmtsK1gvMjM2ZDVhMXFNQ01lU1VucGNDVjUzZTRGdzFyR1VhRytYTE00OHozbVI4M1I4M0M0K2I5NW0vTW5ObnM0MXg5NU5tUTAvMmd3K2ZUb1pKMEtjL0hHWWRWS1ZVbzFaL1NSMjRKS2VraHVsR3BwdVdtN1U4VDBrWUdLYktURWdNRnVjRVRRYkl6aUlPdVZIZHlUc29yNGhtUkpJbmpSQ0tPSEUzWFllbEtZVVZiRm9UNmw0cjdQLzJVWXY3OHdLWWxQRzNUd3R5QmZVdTZaUW11VkNxMUxzejJGTEZ2WVVHNnRvUjRQV0hHeUJrWDUzQzZBbWtjWFV2VVZtb2hFMWRjYzNUSi91T1RPbTRzWFBwQkhjNHYyYngyWlVLUHUvbnNYWnVmbmFrWVhNbkhmYTdGcDFvVzVqVTExRCtSbG5EbjNOTG5Oa3hmTjkxaE5ubFRVcVhtNGRlVnQ3bmI3cDRhcXBveVlzWEZLeHV1RzQwL3pQQXBHV1U1TjFiZU11TzY1U0RCalNCQjZxUFJOeWJlRFQyUEJkbVNJaFFLSllJd0xxa25pU1FsSmZ2eWZUZjRXcE8ySllsajdNWE9ZdTgwNXpSdmhiN0NOTjlTNGJ6VnUwVGZhS3EzTkR1YnZTZVMzcGMvY0gzZytiUDlhOWZYbms4U3ppVkZrenlxa0dQSmNlUUs0eXdoWVpwbHBsQXJmSkR3RC81YlJWYml6THhJVUx4UDFHRXB6bWMydWxQT0dyRmlESUhyMTIza2paM2dSS0Y4THBXUUV4am1pWjI0QjEvRWZCSWVoMmRnRG5zU0p4WEZ0bUhhNlVyREpUb0R0REh6QTM5c2tVMVRrN1oyMU9ZUGdQMEJrdy8ra0lJQ3lla2NXUHlyMndyRG4rbHRQN0I0ZjFzbzhyZVhqeThsQlhQdlgvYjhVMTNMbm9mWTVoLzN6Ymp2alk3SU41RjNmNHEzdnpMMzd0TnZubjMxTkZpbW1kRXZ1QXVBZWk4NkhacGtrSEdTYjRKOWdtdTJmYmFyMGw3cCtnbjVDZmVJYWJleTJ5dnJUUjVwQ1duZ2xnaGRjcXVwMi9TMGZOaHdSRG9zeTA2SVh6NGhuRGw1a2FYRnN0YkNXVEFGNitSY0ZrRlhvbGFJblhlaWN4QkpHNURGWW9TSncrWXo2dHcrM3VpellFdUtPVGtlZXBGaXpFb0NnNE14bnV5TFN6bWp3MG02Y1RxaUd4bGZjSXJORlcxMDA2QTk5a3JVVVZEd0U2UExMN1JmdXRBK3NDSmpEZVlvTUhWV25CK1lLckZMMjVncllLK2dETTZQbEZsYzhZR0ViMTc0SVBMUDlpL3YydmZIcFAyZXRRczJQN3Q3L1pKNzhRYlhpMmR3QXBhZXgyVGQvbDN4U3h0LzhmYTdKKzhBWkpVQ2x6Nk9yYlcrRzNwT0lyd3AxVlJnbW1nU0NoMkZ2cHZKSEdtV1k3YXZqdFFJWVVPMW85SjNJdWtkNFhmMkR6MmYyajkxZk9QNmkrZFRoaUJuVWxLV2w4SnVxcGRpVURlQ3BKaEdPTWVRUXROVVVtSXFkVXoyM1N6Tk05V1pQaFUvZDM2TEw1a1ZITWVaallvRmtHWFVXUkZBaXpPNjh6Rkt0VnBTRmVXc0ZTdldrTFhTMm0zbHJaMjJsRmQwWjNRZjY2STZudkp1Qm9Ub25zU0NtVEZnbGRIUW5MMjNWSHlleld2MHVBb3RxdFQrUXFyVW9OVWF3MmlnUEhUN2FuVDQxTnJmZFMxNTU4N0s3VG1IK3RYbnU1WTl0ZWUyRmJzMlByYjF5cE9QWTI3TFRlT0orZHRTWW52cmpaKy8rc0ZicDRCblUwRWJFd0ZaY2NDemowSTFTY2dYUitaeUZVS0ZZYTR4ekMwVldneGhvMTZCWUZnaDZiYjNoVzhkbDcyNmtiWXhucEcrOGJZeTczamZUYmFGbmxtK0tsdVR0OHEzUWx3UmQ1bGNkaXZJaVMwbWwydW1rMDdrbk5ObjJhYnNWSWlpOFBFK1NZY284QXo0UVR1QXl4VXlzZGs5UGJPZ3g0Uk4zaVM2UEpLYVZrQ3ZvUVJxR1pOd2tqTmZTZEdGVWpJTGhyQXNwb3RaWmYzbklTU0JlYTh0aS9rQy9iR3RxdUwrdHVMWWJvOFduK0MyOWdHd0tTZy9EMWtkT2o5ekVMQ2Y3UldMM0szSHN2OTY5TXZJTjlqeHg5OWhNLzd1QytuZ2h1cXQvUitRbStUUjgrNWF2UmZQY3ozWmk1UEFGc2c0SS9KUjVOK0t1djlZUFg1dzQ0VDZwNm4zWUlmcHFSdjhYeGM2RkVwMEdMREZrK1BKOVlROHJaNmZ5SSthOXByMFhsT0dxY2R6d3NONzZPZ3l2RWtGQ1hvVEoxdDhFbzRqV1E0N3o0bElldHlCSFZGN2lIZWw4b2dqRDJBV2l4NGFPYnFBeGFTU0w2bGdHN1QxcE50ekhCOURmblFaUzRoTyt4QXMwR2xlS1FaZjlVS0ZOdTNUTjRPQ1ZtM2QwNkZZUllOTzFNT1Vva0JBZzZ5aUpSNURHSm01YmgzT0FtQzFRL3hZbUUvM21nQlhvSWRVRGVQb214Y0hIMy9jN3IxejJiU0Y4YVB6WmswOGM0WjdaR3ZiMG9MU20yMC9sVW9yRjIvOXJoWXdkRVBrSnU0cndCRGQxYndZcWpRYUJVZTJNZFV4elZqaUVBMEpub1JzWTVvak94QTBqbkpNTVpZNjV1bm1HK3VOMzByL2lET1BDR1NuWHgrNFBuMWErcmJzbmRtNlVmNVJ3OFpsbHhwTC9TWEQ1dmpuREd2UVZmdXJoMVZtZDJkL2tQNkYvNitCYjlLdExxY1kxMGNPOUdiNDdEcG13UlFWM0Z4cXY3clJDWFFXVVhTdENZMFhmRDZMVkpMc2t5Vm5YSDVxdnBUcWRwOTFZY1VWY2xXNnVsMjhxOU9DVTFGeVVzb3Jsak9XankxUkM1OWtHV2VaQVZiUms1WGQ2YWNLbVRXZEtlUWw2dXkzVVFmNE1uMHY0M3hzTi9TODVuTzJnUlZ6MFlWeU5uZW1hOXVnVkROZGhlQi9zdmwzNk81eTdYNWozb1RPTlp2ZFpyeXM1dzhYbTM5enovRlZUNGYvc1BOblgrMTRlczNxUGZ0V3JkZ3ozM3RUYWw3TmdxS2V1M0h4aHc5anZQWGg3dStXL092TWl1ZTR6TitjZU9XdFg3ejZDNUQrSm9TNEw1aVBmZUFvY3RMWGRlSmNCYWw4SVZmQ0hUUHg3TDJxRkplbndLVzN5bFlISjJCazhRazZoMUdTVXcyaC9GRUZVUU0rWWNDRzZjd3BkeFdNS3VoeFhuU1NWdWRPWjQ4ejZ1U2R4SkVhV3h5R3pCZnBlNzBxY1BZYzR0SDB1RWt6M2JFWDd0aGFTTllsN2IzQ1ltME9wQzRtZzV0Wk5PdFN6YUljajAxNkFCcWlDeGJyVUZhRnRuU3N2VFJsRFZnWlY4UTQ2NmJlMjA4c2UyRnFiOWZTbWZjVXd6VDR0d2NxZGovYXY0anMyblRiN0h2WDlMOEVHTnNNS2xiTTFwTjFhRTJvWW9aaG0yR25vY2R3d3ZDeDRhSkJod3hKaGxaRHQrSHhXTkk1UTlRZ0pSbGdydEx4aEFPLyszYnc3Z1dSbDBSZHFvRDR4L21kZkE5L2dqL0hpeWY0aXp4QnZNcWZoVHVlbjY0ZkdHRjdNWHZEQ1VhbTdSaHFyeFJVdExleHJXTVl4ZWJlM2w3K0wyZk9YSW5qMDY1OFFDMEE5Skg3RjF0SGZpdmsxWW56eEFVR3ptTDZ1M0JaNU9aeXl5VmlFMVU3Q3hndUhyS2wwd0RpWWk5Y2JRSkw4TE9FMEhwSUVYa0lHc1Fpd3lSZVNCV0hTL09sNVZ5WDlBSDNpYWg3V3NRQk1VMlhxZytLb3czalRETk01WHk1T0Y5WGJsakRyeFIyR0Y0VmY4dS9LNTRYdjlUOVUveTNQczRtU1FMSDhZUXVMUnYwY0dQUTYxTzFCV1VPSW5OdGtWa0M3dkI2VExTZkorcU5SaVJCV0dnNUtDVHI0UklLcUd5TzkyNEQ4MnhNUlNRVmZDTUV2dm9Na0lsSE52M0pQNmsycGl6MHBSUWFLTGNOUk1xeFJRNll3bHhCdXBiSUQ2d3MweVZtbmFJdjFoZHo3S3k5TGhhU0ROa0pRWU0rSWFHWUxob2ZUS0JyeCs4Y1ZObmxnRC8yVWhoYkkyeERiT0g1S0JLakp3NzYyUkxiUVNlOWZIUlFZU3ZPY0dGM01yc2NNQTZzTWVMWWlyWHRReDdySFU1b3plRW9aaWNvZGZtZ214Yisra0M4bGgxWGxET0hqaTFINTJNY3dEb1FPbjcyeThnUy9NcEhrVjFySVpJOGpuc2l5L3ByU05LcUNIMlQrRTZBUVJGRDZkYWpTQUREWFRSYTI4Z29LTlN1dVNPMWE3SzIwUkZLQmMyMUNFbkM0OExIQWo4RFRoY0ZMa2xvRmJxRnFNQ0Q1a21FMDVTUjFzU1UwZ3RXK25HRVQ0Q3JSb1pvSmorSTI2d3NEYm5NUUxXemtkQVIzTmtiMiswQTZ5R21nYlVPb0ZlUElnTUVyK09OSnJBZTUvbnpoais1UGxXRjN3bVhWZUxTcXdHRE8xNDFjRndnMFNmRytZeEdjSnZGZ05lalNHZFQ4YmJVbmFrazFlWHltbE8zc1ZkYUt3NjdVN2ZGNDNpZ1FoNUU4Z09wK0N6QzFLY2tTWWlpaFVPZWxOUSt2T0tRZjlLQWRRVS91djg4alZNdlZmUlBMd2xQL0F4Y1o3WVpNVTZEa3RVMWRPZk9MRHZzYVE3WkdvOXRwcmdCazhKZTlLV3ZDTElGRmhkN3U0ZlpGVGFCRGJVd3UvS2VYckxzb2FUYjMzanMyVU9CaGRlMy9yaDNmczIwZFdQNHRBZW5MMW84LzlqK0kvM3A1S2VOaThZOHVMdi9JWEp3eFlxWmo5emYvMzdNMW40RzNIS2l0MEoyZ1JQdFpJL1NwM3pDZlc2L3lGMjJpenpWMlpIQXdKVUtmbGc1Nno3bmpycDVWZTh3TzV3Mk1McFlkSm9razFrMnB4aVo1VFZpK0ROT2R6TkJVc3ZydnVnbXJlNmQ3aDczQ1RmdjVraCtuRE5tZkcwL01MNnVBY043cVZpTEJzSDBzalVaNE5pRnE3YlhLVm9Oa2w3U1NaeW9wRmxGY3p5MlNMWVl3K2dtSlNnUHczVGNxRmdZT0lSaG01N28rckJ5MTB4RjZzMWNlbVBITTN6YVEvdExXc3Z5MXZSM2tJM05UZU1mZUt1ZjdsZFBCSjh4SFhoaVFoNzA4MUNGVFNkNTVFbmlqZnA1WXJtK1RtelE2d3VVTWJZeHprSjNpVExWTnRWWjRsNG9MRFRNVWlwc0ZjNVo3aWFoeVZDak5ObWFuRFh1NVRqT0lBcW1XN2c1d2h6cEZybVJDd3RocVZHV1hENWVad1hJT1ZKMGxCWDJsTlNDWEIxR09rV25ndnMzOG1NS05FajNVQWNSYUhNS0NrRVdDalNDUm5xcGM2aTk5ZDZXVlhHNW91THFpKy9VZzJiTEdMT0YyWWJGd21JRER6cHVaMjhGb3RnN2drUG42NG03Ny9ybEg3RHp0ci9jL1hIa3d0R0RtelllUExSaDAwRml4K24zTG92OHFmLzBYKzdBaWRqMDFwdHYvZWFYYjc0QlRXK0tOUEIrNElzTlBLRXpvYWRrWmJoeW5USlY0Y2VwUFNwSlVvZkpnWVM4dUx5RUd4SmExVzJxZm94clRQd1UxNVQ0Y3YwdDhrTFh3dmdsK3FWeWc5TGtXaHAvUW4zYjhhSDdRKy9iaWVjZDV4UFBxVkhWR2VDemxLeTRRbjZNVXNwUFVSWW9ueHIva2hCUmpGWXplTmMwb0JXZEVOQWlzeWZscklRVktTUlZTdDBTTDNWaWV6N0p0NlVpOUI5RDJpUUlhZkYvaW1sWlVHc05EZzFwN1FOSzVveHpzRGU4MHEzY0VGWnQyajNtZ2ZyTlo1ZDBmWHpiZ3Z0R1dKOWV0dUs1WnpvN0RrUWFoSmUzM0hUVDF1akRUMGF1M0QxdFRQOFZidmZwVTIvKzdzMDNmZy84dWpIU3dKMERmaW5JaDM0V2V0aElza2ltZXl5WlNsYks0cmk0Y1o2cG5tMkpPeE9GQW50Qi9MakVpZmFKOFJEd3hsZmJxK01yRTdzVDN4Ri9aL3RNL0ZMK3lxME1JOGx5Vmx5UUZNcVRTYW04Z0RTUTkrVS91RDl4ZnVuNUxQNDdZc0c4eWVHRjJNd3NPaURrUUdhWE9SL1J5TXlDRlV2SVVtbnB0dkNXVHV0L2lNd1NFcS94QlRWSDhGTHhEL21EMnJBMUZzaU9pbmwvMTRSbDJaa1B6WDA1OGszTDI3Zi9zdTJKZnYvekt6cWUzcitzNjhsSUE5R1BuWTVIWU4zT3lKMVAzL3Z0Qkc3ZjZkTy9lTzJkZDErajNzUUdpQ2RlQmU
              // 1WTBaMmhzVGwyclBBNHdCZndFL2paZkMzZnlZc0dxOTZnTjVqc1ZvTUpjWHBzWkRCQWtpRmpteDdyazFVN3RwTms2Ly9XazdOTk9qWG95VUZFZnFrZElrNDJxT0RBNjl4SWVYMlRtZTM3VmJUVFhUbE4vbHBzb0FOYnNlR0o2eHZHM1hMcjlUZmNNUFpXUnlLZnRxdnR4akhQcEU4YVY5bmUvdzd0L3ppSXhnOUEvM1B4KzZIYitHUkg4aGpERk1QRWxIbko0ZVRWaG5zTjYxT2V0aitYZlpJekdWeGV0eXQzYXZhN0xpR2V6Q1ZFeWNPU2U2RitvV0dodE5DNFVGNW9XcUpmWWxnaUxURXVrWmVZZXRONjB5MTBWVDFsMktpVUJWSzVzU2F0SnFNejBKblNuZklqNlZINWdZeUhzaC9NM1MzdGxaOU0zNTF4S08yWGFjNEV1cjFtU3d3dTBLZW55aEx2VmRQaWVPT0lCQzhOSG54Sm5uR2VHWjVGbnYyZU14N1I0a255dEhnKzl2QkpudnM4eFBNU21RdFJNYUl4aGtKM2FCVjhGcndrckdCQ1h5MDY1SEFXc0ZlTUVzM1dBb3hITEV4b1RDQUp2amdkN3h0aFRQSmliNG9uWkhjWGVQcklMUWQxS1ptUTgwVmY4R3dtenZUbTBWSnBFUEZXNXAzSUkrUHl1dk5Jbm9JeFRrRnFpaVg1NDBIbmF1UkFrTnRXQmxISWhmYnB6T2pUT1BkU1ZteEpwUTFDM1N5dzV1MU1jZHZQRDc3dTR0S21nbEQ2OE1RQUJHTnBWc1dtMkJWT1REYXA4Y2lRb1l2SHduQTRKVHJnMW04T3hLUGtnRW5XRDVQaWNVYTZRUkt6K0hpVXBDVFFTVU43eVlXZDJLWmpadGE2ZGRTVGI2T3U4TlVYME5QVDBrZEE3RE9xNkFjN0hmQ2wyNElzR0JwMzBITFhiYXRYRktiKzZOVWRNOGFQenJ4LzlwcVhGMWg3NUk2RzFVdWN6cHo0OWE4OE5LL2gxVFZuM3NmWCtaYTJoeWRlRjNDbjVrMWVOMzNTeW95a3JCdHZxM1BQV2ppcktPQkxzRXNwK2VOWEwxencrTTNQVTZTbFJQOUdNb1VkRUhsM0gwVVNmWTBralRyVEowTGpnZWoyUUJRZ215VE1JYWRpeUxKSVlDbzVvMFZKUnNuWVpFdVZjVlNuTHpHVVZPcGFkZDI2YlRvZXdSeXpVOWVqTzZFN3F4TjF4OGdTNU1hakR0UnF5c0orWUFhUnozbHFCUzdRdlJCcUJhejUrY3JyMm81ZHFrdGJuNkhSdExXSS9YYUI3VU1ReFR1dGVIRmo5dnIxaHc0ZnRtZGxKTzU2WExrKy9BU3Azb3AxalpGN3R2Yi9xQ3piUzhkeUoyak5PZmEvTkY0K2lyeDBiUVE4UktMYW5YVDc4bUpvbU0xUmtHWEhLWHE3VThaMnB4RVUzZ3JEUWZuT1ZMZUx1Umd1Zk1LRlhkTzlUTzJwaStHOTZDV3QzcDNlSG0vVXkzc2hCaHcwQ1BTM1k2cmhMRVJMdkdHNlp6QzB1ekRnWFlCbFlPdWJ4Y0hZUytZQUtTK3ZtRTBXRXhHMWQ4ekF4K0RsZUdUU1crTVI5VEF5TTllQlJhU2JBZHBDVlhvYTI0cHhNWmlNb2pRM2J2WHZibjF5aG1Mc05WcWJiN3JwM3JHOWovYmUyRFNqc0lNODBIL29ucEdUYnBwOTMyWVNoSUFLMDEvQWNGOEFMeVI4NjR1RkVNWW1XNE1TMVdhVE5XZ0E5NnBBVDAra0wvclZJYmppMkZXaSt6R0dSSDhCeW9BVDNIMFJNb0Mzalp4d2dyc1BRb2N6UmhRZ0ZVNFdlUmpLTUtSSlFWUW8zWWdtU2ZQd1BGS3VuMitveGJXa1FkOWdXSUdXNCtWa3BYNkZZYm0wQ1c4aUc3bTdkSnYxV3d3L1JROGI3cGVlUjA5SUw2TVhkUWVrMTlFdnBRL1E3NlN2MFNmU0ZYUkp5cGFRSUxtUlU4cEFhVktSTkFOQlpDT0ViTTRDSVFTT29nUkJWcXBCY2hnTUV1SUl4RlBJZ1RFVWtCQjkzNGR1Qitra0E0ZXdrQ05qT1ZrZkNvVWdyaVdHUGh4L09BUmhBUkdBQ2hsVUVzTEp4cTkrUzBWMndldnByK2l2OExvdm5LK0l2ZUE4R0h4Wmd6OTRpNE8rYUhOMWI1bHRML3R4dnAxdTNOZ2h5bmtoMHZpejg2bEo3cXl2ajBhYStiVCs5WFV0YzVhUnpWcUVTM2ZJWGdTSjJNaUJrR0p4NEV4K21FU21XRyt4M212bHJCU2ZoaVIvZ2VKTDBLTGIwTDZrbEFKZWxBMTJNZDdnc1FrODRrV2p3V2pXMnhSazV4dzZuejdlbUFET1c2b3VVNTlsTGtDRnVqSDZzZWFKM0NReHBDdlRUelZPc0V5eVRySGRZcGxsVzZxcjBkZlpWb3FyZEozNm8rSXh5eEhiUDhRcmhneWpOUU5sbU5MTkdaWjBXNDVqTkNxeUxkZHYxRC9NUFNRL2cvZVFQY2FuNWNQb2lIak0vQ3VJaXQ4M2ZNRi9ZZm5jZGtuODF1Q3pjWUlBRU5ZSkJrblNHMlZaVXF4VzBLK3Bod1JrVS91aWswTzFrc1dzL3NLcTA2czZxODJXSmVnZ1ZOYVpKVmxPTlprZEpwTlpiN1ZZc2lTOUE0b2pZVkNLaUdDZGpkZGJyTExaSkZrbG5yT1paRm12MSttb1dHMFcrcDZGNUxpc21EQjkwYTdieEpuNjhETWhTWjBoNFJacExkM2pJM05EaGhsVzNHSmRhNlVibzNORFJrWEFsU3dlNUVEd3p4ekdsKzJYYTltMDRDbTdWRkhoQnJNUGZ4UUFGZTdQQnFVKzhCYVA5cHRBaGdnck8yOHFHd3FHYXkrQWhFMW1DTXpOU2pFOUtFMlBxVDFKcytmM21sUlpKY2VqNXhDR3d4dzkyNHR5TGFxdEwzcHU4RWNXNVZON0NtWkRTSzZQbmoyZ283OFRnQVQvN0trOStXd3ZRQjg5ZDBDbmFxbTIyRXRFOU9XRnMwY3NLcTFiM3hjOWUxQ1hTMnM4aUVhVFkxcExnNVVQbG5PeGN0Ym91VU9TeXF0STI1M0VzVGNoM2psaUM2SnNPT2lDZ1oxdFRtb1JNSHV2aUlLY1lkenVva0FQY09rY25ocDU2ZGplY1h6KzNxT1BGMTUzWkgrazk2Vzl3MzRQb1AvSmVlc2JwTG4vNFRkUGs5b3JINURWaDc4N0EraTNnRDM2TDBDL2dwZS9hTEZoUzdKSGU3M3RpQ2U0d0xLZDM2N2ZZWDdFY2tJNElaN1F2V2t4V0VMT29KZXpHK0pNWHFVUWp6R3V3L2NhOVRtMm0vbHlYYmx4dnZraC9MRDBzUEZGMGlmL3l2aUcrUzNsQSs1M2h0K1kvcUI4S3Rsc29zanA5QVlERmtVRDNUMDJXaXhnZEUzWVlqRXBSckRaeEdUa1pFVVNMY1FpS2EraVZ3MUVTVVVHQjBJR2pwaGVOV0ZUcXN3NVpKbVREQkMrRTFFeEFRcVJOTU9HYlpOTnQ4dkprcVZLTk53ZWtzQ1F2QmdTWjRyZDdLWDhDU0d6eXQxT2ttZkFRQ2RiVjUrSy9kQ1UyUll3TGNxbnlxVUw3TFc1cXhDanBxVWlCcUNLMkkvVGdoYkxKajBEam5hR0MwWFQ0Q3BQcjltZEVEU3lWNTRTZ25LeUs4akJRZThQK29NS1crS09DK0prZjlBUThnMitJRmpPWWxhNklBUDJLZDlGTFZVUlhZL2gwckVGcjQvcytOT1RJM3pacVlkK0g3a2YzLzNoQjJNaVg1SU1IUG4zcE53YjhxOUU1UDVmNHlubGtRcHF2ZnlSbTdpL2d2eThlTk1oaXc5YmFDOTIrNElaam5tVy9SSVhNb1dBb1dwR2JvRkNUenJaWUhPYTNMWjBZN3FjYmhvbGp6SVZtbmRZalJtMkRQdU56bkpidWIwOHJzSFdZRytJV3lrdU02MjBybktzaXR0ZzJtTGRhdHRxdjh2eHNMVEhlRng1eVhyTThaWDB1ZU1mcG43bDM0Nm9MeEZNZ0t5QVBRSEw3M0hZN2FrMnlRRTNGaGtNUnFwUmNoaU5rdDFtazJXanlQazhGdVJUZkNUSDk0cVArUHJJdU1NV2U4Z1djdlNST1NIak9GdklSaGJaWHJFUld4Kys0WWdGSjZPU2VJaytzbGxVWXlpa3lybnlESm1iS1VkbElrT09RemtXR0N3WjF4dXZyZ2JqNGZVby9mVG5FaUJWK3ZxZlc3bDAza04vU24zQjYxWXVNQXE1cVhNeklHTDkwSFU3S3VOTlRLQmdHY3lna1c3UXlKZVFIUDBDR2FOZjRDSDY2SWgrZEtRb0tDVVhCYzB3Q1IrT0MxcGo3eU9WMDE5dDB4YzljWVU5WFZzNkw2SXZEUXhNUWZTbnlJSGt0WTZ4MmNVM3VxeHBnakhTZFBMRHJPU2tyRTk2STQzalUzSlh6eXVJMU8xVk1sTGlsMW9TK0l6K0hWM3JWaThqUzYvOGF2OE41Yk8xZjd0R2Z2UDFra0RDemtXVzRuL280L1hzdjlvODhVbDZKcjBldnU3Z3I3N2QzMStuak5GUGcxdkQ0SDkxZzdQdStzaDBORUZCMys2UDVDdGpydmtIYnZRelJrVGEveU9DNDFrNGp2RWRhQzRjSDhOUkRNYzhPTHl4dERJNHF1Q1lUZThoNzFHNExoRG1SZnVGZVdpNzhCcXFoZU14TVlpYTRMb2JucjlDMHlIUGR2Rlo5RENrUFFyM2o4RjFGMXdYOHArZzNCZ3Q4aDNSUDBHK0tYQnM1QkdhQ2RkU09LWkNIWGE0M2dESEp2d2EyZ3pQTnNQMVRxaHZFMDJEWTJMc2VpTjVGbTJBNStPZ1RBcmMzd20wRitvWDRXcmg2WCtlMHo2TnNlTThvci9KUjZRWWpqOGlCQnFFaEZVSWlYdUFZNWVCaGJsd1FMcHhPa0x5QTNEOEZTSFRPYWdxaEpCU2lwQzFCaUViOE5yK0JFSXdTU01IMU9jRTJ2azNoTnd2SU9RNUJjMDNJK1FEK1NRY1J5Z1I2a3Y4R21MVmhYQnNReWg1RmtLQmpRaWxnTE9mQ3ZWU09XYWtJRFRzeHdobGJnYTNNeHVoNFNQZytDMUNPZERkWExDRUl5RXREOHJuUXo4THhpQTBhamRDUmEwSWpWNE5ZalFqZEoyTTBQVnYwZjhyeUtROEJrN2pVRFVTSVBCU29KSWI2Ty9BcEg3RTBUVldWTXJCeUlDbW53Zzdjd3d2RXI0K1JoTmtGajZLMFJ5NlZUZ1JvL2toZVFUa0Z2NGFvMFZrRmhOanRBNmRFck5qdEI2bDZWYkhhQVBhWXRvZG95WCtKR3VaMGthMDJEd2lSc3VvMXJ3dFJwdkVYdkZpakRhamhlYkxnL2hkYTVrMWlISEI4bDh4bWlDZGJYeU01bENPTFM5RzgwUHlDRWkyVFk3Ukl1U3ZpdEU2dE5oV0g2UDF5RzVYWXJRQmxUaFRZclJFcWl5L2lkRkdOTkxaTVBqZkUvT2RqOFJvRTdmQTlrYU1OcU1SVHZvL09EQlB1UzQ3cnpDYVNjUmxaTFJJMDEzeGpOYXg5SFJHNnhsZHhHaERURVlhcmNsSW96VVphYlFtSTQzbWgrVFJaS1RSbW93MFdwT1JSbXN5MG1oTlJocXR5VWlqTlJscHRDWWpqZFprcE5HYWpDZ3REUm12a1kxbEVxUGxJZWxtTnZhYkdhM1FzYmpxR0cwSDJ1YnFZclJqU1A0NFdrK01kZzVKOTdDeW14Z2R6OXJTNmt3WWtpZHBDSjNDOGovSTZFeEdQOG5vNFl3K1FHbjlrUDdyaDdRbEQwbVhCOFl5QjYxRXJTaU1hbEVWNkZzWXFXZ3ZISE5RUGFQTFVBdHFocU16bGt0RkUrQ3VIV2g2cm9MMEJwWkRoWlJHS0Q4Q3FJa3N2ZXIvWTAwNWd6MVQwV3g0MG9pNkJ2TjBRTnBrdUdydGpVUkIrT2FpNFRFcWo2V09oeEtOY0owRlplcWdENTJzMUN5b3J3T09kclFNempXc0Q4M3dMSXlhQm52U0R1MnFrS3NxMXBLV3Z3RTRwRUlKV3A3VzJJeXlXU3YwU1JWcnFUcFdWeFdrYUNXYldJMTBCUFhRK3laV1l3TTg2V1M1NjFsYmxPdWRzUlk2MkFpcldkbE85cnlaMVVLdnRFOHRyQThOc2JHMHNycHBqNnBacnpwWWEvUUp6Vi9EcmxyL3UxaHJLbXRoYUs4YVdQMmQ4THlaM1M5bmRkZkhXZy9IOHJhd3VyUzJCOUliV2QyZE1ZNVV3NTNHbWUvbjY0UTZ3NHdyRFhEVjZxNk9wWFF4VGxOWlhVVkpDNU5MTytOb0l5dFBlMHJSMFJRck5kQkNOU3UvTE5acVEyeWs5Sm5HemF0Y3FJV2N0RFl0OVNwZkcyTGNiWW1OcElIbDcySjNWNlhhd1JEYnlIcjNuekV4b0RrZGcyT2h6NXBZZlZmcmFJZDJsc1o2V3hYamZ6WER0QnJEL1FEUGFsamJkU3hWSzc4Y25qVEVaRWp6TklMc05ZeTB3TGtPbmkyTGNWdXI0YW91VnpGWmFlaFFHUStyWStOdllGSnJaSGxhbVo1cGFHeG1KYldSREVWM3d5Q3lWSGkrSWlhWkp0WWJpazFOYmgweFRXNGM3RWNUdTd1SzNzN3YyWnVPNzQydk90YkdZbFpERitOMHpUWFlES00yU0IvZ2JCZjdiN0VESTZ4bDJGWVpCbFl3M25ZdzNIVXlhZFFOU3AzMlhkTjNxa3ZaZzlyVUVVUFpWWHVrUFcxaUVxbENxMWg1cmRlMDNtcjI5Q3JTdE5ackdMZGFtWmFzSEJ6RlFOdTAvSEwydklweG9qM1dCdFVoall1ZHJQeEFqd2RxYjJVWWFtSTJkS0J2STM1Z1Y4ZGNJelZxNytvWS9xbDB4NkI1c2ZZR2JDMjFsYVBocktJTXFJbktvSjNwZzZaSHc0YlVWUWE0dm5yM0FzTjVlMHp2bTFqdFN3ZGwvUC9XNW10eXFZdFp3bkRNdmwyMVUxcXRjMkUrVU5GTVZsNUZhYXk5TWpqUGdMWnJHWElIT0VheDJjRzRYUityYlFTYUR2bm13T3hSQ3NjRUdCR2xaMEFxTFY4SzUya3N2UVJTWnNPWjZzQWs0R0lKZk10WTZoeGtZdjhCU0dLamJJanA0ZmZuMElGMHJjZWE1RnBqc3IycUN6L2tqemJudFFBUDJoazY2bG51Z2ZFTVdQNEJQQzFtVDFkQy9xN0JOcXNIYmFqR3V5NVc5cXJ0QzhlMGcxcW9xL1phc3hNTk1kdmNFYk1kZGF5VzhLRHRwYnd0ajdWR3JjaXltTTFlUERqcmFXMTIvamVjR2NEVzhrRXJHSTVwZG5oUWQ5cVpuZXFNMlkzYUdPNy9FNzhHdEoxeUxEeWtscXZXNG9mdDFjVHdSYkc4bUZsZ3JkZUxZNUpwanRYOG55U1V6a1oxTGFjMHkvOURWUHl3NVFFYlNxMWxGZk5vcXFEVnhoaTNPMksyNm4vWDlnaUcvZVloOW56bEQyUVJqbmt6UXpWSG15V3FXSTlhR1dmcHZOWEE5TzEvbHJrYXcyTHpFQnM2MEM3Vi9ockc2WVloczFYN0VJOHJlekIzK3hEY1h2VVIvbnRPMGQ0MXNmb0hjTlZ5VFgzTG1meVhNbWtPdFNZRGR2aHF6aGJJcTltWkxzWnhXbi85NEhpMGZnMUZkMVBNY212ODE3U3FOWWFQcXhiK1dnejlkeU82aW8vSmJPdy9sTnlBajBmbnRuRE1FOVJHby9tVjFVeXF6ZCtUUWZ2MytIMjFaanErRm1iNWEySjJkUm56d1pham9WN2MveXo5Z2ZvMG5RekhmSTFyWitTQituNG9SNDFiVnozamFsYm5EL1Y0UUdKVjMrTjE3ZjlSYjY5eStZY3RYT3RYWE51amNNeGI3b1FaY3FBR09zdU1oOVRoaU02Tm8xRUJLb0w1VUlYelNMZ2JEdkZHQVJ5NWlNYWNjOUhVV001YzlwL2JDK0NyMFVVb0h3NWFhaFFxaE5pRUhyVDJldWFUdEVKN09mQmR6cjRqMk54K3JjWlhNOHYzdjVzbktEV1JhZWZ5UVZ4b3MyQkR6TnJTUHMxaUZscWJRNmZIL0t5V21BZFA5Vk9iU2R2Wmt3WW1nZGx3dmpwdlVGVFJ5SXI2Q2Y5bi9jNWgrWnVnclJ3NGR6SUxRV1dWdythZVJRd2xtajh4WWpEbi85MFdsak1mUU1zYi9yL1N5c0N6bk8vaGNiRHVPU3RidzdWVjFXRjFyenFuUHF5V3RUUzNkRUtTT3FHbHZiV2x2YXF6b2FWWmJXMnNIcUZPck9xcytoOHk1ZERLMU5rdGpWMDBwVU9kM0F6bFJnYUR1Y1BobERkQ0hkL1lxTTVxcUt2djdGQm5oVHZDN2N2Q05STmFtanZEVGJTUzlwVnFSeFVVZ3ZTR1dyVW0zTkZRMTV5dGptOXZxR3BVcXlGWFZRTThiR3BwRDZ2MVhVMVZ6UTBkbldwMWZWVjdWWFVuRk9qb2JLanVVRHZycTVwVmVMWlNiYWxWRzZDVjF2WndUYmc2M05IUjB0NmhWalhYcUZWUWYxZDF2ZG9RcTZxaFdlM3NhZzZyeXhzNjY2RjRHRkpiYW1ocFNqZFdRUnRRdmdvNk01RFd1VHpjM05rUWh0elZRSFMxcnh5aE1wYTBMQXUzVjhId090dkRWWjFOOElnV3FPNkNJWGJReGpwYWFxR2JyQXUxWFkyTlFMSytRdk5OTGRCSVEzTk5WMGNuRzJwSDU4ckc4RkJPVU9GMDBGYkM3VTBOelN4SGU4dFNxTFlLK2wvZEJRMDFzNTdWTkZUVnRkRG55K3NiWUlUMTRjWlc0RWlMV3Rld0xNd3lNQ2xYcVkzQURyVXBETHhyYnFpRzdGV3RyV0ZnWTNOMUdCclIyTjFBbWFXR1Y4Qmdtc0tOSzFVWVd3Y0l1WkhXMGRUUXlOamJHY05OUjZ5OWFpaXhPS3gyZFlSck5HNkcyN3BvWjd1cUtmL1YyaFlZTXRRSWcrcnNiR2l1bzBOdkQ0UGNPenV5cVpnNmdHVU1SM0RiVkZWWHRhcWhHYW9PZDFabmEweUQ0alVOSGEyTlZTdHBFN1IwYzNoNVIydFZLM1FOc3RSQUZ6c2JPbWpGTkh0cmUwdFRDNnR0eEFCV3gyaERteFd1NjJxc2FoOHpEOHBSMU9hTkdKMm5acFExVkxlM1VCa05ZN25LNXJETEhuVk9POGkrcWFwOUtSM3hmNGQ4R0VzZGdEQU1lR09ZZ3F4elo2c3pxenJWTkhWT21UcWp0bllFNjFpNHNTTzh2QjZ5alpnK1k4N2swc2tUeHMrWlBHTzZPcU5VblRaNVFzbjAyU1hxK0VtelNrcktTcWJQTVVrbWFVNDlpR0tBMDFRc3RHSVlISXk2azBsaHNEK2dlUzExN1ZXdDlTdFpPeFQ4bEUrTFY2b3JXN3BveVdxS1VPaGRWM01OUXg5Z0FnREZjQTJZYUFBMFEvYXF1dlp3bUtKM2hGb094ZXFyQURvdGk2bnFRY25PYXpwRHViV2NRakFNd2c1VDZiU0hxenNCRzdYQSs2djlvbUp2cVF1ekxBd1dnK1ZBbklENHhWMmRVRFYwc3dXMGNNaUEwanNHT2dYZ0gyVEZZR0dLVUhWWlZXTlgxV0pBWlZVSG9HcG82UkhxM0dhRzg1VURvNEF4eFlRREtsR2xkclNHcXh0cUc2cC9PSElWdU5qTUVFckxWdFhVTkZBWkEzTGFtZUhLcHNudGpMZk1Jbnl2VTQwTlRRMTBRTkFJeTdlOHBYMXBod1pzaG1HVzJMS
              // WNNTk8xdUxHaG81NjJBM1ZwN0c0Q2NFUC9RVlN0SzFVTjhERU9YZHNRNDhmazJxdURveGF2clN2Y3dab0JXMWtkYm0rT2phQTkxbStXdWFPK3BhdXhCckM2ckNHOFhETnhQeGcrelFlU0RJUFZxTGxxRmdmSENOMWl4cmk2ODZxTTZjQ3FZcjJ1L2MvVnNpNFBGb2paaWxoRjBFNVY1eGlhWWU3czhlcHdOV04wUWRFd3RXams2T0c1QmJtNWh2L1YyTlhHdEhXZDRYUE9kZkVGU2pBc0JWWXV2cGNZbkFWVG5EaWs1aVBCMTlTTXROWUdBWnJoakFVTXNVVFNNS0lZWW1uU2todHBrUloxRFZVblpXc3FqYXcvcG1wZDFXdDdZZ1k2d2NUV3JheGJxaTFqVXZxVmRQdXgvT2hvK21OZGZublBPZmRDZzVwcXZaZm5mZC96dnM5NXo3bm5mdmdZWC9zV1BobUZjL2VlUGMzTmtNRzlRUzM0Nkw3V2ZhMGxSZU5UVTZmYS9QNVVLdFUwc2JIanh5WW43ajBuRWxya2REekZ4d0tuSURxRlRIMlRvemhEdjQ1cjFpUXU4STM4SkQxOWZPeDRYT3VQaTNNamlWZXNsc0RuNVBhUFQwMmM5RTlNOGFjLytTZVN3M0YrbldqaXppOVlJWlU0Q1cvaS8xZmhKYjg5am9LTnlkQ2tlQnZNSnlEZkZoTmR2QVdrSlhneFA0SHliVEVWMklqM2k4a2lueEx4U2NzeDZZcVVsbjR0TFFIejBvTDBpM3R5eGNYRVlLTjhTK1JPYkdrcnNTV2J5T2R3Ty9ZNG9vNXV4d0hJVnJEajRpM2lNWHM2TWs1TitsT0ppQ2tlL3lmTWFURTk0emsyUHdjaitaMzhsM2MrdTRROXBGU3FKT3RBSHBDSUN1a0hlb0JoWUFhWUJRb0VqM3NtZ1hQQUV2Q1JpT2hTWmVhNXZYb082bW1oc2lkT0JrUXhiaFdIdmlXSzJXL0VMUDIxUTVhT1BHN1IyaXphbm1iTDNkUnA2WjJObGk2dkR4aGNGNVVFbHNNVlVnVjVTK0lmWEp5Q3BPeTNwSlJTb3BLcjBrUEVCSmhVWUh0MHFUeGI1dzNNTGtrT1FpVW1VWXlZbWwrV2FLYWtMQkF1WW5tMlRzcUp5djdOUHJRaTdNUHN0ckxBYlBnSjlnRjVGVmdDSlBZQjFsdnNGam5IYnZLN1NpQkR3Q3l3QkZ3RDFvRUNkaFByKzFqZlkrK0I5Uzd4QXlGZ0dKZ0Zsb0Ixd01uZWhYU3hkL2duYVVKeU93UXc5ZzZraTcyTnpYb2JzcFRkZ0hXRDNVRFgvcG9KdGdibWhlSHoyNFphYnh1VjFiWlJYaEhJc2I5azd1NVNjK3dmV2MyblhnM3ZadGVKQ1RBMGRoM0pyeE1ONkFWR2dGTkFBYXcxV0d2RUFKNEZyZ0ltVUlBNmE2aXpoanFyd0p2QUd0a042RUF2SUxPM01tZ214NjVsdkoxcXVJTDltZjJlVkdKUS84VCtJUFNiN0hXaC84aCtKL1FiMEc3b1ZmWjZ4cTJTY0RIaUJIVmMwQzVvUCtJUHNOOWs2OHJWZkxpTUxXRjRWRWcvRUFKNmdHRmdCaWhnUzJ4SDVwaGFqaVNMWkZVbVlHYkliYUYvUmw2VWlYNUMxYjJQNFJqVHVQQzJIWUFGTWF2TmVwbnV2Znc4aWx4NEx6MEhpd3Z2OTM0QWl3dnZkODdENHNKNzhnd3NMcnpIVHNEaXdudGtHQllYM3A0QldCQTU5cE5mMWUxVWd6MVBVUzFjeWxJWXBSUkdLWVZSU2hFSFMvR1YzSFh3dnIyUWFXakFpRjNSZmJzYVZHT0JHcTlSbzQ4YUwxSWpRWTJ6MURoUGpmM1VPRW9OSHpVVWFyaXBvVk5qa2JaZ0tBeXEvM0pMc1ZXdm9zWXFOVjZoUnBJYVhtclVVNk9PR2hvTjZqbFdtM2w4cjFCZFFtWEQvTHlDUHRBUktFVWZhekdpdFRpc2EzSGFMMEZlQS9LaXBJT2s3YkRJWDNaenZTUGJFTExLVFcyQnlmQkJ0b0tLSzlnTksrUjl3SUVkdElMRGFBVkpWcENnRkRJRURBUEx3RHFRQndyQTNvR096d2haQ3VrSFFzQXdjQTVZQndwRWQ5WUJSaWJ0THI0cU91YTNPOTNEUzJ3RkszOUNXQzJyMVd0Y2lzdm5PaWpOS0xUVVRYdmNlVGNMa29vS1hPTEt5K1N5SEMyWis2VGt2NStVa01Kd0lidkVaa2dOZHNTenRwN0ozSzFSYy9USEdlK2lHbjZJL29pNEhUanFhQ3Z4MG5yb0ZwSVU1WDFFa2JsdUpncDdHVHFRVVE2ci9NdDMza1oxZ1c3anRlYlV1OG8vMWR0S2pzSDhsN0tvL2wzTE9XaEcvUnM4TDgrcDE1V0w2aHYrbkF6UGE5NGNoVnJRQkhWZWFWRmZXUlhVOHdoY3lhaG51WnBUdjZ0MHEwOHBJcEN3QWtlVEtPbWxhcC8zaUhvUStTTEtxS29ua1hOT0RTbEgxZjBXYXgrdk02ZnVSaGQ4bHRtQXp1NVNSS01ldDBqNFpEQkh4L1ZHNTJYbm9MUEgrYWd6NEd4MDFqcFZaNDJ6MnJsZExwZGQ4amI1UWJsSWx1VUMyU0V6bWNqYitaZFZmZnpHaE8wRkxuR0hxZmhOTjRld1hZeExKdTViSUl6S2pEeEJ6QzlKVVJidDc2UlJjM21NUkVjMTh6LzluaHd0T25URWZNRFRTYzN5S0lrT2RKb3R2bWpPbWU4emc3Nm82ZXo5NW1DYTBrc3hlRTMyL1J3bEE0TTVtdWV1QzlYODhVYnpoTkt5Qzg5VWMvMlZDOC9FWXFTcTRreW9LbFRlVWRiNjFjaDl4SWd0NzdtSnRtcUxYV05lanZZUG1qK3ZpWmtCYnVScllsSHpoL3o1Ui9QMFkvcFJWMlNlM3VFcU5qZ3ZkZENQdS9xNFgrcUl4R0xSSEQwc2VFU2pkOERERVhOSDhHUTMwVGlQYUxMYjRsMnhlUFdvRDE0ZFYrQVZGcEo2d2FzdkxCUThCK1c4ZExLdUs1S3VxeE9jU28wa0JTZFpxZDNMV2EwSHA3NWVjQ29Nc2lvNHF4VUc1NWdkZ3FJb29MZ1ZRYUVQRTBWUUZQcXdvQnorbE9LM0tSYzNLUmRGU3hMOWxLTlluSktiRzV5U20rRDR2dWlTNlBUNWFMWTlOamJFbngwMTR1bEtBQ1BtMDJmR3EweGpWTlBTWXpIN29WTGVrVkc4dzRXT0o4eVlKeEV4eHp3UkxkMCtkSi93RUErM2V5SnBNdFExTUpnZTBoT1JUTHZlM3VXSlIyTFo3dDdtNEphMkxtNjIxZHg3bjJTOVBGa3piNnM3ZUo5d2tJZTdlVnRCM2xhUXQ5V3RkNHUyaURqR2V3ZlRNdW1NUFRaazZTd3JMc0x4T2xKZEcrdXNjSjNxRUFkdmUyM1YyZW9GVEVoZUlzVyttUG1ncDlNc0FYam9rZkFqWVI3Q09jVkQyL2dEd3V4UTFkbjIydW9GK3BJZGNzRmQ1dWtrdnFucDVEU3A2am9lc2Y2U1dPQ2FtdVlEYmtsZjh2TVd4THBNUFI1SlRoRVNOUnY2bzJibzBKSEJ0Tk1KN3dqZkpMTnR3MWRjM0pYTEwxdk9KampidUZPU05vbmN0NS83Q2d0dDRtZjMvN1N0eGQyR0Jsdk1VdDFOcDBneUpwbnU2QUREcFdEQWZoTFRBcVpML09VaEdjTUdKcW1QSmpkeWlHNFQrejU0dnIwYm1KcTJMWHNjcG14dDFVS1Y1TVp3YkM2b2cwdlYvd0IrMUMrT0NtVnVaSE4wY21WaGJRcGxibVJ2WW1vS0NqRTBJREFnYjJKcUNqSXdOVFUyQ21WdVpHOWlhZ29LTVRFZ01DQnZZbW9LUER3dlZIbHdaU0F2Um05dWRBb3ZVM1ZpZEhsd1pTQXZWSEoxWlZSNWNHVUtMMEpoYzJWR2IyNTBJQzlRV0VGQlFVSXJRWEpwWVd3dFFtOXNaRTFVQ2k5RmJtTnZaR2x1WnlBdlRXRmpVbTl0WVc1RmJtTnZaR2x1WndvdlJtbHljM1JEYUdGeUlETXlDaTlNWVhOMFEyaGhjaUF5TlRVS0wxZHBaSFJvY3lCYk1qYzNJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lETXpNeUF5TnpjZ01DQTFOVFlnTlRVMklEVTFOaUF3SURBZ01DQXdJREFnTUNBd0lETXpNeUF3SURBZ01DQXdJREFnTUNBM01qSWdOekl5SURjeU1pQXdJRFkyTmlBMk1UQWdNQ0EzTWpJZ01qYzNJREFnTUNBd0lEQWdOekl5SURBZ05qWTJJREFnTnpJeUlEWTJOaUEyTVRBZ01DQXdJRGswTXlBd0lEQWdNQ0F3SURBZ01DQXdJRFUxTmlBd0lEVTFOaUEyTVRBZ05UVTJJRFl4TUNBMU5UWWdNQ0EyTVRBZ05qRXdJREkzTnlBd0lEVTFOaUF5TnpjZ09EZzVJRFl4TUNBMk1UQWdOakV3SURZeE1DQXpPRGtnTlRVMklETXpNeUEyTVRBZ05UVTJJRGMzTnlBMU5UWWdOVFUySURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNQ0F3SURBZ01DQXdJREFnTUNBd0lEQWdNRjBLTDBadmJuUkVaWE5qY21sd2RHOXlJREUxSURBZ1VqNCtDbVZ1Wkc5aWFnb0tNVFVnTUNCdlltb0tQRHd2Vkhsd1pTQXZSbTl1ZEVSbGMyTnlhWEIwYjNJS0wwWnZiblJPWVcxbElDOUJjbWxoYkMxQ2IyeGtUVlFLTDBGelkyVnVkQ0E1TURVS0wwUmxjMk5sYm5RZ0xUSXhNUW92U1hSaGJHbGpRVzVuYkdVZ01Bb3ZVM1JsYlZZZ01Bb3ZRMkZ3U0dWcFoyaDBJREFLTDBac1lXZHpJRE15Q2k5R2IyNTBRa0p2ZUNCYkxUWXlOeUF0TXpjMklESXdNek1nTVRBME4xMEtMMFp2Ym5SR2FXeGxNaUF4TmlBd0lGSStQZ3BsYm1Sdlltb0tDakUySURBZ2IySnFDanc4TDB4bGJtZDBhQ0F4TnlBd0lGSUtMMFpwYkhSbGNpQXZSbXhoZEdWRVpXTnZaR1VLTDB4bGJtZDBhREVnTWpnM01qZytQZ3B6ZEhKbFlXMEtlSnk5ZlFsOFZOWDE4TDMzYmZObW44bnNTWmczbVdTeTd4TkNJSm9YU01JU2djaG1na1lTa29GRUlRbFpXR3lWYUZVMnExalhxaTJwcldqVmxpRkJES2dWbDdxMS9ZdDFLZHFOdGxpWHlsLysvVk9rbGt5K2MrOTdDVUZ0Ky8yLzcvdDlHZTY3NTkxN3pyM25udTJlKzk0a0lJd1FNcU5CeENHMWJYMXJ6OCtOU0lHV255T0VuVzBiKzVYL1BIWW5oWThqSk0xWTA3TjIvWVBjZjdvUWtuMElDWFBYcnR1eTVvNjBuU2tJV1ZzUUtuRjF4RnJiWDd2Tk5CMGh0Ui9HbU40QkRjNFh6TCtBKzhmaFByMWpmZi9tL3pqcHVBUHVqOEw5Z1hYZGJhMklPMW1KVVBXTmNEKzZ2blZ6ajJSM25FWm9OclFocGF0MWZleG5uWW5md1AwVkNLVXU3dW51NngvUFFiOUNhQlVkVCtucGpmVjgzM09ERys2QlIvczZhTU9Jcm9ldUNHRVIvZHNmUFBXR2NJZ1hKb2drclRMSVJtUXlJNHVWM3RpUUhUbWNTUWk1ZENRMzhuaDkvZ0JLVGtsRjA0SktLQzJjbmhISnpNck95YzM3OTNQLy8va1JEcU1VVmg1R0tYd0VnYTdHVDB5VVJPZjRDZHBIYS9JeFNDTlZLL3JQTUhvYy9RcG5ZUVdONE0rUkY1M0ZmbHlNNWlNZWZRYldzZytOb2J0QUVzdlEzZGlKMHBFSExVZnpNUTg0dWVnV2ZQLzR4dkdQMEVYb1crakI4U2Z4RGVPUFF2OXQ2Q1YwRmpqNEhZOVJPVm9FK010UkRIM0V2WStheHU5REJyUU5tZEFzdEFSN1VDdDZCejUvQXg3dVFIZWluK0N2ajUrRldWM29CaGl2RWxXajZ2SG54cytoSEhRTHYxczRKaitCYmtkUFlYRzhiYndUVFVOcGFDZkpIWDluL1Bjb2dwclE5OUhqd0ZNdVBzTFBReUYwTmJvSjNZdjkzRXNBM1lWK2dCTFlUSnE1T2NLek1OTjh0QUoxb1Uxb0ozb1V2WWFkdUVFNEpwd2EvOXI0QjBoRVNTZ0xlT3BFSCtFeXZKQTh4SnZITHg1L0QxMk9EcUZYWUwzMGM0Uy9uSDlZdUR4Uk5mNmQ4ZWZCTHA3RVJ2dzBmazRvRVc0ZHUzNzhlK00vQm91TW9HS1F5Q0tZWnpYNkJub092WXIrQy8yVmJCM2ZpdWFocFREelQzRXFWbkFFSlA0TzhaUHJ5SFhjbTZnQVZ0c00zQTZnUFNnT0dqbU1ua0xQZ0d4K2pZNmo5N0VMSitNRmVEVytIZitWbUVrN2VaMjduenZBdmNWai9vY2c3ekRLQUJuMW80ZlFRZkRuWDZEWHNRRGpGK0VHZkJYdXh2Zmc3K0RqSkU0K0laL3hCdjRiL0QvNE1TR1NPSjc0eC9paThiOGhId3FnUzlBMWFDdkk5dnRvQkIxQS80SGVSbjlGLzQzT1lEdWVnVHZ3OTNBY0g4ZWZFSm1ra2NXa2g5eE5IaUkvNGhaeHQzUFA4V1g4YlA1cS9oZjhlOExOd2k2cFZVcWMyNXU0SS9HanhCdmpUNDYvQWJaamhmRWpxQTRrZWoxWXhVUG9XZlFtalA0dStpMzZJN1VmR0g4V1hvbXZoRm42OEhaOEovNFIvaWwrQTM4TXEwVHNrMFpta1JxWXRadjBncHh1SUhlUU8ySDIxK0Z6bEx4SGZrditRdjdHQ1Z3YU41M2J3SDJQaTNPajNGSHV6N3lkai9BRmZERy9tRi9KajRObVNvUzV3bExoRWVFeDRYbmhsRmdwdG9zOTRvZlNEZEtOaHArUDVZejlMb0VTSFlsNFlnUnMxd0NXZEExSTRydm9RYkQ3QTZDRDEwQ2kvd0VjSDBlblFRc0JITUtad0hjRnJzUDFlQ0crREYrQlkvZ0d2QTEvQzkrTDc4Y1A0aC9EQ21BTlJBTGVjMGsxV1VwYVNZemNTTGFSYjVJRDhEbE1YaVh2a0dQa0pIRHU1Y0pjTGxmTXplZFdjcGR6WGJDR2Z1NDY3a2FRN08zY285enIzSnZjQjl5SDNFblFtcGVmeGcvdzEvRGY1aC9tRC9CdkNKY0k2K0h6b1BDc2NFUjRRemdubkJPSkdCQlR4RUx4S3ZFUjhZK1NLRTJYR3FRZDBsdlNmeHQ2Y0FyT0FjNlZxZEdDK01FSHA1RkhpWXZmaWs5Q1F5cm1JZXpkam5KQkQwdkJLLzRiVlhFSjBJdVY5Z052YnVMbmt5aWxxUEp4b08vSFQ2RXkvRk8wVlNRY0JGZitPQnJHdnlISCtSZklSZWh0M0lMOS9NTmNsL0FhQ2FISElCcnRKaytUcC9Cc2RJQlVraFhrQVE3aDkvRWo2SDJ3OTgzb1RudzE3a09QNFpONEpyNFdsK090NkMzaTRaYmlHMUhsK0lPRXh6S2VqMDhoNEFCZHo3ZWpLLzkxRk1RVjZEZm9vOFIzZVF2L2RZaFBvK2h1ME9qajZQZjRoK2h6TEl4L0F0R05nMmpVQ2xIbUZyRDNteENOZXMzZ1oxdkJILzBRUWRhSnI2TURkRWVSeXNXTCtXdlFLZlIzOUpGd0dDeHFOa1RTRHhLZC9IZjVQNDJYaitlRGg0R1hvVWZBN3pyUVhQQ1k5OEZLbm9GN2VuY0ZlTG9SWWtrSmVIVURXb25hMGJVUTlXNGZqNDgvTVA2TjhTM2ozZWhuUVBzNXpzT2Y0eUh3aUZHZ3FFU3Z3T2MyOUM3ZUJYNDQ5LzlzRjBpMG95UG9ZK3pER2JnRS9PR2tzRkhZTFR3cUhCQitJdnhDTEFacDM0anVCNHYrSTFpekVWYlFodDVBSDZQUHNBRjA0MGQ1S0FyOHpnRGVHOUU2MHNROWcrYmdBT29CbjgyQ09ENWJYMGtmakhJRFNPOEI4T2Rud0RkT1FaeTRBdjBFSGNNRWUyRkZiVEMvQWNhcEJ6bXZBdXk5b01GdjRCRm9hWWVvbllQK0F1dTI0aG1rSCtaVFlhUzdJV29kQVo1K2cvNE0waDVuZk9WQlhLakJLMkNzejlCbHFCMW1tSTRhOEg1VU4zNFFJdFVpVk1QOUhPU2RqdTFvTms3RFB3QzZGdkJRSzBwRkZjS2ZNRUY1aVVYak0wZ245d3pzTWVQUVBnUzdWeks2Q0c4QUxteXdqakhreG90UldXSUp5bE5WdGVyaWl5cG56YXlZVVY0V0xTMHBMaW9zeU0vTHpjbk95b3hrcElmVFFrcHdXbXBLY3NEdjgzcmNyaVNudzI2eldzd21vMnlRUklIbkNFWjV0ZUc2RmlVZWFZbnprZkM4ZWZuMFB0d0tEYTFUR2xyaUNqVFZYWWdUVjFvWW1uSWhwZ3FZYTc2QXFXcVk2aVFtdGl1VnFESS9UNmtOSy9GZjFJU1ZVYnp5MGthQXYxa1RibExpSnhtOGtNRzdHV3dCT0JRQ0FxWFcxMUdqeEhHTFVodXYyOWl4czdhbEJvYmJiekxPQ2MrSkdmUHowSDZqQ1VBVFFIRnZ1R2MvOWw2TUdVQzh0VFAzRTJTd0FGUHhRTGltTnU0UDExQU80bHhHYld0N3ZPSFN4dHFhNUZDb0tUOHZqdWUwaFZmSFVYaDIzSmJMVU5BY05rMWNuQk9YMkRSS0oxME4ycVhzenp1eTg1WlJPMXJka210dUQ3ZTNYdEVZNTFxYjZCeU9YSmkzSnU2OTVvVHYvQzBNN3B6VHVHMXFiekszczliWHFkRGJuVHUzS2ZFamx6Wk83UTNSYTFNVGpBRzBKS091WldjZFRIMExDTEYrcVFLemtadWFHdVA0SnBoU29TdWhxOUxXRnd2WDBwYVdxNVM0SEo0ZDd0aDVWUXVvSnJBempwWnNDUTBIQXVxaDhlTW9VS3ZzWE5ZWURzV3Jrc05OclRVcCsxMW81NUl0STM1VjhWL1lrNSszMys3UUJMdmZhdE1CczJVcUVKdnNZeEJEcDFEOWtrbkpZc3BSZUQ0WVJGeHBVNENUeGpDc2FRYTl4R2FnblcwekFBMSttakJReGR0Qkk1MXhlVTdMVHZ0TTJrN3A0MEtHUGF6cy9Cc0NDd2lmL09UQ2xsYTlSY3l3L3cxUmtOckpwS2xCL3dRY3o4Mk41K1JRRTVIbWdFNkJ4NHZaZlZsKzNzWlJNajNjWTFlZ0F2R2hCcEJ0YTlQTVFoQi9LRVFWdkd0VVJhdmhKajU0YWFOMnI2RFZ5Y05JTGN4dGlwTVcybk5rb3NlOW5QWU1UdlJNa3JlRXdaSVBzTF
              // RlSFRkRUp2L1o3SjZrMm82WmNlejVGOTB4cmI5K2FiaiswcFdOU3UzT0ZsMjI5Y3N1dU5QNlowejI2VkE4YVU0amwweDBpQ1J6ckJlTThvcEpaSHJUYUk3ekdmQlBaRWJkSHVmQUtGa0RWdXJpOXBaNTJyWEpHQXI5VTVwUnlUQ0ZhSFQ4RktWaTFYa3luY3Y0ek53TDcyZGRjSDhCZCthZEhQRExSMGo5c3BVN2R4b3Y2S3VEQUxSeloxMVlxZHZac3JOMWRIeHdkVml4aDNjZUlnK1RoM2YyMUxaTUtIUjAvUEN1NUhqZExVMndpQTQ4TXg5U0FpcHRBVDZ3dzBwbzlnR0NFNkkwU3FyVUpDVHdDUTRaSlQ2QmtkOGdDZ25DUFkwalNJYkUwb2Q4dWZZemxXT1ZpK3luS3hlT1ZhSXFnTzNuNEZKY0ZIS0VIQmx3d2JCWm4xTzRJK2RVQWYwREtmd1JlcHlyeHR0SUp4bUN1VXJVVUJGV1lmTXBoNW50bk1JVmNUeFhJOWpoZUZzRTNYNytvWFcrM0VYMkU4MEw3WDl1Um9Vbm00dUxrbURrYXBJRmFacy84UUVkRFU2cStISHNCL1IwMVUxbUlDT0oyRkNRamNERENHczMwaEZPTnk4Y1ExVUxUeFlYbFFMOUhmUTRRS2tKV2pIK0FXOFZqc0ErbzZBNzFQck54dTNHaC9HajBxUHl3OVluNVZka3d3cEhrNmNwc0NLNDF0SGg2UWlzRFJvcVNJVTRYWjV1bVUvbWk3VnluZVZoK1dma1ZmRkYrVVhMdStUWDRsdnlXeGFIM2FmNGlHOTAvSWlhNGZSRWZYc05scUN0MEVac0t0elo5aUloOWRoaXlQNERhYTVqSm4vb3plY1pmd3RQTHJLZjJiRHdKS282bWJ1Qmx1SWkzSXlhbTNHSjErT3dTMkk0RFRuczVkTzlhYUlrT3V3ZVQybko5UExwRG5za1FrcmUzbnpiN2sxdnY1UDRISzZsRFo3VTZPSlNyUktPM0hzZ3NTclJjdkJ1U01QMjR1OGV2UHVqNm1YckUvRHpuRnE5YkIySW5UeFhEUko4RUlRZkFSbklhSVVxWDAyK1JuWVJqdkNqT0h0a2xZQ0ZVWExsa3daWndNZ3N3d211RVdTR1NiTnFFUkFmNUJVK3p2TzgzM2dZUHd5NWtDYm95b1hVSnNBWXFpcFBONStzS0M1Q3phR1FRNVRLcHFlWGwzS1J4QWYzdmRHRlNkRUpQcnk3ZGp6OTFadXBEa3NoQ3pVREI2azRySzU2d25jd2NDajVOZjVsMzFIZlVmL1JnR0ZPOHB5VU9ha3IvUGZ6ZC9rZTVmZW1HTVNBZ3JMRThzQThmbzV2am45T3dKRHVTL2VuQnpoUGhGL0JiL2M5a1B4QXlnT3BqNlk4bW1wd29sUjdxcEphbkxveDljYlUzYW52cEJwU3FWNDhMbmMwbGRqTnRsUnFhb1RhaWdvR0JGMGpvQ00wU3I0M1FyRFpOb3BYcU9HZ3VkQk16RlIzNXIxSmduek00NEgwQTZOQTBIYk12b240cDAwbzhEVFRZR1hsUWpzb2NTeDN3d2x3aDl6bURaVU9ad1YybE9ZMlE0UTRoRkxIand3N0tpZ1B3elpXcVZaN0JXK3dWd2dHQjlTT2lsejIwMFMxWDM5cDR6TW9HWGFwRkNpcDQ4ZG56SmpSaERjMGcwMDRRdE9kNWFEL3NtZ2tEQWFSTVQyOXRBUVNIREFOWHBSNDg3bE0rOUFuUDhtZEdXdHE3REFrUHZSancwdnZucDI3c0RSeFpxNEhDNGwvM0lubFgrK3Z1bXo1bGJHcnZwYnk0V3NmLzdodFpIWDE2WVlJOVlkWFFSMS9oS3lmeG9FQ05abWJnVVZ4Qm0rVTkzR0VpQkdzQ0VVQ0VmWVpmdkVZOWYxbTZ2Q1ZaOEJtcTA1cW5nbXNPVjZsdmdVSGVBdXR6LzMzaEtmUkNQT3NjQmpHTmVLU1EwZ2FQNmJLNVJWUk1Rc3VFcFdFbkZVV0ZWVzR3TjB4dFNHVUNYMXd5VVk1Zkk2UVpTdzB6MERsUXBYNUtuUVZpWEZyaEE3RFd1T0huRzJCaUlsQnhweFJsbmxKeHBDYVN5NDRBWWd5enl1QzZCSUUwV0JVQTZrWEcra1Vwa0JxMUpoQk9FN2s1Vkg4dEdvVkpTTHdQRVlHczljYkFMMjNxcVlnWmdmd1FjemhVWkt1eWtFWkY4bURNcEVQazNURUE0YXNnRmY0VFZlMlRRUVcvNW5tRGFlYk4vakdGdFhHYXY0TWxnOUNxYXBjZUJJMFh3ZzJrRnU1VFNqSTNYYnRpOXNLZkxTUzdKV1YyMTU4RVZSY0h6Y3RyWTlQZzVCL0NISGppV0VEYnp3OG5nRFJuTnN2OGpObTZBclhUQ0lVNHVDRFEwa2NKenliK01uZzJNRXRpWmZJTEZ5Ujg5cExlR0ZpUkRoOGJpZFJ4bzZENXU0R1NhOEdTU2VCYmVlaFkyclZwaHpjWWQyYzgyZitETS9MSWJjc1p1V0ZNanpPb0h1eG14UzU5N21KMiswS3AyVTRrd3lLS3dNamtwelpJdzdDc2JRK0szT2ZHWnVwVzhpbXFIbVUzQUx4dWtBdGFDaG9LZWdwR0N6WVhUQlVZRkFLaWdwSWdTdE5RVXBTVVJKSkdpVzdSdktMbDA0RWd6RndpT1lOWjNJaHRrRTRZSHNFTFk2S3d1WU56Q1hjNDRQRHFSVnU2aElCV2czdVQ2SmUwQVJJR0NTSW9FeUt5Z2FpMm05VVFDd1FHNU5DSmRNSXRYb1B0WDB3ZmlFRWpsWlNQcDM2UldZa3pEbEMrazBrZkRkWjhPUEh0cTNzWG5Yejd1YnZiVnlRZUQ5aHdWblAveWpua3N2cUYrUzk4U2gyRHVYT1hxcHVlVTA0bkhyRnQxZXRmVHczOCttdDdjOXNzQmdJLzFMaVI0SjgyZHlhNWJJd2RpaXhXVFkzTDVwOVJRNk5XcTNqSHdoWENtK2lBSHBMWFhpenZNTzF3N01IM1N1K0xML0Z2V1g2R3lkbnlGbm1MRXUySzlzeklBeklOd3NHS1VueWVwTzgzbXlTdzJVSVVwWlFoUmZqYnd2M3lLOXlQelZKZUltZFBzTTlCYjVDSmU3d1JWbHR0RUNOVjZwZVh6NXZzS3BXWjlSYXY4cUdGOXV3VFhYN29oQ2tzdFEwWjc2UnMzMXFYWUUrUlRBa3dZR2lGSnppemh5U3NFMEtTa1VTQjd2NUxTUEoxK2xxMlVDM20rWXp6YUFUR3F4T1E1dzZrVXRyQ3RDSWpXbVlFVVErck1DMmcwS0sxK01WSWpUWXdONERXdzlmaFlPekU3LzRKUEdieEhaOERZNWl5eVB0SllsZkJ4N2ErUDJmdlRLMDhWR1NmUG1wai9CdGVDWHV3bmZ0dVRKZTEzdmp4NG5QRXg5L2NqZVYyMTBRN1UrQmZaclFidlVpZzhCTGhnelJHUlJ3a2JBUGdvc2djM3dHYkUxR09jT0U0S0JXejVGNVJtVENwb0JpS2JLb0ZzN0N5d3FtSVJ2a0JMWm1ubXByYkZXVkMwOVhucTc4Q2xNVHdNWlNLd1N3TVRBMTRRSlQ0d1R3U3BZZHVFTjZ1WXV2T3ZjUk9UNm1jS1hDNGJPSnB6NUxiUGdNdUw4SHVMOFJ1SmRScjFvRjNJdENocVFZaWd6UEduNXY0QXNOdXczRVlFRGFFbVRndjBwY0RKNjBoSU1jaXdRVVU1R0ptQzdrMy9oVi9EZHJHK2hZcFpNeS8xWDgzY09kSEp0RjJzY2VvTHc5ZEhic2RpcFo2dms1VExMZlZ6TmtYakJ5UkRabThNNTlIT1k0SkFvQ01DRVpEQ0JYd2FDSXIwc1l6R0tYbXFaYUdpd3RGcTdITW1naFZNaERsaU1XM2tKTUdwdEg2TTdJQkQxd29WUDNubW5XOHo0VzhPQkN1V1dTNXBpa09jMnBhZlVGU1U4c1p2SnpOODRpTlRncmNXenNhZUh3MkxPayt2TTZjdjNZVmxqVExiQ3dBN0FtRG5VekRZNlVSS01DZFl4d0JxdlZLcGMzaWdSVmFCQUdoZU9DRUJSYWhCN2hsTUFQQ2pURDRaQ0JjTzlDZmh0SEVCdVBVUGVpaXpvS2R6enE0b3YzNkI3UnF5K2xxcEx1dlJ0NmdWdkszeTA0U3pqOGVSM3djUy9JTmt6MWp2ZXFWcGtURFg3T2ErQ2RNRHFzRDQwNFRWVjBuU09YTjBkcHJlWXNYUmJsU2lTRFM1SU1uSUVRaVpONVFtUzQ0VlhBNFZYbzUwdkUxMW1HdFV2MXE2WUdVNHVKNnpFTm1zaVE2WWlKYUxaaWtQVkJaWllzTEYwYWxVc3UwSXB4aWxaZ3F3RzlUQ2dHN3RoNmFCU3RRRkMyRmRDTkJIYWc0cUk1VEVlREIwMWxoa0ZUR1dQNG9rQkIxTEFVTGdMbjRVbzRsZVBydUp2QW5JY013NFlUblBnaTk3cmhQUU9rNklXR0tEZkxzTmp3TFc2UFlZamJaNGh6enhwTTJnWmVXaFlsYWluYndJK3Jsc0tTS0ZIb1JYS1ZRY3M5cWh3cWlKSmxjR0hZZGRNVXVJT0xnVWlTajNCZUtZOWtTck5JcWJTSXFOSVZaSVVrdTBpeXRKRFVTdmRKajBrL0krK1NEOGtIMHQrSktaTmtTUXVremRKMjZYRWlVbDMxNWs3OG9HWk5kYmxOcUJuVVI5TVJ1TnlMRmRLSWt4Sy9HdHNQMjJRKzkrYm5kZHpUNTJwb1ZrSmowVm5RcWcwbG8wMXFoaWdjY2gzeWNYTUZ2Rlo0UnlCT1I0YkZha1hKZHVyTk5tVHdaTzZqUHFQdGh6U2txcDVnYWxGcVMycFA2bUNxa0dxM1RYWHNsQXMzUVcwUFBPL1c3SnlFbWpkZ3lpZ0VXSDBUQzRmOUJDS3N2b2ZkaFgrTnJVdXVlM1QxUFl1dWV2VzVCL2R0bkhQbHZMSWg0YkFuOU50OTIwWTdIZTZ4WC9IUEoxb0tWbGMzZEZpTU1ER05BT0JCeUkxQzZLeDZRNFZ0dnUweTZTclRWV1o2b2hrS0g3UWVrNDJpUVRSNkRSN2pkR3VkdGM0bUdleXl3MlYxMlZ6MjZkYnB0cm0yQWVzVys1dEcwMlo1czM5ajZuWjV1Ly9tVkZIMnVHU3p6YnJVT21DOTBYcW45ZnRXd2FwWXpDNkx4V3d6dXkxZVQwYVMzWVZiWEVNdTRuSWhKVVRGQllKekk0T1ZwbG1aeUdLM0VNdGJ5WmxEWWx3OEloNkZQSFZiVHhncjRhSXdDWWZjVTZXV1Z0eDJYbW8wYzJqVzh3WVdZODRIUkdiVllOSE4xbXZ0TDJLSG5pZkF6Z1VaTWdpMGhNa1RVZ052VW9ncklPR3d3M0ZlcXBBT2RQL2w3Y0hubjJ1NTlxcVJ4SGZmNlYxMjVacktYNzk5VmVYaWVla0hQaEFPTDM3dGhvZCtsVExqNXNjU2Y4UlZqeldGeGg3Z0ZxVTN6bDV3dVZtZ1VYYkIrSi81djhLK240Zmo2a1dISEtPcEI3TmV5dU5oYzNmRDV1NzI1Y2FFV0ZhL3VOblNuL1d1K1oyd3VjbTQzTG84clNuY1lWN2pYQnZxekZxYnR5bjE1dFM3UTJabkdQeGtaRm93U21zMTVnOUVMMDI3TlB4YzJuTmhma1BhaHZEMWFkZUgvNUQyaDdDWWE4eXhwS2VsaHlzczBYQzlzZDVTa3pZbmZKVWxGdDVpdVNadGgyVm4ybDdqdzVaSDBwSmtvMndSMDhTdzMraTNlTktrdExEUndtUHZDcC9xVjZMZFB0enQyd09uMHNNa0JtZUtJNm81VUJGTXhzbjVMZzdOdzlRZDV3ZVVLRDJMTitBV3ZCc1B3Zm4rQ0RiZy8rVFZRSVVkVHF2NU9iTHYwM0V2OXFwSjNxaTNYc3FNQkFxQ21VUDJ1SjNZNi9HbkRrMkIvdnhmNmpaZnY3UnhQMUpuTkxHc0R3NUdVT2YyMGx4alErN3A1dHdUV3QyYmU4THByZEJjbG0wYmFTQ1A1TlNMUVI1SDlmcFB3MGtWYVNBZXFPRHUxV0VudlR1cTJwd1ZGc1ZaWVdURlJ0cytWSzFtYUxOVUdIMjBKRlhrVHYxcDBsMHRLWU1kblprWjBFOVpkUHIwVW9YWGtodEpkTHU4SHA1WkRzMThGbUFsc0dmYmJiZGZkRW4wMEgrMmJOdjY2USt4QzN1bHhMR2thNis5Zm41aDNnd2NmMzNnbG5IMGJPTGp4RHY0dHltM2I5OXlhWFIrc3JOZzFvb3RQKzU1WWMxZlg3TnNhQ3RMcTRobUZLNVovOHl1NjM1ek5jYlVmdklnNWh4aUo2RmVOVndvRi9GRlFvUGNBMmVNM2JJa1lvRms4QnlSa0VHR0l3bS9sZTRQT0Y4MWloS2NTdEJXNmlWdzYrQ3NEYVNIREpMZGhDZCt3OWpqdXRRdmJkeFBRT29zZ3hpRDgzY2xuRWhPNkRHbmt1MXNFQkRMYVA2QWY1OVl5SDh6c1loLy91elpmMXdNWEVsd2F0b0ZYSm54OTFWbkxwY3JLcVpTRTQ5RWJGSURNNk1pWkVzalVITlQ2bUYvR2V4S0g2Z3lQVlg1NFdLZXVFUDBUcUJXZmFVbk5jb3JjSkZrQ0R6bUFITEwyU2hEbGo0eWZtRCtUUDY3OFRPejhMTHdxdkZsODN2b0xmbGQ0enZtajlIN3N2d1kvMzNoTWVORDVxZjRFZUVwNHhQbVYzaTVnRThUQ28ySytYNytEdUYrNDExbXcvTW1YbEJHeDR0R1JLTU1kWWw2QllmTUNvSnpxb0tSQ3lSdGhIeW54R1IwbVV4R1daUWdSNU5kQm9QTW04em1FbzUzY1J4dkVqbk9ESGtaYitZRW8wbVNEYUpCa2dRNER4SUlYMllqbkNnaGZvRVNDZzNZTUlxTFZLTWlQbU42UmkyRVpJcmVtaFY2VGlUWWI1azRDZ2I4QzhlYUE3NnhzWUIvck5rM2NScTBzOGhsMXo4c2JzRS9CN3NpaDdkaW03Qnc2dkh3d2dwc2wyb05mamJvT3h5OWJHaW1KMEVjd2tsUVk0eGppUWR4NFcreEdYd1gvd0huSkI1SXZBU3ArVzloczNOd241NkRST2Z6T243ZVAwWVJIaitadUpxL2Rqd0V5VU5BTmVPbkVBa0l5TTlmRkdXUDJleC9Sb1gwR1JrSEZwTEU3MDVjZmZBZzNTUG5qMy9JRi9BWG96QXF3WXZVRGlsZ1NCRlNQWUVGeWZOUzVtZjgydjU3aHp6ZFgrZS9MTExHdnpaeWMrUmIvanNDZXdPSGtsOE92SkpzRmtXTDJ5UDZQWmxpdHJ2SnY0bmNUUGFLVDRndmllWm5vKy9hU1dwNlNiRWp6NUt1NWhaRTA5VzBMTGo0VTZQZDZlZlNTWG9kZXpwU1pMVkZMMHJGOUNsT1BQWHZxWHhxYWg0dVJTcTAwbWQ4QkMwUHFTbU9xcENhYkllTEx4QU5qWkwrSjNqSmJESG0wVjBhK2xnTjNhd0dqRHpBVUZXWGFWcHh4SkF0WjFtYWd1WTlaaEkwNDNFNDZhcFdUOVFjV0J6RjBSYndpRnVMUUxTbDJhRlZYdng3TDE3c1hlWHQ5bkplZjJsbjlVVE9DRkZ0dzhsbW1yVG5hbmNuYUE1NUVqUUVMZ2NKR0l0MWJNZktQVW5QOGFCN3ptclhQSEZETTQxSW1SQi82RjdGdVR6ZUVBMUpvaGhPWTJHcGZIcTU5bndIMDdUQTdmTFFvMjM1OURJY0c4Lzk1ZXRQajlaenlSbUpqMDEyaVp2M2crWWZQTFBpL20vOTlKS0c3dnBsK01ycEg2ZVhOOVpjVWx0cU41RS9GdHgzWjlPT0p4T2p0OXgwU1VxNTMxQlhON3g5NVRmclV6S1VsRXRyWnlWKzZTenhaVmJPV2xFU0tVK1BVVjF2QTEzZnlmS2hGUFNkUThnNWZsWXRObFdVSjg5TkpzNFY0Z3JqQ3M4S1gxUEtaNUpZeHMreXpFb3FTNjdsNnkzMVNiWEpkMHJmbG8xbUsvZ0RDb0NJaHdYSlJTV2RaRExaa05FYk1nUjZwdUZwOW16Q1JlREVtZzIyMTRNRzZZNlJXcVZKYzBQbHdwTmpsWDllQkhtU2xpV2RoQS9Oa0RiQVlYUk9vMnBhSTY0eHJ2R3M4WFdtQ00yUTNiSHNIR1RuaFBNcFNDelRuUVN4V3d2dElMTnQySC9EOFBPSnhOaWh5L2VyenVqOExjM2Z1SEZ0N0dZNFdweTZNL0ZCNHUrSlU0bjNMbTk2Z09ROHRMaG56Mk1Idi9jZEdwZVh3OXFyd003OTZBL3FwWTIySm1lVHA4UFc2ZXowWE92YjRyK0gzR04reWY2UzcxZjJkM3dmaVI4WlBrcjZ5SDFXVEpxUk5NTzl3TG5BVStkck1uZWFwWm5PY2srNWo5c2tiTEp0RTI2MjdmQS80bnpZYzhoNTBDTmJtZjBsUjJuOWhOTVZ0WlphYUl0L1dwVFZOa2ZVY2hqenlBZ3ljenBNU0FWVXBBSWVLdDBOVm5nWTRoa1BYWXBYd3JRVmgxQ2hoUUtXMEdJcnRnYVNwWkRMSDJpc1B2OHNHYzcydWFkUDV0TFRmZk9KWE8xd2Y0SUdFMnAxSUZQdE9NL01hbnE1SUdvUG1CSFlJbCtjK0l1MWJYSG50VnV2YmxqanhxN2MwNy80S1BFWDdEbjUvUHZrazVLbHkyNS85SmtITHU4dS9NbnpPSUo1TE9HTWg2bmRMQVBadGVwMnMxdk5kemFKVGNZbXAyWXQ5NEpwbkpYbG5tbUQwOGhNTG1xZTZZNzZGM0ExNWdYdUd2KzNaZG5Gek1WRXJVYTFtaVNyRFZSaDlHWmJMUkZNTGNWbVE0SGJxTzJFRFA3VXhzckpGVzQ0bzFrTTI5MjBKNUFzK3dOYnNYU0tuY1pPcDJZdFluTlRLRlNtTDlCWld1S0ZFOEZVVStGYkUvK28zci95eWNRL0VzOFAzNEQ5WTg3Q21tdGF0OSs0dG4zYkE1YzM0VXpJZ3F6WWZ5ZXhuK3Q1OUpLdWgzN3c1UGYyd0hxclliMlpZQ3N1bElLL2Z3alp3VS9xVEJYZmx1K3ozRzEvUkhqWStKVDhsR1UwWURDNDhEd3lWNnd6THA3MmlPV2dlRER3c3ZFVjh6dkdZK2F6MG1jV1M0b3R4YTBtcDBiZHF0VVJ0Ym1mZGIvdTV0ek1HcVpWc2RycWhacDhVNFhVMjlsZ2JiRVNxODlKczdXRC91UW9Mbld5NTBPcGl2YWNLQzFicTNQenRkcVh3bXJWQnNGeWlMNU9zd1BicTV4T0VQTUliM0w2cUxqVFRSSUs0VUszWmtTRjAxWk42NTYyWnhvL3pSWXlxQlpiRkFTdXg3cmNDeDRZbllSa1RYWDUxQ3hYbFUrZFpvTUxCRmdmamNRczE2b2FZOG1jRTVnQURDZGxCcENjZWlDbTlmQUU2bWw5VzJNRUNEcWNGWlRwWVMrdDRpT3k4V0oyV3gycVlodGYwd2thUXB2WjlGWVZwR1NsazFycDlGWVZoTVUyeHliMjBCVlNTdGhyUzlsaEhxSUZwaWF1UU1KSGJSeHhJWllHSm1sWm41ZDhqbjNUUDlxWCtNdE5uZGoxNWtuc0ZNZFU3b2JXMlNzenVjMHJycWlzeEhoSjRYM2ZlK0wyMzRJdDVDWmVUanh6N2E1NWVOMDFXK2ZNNldPMm43aVViMkg3WXlFdVVWczJwVzVMSlU2enBhZjRac3RnTWE5Z09PTndSYmlVbEhJcW5rUG1jRTIySmxkVHhvcnNGY0RxV2NmWkpNY3NTNmxuVmxacEhxVDJudnFzbXJ4VDVqR3Y4VmJZajB4bWl5bkhiTW0wZXJ
              // 6dWZJc1prbE5mT3RYL0Uwei9UTTFXQnhQUmlNbXMxVms1bXZyREdWcGRITlhNUUhZbnMwMXRsVURkTFdqTHBKWFZtRS9Od09TV2ZINHhKOXNVQ2Zpb3k4bCtmeUJ3V3pFdUJnY2NWWTJvTkQzazlCZE4rdDVwM2Z2c0orMWpKeVpDOWRocC9SUitJaGRTSEM4N2oxWFFBdWZMaVRDK2dmbW1yZFBWbWJFMmUwMXVaNkZJSTdsWDhIZ25OcmN5Y0ZOZFNkNnlFQnhMU1ZpQjNUREpkZDVmdCtCcVEycldpcTd5akNUTGRVZmV1WFkxeHMvK2RCQkxGL2M4ZFZ2aXIzODg5NDJXdGJkdTc0aDlveTV6aG50YXlGTWN2dkwreDUrNDdXMXN3b0VmM1hWdTd0T0hyNm84ZEt1VmZPT0gzL25lZHg4YStnNkk1RnVRanpkQjdQS2dZVFhYaG9PNGdpckxQaHZQZHZ3Ty94M0xrdUFSMGttam84TWhZRXlTWEE1bkV1Y2kyRVpGbDhwSnN0SG9jaHM5Q0ptTUVZT3NLdW5SZlRJZWw3RWNZTzhBUFducDBkMitJUi9wOFozeWtVOTkySWRjRVkrYnVTYmdEcm54S1RkMis3MVZtbmpoTEtRL0NBVG9qSDdIWWh4TkkwK0NUTDBzaHpCVWFtOElNZDBFcHhFMzdJWlJGdEpGQ3VMSHRqL1Qrc0RpMU1RSHlxVVgxWFdWSnVCVU8vYitubms5MjI4YnU1MFVQN3l5ckdiSHpXT2Z3S0xCZnRrYlZQYUVUVUtiRGlHWlBsTnpHS3RVdVVFbWczSmNQaUlmbFQrVmhhRGNJbStWaDZCQjRFUUpDVHdIa1ZwbFQ5STQxQXo3dmlpSUVtOGtFdXdMek9KQzZWSGViOURYZFg0ZGNCYUJFL3o1eDRBUXMzdHpKMTRlM2FHOVBPSVBZajV4N2g4TCtNZy8zZ01ON1FBTnJXTFBOZjlBbjF2OWRzVGlZRS9iMUd2OStWR0pzM05KWXFhOFJ0eG5mTmI0aXZ3ejQzdEc0MUt1aFNNV3lTZlhpWmNaTm9yQ1FmbjMvRW4rSFA4M1VWZ2tMVEtzRWEvbGIrSHY1eDhRN2hQdmsrNHpHSU84VTh6bGM0VWNNVWZLTVJSYTZ2bDZ3UWlKRnh5cURVYkJLSE1pYnhKNGtiNG9ONWtNa3BFekdrMzhLRm12Qm9SQ1EwVlF3bExNUWt3UlBJaHdFQmoybTZ1K3BpZUpkTjErKzVrTlB2QWJlZ0NZZUpSUlZRbGVzczF3cmYxRlRaV1E0YVBlWnUycEkwM3FRMWh5N01CK1BCK3ZUTnlGYjBxOGtmamJOeUNoUDRNM0pyNCtkaVgrN1k3RTR4TnZ2NW51bHJLbm8ybzIxWnpRSUpCQklTNGNFWTRLbjJxUFJMY0tROUFnd0FJNFNESzRDRVlUT29MOC8wczYwcldpdnl6WG40QmVoNUI0TDhTNVREenJFTW9HNm1hWUMrS3EyUzE2ekZFdWFvajZvdUVhVW11bzlkV0V6UXBYbUwxVWJza2V6TjZUL1FQeFlXbXYrUW54Q1hNOCsyajI4V3dyeWk3TWJvQ09aN04vbnkxbXE0R1VhQlhjRDdKT1FRcnhVaURWUXdPVVVhSVp2VHFObCt3T1IyWnlTa29rMHdpR1pyTkhuQTUxWlZtTEEzZUQyWXlTT3RVV1NJNmtwa0JiZHdwdVNjRXAwSFlnSXhMSnBEbkVNRUtaYkZ1VnEyaXRUZ2UrTXdFMVU2MkdVZ2tsUFRPYXFjNjhLRnFZK1hybTd6TTVXMll3Y3pDVFE1bEtabEhtZUNhZjZjLzZVK1ZFMHE4L1V0RGlYK1VaMk1IZ2NIMW1RM051NVhsSFpXYytDSXRUM21EMTV0S01IK2NtaGR3MDVmZXl4Ti9yWVk2Yk9lbTQ1MzM0T3N6dE9yTG03cUs2QjY4WWVEQUxQRGsxODlKWkhRV0pENlpWVGEvdXlFOTh3RWR1LytHeTVjdVhyYnFpNXQ2eEpyTHF1d1dWODNiZG5TQ2s3djZWZVhVM2ZudnNIT2pzZGhyYlFHY2V0RWYxU1VuZXBKV0dEZ00veW1QUWxyM0dVR1A3eUM2SUxKQTVKS3RGTkp0TWtId1JIUEVnRnNqZ3hFamZkZitUUUdZMFJjeFdLbCtMeFR3Wno4ejRGT3hjRjhZekpxa3ZoVFRORFNieXR0QUZBWXdKQ2NJYTM1VDRJUDNTaXZuOXVSQVdoRjF2TnQrM09FaW1QUjZiMFhEamNDTElSeDQ0TUtmanhxL1JLTFlFTXJMN1lLVVd5Ti92VWVkOWlEOHdmSmIwbVp0L21Yd29FS2RmOE11a3liNGlhWVdueVhjUHVWZTgxM0NQZVZSK20veGErSTM4dHZrRDRRUHhRNHY5WWNQUHlNL0ZGd3d2bVlVQnd3N3hSZ1BuWUZabzhsSVJ1WGpKVlNFRldwSjdra215TllRdVNMaTFZNHVXaGs3c2RYS25mUTFrb1owK0h0T05EamNuUloyd0xPUjJ3WkVsUFpJeFpWZGJzblBzZ2YvQzBjU3JuM3dyOGRsT3JOemQxWFhYWFYxZGQ1TzBXN0M0TS9IeXAvK1ZlT0hHOFVlKys4Z2pRdzg4OGdoZDc2N0VPdjRlV0s4ZE11NzcxSUlaU2ZPU2lEUEtWVmdxa3FMSk5keDh5L3lrbXVTL0o4djAxRGFSaVorUi9wNXNBUCtaZWtMem1FeDJtM1hpaE9iSXRscHRFYnVkcGQ2bUw1N1JGcDZzQkVYYVQzenBsTVoySXJxNzAxUGFsTXlidnFWMVUwdEgrakdOSnQvblY3MExpNlUvdnVvUUpvbHpoeHB2V3d3cTl0eTZadlVOTjdldDNRNnFiV2hQL0M0eGxqaVRlTGR1K2RoSDNLR1J4NzR6OHZDRE5QdStITmErR3RidVFLbm9PMnE1czVKRUxWRlhaY29DVW1PcGNTMUlNZlFFY2FyQjdZMDJDVTNHeXl3cmtwcThUWUVWcVh1TmUxUE95bWNzbjduTURtUk5wa0xnVFc3dG1Dclo3S0lQamhqVG5ObHcxb280SE95WUt0OW14L1pBVUV0OXpreFovK2t2TEQ5M2d5NkFUcUhUdUNhcDA5dnBYNU1LQXNBT2thVTAydG1LNWpRNGV2N2d4YzB2LzhHcUp3WjJZdTdJVmZkWFlpNXg2cWIyTlR0dWJHMzlWbUlkOGN4ZHVuMFB0bVBZVVZaZS9wM1A2N2dEMzkvellIemYvVCttWjlWdENISGxUUHVQcUZuM0NGaTI0cVhDR21GQTRBcWRqZFlPYTQrVE44bzJjOUJNYmpPUG0wbVZlYkdabUVmSkpqVmJrc0RET1NJYXM1QnNsNHZrSHBtWEExdWRlNXhrbFhPcmM1L3pxSk4zMmxHRVB1TUNDeUJrRUEvUmgxeU9xa000QlUwYzFTY2Qra3l6ZitFSjVOUE9ZT0RmRlNXYU1XeEE5WEh2MHZwNEdYdGpYektqaVgwTFNMTUZyOFRjM0lHSHFFL1B1YnFtcGVteXVSZk5XbExJUis2NXVxYnNid1hWanliK0M5WllCQjV0aHpYbWtDNzF1NkpEREJzeXZRNXYrRjdudmE1N011L0trU1ZYbllzNG43SWNzcjRjZWo5ODFuSW1UY3kyTExmRUxIZVo3bkUrbkhiSUxGV0gxZlNheU5xMDlzZzI1emJYelduZlNKZkxJN1ZpbldtQlpiR3RMalE3VFVwTHo0eVVtOHRDWldsbDRiSjBTVFFLRGpua3MyU2EwOUxTd2xKNm1wclhaOTdzMnVMZW1EMlFzOTE5WTg1OTdydHlEcVFkQ0ZzRzhXM2VXM3pmenZsaFRqeFBUQnNkL3huTnZFTjZuY1llN0tmVCsrTWp3WFR0M2g5Zzkyb3lBRmRiOFBTMHVyUjdMWGVtdlpqMlZwb1lTak5iZUQ2QTlOd2VsZElzZjhTYlg0WDFZeEM3VDh1SXNtZjFxYkJmSXF3OXJlZGI4Q0EraFRrRWxrS2YzZk1NTThrRG1CaXJQWWpIcS9oVFBPSHJza3dlRlliMmxIcFZHTmVyd3FCZXRhdzg2cVZQMzd4cVJqWmNZRnliTjhnZWRQSGU1UUVWSXI0dGdCc0M0d0VTcUV1U3ZDR1BHZ3BIUFdwS01CcjA0Tjk3c0tmVUVHckl1QzJEWktpKzFHaEdnRDVsVTcyd3ZUYms0YUk4WEppSDg2YUZpc0NIU25FSTZWdXc5dTBHWTVXV2dNZ1dTRUJ5TjQ5U3l6b0gyeXA3cEtadkZleExJM1REcFM4T210bWJBLzJJUVcvcHR4WjZ0VnQ2NEpoNFFLbzlXdHNBUDgzYXUrajA4VmRWMmVTc3NtWEJCVFR3eVVGTGhkbGxycURnc0ptK08vaDR2Nm1DSFIweGZYRzRRWDlMUUw5ZmxSbkpUR2R2Q2FqelRuMUpRTDlRVHAvVUZlR0FzNnR0ZlhtR3l6MC84ZmpsMTczMy9udHZaU1UrYzZ4cTdDNVNVaUw0dWFiRzA1KytPNFlMYzVjc3owb3BWTnd1Ui8zRks3Njk4K2xiZHhWZlBEdm9DVTl6cDZ4WlVIL3p0MzRaQjRzUGpuOUliaGUrQXp2WUw5UnNCY0hSMFpodG0ybGRZRzJ5U1g0MzhuRWVOL0k2azF6WTZ5UXU3T05reVNpWmZWVFJOdVFkOHNhOVhBdFVSN3ljZHhUencyNU1BL3dJY3RQdmN2YXJWck5KTGpRV0lqaWxyZ0tQQmd3MXk4ZEZ2TTdsN2lyWEh0YytGOWZpR25UdGRoMTFuWElKeUdWM0thNGlGKy95QnpZUFRhUSs5ZkZ5OE9sWjdBdExydkVqOUVYRE9lMDlnLzIwbjRhQmsrdzdvSUI2QXBJZVI2a05mbWc4d082d3c4Vms2cVZDb3k5ZUhPR3kwcklNQjdubWlDa3pKWE9CYi9YWEw3bW13aVJmZnowTzhKSGppV1UzNUtZa3Y1ZFRlbWx0OFYzNDllTnYvaUN4QStUelRZZ0lTL2tJWkRNUHFON0xIR3NkZHd1Y0xQckZTbExwcUNmMWpnK0l4RTVsRHQ3a1FVYTN5MldVeFNSWHhPMUdOSmhaUFN5bjhlQnhNTngva2RQSWhzbGt4b0JQR2JEaG54L090QTNoQzdsTXMvYTRLUUtMREduTG5qNmRndHlpbWM5MFh2M29KZGdmWEZJMXJ6Y0grL2NzWDMzbG8zZVRvWVR2ZUd6VzRvRVQrQWdjZDJDZEpzamFWc0k2VGVnL1ZiZVFGU2lNU3ZRaTBvdUJYdUR3YzJ3RWFuYlFVZ0l6by9meFdPUk1Cb1BSYklMVEpIRnlBVGxnVEVQNXBwZE5abkMwVTJwV3FoSTFJc0hrUW41VEJzb3hSZEZNMHpZa201Q1JOeGxsbVJBc0FpeFgwS2VScWk4bEsycXlCTm4zYlhpTDF4dXdHNnVNaStIUU0wcUtWQk5QS2t4OEZiK1k1L2pEcEFoU3hFSFZaaTVEV0lHQXhHRy8rVVd3Rno4MW1GemZ3cFBOc0ZNMCs5bTdFSGJQTW1RNys2NElkbGJReEhoRGJqTjlRS045eXcySGtyejAwWGNTbklDZVRDekRtYS9NOUlwVysyczRsQUNCalAzeGlWcFBmajZaeGs2Rk1weEhab0NVelBoOXRSaVpzQkdKeENnSmNqTHlrR204UXdoSUxubWEwV0UyczlkWllWTUZWeUhPNCthSjkzTDNpdXg1ckxvNWJ5NEl4Y1R6QWkrYmpMdzVHUVY0aitDUy9VYTMyUnhHV1h5bWtDOW5HVFBOeGFoY3VGaXVRM1BKWEdHZU5GL2VoRGJ6bTRUTjhtYmpKdk0ydEozZkpteVh0eHUzbWQ5RjcvSnZDMi9MN3hyZk5uK01QdVpQQ0Nma2o0MG56SDlIZitmUENHZWxNL0xmaldmTStjTG8rSnVxbkR3enlrZmdJbytPdjhmdWpQVE9QTkdINkozSUhoTFAxTDVUWWdIQXBNSkZmL2UxVUgvM2RZbGFRdDk5L2F2M1dhTDJQc3RZYUsyeUV2cFN5MUF0WS9xbFo1R3NSeVlvS3VLdzlZQ0MvWllYRCtHQXR0SFQ5MW42Nnl6dGJWYnovOGJyTEJhQ2tSWk1XVXlGd0l4b0pENWdVaTBWc0o2end4YjZsYUN6RUlaTnFwbTJuSUl3ekdtVlNOLzFtdWpkOFltZ3pKN3AwWnlDR2tjUy9ZZERISWViRW5Ic2VQbEpiTnYvTSt4T1BKYjQ2NU1Id0VEbWtWRmEvdkVlZVd4c09kaUlHVHlwaFhvU0hsUjNaVW12OE9SZTZSRCtEWDViT21VUkRGS0E5NGxaWWptYVlaaUhtL0RYOFlCa2pPQmNhVHFlS2RYaEJkSzlwclBpV1VuTzRDTlNqakhLenpUTzRSY1pYK0FObHhpWDhVM0dkbjY5Y1RPKzFuZ25mN2QwMlBnMi94dmpPYU9GNHlWSk5ucDRoYzh4bHZKVnhqcGVkdk4rNDB6akl1UFZ4b2Y1Si9sWGpXZDRXWUxWampoOTFIK1BqVUNleXRQRXdHMTJSREZ2bEhpcVE2Z01TRGJRTHhjZFA1aWRIeDJuYngwQnllWkpqM0lSSXJzSWtRWFJaTks3VDVrd0JWVXZkSnNpU0hBaEpJaUNBSG1lUVFZbkYwYkorbUd4VktaUExFeUcyR0xMSHN0eEMyZmhhRE1wTmRGbTV5bnRJYkgyeGZuWWVTL2U0S09QL1B3TDdjMW5HSVFLSjcvdlJiL1ltcnRoNG5XbEJrMDgvZk5XYUdiUXZHRkRMNmFYVXN6MGg2bjJ6SGhyNG5aODJkTXY0UVdKZS9HT3hNUEgzaU5od2lWK2c5TVQ4dGdiZUg3aVNSb0hyWWxMK1NXZ3ZTUWNQZURNRW5BU1hhTFBiSXNhUEJaYlZLSVhrVjRFRDdRUjZpSkJpSVdDS1BJV2sxVzBFNVFrOGttRUIydUJRMDlTQytRaG8zaWY2alRaTElYV0xLUzRpOXd0Ym80K2ZtUFpWU1RLbnNvNVU2WkYzZlRkZXdXbit2elJyZXgxYjZZcUUzWkhNS0YzVGx5QjFKVHBVZjE3RDY0WDlUMHlkK0dZSDY0MDltbGZCd2FwOUM2MG56NEJaOFBtUXMxdklPNXAzMWRoZmlOWjJmTlIzVjJhNitOMjJHSm53aFk3ek52UjRYSFF5dmlwL1p3ZHM2OEQ2MTlqL0ZDMVdoeFZTZllrUDF5Y3ZpcUJtaFBjMEhvWTdyV3htalJua2F3Y25FQXkyWXNlSzg1Tm5NWGh4STQ1R1hNdTI5cHc2U0wvN0xMVlYvckJjYXprcitmSW9lYlZGNlU1Zm1QcGE5Sis3WjY4OGNtOWd5dC90OHBXK1RlRDM4QitTL0hCUDFXeTN6NS80cUxoMXovLy9OeVl2ZGF3bXNYaWlkL3FoNnQwY1dJUm1tTkhuMytldU5SZWUrRXY4TU5QdmdoTnBBS0dmeFQxUVgwSDM0ZFdRSGtRU2ltMHZTcThETmI3TXJvYlNxdXdBdDNGL3duZFErOEI5eGFvNzZWdHJIOEZXZ0I5ZWRJM2tjVDNqWjhFK3Zsd3Z3M3E1VkF2ZzdxYTFYOUMzOUxuMlVGcktSVmRCMjIzUTFrQ1pSZVV5N2xVUmxjRTh3ZmgvcHNBbThRS0pFTnRobUxWZVYrbmw4TlF6c0ppejhFcXJvTVlBOExoVndQWFA0ZlZSeEV5QUk2Y0ErVWxoSXozSVdSS1E4Z00rSlpYRUxMbEllU0FmaWRCS09sRGhGd3BDSG1BM3NzajVGTVI4aGNobEZ5SlVBcU1uUXBsMm5jUkNvNGlwS1FqRkRxR1VOcnpDSVdIRVVxSGcyQkdIS0hJblFobDM0eFF6bDZFY205RktPOEFRZ1dBVjNRMy9Yc1BUUHI1Nksrb0VyVWhBV3pWamdwUk5leWNDKzNyRU1lK2w3K0t2d2JSMy94aHY0VEtyaHpUb3hGZnJNTUVHWVRmNlRDSEdvVWpPc3dqbC9CTEhSYVFUL2hRaDBYa0UzMDZMS0VYeFNJZE5xQ0lOS2pETXRwcGVVU0hqZnp6YkdZS205QnFhNGtPbTlFYTY1MDZiQkVQaUtkMTJJcXVzSDQrYVZkYmJTc21iVSt3L1UySENlS2RFN2JIb1R6bmRCM21rZEZacGNNQ01qc1g2TEFJOEdvZGx0QnFaNWNPRzFCU2trZUhaVlRyeWRGaEkybTF2YTNESmxUczZaNzhxeGFsbmlFZHRuQXJuVWQxMklvS1BHOENKNWluVXJkNkxUck1vNEFYTTVocXgrak4xR0VlZWJ6SkRCYWhYZlJlcE1NOGNucUxHU3hSdlhnWDZ6RG93anVId1Fab04zdmJkSmhIUHU5bERKWjEvV3F3cGw4TjF2U3J3WnArTlZqVHJ3WnIrdFZnVGI4YXJPbFhnelg5YXJDbVh3M1c5S3ZCbW40MVdOT3ZCbXY2MVdCTnZ4UTJNbGw5VFllcHJMb1piSUoycC9jdUhlYlJOTzhPQnB1WlRFWjBtTXJrWVFaYnFlVjczOUJoSHFWNGY4cGdPeHRuUklmcE9CcCtFcFA1U1IybU12OERnMTJNbjNFZHB2ejhONFBkME83eStYV1lSNHBQMDYrSDR2c3FkQmp3ZmZrTTlqUDhwVHBNOGVjeU9KbmFnSzlQaDhFR2ZHc1puTXI0V2F6RGxCOU4xMEdHdjBPSEtmNjFERTZuTnVEYm84TmdBNzQ3R0p4RDVlTjdVb2RCUHI3SEdKelB4dm1aRHROeG5xV3dZWXI4RFZQa2I1aXlMc09VZFptbjRKdW40SnVuNk1VOG9aZGxhQXZxUVRHMEJyVkNiSXBCNXZGREtNdFFCNE1Yb203VUJhVmZ4MUxRSExqckJaaGVXNkc5azJFbzBMSU82QXNBcW1IdHJmK1hJeFZPY3FhZ3BkQ3pEZzFNNHZSQjIzeW90Zm1LVVFWOGlpQythbEFKYTYwR2luVlFMd0dhdGNCRFA2TmFBdVAxUWVsRkcrSGF6bmpvZ3I0WVdqL0pTUy9NcXdCV3F6NlRodDhKRWxLQWd0TFRFYnRRSHB1RjlyU3ltZHIwc2VqZlA5RW8xN01SNlFvNmdQdjFiTVJPNk9sbjJCMXNMaXIxZm4yR1ByYkNOa2Jiei9xNzJDaTBwangxTXg0NjliWDBzTEVwUjIyTXF6NDJHKzJoK08yczF2Z2ZZTE1wYklhcFhIV3k4ZnVodjR2ZGIySmpkK2l6eDNUY2JqYVdOdmRFK3pvMmRyOHVrVGE0MHlUelJieCtHRFBHcE5JSnRUWjJtOTR5d0NSTmRYWGVTcnFaWG5xWlJOY3hlc29wdFk3MU90WEVERzJNZnFNK2E2ZStVdHFuU2ZPOEZOWUFKaDFOYXowdjEwNWR1dDM2U2pvWi9nQzdPNi9WUG1heDZ4aDNYMjBURTU3VE43a1cycmVlalhkK2pGNlk1MnFkMjFaZC9tM01waFhkN2lkazFzN21Yc3RhTmZwTjBOT3A2NURpckFQZGF6YlNEZGUxMExkUmw3WTJ3bmxmYm1XNjBxeERZVEpzMDlmZnliUzJqdUgwTUQvVHJMR0xVV29ybVdyZG5aT1dwVUQvWmwwejZ4azMxRFkxdmZYcG5yeHVrby8xN082ODlmWi9JZDcwZldGOWJmb2NxOWtJQTB6UzdSZllaZ3h0Z1BZSnlWTGJicHRjNFJwbTJ3cXpnYzFNdG4zTTd2cVpOdFpPYXAzeXJ2azc5YVc4U1cvcTA2M3NmRHpTZXRjempiU2lheGk5eGpVZHQ0MzFucmMwYmZaMkpxMGU1aVZiSmxjeE1UZWwzOFQ2VzVra2V2VTVxQTlwVXV4bjlCTWNUNHpldzJ4b1BZdWhFN3dWZkNtdXpyeEFhN05aNUd5SDFo
              // WDZUQk5SbGtiSkdYQlZVQmFNUWFYZnl6eEI4NkRzS2FQa1Q0NnlFR3o3ZlB1UG1hMzM2cjYvbnRuUDFaTjYvaitOKzVwdTF1clJNS2JIdVBPeFNodDFPZXdKQ21wZzlBcUtzUGtXd25VeHpMMkdXZStFMUtoOTlqR0pkK2lqRmFCRmdMY01kcEE2S0hOZ1JSUmVESzJVdmc2dWw3RDJXbWhaQ2xmcUIzTmg1NmlGejBMV3VneFprSkdWWmN4eSs3N0NycFhKZG8xalRYczl1bjdQKzhPWDVhUHRlOTBnZzE1bUlSME1lMkk5RTlGL3dxWldzOTR0Z0Q4d09XZmJaQnpWWkRmQWFNL0h2NWp1SVRSS25ZL1pXcXpvMU9Oem54NC8xckpSWXBQeGw4cTJTWitOUnBLTmV0eGVQYm56YVhQMi93dkpURmpacHNsSUdOTzlPemJwUDcwc1Z2WHJzV09OYnZ0ZkphOEpqNmNTaTAwWjVYekUrUEo4N2JwOVVWdGV6YUt3eHZWcVhUTmQrc2hmcGFGTXRxb0xKYVZGL3k5YnhaZG5ub2lqTkdLMnNxeW1GV1pkcDB1N1Q0OVgvMnp1QW1iN1hWTmkrcFl2NlNLbVp6UlRQVWZiS1ZvWlJ6MU1zblR2Nm1UKzl1OTFydWkyMkRVbGprN01TNzIvblVtNmM4cU8xVHNsNjhxYnhPNmRZcmZuODRSL0xTbkszWG8yL29SZGRWOHczaWFtLzZ1Wk5xZEdrNGxZZkI2ekczQzFPRFBBSkU3SDc1aGNqOGJYVk90ZXIwZHZUZjZhVi9YbzluRSt5bDlvUS85cVJlZnRZejViKzVjMU41SG4wZjB0cG1lRDJtcTAzTEtOYWJYckN6cm8vWUs4ejQ5TTE5Zk5zcDkyUGE1dVpIbllKalExay92MzJwOFlUL1BKbUo1dlhMZ3JUNHozWlQxcTBqcWZIYmV4TWIvc3h4TWFhLzJDck5mOGo3ZzlMK1V2ejNCaGJuRWhSekU5WSs2SHZYSmlCTHJMVkVOclBxSzc1QXdVUmVXd015cHdMWWE3ZkRoelJLRVVJWHJPWG83cWRjd2k2QzJHbnFnT2w2TlNLSlJxT2lxRDh3a3RkUFFPbHBmMHdIeUY4Tm5FUGdWc2Y3L1E0OXRZNVB0bit3U0ZhcGgzYnBxMEMyMFg3TlNqTGVWcENZdlEyaDY2U00rMXV2VXNudnFudHBQMnNwNU9wb0dsY0QyL2IxQ3JvcWNybWpIOHovZ3VaUGpyWWE1Q3VQYXpDRUYxVmNqMm5sWE1TclI4b21BUzgvL3RESnRZRHFEaHh2NmZ6RExSVi9nRmU1d2NlOW1XbnRpYTFyYVk4a05sV1VkTVdkamQxZDBQVGNxYzd0NmU3dDdXL3M3dUxxVm5YVnVCVXRQYTMvcHZrQXJwWU1yUzduVUR0S1ZQbWQ4RmRNVVZGVVg1Y0NrcFVLclhyVk9XZEs3dDZPOVRsc1Q2WXIwYlkrMXp1cnY2WSt2cElMMWJsTDVXSUlMMnpqVktlNnl2YzIxWG5sTGQyOW02VG1rRHJOWk82RnpmM1J0VE9nYld0M1oxOXZVcmJSMnR2YTF0L1VEUTE5L1oxcWYwZDdSMktkQzNSZWxlbzNUQ0xEMjlzZlpZVzZ5dnI3dTNUMm50YWxkYVlmeUJ0ZzZsVXgrcXMwdnBIK2lLS1pzNit6dUFQQWF0M2UyVW1zTHJXbUVPb0c4RlppYmEramZGdXZvN1k0RGRCc0JBNzVZQ2hZbWtlMk9zdHhXVzE5OGJhKzFmRDEyVW9HMEFsdGhISit2clhnTnNNaGJXREt4YkJ5RGpGYVpmM3cyVGRIYTFEL1QxczZYMjlXOVpGNXNxQ2FxY1BqcExySGQ5WnhmRDZPMitHb1p0QmY3YkJtQ2lMc1paZTJmcjJtN2F2Nm1qRTFiWUVWdlhBeExwVnRaMmJvd3hCS2JsVm1VZGlFTlpId1BaZFhXMkFYcHJUMDhNeE5qVkZvTkpOSEYzVW1FcHNjMndtUFd4ZFZzVVdGc2ZLSGtkSFdOOTV6b20zbjdkYnZyMCtkcUFZblZNR2VpTHRXdlNqRzBZb013T3RGSDVLMnU2WWNrd0lpeXF2Nyt6YXkxZGVtOE05TjdmbDBmVjFBY2lZM1lFdCt0YjE3WmUwOWtGUThmNjIvSTBvUUY1ZTJkZno3cldMWFFLU3QwVjI5VFgwOW9EckFGS083RFkzOWxIQjZib1BiM2Q2N3ZaYUFVVHRqcFRXOXJzN25YdE0xY0FFVFhaa29JWkpVcld3czYyM202cW9HeUdrazlSRmk1ajhDUEtzbDdRL3ZyVzNxdnBtditWN2NOcTFvSVp4c0RpbUZVQjZ2S2xTa05ydnhKUmxpMVVGcTlaVThCWWk2M3JpMjNxQUxTQ1JZdVh6YStiUDZkNjJmekZpNVRGZGNvbDgrZlVMbHBhcTFUUFhWSmJ1N0IyMFRLTDBXSmMxZ0hLbUpBMVZRd2RHSllINis1bmVwamtCM3l2ZTIxdmEwL0hGallQTlg4cXFkVmJsQzNkQTVTeWpkb29jRGZRMWM3c0Q2d0NUSXBaTmxoRko5Z3pvTGV1N1kzRnFQMFdLRTFBMXRFS3h0Tzltam9mVVBaZndBd1YyU1pxaERGUWQ0enFwemZXMWcvV3NRYWtmNTR2cXZqdXRUR0d3Z3hqa2c0VUNqYS9lcUFmaGdZMnU4RVBweXdvczIrQ0tURC9TVkZNRWxNYlZUYTJyaHRvWFExMjJkb0hkaldWdWtCWjNzVXNmY3ZFS21CTnVuTEFLVnFWdnA1WVcrZWF6cll2cjF3QktYWXhHNlcwcmUzdG5WVEhZRHU5TEhUbDBlWmVKbHNXRTc3QTFMck85WjEwUVRBSnc5dlUzWHQxbjJiYXpJcFpZL2Ntc0ptQjFlczYrenJvUERDV0p1NzFZTjdBUDZpcVo0dWltYnd1b1Fzbll2S1l2K2I4NG1qTTJ6QVE2MlBUUUxSc2kvVjI2U3ZvMWZsbXlIMGQzUVByMnNGV04zYkdObWxCN2t2THAzaWd5UmpFamZiemdYRnlqY0FXQzhkdC9lZDFUQmZXcW5POTVxdUhaU3hQRXVqUlFoOEk1bW50bjBrUmxpK3RWdktWckJuUjhteWx2SGhHZmxHMHFFaVdsOWREWTFGeGNUUUsxL0xTY3FWOGVsbEZXWVhGMk5IZjN6T3pzSERUcGswRjZ5Y1UzOWE5ZnFwUHhKU2EzdFpOVkJiZ2dzQVVqTFNrZXpWNDZDS0lXdDBRNHZPb2svWjJ0blcyS2t0Ym1XLzB3WjQxbytTZmpGM1kwYjkrWGVINmZ2cDN6QXZYOTYxcXBYR2lnRGIrYnhKc2lxMkQxdGkvSjZGM2hib2NHZllGajBzV3NVY1B2ZXdJMW5wQlR6OGF3QmJZNWorNm9IVU5TeHVudHRUcGo1dW10SEhidVdlNEY3bG40YnIvSzJmci9OSnNsd0NrSFF1NldlL0FCYjF6V2JvM2NWU2tCNklMT2ZnSTZxdlJHYUQrQ05xbjlxMWdGRk5iNXJGNkkxdkpoVDBOK2lPSUFaWTRkck9qeVQvai9nSU8rQ0IvTVQrTG44TlA1MmZ3S244Ulg4OVhYRUM1N0N0bFdVOXJYQXp0RjdacWorcXV2bkFPN0VCLzVNS1FhbDBvdFc3OTRhbitIaFdOWjlLL2dmL2xuMmU0KzVBTjA2LzZIZUh1SGJHN1N0UlI3dHNqdHFRU3Rkck8zWVVhb0JBVTV4YWlJMUFJNnVadVIxdWhFRUN2SDg0dkxqbEVnUkdqdGNRTytMdEF4YnZRSUJRT0RjRVZzM3NWQ3NYZk5aTGtvY04vWTlqbVlIUmZHeTZLYXNDSTNWZlNVTzNpTmlQTXhiZ3VGRVpCN2pxb3AwSGRCblVxMUt1NWRqZ3NVRDdWRVp1OVpCRG1xd0wwS3M0Tko1RWdWODE1SUNNUGNqVmNBQ1V6dElGaHF6YlB3SEJXVGttMWtadkQrUmlLamJQQWtTVElHVGhwdUNTb1BNV3B3S25LYlIrUlRaUy83Y04yZDhrejNFMmNoRnlBTlFoWTNxRHRHYzZJQ3FIUWxTd2JrUzBsdTZ2TjNESlk1aklRUzVDanIyZjNzS3ZLZFEzRFFEQmZMWmVDUE5CM05aZUszRkRYY2RPRzNjRWpUM0YzTUxSdjBWRmd2b3VIRGFXMEdyRllTNDVVeXh6OTZ3ZHg3bGFRK0sxc3R0MGprUmtscURyQ1phRWlLQVNFdWhVZytyY1g3TnhPZ0hhQ21uYUNhbmFDYW5ZQ0Z6dVJDSHJmQVQwN0FLZVF1d2IxY0p2UWJpaDdBT1poU1Bjd1NQQVFBOUt6U2c1eGZzNEhrckEvQmJMRDBCb1lrYTJVTTkrd000bWgrVWJNMXBLcVo3Zyt0QmdLQWViN1I3eStrdTZudUJ5MmxMd1JYeklsNkJtV3pTQTZyNllMSVBSUUhUekRwWERUbUNSU21RVGkxVUc0eDhqR0JSRW1yNUdqVkRya1RmSTIxUy85Zyt5cy9wbGUvMEt2LzBPcng0K1FveU13aXpwS2ZrbnI0OVVwNUgzNmk0VGt0MmdQUUlROFJWNkEwMmFRdkVkR0tSZmtYWElJVlVGOURPN2JvVDRFZFNuVWg0ZERyd1JIeWVnSVZNRDcvY01XRDEwc2VXRTR0MUFIZ2hrNjRFM1dBYWVucERxRFBFK2VReWt3eEsrZ1RvZjZPWElFcFVIOUxOUStxSStRZnZRSzFFK1FNalFMNmdONi9TSjVtdG8wZVpJY2hBTmtrSXdNV3lrTDhXR0pWdnVHUlZyOWVCaHBkdzJGd2FmSmo4bGpLQUNvUHhxT0JLRDFrWkZJZXREMkZJeUh5VU9rZnpnMTZLdzJrdS9oUm53YWtJYlFNVm9qSjNsd3VKd09zbnY0YVNWNGlPd211MVZmdVpxaDVxdDd1YUtNb3Z5aXZaeVNBWHRWdWJKWHFiYVRXNUVBd2dPSEpidmdDa2QwQXRZRFJZV3ltK3dZNXN2ajFXT3dKcm91Z2diaE9zU2dGcmoyTUFqQjFUN1plNHBCVmVRbXRCZ0tnVEd1ZzdJVnlpQ1U2eEVQMTJ1Z2ZBM0sxNkZjeTFyNm9ReEEyUVRob3djb2VvQ2lCeWg2R0VVUFVQUUFSUTlROURDS0hqYjdBQlJLMFFJVUxVRFJBaFF0aktJRktGcUFvZ1VvV2hnRjViY0ZLRm9ZUlFOUU5BQkZBMUEwTUlvR29HZ0FpZ2FnYUdBVURVRFJBQlFOakVJRkNoVW9WS0JRR1lVS0ZDcFFxRUNoTWdvVktGU2dVQmxGRVZBVUFVVVJVQlF4aWlLZ0tBS0tJcUFvWWhSRlFGRUVGRVdNUWdFS0JTZ1VvRkFZaFFJVUNsQW9RS0V3Q2dVb0ZLQlFHSVVkS094QVlRY0tPNk93QTRVZEtPeEFZV2NVZHFhZkFTaVU0amhRSEFlSzQwQnhuRkVjQjRyalFIRWNLSTR6aXVOQWNSd29qcE5OKzdtajFUOEZrcU5BY2hSSWpqS1NvMEJ5RkVpT0FzbFJSbklVU0k0Q3lWRjk2ZjFNR0FUTTVqb29XNkVNUXFHMFI0RDJDTkFlQWRvampQWUlNNjhCS0pRMkRoUnhvSWdEUlp4UnhJRWlEaFJ4b0lnemlqaFF4SUVpemlpR2dHSUlLSWFBWW9oUkRBSEZFRkFNQWNVUW94aGloanNBaFZMOHo0M3lmNndhY2oxdU5NRG1TZ1p4TnF1M29rOVlmUjA2eHVwcjBYNVdmeDN0WmZYWDBBMnN2Z2FWczNvVGlyQWF4bU4xUHdvYThIQ3czRmJ0Z1JDd0dNb3FLTjFROWtEWkIrVlpLQktEWG9meWV5ampwRXhONDIzU1ltbVB0RTk2VmhMMlNjY2xZaE1YaTN2RWZlS3pvckJQUEM0U3BUcVpXRmdjaGRDQ2JtUFhyWEQ5RkFwc0luQ3RZbEFWaWNLOFVZaXpaZkNKa3FqcU9LbDhtb05mejhIUDV1QjlPZmkySEZ3dGs3bVlaNUZPUWVVRUdNZU5xamx5Y2ZBWWxQSkk1c1VRbVc0OStJazNPQnlaSGh6RlQydFZ0cG9MOVNkUTlrUFpDK1VHS09WUVNxRGtROG1BRW1SdE9ZRGZxS2JwUXo0TkpSTktDSXBDcDBBZUQrUTJUb2RCUFVRc2VPL0lUeTJJL29IVjRjd3NvSHRxT0xNSXF0SGh6TVZRUFRtY3VUcFlMZU9ES0pPbVFmZ0owTnhqVU84YkRwNkE3aDlwMWVQRHdhZWdlbVE0R0lXcWVUaXpBS3JMaHpOL0VheTI0T1VveUZQU1pYcTlGTlpONnlYRHdSV0FkdWx3TUJ1cTNPSE1DTVhPZ1lreW9EY2JONklUVUdmb1ZPbmFUT0hoNEN5bzBvYURGUlRiZ0RLcDRyR0k4aGw3QWhSYWN5UEEwS2VIY0NPUFZWUHdaUENPNENkQS9oY1FMSmpIdThvb0Q5WHJHZlF2Qmh1RFQrZC9GNUNyZzhQVlJvb1ArOE4rdlk3VCtvbmczb3dkd2Z0aExKeHhNUGp0WUVIdzF2eFJBelIvRS9qZXdhWVlEdDZnakpMSDFLVGdZTEFvMko5L0l0Z1hYQkJzRFM0Sk5tZEErM0R3aXVEVGxFM1VoQnZKWXdlRERURGdmRmhGeG5Cd2JzWW9ZN0V1dUNXb0JqT0RGY3JUVkw1b2hqWnVlZjdUVkFLb1JKczlEK1Nia3pGS2JYeDUrU2gycURuU0tXbTNkTGswVzVvbGhhVTBhWnFVS3JrTVRvUGRZRFdZRFVhRHdTQWFlQU14SUlPTGZoazNsMzdwemlYYWFTWHk5TW96MkU3b2xiRHY1Q0dDRFFRdFFQRWtycDdVTDUyTjYrTkgybEQ5YWlWK1ptbDRGQnN2WFJrWHdyTngzRm1QNnBmTmpzL0lyUitWeHBmRXkzUHI0MUxENVkzN01iNjFDVnJqWlBzb1Jzc2FSL0U0YmJvcG1mNWZBdnN4dXVtYnlZY1F4djZidnRuVWhIeWVqVlcrS3VmRmpvcTZtcSs0dE9qWEtYOGF6RGNWVEkzZlhiKzBNZjVvYWxPOGhBTGpxVTMxOGV2cC96UndpTmlJcGJibUVMSFNxcW54RU45RGJMVkxhRHZmVTlNRWFDY1lHbGl6RmRCUUpxMEF6VEFiS1JRTjRzbHNpZ1k2MHZBaVFBNTRJVm9CbnRHQ0lnd3ZZclF3UEI1VHZQM0hsTnFhL1lyQ2NESVFPc1p3am1XZ0tUaGdNVUJic3o4U1lWaGhCVGRTTE53WVZoaGoyV3lnWUJCUThvTU1CYzVBUVRaUUVMUEo0b1huVVRKMGxMSkpsREkyRjRmUDR3UTFIRmZXQkk0ckMzQnkveTkvWXJOejhVanh3SFV2MFArOG9TVmNHNFBTRXQrMXNjTVhIMXl0S1B1dkc5RC9WNGRJeStxMkRscTN4dUlENFZoTi9McHdqYksvK0lXdjZINkJkaGVIYS9hakYycVhOZTUvUVkzVkRCZXJ4YlhoMXBxbWthckt4dW9MNXRveE9WZGo1VmNNVmtrSGE2UnpWVlYvUlhjMTdhNmljMVhUdWFycFhGVnFGWnVydHBQYWZVUGpmZ09hVGIvRnplb1JZaktDRGJja2g1cG1lK3c5RjFPRFBqUXI1THN1K1RDUDhDUElsTnNVTjRkbnh5MVFhRmQrZFg0MTdRSS9vMTFXK2o5MDZGMis2MmFGa2cvalIvUXVPelE3d3JNbmYzOENVU1Q2MjVqMThkRFNsWTNVVk9KcTYxZnJySS8rc0c0ZnF1MnNnWDl3Mzg4S2ZLWmlvcjZ2L09uL3FwK0JnWUUrZWhuSTdVT29QcDZ6dEQ0K25mNXVxQ1RCVkMwMVRkQldNTkhHY2F4dHZ5elhqbzRmZ2M1Y1lBTDMwK2tvbEl2cDM0dFJqWERxa3NpUU9DUVJlbFRvSHdta2xuUS9BenY0Vmlod2ppT2JoZ3ZaZVpsc0drbkxvT2VYL3BIQ01xMkc4eW10aHdPaEV2clYvM0lncFhXR1ZxdU9mQUIyWit6TzMxMCtsREdVUDFST2Z3M240RjVvRE82bFcrbHc0VjRPOWVmMlRRZ0N3UDRtcFAwWkc1anZlOE1wcVd6aUlRcms1amJsOXJGdjVLTXZpbnJ5bDJSeXp3dTJUeCsxanczZlA2RVFyYjBQYWNoYVorN0FCTkdBVHNJNkJ4Z0pnUDhMNVQxZ3JncGxibVJ6ZEhKbFlXMEtaVzVrYjJKcUNnb3hOeUF3SUc5aWFnb3hPRE0wTUFwbGJtUnZZbW9LQ2pFNElEQWdiMkpxQ2p3OEwxQnliMlIxWTJWeUlDaFFjbWx1WTJVZ01USXVOU0JjS0hkM2R5NXdjbWx1WTJWNGJXd3VZMjl0WENrcENpOVVhWFJzWlNBb2NtVXRNREF3TURJcFBqNEtaVzVrYjJKcUNnb3hPU0F3SUc5aWFnbzhQQzlNWlc1bmRHZ2dNVFFLTDBacGJIUmxjaUF2Um14aGRHVkVaV052WkdVS0wxUjVjR1VnTDFoU1pXWUtMMU5wZW1VZ01qQUtMMGx1WkdWNElGczBJREVnTmlBeFhRb3ZWeUJiTVNBeElERmRQajRLYzNSeVpXRnRDbmljWTJKbFpHSmxBQUFBUHdBUUNtVnVaSE4wY21WaGJRcGxibVJ2WW1vS0NuaHlaV1lLTUNBMENqQXdNREF3TURBd01EQWdOalUxTXpVZ1ppQUtNREF3TURBd01EQXhOaUF3TURBd01DQnVJQW93TURBd01EQXdNekU0SURBd01EQXdJRzRnQ2pBd01EQXdNREV6T0RJZ01EQXdNREFnYmlBS05TQXhDakF3TURBd01EQXdPREFnTURBd01EQWdiaUFLTnlBeE13b3dNREF3TURBd01qazRJREF3TURBd0lHNGdDakF3TURBd01EQXpOelFnTURBd01EQWdiaUFLTURBd01EQXdNVE0yTWlBd01EQXdNQ0J1SUFvd01EQXdNREF4TlRRM0lEQXdNREF3SUc0Z0NqQXdNREF3TWpNeE16QWdNREF3TURBZ2JpQUtNREF3TURBd01qSTNOaUF3TURBd01DQnVJQW93TURBd01EQXlORFl4SURBd01EQXdJRzRnQ2pBd01EQXdNak14TURjZ01EQXdNREFnYmlBS01EQXdNREF5TXpnek9DQXdNREF3TUNCdUlBb3dNREF3TURJME1ESTRJREF3TURBd0lHNGdDakF3TURBd05ESTBOVGdnTURBd01EQWdiaUFLTURBd01EQTBNalE0TVNBd01EQXdNQ0J1SUFvd01EQXdNRFF5TlRZMklEQXdNREF3SUc0Z0NncDBjbUZwYkdWeUNqdzhMMGx1Wm04Z01UZ2dNQ0JTQ2k5VGFYcGxJREl3Q2k5U2IyOTBJREVnTUNCU0NpOUpSQ0JiUERaR09VSTFOMEl6TlVZeFJUUkROa0ZCUkVReVJqRkJSRGN5TmpjeU5rWTRQaUE4TmtZNVFqVTNRak0xUmpGRk5FTTJRVUZFUkRKR01VRkVOekkyTnpJMlJqZytYVDQrQ25OMFlYSjBlSEpsWmdvME1qY3dNQW9sSlVWUFJnb0tlSEpsWmdvd0lEQUtDblJ5WVdsc1pYSUtQRHd2V0ZKbFpsTjBiU0EwTWpVMk5nb3ZVSEpsZGlBME1qY3dNQW92U1c1bWJ5QXhPQ0F3SUZJS0wxTnBlbVVnTWpBS0wxSnZiM1FnTVNBd0lGSUtMMGxFSUZzOE5rWTVRalUzUWpNMVJqRkZORU0yUVVGRVJESkdNVUZFTnpJMk56STJSamcrSUR3MlJqbENOVGRDTXpWR01VVTBRelpCUVVSRU1rWXhRVVEzTWpZM01qWkdPRDVkUGo0S2MzUmhjbl
              // I0Y21WbUNqUXpNakkwQ2lVbFJVOUdDZz09PC9NSU1FX0RBVEE+CiAgICAgICAgICAgICAgPEZJTEVfTkFNRT5yZS0wMDAwMi5wZGY8L0ZJTEVfTkFNRT4KICAgICAgICAgICAgPC9NSU1FX0VNQkVEREVEPgogICAgICAgICAgPC9NSU1FPgogICAgICAgIDwvTUlNRV9JTkZPPgogICAgICAgIDxIRUFERVJfVURYPgogICAgICAgICAgPFNFTkRFUl9DVVNUT01fSUQ+MTwvU0VOREVSX0NVU1RPTV9JRD4KICAgICAgICAgIDxSRUNFSVZFUl9DVVNUT01fSUQ+MjwvUkVDRUlWRVJfQ1VTVE9NX0lEPgogICAgICAgIDwvSEVBREVSX1VEWD4KICAgICAgPC9JTlZPSUNFX0lORk8+CiAgICA8L0lOVk9JQ0VfSEVBREVSPgogICAgPElOVk9JQ0VfSVRFTV9MSVNUPgogICAgICA8SU5WT0lDRV9JVEVNIHR5cGU9Im9yZGVyX2l0ZW0iPgogICAgICAgIDxMSU5FX0lURU1fSUQ+MTwvTElORV9JVEVNX0lEPgogICAgICAgIDxQUk9EVUNUX0lEPgogICAgICAgICAgPGJtZWNhdDpTVVBQTElFUl9QSUQ+cF8xMDE8L2JtZWNhdDpTVVBQTElFUl9QSUQ+CiAgICAgICAgICA8Ym1lY2F0OkRFU0NSSVBUSU9OX1NIT1JUPnRlc3RfcHJvZHVjdDwvYm1lY2F0OkRFU0NSSVBUSU9OX1NIT1JUPgogICAgICAgIDwvUFJPRFVDVF9JRD4KICAgICAgICA8UVVBTlRJVFk+MTwvUVVBTlRJVFk+CiAgICAgICAgPGJtZWNhdDpPUkRFUl9VTklUPkM2MjwvYm1lY2F0Ok9SREVSX1VOSVQ+CiAgICAgICAgPFBST0RVQ1RfUFJJQ0VfRklYPgogICAgICAgICAgPGJtZWNhdDpQUklDRV9BTU9VTlQ+MTAuMDAwMDAwPC9ibWVjYXQ6UFJJQ0VfQU1PVU5UPgogICAgICAgICAgPGJtZWNhdDpQUklDRV9RVUFOVElUWT4xPC9ibWVjYXQ6UFJJQ0VfUVVBTlRJVFk+CiAgICAgICAgPC9QUk9EVUNUX1BSSUNFX0ZJWD4KICAgICAgICA8UFJJQ0VfTElORV9BTU9VTlQ+MTA8L1BSSUNFX0xJTkVfQU1PVU5UPgogICAgICA8L0lOVk9JQ0VfSVRFTT4KICAgIDwvSU5WT0lDRV9JVEVNX0xJU1Q+CiAgICA8SU5WT0lDRV9TVU1NQVJZPgogICAgICA8VE9UQUxfSVRFTV9OVU0+MTwvVE9UQUxfSVRFTV9OVU0+CiAgICAgIDxORVRfVkFMVUVfR09PRFM+MTAuMDAwMDAwPC9ORVRfVkFMVUVfR09PRFM+CiAgICAgIDxUT1RBTF9BTU9VTlQ+MTAuMDAwMDAwPC9UT1RBTF9BTU9VTlQ+CiAgICAgIDxUT1RBTF9UQVg+CiAgICAgICAgPFRBWF9ERVRBSUxTX0ZJWC8+CiAgICAgIDwvVE9UQUxfVEFYPgogICAgPC9JTlZPSUNFX1NVTU1BUlk+CiAgPC9JTlZPSUNFPgo8L09QRU5UUkFOUz4=`
    
    
              //  let data =`PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/Pgo8T1BFTlRSQU5TIHhtbG5zOmlvbWFya2V0PSJodHRwOi8vdGVtcHVyaS5vcmcvaW8tbWFya2V0L29wZW5UUkFOU19VRFgiIHhtbG5zOmJtZWNhdD0iaHR0cDovL3d3dy5ibWVjYXQub3JnL2JtZWNhdC8yMDA1IiB4bWxucz0iaHR0cDovL3d3dy5vcGVudHJhbnMub3JnL1hNTFNjaGVtYS8yLjEiPiAKICA8SU5WT0lDRSB2ZXJzaW9uPSIyLjEiPgogICAgPElOVk9JQ0VfSEVBREVSPgogICAgICA8SU5WT0lDRV9JTkZPPgogICAgICAgIDxJTlZPSUNFX0lEPlJFLTAwMDAyPC9JTlZPSUNFX0lEPgogICAgICAgIDxJTlZPSUNFX0RBVEU+MjAyMi0wNC0yMFQwNDoyNjoyMC4wMDBaPC9JTlZPSUNFX0RBVEU+CiAgICAgICAgPFBBUlRJRVM+CiAgICAgICAgICA8UEFSVFk+CiAgICAgICAgICAgIDxibWVjYXQ6UEFSVFlfSUQgdHlwZT0ibmV0Y29taWQiPjQxNDIwLTAwMDA0MTIwMDQtMTA8L2JtZWNhdDpQQVJUWV9JRD4KICAgICAgICAgICAgPFBBUlRZX1JPTEU+aW52b2ljZV9pc3N1ZXI8L1BBUlRZX1JPTEU+CiAgICAgICAgICAgIDxBRERSRVNTPgogICAgICAgICAgICAgIDxibWVjYXQ6TkFNRT5CZXhpb19nYXRlMmJfVEVTVF9TZW5kZXJfTkVXPC9ibWVjYXQ6TkFNRT4KICAgICAgICAgICAgICA8Ym1lY2F0OlNUUkVFVD5hc2RzYWQ8L2JtZWNhdDpTVFJFRVQ+CiAgICAgICAgICAgICAgPGJtZWNhdDpaSVA+MTIzNDU2PC9ibWVjYXQ6WklQPgogICAgICAgICAgICAgIDxibWVjYXQ6Q0lUWT5zYWRzYWQ8L2JtZWNhdDpDSVRZPgogICAgICAgICAgICAgIDxibWVjYXQ6Q09VTlRSWV9DT0RFRD5DSDwvYm1lY2F0OkNPVU5UUllfQ09ERUQ+CiAgICAgICAgICAgIDwvQUREUkVTUz4KICAgICAgICAgIDwvUEFSVFk+CiAgICAgICAgICA8UEFSVFk+CiAgICAgICAgICAgIDxibWVjYXQ6UEFSVFlfSUQgdHlwZT0ic3VwcGxpZXJfc3BlY2lmaWMiPjQxNDIwLTAwMDA0MTIwNTAtNjY8L2JtZWNhdDpQQVJUWV9JRD4KICAgICAgICAgICAgPFBBUlRZX1JPTEU+aW52b2ljZV9yZWNpcGllbnQ8L1BBUlRZX1JPTEU+CiAgICAgICAgICAgIDxBRERSRVNTPgogICAgICAgICAgICAgIDxibWVjYXQ6TkFNRT5UZXN0X0RlbW9fSW5kPC9ibWVjYXQ6TkFNRT4KICAgICAgICAgICAgICA8Ym1lY2F0OkNPVU5UUllfQ09ERUQ+Q0g8L2JtZWNhdDpDT1VOVFJZX0NPREVEPgogICAgICAgICAgICA8L0FERFJFU1M+CiAgICAgICAgICA8L1BBUlRZPgogICAgICAgIDwvUEFSVElFUz4KICAgICAgICA8SU5WT0lDRV9JU1NVRVJfSURSRUY+V09SS19GTE9XX1RFU1RfMTwvSU5WT0lDRV9JU1NVRVJfSURSRUY+CiAgICAgICAgPElOVk9JQ0VfUkVDSVBJRU5UX0lEUkVGIHR5cGU9InN1cHBsaWVyX3NwZWNpZmljIj5meTlqamtkNThiZWw8L0lOVk9JQ0VfUkVDSVBJRU5UX0lEUkVGPgogICAgICAgIDxibWVjYXQ6Q1VSUkVOQ1k+Q0hGPC9ibWVjYXQ6Q1VSUkVOQ1k+CiAgICAgICAgPFBBWU1FTlQ+CiAgICAgICAgICA8QUNDT1VOVD4KICAgICAgICAgICAgPEhPTERFUj5NdXN0ZXIgSGFuczwvSE9MREVSPgogICAgICAgICAgICA8QkFOS19BQ0NPVU5UIHR5cGU9ImliYW4iPkdCMzNCVUtCMjAyMDE1NTU1NTU1NTU8L0JBTktfQUNDT1VOVD4KICAgICAgICAgICAgPEJBTktfQ09ERSB0eXBlPSJiaWMiPkJVS0JHQjIyPC9CQU5LX0NPREU+CiAgICAgICAgICAgIDxCQU5LX05BTUU+QkFSQ0xBWVMgQkFOSyBVSyBQTEM8L0JBTktfTkFNRT4KICAgICAgICAgIDwvQUNDT1VOVD4KICAgICAgICAgIDxQQVlNRU5UX1RFUk1TPgogICAgICAgICAgICA8VElNRV9GT1JfUEFZTUVOVD4KICAgICAgICAgICAgICA8REFZUz4zMDwvREFZUz4KICAgICAgICAgICAgPC9USU1FX0ZPUl9QQVlNRU5UPgogICAgICAgICAgICA8VkFMVUVfREFURT4yMDIyLTA1LTE5PC9WQUxVRV9EQVRFPgogICAgICAgICAgPC9QQVlNRU5UX1RFUk1TPgogICAgICAgIDwvUEFZTUVOVD4KICAgICAgICA8SEVBREVSX1VEWD4KICAgICAgICAgIDxTRU5ERVJfQ1VTVE9NX0lEPjE8L1NFTkRFUl9DVVNUT01fSUQ+CiAgICAgICAgICA8UkVDRUlWRVJfQ1VTVE9NX0lEPjI8L1JFQ0VJVkVSX0NVU1RPTV9JRD4KICAgICAgICA8L0hFQURFUl9VRFg+CiAgICAgIDwvSU5WT0lDRV9JTkZPPgogICAgPC9JTlZPSUNFX0hFQURFUj4KICAgIDxJTlZPSUNFX0lURU1fTElTVD4KICAgICAgPElOVk9JQ0VfSVRFTSB0eXBlPSJvcmRlcl9pdGVtIj4KICAgICAgICA8TElORV9JVEVNX0lEPjE8L0xJTkVfSVRFTV9JRD4KICAgICAgICA8UFJPRFVDVF9JRD4KICAgICAgICAgIDxibWVjYXQ6U1VQUExJRVJfUElEPnBfMTAxPC9ibWVjYXQ6U1VQUExJRVJfUElEPgogICAgICAgICAgPGJtZWNhdDpERVNDUklQVElPTl9TSE9SVD50ZXN0X3Byb2R1Y3Q8L2JtZWNhdDpERVNDUklQVElPTl9TSE9SVD4KICAgICAgICA8L1BST0RVQ1RfSUQ+CiAgICAgICAgPFFVQU5USVRZPjE8L1FVQU5USVRZPgogICAgICAgIDxibWVjYXQ6T1JERVJfVU5JVD5DNjI8L2JtZWNhdDpPUkRFUl9VTklUPgogICAgICAgIDxQUk9EVUNUX1BSSUNFX0ZJWD4KICAgICAgICAgIDxibWVjYXQ6UFJJQ0VfQU1PVU5UPjEwLjAwMDAwMDwvYm1lY2F0OlBSSUNFX0FNT1VOVD4KICAgICAgICAgIDxibWVjYXQ6UFJJQ0VfUVVBTlRJVFk+MTwvYm1lY2F0OlBSSUNFX1FVQU5USVRZPgogICAgICAgIDwvUFJPRFVDVF9QUklDRV9GSVg+CiAgICAgICAgPFBSSUNFX0xJTkVfQU1PVU5UPjEwPC9QUklDRV9MSU5FX0FNT1VOVD4KICAgICAgPC9JTlZPSUNFX0lURU0+CiAgICAgICAgIDxJTlZPSUNFX0lURU0gdHlwZT0ib3JkZXJfaXRlbSI+CiAgICAgICAgPExJTkVfSVRFTV9JRD4xPC9MSU5FX0lURU1fSUQ+CiAgICAgICAgPFBST0RVQ1RfSUQ+CiAgICAgICAgICA8Ym1lY2F0OlNVUFBMSUVSX1BJRD5wXzEwMTwvYm1lY2F0OlNVUFBMSUVSX1BJRD4KICAgICAgICAgIDxibWVjYXQ6REVTQ1JJUFRJT05fU0hPUlQ+c2Fkc2Fkc2RzYWQ8L2JtZWNhdDpERVNDUklQVElPTl9TSE9SVD4KICAgICAgICA8L1BST0RVQ1RfSUQ+CiAgICAgICAgPFFVQU5USVRZPjE8L1FVQU5USVRZPgogICAgICAgIDxibWVjYXQ6T1JERVJfVU5JVD5DNjI8L2JtZWNhdDpPUkRFUl9VTklUPgogICAgICAgIDxQUk9EVUNUX1BSSUNFX0ZJWD4KICAgICAgICAgIDxibWVjYXQ6UFJJQ0VfQU1PVU5UPjEwLjAwMDAwMDwvYm1lY2F0OlBSSUNFX0FNT1VOVD4KICAgICAgICAgIDxibWVjYXQ6UFJJQ0VfUVVBTlRJVFk+MTwvYm1lY2F0OlBSSUNFX1FVQU5USVRZPgogICAgICAgIDwvUFJPRFVDVF9QUklDRV9GSVg+CiAgICAgICAgPFBSSUNFX0xJTkVfQU1PVU5UPjEwPC9QUklDRV9MSU5FX0FNT1VOVD4KICAgICAgPC9JTlZPSUNFX0lURU0+CiAgICA8L0lOVk9JQ0VfSVRFTV9MSVNUPgogICAgPElOVk9JQ0VfU1VNTUFSWT4KICAgICAgPFRPVEFMX0lURU1fTlVNPjE8L1RPVEFMX0lURU1fTlVNPgogICAgICA8TkVUX1ZBTFVFX0dPT0RTPjEwLjAwMDAwMDwvTkVUX1ZBTFVFX0dPT0RTPgogICAgICA8VE9UQUxfQU1PVU5UPjEwLjAwMDAwMDwvVE9UQUxfQU1PVU5UPgogICAgICA8VE9UQUxfVEFYPgogICAgICAgIDxUQVhfREVUQUlMU19GSVgvPgogICAgICA8L1RPVEFMX1RBWD4KICAgIDwvSU5WT0lDRV9TVU1NQVJZPgogIDwvSU5WT0lDRT4KPC9PUEVOVFJBTlM+`
              console.log(data);
              
              if(!data){
                console.log('File not found');
                let error = 'File not found';
                let errorJson = {host:req.headers.host,method:'xmlToJson',parms:req.body,error:'File not found'}
                // Logger.sendErrorLog(errorJson);
                commonErrors['errorTitle'] = req.originalUrl;
                commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+formData;
                warningMessage(commonErrors,error);
                logs.action = 'bexio.bill.create';
                logs.level = 'ERROR';
                logs.item = 'EDI';
                addlogs(logs,reqData.rolePartyId,reqData.roleAccId);
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
          // 
          // `result` is a JavaScript object
          // convert it to a JSON string
          let header,itemList,summary;
          header = result.OPENTRANS.INVOICE[0]?.INVOICE_HEADER[0];
          itemList = result.OPENTRANS.INVOICE[0]?.INVOICE_ITEM_LIST;
          summary = result.OPENTRANS.INVOICE[0]?.INVOICE_SUMMARY;
    
          let fileDeatis;
          // console.log('header.INVOICE_INFO[0]',header.INVOICE_INFO[0]);

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
          // console.log(JSON.stringify(itemList));
          // console.log('header',header);
          // console.log('itemList',itemList);
          // console.log('summary',summary);
          let iteamArray = [];
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
            // items['tax_id'] = element.
            // console.log('priceAmount',parseFloat(element.PRODUCT_PRICE_FIX[0]['bmecat:PRICE_AMOUNT'][0]));
            // console.log('priceAmount',parseFloat(element.PRODUCT_PRICE_FIX[0]['bmecat:PRICE_AMOUNT'][0]).toFixed(2));

            // return
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
              // let taxId = taxList.filter((e)=> e.type == element.PRODUCT_PRICE_FIX[0]['TAX_DETAILS_FIX'][0]['bmecat:TAX_TYPE'] && e.value == element.PRODUCT_PRICE_FIX[0]['TAX_DETAILS_FIX'][0]['bmecat:TAX'])
              // console.log('taxId',taxId);
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
            logs.action = 'bexio.bill.create';
            logs.level = 'ERROR';
            logs.item = 'EDI';
            addlogs(logs,reqData.rolePartyId,reqData.roleAccId);
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
            logs.action = 'bexio.bill.create';
            logs.level = 'ERROR';
            logs.item = 'EDI';
            addlogs(logs,reqData.rolePartyId,reqData.roleAccId);
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
            // "vendor_ref": '012345678',
            "vendor_ref": header.INVOICE_INFO[0].INVOICE_ID[0],
            // "title": "Bill 42",
            "contact_partner_id":  req.body.userId, // User Id
            "bill_date": formatDate(header.INVOICE_INFO[0].INVOICE_DATE),
            "due_date": dueDate,
            "amount_man":parseFloat(summary[0].TOTAL_AMOUNT[0]).toFixed(2),
            // "amount_calc": parseFloat(summary[0].TOTAL_AMOUNT[0]).toFixed(2),
            // "exchange_rate": null,
            // "base_currency_amount": null,
            "manual_amount": true,
            "currency_code": header.INVOICE_INFO[0]['bmecat:CURRENCY'][0],
            // "overdue": false,
            // "base_currency_amount": 212.78,
            "item_net": true,
       
            "address": {
              "lastname_company": contact['name_1'],
              "country_code": contryName ? JSON.parse(contryName)['iso_3166_alpha2']:'',
              "type": JSON.parse(config.BEXIO_COMPANY_TYPE)[contact['contact_type_id']]
            },
            // "purchase_order_id": 637,
            // "qr_bill_information": "\/\/S1\/10\/10201409\/11\/190512\/20\/1400.000-53\/30\/106017086\/31\/180508\/32\/7.7\/40\/2:10;0:30",
            // "address": {
              
            //     "firstname_suffix": header.INVOICE_INFO[0].PARTIES[0].PARTY[1].,
            //     "country_code": "CH", DOUBT
            //     "type": "PRIVATE"
            // },
          
            "line_items":iteamArray,
            // "discounts": [
            //     {
            //         "position": 1,
            //         "amount": 56.8
            //     }
            // ],
          
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
            logs.action = 'bexio.bill.create';
            logs.level = 'ERROR';
            logs.item = 'EDI';
            addlogs(logs,reqData.rolePartyId,reqData.roleAccId);
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
            logs.action = 'bexio.bill.create';
            logs.level = 'NOTIFICATION';
            logs.item = 'EDI';
            addlogs(logs,reqData.rolePartyId,reqData.roleAccId);
          //  await updateStatus(access_token,JSON.parse(response.body)['id'])
            console.log(response.body);
            
            res.send(response.body);

        });
        });
            });
   
      } catch (error) {
       
          logs.action = 'bexio.bill.create';
          logs.level = 'ERROR';
          logs.item = 'EDI';
          addlogs(logs,reqData.rolePartyId,reqData.roleAccId);
         console.log(error);
        
        let errorJson = {host:req.headers.host,method:'xmlToJson',parms:req.body,error:error}
        // Logger.sendErrorLog(errorJson);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+formData;
        warningMessage(commonErrors,error);
        res.send({
          status_code: 500,
          message: JSON.stringify(error),
          status: false,
        })
        // Logger.errorAndMail(error);
      }
          // log JSON string
          // console.log(json);
          

}
const getAllUsers = async (req,res) => {
  let cookie = null;
  const pool = await connectPostgres;
  let data = req.body;
  cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
  try {
    let access_token = cookie.access_Token;
    let isBexioUser = cookie.isBexioUser;
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
            res.send(response?.body)
           'body' in response ?  resolve(JSON.parse(response?.body)) : '';
  
          });
        });
    } catch (error) {
      
        logs.action = 'GET_ALL_USERS';
        logs.level = 'ERROR';
        logs.item = 'EDI';
        // addlogs(logs,data.rolePartyId,data.roleAccId);
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

const getTax = async (req,res) => {
  let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
  let access_token = cookie.access_Token;
  let isBexioUser = cookie.isBexioUser;
  const pool = await connectPostgres;
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
              commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+cookie;
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
const getInvoiceSearch = async (req,res) => {
  console.log('113');
  
  let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
  let access_token = cookie.access_Token;
  let isBexioUser = cookie.isBexioUser;
    return new Promise(async(resolve, reject) => {
          var options = {
            'method': 'GET',
            'url': `https://api.bexio.com/4.0/purchase/bills/f760e832-d774-434d-84dc-c60e3ce4012a`,
            'headers': {
              'Accept': 'application/json',
              'Authorization': 'Bearer '+access_token
            }
          };
          request(options, function (error, response) {
            if (error) {  
              commonErrors['errorTitle'] = 'getInvoiceSearch';
              commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+cookie;
              warningMessage(commonErrors,error);
              resolve(false)
            }
            // res.send(response.body)
            console.log(response.body);
            
            resolve(JSON.parse(response.body));
  
          });
        });
}
const copyDataNetcomid = async (partyId,accId) => {    
//   const pool = await connectPostgres;
//   let bexioPool = await postgresBexio;
//   let newGate2b = await postgresGate2b;

  
//   const getInviteCompanyIdQry = `select *  from companyregistered`
//   let getInviteCompanyId = await bexioPool.query(getInviteCompanyIdQry);
//   const partyUid = `select objectid from party where cid = $1`
//   const netcomId = `select netcomid,rk_party from ediparty where rk_party = $1`
//   const update = `update companyregistered set netcomid = $1  where rk_party = $2`

// for (let index = 0; index < getInviteCompanyId.rows.length; index++) {
//   const element = getInviteCompanyId.rows[index];
  
//   console.log('element.rk_party',element.rk_party);
//   let party = await pool.query(partyUid,[element.rk_party]);
  
//   if(party.rows.length !=0)
//   {
//    let netcom = await newGate2b.query(netcomId,[party.rows[0].objectid]);
//    if(netcom.rows.length !=0)
//    {
//      let party = await bexioPool.query(update,[netcom.rows[0].netcomid,element.rk_party]);

//     // console.log('netcom',netcom.rows[0].netcomid);
//     // console.log('rk_party',netcom.rows[0].rk_party);
//     // console.log('party.rows[0].objectid',party.rows[0].objectid);
//    }
//   }


// }


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
const getCountryName = async (access_token,id)=>{
  //  let access_token = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_NAME]))).access_token;
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
          // res.send(response.body)
          //console.log(response.body);
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
        // res.send();
        resolve('');
      });
    }
}

const getStatus = async (code)=>{
  let formData =  null
  try {
     formData = {
      invite_id:code
    }
    return new Promise(async(resolve, reject) => {
      var options = {
        'method': 'POST',
        'url': config.PYTHON_API+'fetch-field-status',
        //  'url':'http://192.168.2.63:5005/api/post-list/invitations',
        formData: formData
      };
      request(options, function (error, response) {
        if (error) {  
          commonErrors['errorTitle'] = 'getStatus';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio params,'+formData;
          warningMessage(commonErrors,error);
          resolve(false)
        }
        // res.send(response.body)
        //console.log(response.body);
        
        resolve(response.body);

      });
    });
  } catch (error) {
      commonErrors['errorTitle'] = getStatus.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+formData;
      warningMessage(commonErrors,error);
    fs.writeFile('assets/errorLog.txt', JSON.stringify(error), function () {
      // res.send();
      resolve('');
    });
  }
}
const getInvitations = async (code)=>{
    try {
      let formData = {
        invite_code:code
      }
      return new Promise(async(resolve, reject) => {
        var options = {
          'method': 'POST',
          'url': config.PYTHON_API+'post-list/invitations',
          //  'url':'http://192.168.2.63:5005/api/post-list/invitations',
          formData: formData
        };
        request(options, function (error, response) {
          if (error) {  
            commonErrors['errorTitle'] = 'getInvitations';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+code;
            warningMessage(commonErrors,error);
            resolve(false)
          }
          // res.send(response.body)
          //console.log(response.body);
          
          resolve(response.body);

        });
      });
    } catch (error) {
      commonErrors['errorTitle'] = getInvitations.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+code;
      warningMessage(commonErrors,error);
      fs.writeFile('assets/errorLog.txt', JSON.stringify(error), function () {
        // res.send();
        resolve('');
      });
    }
}
const getConnections = async (netcomId,docType)=>{
  let formData = null
  try {
    let doc_type = JSON.parse(config.BEXIO_DOCTYPES).filter( a=> a.key.toLowerCase() == docType.toLowerCase());
    formData = {
      netcom_id:netcomId,
      direction:'OUTPUT',
      active_only:'true',
      doc_type: doc_type[0]['id'],
      doc_format:config.DOC_FORMAT,
      show_all: 'true'
    }
    console.log('formData',formData);
    
    return new Promise(async(resolve, reject) => {
      var options = {
        'method': 'POST',
        'url': config.PYTHON_API+'post-list/connections',
         formData: formData
       
      };
      request(options, function (error, response) {
        if (error) {  
          commonErrors['errorTitle'] = 'post-list/connections';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+formData;
          warningMessage(commonErrors,error);
          resolve(false)
        }
        // res.send(response.body)
        resolve(response.body);

      });
    });
  } catch (error) {
      commonErrors['errorTitle'] = getConnections.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+netcomId;
      warningMessage(commonErrors,error);

    // fs.writeFile('assets/errorLog.txt', JSON.stringify(error), function () {
    //   // res.send();
    //   resolve('');
    // });
  }
}
const getConnectionsDetailsOfInviteSender = async (code,netComId)=>{
  let formData = null
  try {

    formData = {
      invite_code:code,
      logged_in_netcom_id:netComId
    
    }
    console.log(formData);
    
    return new Promise(async(resolve, reject) => {
      var options = {
        'method': 'POST',
        'url': config.PYTHON_API+'post-list/connections',
         formData: formData
       
      };
      request(options, function (error, response) {
        if (error) {  
          commonErrors['errorTitle'] = 'getLoginUserInfo';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+formData;
          warningMessage(commonErrors,error);
          resolve(response.body);
        }
        // res.send(response.body)
        resolve(response.body);

      });
    });
  } catch (error) {
      commonErrors['errorTitle'] = getConnectionsDetailsOfInviteSender.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+formData;
      warningMessage(commonErrors,error);

    // fs.writeFile('assets/errorLog.txt', JSON.stringify(error), function () {
    //   // res.send();
    //   resolve('');
    // });
  }
}
const createBusinessConnection = async (req,res)=>{
  const pool = await connectPostgres;
  const data = req.body;
    try {
      let connectionData,invitationData;
      let bexioPool = await postgresBexio;
      let inviteSenderDetails,direction,doc_type;
      
      console.log(data);
      invitationData = await getInvitations(data.code);
      if(invitationData == false){
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'invitationData_not_found -req param,',JSON.stringify(req.body);
        warningMessage(commonErrors,'invitationData_not_found');
        logs.action = 'bexio.dashboard.connectionCreate';
        logs.level = 'ERROR';
        logs.item = 'EDI';
        addlogs(logs,data.rolePartyId,data.roleAccId);
        res.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
        return
      }
      direction = data.direction;
      doc_type = data.docType;
      let getPartyAccountIdQry = `SELECT pa.cid,p.objectid,lp.companyname
          FROM party_account pa
            INNER JOIN party p ON pa.fk_party = p.cid 
            INNER JOIN legalparty lp ON lp.fk_party = p.cid 
            INNER JOIN status s ON s.cid = pa.fk_status 
          WHERE pa.fk_account = $1
            AND pa.fk_party = $2 AND s."statusLabel" = 'active'`;
      const getPartyAccountId = await pool.query(getPartyAccountIdQry, [data.accountId, data.partyId]);
      if( doc_type != 'Invoice'){
        let params = {'direction': data.direction.toUpperCase(),'netcomId':data.netcomId,'name':getPartyAccountId.rows[0].companyname,'doc_type':doc_type};
        await createConnector(params);
      }
      let inviteData = JSON.parse(invitationData).results[0];

      console.log('invitationData',inviteData.mode);
      let statusJson 
      statusJson = await getStatus(inviteData.id);
      console.log(statusJson);

      statusJson = JSON.parse(statusJson)
      // console.log(statusJson);
      
      // statusJson.data.business_connection_connectionStatus['out'] = 1;
      // statusJson.data.business_connection_invitation_sent_received['out'] = 1;
      // statusJson.data.business_connection_connection_active['out'] = 1;
      // 'business_connection_TXCost' in statusJson.data ? statusJson.data.business_connection_TXCost['out'] = 1:'';
      // statusJson.data.business_connection_running_mode_live['out'] = 1;
      // statusJson.data.business_connection_running_mode_test['out'] = 1;
      // statusJson.data.business_connection_running_mode_live['in'] = 1;
      // statusJson.data.business_connection_running_mode_test['in'] = 1;

      
      let dataCookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.cookies[config.EXPIRE_EXPIRES_COOKIE_NAME])));
      connectionData = await getConnections(dataCookie.netcomId,doc_type);
      console.log('connectionData',connectionData);
      if(!connectionData)
      {
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'connectionData_not_found -req param,',JSON.stringify(req.body);
        warningMessage(commonErrors,'connectionData_not_found');
        logs.action = 'bexio.dashboard.connectionCreate';
        logs.level = 'ERROR';
        logs.item = 'EDI';
        addlogs(logs,data.rolePartyId,data.roleAccId);
        res.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
        return
      }
      inviteSenderDetails = JSON.parse(connectionData).results.length != 0 ?  await getConnectionsDetailsOfInviteSender(data.code,data.netcomId):'';
      if(!inviteSenderDetails){
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'inviteSenderDetails_not_found -req param,',JSON.stringify(req.body);
        warningMessage(commonErrors,'inviteSenderDetails_not_found');
        logs.action = 'bexio.dashboard.connectionCreate';
        logs.level = 'ERROR';
        logs.item = 'EDI';
        addlogs(logs,data.rolePartyId,data.roleAccId);
        res.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
        return
      }      
      console.log('inviteSenderDetails',inviteSenderDetails);
      if(JSON.parse(connectionData).results.length != 0 && JSON.parse(inviteSenderDetails).results[0].direction['id'] != 0)
      {
        let inviteData = JSON.parse(invitationData).results[0];

        console.log('in_custom_id',inviteData.g2b_connections_customerid['in_custom_id']);
        const getInviteCompanyIdQry = `SELECT cid FROM
        companyregistered 
        WHERE netcomid = $1`
        console.log(inviteData.g2b_connections_customerid);
        let getInviteNetcomId = await bexioPool.query(getInviteCompanyIdQry,[dataCookie.netcomId]);
        let tempConnectionDetails = JSON.parse(inviteSenderDetails);
        console.log('tempConnectionDetails',tempConnectionDetails);
        
        let tempPaye = {"company_payee":tempConnectionDetails.results[0].company_payee,"partner_company_payee":tempConnectionDetails.results[0].partner_company_payee, "company_direction": 0};
        if(!tempConnectionDetails.results[0].company_payee)
        {
          tempPaye.company_payee = "self";
        }
        // tempPaye.company_payee = 'self';
        // console.log(inviteSenderDetails.results[0].company_payee);
        // console.log(inviteSenderDetails.results[0].partner_company_payee);
        // console.log(tempPaye);
        
        let formData =  {
          out_id:JSON.parse(connectionData).results[0].id,
          out_cust_id:inviteData.g2b_connections_customerid['out_cust_id'],
          out_status:1,
          in_id:inviteData.connection_id,
          in_cust_id:inviteData.g2b_connections_customerid['in_cust_id'],
          in_status:1,
          merge_status:1,
          invitation_id:inviteData.id,
          invitation_code:data.code,
          platform:JSON.stringify({"type": "ext-party", "code": "BEX", "direction": "OUT"}),
          fk_companyregistered:getInviteNetcomId.rows[0].cid, 
          rk_contact:data.id, 
          rk_partyreceived:data.partyId,
          ot_updator:JSON.stringify({"in_custom_id": data.id, "out_custom_id": "1","receiver_file_name":''}),
          payee_details:JSON.stringify(tempPaye),
          mode:inviteData?.mode
        };
        console.log('inviteData',inviteData);
        console.log(formData);
 
        console.log('config.PYTHON_API',config.PYTHON_API+'merge-connections');
        return new Promise(async(resolve, reject) => {
          var options = {
            'method': 'POST',
            'url': config.PYTHON_API+'merge-connections',
            formData: formData
          
          };
          request(options, async function (error, response) {
            if (error) {  
              commonErrors['errorTitle'] = 'merge-connections';
              commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+formData;
              warningMessage(commonErrors,error);
              logs.action = 'bexio.dashboard.connectionCreate';
              logs.level = 'ERROR';
              logs.item = 'EDI';
              addlogs(logs,data.rolePartyId,data.roleAccId);
              res.send({
                status_code: 500,
                message: JSON.parse(response.body).message,
                status: false,
              });
              return
            }
            // res.send(response.body)
            //console.log(response.body);
            console.log(response.body);
            
            // resolve(response.body);
            if(JSON.parse(response.body).status)
            {
              logs.action = 'bexio.dashboard.connectionCreate';
              logs.level = 'NOTIFICATION';
              logs.item = 'EDI';
              addlogs(logs,data.rolePartyId,data.roleAccId);
              let temp = req.url.substr(1,req.url.length);
              console.log('temp',temp);
              let redisKey = req.body.partyId+"_/";
              await deleteRedis(req.url.substr(1,req.url.length),redisKey);
              res.send({
                status_code: 200,
                message: 'common_success',
                status: true,
              });
            }else{
              logs.action = 'bexio.dashboard.connectionCreate';
              logs.level = 'ERROR';
              logs.item = 'EDI';
              addlogs(logs,data.rolePartyId,data.roleAccId);
              res.send({
                status_code: 500,
                message: JSON.parse(response.body).message,
                status: false,
              });
            }
        
          });
        });
      }else{
        let msg = JSON.parse(inviteSenderDetails).results[0].direction['id'] == 0 ? 'sender_Error_msg' : '';
        logs.action = 'bexio.dashboard.connectionCreate';
        logs.level = 'ERROR';
        logs.item = 'EDI';
        addlogs(logs,data.rolePartyId,data.roleAccId);
        res.send({
          status_code: 500,
          message: msg,
          status: false,
        });
      }
     
      
    } catch (error) {
        logs.action = 'bexio.dashboard.connectionCreate';
        logs.level = 'ERROR';
        logs.item = 'EDI';
        addlogs(logs,data.rolePartyId,data.roleAccId);
        console.log(error);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+JSON.stringify(req.body);
        warningMessage(commonErrors,error);
      res.send({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
      });
    }
}

const fileUpload = async (transaction_id,file,access_token)=>{

  let formData = {
    transaction_id:transaction_id,
    virtual_filename:file.FILE_NAME[0],
    filetype:'input',
    data_format:'base64',
  }

  return new Promise(async(resolve, reject) => {
    // console.log('file');
    // console.log(file);
    
    // var options = {
    //   'method': 'POST',
    //   // 'url': `https://api.gate2b.io-procurement.com/api/file-download`,
    //   'url': `http://192.168.2.63:5005/api/file-download`,
    //   'headers': {
    //     'Accept': 'application/json',
    //     "Content-Type": "application/json"
    //   },
    //   formData:formData

    // };
    // request(options, function (error, response) {
    //   if (error) throw new Error(error);
      // res.send(response.body)
      
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
        // res.send(response.body)
        // console.log(response.body);
           resolve(response.body);
      //  else
      //     resolve(false)
       
  
      });
    // });


  });
}
// const copyCountry = async (transaction_id,file,access_token)=>{
//   let kubernetsPool = await postgres_kubernets;
//   const pool = await connectPostgres;
//   const selQry = `SELECT * FROM country`
//   const insQry = `INSERT INTO country(uid,name,iso3166_2_tld,iso3166_2_al3,iso3166_2_al22,iso3166_2)
//     VALUES($1,$2,$3,$4,$5,$6)`
//     const selSprQry = `SELECT * FROM country_spr WHERE fk_country=$1 AND fk_spr = $2`
//     const insSprQry = `INSERT INTO country_spr(fk_country,fk_spr,label)
//     VALUES($1,$2,$3)`


//   let countryList = await pool.query(selQry);
//   console.log('start');

//   for (let index = 0; index < countryList.rows.length; index++) {
//   console.log(index);

//     const element = countryList.rows[index];
//    console.log(element.uid);

//     // let countryResult = await kubernetsPool.query(insQry,[element.uid,element.name,element.iso3166_2_tld,element.iso3166_2_al3,element.iso3166_2_al22,element.iso3166_2]);
//      let spr1 = await pool.query(selSprQry,[element.uid,1]);
//      console.log(element.uid);
    
//       await kubernetsPool.query(insSprQry,[element.uid,1,spr1.rows[0].label]);
//       console.log(spr1.rows[0].label);

//       let spr2 = await pool.query(selSprQry,[element.uid,2]);
//       await kubernetsPool.query(insSprQry,[element.uid,2,spr2.rows[0].label]);

//   }
//   console.log('done');
  
// }

const kafkaTest = async (transaction_id,file,access_token)=>{
    // the client ID lets kafka know who's producing the messages
   
    let i = 0

    // after the produce has connected, we start an interval timer
      try {
        const clientId = process.env.clientId
        console.log("clientId",clientId);
        
        // we can define the list of brokers in the cluster
        const brokers = [process.env.kafkaHost]
        console.log("process.env.kafkaHost",process.env.kafkaHost);

        // this is the topic to which we want to write messages
        const topic = process.env.kafkaTopic
        console.log("process.env.kafkaTopic",process.env.kafkaTopic);
    
        // initialize a new kafka client and initialize a producer from it
        const kafka = new Kafka({ clientId, brokers })
        const producer = kafka.producer()
        await producer.connect()
        // send a message to the configured topic with
        // the key and value formed from the current value of `i`
        await producer.send({
          topic,
          messages: [
            {
              key: 'transactionid',
              value: "23653022-cf9c-43dd-8201-eade2b29281b",
            },
          ],
        })

        // if the message is written successfully, log it and increment `i`
        console.log("writes: ", i)
        i++
      } catch (err) {
      commonErrors['errorTitle'] = kafkaTest.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+err.toString()+'-req param,'+transaction_id+'-transactionId'+file+'-file'+access_token+'accessToken';
      warningMessage(commonErrors,err);
        console.error("could not write message " + err)
      }
}



const getInvitionDetails = async (req,res)=>{
  const pool = await connectPostgres;
  let data = req.body
  try {
    
    let formData = {
      invite_code:req.body.code
    
    }
    console.log(formData);
    
    return new Promise(async(resolve, reject) => {
      var options = {
        'method': 'POST',
        'url': config.PYTHON_API+'post-list/connections',
         formData: formData
       
      };
      request(options, function (error, response) {
        if (error) {  
          commonErrors['errorTitle'] = 'post-list/connections';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+req.body.code;
          warningMessage(commonErrors,error);
          res.send({
            status_code: 200,
            message: '',
            status: false,
          });
          return;
        }
        // res.send(response.body)
        res.send({
          status_code: 200,
          message: response.body,
          status: true,
        });
      });
    });
  } catch (error) {
 
      logs.action = 'GET_INVITION_DETAILS';
      logs.level = 'ERROR';
      logs.item = 'EBILL';
      // addlogs(logs,data.rolePartyId,data.roleAccId);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+req.body.code;
        warningMessage(commonErrors,error);
    res.send({
      status_code: 500,
      message: '',
      status: false,
  });
  }
}
const contactListCount = async (token,offset,limit?)=>{
  return new Promise(async(resolve, reject) => {
    console.log('limit',limit);
    console.log('offset',offset);
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
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+token;
        warningMessage(commonErrors,error);
        resolve(false)
      }
      console.log('resultLength',JSON.parse(response.body).length);
      
      if(response.statusCode == 200){
        console.log('JSON.parse(response.body).length',JSON.parse(response.body).length);
        console.log('limit',limit);

        
        if(JSON.parse(response.body).length == limit){
         let temp = await contactListCount(token,offset+2000,2000);
         console.log('temp2565',temp);
         resolve(temp)
         console.log('afterResole',temp);

        }else{
          offset = offset + JSON.parse(response.body).length;
          console.log('lengthhh',offset);
          resolve(offset)
          return
        }
        // console.log(JSON.parse(response.body).length);
        
        // resolve(JSON.parse(response.body).length)
        // resolve(offset)
      }
      else
      resolve(false)
    });
  });
}
const invoiceListCount = async (token)=>{
  return new Promise(async(resolve, reject) => {
    var options = {
      'method': 'GET',
      'url': 'https://api.bexio.com/2.0/kb_invoice',
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    };
    request(options, function (error, response) {
      if (error) {  
        commonErrors['errorTitle'] = 'invoiceListCount';
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+token;
        warningMessage(commonErrors,error);
        resolve(false)
      }
      if(response.statusCode==200)
      resolve(JSON.parse(response.body).length)
      else
      resolve(false)
    });
  });
}
// const contactListCount = async (token)=>{
//   return new Promise(async(resolve, reject) => {
//     var options = {
//       'method': 'GET',
//       'url': 'https://api.bexio.com/2.0/contact',
//       'headers': {
//         'Accept': 'application/json',
//         'Authorization': 'Bearer ' + token
//       }
//     };
//     request(options, function (error, response) {
//       if (error) throw new Error(error);
//       resolve(JSON.parse(response.body).length)
//     });
//   });
// }
const getBexioUserPermission = async (req,res) => {
  let data =req.body;
  let cookie
  cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
  const pool = await connectPostgres;
  try {
    let access_token = cookie.access_Token;
    let isBexioUser = cookie.isBexioUser;
    return new Promise(async(resolve, reject) => {
          var options = {
            'method': 'GET',
            'url': 'https://api.bexio.com/3.0/permissions',
            'headers': {
              'Accept': 'application/json',
              'Authorization': 'Bearer '+ access_token
            }
          };
          request(options, function (error, response) {
            if (error) {  
              commonErrors['errorTitle'] = 'permissions';
              commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+access_token;
              warningMessage(commonErrors,error);
              res.send({
                status_code: 500,
                message: response,
                status: false,
            })
            return
            }
            // res.send(response.body)
            console.log(response.statusCode);
            // console.log('response.body');

            try {
              logs.action = 'GET_BEXIO_USER_PERMISSION';
              logs.level = 'NOTIFICATION';
              logs.item = 'EDI';
              res.send(JSON.parse(response.body).permissions["fm"])
              
            } catch (error) {

              res.send({
                status_code: 500,
                message: response,
                status: false,
            })
              
            }
            // resolve(JSON.parse(response.body).permissions["fm"]);
  
          });
        });
    } catch (error) {
     
      logs.action = 'GET_BEXIO_USER_PERMISSION';
      logs.level = 'ERROR';
      logs.item = 'EDI';
      // addlogs(logs,data.rolePartyId,data.roleAccId);
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
  
const deleteBc = async (req,res) => {
  let reqData = req.body;
  const pool = await connectPostgres;
  try {
 
    let data = JSON.parse(reqData.bcData);
    let parms = config.BEXIO_DELETE_BC;
  
    parms = parms.replace('$done_by_user$',reqData['userName'])
          .replace("$done_by_party$",data['company_details']['name'])
          .replace("$party_id$",reqData['partyID'])
          .replace("$user_id$",reqData['userID'])
          .replace("$subject$",data['company_details']['name']+'_'+data['partner_company_details']['name']+'_'+data['company_details']['doc_type']['data']+'_'+data['company_details']['doc_format']['data'])
          .replace("$bc_id$",data['bc_id'])
          .replace("$company_netcom_id$",data['company_details']['netcomid'])
          .replace("$partner_company_netcom_id$",data['partner_company_details']['netcomid'])
          .replace("$company_direction$","1");

          console.log(parms);

    let formData = {
      bc_data:parms
    }
    return new Promise(async(resolve, reject) => {
      var options = {
        'method': 'POST',
          'url': config.PYTHON_API+'delete-bc',
          // 'headers': headers,
          formData: formData
      
      };
    
        
      request(options, async function (error, response) {
        console.log('error',error);
        
        if (error) {
          console.log(error);
          commonErrors['errorTitle'] = deleteBc.name;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+JSON.stringify(req.body);
          warningMessage(commonErrors, error);
          resolve(false);
        }
        console.log('responsedelete',response.body);
        if(response.statusCode == 200){
          let res1 = response.body;
          let temp = req.url.substr(1,req.url.length);
          console.log('temp',temp);
          let redisKey = req.body.partyID+"_/";
          await deleteRedis(req.url.substr(1,req.url.length),redisKey);
          logs.action = 'bexio.dashboard.deleteBc';
          logs.level = 'NOTIFICATION';
          logs.item = 'EDI';
          addlogs(logs,reqData.rolePartyId,reqData.roleAccId);
          res.send(response.body);
        }
        
      });
    });
  } catch (error) {
        logs.action = 'bexio.dashboard.deleteBc';
        logs.level = 'ERROR';
        logs.item = 'EDI';
        addlogs(logs,reqData.rolePartyId,reqData.roleAccId);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString();
        warningMessage(commonErrors,error);
        res.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
  }
  
}
const getTransactionDetails = async (req,res) => {
  let data =req.body
  const pool = await connectPostgres;
  try {
    return new Promise(async(resolve, reject) => {
      let formData = {
        transaction_id:req.body.transactionId
        
      }
  
      let  options = {
          'method': 'POST',
          'url': config.PYTHON_API+'transaction-details',
          // 'headers': headers,
          formData: formData
        };
      request(options, function (error, response) {
        if (error) {  
          commonErrors['errorTitle'] = 'getCountryLists';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+req.body.transactionId;
          warningMessage(commonErrors,error);
          res.send({})
        }
         res.send(response.body)
        console.log(response.body);
        // resolve(response.body);

      });
    });
  } catch (error) {
   
    logs.action = 'GET_TRANSACTION_DETAILS';
    logs.level = 'ERROR';
    logs.item = 'EDI';
    // addlogs(logs,data.rolePartyId,data.roleAccId);
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+req.body.transactionId;
    warningMessage(commonErrors,error);
  }
}
// gate2b register in bexio app
    
async function gate2bRegisterInBexio (userLanguage,module,email)  {
  console.log('gate2bRegisterInBexio');
  
  let subject = '';
  let message = '';
  let mailData
  if(module == 'EBILL'){
    mailData = await fetchEmailContent('register_gate2b_bexio_app_ebill',userLanguage);
    /* if (userLanguage == 'de') {
      subject='Registrierung für gate2b in der bexio-App'

    message = `Lieber Kunde<br><br>Vielen Dank, dass Sie sich für das gate2b in der bexio-App registriert haben.
    Sie haben Ihre Registrierung für eBill in gate2b erfolgreich abgeschlossen. Sobald wir Ihren Netzwerkpartner auf io-market 
    aktualisiert haben, werden wir Sie informieren.<br><br>Bei Fragen wenden Sie sich bitte an das Sales-Team unter ` + config.SALES_TEAM_CONTACT + ` oder an das Support-Team unter 
    ` + config.HELP_DESK_CONTACT + `<br><br>Freundliche Grüsse <br>io-market AG`
    }
    else {
      subject = 'Registration for gate2b in the bexio app';
      message = `Dear customer<br><br>Thank you for registering for gate2b in the bexio app. You have successfully completed your 
      registration for eBill in gate2b. As soon as we have updated your network partner on io-market, we will inform you.
      <br><br>If you have any questions, please contact the sales team at ` + config.SALES_TEAM_CONTACT + `  or the 
      support team at ` + config.HELP_DESK_CONTACT + `.<br><br>Kind regards<br>io-market AG`
    } */
  }else{
      /* if (userLanguage == 'de') {
        subject='Registrierung für gate2b in der bexio-App'
        message = `Lieber Kunde
        <br><br>
        <div>Vielen Dank für deine Registrierung für das gate2b in der bexio-App. Mit deiner Registrierung hast du dir gleichzeitig auch einen kostenlosen Account für das gate2b-Modul erstellt.</div><br>
        <div>Bei Fragen steht dir das Sales-Team unter ` + config.SALES_TEAM_CONTACT + ` oder das Support-Team unter ` + config.HELP_DESK_CONTACT + ` gerne zur Verfügung.</div><br>
        <div>Freundliche Grüsse</div>
        <div>io-market AG</div><br>`
    }
    else {
        subject = 'Registration for gate2b in the bexio app';
        message =`Dear customer
        <br><br>
        <div>Thank you for registering for gate2b in the bexio app. With your registration you have also created a free account for the gate2b module.</div><br>
        <div>If you have any questions, please do not hesitate to contact the Sales-Team at ` + config.SALES_TEAM_CONTACT + ` or the Support-Team at ` + config.HELP_DESK_CONTACT + `.</div><br>
        <div>Kind regards</div>
        <div>io-market AG</div><br>`
    } */
    mailData = await fetchEmailContent('register_gate2b_bexio_app',userLanguage);
  }
  subject = mailData.subject || '';
  message = mailData.message || '';
  console.log('messagemessage',message);
 
  await sendEmail({
      email: config.DEBUG ? config.DEBUG_MAIL : email,
      subject: subject,
      message,
  });
}
// const getInvitionCodeDetails = async (req,res) => {
//   let data = req.body
//   const pool = await connectPostgres;
//   try {
//     console.log('req.body.code',req.body.code);
//     let code = (req.body.code && req.body.code != 'undefined') ? req.body.code : '0';
//     // let code = req.body.code ? req.body.code : '0';
  
    
//     let  options = {
//       'method': 'POST',
//       'url': config.PYTHON_API+'get-contact-bc',
//       // 'url': 'http://192.168.2.166:5005/api/'+'get-contact-bc',

//       formData: formData
//     };
//     request(options, async function (error, response, body) {
//       if (error) {  
//         commonErrors['errorTitle'] = 'getConutryCode';
//         warningMessage(commonErrors,error);
//         resolve(false)
//       }
//       console.log('body',body);
//       res.send({
//         status_code: 200,
//         message: 'common_sucess',
//         status: true,
//         data: JSON.parse(body)['data'],
//       });
//     });    res.send({
//       status_code: 200,
//       data: getInvitionCodeResult.rows,
//       status: true,
//   })
//   } catch (error) {
//       logs.action = 'GET_INVITATION_CODE_DETAILS';
//       logs.level = 'ERROR';
//       logs.item = 'EBILL';
//       // //addlogs(logs,data.rolePartyId,data.roleAccId);
//         commonErrors['errorTitle'] = req.originalUrl;
//         commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+req.body.code;
//         warningMessage(commonErrors,error);
//     res.send({
//       status_code: 500,
//       data: '',
//       status: false,
//   })
//   }
// }
const getInvitionCodeDetails = async (req, res)=>{
  console.log('2222222');
  let data = req.body;
  let code = '';
  try{
    console.log('data',data);
    
    if(data.code == 'undefined' || data.code == '' || data.code == null)
    {
      code = '';
    }else{
      code = data.code.toString();
    }

    let bexioPool = await postgresBexio;
    let bc_id 
    let business_connection
    return new Promise(async(resolve, reject) => {
    
        let formData = {
          invite_code : code,
          invited_netcom_id : data.netcom_id,
          doc_type : data.doc_type ? data.doc_type : '1',
          direction: data.direction ? data.direction : 'send'
        } 
        console.log('formData',formData);
        
        let  options = {
          'method': 'POST',
          'url': config.PYTHON_API+'invite-details',
          // 'url': 'http://192.168.2.64:5005/api/'+'invite-details',

          formData: formData
        };
        request(options, async function (error, response, body) {
          if (error) {  
            commonErrors['errorTitle'] = 'getInvitionCodeDetails';
            warningMessage(commonErrors,error);
            resolve(false)
          }
          console.log('body',body);
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
   logs.action = 'GET_INVITIONCODE_DETAILS';
   logs.level = 'ERROR';
   logs.item = 'EDI';
  //  addlogs(logs,data.rolePartyId,data.roleAccId);
   console.log(error);
   commonErrors['errorTitle'] = req.originalUrl;
   commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+JSON.stringify(req.body); 
   warningMessage(commonErrors,error);
   return res.status(200).json({
       status_code: 500,
       message: 'something_went_wrong',
       status: false,
   });
   
}

}
const checkContact = async (req,res) => {
  let cookie = null
  let dataE = req.body;
  cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
  const pool = await connectPostgres;
  try {
   
    let access_token = cookie.access_Token;
    let data = req.body.name;
    console.log('access_tokenaccess_token',access_token);
    console.log('data',data);
    
    var options = {
      'method': 'POST',
      'url': `${config.BEXIO_API}2.0/contact/search`,
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + access_token
      },
      body: JSON.stringify([{
        "field":"name_1",
        "value":data,
        "criteria":"="
      }])
    }
    request(options, async function (error, response) {
      if (error) {  
        commonErrors['errorTitle'] = 'getCountryLists';
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+cookie;
        warningMessage(commonErrors,error);
        return res.status(200).json({
          status: false,
          message: '',
      }
      )
      return
      }
    
      console.log('response.statusCode',response.statusCode);
      

        if(response.statusCode != 200)
        {
          return res.status(401).json({
            status: 'fail',
            message: 'unauthorized',
        }
        )
        return

      }else{
        res.send({
          status_code: 200,
          data: JSON.parse(response.body).length,
          status: true,
      })
      }
     
    });
  } catch (error) {
   
      logs.action = 'CHECK_CONTACT';
      logs.level = 'ERROR';
      logs.item = 'EDI';
      // addlogs(logs,dataE.rolePartyId,dataE.roleAccId);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+cookie;
      warningMessage(commonErrors,error);
    res.send({
      status_code: 500,
      data: '',
      status: false,
    })
  }
}
const createContact = async (req,res) => {
  let data = req.body;
  let cookie = null
  cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
  const pool = await connectPostgres;
  try {
   
    let access_token = cookie.access_Token;
    console.log('access_tokenaccess_token',access_token);
    console.log('data',data);
    let userId = jwt.decode(access_token)['company_user_id'];
    let coutryList;
    coutryList = await getCountryLists(access_token);
       
    let countryId = JSON.parse(coutryList).filter( c => c.iso_3166_alpha2 == data.country_id);
    console.log(countryId);
    let tempName = '';
    if('name_1' in data)
    {
      tempName = data.name_1;
    }
    if('name' in data)
    {
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
        "address": data.address ? data.address : '',
        "postcode": data.postcode ? data.postcode : '',
        "city": data.city ? data.city : '',
        "country_id": countryId.length > 0 ? countryId[0].id : '',
        "mail": data.mail ? data.mail : '',
        "user_id": userId,
        "owner_id": userId
      })
    }
   
    request(options, async function (error, response) {
      if (error) {  
        commonErrors['errorTitle'] = 'bexio_contact';
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param'+access_token;
        warningMessage(commonErrors,error);
        logs.action = 'bexio.dashboard.createContact';
        logs.level = 'NOTIFICATION';
        logs.item = 'EBILL';
        // //addlogs(logs,data.rolePartyId,data.roleAccId);
        logs.action = 'bexio.dashboard.createContact';
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        addlogs(logs,data.rolePartyId,data.roleAccId);
        return res.status(200).json({
          status: false,
          message: '',
        })
        return
      }
    
      console.log(response.body);
      

        if(response.statusCode != 201)
        {
          commonErrors['errorTitle'] = 'bexio_contact';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'bexio_contact_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'bexio_contact_not_found');
          logs.action = 'bexio.dashboard.createContact';
          logs.level = 'ERROR';
          logs.item = 'EBILL';
          addlogs(logs,data.rolePartyId,data.roleAccId);
          return res.status(500).json({
            status: false,
            message: 'something_went_wrong',
        }
        )
        return

      }else{
        logs.action = 'bexio.dashboard.createContact';
        logs.level = 'NOTIFICATION';
        logs.item = 'EBILL';
        addlogs(logs,data.rolePartyId,data.roleAccId);
        res.send({
          status_code: 200,
          data: JSON.parse(response.body),
          status: true,
      })
      }
     
    });
  } catch (error) {
    
      logs.action = 'bexio.dashboard.createContact';
      logs.level = 'ERROR';
      logs.item = 'EBILL';
      addlogs(logs,data.rolePartyId,data.roleAccId);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+cookie;
        warningMessage(commonErrors,error);
    res.send({
      status_code: 500,
      data: '',
      status: false,
  })
  }
}

const healthCheck = async (req, res) => {
  console.log(config.DB_LIBRARY,config.DB_BEXIO,config.DB_G2B,config.DB_G2B_NEW);
  console.log('bexioClient',bexioClient);

  try {
     if(config.DB_LIBRARY && config.DB_BEXIO && config.DB_G2B && config.DB_G2B_NEW && bexioClient != null){
      return res.send({
        status_code: 200,
        data: 'health_check_success',
        status: true,
      })
     }
     else{
      return res.send({
        status_code: 500,
        data: 'health_check_error',
        status: false,
      })
      
     }
        
  }
  catch (error) {
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString();
    warningMessage(commonErrors,error);
    return res.send({
        status_code: 500,
        data: 'something_went_wrong',
        status: false,
    })
  } 
}
const getIban = async (req, res) => {
  try {
    // var options = {
    //   'method': 'POST',
    //   'url': `${config.BEXIO_API}2.0/contact/search`,
    //   'headers': {
    //     'Accept': 'application/json',
    //     'Authorization': 'Bearer ' + access_token
    //   },
    //   body: JSON.stringify([{
    //     "field":"name_1",
    //     "value":data,
    //     "criteria":"="
    //   }])
    // }
  } catch (error) {
    
  }
}
// const createBexioUser = async (req,res) => {
//  console.log('123');
 
//   return new Promise(async(resolve, reject) => {
//     var options = {
//       'method': 'POST',
//       'url': `https://api.bexio.com/3.0/fictional_users`,
//       'headers': {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer eyJraWQiOiI2ZGM2YmJlOC1iMjZjLTExZTgtOGUwZC0wMjQyYWMxMTAwMDIiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJiaXlvcmk2NzYxQGdhbG90di5jb20iLCJsb2dpbl9pZCI6ImJmZWU1ZGJlLTc0YzUtNDg0Mi1iNjBmLTk2NjlmMjc1OTM4YyIsImNvbXBhbnlfaWQiOiJ0d3Jvam5zY3VyaDgiLCJ1c2VyX2lkIjozMzIzMTAsImF6cCI6ImFhNDJjNjVhLTQyOTgtNDU0Ny1hNmY5LTJhZjNlZTliOWE3MyIsInNjb3BlIjoia2JfaW52b2ljZV9zaG93IG9wZW5pZCBwcm9maWxlIGtiX2FydGljbGVfb3JkZXJfc2hvdyBjb250YWN0X2VkaXQga2Jfb2ZmZXJfc2hvdyBrYl9vcmRlcl9zaG93IGtiX29yZGVyX2VkaXQgZmlsZSBjb250YWN0X3Nob3cgb2ZmbGluZV9hY2Nlc3MgYXJ0aWNsZV9zaG93IGVtYWlsIiwiaXNzIjoiaHR0cHM6XC9cL2lkcC5iZXhpby5jb20iLCJleHAiOjE2NjAxNDA2OTIsImlhdCI6MTY2MDEzNzA5MiwiY29tcGFueV91c2VyX2lkIjoxLCJqdGkiOiJmMjJkZDJkYy04ZGJmLTQzNDAtYjNlMC0xN2FhNDIzZThmYTUifQ.Lve5klBQO111VuYJ1s4KOAOaMVx-fz8ghZ4XFzKRNSNR2KMxR5VbLJlkv8NrT12O9qZEQTlPn5VCnowOxTO0QcX9AowV9JFvKj7Vl0zyTpAiLlTy1xVBIplmHyPHACLchOMZVaEt30ed6mjE1Y_mvbL2ZARQnPbM_-KpXf2WOJt6ErRP_alyMEbqr2maXUBdGgNI4w3iOx7HJVD955e1_k3HNQ_FyjN_2587o9i_NkRbG8ILC1VfiubsmLA3NA9-y1U74Pm6wGATxpTdU-xHfuBVdl3qoEcifZB_qnpttnCStd0ha26pSUdMwtdr-ouO4V9OkwyiFrya5TaA92I3wX9Xd9CLZgd-dsdV_Nri2dpplqDpdpqHyYOG6klKiLSnF2SNRErw9AY4egv-Kec6w7PnDtTaBOKhkvyJ2uAeIvS5TTTa0w4F_6gRI65B8IZvAHHdYTr6i5DM0eY6tqugDKG9GdCv4_D4YEYsWE2CGEIPFUXIntvcVRxRw3izM1mW-xIKHfIPpl8tSeAaFC6zhc6pteU4h5OxOJDI1JVj2XWrbO6etWnUuUbAoKdNsZx9nQ3-IUdZU62P_mfbGamv1DS9oR4eyT_TaDM2gSgkI5lxnHLCIyKRrGhVDdDcoQIZrkkCIrfvQ5qPP6V6qO-wxNwvAWx18lcw0MI53w0-yD4'
//       },
//       body: JSON.stringify({
//         "salutation_type": "male",
//         "firstname": "Rudolph",
//         "lastname": "Smith",
//         "email": "r.murali@iomarket.in",
//         "title_id": null
//       })
//     };
//     request(options, function (error, response) {

//       console.log(response.body);

//       if (error) throw new Error(error);
//       // res.send(response.body)
//       //console.log(response.body);
//       if(response.statusCode==200){
//         console.log(response.body);
        
//         resolve(JSON.parse(response.body));

//       }
//       else

//         resolve(false)
//     });
//   });
  
// }

const createBexioUser = async (req,res) => {
  console.log('123');
  
  const tokenSet = await bexioClient.refresh('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNlcmVwMTAzMDBAc2Vyb3Npbi5jb20iLCJ1c2VySWQiOjgwLCJpYXQiOjE2NjAxMzE1ODMsImV4cCI6MTY2MDIxNzk4M30.9kcoCsZn40FVF9pTRrng5ETjxyDnhpvG3pirmrmP2ZY.');
  console.log(tokenSet);
  
   
 }
//  const getAccessToken = async (req,res)=>{
//   try {
//     // let pool = await connectPostgres;
//     console.log(req.cookies);
//     let pool = await connectPostgres;
//      const cookie = JSON.parse(encryptionControl.decryptCookie(req.cookies[config.EXPIRE_EXPIRES_COOKIE_NAME]));
//      console.log(cookie);
//      var checkUserDetails = ` SELECT email,u.cid AS userId,pa.fk_party AS partyId,a.cid AS accountId 
//      FROM party_account pa
//       INNER JOIN account a
//       ON a.cid = pa.fk_account
//       INNER JOIN public.user u ON u.cid = a.fk_user
//       INNER JOIN status s ON s.cid = pa.fk_status
//      WHERE pa.fk_party = $1
//       AND pa.fk_account = $2
//       AND s."statusLabel" = 'active'`;

//      const userDetails = await pool.query(checkUserDetails, [cookie.partyID,cookie.accId]);
//      const data = {
//       email: userDetails.rows[0].email,
//       userId: userDetails.rows[0].userid,
//     };
//     const accessToken = jwt.sign(data, config.SECRET_JWT, { expiresIn: config.JWTExpiration });
//     const refreshToken = jwt.sign(data, config.SECRET_REFRESH_JWT, {
//         expiresIn: config.JWTRefreshExpiration,
//     });
//     req.session.isAuth = true;

//     let tokenCookie = { 
//       accessToken:accessToken,
//       refreshToken:refreshToken,
//       userMail: userDetails.rows[0].email,
//       partyID: userDetails.rows[0].partyid,
//       userID: userDetails.rows[0].userid,
//       accId: userDetails.rows[0].accountid,
//       isBexioCompany:true,
//       netcomId:cookie.netcomid

//     }
//     res.cookie(config.TOKEN_COOKIE_NAME, encryptionControl.encrypt(JSON.stringify(tokenCookie)), {
//         domain: config.SESSION_DOMAIN,
//         maxAge: config.SESSION_EXPIRY,
//         httpOnly: false,
//         signed: true,
//         secure: false
//     });
//     let email = userDetails.rows[0].email;
//     console.log('email',email);
//     console.log('req.sessionID',req.sessionID);
//     console.log(req.sessionID);
    
//     const postgresPool = await connectPostgres;
//     const searchQuery = `SELECT * FROM authTable 
//                 WHERE  mail= $1 AND sessionId = $2`;
//     const selectResult = await postgresPool.query(searchQuery, [email, req.sessionID]);
//     console.log('selectResult',selectResult);
//     console.log('selectResult.rowCount',selectResult.rowCount);
//     if (selectResult.rowCount === 0) {
//         const insertAuthQry = `INSERT INTO
//                     authTable (mail, refreshToken, sessionId, accessToken) 
//                     VALUES( $1,$2,$3,$4)`;
//     console.log('INSERT start');

//         await postgresPool.query(insertAuthQry, [email, refreshToken, req.sessionID, accessToken]);
//     console.log('INSERT end');

//     } else {
//         const updateQry = `UPDATE  authTable 
//                   SET refreshToken = $1,
//                   accessToken = $2
//                   WHERE mail= $3 AND sessionId = $4`;
//         await postgresPool.query(updateQry, [refreshToken, accessToken, email, req.sessionID]);
//         const deleteOldTokens50thFromGeneratedNow = `
//             DELETE FROM public.authtable
//             WHERE mail = $1
//             AND  "id" NOT IN (
//             SELECT "id" FROM public.authtable
//             WHERE mail = $1
//             ORDER BY timestamp DESC
//             LIMIT 50)`;
//         await postgresPool.query(deleteOldTokens50thFromGeneratedNow, [email]);
//   }
//     res.send({
//       status_code: 200,
//       message: '',
//       status: true,
//       data:encryptionControl.encrypt(userDetails.rows[0].partyid)
//   });

//   } catch (error) {
//         commonErrors['errorTitle'] = req.originalUrl;
//         commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString();
//         warningMessage(commonErrors);
//     console.log(error);
//     res.send({
//       status_code: 500,
//       message: JSON.stringify(error),
//       status: false,
//   });
    
//   }
// }

// const getSuperAdminToken = async (req,res,next)=>{
  
//   try {
//     let bexioPool = await postgresBexio;

//      const formData = req.body;
//       const updateRefreshToken = `SELECT * FROM  companyregistered 
//         WHERE rk_party = $1`

//         let refresTokenResult = await bexioPool.query(updateRefreshToken, [82]);
//         const tokenSet = await bexioClient.refresh(refresTokenResult.rows[0].refreshtoken);

//         let bexioTokenCookie = { 
//           access_Token:tokenSet.access_token,
//           refresh_Token:tokenSet.refresh_token,
//           isBexioUser:true
//         }
//         res.cookie(config.TOKEN_COOKIE_BEXIO_NAME, encryptionControl.encrypt(JSON.stringify(bexioTokenCookie)), {
//           domain: config.SESSION_DOMAIN,
//           maxAge: config.SESSION_EXPIRY,
//           httpOnly: false,
//           signed: true,
//           secure: false
//       });
      
     
      
//     res.send({
//       status_code: 200,
//       message: '',
//       // data:encryptionControl.encrypt(userDetails.rows[0].partyid),
//       status: true,
//       showPopUp:true
//     });

// } catch (error) {
//     console.log(error);
//         commonErrors['errorTitle'] = req.originalUrl;
//         commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString();
//         warningMessage(commonErrors);
//     res.send({
//       status_code: 500,
//       message: JSON.stringify(error),
//       status: false,
//   });
//     // fs.writeFile('assets/errorLog.txt', JSON.stringify(error), function () {
//     //   res.send();
//     // });
//   }

// }

// const getSuperAdminToken = async (req,res,next)=>{
  
//   try {
//     // let partyAccountId = encryptionControl.decryptCookie(decodeURIComponent(req.body['partyAccount']));
//     // let invitedId = encryptionControl.decryptCookie(decodeURIComponent(req.body['invitedId']));
//     await getUserPermissions(userDetails.rows[0].partyid,userDetails.rows[0].accountid)


//      let pool = await connectPostgres;
//      let gate2b = await connectGate2b;
//      let bexioPool = await postgresBexio;
//      const cookie = JSON.parse(encryptionControl.decryptCookie(req.signedCookies[config.TOKEN_COOKIE_NAME]));


//       const formData = req.body;
//       const getRefreshToken = `SELECT * FROM  companyregistered 
//         WHERE rk_party = $1`
//        let accId = cookie.accId;
//         let partyId = 156;

//         let refresTokenResult = await bexioPool.query(getRefreshToken, [156]);

//         const tokenSet = await bexioClient.refresh(refresTokenResult.rows[0].refreshtoken);
     
  
//      var checkUserDetails = `SELECT email,u.cid AS userId,pa.fk_party AS partyId,a.cid AS accountId,p.objectid
//       FROM party_account pa
//         INNER JOIN account a
//         ON a.cid = pa.fk_account
//         INNER JOIN public.user u ON u.cid = a.fk_user
//         INNER JOIN party p ON p.cid = pa.fk_party
//         INNER JOIN status s ON s.cid = pa.fk_status 
//        WHERE fk_party = $1 AND fk_account = $2 AND s."statusLabel" = 'active'`;
    
//      const userDetails = await pool.query(checkUserDetails, [partyId,accId]);
//      var getNetcomId = `SELECT netcomid 
//       FROM ediparty 
//       WHERE rk_party =$1`
//      const netcomId = await gate2b.query(getNetcomId, [userDetails.rows[0]?.objectid]);
//      console.log('netcomId',netcomId.rows[0].netcomid);
     
//       // let decode = encryptionControl.decryptCookie(decodeURIComponent(req.body['token']));
//       // let token = decodeURIComponent(req.body['token']);
//       // const tokenSet = await bexioClient.refresh(decode);
    
//         let bexioTokenCookie = { 
//           access_Token:tokenSet.access_token,
//           refresh_Token:tokenSet.refresh_token,
//           isBexioUser:true
        
//         }
//         const updateRefreshToken = `UPDATE companyregistered SET refreshtoken = $1
//         WHERE rk_csn = $2`
//       let rk_csn = jwt.decode(tokenSet.access_token)['company_id']

//       await bexioPool.query(updateRefreshToken, [tokenSet.refresh_token,rk_csn]);
//         const data = {
//           email: userDetails.rows[0].email,
//           userId: userDetails.rows[0].userid,
//       };
//         const accessToken = jwt.sign(data, config.SECRET_JWT, { expiresIn: config.JWTExpiration });
//         const refreshToken = jwt.sign(data, config.SECRET_REFRESH_JWT, {
//             expiresIn: config.JWTRefreshExpiration,
//         });

//         let tokenCookie = { 
//           accessToken:accessToken,
//           refreshToken:refreshToken,
//           userMail: userDetails.rows[0].email,
//           partyID: userDetails.rows[0].partyid,
//           userID: userDetails.rows[0].userid,
//           accId: userDetails.rows[0].accountid,
//           isBexioCompany:true
//         }
//         // Creating cookie for Bexio
//           res.cookie(config.TOKEN_COOKIE_BEXIO_NAME, encryptionControl.encrypt(JSON.stringify(bexioTokenCookie)), {
//             domain: config.SESSION_DOMAIN,
//             maxAge: config.SESSION_EXPIRY,
//             httpOnly: false,
//             signed: true,
//             secure: false
//         });
//           const datetimeToken = {
//             cookieCreatedTime: new Date(new Date(new Date().getTime() + 15 * 60000).toUTCString()),
//             userMail: userDetails.rows[0].email,
//             partyID: userDetails.rows[0].partyid,
//             userID: userDetails.rows[0].userid,
//             accId: userDetails.rows[0].accountid,
//             isBexioCompany:"true",
//             netcomId:netcomId.rows[0].netcomid
//         };

//           res.cookie(config.EXPIRE_EXPIRES_COOKIE_NAME, encryptionControl.encrypt(JSON.stringify(datetimeToken)), {
//             domain: config.SESSION_DOMAIN,
//             maxAge: config.SESSION_EXPIRY,
//             secure: false,
//             httpOnly: false,
//             signed: false,
//         });
      
//     res.send({
//       status_code: 200,
//       message: '',
//       data:encryptionControl.encrypt(userDetails.rows[0].partyid),
//       status: true,
//       showPopUp:true
//     });

// } catch (error) {
//     console.log(error);
//         commonErrors['errorTitle'] = req.originalUrl;
//         commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString();
//         warningMessage(commonErrors);
//     res.send({
//       status_code: 500,
//       message: JSON.stringify(error),
//       status: false,
//   });
//     // fs.writeFile('assets/errorLog.txt', JSON.stringify(error), function () {
//     //   res.send();
//     // });
//   }

// }
const switchCompanyBexio = async (req, res) => {
  console.log('11111111111111111');
  const data = req.body;
  let cookie = null,tokenSet;
  const pool = await connectPostgres;
  try {
      cookie = JSON.parse(encryptionControl.decryptCookie(req.signedCookies[config.MTC_TOKEN_COOKIE_NAME]));
      console.log('cookiecookie',cookie);
      
      let bexioPool = await postgresBexio;
      const gate2b = await connectGate2b;
      const redis_client = await redisClient;
      console.log('old',cookie);
      // console.log('new',data);
      let token = cookie;
      // let partyId = data.partyId;
      console.log('data',data);
      console.log('cookie',cookie);

      let partyId = data.partyId;
      let accountId = cookie.accId;
      // let getSuperRoleDetils = `SELECT array_agg(CID) AS roles
      // FROM role 
      // WHERE name IN (${config.SUPERADMINBEXIO})`;
      // const superRoleresult = await pool.query(getSuperRoleDetils);
      // let a = await getUserPermissions(partyId,accountId);
      
      // await addSystemuser(partyId,accountId,superRoleresult.rows[0].roles);
      // 'permissions_'+'mtc'+'_'+result.rows[0].accid;
      const redisKey = 'permissions_'+'mtc'+'_'+cookie['mtcAccountId'];
      let permissions = ''
      console.log('redisKeyGet',redisKey);

      await redis_client.get(redisKey, async (err,data) => {
          permissions = data ? data : ' ';
          console.log('permissions',permissions);
          if(permissions.search("mtc.company.gotoBexio") != -1){
           
       
            // let accountId = 50;
            const getRefreshToken = `SELECT * FROM  companyregistered 
                WHERE rk_party = $1`

            let refresTokenResult = await bexioPool.query(getRefreshToken, [partyId]);
            console.log('refresTokenResult',refresTokenResult.rows);
            if(req.cookies[config.EXPIRE_MTC_COOKIE_NAME])
            {

            if(refresTokenResult.rows.length != 0){
               
              const expireCookie = JSON.parse(encryptionControl.decryptCookie(req.cookies[config.EXPIRE_MTC_COOKIE_NAME]));
              console.log('olddatetimeToken',expireCookie);
              let datetimeToken = expireCookie;
              datetimeToken['cookieCreatedTime'] = new Date(new Date(new Date().getTime() + 15 * 60000).toUTCString());
              console.log('refresTokenResult.rows[0].refreshtoken',refresTokenResult.rows[0].refreshtoken);
              let getAccountDetils = `SELECT a.cid AS accId
              FROM account a INNER JOIN "user" u ON u.cid= a.fk_user
              WHERE u.email=$1`;
              let getAccountDetilsResult = await pool.query(getAccountDetils, [cookie['userMail']]);
              console.log('getAccountDetils',getAccountDetils);
              

                if(refresTokenResult.rows[0].refreshtoken){
                    console.log('1233654');
                    
                    try {
                     tokenSet = await bexioClient.refresh(refresTokenResult.rows[0].refreshtoken);
                      
                    } catch (error) {
                      return res.status(200).json({
                        status_code: 500,
                        message: 'token_missing',
                        status: false,
                    });
                      commonErrors['errorTitle'] = req.originalUrl;
                      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param'+JSON.stringify(cookie)+' '+JSON.stringify(req.body);
                      warningMessage(commonErrors,error);
                      return res.status(200).json({
                          status_code: 500,
                          message: 'something_went_wrong',
                          status: false,
                      });
                    }

                    let bexioTokenCookie = { 
                        access_Token:tokenSet.access_token,
                        refresh_Token:tokenSet.refresh_token,
                        isBexioUser:true
                    
                    }
                    const updateRefreshToken = `UPDATE companyregistered SET refreshtoken = $1
                    WHERE rk_party = $2`
                    let updateRefreshTokenResult = await bexioPool.query(updateRefreshToken, [tokenSet.refresh_token,partyId]);

                    res.cookie(config.TOKEN_COOKIE_BEXIO_NAME, encryptionControl.encrypt(JSON.stringify(bexioTokenCookie)), {
                        domain: config.SESSION_DOMAIN,
                        maxAge: config.SESSION_EXPIRY,
                        httpOnly: true,
                        signed: true,
                        secure: true
                    });
                    let getEdiPartyUID = `SELECT fk_party, rk_uid
                    FROM "_party_gate2b"
                    WHERE fk_party = $1`
                    let ediPartyUID = await pool.query(getEdiPartyUID,[partyId]);
                    if(ediPartyUID.rows.length){
                    let getEdipartyNetcomID = `SELECT  netcomid,companyname
                                    FROM ediparty e INNER JOIN legalparty lp ON lp.fk_ediparty = e.cid
                                    WHERE objectid = $1`
                    let edipartyNetcomID = await gate2b.query(getEdipartyNetcomID,[ediPartyUID.rows[0].rk_uid]);
                    if(edipartyNetcomID.rows.length){
                        token['netcomId']  = edipartyNetcomID.rows[0].netcomid;                           
                        token['partyID']  = partyId ;  
                        token['accId'] = getAccountDetilsResult.rows[0].accid;
                        datetimeToken['accId'] = getAccountDetilsResult.rows[0].accid;
                        datetimeToken['partyID'] = partyId;
                        datetimeToken['cookieCreatedTime'] = new Date(new Date(new Date().getTime() + 15 * 60000).toUTCString());  
                        datetimeToken['netcomId'] = edipartyNetcomID.rows[0].netcomid;
                        datetimeToken['isBexioCompany'] = true;
                        datetimeToken['companyName'] = edipartyNetcomID.rows[0].companyname;

                        }
                    }
                    const insertAuthQry = `INSERT INTO
                    authTable (mail, refreshToken, sessionId, accessToken) 
                    VALUES( $1,$2,$3,$4)`;
                    console.log(cookie['userMail']);
                    console.log(cookie['refreshToken']);
                    console.log(cookie['accessToken']);
                    req.session.isAuth = true;
                    
                    await pool.query(insertAuthQry, [
                      cookie['userMail'],
                      cookie['refreshToken'],
                      req.sessionID,
                      cookie['accessToken'],
                  ]);
                  //   res.cookie(config.TOKEN_COOKIE_NAME, encryptionControl.encrypt(JSON.stringify(token)), {
                  //     domain: config.SESSION_DOMAIN,
                  //     maxAge: config.SESSION_EXPIRY,
                  //     secure: true,
                  //     httpOnly: true,
                  //     signed: true,
                  // });

                    console.log('newdatetimeToken',datetimeToken);

                    res.cookie(
                        config.EXPIRE_EXPIRES_COOKIE_NAME,
                        encryptionControl.encrypt(JSON.stringify(datetimeToken)),
                        {
                            domain: config.SESSION_DOMAIN,
                            maxAge: config.SESSION_EXPIRY,
                            secure: false,
                            httpOnly: false,
                            signed: false,
                        },
                    );

              return res.status(200).json({
                  status_code: 200,
                  message: 'success_switch_company',
                  status: true,
                  showEbill:config.IS_EBILL_DISABLED,
              });
            }else
            {
              console.log('token_missing2');
              
                return res.status(200).json({
                    status_code: 500,
                    message: 'token_missing',
                    status: false,
                });
            }
        }else{
          console.log('token_missing3');

            return res.status(200).json({
                status_code: 500,
                message: 'token_missing',
                status: false,
            });
        }
    }else{
      console.log('permission_missing');
      
        return res.status(200).json({
            status_code: 500,
            message: 'permission_missing',
            status: false,
        });

    } 
  }else{
    console.log('mtc_token_missing');

    return res.status(200).json({
      status_code: 500,
      message: 'mtc_token_missing',
      status: false,
  });
  }

});

  } catch (error) {
        logs.action = 'SWITCH_COMPANY_BEXIO';
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        // //addlogs(logs,data.rolePartyId,data.roleAccId);
       console.log(error);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param'+JSON.stringify(cookie)+' '+JSON.stringify(req.body);
      warningMessage(commonErrors,error);
      return res.status(200).json({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
      });
      
  }
}

async function addSystemuser ( partyId,accId,role ) {
  // try {
      
      const pool = await connectPostgres; 
      const getStatusQry = `  SELECT cid FROM status WHERE "statusLabel" = 'active'`
      const statusResult = await pool.query(getStatusQry);

      const checkAccount = `  SELECT cid
                                  ,fk_party
                                  ,fk_account
                              FROM party_account
                              WHERE fk_party=$1
                              AND fk_account=$2`;
      const checkAccountResult = await pool.query(checkAccount,[partyId, accId]);
      if(accId){
          var getCompany;
          if(checkAccountResult.rows.length > 0){
              const updatepartyAccount = `UPDATE party_account SET issystemuser= $3,fk_status = $4 WHERE fk_party=$1 AND fk_account=$2 `;
              getCompany = await pool.query(updatepartyAccount,[partyId, accId,true,statusResult.rows[0].cid]);
          }
          else{
              
              const addPartyAccount = 'INSERT INTO party_account(fk_party,fk_account,issystemuser) VALUES($1,$2,$3)RETURNING cid';
              getCompany = await pool.query(addPartyAccount, [partyId, accId,true]);
          }
          if(getCompany.rows.length !== 0 || checkAccountResult.rows.length != 0){
              await addUserRole(partyId,accId,role);
          }
      }
  // } catch (error) {
  //     console.log(error);
  //     commonErrors['errorTitle'] = req.originalUrl;
  //     commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+encrToken;
  //     warningMessage(commonErrors,error);
  //     return res.status(200).json({
  //         status_code: 500,
  //         message: 'something_went_wrong',
  //         status: false,
  //     });
  // }
};
async function addUserRole ( partyId,accId,roles ) {
  const pool= await connectPostgres;
 
     console.log(roles);
     
     roles.length == 0 ? roles.push(0):'';
    
     let deleteRolesQry = `DELETE FROM partyapplication_account_role
          WHERE cid IN(
           SELECT par.cid from partyapplication_account_role par
                 INNER JOIN partyapplication_account pa ON par.fk_partyapplication_account = pa.cid
                 INNER JOIN partyapplication p ON p.cid = pa.fk_partyapplication 
             WHERE fk_account = $1
                 AND  fk_party = $2)
                 RETURNING *`

         let deleteRolesResult = await pool.query(deleteRolesQry,[accId,partyId]);
         let deletePartyAccountQry = `DELETE 
         FROM partyapplication_account 
         WHERE cid IN(
             SELECT paa.cid 
             FROM partyapplication_account paa 
             INNER JOIN party_account pa ON pa.cid = paa.fk_party_account  
             WHERE paa. fk_account = $1 AND pa.fk_party = $2
         )`
         let deletePartyAccount = await pool.query(deletePartyAccountQry,[accId,partyId]);

         console.log('roles',roles);
            if(roles.length != 0) 
            {

             let adminRoleDetils =`SELECT  
             rav.fk_application_version
            ,r.cid AS roleid
             FROM role_policy rp
             INNER JOIN "role" r
             ON r.cid = rp.fk_role
             INNER JOIN "policy" p
             ON p.cid = rp.fk_policy
             INNER JOIN role_application_version rav
             ON rav.fk_role = r.cid
             WHERE r.cid = ANY($1::integer[])`
             const result = await pool.query(adminRoleDetils, [roles]);

             console.log('result',result.rows);
             
             
             const partyApplicationDetails = ` SELECT cid 
                 FROM 
                     partyapplication  p 
                 WHERE 
                     fk_party = $1 
                 AND fk_application_version = $2 `;
                 console.log('result',result.rows);

             const partyAccountDetailsQry = ` SELECT p.cid 
                                              FROM 
                                              party_account  p 
                                              INNER JOIN status s 
                                              ON s.cid = p.fk_status
                                              WHERE 
                                              fk_party = $1 
                                              AND fk_account = $2
                                              AND s."statusLabel" ='active' `;
             const partyAccountDetails = await pool.query(partyAccountDetailsQry,[partyId,accId])
           
             const insertPartyApplicationAccount = ` INSERT INTO partyapplication_account
                                         (fk_partyapplication,fk_account,fk_party_account) 
                                         VALUES($1,$2,$3) RETURNING cid `;
             const insertPartyApplicationAccountRole = ` INSERT INTO partyapplication_account_role
                                             (fk_partyapplication_account,fk_role) 
                                             VALUES($1,$2) `;

             let partyApplicationExist,partyApplictionExist;
             for (const element of result.rows)
                 {
                     partyApplictionExist = await pool.query(partyApplicationDetails,[partyId,element.fk_application_version])
                     if(partyApplictionExist.rows.length != 0){
                     partyApplicationExist = partyApplictionExist.rows[0].cid
                 }
                 console.log('partyApplicationExist',partyApplicationExist);
                 
                 const partyApplicationAccountId = await pool.query(insertPartyApplicationAccount,[partyApplicationExist,accId,partyAccountDetails.rows[0].cid]);
                 let partyApplicationAccount = partyApplicationAccountId.rows[0].cid;

                 
                  await pool.query(insertPartyApplicationAccountRole, [partyApplicationAccount, element.roleid]);

             }
            
            }
}

const setSuperAdmin = async (req, res) => {
  let cookie;
  let bexioPool = await postgresBexio;
  const pool = await connectPostgres;
  const gate2b = await connectGate2b;
  const data = req.body;
  try {
     
      cookie = JSON.parse(encryptionControl.decryptCookie(req.signedCookies[config.TOKEN_COOKIE_NAME]));
   
      let partyId = data.partyId;
      let accountId = cookie.accId;
      let token = cookie;

      const expireCookie = JSON.parse(encryptionControl.decryptCookie(req.cookies[config.EXPIRE_EXPIRES_COOKIE_NAME]));
      console.log('olddatetimeToken',expireCookie);
      let datetimeToken = expireCookie;
      let getEdiPartyUID = `SELECT fk_party, rk_uid
                          FROM "_party_gate2b"
                          WHERE fk_party = $1`
      let ediPartyUID = await pool.query(getEdiPartyUID,[partyId]);
      if(ediPartyUID.rows.length){
          let getEdipartyNetcomID = `SELECT  netcomid
                                  FROM ediparty
                                  WHERE objectid = $1`
          let edipartyNetcomID = await gate2b.query(getEdipartyNetcomID,[ediPartyUID.rows[0].rk_uid]);
          if(edipartyNetcomID.rows.length){
              token['netcomId']  = edipartyNetcomID.rows[0].netcomid;                           
              token['partyID']  = partyId ;  
              datetimeToken['partyID'] = partyId;
              datetimeToken['cookieCreatedTime'] = new Date(new Date(new Date().getTime() + 15 * 60000).toUTCString());  
              datetimeToken['netcomId'] = edipartyNetcomID.rows[0].netcomid;
              datetimeToken['isBexioCompany'] = true;
          }
      }
      res.cookie(config.TOKEN_COOKIE_NAME, encryptionControl.encrypt(JSON.stringify(token)), {
          domain: config.SESSION_DOMAIN,
          maxAge: config.SESSION_EXPIRY,
          secure: true,
          httpOnly: true,
          signed: true,
      });
      return res.status(200).json({
        status_code: 200,
        message: 'success_switch_company',
        status: true,
    });
  } catch (error) {
           
    logs.action = 'SET_SUPERADMIN';
    logs.level = 'ERROR';
    logs.item = 'EBILL';
    // //addlogs(logs,data.rolePartyId,data.roleAccId);
    console.log(error);
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+cookie+' '+JSON.stringify(req.body);
    warningMessage(commonErrors,error);
    return res.status(200).json({
      status_code: 500,
      message: 'something_went_wrong',
      status: false,
    });
  }

}
async function addMailChimp(fName,lName,email){
  try {
    console.log('fName',fName);
    console.log('lName',lName);
    console.log('email',email);

    
      mailchimp.setConfig({
          apiKey: config.MAILCHIMP_KEY,
          server: config.MAILCHIMP_PREFIX,
        });
        const response = await mailchimp.lists.getAllLists();
        let name = config.MAILCHIMP_TAG_NAME;
        
        const foundLists = response['lists'].filter(list => list.name.toLowerCase().includes(name.toLowerCase()));
        console.log('foundLists',foundLists[0].id);
        
        const responseAdd = await mailchimp.lists.addListMember(foundLists[0].id, {
            email_address: email,
            status: 'subscribed', // Can be 'subscribed', 'unsubscribed', 'cleaned', or 'pending'
            merge_fields: {
              FNAME: fName,
              LNAME: lName,
            },
            tags: [config.MAILCHIMP_TAG_NAME], // Add a source tag, e.g., 'Google Ads'
          });
  } catch (error) {
     console.log('error',error);
      
  }
  
 

} 
async function companyConfirmation  (companyname, zip, city, street, state) {
  console.log("companyConfirmation function");
  console.log({
    companyname, zip, city, street, state
  });
  
  let keyDatas = {
    companyName:companyname, zip, city, street, state
  }
  let mailData = await fetchEmailContent('new_company_register','de',keyDatas);
  let message = mailData.message;
  let subject = mailData.subject;
  console.log("Subject Admin",subject);
  /* const message =
      `Hallo<br><br>
        <div> Die nachfolgende Firma hat sich soeben im Marketplace registriert:
        </div><br>
        <div>` +
              companyname +
              `</div>
        <div>` +
              state +
              ' ' +
              street +
              `</div>
        <div>` +
              zip +
              ' ' +
              city +
              `</div><br>
        Freundliche Grüsse<br>
        Marketplace`;
        console.log('mailContent',message); */
        

          try {
              await sendEmail({
                  email: config.DEBUG ? config.DEBUG_MAIL : config.MARKET_PLACE_ADMIN_EMAIL,
                  subject,
                  message,
              });
            
          } catch (error) {
              throw error;
            
          }

};

const moveFile = async (netcomId,fileName)=>{
  let formData = null
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
      commonErrors['errorTitle'] = getStatus.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+netcomId+fileName;
      warningMessage(commonErrors,error);
    fs.writeFile('assets/errorLog.txt', JSON.stringify(error), function () {
      // res.send();
      resolve('');
    });
  }
}
const getEbillUsedCount = async (req, res) => {
  let decryptData = null;
  let partyObjectId;
  let data = req.body;
  const pool = await connectPostgres;
  try {
      decryptData = encryptionControl.decrypt(req.body.encrToken);
      // const decryptData = req.body;
      const companyId = decryptData.companyId;
      let addStartDate;
      let returnData = [];
      let ebillCount = 0;
      let ebillPrice = 0;
    
      const getPartyObjectIdQry = `SELECT objectid
          FROM party
          WHERE cid=$1`;
      const partyObjectIdResult = await pool.query(getPartyObjectIdQry,[companyId]);
      if(partyObjectIdResult.rows.length>0){
          partyObjectId = partyObjectIdResult.rows[0].objectid;
          const getStartDateQry = `SELECT pw."lastUpdated" AS startDate
              FROM party_application_version_plan pavp 
              INNER JOIN application_version_plan avp ON avp.cid = pavp.fk_application_version_plan
              INNER JOIN plan pl ON pl.cid = avp.fk_plan
              INNER JOIN "partyWallet" pw ON avp.fk_plan = pw.fk_plan AND pw.fk_party = pavp.fk_party
              WHERE pavp.fk_party = $1`;
          const startDateResult = await pool.query(getStartDateQry,[companyId]);
          if(startDateResult.rows.length>0)
          addStartDate = startDateResult.rows[0].startdate;
          const getEDIAnalyticsQry = `SELECT count(cid) AS total
              FROM analytics
              WHERE "partyObjectid"=$1
              AND "serviceKey"='EBILL'
              AND (entereddate, entereddate) OVERLAPS (NOW()::DATE- '0 DAY'::INTERVAL ,$3::DATE - '0 DAY'::INTERVAL)
              AND "paidStatus" = false
              AND reserve = $2`;
          const ediAnalyticsResult = await pool.query(getEDIAnalyticsQry,[partyObjectId,0,addStartDate]);
          ebillCount =  ediAnalyticsResult.rows[0].total;
          const qrySelect = `SELECT * FROM ebill 
              WHERE active=true
              ORDER BY position ASC`
          const result = await pool.query(qrySelect);
          if(result.rows.length>0){
              for (let i = 0; i < result.rows.length; i++) {
                  const element = result.rows[i];
                  console.log(element);
                  
                  if(ebillCount > parseInt(element.ebillpermonthmin) && ebillCount <= parseInt(element.ebillpermonth))
                  {
                    ebillPrice = element.cost;
                  }
              }
          }
      }
      returnData.push({"count":ebillCount,"price":ebillPrice})
      return res.status(200).json({
          data: returnData,
          status_code: 200,
          message: 'success',
          status: true,
      });
  } catch (error) {

      logs.action = 'EBIL_USED_COUNT';
      logs.level = 'ERROR';
      logs.item = 'EBILL';
      // //addlogs(logs,data.rolePartyId,data.roleAccId);
      commonErrors['errorTitle'] = req.originalUrl;
      let responseValue = JSON.stringify(decryptData)
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+responseValue;
      warningMessage(commonErrors,error);
      return res.status(200).json({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
      });  
  }
}
// const pushInvoice = async (req, res) => {
//   try {
//     const formData = req.body;
//     console.log('pushInvoiceFormData',formData);
//     console.log('req.url',req.url);
//     return res.status(200).json({
//       data: '',
//       status_code: 200,
//       message: 'success',
//       status: true,
//   });
//   } catch (error) {
//     try {
//       console.log('req.url',req.url);
//       return res.status(200).json({
//         data: '',
//         status_code: 200,
//         message: 'success',
//         status: true,
//     });
//     } catch (error) {
//     console.log('pushInvoiceFormData2',error);
//     return res.status(500).json({
//       data: '',
//       status_code: 200,
//       message: 'error',
//       status: true,
//   });
//     }
//     console.log('errorPushInvoice1',error);
//     return res.status(500).json({
//       data: '',
//       status_code: 200,
//       message: 'error',
//       status: true,
//   });
//   }
 
  
// }

const getRefrenceNumber = async (pdf,invoiceNumber,billerDetails)=>{
  //  let access_token = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_NAME]))).access_token;
  // let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
  // let pdf,accessToken = cookie.access_Token;
      
    try {
      // pdf = await getInvoicePdf(accessToken,70);
      // console.log('pdf',pdf);
      // console.log('base64base64',pdf);
      let data ={
        billerDetails:billerDetails,
        invoiceNumber:invoiceNumber
      }
      const buf = Buffer.from(pdf, 'base64');
      // console.log('12321');
      // console.log('bufbufbuf',buf);
      
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
          // if (error) {  
          //   commonErrors['errorTitle'] = 'getCountryLists';
          //   commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString();
          //   warningMessage(commonErrors,'');
          //   resolve(false)
          // }
          // res.send(response.body)
          //console.log(response.body);

          console.log("456",response.body.length);
          if(response.body.length < 3)
          {
            // CHANGES MADE FOR  QR CODE ISSUES[QR CODE IS NOT READING FOR SOME COMPANYS]
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
          // console.log('response.body',response.body.split("\\n"));
          // if(response.statusCode == 200)
          // {
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

              // console.log('errorerror',error);
      
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
          // }
          // else
          // resolve(false)

        });
      });
      
    } catch (error) {
      console.log('errorerror',error);
      commonErrors['errorTitle'] = 'getRefrenceNumber';
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_xml_not_found '+'-req param,'+invoiceNumber;
      warningMessage(commonErrors,'ebill_xml_not_found');
      fs.writeFile('assets/errorLog.txt', JSON.stringify(error), function () {
        // res.send();
        resolve('');
      });
    }
}
const getBillerIds = async (partyId,contactId) => {
  let bexioPool = await postgresBexio;
  // let ebillPool = await connectEbill;
  const ebillPool = await connectEbill;
  console.log('partyId',partyId);
  console.log('contactId',contactId);
  const pool = await connectPostgres;
  return new Promise(async(resolve, reject) => {
  try {
      let getBillerIdsQry = `SELECT recipientid, cr."netcomid"
      FROM contact_bc c
      INNER JOIN companyregistered cr ON cr.cid = c.fk_companyregistered
      WHERE  cr.rk_party = $1
        AND rk_contact = $2`
      let getBillerIdsResult = await bexioPool.query(getBillerIdsQry,[partyId,contactId]);
      console.log('getBillerIdsResult',getBillerIdsResult.rows[0].netcomid);

      let getBiller = `SELECT billerid
      FROM biller
      WHERE netcomid = '${getBillerIdsResult.rows[0].netcomid}'`
      let getBillerResult = await ebillPool.query(getBiller);
      console.log('getBillerResult',getBillerResult.recordset);
   

      // let result = {
      //   status:true,
      //   recipientid:getBillerIdsResult.rows.length !=0 ?getBillerIdsResult.rows[0].recipientid:'testNet',
      //   billerid:getBillerResult.rows.length !=0 ?getBillerIdsResult.rows[0].billerid:'testNet'
      // }
      let result = {
        status:true,
        recipientid:getBillerIdsResult.rows.length !=0 ?getBillerIdsResult.rows[0].recipientid:'',
        billerid:getBillerResult.recordset.length !=0 ?getBillerResult.recordset[0].billerid:''
      }
      resolve(result);
    } catch (error) {
      
      console.log('errrror',error);
      
      resolve(false);
    }
  })
}
const setInvoiceEbillOt = async (invoice,coutryList,contactNumber,pdf,fileName,invoiceCid,billerDetails,formData,invoiceLogUid) => {
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
  
  // if(invoice['total_credit_vouchers'] == 0)
  // {
  //   console.log('if');
    
  //   total = invoice['total'];
  // }else{
  //   console.log('else');

  //   total = invoice['total_remaining_payments'];

  // }
  total = invoice['total_remaining_payments'];
  console.log('totttttal',total);

  console.log('billDetails',billDetails);
  // let billerDetails ={
  //   'recipientid':10000000,
  //   'billerid':2000000
  // }
  // console.log('invoiceinvoiceinvoice',invoice);
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

  let allTax = []

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
  

// console.log('123',obj.OPENTRANS['INVOICE'][0]['INVOICE_SUMMARY'][0]);

//  console.log('invoice.positions',invoice.positions);
 
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
              "bmecat:DESCRIPTION_SHORT": element.article.intern_name?element.article.intern_name.substring(0, 145):undefined, // product id mandatory field so just added intername as description short
              "bmecat:DESCRIPTION_LONG": element.article.intern_description? element.article.intern_description:undefined
          }],
          "QUANTITY": element.amount?Math.trunc(element.amount):1,
          "bmecat:ORDER_UNIT": orderUnit[element.unit_name]?orderUnit[element.unit_name]:'C62', // add defult value directly
          "PRODUCT_PRICE_FIX": [JSON.parse(JSON.stringify({
              "bmecat:PRICE_AMOUNT": element.unit_price == null ? 0.00 : parseFloat(element.unit_price).toFixed(2),
              "TAX_DETAILS_FIX":element.tax?.value&&taxIsAdded>0? [{
                  "bmecat:TAX_TYPE": element.tax?.type,
                  "bmecat:TAX": element.tax?.value
                  // "TAX_AMOUNT": element.tax_value
              }]:undefined,
  
        
          "bmecat:PRICE_QUANTITY": priceQuantity, // add defult value directly.
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
      // element.article.intern_description==''?delete obj.OPENTRANS.INVOICE[0]['INVOICE_ITEM_LIST'][0]['INVOICE_ITEM'][obj.OPENTRANS.INVOICE[0]['INVOICE_ITEM_LIST'][0]['INVOICE_ITEM'].length-1]['PRODUCT_ID'][0]['bmecat:DESCRIPTION_LONG']:'';
       element.discount_in_percent==null?delete obj.OPENTRANS.INVOICE[0]['INVOICE_ITEM_LIST'][0]['INVOICE_ITEM'][obj.OPENTRANS.INVOICE[0]['INVOICE_ITEM_LIST'][0]['INVOICE_ITEM'].length-1]['PRODUCT_PRICE_FIX'][0]['ALLOW_OR_CHARGES_FIX']:'';
  }

  // console.log('objobjobj',JSON.stringify(obj));
  // let builder = new xml2js.Builder();
  let builder = new xml2js.Builder({'xmldec.version':1.0} );
  var xml = builder.buildObject(obj);
  console.log(xml);
  // console.log(xml)
  return Buffer.from(xml).toString('base64');
  // console.log('OT', JSON.stringify(obj));
}
const pushInvoice = async (req,res)=>{
    let formData
    try {
      formData = req.body;

      console.log('pushInvoiceFormData',formData);
      console.log('req.url',req.url);
    //   return res.status(200).json({
    //     data: '',
    //     status_code: 200,
    //     message: 'success',
    //     status: true,
    // });
    } catch (error) {
      try {
        console.log('req.url',req.url);
      //   return res.status(200).json({
      //     data: '',
      //     status_code: 200,
      //     message: 'success',
      //     status: true,
      // });
      } catch (error) {
      console.log('pushInvoiceFormData2',error);
      return res.status(500).json({
        data: '',
        status_code: 200,
        message: 'error',
        status: true,
    });
      }
      console.log('errorPushInvoice1',error);
      return res.status(500).json({
        data: '',
        status_code: 200,
        message: 'error',
        status: true,
    });
    }
  let cookie;
  try {
      let status,errorMsg,tokenSet;
      let invoice,paymentType,companyDetails;
      const pool = await connectPostgres;
      let bexioPool = await postgresBexio;
      const ebillPool = await connectEbill;
      const decryptData = req.body;
      const invoice_id = decryptData.invoice_id;
      const biller_pid = decryptData.biller_pid;
      const contact_pid = decryptData.contact_pid;
      const invoice_uuid = decryptData?.invoice_uuid;

      let billerDetails = {
        'recipientid':decryptData.contact_pid,
        'billerid':decryptData.biller_pid
      }

      let getBiller = `SELECT * 
        FROM biller
        WHERE billerid  = '${decryptData.biller_pid}'
        AND status = 'ACTIVE'`
      let getBillerResult = await ebillPool.query(getBiller);
   
      
      
     
      if(getBillerResult.recordset.length == 0)
      {
        let invoiceCid:any;
        // invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
        let objectId = crypto.randomBytes(15).toString('hex');
        logs.action = 'PUSHINVOICE';
        logs.objectid = objectId;
        logs.rk_party_application_version = '';
        logs.rk_objectid = invoiceCid;
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        logs.companyName = '';
        logs.user.name = '';
        logs.user.email = '';
        logs.application.name = '';
        logs.application.version = '';
        logs.timestamp = new Date().toString();
        logs['rk_object'] = invoiceCid;
        //addlogs(logs);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'biller_not_found '+'-req param,'+JSON.stringify(decryptData);
        warningMessage(commonErrors,'biller_not_found');
        res.send({
          status_code: 500,
          message: 'biller_not_found',
          status: false,
       });
      return
      }
      console.log('getBillerResult222',getBillerResult.recordset[0]);
      const qrySelectRefreshToken = `SELECT * FROM companyregistered 
      WHERE refreshtoken IS NOT NULL AND netcomid = '${getBillerResult.recordset[0].netcomid}'`
      const result = await bexioPool.query(qrySelectRefreshToken);
      const partyId = result.rows[0].rk_party;

      // const qryGetCompanyName = `SELECT companyname FROM 
      //   legalparty WHERE fk_party=  ${partyId}`
      // const resultCompanyName = await bexioPool.query(qryGetCompanyName);

      let planFound = true;
      let checkPlanQry = `SELECT * FROM party_application_version_plan WHERE fk_party = $1`
      const checkPlan = await pool.query(checkPlanQry, [partyId]);
      if(checkPlan.rows.length == 0){
          let checkAddonQry = `SELECT * FROM party_application_version_addon WHERE fk_party = $1`
          const checkAddon = await pool.query(checkAddonQry, [partyId]);
          if(checkAddon.rows.length == 0){
              planFound = false;
          }
      }

      if(!planFound)
      {
        let invoiceCid:any;
        invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
        let objectId = crypto.randomBytes(15).toString('hex');
        logs.action = 'PUSHINVOICE';
        logs.objectid = objectId;
        logs.rk_party_application_version = '';
        logs.rk_objectid = invoiceCid;
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        logs.companyName = '';
        logs.user.name = '';
        logs.user.email = '';
        logs.application.name = '';
        logs.application.version = '';
        logs.timestamp = new Date().toString();
        logs['rk_object'] = invoiceCid;
        //addlogs(logs);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'plan_not_found '+'-req param,'+JSON.stringify(decryptData);
        warningMessage(commonErrors,'plan_not_found');
        res.send({
          status_code: 500,
          message: 'plan_not_found',
          status: false,
       });
      return
      }

      const qryGetCompanyDetails = ` SELECT pa.cid,lp.companyname,a.code AS app,av.version AS appversion
        FROM partyapplication pa 
          INNER JOIN application_version av ON av.cid = pa.fk_application_version  
          INNER JOIN application a ON a.cid = av.fk_application
          INNER JOIN legalparty lp ON lp.fk_party = pa.fk_party
        WHERE pa.fk_party = ${partyId} AND a.code = 'EBILL'`
      const companyDetailsResult = await pool.query(qryGetCompanyDetails);
      console.log('companyDetailsResult',companyDetailsResult.rows[0]);
      let companyJson = JSON.parse(getBillerResult.recordset[0].companyJSON);
      let defaultLang = companyJson['localizedData']['defaultLanguage'];
      console.log('companyJson',companyJson['localizedData'][defaultLang]['emailAddress']);
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
        console.log(options);
        
        await request(options, async function (error, response) {
          if (error) {
            resolve(false)
          }
          else {
            if (response.statusCode == 200) {
              let resData = JSON.parse(response.body)
              console.log(resData);
              console.log(resData.items[0].ebillSubmissionStatus);
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
    // Revert this changes for live, commented for test only 
    // let checkRecipientData = await checkRecipientValid(decryptData.biller_pid,decryptData.contact_pid);

    let checkRecipientData = true;
    console.log("checkRecipientData----",checkRecipientData);
    if (!checkRecipientData) {
      // await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR')
      // await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR-INTERNAL','Dieser "Kontakt" hat Sie als Rechnungssteller bisher noch nicht abonniert. Bitte kontaktieren Sie Ihren Kunden.')
      await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR-INTERNAL','Dieser "Kontakt" hat Sie als Rechnungssteller bisher noch nicht abonniert. Bitte kontaktieren Sie Ihren Kunden.',getBillerResult.recordset[0].netcomid)
      let invoiceCid:any;
      invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
      let objectId = crypto.randomBytes(15).toString('hex');
      logs.action = 'PUSHINVOICE';
      logs.objectid = objectId;
      logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
      logs.rk_objectid = invoiceCid;
      logs.level = 'ERROR';
      logs.item = 'EBILL';
      logs.companyName = companyDetailsResult.rows[0].companyname;
      logs.user.name = '';
      logs.user.email = '';
      logs.application.name = companyDetailsResult.rows[0].app;
      logs.application.version = companyDetailsResult.rows[0].appversion;
      logs.timestamp = new Date().toString();
      logs['rk_object'] = invoiceCid;
      //addlogs(logs);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) +' comapny_name '+tempCompanyName+ ' email_id '+tempMail + ' recipientId_not_allowed' + '-req param,' + JSON.stringify(decryptData);
      console.log('commonErrorscommonErrors',commonErrors);
    
      warningMessage(commonErrors, 'recipientId_not_allowed');
      res.send({
        status_code: 500,
        message: 'recipientId_not_allowed',
        status: false,
      });
      return
    }

      console.log('tokenSet1',result.rows[0]);
      if(result.rows.length == 0)
      {
        let invoiceCid:any;
        // await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR')

        invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
        let objectId = crypto.randomBytes(15).toString('hex');
        logs.action = 'PUSHINVOICE';
        logs.objectid = objectId;
        logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
        logs.rk_objectid = invoiceCid;
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        logs.companyName = companyDetailsResult.rows[0].companyname;
        logs.user.name = '';
        logs.user.email = '';
        logs.application.name = companyDetailsResult.rows[0].app;
        logs.application.version = companyDetailsResult.rows[0].appversion;
        logs.timestamp = new Date().toString();
        logs['rk_object'] = invoiceCid;
        //addlogs(logs);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'refreshToken_not_found '+'-req param,'+JSON.stringify(decryptData);
        warningMessage(commonErrors,'refreshToken_not_found');
        res.send({
          status_code: 500,
          message: 'refreshToken_not_found',
          status: false,
       });
      return
      }
      // let accessToken = cookie.access_Token;
      // const partyId = result.rows[0].rk_party;
      // const accountId = decryptData.accountId;
      // const invoiceId = decryptData.invoiceId;
      try {

        tokenSet = await bexioClient.refresh(result.rows[0].refreshtoken);
        
      } catch (error) {
        console.log('refresherrorerror',error);

        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'refreshToken_not_found '+'-req param,'+JSON.stringify(decryptData);
        warningMessage(commonErrors,'refreshToken_not_found');
        res.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
        return
      }
      console.log('tokenSet',tokenSet);
      const invoiceId = decryptData.invoice_id;
      let accessToken = tokenSet.access_token;
      invoice = await getInvoiceOT(accessToken,invoiceId);
      console.log('invoice',invoice);
      if(!invoice)
      {
        let invoiceCid:any;
        // await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR-INTERNAL','Invoice Not Found')

        invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
        let objectId = crypto.randomBytes(15).toString('hex');
        logs.action = 'PUSHINVOICE';
        logs.objectid = objectId;
        logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
        logs.rk_objectid = invoiceCid;
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        logs.companyName = companyDetailsResult.rows[0].companyname;
        logs.user.name = '';
        logs.user.email = '';
        logs.application.name = companyDetailsResult.rows[0].app;
        logs.application.version = companyDetailsResult.rows[0].appversion;
        logs.timestamp = new Date().toString();
        logs['rk_object'] = invoiceCid;
        //addlogs(logs);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_invoice_not_found '+'-req param,'+JSON.stringify(decryptData);
        warningMessage(commonErrors,'ebill_invoice_not_found');
        res.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
        return
      }
      // Revert this changes for live, commented for test only 

      // let recipentStatus = await checkRecipient(decryptData.biller_pid,decryptData.contact_pid,invoice.contact_id,accessToken)
      let recipentStatus =true;

      console.log("#######recipentStatus####",recipentStatus);
      if(!recipentStatus) 
      {
        let invoiceCid:any;
        // await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR-INTERNAL','Dieser "Kontakt" hat Sie als Rechnungssteller bisher noch nicht abonniert. Bitte kontaktieren Sie Ihren Kunden.')
        await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR-INTERNAL','Dieser "Kontakt" hat Sie als Rechnungssteller bisher noch nicht abonniert. Bitte kontaktieren Sie Ihren Kunden.',getBillerResult.recordset[0].netcomid)
        invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
        let objectId = crypto.randomBytes(15).toString('hex');
        logs.action = 'PUSHINVOICE';
        logs.objectid = objectId;
        logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
        logs.rk_objectid = invoiceCid;
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        logs.companyName = companyDetailsResult.rows[0].companyname;
        logs.user.name = '';
        logs.user.email = '';
        logs.application.name = companyDetailsResult.rows[0].app;
        logs.application.version = companyDetailsResult.rows[0].appversion;
        logs.timestamp = new Date().toString();
        logs['rk_object'] = invoiceCid;
        //addlogs(logs);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_Recipient_not_found '+'-req param,'+JSON.stringify(decryptData);
        warningMessage(commonErrors,'ebill_Recipient_not_found');
        res.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
        return
      }
      // console.log('invoice',invoice);
      console.log('partyId',partyId);
      // console.log('accountId',accountId);
      // console.log('contact_id',invoice.contact_id);

      // let invitionData = await getEbillConnectionDetails(partyId,accountId,invoice.contact_id,req);
      // console.log(invitionData);
      // let customerIds = await constGetContactId(invitionData[0].rk_businessconnection);
      // console.log(customerIds);
      // console.log('invitionData',invitionData);
      
      // if(invitionData != undefined)
      // {
        
        let pdf,fileName,pdfContent;
        pdf = await getInvoicePdf(accessToken,invoiceId);
        if(!pdf)
        {
          let invoiceCid:any;
          // await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR-INTERNAL','PDF Not Found')

          invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
          let objectId = crypto.randomBytes(15).toString('hex');
          logs.action = 'PUSHINVOICE';
          logs.objectid = objectId;
          logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
          logs.rk_objectid = invoiceCid;
          logs.level = 'ERROR';
          logs.item = 'EBILL';
          logs.companyName = companyDetailsResult.rows[0].companyname;
          logs.user.name = '';
          logs.user.email = '';
          logs.application.name = companyDetailsResult.rows[0].app;
          logs.application.version = companyDetailsResult.rows[0].appversion;
          logs.timestamp = new Date().toString();
          logs['rk_object'] = invoiceCid;
          //addlogs(logs);
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_pdf_not_found '+'-req param,'+JSON.stringify(decryptData);
          warningMessage(commonErrors,'ebill_pdf_not_found');
          console.log('pdf');
          res.send({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
        
          });
          return
        
        }
        pdfContent = JSON.parse(pdf).content;
        fileName = JSON.parse(pdf).name;
        // let pdf ='dasd'
        // console.log(invitionData[0]);
        let coutryList;
        coutryList = await getCountryLists(accessToken);
        if(!coutryList)
        {
          let invoiceCid:any;
          // await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR')
          // invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
          let objectId = crypto.randomBytes(15).toString('hex');
          logs.action = 'PUSHINVOICE';
          logs.objectid = objectId;
          logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
          logs.rk_objectid = invoiceCid;
          logs.level = 'ERROR';
          logs.item = 'EBILL';
          logs.companyName = companyDetailsResult.rows[0].companyname;
          logs.user.name = '';
          logs.user.email = '';
          logs.application.name = companyDetailsResult.rows[0].app;
          logs.application.version = companyDetailsResult.rows[0].appversion;
          logs.timestamp = new Date().toString();
          logs['rk_object'] = invoiceCid;
          // //addlogs(logs);

          console.log('coutryList');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_coutryList_not_found '+'-req param,'+JSON.stringify(decryptData);
          // warningMessage(commonErrors,'ebill_coutryList_not_found');
          res.send({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
        
          });
          return
        }
        coutryList = JSON.parse(coutryList);
        // let bank
        // bank = await getBank(accessToken,invoice.bank_account_id);
        // if(!bank)
        // {
        //   res.send({
        //     status_code: 500,
        //     message: 'something_went_wrong',
        //     status: false,
        
        // });
        // return
        // }
        // invoice['bank'] = 'iban_nr' in bank ? bank : '';
        // if('iban_nr' in bank)
        // {
        //   invoice['bank'] = bank;
        // }else{
        //   res.send({
        //     status_code: 500,
        //     message: 'bexio_bank_error',
        //     status: false,
        //   });
        //   return
        // }
        console.log('123');
        console.log('invoice.currency_id',invoice.currency_id);
        
        let currency = await getCurrency(accessToken,invoice.currency_id);
        if(!currency)
        {
          let invoiceCid:any;
          // await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR')

          invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
          let objectId = crypto.randomBytes(15).toString('hex');
          logs.action = 'PUSHINVOICE';
          logs.objectid = objectId;
          logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
          logs.rk_objectid = invoiceCid;
          logs.level = 'ERROR';
          logs.item = 'EBILL';
          logs.companyName = companyDetailsResult.rows[0].companyname;
          logs.user.name = '';
          logs.user.email = '';
          logs.application.name = companyDetailsResult.rows[0].app;
          logs.application.version = companyDetailsResult.rows[0].appversion;
          logs.timestamp = new Date().toString();
          logs['rk_object'] = invoiceCid;
          //addlogs(logs);

          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_currency_not_found '+'-req param,'+JSON.stringify(decryptData);
          warningMessage(commonErrors,'ebill_currency_not_found');
          res.send({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
        
          });
          return
        }
        invoice['currency'] = currency;
        let temp = await getloginUserCompanyDetails(accessToken);
        console.log(temp);
        

        if(!temp)
        {
          let invoiceCid:any;
          // await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR-INTERNAL','User Details Not found')

          invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
          let objectId = crypto.randomBytes(15).toString('hex');
          logs.action = 'PUSHINVOICE';
          logs.objectid = objectId;
          logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
          logs.rk_objectid = invoiceCid;
          logs.level = 'ERROR';
          logs.item = 'EBILL';
          logs.companyName = companyDetailsResult.rows[0].companyname;
          logs.user.name = '';
          logs.user.email = '';
          logs.application.name = companyDetailsResult.rows[0].app;
          logs.application.version = companyDetailsResult.rows[0].appversion;
          logs.timestamp = new Date().toString();
          logs['rk_object'] = invoiceCid;
          //addlogs(logs);
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_companyDetails_not_found '+'-req param,'+JSON.stringify(decryptData);
          warningMessage(commonErrors,'ebill_companyDetails_not_found');
          res.send({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
          });
          return;
        }
        invoice['companyProfile'] = temp;
        invoice['companyProfile'] = JSON.parse(invoice['companyProfile']);
        // paymentType = await getPaymentType(accessToken,invoice.payment_type_id);
        paymentType = true;
        if(!paymentType)
        {
          let invoiceCid:any;
          // await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR-INTERNAL','payment details not found')

          invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
          let objectId = crypto.randomBytes(15).toString('hex');
          logs.action = 'PUSHINVOICE';
          logs.objectid = objectId;
          logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
          logs.rk_objectid = invoiceCid;
          logs.level = 'ERROR';
          logs.item = 'EBILL';
          logs.companyName = companyDetailsResult.rows[0].companyname;
          logs.user.name = '';
          logs.user.email = '';
          logs.application.name = companyDetailsResult.rows[0].app;
          logs.application.version = companyDetailsResult.rows[0].appversion;
          logs.timestamp = new Date().toString();
          logs['rk_object'] = invoiceCid;
          //addlogs(logs);

          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_paymentType_not_found '+'-req param,'+JSON.stringify(decryptData);
          warningMessage(commonErrors,'ebill_paymentType_not_found');
          res.send({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
        
          });
          return
        
        }
        // let tempPaymentType = paymentType.filter(e => e.id == invoice.payment_type_id);
        invoice['paymentType'] = true;
        let contact = await getContact(accessToken,invoice.contact_id);
        if(!contact)
        {
          let invoiceCid:any;
          // await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR')

          invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
          let objectId = crypto.randomBytes(15).toString('hex');
          logs.action = 'PUSHINVOICE';
          logs.objectid = objectId;
          logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
          logs.rk_objectid = invoiceCid;
          logs.level = 'ERROR';
          logs.item = 'EBILL';
          logs.companyName = companyDetailsResult.rows[0].companyname;
          logs.user.name = '';
          logs.user.email = '';
          logs.application.name = companyDetailsResult.rows[0].app;
          logs.application.version = companyDetailsResult.rows[0].appversion;
          logs.timestamp = new Date().toString();
          logs['rk_object'] = invoiceCid;
          //addlogs(logs);
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_contact_not_found '+'-req param,'+JSON.stringify(decryptData);
          warningMessage(commonErrors,'ebill_contact_not_found');
          res.send({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
        
          });
          return
        
        }
        invoice['contact'] = contact;
        // let user = await getUser(accessToken,invoice.user_id);
        let user = true

        if(!user)
        {
          let invoiceCid:any;
          // await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR-INTERNAL')

          invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
          let objectId = crypto.randomBytes(15).toString('hex');
          logs.action = 'PUSHINVOICE';
          logs.objectid = objectId;
          logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
          logs.rk_objectid = invoiceCid;
          logs.level = 'ERROR';
          logs.item = 'EBILL';
          logs.companyName = companyDetailsResult.rows[0].companyname;
          logs.user.name = '';
          logs.user.email = '';
          logs.application.name = companyDetailsResult.rows[0].app;
          logs.application.version = companyDetailsResult.rows[0].appversion;
          logs.timestamp = new Date().toString();
          logs['rk_object'] = invoiceCid;
          //addlogs(logs);

          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_user_not_found '+'-req param,'+JSON.stringify(decryptData);
          warningMessage(commonErrors,'ebill_user_not_found');
          res.send({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
        
          });
          return
        
        }
        invoice['user'] = user;
        // companyDetails = await getloginUserCompanyDetails(accessToken)
       
        if(invoice.positions.length != 0)
        {
          for (const items of invoice.positions) {
            console.log('items.tax_id',items.tax_id);
            if(items.tax_id){
              let tempTax = await getTaxs(accessToken,items.tax_id);
              if(!tempTax)
              {
                commonErrors['errorTitle'] = req.originalUrl;
                commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_tax_not_found '+'-req param,'+JSON.stringify(decryptData);
                warningMessage(commonErrors,'ebill_tax_not_found');
                res.send({
                  status_code: 500,
                  message: 'something_went_wrong',
                  status: false,
                });
                return
              }
              items['tax'] = tempTax;
            }
            
            
            let tempItem;
            console.log('tempItem',tempItem);
            if('article_id' in items)
            {
              tempItem = await getProducts(accessToken,items.article_id);
              items['article'] = tempItem;
              // console.log('articleas',items['article']);
              
            }else{
              console.log('items',items);
              
              items['article'] = {}
              items['article']['intern_name'] = items.text;
              items['article']['intern_description'] = items.text;

            }
            // return
            // if(!tempItem)
            // {
            //   res.send({
            //     status_code: 500,
            //     message: '',
            //     status: false,
            
            // });
            // return
            // }
          
          }
        }else{
          let items = {};
          items['article'] = {}
          items['article']['intern_name'] = 'Dummy Name';
          items['article']['intern_description'] = 'Dummy Desccription';
          invoice.positions.push(items);
        }  

        // console.log('pdfpdf',pdf);
        // console.log('final',JSON.stringify(invoice));
        
        
        //  console.log('invoice',JSON.stringify(invoice));
        // console.log('invoiceinvoice',invoice);
        let xml;
        // let invoiceCid:any;
        decryptData['bank_id'] = 'bank_account_id' in invoice ? invoice['bank_account_id'] : '';
        let invoiceCidSucess = await setEbillInvoiceSendStatus(partyId,invoiceId,invoice['document_nr'],decryptData,'1');
        xml = await setInvoiceEbillOt(invoice,coutryList,'',pdfContent,fileName,'',billerDetails,decryptData,invoiceCidSucess);

        // xml = await setInvoiceEbillOt(invoice,coutryList,invitionData[0],pdfContent,fileName,customerIds,invoiceCid,netcomdId,);
        // file drp
        //  console.log('xml',xml);
        if(xml == false){
          // let invoiceCid:any;
          // invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
          // let updateQry =`UPDATE 
          // documents_invoice_send
          //   SET status = $1
          // WHERE objectid = $2`
          // await bexioPool.query(updateQry,['0',invoiceCidSucess]);
          let invoiceCid:any;
          // await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR-INTERNAL','Diese Rechnung enthält keine gültige Bankverbindungen. Bitte prüfen Sie die IBAN unter "Banking".',getBillerResult.recordset[0].netcomid);
          invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
          let objectId = crypto.randomBytes(15).toString('hex');
          logs.action = 'PUSHINVOICE';
          logs.objectid = objectId;
          logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
          logs.rk_objectid = invoiceCid;
          logs.level = 'ERROR';
          logs.item = 'EBILL';
          logs.companyName = companyDetailsResult.rows[0].companyname;
          logs.user.name = '';
          logs.user.email = '';
          logs.application.name = companyDetailsResult.rows[0].app;
          logs.application.version = companyDetailsResult.rows[0].appversion;
          logs.timestamp = new Date().toString();
          logs['rk_object'] = invoiceCid;
          //addlogs(logs);

          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_xml_not_found '+'-req param,'+JSON.stringify(decryptData);
          warningMessage(commonErrors,'ebill_xml_not_found');
          res.send({
            status_code: 500,
            message: 'invoice_error',
            status: false,
          });
          return
        }

        // let invoiceCid = await setEbillInvoiceSendStatus(partyId,invoiceId,invoice['document_nr'],decryptData);

        await invoiceFilePush(getBillerResult.recordset[0].netcomid,'WS',xml,invoice['document_nr'],'EBILL');
   
            res.send({
              status_code: 200,
              message: '',
              status: true,
          });
        
      //   }else{
      //     res.send({
      //       status_code: 500,
      //       message: 'invoice_push_error',
      //       status: false,
      //   });
      // }

  
} catch (error) {
        console.log('error',error);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+formData;
        warningMessage(commonErrors,error);
  res.send({
    status_code: 500,
    message: '',
    status: false,
});
}

}
// const sendEbill = async (req, res) => {

//   const pool = await connectPostgres;
//   let bexioPool = await postgresBexio;
//   const qrySelectRefreshToken = `SELECT * FROM companyregistered 
//     WHERE refreshtoken IS NOT NULL AND gk_party=6`
//   const result = await bexioPool.query(qrySelectRefreshToken);
//   console.log('tokenSet',result.rows[0].refreshtoken);
//   let v = setInvoiceEbillOt();
//   // const tokenSet = await bexioClient.refresh(result.rows[0].refreshtoken);
//   // console.log('tokenSet',tokenSet);

// }
const getEbillConnectionDetails = async (partyId,accountId,contactId,req) => {
  let dataCookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.cookies[config.EXPIRE_EXPIRES_COOKIE_NAME])));
  const pool = await connectPostgres;
  let data = req. body;
  try {
    console.log(contactId);
    let bexioPool = await postgresBexio;
    console.log(dataCookie.netcomId);
    console.log(config.G2B_COMMON_ACTIVE);
    console.log(dataCookie.netcomId);
    const getConnectionStatus = `SELECT  * FROM
      contact_bc 
      WHERE rk_netcomidsender = '${dataCookie.netcomId}'
      AND rk_sendercontactid = ${contactId}
      AND type = 'EDI'
      AND rk_businessconnection IS NOT NULL`
    let partyObjectId = await bexioPool.query(getConnectionStatus);
   
    return partyObjectId.rows;
  } catch (error) {
      logs.action = 'GET_EBILL_CONNECTION_DETAILS';
      logs.level = 'ERROR';
      logs.item = 'EBILL';
      // //addlogs(logs,data.rolePartyId,data.roleAccId);
      commonErrors['errorTitle'] = getConnectionDetails.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+contactId;
      warningMessage(commonErrors,error);
    console.log(error);
    
  }
}
const setEbillInvoiceSendStatus = async (partyId,invoiceId,invoicenumber,formData,status,error?) => {
  let sendInvoiceId = '';
    console.log('invoiceId',invoiceId);
    console.log('partyId',partyId);
    console.log('partyId',partyId);
    console.log('formData',formData);
    let responseBody = error;
    const pool = await connectPostgres;
    return new Promise(async function (resolve, reject) {
     try {
         
          const bexioPool = await postgresBexio;
          const selectQry = `SELECT c.cid,ds.cid as invoicesendid,ds.objectid FROM documents_invoice_send ds 
            INNER JOIN companyregistered c ON ds.fk_companyregistered = c.cid
            WHERE c.rk_party = $1
            AND rk_invoice = $2
            AND invoicetype = 'EBILL'`
          const selectQryResult = await bexioPool.query(selectQry,[partyId,invoiceId]);
          console.log('selectQryResult',selectQryResult.rows);
          
          let insertQry;
          console.log('azaaza',selectQryResult.rows.length);

          if(selectQryResult.rows.length == 0)
          {
            console.log('azaaza');
            
            const selectQry = `SELECT * FROM companyregistered
              WHERE rk_party = $1`
            const selectQryResult = await bexioPool.query(selectQry,[partyId]);

            insertQry =`INSERT INTO 
            documents_invoice_send
              (rk_invoice,invoicenumber,fk_companyregistered,invoicetype,invoiceparams,response,status,"isNotifyed")
            VALUES
              ($1,$2,$3,$4,$5,$6,$7,false)
              RETURNING objectid`
            let result = await bexioPool.query(insertQry,[invoiceId,invoicenumber,selectQryResult.rows[0].cid,'EBILL',formData,responseBody,status]);
            console.log(result);
            
            sendInvoiceId = result.rows[0].objectid;
          }else{
            sendInvoiceId = selectQryResult.rows[0].objectid;
          let updateQry =`UPDATE 
            documents_invoice_send
              SET timestamp = NOW(),
              invoiceparams = $3,
              "isNotifyed" = false,
              "referenceId" = null,
               response = $4,
               status = $5
            WHERE fk_companyregistered = $1
              AND rk_invoice = $2
              AND invoicetype = 'EBILL'`
              console.log('updateQry',updateQry);
            await bexioPool.query(updateQry,[selectQryResult.rows[0].cid,invoiceId,formData,responseBody,status]);

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
// const pushInvoice = async (req, res) => {
//   try {
//     const formData = req.body;
//     console.log('pushInvoiceFormData',req.url);
//   } catch (error) {
//     console.log('errorPushInvoice',error);
    
//   }
 
  
// }
// const checkRecipient = async(billerId,receiptId,contactId) =>{
//   const pool = await connectEbill;
//   const bexioPool = await postgresBexio;
//   console.log('1254');
  
//  console.log(billerId);
//  console.log(receiptId);
//  console.log(contactId);

 
//   const getrecipient = `SELECT r.id,b.netcomid,r.fk_biller FROM recipient r 
//   INNER JOIN biller b ON b.id = r.fk_biller 
//   WHERE b.billerId = '${billerId}' AND r.recipientId = '${receiptId}'`
//   const getrecipientId = await pool.query(getrecipient)
//   console.log(getrecipientId.recordset);
  
//   if(getrecipientId.recordset.length){
//     console.log("receipdhbadbhdh exist");
//     const checkLinked = `SELECT * FROM recipient r 
//     INNER JOIN biller b ON b.id = r.fk_biller 
//     WHERE b.billerId = '${billerId}' AND r.recipientId = '${receiptId}' AND islinked = 1`
//     const checkLinkedExist = await pool.query(checkLinked)
//     console.log('checkLinkedExist.recordset.length',checkLinkedExist.recordset.length);
    
//     if(checkLinkedExist.recordset.length){
//       return true;
//     }
//     else{
//       const getCompany = `SELECT cid FROM  companyregistered c WHERE netcomid =$1`;
//       const getCompanydata = await bexioPool.query(getCompany, [getrecipientId.recordset[0].netcomid])
//       const getContactCheck = `SELECT cid FROM  contact_bc 
//         WHERE fk_companyregistered = $1 
//         AND rk_contact = $2 
//         AND recipientid = $3
//         AND "type" = $4`;
//         console.log('123');
        
//       let getContactCheckResult =  await bexioPool.query(getContactCheck, [getCompanydata.rows[0].cid, contactId,receiptId,'EBILL']);
//       console.log('321',getContactCheckResult.rows.length);

//       if(getContactCheckResult.rows.length == 0){
//         const addBexioQuery = `INSERT INTO  contact_bc (fk_companyregistered,rk_contact,"type",recipientid)
//         VALUES($1,$2,$3,$4)`;
//         await bexioPool.query(addBexioQuery, [getCompanydata.rows[0].cid, contactId, 'EBILL', receiptId]);
//       }
     
//       const updateRecipientQuery = `UPDATE recipient SET islinked = '1' 
//       WHERE recipientid ='${receiptId}'
//        AND fk_biller = '${getrecipientId.recordset[0].fk_biller}'`
//       await pool.query(updateRecipientQuery)
//       return true;
//     }
//   }
//   else{
//     console.log("receipdhbadbhdh not in db");

//   }
// // if recepientId in our db
//     // check isLinked or not
//     // if it's linked flow end
//     // else mergeApI function should work here (create a method)
// // else
//     // call get recepient Api 
//     // add recepient(isLinked must linked),companyregistered,contact_bc Tables
// }

// const test = async(req,res)=>{
//   const resetToken = crypto.randomBytes(15).toString('hex');
//   let billerId = 'BIID0000009397'
//   let data ={
//     items:{
//       billRecipientId:"41012270050893472"
//     }  
//   }
//   const options = {
//     method: 'POST',
//     url: config.SIX_API_CERTIFICATE_BASE + `billers/${billerId}/bill-recipients/search`,
//     headers: {
//       'x-networkpartner-id':config.NETWORK_PARTNER_ID,
//       'X-Correlation-Id': resetToken,
//       'Content-Type': 'application/json',
//     },
//     key: fs.readFileSync(config.CERTIFICATE_PATH+'io_market_com_pk_without_pass.key'),
//     cert: fs.readFileSync(config.CERTIFICATE_PATH+'star_io-market_com.crt'),
//     body:JSON.stringify(data),
//   };
//   console.log(options);
//   await request(options, async function (error, response) {
//     if (error) {
//       commonErrors['errorTitle'] = 'get recipient';
//       commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param sector,' + billerId;
//       warningMessage(commonErrors, error);
//       return res.status(500).json({
//         status_code: 500,
//         message: 'something_went_wrong',
//         status: false,
//       });
//     }
//     else{
//       // console.log(response)
//       if(response.statusCode == 200){
//       return res.status(200).json({
//         status_code: 200,
//         message: 'success',
//         data:JSON.parse(response.body),
//         status: true,
//       });
//     }
//     else{
//       var returnData = response.body
//       return res.status(500).json({
//         status_code: 500,
//         message: 'failed',
//         data:returnData.toLowerCase(),
//         status: false,
//       }); 
//     }
//     }
//   })
// }
// const test = async(req,res)=>{
//   const resetToken = crypto.randomBytes(15).toString('hex');
//   let billerId = 'BIID0000009397'
//   let data ={
//     items:[{
//       billRecipientId:"41012068341661254"
//     }]
//   }
//   const options = {
//     method: 'POST',
//     url: config.SIX_API_CERTIFICATE_BASE + `billers/${billerId}/bill-recipients/search`,
//     headers: {
//       'x-networkpartner-id':config.NETWORK_PARTNER_ID,
//       'X-Correlation-Id': resetToken,
//       'Content-Type': 'application/json',
//     },
//     key: fs.readFileSync(config.CERTIFICATE_PATH+'io_market_com_pk_without_pass.key'),
//     cert: fs.readFileSync(config.CERTIFICATE_PATH+'star_io-market_com.crt'),
//     body:JSON.stringify(data),
//   };
//   console.log(options);
//   await request(options, async function (error, response) {
//     if (error) {
//       commonErrors['errorTitle'] = 'get recipient';
//       commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param sector,' + billerId;
//       warningMessage(commonErrors, error);
//       return res.status(500).json({
//         status_code: 500,
//         message: 'something_went_wrong',
//         status: false,
//       });
//     }
//     else{
//       // console.log(response)
//       if(response.statusCode == 200){
//       return res.status(200).json({
//         status_code: 200,
//         message: 'success',
//         data:JSON.parse(response.body),
//         status: true,
//       });
//     }
//     else{
//       var returnData = response.body
//       return res.status(500).json({
//         status_code: 500,
//         message: 'failed',
//         data:returnData.toLowerCase(),
//         status: false,
//       }); 
//     }
//     }
//   })
// }
// const checkRecipient = async (billerId, receiptId, contactId) => {
//   const pool = await connectEbill;
//   const bexioPool = await postgresBexio;
//   const getrecipient = `SELECT r.id,b.netcomid,r.fk_biller FROM recipient r 
//   INNER JOIN biller b ON b.id = r.fk_biller 
//   WHERE b.billerId = '${billerId}' AND r.recipientId = '${receiptId}'`;
//   const getrecipientId = await pool.query(getrecipient);
//   const getCompany = `SELECT cid FROM  companyregistered c WHERE netcomid =$1`;
//   if (getrecipientId.recordset.length) {
//     const checkLinked = `SELECT * FROM recipient r 
//     INNER JOIN biller b ON b.id = r.fk_biller 
//     WHERE b.billerId = '${billerId}' AND r.recipientId = '${receiptId}' AND islinked = 1`;
//     const checkLinkedExist = await pool.query(checkLinked);
//     if (checkLinkedExist.recordset.length) {
//       return true;
//     }
//     else {
//       const getCompanydata = await bexioPool.query(getCompany, [getrecipientId.recordset[0].netcomid]);
//       const getContactCheck = `SELECT cid FROM  contact_bc 
//         WHERE fk_companyregistered = $1 
//         AND rk_contact = $2 
//         AND recipientid = $3
//         AND "type" = $4`;
//       let getContactCheckResult = await bexioPool.query(getContactCheck, [getCompanydata.rows[0].cid, contactId, receiptId, 'EBILL']);
//       if (getContactCheckResult.rows.length == 0) {
//         const addBexioQuery = `INSERT INTO  contact_bc (fk_companyregistered,rk_contact,"type",recipientid)
//         VALUES($1,$2,$3,$4)`;
//         await bexioPool.query(addBexioQuery, [getCompanydata.rows[0].cid, contactId, 'EBILL', receiptId]);
//       }
//       const updateRecipientQuery = `UPDATE recipient SET islinked = '1' 
//       WHERE recipientid ='${receiptId}'
//        AND fk_biller = '${getrecipientId.recordset[0].fk_biller}'`;
//       await pool.query(updateRecipientQuery);
//       return true;
//     }
//   }
//   else {
//     const getBiller = `SELECT id,netcomid FROM biller 
//       WHERE billerId = '${billerId}'`;
//     const getBillerId = await pool.query(getBiller);
//     const addReceipient = ` INSERT INTO recipient (fk_biller,recipientId,islinked) 
//      VALUES('${getBillerId.recordset[0].id}','${receiptId}','${1}')`;
//     await pool.query(addReceipient);
//     const getCompanyDetails = await bexioPool.query(getCompany, [getBillerId.recordset[0].netcomid])
//     const addBexioQuery = `INSERT INTO  contact_bc (fk_companyregistered,rk_contact,"type",recipientid)
//      VALUES($1,$2,$3,$4)`;
//     await bexioPool.query(addBexioQuery, [getCompanyDetails.rows[0].cid, contactId, 'EBILL', receiptId]);
//     return true;
//   }
// }
// changes from sarathlal
const checkRecipient = async (billerId, receiptId, contactId, accessToken) => {
  const pool = await connectEbill;
  const bexioPool = await postgresBexio;
  const sql = require('mssql');
  let transaction = new sql.Transaction(pool);
  await transaction.begin();
  bexioPool.query('begin');
  const getrecipient = `SELECT r.id,b.netcomid,r.fk_biller,r.islinked FROM recipient r 
  INNER JOIN biller b ON b.id = r.fk_biller 
  WHERE b.billerId = '${billerId}' AND r.recipientId = '${receiptId}'`;
  const getrecipientId = await pool.query(getrecipient);
  console.log("getrecipientId---",getrecipientId);
  const getCompany = `SELECT cid FROM  companyregistered c WHERE netcomid =$1`;
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
      bexioPool.query('COMMIT', err => {
        if (err) {
          console.error('Error committing transaction')
        }
      })
      return true;
    }
    else {
      const getCompanydata = await bexioPool.query(getCompany, [getrecipientId.recordset[0].netcomid]);
      const getContactCheck = `SELECT cid FROM  contact_bc 
        WHERE fk_companyregistered = $1 
        AND rk_contact = $2 
        AND recipientid = $3
        AND "type" = $4`;
      let getContactCheckResult = await bexioPool.query(getContactCheck, [getCompanydata.rows[0].cid, contactId, receiptId, 'EBILL']);
      if (getContactCheckResult.rows.length == 0) {
        const addBexioQuery = `INSERT INTO  contact_bc (fk_companyregistered,rk_contact,"type",recipientid)
        VALUES($1,$2,$3,$4)`;
        await bexioPool.query(addBexioQuery, [getCompanydata.rows[0].cid, contactId, 'EBILL', receiptId]);
      }
      const updateRecipientQuery = `UPDATE recipient SET islinked = '1' 
      WHERE recipientid ='${receiptId}'
       AND fk_biller = '${getrecipientId.recordset[0].fk_biller}'`;
      await new sql.Request(transaction).query(updateRecipientQuery)
      let bexioUpdate = await updateBexioConatct(contactId, receiptId)
      console.log("bexioUpdate from if-----", bexioUpdate);
      if (bexioUpdate) {
        await transaction.commit();
        bexioPool.query('COMMIT', err => {
          if (err) {
            console.error('Error committing transaction')
          }
        })
      }
      else {
        await transaction.rollback();
        bexioPool.query('ROLLBACK', err => {
          if (err) {
            console.error('Error rolling back client_gate2b', err)
          }
        })
      }
     
      return bexioUpdate;
    }
  }
  else {
    const getBiller = `SELECT id,netcomid FROM biller 
                       WHERE billerId = '${billerId}'`;
    const getBillerId = await pool.query(getBiller);
    console.log("--------",getBillerId.recordset, receiptId);
    const getCompanyDetails = await bexioPool.query(getCompany, [getBillerId.recordset[0].netcomid])
    console.log(getCompanyDetails.rows);
    const getContactCheck = `SELECT cid FROM  contact_bc 
    WHERE fk_companyregistered = $1 
    AND rk_contact = $2 
    AND recipientid = $3
    AND "type" = $4`;
    let getContactCheckResult = await bexioPool.query(getContactCheck, [getCompanyDetails.rows[0].cid, contactId, receiptId, 'EBILL']);
    if (getContactCheckResult.rows.length == 0) {
    const addBexioQuery = `INSERT INTO  contact_bc (fk_companyregistered,rk_contact,"type",recipientid)
                          VALUES($1,$2,$3,$4)`;
    await bexioPool.query(addBexioQuery, [getCompanyDetails.rows[0].cid, contactId, 'EBILL', receiptId]);
    }
    let bexioUpdate = await updateBexioConatct(contactId, receiptId)
    console.log("bexioUpdate from else-----", bexioUpdate);

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
      bexioPool.query('COMMIT', err => {
        if (err) {
          console.error('Error committing transaction')
        }
      })
    }
    else {
      await transaction.rollback();
      bexioPool.query('ROLLBACK', err => {
        if (err) {
          console.error('Error rolling back client_gate2b', err)
        }
      })
    }
   
    return bexioUpdate;
  }
}

const getAutherizationStatus = async(req,res)=>{
  const pool = await connectPostgres;
  let formData = req.body;
  try {
  
    console.log('formData',formData);
    
    let result = false;
    const bexioPool = await postgresBexio;
    const isAuthorizedQry = `SELECT "isAuthorized" FROM companyregistered 
      WHERE rk_party = $1 AND "isAuthorized"  = true`

    let isAuthorizedResult = await bexioPool.query(isAuthorizedQry,[formData.partyId])
    console.log('isAuthorizedResult',isAuthorizedResult.rows);

    if(isAuthorizedResult.rows.length == 0){
      result = false;
    }else{
      result = true;

    }
    return res.status(200).json({
      status_code: 200,
      message: 'success',
      data:result,
      status: true,
    });
  } catch (error) {
      logs.action = 'GET_AUTHORISATION_STATUS';
      logs.level = 'ERROR';
      logs.item = 'EDI';
      //addlogs(logs,formData.rolePartyId,formData.roleAccId);
    console.log(error);
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString();
    warningMessage(commonErrors,error);
    return res.status(500).json({
      status_code: 500,
      message: 'failed',
      status: false,
    });
  }
}


const setAutherizationStatus = async(req,res)=>{
  let formData = req.body;
  const pool = await connectPostgres;
  try {
  
    let result = false;
    console.log('formData',formData.accountId);
    console.log('formData',formData.partyId);
    
    const bexioPool = await postgresBexio;
    const isAuthorizedQry = `UPDATE companyregistered SET "isAuthorized" = true,"authorizedBy" = $1 
    WHERE rk_party = $2`

    let isAuthorizedResult = await bexioPool.query(isAuthorizedQry,[formData.accountId,formData.partyId])
    // if(isAuthorizedResult.rows.length == 0){
    //   result = true;
    // }else{
    //   result = false;

    // }
    return res.status(200).json({
      status_code: 200,
      message: 'success',
      // data:result,
      status: true,
    });
  } catch (error) {

      logs.action = 'SET_AUTHERIZATION_STATUS';
      logs.level = 'ERROR';
      logs.item = 'EBILL';
      // addlogs(logs,formData.rolePartyId,formData.roleAccId);
    console.log('error',error);
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString();
    warningMessage(commonErrors,error);
    return res.status(500).json({
      status_code: 500,
      message: 'failed',
      status: false,
    });
  }
}
async function setEbillRole(partyId,  accountId, partyAccount, roleValue,module) {
  const pool = await connectPostgres;
  console.log('partyId',partyId);
  console.log('accountId',accountId);
  console.log('partyAccount',partyAccount);
  pool.query("begin");

  let userRoles,partyApplicationId;

  return new Promise(async function (resolve, reject) {
  // if(checkRoleData.rows.length == 0)
    // {
      try {
        
   
      if(!roleValue)
      {
        // userRoles = config.BEXIO_ADMIN_ROLE;
        // console.log('userRoles',userRoles);
        userRoles = "'EBILL_ADMIN'";

      }else{
        // userRoles = config.BEXIO_USER_ROLE;
        // console.log('userRoles',userRoles);
        userRoles ="'EBILL_USER'";
      }
      console.log('userRoles',userRoles);
    // WHERE name IN (${config.SUPERADMIN})`;

    let getRoleQry = `SELECT r.name,rav.fk_application_version,r.cid AS roleId FROM public.role_policy rp
    INNER JOIN public.role r ON r.cid = rp.fk_role
    INNER JOIN public.policy p ON p.cid = rp.fk_policy
    INNER JOIN role_application_version rav ON rav.fk_role = r.cid
    WHERE r.name IN (${userRoles})
    AND r.fk_party IS NULL`
    
    const roleData = await pool.query(getRoleQry);
    console.log('userRoles',userRoles);

    console.log('roleData',getRoleQry);

    console.log('roleData',roleData.rows);

    const partyApplicationDetails = ` SELECT cid 
      FROM 
          partyapplication  p 
      WHERE 
          fk_party = $1 
      AND fk_application_version = $2 `;
    let getpartyApplicationDetails = await pool.query(partyApplicationDetails,[partyId,roleData.rows[0].fk_application_version])
      if(getpartyApplicationDetails.rows.length == 0){
        const insertPartyApplication = `INSERT INTO
        partyapplication
        (fk_party,fk_application_version) 
        VALUES($1,$2) RETURNING cid `;
       let getPartyApplicationResult = await pool.query(insertPartyApplication,[partyId,roleData.rows[0].fk_application_version])
       console.log('getPartyApplicationStatus',getPartyApplicationResult.rows);
       partyApplicationId = getPartyApplicationResult.rows[0].cid;

      }else{
        partyApplicationId = getpartyApplicationDetails.rows[0].cid;

      }
  

    const insertPartyApplicationAccount = `INSERT INTO 
      partyapplication_account
      (fk_partyapplication,fk_account,fk_party_account) 
      VALUES($1,$2,$3) RETURNING cid `;
    
       let insertPartyApplicationAccountResult = await pool.query(insertPartyApplicationAccount,[partyApplicationId,accountId,partyAccount])
       console.log('insertPartyApplicationAccountResult',insertPartyApplicationAccountResult.rows);

    const insertPartyApplicationAccountRole = `INSERT INTO 
      partyapplication_account_role
      (fk_partyapplication_account,fk_role) 
      VALUES($1,$2) RETURNING cid`;
    
     let insertPartyApplicationAccountRoleResult = await pool.query(insertPartyApplicationAccountRole,[insertPartyApplicationAccountResult.rows[0].cid,roleData.rows[0].roleid])
     console.log('insertPartyApplicationAccountRoleResult',insertPartyApplicationAccountRoleResult.rows);
     console.log('commit');
  
    pool.query("commit");

  // }
    resolve(1)
      

  } catch (error) {
    console.log('errorerrorerror',error);
    pool.query("rollback");
    
    resolve(1)
        
  }
  });

};
const tourList = async(req,res) =>{
  let data = req.body;
  let formData = null,language,tourType,fk_application_version,partyId,accId,tourData;
  const pool = await connectPostgres;
  try {
      formData = encryptionControl.decrypt(req.body.encrToken);     
      const mtcCookie = req.cookies[config.EXPIRE_MTC_COOKIE_NAME] ? JSON.parse(encryptionControl.decryptCookie(req.cookies[config.EXPIRE_MTC_COOKIE_NAME])): '';
      const validation = async (req) => {
          if (formData.language&&formData.partyId&&formData.accId) {
              return true;
          }else{
              return false;
          }
      };
      const isValid = await validation(formData);
      if( isValid){
          language = formData.language
          tourType = formData.type;
          fk_application_version = formData.fk_application_version;
          partyId = formData.partyId;
          accId = formData.accId;
     
          let getUserRolesQry;
         
          let roles = [];
          /* if( mtcCookie ){
            let getSuperRoleDetils = `SELECT DISTINCT r."name" as rolename,par.fk_role as roleid, rav.fk_application_version FROM 
            partyapplication_account_role par
            INNER JOIN partyapplication_account ON par.fk_partyapplication_account = partyapplication_account.cid
            INNER JOIN party_account pa ON partyapplication_account.fk_party_account = pa.cid
            INNER JOIN status s ON s.cid = pa.fk_status
            INNER JOIN "role" r ON r.cid = par.fk_role
            INNER JOIN role_application_version rav ON rav.fk_role = r.cid
            WHERE  r."name" IN (${config.TOUR_SUPERADMIN})
            order by roleid desc`;
            getUserRolesQry = await pool.query(getSuperRoleDetils);
          }
          else{ */
            const getUserRoles =  ` SELECT r."name" as rolename,par.fk_role as roleid, rav.fk_application_version FROM 
            partyapplication_account_role par
            INNER JOIN partyapplication_account ON par.fk_partyapplication_account = partyapplication_account.cid
            INNER JOIN party_account pa ON partyapplication_account.fk_party_account = pa.cid
            INNER JOIN status s ON s.cid = pa.fk_status
            INNER JOIN "role" r ON r.cid = par.fk_role
            INNER JOIN role_application_version rav ON rav.fk_role = r.cid
            WHERE pa.fk_party = $1 AND pa.fk_account= $2
            order by roleid desc`;
            getUserRolesQry = await pool.query(getUserRoles,[partyId,accId]);
            
            
          /* }  */        
          let result: string[] = [];
          let seen: Set<string> = new Set();            
          if( getUserRolesQry.rows.length > 0 ){
            let userRoles = getUserRolesQry.rows;               
            for (const element of userRoles) {
              let rolename =  element.rolename;
              const lastIndex = element.rolename.lastIndexOf('_');
              const newArray = [rolename.substring(0, lastIndex), rolename.substring(lastIndex + 1)];
              let subString = newArray[0];
              if (!seen.has(subString) || ( newArray[1] != 'USER' || newArray[1] != 'ADMIN')) {
                  let i = getUserRolesQry.rows.indexOf(element);
                  seen.add(subString);
                  result.push(element);
                  roles.push(element.roleid);
              }
              else{
                  if(newArray[1] == 'ADMIN'){
                    let dupl:any = result.filter( a => a['fk_application_version'] == element.fk_application_version);
                    let a = dupl.filter( dup => (seen.has(dup.rolename.substring(0,dup.rolename.lastIndexOf('_'))) && dup.rolename.substring(dup.rolename.lastIndexOf('_')+1)) == 'USER');
                    a.length > 0 ? roles =  roles.filter(item => item !== a[0]['roleid']) : '';
                    result.push(element);
                    roles.push(element.roleid);
                  }
              }
            }
          }          
          let steps = [];
          const stepData = {};
          let data = {};
          tourData = {}
          if( roles.length >  0 ){
            const getTourListData = `SELECT DISTINCT * FROM(
              SELECT a.code AS appmodule
                  ,tr.cid as tutorial_role_id
                  , t.cid
                  , tr.order
                  , tr.fk_role
                  , t.type
                  , t.label
                  , ts.title
                  , ts.description
                  , t.path
                  , t."defaultShow"
              FROM partyapplication_account_role par 
              INNER JOIN partyapplication_account ON par.fk_partyapplication_account = partyapplication_account.cid 
              INNER JOIN party_account pa ON partyapplication_account.fk_party_account = pa.cid 
              INNER JOIN status s ON s.cid = pa.fk_status 
              INNER JOIN "role" r ON r.cid = par.fk_role 
              INNER JOIN tutorial_role tr ON tr.fk_role = r.cid 
              INNER JOIN tutorial t ON t.cid = tr.fk_tutorial 
              INNER JOIN appservice_version av ON av.cid = t.fk_appservice_version 
              INNER JOIN appservice a ON a.cid = av.fk_appservice 
              INNER JOIN tutorial_spr ts ON ts.fk_tutorial = t.cid 
              INNER JOIN spr sp ON sp.cid = ts.fk_spr 
              WHERE t.type = $1
              AND pa.fk_account = ${accId}
              AND pa.fk_party = ${partyId}
              AND t.fk_application_version = $2
              AND t.active = true 
              AND sp.code = $3
              AND tr.fk_role IN (${roles})
              ORDER BY tr.fk_role ASC
            ) AS tmpQry
            ORDER BY tmpQry."order" ASC`;
            
            
            const getTourListQuery = await pool.query(getTourListData,[tourType,fk_application_version,language]);
            for (let index = 0; index < getTourListQuery.rows.length; index++) {
                const element = getTourListQuery.rows[index];
                steps.push(element.path);
                stepData[element.label] = element;
                
            }          
            Object.keys(stepData).forEach((el) => {
                tourData[stepData[el].appmodule] = {
                  stepData: {},
                  steps: [],
                };
            });
            Object.keys(stepData).forEach((el) => {
                let tourModule = stepData[el].appmodule;
                var obj = {};
                obj[el] = stepData[el];
                Object.assign(tourData[tourModule]['stepData'],obj);
                tourData[tourModule]['steps'].push(
                  stepData[el].path
                );
            });
          }
          
          // console.log(tourData);
          
          data['steps'] = steps;
          data['tourData'] = tourData;          
          return res.status(200).json({ 
              data : data,
              message: 'success',
              status: true
          })
      }
      else{
          return res.status(500)
              .json({ statusCode: 500, message: 'empty_or_null_accountid', status: false });
      }
  } catch (error) {
    
      logs.action = 'TOUR_LIST';
      logs.level = 'ERROR';
      logs.item = 'EBILL';
      // addlogs(logs,data.rolePartyId,data.roleAccId);
      console.log("tourList ",error);
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
const updateTour = async(req,res) => {
  let formData = null;
  formData = req.body.encrToken ? encryptionControl.decrypt(req.body.encrToken): "";
  const pool = await connectPostgres;
  const data = req.body;
  try {
      const validation = async (req) => {
          if (formData.language && formData.id && formData.title && formData.description ) {
              return true;
          }else{
              return false;
          }
      };
      const isValid = await validation(formData);
      if( isValid){
          let language = formData.language;
          let tourid = formData.id;
          let tourTitle = formData.title;
          let tourDescription = formData.description;
          let type = formData.type;                
          const pool = await connectPostgres;
          const selectTourQ = ` SELECT ts.cid,ts.fk_tutorial,t.type,t.label,ts.title,ts.description
                              FROM tutorial t 
                              INNER JOIN  tutorial_spr ts ON ts.fk_tutorial = t.cid
                              INNER JOIN spr s ON s.cid =  ts.fk_spr
                              WHERE s.code = $1
                              AND t.type = $2
                              AND t.cid = $3
                              ORDER BY t.order asc`;
          const getSelectTour = await pool.query(selectTourQ,[language,type,tourid]);            
          const updateQuery = `   UPDATE tutorial_spr ts
                                  SET title = $1 ,description = $2, createddate = now()
                                  FROM tutorial AS t, spr AS s 
                                  WHERE s.cid = ts.fk_spr 
                                  AND t.cid = ts.fk_tutorial
                                  AND ts.fk_tutorial = $3
                                  AND t.type = $4
                                  AND s.code = $5`;
          if(getSelectTour.rows.length > 0){
              const updateQResult = await pool.query(updateQuery,[tourTitle,tourDescription,tourid,type,language]);
          }
          logs.action = 'bexio.tourList.update';
          logs.level = 'NOTIFICATION';
          logs.item = 'EDI';
          addlogs(logs,data.rolePartyId,data.roleAccId);
          return res.status(200).json({
              status_code: 200,
              message: 'common_success',
              status: true
          })
      }
      else{
        logs.action = 'bexio.tourList.update';
        logs.level = 'ERROR';
        logs.item = 'EDI';
        addlogs(logs,formData.rolePartyId,formData.roleAccId);
          return res
          .status(500)
          .json({ statusCode: 500, message: 'empty_or_null_accountid', status: false });

      }            
  } catch (error) {

      logs.action = 'bexio.tourList.update';
      logs.level = 'ERROR';
      logs.item = 'EDI';
      addlogs(logs,formData.rolePartyId,formData.roleAccId);
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

const updateTutorialStatus = async(req,res) => {
  let formData = null
  formData = req.body.encrToken ? encryptionControl.decrypt(req.body.encrToken): "";
  const pool = await connectPostgres;
  const data = req.body;
  try {
      
      console.log(formData);
      
      const validation = async (req) => {
          if (formData.roleAccId && formData.rolePartyId) {
              return true;
          }else{
              return false;
          }
      };
      const accId = formData.roleAccId ;
      const isValid = await validation(formData);
      if( isValid){
          const pool = await connectPostgres;
          const updateQuery = `UPDATE public.user u
                              SET hidetutorial = true
                              FROM account a 
                              WHERE  a.fk_user = u.cid 
                              AND a.cid =$1`;
          const updateQueryResult = pool.query(updateQuery,[accId]);
          logs.action = 'UPDATE_TUTORIAL_STATUS';
          logs.level = 'NOTIFICATION';
          logs.item = 'EDI';
          // addlogs(logs,data.rolePartyId,data.roleAccId);
          return res.status(200).json({
              status_code: 200,
              message: 'success',
              status: true,
          });
      }else{
          logs.action = 'UPDATE_TUTORIAL_STATUS';
          logs.level = 'ERROR';
          logs.item = 'EDI';
          // addlogs(logs,formData.rolePartyId,formData.roleAccId);
          return res
          .status(500)
          .json({ statusCode: 500, message: 'empty_or_null_accountid', status: false });

      }
      
      
  } catch (error) {
   
      logs.action = 'UPDATE_TUTORIAL_STATUS';
      logs.level = 'ERROR';
      logs.item = 'EDI';
      // addlogs(logs,formData.rolePartyId,formData.roleAccId);
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
const contactListCountSearch = async (token,search,offset,limit?)=>{
  return new Promise(async(resolve, reject) => {
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
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+token;
        warningMessage(commonErrors,error);
        resolve(false)
      }
      if(response.statusCode == 200){
        if(JSON.parse(response.body).length == limit){
         let temp = contactListCountSearch(token,offset+2000,2000)
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
    console.log({
      offset: offset,
      limit: limit
    });
    
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
// const isEbilldisable = async(req,res) => {
//   return res.status(200).json({
//     message: 'ebill_disable_status',
//     data:config.IS_EBILL_DISABLED,
//     status: true
// });
// }
const partyServiceUpdate = async (partyResponse,service,app) => {
  return new Promise(async (resolve, reject) => {
      const pool = await connectPostgres;
      try {
          pool.query('begin');
          const serviceName = service;
          const partyId = partyResponse;
          const appName = app;
          const checkExisted = `SELECT paa.cid,aps.cid as appserviceid,a.cid as appid FROM party_applicationversion_appservice paa 
          INNER JOIN applicationversion_appservice aa ON aa.cid = paa.fk_applicationversion_appservice 
          INNER JOIN appservice aps ON aps.cid = aa.fk_appservice 
          INNER JOIN application_version av ON av.cid = aa.fk_application_version
          INNER JOIN application a ON a.cid = av.fk_application  
          WHERE paa.fk_party = $1 AND aps.code = $2 AND a.code = $3`
          const getExisted = await pool.query(checkExisted, [partyId, serviceName, appName])
          if (getExisted.rows.length) {
              pool.query('ROLLBACK', err => {
                  if (err) {
                      console.error('Error rollback transaction')
                  }
              })
              return reject(false)
          }
          console.log('service',service);
          console.log('app',app);

          
          const getAppService = `SELECT aa.cid  FROM applicationversion_appservice aa 
          INNER JOIN appservice aps ON aps.cid = aa.fk_appservice
          INNER JOIN application_version av ON av.cid = aa.fk_application_version  
          INNER JOIN application a ON a.cid = av.fk_application 
          WHERE aps.code = $1 AND a.code = $2`
          const getAppServiceId = await pool.query(getAppService, [serviceName, appName]);
          const queryPartyAppService = `INSERT INTO party_applicationversion_appservice (fk_party,fk_applicationversion_appservice) VALUES ($1,$2)`
          await pool.query(queryPartyAppService, [partyId, getAppServiceId.rows[0].cid]);
          pool.query('COMMIT', err => {
              if (err) {
                  console.error('Error committing transaction')
              }
          })
          return resolve(true)
      }
      catch (error) {
          pool.query('ROLLBACK', err => {
              if (err) {
                  console.error('Error rollback transaction')
              }
          })
          let responseValue = JSON.stringify(partyResponse)
          commonErrors['errorTitle'] = 'partyServiceUpdate';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + responseValue;
          warningMessage(commonErrors, error);
          return reject(false)
      }
  })
}
// const changeInvoiceSendStatus = async(req,res) => {
//   let formData = null
//   try {
//       formData = req.body;
//       const referenceId = formData.referenceId ;
//       let status;
//       let returnStruct = [];
//       formData.status == 'success' ? status = 2 : '';
//       formData.status == 'error' ? status = 0 : '';
      
//           const pool = await connectPostgres;
//           const bexioPool = await postgresBexio;
          
//           const getRefDataQuery = `SELECT cr.rk_party,dis.objectid
//             FROM public.companyregistered cr
//             INNER JOIN documents_invoice_send dis ON dis.fk_companyregistered = cr.cid
//             WHERE dis.referenceid = $1`;
//           const refDataQueryResult = await bexioPool.query(getRefDataQuery,[referenceId]);
//           console.log("refDataQueryResult.rows",refDataQueryResult.rows);
//           if(refDataQueryResult.rows.length>0){
//             const updateQuery = `UPDATE documents_invoice_send
//                                 SET status = $1
//                                 WHERE referenceid =$2`;
//             const updateQueryResult = await bexioPool.query(updateQuery,[status,referenceId]);
//             const qryGetPartyApplication = `SELECT * FROM public.partyapplication pa 
//               INNER JOIN application_version av ON pa.fk_application_version = av.cid
//               INNER JOIN application a ON a.cid = av.fk_application
//               WHERE fk_party = $1 AND a.code = $2`
            
//             const resultGetPartyApplication = await pool.query(qryGetPartyApplication,[refDataQueryResult.rows[0].rk_party,'BEXIO']);
//             const partyApplicationId = resultGetPartyApplication.rows[0].objectid;

//             returnStruct = [{"partyApplicationId":partyApplicationId,"objectId":refDataQueryResult.rows[0].objectid,"application":'BEXIO'}]
//           }
//           return res.status(200).json({
//               data: returnStruct,
//               status_code: 200,
//               message: 'success',
//               status: true,
//           });
      
      
      
//   } catch (error) {
//       console.log(error);
//       let responseValue = JSON.stringify(formData)
//       commonErrors['errorTitle'] = req.originalUrl;
//       commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+responseValue;
//       warningMessage(commonErrors,error);
//       return res.status(500).json({
//           message: 'something_went_wrong',
//           status: false
//       });
//   }
// }
const notifyEbillMail = async(req,res) => {
  let formData =  encryptionControl.decrypt(req.body.encrToken);
  const pool = await connectPostgres;
  try {
    console.log(formData);
    let subject = 'bexio - old Biller update';
    let message =`Hello
      The following customer data already has a biller in Six. Please contact SIX to migrate this biller to io-market.
      Legal Name: `+ formData.legalName +` 
      Biller ID: `+ formData.billerId +` 
      Phone: `+ formData.phone +` 
      E-Mail: `+ formData.email +` 
      NetcomId: `+ formData.netcomId +` 
      Kind regards
      Marketplace`

      console.log(message);
      
    //   await sendEmail({
    //     // email: config.DEBUG ? config.DEBUG_MAIL : config.SALES_TEAM_CONTACT,
    //     email: config.DEBUG ? 'r.murali@iomarket.in' : 'r.murali@iomarket.in',
        
    //     subject: subject,
    //     message,
    // });
    let data = {
      errorTitle:"bexio - old Biller update",
      errorDescription:message,
      serverName:config.SERVER_NAME,
      systemName:config.SYSTEM_NAME,
      errorCategory:config.NOT_CATEGORY,
      errorCode:config.NOT_CODE,
      errorSource:config.ERROR_SOURCE,
      dockerName:config.DOCKER_NAME,
      senderCompany:'',
      receiverCompany:'',
      contactEmail:'',
      errorFile:''
  }
  console.log('data',data);
  
    warningMessage(data,null);
    logs.action = 'NOTIFY_EBILL_MAIL';
    logs.level = 'NOTIFICATION';
    logs.item = 'EBILL';
    // addlogs(logs,formData.rolePartyId,formData.roleAccId);
    return res.status(200).json({
        status_code: 200,
        message: 'success',
        status: true,
    });

  } catch (error) {
    logs.action = 'NOTIFY_EBILL_MAIL';
    logs.level = 'ERROR';
    logs.item = 'EBILL';
    // addlogs(logs,formData.rolePartyId,formData.roleAccId);
    console.log('error',error);
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'NOTIFY_EBILL_MAIL -req param,',JSON.stringify(req.body);
    warningMessage(commonErrors,'NOTIFY_EBILL_MAIL');
    return res.status(200).json({
      status_code: 500,
      message: 'something_went_wrong',
      status: false,
    });
  }
  }

const infoList = async(req,res) => {
  let formData = null,language,tourType,fk_application_version;
  formData = req.body.encrToken ? encryptionControl.decrypt(req.body.encrToken):req.body;
  const pool = await connectPostgres;
  const data = req.body;
  try {
      const validation = async (req) => {
          if (formData.language) {
              return true;
          }else{
              return false;
          }
      };
      const isValid = await validation(formData);
      if( isValid){
          language = formData.language
          tourType = formData.type;
          fk_application_version = formData.fk_application_version;
         
          const getinfoListData = `   SELECT appModule,t.cid,t.order,t.type,t.label,ts.title,ts.description,t.path,t."defaultShow"
                                  FROM tutorial t 
                                  INNER JOIN  tutorial_spr ts ON ts.fk_tutorial = t.cid
                                  INNER JOIN spr s ON s.cid =  ts.fk_spr
                                  WHERE s.code = $1
                                  AND t.type = $2
                                  AND t.fk_application_version = $3
                                  AND t.active = true
                                  ORDER BY t.order asc`;
          const getinfoListQuery = await pool.query(getinfoListData,[language,tourType,fk_application_version]);
          let steps = [];
          const stepData = {};
          let data = {};
          for (let index = 0; index < getinfoListQuery.rows.length; index++) {
              const element = getinfoListQuery.rows[index];
              steps.push(element.path);
              stepData[element.label] = element;
              
          }
          data['steps'] = steps;
          data['stepData'] = stepData;
          return res.status(200).json({
              data : data,
              message: 'success',
              status: true
          })
      }
      else{
          return res.status(200)
              .json({ statusCode: 500, message: 'empty_or_null_accountid', status: false });
      }
  } catch (error) {
          
      logs.action = 'INFO_LIST';
      logs.level = 'ERROR';
      logs.item = 'EDI';
      // addlogs(logs,formData.rolePartyId,formData.roleAccId);
      console.log(error);
      let responseValue = JSON.stringify(formData)
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+responseValue;
      warningMessage(commonErrors,error);
      return res.status(200).json({
          message: 'something_went_wrong',
          status: false
      });
  } 
}

const changeInvoiceSendStatus = async(req,res) => {
  let formData = null
  let invoiceCid:any;
  const pool = await connectPostgres;
  formData = req.body;
  try {
      const referenceId = formData.referenceId ;
      let status;
      let returnStruct = [];
      // formData.status == 'SUCE' ? status = 2 : '';
      // formData.status == 'error' ? status = 0 : '';
      let invoiceStatus;
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
      const bexioPool = await postgresBexio;
      const getRefDataQuery = `SELECT *,invoiceparams::json->'bank_id' as bankid
        FROM public.companyregistered cr
        INNER JOIN documents_invoice_send dis ON dis.fk_companyregistered = cr.cid
        WHERE dis."referenceId" = $1`;
      const refDataQueryResult = await bexioPool.query(getRefDataQuery,[referenceId]);
      console.log("refDataQueryResult.rows",refDataQueryResult.rows);
      if(refDataQueryResult.rows.length>0){
        const updateQuery = `UPDATE documents_invoice_send
                            SET status = $1,
                            "isNotifyed" = true
                            WHERE "referenceId" =$2
                            RETURNING rk_invoice`;
                            console.log('111');
                            
        const updateQueryResult = await bexioPool.query(updateQuery,[status,referenceId]);
        console.log('222');

        // const qryGetPartyApplication = `SELECT * FROM public.partyapplication pa 
        //   INNER JOIN application_version av ON pa.fk_application_version = av.cid
        //   INNER JOIN application a ON a.cid = av.fk_application
        //   WHERE fk_party = $1 AND a.code = $2`

          const qryGetPartyApplication = ` SELECT pa.cid,lp.companyname,a.code AS app,av.version AS appversion
          FROM partyapplication pa 
            INNER JOIN application_version av ON av.cid = pa.fk_application_version  
            INNER JOIN application a ON a.cid = av.fk_application
            INNER JOIN legalparty lp ON lp.fk_party = pa.fk_party
          WHERE pa.fk_party = ${refDataQueryResult.rows[0].rk_party} AND a.code = 'BEXIO'`

        const resultGetPartyApplication = await pool.query(qryGetPartyApplication);
        const partyApplicationId = resultGetPartyApplication.rows[0].objectid;
        console.log('12333');
        
        let invoiceCid:any;
        // invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
        // let objectId = refDataQueryResult.rows.objectid;
        // await notifiBexio(refDataQueryResult.rows[0].refreshtoken,updateQueryResult.rows[0].rk_invoice,formData.status.trim(),formData.message,formData.amount);
        await notifiBexio(refDataQueryResult.rows[0].refreshtoken,updateQueryResult.rows[0].rk_invoice,formData.status.trim(),formData.message,refDataQueryResult.rows[0].netcomid,formData.amount,refDataQueryResult.rows[0].bankid);
        let objectId = crypto.randomBytes(15).toString('hex');
        logs.action = 'PUSHINVOICE';
        logs.objectid = objectId;
        logs.rk_party_application_version = '';
        logs.rk_objectid = invoiceCid;
        logs.level = formData.status.toUpperCase();
        logs.item = 'EBILL';
        logs.companyName = '';
        logs.user.name = '';
        logs.user.email = '';
        logs.application.name = '';
        logs.application.version = '';
        logs.timestamp = new Date().toString();
        logs['rk_object'] = invoiceCid;
        //addlogs(logs);
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
    // logs.action = 'CHANGE_INVOICE_SEND_STATUS';
    // logs.level = 'ERROR';
    // logs.item = 'EBILL';
    ////addlogs(logs,formData.rolePartyId,formData.roleAccId);
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
const deleteRedis = async (api,key) => {
  const checkAPI = JSON.parse(fs.readFileSync('./assets/iom_E76FAD2A-41E9-E211-84C9-D8D385E0B238.json'));
  let delApis = checkAPI.realated[api];
  console.log('delApis',delApis);
  console.log('data',key);

  const redis_client = await redisClient;
  
  try {
    delApis.split(",").forEach(element => {   
      console.log(key + element +'*');
      redis_client.KEYS(key + element +'*', (err, data) => {
        data.forEach(apis => {
          redis_client.del(apis)
        });
      })
    });

  //   redis_client.KEYS(key, (err, data) => {
  //     console.log('data',data);
  //     delApis.split(",").forEach(element => {   
  //       console.log('element',element);
  //       // redis_client.del(apis)
  //     }); 
  //     // data.forEach(apis => {
  //     //   redis_client.del(apis)
  //     // });
      
  // })
 }
  catch (error) {
    console.log(error);
    
  }
}
const updateStatus = async (req,res) => {  
  console.log('44444444444444444444444444444444');
  const pool = await connectPostgres;
 let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
 let access_token = cookie.access_Token;  
  try {
    var options = {
      'method': 'GET',
      'url': 'https://api.bexio.com/3.0/permissions',
      'headers': {
        'Accept': 'application/json',
        'Authorization': 'Bearer '+ access_token
      }
    };
  
    // request(options, function (error, response) {
    //     console.log('response',response.body);
        
    // })
    console.log();
    
    return new Promise(async(resolve, reject) => {
      var options = {
        'method': 'GET',
        'url': `https://api.bexio.com/2.0/kb_delivery`,
        'headers': {
          'Accept': 'application/json',
          "Content-Type": "application/json",
          'Authorization': 'Bearer '+access_token
        },

      };
      request(options, function (error, response) {
        if (error) {  
          console.log('errorerrorerror',error);
          
          // commonErrors['errorTitle'] = 'getContactDetails';
          // commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+id;
          // warningMessage(commonErrors,error);
          resolve(false)
        }
        // res.send(response.body)
        console.log('5252525252',response.body);
        if(response.statusCode==200)
          resolve(JSON.parse(response.body));
        else
          resolve(false)

      });
    });
  

  } catch (error) {
   
    console.log(error);
   
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,';
    warningMessage(commonErrors,error);
    return res.status(500).json({
        message: 'something_went_wrong',
        status: false
    });
  }
 
}
const getTaxListActive = async (access_token) => {

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
const switchCompany = async (req, res) => {
  console.log('11111111111111');
  const data = req.body;
  let bexioPool = await postgresBexio;
  const pool = await connectPostgres;
  const gate2b = await connectGate2b;
  const redis_client = await redisClient;
  let cookie = null,tokenSet;
  try {
    console.log('111111111111');
      cookie = JSON.parse(encryptionControl.decryptCookie(req.signedCookies[config.TOKEN_COOKIE_NAME]));
      console.log('old',cookie);
      // console.log('new',data);
      let token = cookie;
      // let partyId = data.partyId;
      console.log('data',data);
      console.log('cookie',cookie);
      let partyId = data.partyId;
      let accountId = data.accountId;
      // let getSuperRoleDetils = `SELECT array_agg(CID) AS roles
      // FROM role 
      // WHERE name IN (${config.SUPERADMINBEXIO})`;
      // const superRoleresult = await pool.query(getSuperRoleDetils);
      let a = await getUserPermissions(partyId,accountId);
      // await addSystemuser(partyId,accountId,superRoleresult.rows[0].roles);
      const redisKey = 'permissions_'+partyId+'_'+accountId;
      let permissions = ''
      console.log('redisKeyGet',redisKey);
      await redis_client.get(redisKey, async (err,data) => {
          permissions = data ? data : ' ';
          // if(permissions.search("superadmin.info.edit") != -1){
            // let accountId = 50;
            const getRefreshToken = `SELECT * FROM  companyregistered 
                WHERE rk_party = $1`
            let refresTokenResult = await bexioPool.query(getRefreshToken, [partyId]);
            const getPartyAccoutDetailsQry = `SELECT * FROM party_account pa
               INNER JOIN status s ON s.cid = pa.fk_status
                WHERE fk_party = $1 
                 AND fk_account = $2
                 AND "statusLabel" = 'active'`
            let getPartyAccoutDetailsResult = await pool.query(getPartyAccoutDetailsQry, [partyId,accountId]);
            console.log('refresTokenResult',refresTokenResult.rows);
            if(getPartyAccoutDetailsResult.rows.length > 0)
            {
            if(refresTokenResult.rows.length != 0){
              const expireCookie = JSON.parse(encryptionControl.decryptCookie(req.cookies[config.EXPIRE_EXPIRES_COOKIE_NAME]));
              console.log('olddatetimeToken',expireCookie);
              let datetimeToken = expireCookie;
              datetimeToken['cookieCreatedTime'] = new Date(new Date(new Date().getTime() + 15 * 60000).toUTCString());
              console.log('refresTokenResult.rows[0].refreshtoken',refresTokenResult.rows[0].refreshtoken);
                if(refresTokenResult.rows[0].refreshtoken){
                    console.log('1233654');
                    try {
                     tokenSet = await bexioClient.refresh(refresTokenResult.rows[0].refreshtoken);
                    } catch (error) {
                      console.log('error',error);
                      return res.status(200).json({
                        status_code: 500,
                        message: 'token_missing',
                        status: false,
                    });
                      commonErrors['errorTitle'] = req.originalUrl;
                      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param'+JSON.stringify(cookie)+' '+JSON.stringify(req.body);
                      warningMessage(commonErrors,error);
                      return res.status(200).json({
                          status_code: 500,
                          message: 'something_went_wrong',
                          status: false,
                      });
                    }

                    let bexioTokenCookie = { 
                        access_Token:tokenSet.access_token,
                        refresh_Token:tokenSet.refresh_token,
                        isBexioUser:true
                    
                    }
                    const updateRefreshToken = `UPDATE companyregistered SET refreshtoken = $1
                    WHERE rk_party = $2`
                    let updateRefreshTokenResult = await bexioPool.query(updateRefreshToken, [tokenSet.refresh_token,partyId]);

                    res.cookie(config.TOKEN_COOKIE_BEXIO_NAME, encryptionControl.encrypt(JSON.stringify(bexioTokenCookie)), {
                        domain: config.SESSION_DOMAIN,
                        maxAge: config.SESSION_EXPIRY,
                        httpOnly: false,
                        signed: true,
                        secure: false
                    });
                    let getEdiPartyUID = `SELECT fk_party, rk_uid
                    FROM "_party_gate2b"
                    WHERE fk_party = $1`
                    let ediPartyUID = await pool.query(getEdiPartyUID,[partyId]);
                    if(ediPartyUID.rows.length){
                    let getEdipartyNetcomID = `SELECT  netcomid
                                    FROM ediparty
                                    WHERE objectid = $1`
                    let edipartyNetcomID = await gate2b.query(getEdipartyNetcomID,[ediPartyUID.rows[0].rk_uid]);
                    if(edipartyNetcomID.rows.length){
                        token['netcomId']  = edipartyNetcomID.rows[0].netcomid;                           
                        token['partyID']  = partyId ;  
                        datetimeToken['partyID'] = partyId;
                        datetimeToken['cookieCreatedTime'] = new Date(new Date(new Date().getTime() + 15 * 60000).toUTCString());  
                        datetimeToken['netcomId'] = edipartyNetcomID.rows[0].netcomid;
                        datetimeToken['isBexioCompany'] = true;
                        }
                    }
            

                    console.log('newdatetimeToken',datetimeToken);

                    res.cookie(
                        config.EXPIRE_EXPIRES_COOKIE_NAME,
                        encryptionControl.encrypt(JSON.stringify(datetimeToken)),
                        {
                            domain: config.SESSION_DOMAIN,
                            maxAge: config.SESSION_EXPIRY,
                            secure: false,
                            httpOnly: false,
                            signed: false,
                        },
                    );

              return res.status(200).json({
                  status_code: 200,
                  message: 'success_switch_company',
                  status: true,
                  showEbill:config.IS_EBILL_DISABLED,
              });
            }else
            {
                return res.status(200).json({
                    status_code: 500,
                    message: 'token_missing',
                    status: false,
                });
            }
        }else{
            return res.status(200).json({
                status_code: 500,
                message: 'token_missing',
                status: false,
            });
        }
    }else{
        return res.status(200).json({
            status_code: 500,
            message: 'permission_missing',
            status: false,
        });

    } 
  // }else{
  //   return res.status(200).json({
  //     status_code: 500,
  //     message: 'mtc_token_missing',
  //     status: false,
  // });
  // }

});

  } catch (error) {
          logs.action = 'SWITCH_COMPANY';
          logs.level = 'ERROR';
          logs.item = 'EBILL';
          // //addlogs(logs,data.rolePartyId,data.roleAccId);
       console.log(error);
    
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param'+JSON.stringify(cookie)+' '+JSON.stringify(req.body);
      warningMessage(commonErrors,error);
      return res.status(200).json({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
      });
      
  }
}

const keysAvailable = async (req, res) => {
  try {
    redisClient.KEYS("*", (err, data) => {
      res.send(data);
    });

  } catch (error) {
   
    console.log(error);
   
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,';
    warningMessage(commonErrors,error);
    return res.status(500).json({
        message: 'something_went_wrong',
        status: false
    });
  }
}

const remove = async (req, res) => {
  try {
    redisClient.flushall((err) => {
      res.send('success');
    })
  } catch (error) {
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,';
    warningMessage(commonErrors,error);
    return res.status(500).json({
        message: 'something_went_wrong',
        status: false
    });
  }
}
const testRefreshToken = async (req, res) => {
  try {
    console.log('bexioClient',bexioClient);
    
    const tokenSet = await bexioClient.refresh('eyJhbGciOiJub25lIn0.eyJqdGkiOiJmNDU0YzQ3Yi00NTMwLTQzMDktODI2Zi1iMTQ4ZDlhMDI1YWQifQ.','kb_invoice_edit kb_invoice_show openid profile kb_article_order_show contact_edit kb_offer_show kb_order_show kb_invoice_edit kb_order_edit file contact_show offline_access article_show email');
    console.log(tokenSet);
    res.send(tokenSet);

    
  } catch (error) {
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,';
    warningMessage(commonErrors,error);
    return res.status(500).json({
        message: 'something_went_wrong',
        status: false
    });
  }
}

const notifiBexio = async (refreshToken,id,status,message?,netcomId?,amount?,bankId?)=>{



  const pool = await connectPostgres;
  let bexioPool = await postgresBexio;

  let options;
  console.log('refreshToken',refreshToken);
  let params = {
    refreshToken:refreshToken,
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
  const tokenSet = await bexioClient.refresh(refreshToken);
  console.log('tokenSet',tokenSet);
  console.log('id',id);
  console.log('status',status);

  await addBexioComment(tokenSet.access_token,id,status,erroMsg,netcomId);

  
  return new Promise(async(resolve, reject) => {
    try {
      console.log('bankId',bankId);
      let isNotifyBexio = true;
      if(status == 'COMPLETED'){
        const getCompanyIdQry = `SELECT settings ->>'notifyPayment' AS notify FROM
          companyregistered 
          WHERE netcomid = '${netcomId}'
          AND settings IS NOT NULL
          AND settings ->>'notifyPayment' = 'false'`
      
        let getCompanyIdQryResult = await bexioPool.query(getCompanyIdQry);
        if(getCompanyIdQryResult.rows.length > 0){
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
                'Authorization': 'Bearer '+tokenSet.access_token
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
              // res.send(response.body)
              //console.log(response.body);
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
              // resolve(false)
                commonErrors['errorTitle'] = 'notifiBexio';
                commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+response.body.toString()+'-bexio param,'+JSON.stringify(params);
                warningMessage(commonErrors,error);
                resolve(false)
              }
          });
        }else{
          resolve(false)
        }
      }else if(status == 'ERROR' || status == 'INCORRECT' || status == 'REJECTED' || status == 'ERROR-INTERNAL'){
        options = {
          'method': 'POST',
          'url': `https://office.bexio.com/api.php/kb_invoice/${id}/mark_as_ebill_failed`,
          'headers': {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+tokenSet.access_token
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
          // res.send(response.body)
          //console.log(response.body);
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
          // resolve(false)
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


const addBexioComment = async (token,id,status,message?,netcomId?) => {
  const pool = await connectPostgres;
  let bexioPool = await postgresBexio;

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
      // const tokenSet = await bexioClient.refresh(refreshToken);
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
      let isNotifyBexio = true;
      const getCompanyIdQry = `SELECT settings ->>'notifyComments' AS notify FROM
        companyregistered 
        WHERE netcomid = '${netcomId}'
        AND settings IS NOT NULL
        AND settings ->>'notifyComments' = 'false'`

        let getCompanyIdQryResult = await bexioPool.query(getCompanyIdQry);
        if(getCompanyIdQryResult.rows.length > 0){
           isNotifyBexio = false;
        }
        console.log('isNotifyBexio',isNotifyBexio);
        
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
      // console.log(options);
      if(isNotifyBexio)
        {
          request(options, function (error, response) {
            if (error) {  
              console.log('errorr',error);
          
              commonErrors['errorTitle'] = 'addBexioComment';
              commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+JSON.stringify(parms);
              warningMessage(commonErrors,error);
              resolve(false)
            }
            // res.send(response.body)
            //console.log(response.body);
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
              // commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+response?response.body.toString():''+'-bexio param,'+JSON.stringify(parms);
              commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+(response?response.body.toString():'')+'-bexio param,'+JSON.stringify(parms);
              warningMessage(commonErrors,error);
              resolve(false)
              return;
            }
            resolve(false)
          })
        }else{
          resolve(false)
        }
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
const getDefaultUser = async (access_token)=>{

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
          // res.send(response.body)
          //console.log(response.body);
          if(response.statusCode==200)
          resolve(JSON.parse(response.body)[0]);
          else
          resolve(false)
        });
      });
}

const sendG2bOrder = async (req, res) => {
  let formData = null;
  console.log("xmlToJsonOrder ");
  const reqData = req.body;
  console.log(reqData);
  try {
    let transaction_id = req.body.globaltransaction,taxList,orderTitle = '';
    // let bc_id = req.body.bcId;
    let bc_id = req.body.bcId;
    let file_path = req.body.file_path;
    let id = req.body.id;
    let netcomId = req.body.netcomId;
    let cookie, access_token;
    let taxId;
    let orderId = '';
    let bexioPool = await postgresBexio;

    cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
    // cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
    // const tokenSet = await bexioClient.refresh('eyJhbGciOiJub25lIn0.eyJqdGkiOiIyODUxYjM1Yi0wMmViLTQ4OWUtYTU5NC1hMDc3YmUwZDc0ZmMifQ.');
    // access_token = tokenSet.access_token;
    access_token = cookie.access_Token;
    console.log('access_token',access_token);
    // return
    const getCompanyIdQry = `SELECT tax_type,COALESCE(settings,'{}') AS settings FROM
      companyregistered 
      WHERE netcomid = '${netcomId}'`
   
    let getCompanyIdQryResult = await bexioPool.query(getCompanyIdQry);
    taxList = await getTaxListActive(access_token);
    console.log(taxList);
    console.log("typeof ",typeof(taxList));
    
// return
    formData = {
      transaction_id:transaction_id,
      virtual_filename:JSON.parse(file_path).output,
      filetype:'output',
      data_format:'base64'
    }
    var options = {
      'method': 'POST',
      'url': config.PYTHON_API+'file-download',
      // 'url': `http://192.168.2.63:5005/api/file-download`,
      formData: formData
    };
    console.log('formData',formData);
    // return
    
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
    
    // fs.readFile('D:/1/order/47A-717719_1004396_2023-03-20.xml_Intermediate (3).xml', 'utf-8', (err, dataFile) => {
    // let xmlD = dataFile;
    // let data = xmlD;
    // let xml = xmlD;
    // let contact, contryName;
    let title;
    // console.log(xml);
    // let data = 'PE9QRU5UUkFOUyB4bWxucz0iaHR0cDovL3d3dy5vcGVudHJhbnMub3JnL1hNTFNjaGVtYS8yLjEiIHhtbG5zOm1zPSJ1cm46c2NoZW1hcy1taWNyb3NvZnQtY29tOnhzbHQiIHhtbG5zOm15RXh0ZW5zaW9uPSJ1cm46bXlFeHRlbnNpb24iIHhtbG5zOmJtZWNhdD0iaHR0cDovL3d3dy5ibWVjYXQub3JnL2JtZWNhdC8yMDA1IiB4bWxuczp4bWltZT0iaHR0cDovL3d3dy53My5vcmcvMjAwNS8wNS94bWxtaW1lIiB4bWxuczppb21hcmtldD0iaHR0cDovL3RlbXB1cmkub3JnL2lvLW1hcmtldC9vcGVuVFJBTlNfVURYIj4KCTxPUkRFUiB2ZXJzaW9uPSIyLjEiIHR5cGU9InN0YW5kYXJkIj4KCQk8T1JERVJfSEVBREVSPgoJCQk8T1JERVJfSU5GTz4KCQkJCTxPUkRFUl9JRD4wMDAwMDA8L09SREVSX0lEPgoJCQkJPE9SREVSX0RBVEU+MjAxOS0xMS0xMTwvT1JERVJfREFURT4KCQkJCTxQQVJUSUVTPgoJCQkJCTxQQVJUWT4KCQkJCQkJPGJtZWNhdDpQQVJUWV9JRCB0eXBlPSJidXllcl9zcGVjaWZpYyI+MDAwMDA8L2JtZWNhdDpQQVJUWV9JRD4KCQkJCQkJPGJtZWNhdDpQQVJUWV9JRCB0eXBlPSJuZXRjb21JRCI+MDAwMDAwMDAwPC9ibWVjYXQ6UEFSVFlfSUQ+CgkJCQkJCTxQQVJUWV9ST0xFPmJ1eWVyPC9QQVJUWV9ST0xFPgoJCQkJCQk8QUREUkVTUz4KCQkJCQkJCTxibWVjYXQ6TkFNRT5UZXN0PC9ibWVjYXQ6TkFNRT4KCQkJCQkJCTxDT05UQUNUX0RFVEFJTFM+CgkJCQkJCQkJPGJtZWNhdDpDT05UQUNUX05BTUU+VGVzdDwvYm1lY2F0OkNPTlRBQ1RfTkFNRT4KCQkJCQkJCQk8Ym1lY2F0OkVNQUlMUz4KCQkJCQkJCQkJPGJtZWNhdDpFTUFJTD5UZXN0PC9ibWVjYXQ6RU1BSUw+CgkJCQkJCQkJPC9ibWVjYXQ6RU1BSUxTPgoJCQkJCQkJPC9DT05UQUNUX0RFVEFJTFM+CgkJCQkJCQk8Ym1lY2F0OlNUUkVFVD5UZXN0PC9ibWVjYXQ6U1RSRUVUPgoJCQkJCQkJPGJtZWNhdDpaSVA+ODQwNDwvYm1lY2F0OlpJUD4KCQkJCQkJCTxibWVjYXQ6Q0lUWT5UZXN0PC9ibWVjYXQ6Q0lUWT4KCQkJCQkJCTxibWVjYXQ6Q09VTlRSWV9DT0RFRD5DSDwvYm1lY2F0OkNPVU5UUllfQ09ERUQ+CgkJCQkJCTwvQUREUkVTUz4KCQkJCQk8L1BBUlRZPgoJCQkJCTxQQVJUWT4KCQkJCQkJPGJtZWNhdDpQQVJUWV9JRD5mZDwvYm1lY2F0OlBBUlRZX0lEPgoJCQkJCQk8UEFSVFlfUk9MRT5maW5hbF9kZWxpdmVyeTwvUEFSVFlfUk9MRT4KCQkJCQkJPEFERFJFU1M+CgkJCQkJCQk8Ym1lY2F0Ok5BTUU+VGVzdDwvYm1lY2F0Ok5BTUU+CgkJCQkJCQk8Ym1lY2F0OlNUUkVFVD5UZXN0PC9ibWVjYXQ6U1RSRUVUPgoJCQkJCQkJPGJtZWNhdDpaSVA+VGVzdDwvYm1lY2F0OlpJUD4KCQkJCQkJCTxibWVjYXQ6Q0lUWT5UZXN0PC9ibWVjYXQ6Q0lUWT4KCQkJCQkJCTxibWVjYXQ6Q09VTlRSWV9DT0RFRD5DSDwvYm1lY2F0OkNPVU5UUllfQ09ERUQ+CgkJCQkJCTwvQUREUkVTUz4KCQkJCQk8L1BBUlRZPgoJCQkJCTxQQVJUWT4KCQkJCQkJPGJtZWNhdDpQQVJUWV9JRCB0eXBlPSJidXllcl9zcGVjaWZpYyI+MTExMTExMTwvYm1lY2F0OlBBUlRZX0lEPgoJCQkJCQk8Ym1lY2F0OlBBUlRZX0lEIHR5cGU9Im5ldGNvbUlEIj4xMTExMTExMTE8L2JtZWNhdDpQQVJUWV9JRD4KCQkJCQkJPFBBUlRZX1JPTEU+c3VwcGxpZXI8L1BBUlRZX1JPTEU+CgkJCQkJCTxBRERSRVNTPgoJCQkJCQkJPGJtZWNhdDpOQU1FPlRlc3Q8L2JtZWNhdDpOQU1FPgoJCQkJCQk8L0FERFJFU1M+CgkJCQkJPC9QQVJUWT4KCQkJCTwvUEFSVElFUz4KCQkJCTxPUkRFUl9QQVJUSUVTX1JFRkVSRU5DRT4KCQkJCQk8Ym1lY2F0OkJVWUVSX0lEUkVGIHR5cGU9ImJ1eWVyX3NwZWNpZmljIj4yMjIyMjI8L2JtZWNhdDpCVVlFUl9JRFJFRj4KCQkJCQk8Ym1lY2F0OlNVUFBMSUVSX0lEUkVGIHR5cGU9ImJ1eWVyX3NwZWNpZmljIj4yMjIyMjIyMjIyMjwvYm1lY2F0OlNVUFBMSUVSX0lEUkVGPgoJCQkJPC9PUkRFUl9QQVJUSUVTX1JFRkVSRU5DRT4KCQkJCTxibWVjYXQ6Q1VSUkVOQ1k+Q0hGPC9ibWVjYXQ6Q1VSUkVOQ1k+CgkJCQk8SEVBREVSX1VEWD4KCQkJCQk8T3JpZ2luYWxQREZGaWxlTmFtZT4wOTMxNTM1NDkxX1BPMDA4MDIzNjQ4My5QREY8L09yaWdpbmFsUERGRmlsZU5hbWU+CgkJCQk8L0hFQURFUl9VRFg+CgkJCTwvT1JERVJfSU5GTz4KCQk8L09SREVSX0hFQURFUj4KCQk8T1JERVJfSVRFTV9MSVNUPgoJCQk8T1JERVJfSVRFTT4KCQkJCTxMSU5FX0lURU1fSUQ+MTwvTElORV9JVEVNX0lEPgoJCQkJPFBST0RVQ1RfSUQ+CgkJCQkJPGJtZWNhdDpTVVBQTElFUl9QSUQ+MTI8L2JtZWNhdDpTVVBQTElFUl9QSUQ+CgkJCQkJPGJtZWNhdDpERVNDUklQVElPTl9MT05HPnRlc3RfcHJvZF8xPC9ibWVjYXQ6REVTQ1JJUFRJT05fTE9ORz4KCQkJCTwvUFJPRFVDVF9JRD4KCQkJCTxRVUFOVElUWT4yPC9RVUFOVElUWT4KCQkJCTxibWVjYXQ6T1JERVJfVU5JVD5QQUs8L2JtZWNhdDpPUkRFUl9VTklUPgoJCQkJPFBST0RVQ1RfUFJJQ0VfRklYPgoJCQkJCTxibWVjYXQ6UFJJQ0VfQU1PVU5UPjMzLjE1PC9ibWVjYXQ6UFJJQ0VfQU1PVU5UPgoJCQkJPC9QUk9EVUNUX1BSSUNFX0ZJWD4KCQkJCTxQUklDRV9MSU5FX0FNT1VOVD42Ni4zMDwvUFJJQ0VfTElORV9BTU9VTlQ+CgkJCQk8REVMSVZFUllfREFURT4KCQkJCQk8REVMSVZFUllfU1RBUlRfREFURT4yMDE5LTExLTEzPC9ERUxJVkVSWV9TVEFSVF9EQVRFPgoJCQkJCTxERUxJVkVSWV9FTkRfREFURT4yMDE5LTExLTEzPC9ERUxJVkVSWV9FTkRfREFURT4KCQkJCTwvREVMSVZFUllfREFURT4KCQkJCTxJVEVNX1VEWD4KCQkJCQk8RlJFRV9URVhUMj50ZXN0X3Byb2RfMSwgbmFjaGbDg8K8bGxiYXI8L0ZSRUVfVEVYVDI+CgkJCQk8L0lURU1fVURYPgoJCQk8L09SREVSX0lURU0+CgkJCTxPUkRFUl9JVEVNPgoJCQkJPExJTkVfSVRFTV9JRD4yPC9MSU5FX0lURU1fSUQ+CgkJCQk8UFJPRFVDVF9JRD4KCQkJCQk8Ym1lY2F0OlNVUFBMSUVSX1BJRD4xMzwvYm1lY2F0OlNVUFBMSUVSX1BJRD4KCQkJCQk8Ym1lY2F0OkRFU0NSSVBUSU9OX0xPTkc+dGVzdF9wcm9kXzI8L2JtZWNhdDpERVNDUklQVElPTl9MT05HPgoJCQkJPC9QUk9EVUNUX0lEPgoJCQkJPFFVQU5USVRZPjI8L1FVQU5USVRZPgoJCQkJPGJtZWNhdDpPUkRFUl9VTklUPlBBSzwvYm1lY2F0Ok9SREVSX1VOSVQ+CgkJCQk8UFJPRFVDVF9QUklDRV9GSVg+CgkJCQkJPGJtZWNhdDpQUklDRV9BTU9VTlQ+OC4xODwvYm1lY2F0OlBSSUNFX0FNT1VOVD4KCQkJCTwvUFJPRFVDVF9QUklDRV9GSVg+CgkJCQk8UFJJQ0VfTElORV9BTU9VTlQ+MTYuMzY8L1BSSUNFX0xJTkVfQU1PVU5UPgoJCQkJPERFTElWRVJZX0RBVEU+CgkJCQkJPERFTElWRVJZX1NUQVJUX0RBVEU+MjAxOS0xMS0xMzwvREVMSVZFUllfU1RBUlRfREFURT4KCQkJCQk8REVMSVZFUllfRU5EX0RBVEU+MjAxOS0xMS0xMzwvREVMSVZFUllfRU5EX0RBVEU+CgkJCQk8L0RFTElWRVJZX0RBVEU+CgkJCQk8SVRFTV9VRFg+CgkJCQkJPEZSRUVfVEVYVDI+dGVzdF9wcm9kXzJyPC9GUkVFX1RFWFQyPgoJCQkJPC9JVEVNX1VEWD4KCQkJPC9PUkRFUl9JVEVNPgoJCQk8T1JERVJfSVRFTT4KCQkJCTxMSU5FX0lURU1fSUQ+MzwvTElORV9JVEVNX0lEPgoJCQkJPFBST0RVQ1RfSUQ+CgkJCQkJPGJtZWNhdDpTVVBQTElFUl9QSUQ+MTQ8L2JtZWNhdDpTVVBQTElFUl9QSUQ+CgkJCQkJPGJtZWNhdDpERVNDUklQVElPTl9MT05HPnRlc3RfcHJvZF8zPC9ibWVjYXQ6REVTQ1JJUFRJT05fTE9ORz4KCQkJCTwvUFJPRFVDVF9JRD4KCQkJCTxRVUFOVElUWT4xPC9RVUFOVElUWT4KCQkJCTxibWVjYXQ6T1JERVJfVU5JVD5QQUs8L2JtZWNhdDpPUkRFUl9VTklUPgoJCQkJPFBST0RVQ1RfUFJJQ0VfRklYPgoJCQkJCTxibWVjYXQ6UFJJQ0VfQU1PVU5UPjI0LjE1PC9ibWVjYXQ6UFJJQ0VfQU1PVU5UPgoJCQkJPC9QUk9EVUNUX1BSSUNFX0ZJWD4KCQkJCTxQUklDRV9MSU5FX0FNT1VOVD4yNC4xNTwvUFJJQ0VfTElORV9BTU9VTlQ+CgkJCQk8REVMSVZFUllfREFURT4KCQkJCQk8REVMSVZFUllfU1RBUlRfREFURT4yMDE5LTExLTEzPC9ERUxJVkVSWV9TVEFSVF9EQVRFPgoJCQkJCTxERUxJVkVSWV9FTkRfREFURT4yMDE5LTExLTEzPC9ERUxJVkVSWV9FTkRfREFURT4KCQkJCTwvREVMSVZFUllfREFURT4KCQkJCTxJVEVNX1VEWD4KCQkJCQk8RlJFRV9URVhUMj5Qb3NpdGlvbnNsYW5ndGV4dCBIQVJJQk8gR29sZGLDg8KkcmVuIE1pbmkgOGcgMzUwNTkwIDEwMCBTdMODwrxjaywgNzEwNjM2LCBIYXJpYm8gR29sZGLDg8KkcmVuIE1pbmksIEdvbGRiw4PCpHJlbiwgMTAwIHggOSw4IGcsIEZydWNodGd1bW1pIGluIELDg8KkcmNoZW4tRm9ybSxpbiBwcmFrdGlzY2hlciwgd2llZGVydmVyc2NobGllc3NiYXJlciBEb3NlLCBJbmhhbHQ6IDEwMCBNaW5pLUJldXRlbDwvRlJFRV9URVhUMj4KCQkJCTwvSVRFTV9VRFg+CgkJCTwvT1JERVJfSVRFTT4KCQk8L09SREVSX0lURU1fTElTVD4KCQk8T1JERVJfU1VNTUFSWT4KCQkJPFRPVEFMX0lURU1fTlVNPjM8L1RPVEFMX0lURU1fTlVNPgoJCQk8VE9UQUxfQU1PVU5UPjEwNi44MTwvVE9UQUxfQU1PVU5UPgoJCTwvT1JERVJfU1VNTUFSWT4KCTwvT1JERVI+CjwvT1BFTlRSQU5TPg=='
    let data = JSON.parse(response.body).data;
    let xml = Buffer.from(data, 'base64').toString();
            let contact,contryName;
            
          // xml2js.parseString(xml, async (err, result) => {
          //   if(err) {
          //       throw err;
          //   }

    xml2js.parseString(xml, async (err, result) => {
      if (err) {
        console.log("error XML");

        throw err;
      }

      let header, itemList, summary,orderId;
      header = result.OPENTRANS.ORDER[0]?.ORDER_HEADER[0];
      itemList = result.OPENTRANS.ORDER[0]?.ORDER_ITEM_LIST;
      summary = result.OPENTRANS.ORDER[0]?.ORDER_SUMMARY;
          
      let tempDeliveryAddress = header['ORDER_INFO'][0]['PARTIES'][0]['PARTY'].filter((e)=> isArray(e.PARTY_ROLE) && e.PARTY_ROLE[0] == "delivery");
      let deliveryAddress = "";
      if(tempDeliveryAddress.length != 0){
        // Object.keys(tempDeliveryAddress[0]['ADDRESS'][0]).forEach(element => {
        //   deliveryAddress = deliveryAddress + + tempDeliveryAddress[0]['ADDRESS'][0][element]
        // });
        let tempAddress = tempDeliveryAddress[0]['ADDRESS'][0];
        // for (const key in tempAddress) {
        //   if (Array.isArray(tempAddress[key])) {
        //     if(typeof(tempAddress[key][0])){
        //       console.log();
              
        //     }
        //     deliveryAddress += tempAddress[key][0] + '\n';  // Take the first element from the array and append \n
        //   }
        // }
        deliveryAddress = await getAddress(tempAddress);
        console.log('12345',deliveryAddress);
      }
     function getAddress(tempAddress){
      for (const key in tempAddress) {
        if (Array.isArray(tempAddress[key])) {
          if(typeof(tempAddress[key][0]) == 'object'){
            deliveryAddress =  getAddress(tempAddress[key][0])
          }else{
            deliveryAddress += tempAddress[key][0] + '\n';  // Take the first element from the array and append \n

          }
        }
      }
      return deliveryAddress;

     } 
      // orderId = result.OPENTRANS.ORDER[0]?.ORDER_HEADER[0]?.ORDER_INFO[0]?.ORDER_ID[0];
      console.log(JSON.stringify(result));
    //   if ('PARTIES' in header.ORDER_INFO[0]) {
    //     console.log('PARTIES',JSON.stringify(header.ORDER_INFO[0]['PARTIES'][0]['PARTY']));
    //     let buyerDetails = header.ORDER_INFO[0]['PARTIES'][0]['PARTY'].filter((e) => e.PARTY_ROLE == "buyer");
    //     if(buyerDetails)
    //     {
    //      if ('ADDRESS' in buyerDetails[0]){
    //        console.log('byer',buyerDetails[0]['ADDRESS']);
    //        ('bmecat:NAME') in buyerDetails[0]['ADDRESS'][0] ? orderTitle = buyerDetails[0]['ADDRESS'][0]['bmecat:NAME'] : '';
    //        ('bmecat:STREET') in buyerDetails[0]['ADDRESS'][0] ? orderTitle = orderTitle +', '+ buyerDetails[0]['ADDRESS'][0]['bmecat:STREET'] : '';
    //        ('bmecat:ZIP') in buyerDetails[0]['ADDRESS'][0] ? orderTitle = orderTitle +', '+ buyerDetails[0]['ADDRESS'][0]['bmecat:ZIP'] : '';
    //      }
    //     }
        
    //  }
    if('REMARKS' in header.ORDER_INFO[0])
    {
      // if ('ORDERINFO' in header.ORDER_INFO[0]['HEADER_UDX'][0]) {
      orderTitle = header.ORDER_INFO[0]['REMARKS'][0];
      // }
    }
    //  if ('ORDER_ID' in header.ORDER_INFO[0]) {
    //   orderTitle = orderTitle +' - OrgPO:'+header.ORDER_INFO[0]['ORDER_ID'][0];
    //  }

     console.log('orderTitle',orderTitle);

      // return
      console.log({
        header,
        itemList,
        summary,
        orderId
      });
     

      if ('ORDER_ID' in header.ORDER_INFO[0]) {
       
        orderId = header.ORDER_INFO[0]['ORDER_ID'][0]
        // orderTitle = orderTitle +' - OrgPO:'+orderId;
        // orderTitle = await setOrderTitle(orderTitle,header.ORDER_INFO[0]['ORDER_ID'][0]);
     }
        
      console.log('orderIdorderId',orderId);
  //     if ('PARTIES' in header.ORDER_INFO[0]) {
  //       console.log('PARTIES',JSON.stringify(header.ORDER_INFO[0]['PARTIES'][0]['PARTY']));
  //       let buyerDetails = header.ORDER_INFO[0]['PARTIES'][0]['PARTY'].filter((e) => e.PARTY_ROLE == "buyer");
  //       if(buyerDetails)
  //       {
  //        if ('ADDRESS' in buyerDetails[0]){
  //              console.log('byer',buyerDetails[0]['ADDRESS']);
  //              orderTitle.length < 80 ? (('bmecat:NAME') in buyerDetails[0]['ADDRESS'][0] ? orderTitle = await setOrderTitle(orderTitle,buyerDetails[0]['ADDRESS'][0]['bmecat:NAME']) : '') : '';
  //              orderTitle.length < 80 ? ('bmecat:STREET') in buyerDetails[0]['ADDRESS'][0] ? orderTitle = orderTitle +' ,'+ buyerDetails[0]['ADDRESS'][0]['bmecat:STREET'] : '';
  //              orderTitle.length < 80 ? ('bmecat:ZIP') in buyerDetails[0]['ADDRESS'][0] ? orderTitle = orderTitle +' ,'+ buyerDetails[0]['ADDRESS'][0]['bmecat:ZIP'] : '';
  //            }
  //       }
    
  //    }

      // if ('HEADER_UDX' in header.ORDER_INFO[0]) {
      
      //   console.log("MIME_INFO");
      // }
      if('REMARKS' in header.ORDER_INFO[0])
      {
          // if ('ORDERINFO' in header.ORDER_INFO[0]['HEADER_UDX'][0]) {
          orderTitle = header.ORDER_INFO[0]['REMARKS'][0];
          // }
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
      let iteamArray = [];
      let taxId = [];
      let taxStatus = true;
      let tempTaxIdTmp = taxList.filter((e) =>  (e.type == 'not_taxable_turnover' && e.value == 0) || (e.type == 'not_taxable_turnover' && e.value == (0 * 100)));
      console.log('tempTaxIdTmp[0]',tempTaxIdTmp[0].id);

      itemList[0].ORDER_ITEM.forEach(element => {
        console.log(element.LINE_ITEM_ID[0]);
        let items = {};
        let discounts = {};
        // items = 
        // items['position'] = Math.trunc(element.LINE_ITEM_ID[0]),
          console.log(typeof (element.PRODUCT_ID[0]));

        //  typeof(element.PRODUCT_ID[0]) ==  'object' ?:'',
        if (typeof (element.PRODUCT_ID[0]) == 'object') {
          if ('bmecat:DESCRIPTION_SHORT' in element.PRODUCT_ID[0]) {
            title = element.PRODUCT_ID[0]['bmecat:DESCRIPTION_SHORT'][0];
          } else {
            title = ' ';
          }
        } else {
          title = ' ';
        }
        // items['title'] = title;
        // items['tax_id'] = element.
        // console.log('priceAmount',parseFloat(element.PRODUCT_PRICE_FIX[0]['bmecat:PRICE_AMOUNT'][0]));
        // console.log('priceAmount',parseFloat(element.PRODUCT_PRICE_FIX[0]['bmecat:PRICE_AMOUNT'][0]).toFixed(2));

        // return
        console.log('123');

        items['amount'] = element.QUANTITY[0];
        // items['booking_account_id'] = 99; // Setting default value
        items['unit_price'] = parseFloat(element.PRODUCT_PRICE_FIX[0]['bmecat:PRICE_AMOUNT'][0]).toFixed(2);
        // let desc = '';
        // console.log("element.PRODUCT_ID[0]['bmecat:DESCRIPTION_LONG']",element.PRODUCT_ID[0]['bmecat:DESCRIPTION_LONG']);
        let desc = '',tempDesc = '';
        // console.log("element.PRODUCT_ID[0]['bmecat:SUPPLIER_PID']",element.PRODUCT_ID[0]['bmecat:SUPPLIER_PID'][0]);
        // console.log("typeof(element.PRODUCT_ID[0]['bmecat:SUPPLIER_PID'])",typeof(element.PRODUCT_ID[0]['bmecat:SUPPLIER_PID'][0]));
        
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
        
        //  element.PRODUCT_ID[0]['bmecat:DESCRIPTION_LONG'] ?items['text'] =  element.PRODUCT_ID[0]['bmecat:DESCRIPTION_LONG'][0]:'';
       
        console.log(items);
        // console.log('DESCRIPTION_SHORT', element.PRODUCT_ID[0]['bmecat:DESCRIPTION_LONG']);
        // console.log('PRICE_AMOUNT', element.PRODUCT_PRICE_FIX[0]['bmecat:PRICE_AMOUNT']);
        // items['tax_id'] = 16;
        // taxId.push();
        // console.log('element.PRODUCT_PRICE_FIX[0]',element.PRODUCT_PRICE_FIX[0]);
        // console.log('123');
        console.log(getCompanyIdQryResult.rows[0]);
        let tempTaxId,tempTaxType,taxValue;
        
        // if('tax_value' in  getCompanyIdQryResult.rows[0]?.settings){

        //   // console.log('iffffffffffffffffffff');
        //   // tempTaxType = (element.PRODUCT_PRICE_FIX[0]['TAX_DETAILS_FIX'][0]['bmecat:TAX_TYPE'][0]).toLowerCase() == 'vat' ? 'net_tax' : element.PRODUCT_PRICE_FIX[0]['TAX_DETAILS_FIX'][0]['bmecat:TAX_TYPE'];
        //   tempTaxType = getCompanyIdQryResult.rows[0]?.settings.tax_type;
        //   taxValue = getCompanyIdQryResult.rows[0]?.settings.tax_value;

        //   console.log('tempTaxType',tempTaxType);
        //   tempTaxId = taxList.filter((e) =>  (e.type == tempTaxType && e.value == taxValue) || (e.type == tempTaxType && e.value == (taxValue * 100)));
        //   tempTaxId != '' ? items['tax_id'] = tempTaxId[0]['id']:taxStatus = false;
        //   taxId.push(tempTaxId)
        // }else{
          console.log('99988887777');
          
          if ('TAX_DETAILS_FIX' in element.PRODUCT_PRICE_FIX[0]) {
            // console.log('bmecat:TAX_TYPE',element.PRODUCT_PRICE_FIX[0]['TAX_DETAILS_FIX'][0]);
  
              if ('bmecat:TAX_TYPE' in element.PRODUCT_PRICE_FIX[0]['TAX_DETAILS_FIX'][0]) {
                if ('bmecat:TAX' in element.PRODUCT_PRICE_FIX[0]['TAX_DETAILS_FIX'][0]) {
                  // taxId = taxList.filter((e) => e.type == element.PRODUCT_PRICE_FIX[0]['TAX_DETAILS_FIX'][0]['bmecat:TAX_TYPE'] && e.value == element.PRODUCT_PRICE_FIX[0]['TAX_DETAILS_FIX'][0]['bmecat:TAX']);
                  // taxId != '' ? items['tax_id'] = taxId[0]['id']:'';
                  // console.log("element.PRODUCT_PRICE_FIX[0]['TAX_DETAILS_FIX'][0]['bmecat:TAX']",element.PRODUCT_PRICE_FIX[0]['TAX_DETAILS_FIX'][0]['bmecat:TAX']);
                  let tempTaxId,tempTaxType;
                  // tempTaxType = (element.PRODUCT_PRICE_FIX[0]['TAX_DETAILS_FIX'][0]['bmecat:TAX_TYPE'][0]).toLowerCase() == 'vat' ? 'net_tax' : element.PRODUCT_PRICE_FIX[0]['TAX_DETAILS_FIX'][0]['bmecat:TAX_TYPE'];
                  tempTaxType = getCompanyIdQryResult.rows[0].tax_type? getCompanyIdQryResult.rows[0].tax_type :'sales_tax';
  
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
              // let taxId = taxList.filter((e)=> e.type == element.PRODUCT_PRICE_FIX[0]['TAX_DETAILS_FIX'][0]['bmecat:TAX_TYPE'] && e.value == element.PRODUCT_PRICE_FIX[0]['TAX_DETAILS_FIX'][0]['bmecat:TAX'])
              // console.log('taxId',taxId);
            }
            else{
  
              items['tax_id'] = tempTaxIdTmp[0].id;            
            }
        // }
        // items['unit_id'] = 1;
        items['type'] = 'KbPositionCustom';
        iteamArray.push(items)
        console.log(items);
      });
     
      // let a = await allContacts(access_token);
      // contact = await getContactDetails(access_token, customerIds[0].senderid);
      console.log('customerIds',customerIds);
      
      contact = await getContactDetails(access_token, customerIds[0].senderid);

      console.log("contact++ ",contact);
      if (!contact) {
        logs.action = 'bexio.order.send';
        logs.level = 'ERROR';
        logs.item = 'EDI';
        addlogs(logs,reqData.rolePartyId,reqData.roleAccId);
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
      // console.log("contact['country_id']", contact['country_id']);

      // contryName = contact['country_id'] ? await getCountryName(access_token, contact['country_id']) : true;
      // console.log('contryName', contryName);
      // if (!contryName) {
      //   res.send({
      //     status_code: 500,
      //     message: 'something_went_wrong',
      //     status: false,

      //   });
      //   return
      // }
      // console.log('contryName', JSON.parse(contryName)['iso_3166_alpha2']);
      // console.log('amount_man', summary[0].TOTAL_AMOUNT[0]);
      // console.log('amount_man_trunc', Math.trunc(summary[0].TOTAL_AMOUNT[0]));
      // console.log('taxStatus',taxStatus);
      if(!taxStatus){
        logs.action = 'bexio.order.send';
        logs.level = 'ERROR';
        logs.item = 'EDI';
        addlogs(logs,reqData.rolePartyId,reqData.roleAccId);
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
      console.log('getCompanyIdQryResult.rows[0].settings',getCompanyIdQryResult.rows[0].settings);

      
      // let mwstType  = getCompanyIdQryResult.rows[0].settings? getCompanyIdQryResult.rows[0].settings.mwst_is_net :'';
      let mwstType;
      if('HEADER_UDX' in header.ORDER_INFO[0]){
        if('IS_TAX_INCLUSIVE' in header.ORDER_INFO[0]['HEADER_UDX'][0]){
          if(header.ORDER_INFO[0]['HEADER_UDX'][0]['IS_TAX_INCLUSIVE'][0] == "true"){
            mwstType = "false";
          }else{
            mwstType = "true";
          }
          // mwstType = (!header.ORDER_INFO[0]['HEADER_UDX'][0]['IS_TAX_INCLUSIVE'][0]).toString();
          console.log("header.ORDER_INFO[0]['HEADER_UDX'][0]['IS_TAX_INCLUSIVE'][0]",header.ORDER_INFO[0]['HEADER_UDX'][0]['IS_TAX_INCLUSIVE'][0]);
        }
      }
      // mwstType = mwstType.toString()
      console.log('mwstTypemwstType',mwstType);
      
      console.log("cnyCurrency :: ",cnyCurrency);
      let order = {
        "contact_id": customerIds[0].senderid ,
        "user_id": contact.user_id,
        // "language_id": contact.language_id,
        "currency_id": cnyCurrency ? cnyCurrency.id : '',
        "mwst_type": taxId.length != 0 ? 0 : 1,
        "mwst_is_net": taxId.length != 0 ? (mwstType ? mwstType :true) : false,
        //  "address": {
        //   "lastname_company": contact['name_1'],
        //   "country_code": contryName ? JSON.parse(contryName)['iso_3166_alpha2'] : '',
        //   "type": JSON.parse(config.BEXIO_COMPANY_TYPE)[contact['contact_type_id']]
        // }, 
        "is_valid_from": formatDate(header.ORDER_INFO[0].ORDER_DATE),
        "positions": iteamArray,
        "title": orderTitle,
         "delivery_address_type": deliveryAddress != "" ? "1" : undefined,
         "delivery_address_manual": deliveryAddress != "" ? deliveryAddress : undefined,

        // "amount_man":parseFloat(summary[0].TOTAL_AMOUNT[0]).toFixed(2),


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
          res.send({
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
          // let orderEdit = {
            
          //   "footer":footer,
          // }
          // console.log('orderEdit',orderEdit);
          
          //   var optionsEdit = {
          //     'method': 'POST',
          //     'url': `${config.BEXIO_API}2.0/kb_order/${JSON.parse(response.body)['id']}`,
          //     'headers': {
          //       'Accept': 'application/json',
          //       "Content-Type": "application/json",
          //       'Authorization': 'Bearer '+access_token
          //     },
          //     body:JSON.stringify(orderEdit)
      
          //   };
          //   request(optionsEdit, async function (error, response) {
          //     console.log('editRes',response.body);
              
          //   })
          }
          logs.action = 'bexio.order.send';
          logs.level = 'NOTIFICATION';
          logs.item = 'EDI';
          addlogs(logs,reqData.rolePartyId,reqData.roleAccId);
          res.send({
            status_code: 200,
            message: 'common_sucess',
            status: true,
            data: [],
          });
        }else{
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'SEND_G2B_ORDER -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'SEND_G2B_ORDER');
          res.send({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
          })
        }
      });
      console.log('SEND_G2B_ORDER1SEND_G2B_ORDER1');
    
    
    });
 
    // });
  });
    
  } catch (error) {
    console.log('errorerrorerrorerror',error);
    logs.action = 'bexio.order.send';
    logs.level = 'ERROR';
    logs.item = 'EDI';
    addlogs(logs,reqData.rolePartyId,reqData.roleAccId);

    //  let errorJson = {host:req.headers.host,method:'xmlToJson',parms:req.body,error:error}
    //  // Logger.sendErrorLog(errorJson);
     commonErrors['errorTitle'] = req.originalUrl;
     commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+formData;
     warningMessage(commonErrors,error);
     res.send({
       status_code: 500,
       message: JSON.stringify(error),
       status: false,
     })
    // Logger.errorAndMail(error);
  }
  // log JSON string
  // console.log(json);


}
const getAllCurrency = async (access_token)=>{

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
          // res.send(response.body)
          //console.log(response.body);
          if(response?.statusCode==200)
            resolve(JSON.parse(response.body));
          else
            resolve(false)
        });
      });
}
const getBccontactDetails = async (req, res)=>{
  console.log('2222222');
  let data = req.body;
  
  try{
    if(data.contactId && data.netcomId){
    
    let bexioPool = await postgresBexio;
    let bc_id 
    let business_connection
    return new Promise(async(resolve, reject) => {
      let getbcConnection = `SELECT array_agg(rk_businessconnection) AS bcids
            FROM contact_bc
          WHERE  (rk_netcomidsender = '${data.netcomId}' OR rk_netcomidreceived = '${data.netcomId}')
          AND (rk_sendercontactid = ${data.contactId} OR rk_receivercontactid = ${data.contactId})
          AND type = 'EDI'
          AND rk_businessconnection IS NOT NULL`
        console.log(getbcConnection);
        console.log('data.netcom_id',data.netcomId);
        console.log('data.contactId',data.contactId);

        let checkConnection = await bexioPool.query(getbcConnection);
        console.log(checkConnection.rows[0].bcids);
        bc_id = checkConnection.rows[0].bcids;
        console.log('bc_id',bc_id);
      if(bc_id){
        let formData = {
          bc : bc_id.toString(),
          netcom_id : data.netcomId
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
            commonErrors['errorTitle'] = 'getConutryCode';
            warningMessage(commonErrors,error);
            resolve(false)
          }
          console.log('body',body);
          res.send({
            status_code: 200,
            message: 'common_sucess',
            status: true,
            data: JSON.parse(body)['data'],
          });
        });
     
      }else{
        res.send({
          status_code: 200,
          message: 'common_sucess',
          status: true,
          data: [],
        });
      }
       
      });
    }else{
      commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'missing_contactId_netcomId -req param,',JSON.stringify(req.body);
        warningMessage(commonErrors,'missing_contactId_netcomId');
      return res.status(200).json({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
    });  
    }
  }
  
  catch (error) {
   logs.action = 'BC_CONTACT_DETAILS';
   logs.level = 'ERROR';
   logs.item = 'EDI';
  //  addlogs(logs,data.rolePartyId,data.roleAccId);
   console.log(error);
   commonErrors['errorTitle'] = req.originalUrl;
   commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+JSON.stringify(req.body); 
   warningMessage(commonErrors,error);
   return res.status(200).json({
       status_code: 500,
       message: 'something_went_wrong',
       status: false,
   });
   
}

}



const getBcDetails = async (bc_id,netcomId)=>{
  //  let access_token = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_NAME]))).access_token;
  try{
    let bexioPool = await postgresBexio;
    // let bc_id 
    console.log('654');
    console.log('bc_id:: ',bc_id);
    console.log('netcomId:: ',netcomId);
    
    let business_connection
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
      commonErrors['errorTitle'] = getCountryLists.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+'access_token';
      warningMessage(commonErrors,error);
      fs.writeFile('assets/errorLog.txt', JSON.stringify(error), function () {
        // res.send();
        resolve('');
      });
    }
}
const getBexioDocTypes = async (req, res)=>{
  const data = req.body;
  try {
    res.send({
      status_code: 200,
      message: 'common_sucess',
      status: true,
      data: JSON.parse(config.BEXIO_DOCTYPES),
    });
  } catch (error) {
    logs.action = 'BEXIO_DOC_TYPE';
    logs.level = 'ERROR';
    logs.item = 'EDI';
    // addlogs(logs,data.rolePartyId,data.roleAccId);
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'BEXIO_DOC_TYPE -req param,',JSON.stringify(req.body);
    warningMessage(commonErrors,'BEXIO_DOC_TYPE');
    return res.status(500).json({
      status_code: 500,
      message: 'something_went_wrong',
      status: false,
    });
  }
}
const getContactList = async (req,res)=>{
  let pool = await connectPostgres;
  const data = req.body;
  console.log('1111');
  
  try {
    let docType = data.docType || 'Invoice';
    let direction = data.direction || 'Receive';
    let contact_type_id = data.contact_type_id;
    let gate2b = await connectGate2b;
    let bexioPool = await postgresBexio;
    let newGate2b = await postgresGate2b;
    const getInviteCompanyIdQry = `SELECT * FROM
    companyregistered 
    WHERE rk_party = $1`

    let getInviteNetcomId = await bexioPool.query(getInviteCompanyIdQry,[data.partyId]);
    let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
    
    let dataCookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.cookies[config.EXPIRE_EXPIRES_COOKIE_NAME])));

    let accessToken = cookie.access_Token;
    let isBexioUser = cookie.isBexioUser;

    // const getInviteCompanyIdQry = `SELECT array_agg(pa.cid) AS cid FROM
    // party_account pa
    // WHERE pa.fk_party = $1`
    // let getInviteCompanyId = await pool.query(getInviteCompanyIdQry,[data.partyId]);


    const getInviteCompany = `SELECT cid,rk_netcomidsender AS sender,
      rk_netcomidreceived AS receiver,rk_contact,receivercustomerid,status,rk_businessconnection,rk_sendercontactid,rk_receivercontactid
    FROM contact_bc
      WHERE  (rk_netcomidsender = $1 OR rk_netcomidreceived = $1)
      AND type = 'EDI'`
    let partyAccountCheck = await bexioPool.query(getInviteCompany,[dataCookie.netcomId]);
    
    let beStruct = {}

    const getInviteCompanyBc = `SELECT array_agg(rk_businessconnection) AS cid
      FROM contact_bc
    WHERE  (rk_netcomidsender = $1 OR rk_netcomidreceived = $1) AND rk_businessconnection IS NOT NULL
    AND  type = 'EDI'`
    let getInviteCompanyBcResult = await bexioPool.query(getInviteCompanyBc,[dataCookie.netcomId]);
  console.log('11112222');
  
  // // **********************************************************
  //   const getInviteCompanyBcDetails = `SELECT g2bConnBC.id AS bcId,g2bConnIn.id AS in_connection_id,g2bConnOut.id AS out_connection_id,
  //     g2bConnIn."netcomId" AS in_netcomid,
  //     lpIn."companyname" AS in_legalname,
  //     g2bConnOut."netcomId" AS out_netcomid,
  //     lpOut."companyname" AS out_legalname,
  //     CASE WHEN g2bConnIn."netcomId" = '${dataCookie.netcomId}' THEN g2bConnIn."direction" WHEN g2bConnOut."netcomId" = '${dataCookie.netcomId}' THEN g2bConnOut."direction" END AS "company_direction",
  //     CASE WHEN g2bConnIn."netcomId" = '${dataCookie.netcomId}' THEN g2bConnOut."direction" WHEN g2bConnOut."netcomId" = '${dataCookie.netcomId}' THEN g2bConnIn."direction" END AS "partner_company_direction",
  //     CASE WHEN g2bConnIn."netcomId" = '${dataCookie.netcomId}' THEN docTypeIn.type WHEN g2bConnOut."netcomId" = '${dataCookie.netcomId}' THEN docTypeOut.type END AS company_document_type,
  //     CASE WHEN g2bConnOut."netcomId" = '${dataCookie.netcomId}' THEN docTypeIn.type WHEN g2bConnIn."netcomId" = '${dataCookie.netcomId}' THEN docTypeOut.type END AS partner_company_document_type,
  //     CASE WHEN g2bConnIn."netcomId" = '${dataCookie.netcomId}' THEN docFormatIn.format WHEN g2bConnOut."netcomId" = '${dataCookie.netcomId}' THEN docFormatOut.format END AS company_document_format,
  //     2 AS invitation_status,
  //     0 AS invitation_id,
  //     g2bConnBC.id AS bc_id,
  //     '' AS "invitation_role",
  //     0 AS invite_code,
  //     '' AS invited_email,
  //     (g2bConnBC."ot_updator"):: text AS ot_updator,
  //     (g2bConnBC."payee_details"):: text AS payee_details,

      
  //     CASE WHEN g2bConnIn."netcomId" = '${dataCookie.netcomId}' THEN g2bConnBC."IN_customerId"
  //     WHEN g2bConnOut."netcomId" = '${dataCookie.netcomId}' THEN
  //     (
  //       g2bConnBC."ot_updator" ->> 'out_custom_id'
  //     ):: text
    
  //     END AS myCustomerId,


  //     CASE WHEN g2bConnIn."netcomId" = '${dataCookie.netcomId}' THEN
  //     g2bConnBC."OUT_customerId"
  //     WHEN g2bConnOut."netcomId" = '${dataCookie.netcomId}'  THEN
  //     (
  //       g2bConnBC."ot_updator" ->> 'in_custom_id'
  //     ):: text 
  //     END AS myPartnerCustomerId,

  //     g2bConnBC."created_time" FROM
  //     g2b_connections g2bConnIn
  //     INNER JOIN ediparty edipartyIn ON edipartyIn.netcomid = g2bConnIn."netcomId"
  //     INNER JOIN legalparty lpIn ON lpIn.fk_ediparty = edipartyIn.cid
  //     INNER JOIN g2b_business_connections g2bConnBC ON g2bConnIn.id = g2bConnBC."FK_g2b_connections_IN"
  //     INNER JOIN g2b_connections g2bConnOut ON g2bConnOut.id = g2bConnBC."FK_g2b_connections_OUT"
  //     INNER JOIN ediparty edipartyOut ON edipartyOut.netcomid = g2bConnOut."netcomId"
  //     INNER JOIN legalparty lpOut ON lpOut.fk_ediparty = edipartyOut.cid
  //     INNER JOIN doc_type docTypeIn ON docTypeIn.id = g2bConnIn."FK_doc_type"
  //     INNER JOIN doc_type docTypeOut ON docTypeOut.id = g2bConnOut."FK_doc_type"
  //     INNER JOIN doc_format docFormatIn ON docFormatIn.id = g2bConnIn."FK_doc_format"
  //     INNER JOIN doc_format docFormatOut ON docFormatOut.id = g2bConnOut."FK_doc_format"
  //     WHERE
  //     g2bConnBC.id IN (${getInviteCompanyBcResult.rows[0].cid})`
  //   //  console.log(getInviteCompanyBcDetails);
  //    console.log('getInviteCompanyBcResult.rows[0].cid',getInviteCompanyBcResult.rows[0].cid);
     
  //   let getInviteCompanyBcDetailsResult = await newGate2b.query(getInviteCompanyBcDetails);
  //   // console.log(getInviteCompanyBcDetailsResult.rows);
  //   // ****************************************************
    let resultBc = [];
    console.log('getInviteCompanyBcResult.rows[0].cid',getInviteCompanyBcResult.rows[0].cid);
    

    if(getInviteCompanyBcResult.rows[0].cid != null){
      let bcResult = await getBcDetails(getInviteCompanyBcResult.rows[0].cid,dataCookie.netcomId);
      // console.log('getInviteCompanyBcResult.rows[0].cid',getInviteCompanyBcResult.rows[0].cid);
      
      resultBc =  bcResult['data'];
    }
    
    // resultBc.forEach(element => {
      
    // });
        
    resultBc.forEach(async element => {
      beStruct[element.bc_id] = element;
    });
    console.log('beStruct',beStruct);
    
    partyAccountCheck = partyAccountCheck.rows
    // console.log('party',partyAccountCheck);
    // const partyAccountCheck = await pool.query(getInviteCompany,[data.partyId,contactData.name_1]);
    console.log('eeee');
 
      let totalCount;
      if(isBexioUser)
      {
        
        let showFrom = req.body.records_per_page * (req.body.page_number-1);
        let showTo = req.body.records_per_page;
        // console.log(accessToken);
        let resData ;
        let countryList = {};
        resData = await getCountryLists(accessToken);
        // console.log('resData',resData);
        console.log('resData',resData);
        
        if(!resData)
        {
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'countryList_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'countryList_not_found');
          res.send({
            status_code: 500,
            message: 'something_went_wrong',
            status: false,
        
        });
        return
        }
        resData = JSON.parse(resData);
        resData['message'] != 'Unauthorized' ?resData.forEach((country) => {
          countryList[country.id] = country.name
        }):'';
        let options;
    console.log('zzzz');

        if(data['username'] != '' || data['email'] != '' || data['surname'] != '' || data['contact_type_id'] != '')
        {
          let searchJson = [];
           
          if(data['username'] != '' && data['username']){
            searchJson.push({
              "field":"name_1",
              "value": data['username'],
              "criteria":"like"
            })
          }
           console.log("data['mail']",data['email']);
          
          if(data['email'] != '' && data['email']){
            searchJson.push({
              "field":"mail",
              "value":data.email,
              "criteria":"like"
            })
          }
          if(data['surname'] != '' && data['surname']){
            searchJson.push({
              "field":"name_2",
              "value":data.surname,
              "criteria":"like"
            })
          }
          if( data['contact_type_id'] != "" && data['contact_type_id']){
            searchJson.push({
              "field":"contact_type_id",
              "value":data.contact_type_id,
              "criteria":"equal"
            })
          }
          options = {
            'method': 'POST',
            'url': `${config.BEXIO_API}${data.api}/search/?limit=${showTo}&offset=${showFrom}&order_by=updated_at_desc`,
            // 'url': `${config.BEXIO_API}${data.api}`,
            // url = `${url}`;
            'headers': {
              'Accept': 'application/json',
              'Authorization': 'Bearer '+accessToken
            },
            body: JSON.stringify(searchJson)
          };

        totalCount = await contactListCountSearch(accessToken,searchJson,0,2000)
        console.log('totalCount',totalCount);
        
        // totalCount = await  contactListCountSearch(accessToken,0,2000);

      }else{
        // totalCount = await contactListCount(accessToken,0)
        totalCount = await  contactListCount(accessToken,0,2000);
        console.log('totalCount',totalCount);
        
        options = {
          'method': 'GET',
          'url': `${config.BEXIO_API}${data.api}/?limit=${showTo}&offset=${showFrom}&order_by=updated_at_desc`,
          // 'url': `${config.BEXIO_API}${data.api}`,
          // url = `${url}`;
          'headers': {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+accessToken
            } 
          }
        }
      
        console.log('totalCount',totalCount);
          // 'url': `${config.BEXIO_API}${data.api}?order_by=updated_at_desc`,

          request(options, async function (error, response) {
            if (error) {
              console.log('eror');
              commonErrors['errorTitle'] = bexioApi.name;
              commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'-bexio param,'+showTo+' '+showFrom;
              warningMessage(commonErrors,error);
              return res.status(200).json({
                status: false,
                message: [response],
                
              });
            }
            
            if(response.statusCode != 200)
            return res.status(200).json({
              status: false,
              message: [response],
              
          });
          // console.log('beStruct',beStruct);
          
            let resData = response.body.length != 0 && response.statusCode == '200'? JSON.parse(response.body) : '';
            let senderStatus='';
            let receiverStatus='';
            console.log('hhhhh');
    
            for (let contactIndex in resData) {
              resData[contactIndex]['country'] = countryList[resData[contactIndex]['country_id']] ? countryList[resData[contactIndex]['country_id']] : '';
              console.log();
           
              if(partyAccountCheck.length != 0)
             {

             
              for (let partyAccountIndex in partyAccountCheck) {
              if(direction == 'send')  
              {
                if('bcActive' in resData[contactIndex]){
                        
                }else{
                  resData[contactIndex]['bcActive'] = [];
                }
                if(partyAccountCheck[partyAccountIndex].sender == dataCookie.netcomId)
                {
                  if(partyAccountCheck[partyAccountIndex].rk_sendercontactid == resData[contactIndex].id)
                  {
                    
                    let tempIndex = partyAccountCheck[partyAccountIndex].rk_businessconnection;
                    let tempBc = beStruct[tempIndex];
                   
                    if(tempBc)
                    {
                      
                      if(docType == tempBc['company_details']['doc_type']['data']){
                      
                        resData[contactIndex]['bcActive'].push(beStruct[partyAccountCheck[partyAccountIndex].rk_businessconnection]);
                        resData[contactIndex]['bcDetailsSend'] = beStruct[partyAccountCheck[partyAccountIndex].rk_businessconnection];

                      }
                    }
                  
                  }
                }
              }
              if(direction == 'receive')  
              {
                if('bcActive' in resData[contactIndex]){
                }else{
                  resData[contactIndex]['bcActive'] = [];
                }
                if(partyAccountCheck[partyAccountIndex].receiver == dataCookie.netcomId)
                {
                  if(partyAccountCheck[partyAccountIndex].rk_receivercontactid == resData[contactIndex].id)
                  {
                    let tempBc = beStruct[partyAccountCheck[partyAccountIndex].rk_businessconnection];
                
                    if(tempBc)
                    {
                      if(docType == tempBc['company_details']['doc_type']['data']){
                      
                        resData[contactIndex]['bcActive'].push(beStruct[partyAccountCheck[partyAccountIndex].rk_businessconnection]);
                      }
                  }
                  }
                }
              }
            }
          }else{
            resData[contactIndex]['bcActive'] = [];
          }
            }

            
            let keys = Object.keys(req.body)
            // let redisKey = req.url+"_"+req.body.partyId+"_";
            let redisKey = req.body.partyId+"_"+req.url+"_";
            keys.forEach(element => {
                redisKey = req.body[element]? redisKey +element+':'+ req.body[element] + '_' : redisKey
            });
            await redisClient.setex(redisKey,24*60*60*2,JSON.stringify({
              status: 200,
              data:resData,
              totalCount:totalCount
            } ));
            res.send({
              status: 200,
              data:resData,
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
    console.log('error',error);         
    logs.action = 'BEXIO';
    logs.level = 'ERROR';
    logs.item = 'EDI';
    // //addlogs(logs,data.rolePartyId,data.roleAccId);
    console.log('*****',error);
      commonErrors['errorTitle'] = bexioApi.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,',req.body;
      warningMessage(commonErrors,error);
    // fs.writeFile('assets/errorLog.txt', JSON.stringify(error), function () {
    //   res.send();
    // });
   
        // commonErrors['errorTitle'] = req.originalUrl;
        // commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString();
        // warningMessage(commonErrors);
    res.send({

      status_code: 500,
      message: JSON.stringify(error),
      status: false,
  })
  }
}
const getPurchaseOrderList = async (req,res)=>{
  let cookie = null
  let data = req.body
  let partyId = req.body.partyId;
 
  const pool = await connectPostgres;
  try {
    cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
    let accessToken = cookie.access_Token;
    let isBexioUser = cookie.isBexioUser;
    const bexioPool = await postgresBexio;
    let resultData = [],tempStatus = false;
    let totalCount;
    let sortColumn = 'updated_at';
    let sortType = 'asc';

    /* let totalCount = await invoiceListCount(accessToken);
    if(!totalCount){
      res.send({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
      });
      return;
    }
    console.log('totalCount',totalCount); */
    let showFrom = req.body.records_per_page * (req.body.page_number-1);
    let showTo = req.body.records_per_page;
    sortColumn = req.body?.sortColumn;
    sortType = req.body?.sort;

    const selectInvoiceStatus = `SELECT * FROM documents_order_send ds 
    INNER JOIN companyregistered c ON ds.fk_companyregistered = c.cid
    WHERE c.rk_party = $1`;
    const invoiceList = await bexioPool.query(selectInvoiceStatus, [partyId]);


    const getNetcomIdQry = `SELECT * FROM  companyregistered 
    WHERE rk_party = $1`;
    const getNetcomId = await bexioPool.query(getNetcomIdQry, [partyId]);
    console.log('partyId',partyId);

    console.log('getNetcomIdQry',getNetcomIdQry);
    console.log('getNetcomId',getNetcomId.rows[0].netcomid);

    // NEW

    const getInviteCompanyIdQry = `SELECT array_agg(pa.cid) AS cid FROM
    party_account pa
    WHERE pa.fk_party = $1`
    let getInviteCompanyId = await pool.query(getInviteCompanyIdQry,[partyId]);
  
  console.log('getInviteCompanyId.rows[0].cid',getInviteCompanyId.rows[0].cid);
  
    const getConnectionStatus = `SELECT  array_agg(rk_businessconnection) AS bcConnection FROM
      contact_bc cb
      WHERE cb.rk_party_account IN(${getInviteCompanyId.rows[0].cid})
      AND type = 'EDI'
      AND rk_businessconnection IS NOT NULL`
    let getConnectionStatusList = await bexioPool.query(getConnectionStatus);
    // console.log('getConnectionStatusList.rows[0].bcConnection',getConnectionStatusList.rows[0].bcconnection);
    // console.log('invoiceList.rows[0].netcomid',invoiceList.rows[0].netcomid);
    console.log('bcDetails12121222');
    let bcDetails;
    bcDetails = await getBcDetails(getConnectionStatusList.rows[0].bcconnection,getNetcomId.rows[0].netcomid);

    console.log('bcDetails12121222',bcDetails['data']);
    let tempBc = [];
    // tempBc.push([0]['bc_id']);

    // tempBc.push(bcDetails['data'].filter((e,idx) => (e['company_details']['doc_type']['data'] == 'Invoice')[idx]['bc_id']))

    // console.log('tempBc',tempBc);
    tempBc.push(0);
    if(bcDetails){
      for (let index = 0; index < bcDetails['data'].length; index++) {
        const element = bcDetails['data'][index];
        if(element['company_details']['doc_type']['data'] == 'Order'){
          tempBc.push(element['bc_id'])
        }
        
      }
    }
 
    console.log('tempBc',tempBc);
    
    const getConnectionBcQry = `SELECT  array_agg(rk_sendercontactid) FROM
      contact_bc cb
      WHERE cb.rk_party_account IN(${getInviteCompanyId.rows[0].cid})
      AND type = 'EDI'
      AND rk_businessconnection IN(${tempBc})
      AND rk_businessconnection IS NOT NULL`
    console.log('getConnectionBc',getConnectionBcQry);

    let getConnectionBc = await bexioPool.query(getConnectionBcQry);
    console.log('getConnectionBc',getConnectionBc.rows);
   
    let resultArray = getConnectionBc.rows[0].array_agg;
    if(isBexioUser)
    {
    
      let options;
 

      if(data['documentNo'] != '' || data['invoiceTitle'] != '' || data['dateFrom'] != '' || data['dateTo'] != '' || data['comapnyUser'] != '' || data['invoiceStatus'] == 'Yes' || data['invoiceStatus'] == 'No')
      {
        const getSendInvoiceQry = `SELECT array_agg(rk_order) AS invoiceId FROM documents_order_send ds
        INNER JOIN companyregistered c ON c.cid = ds.fk_companyregistered
        WHERE c.rk_party = ${partyId}
        AND ds.status = 2`
        let getSendInvoiceList = await bexioPool.query(getSendInvoiceQry);
        console.log("getSendInvoiceQry",getSendInvoiceList.rows[0].invoiceid);

        let searchJson = [];
         
        if(data['documentNo'] != '' && data['documentNo']){
          searchJson.push({
            "field":"document_nr",
            "value": data.documentNo,
            "criteria":"like"
          })
        }
        if(data['invoiceTitle'] != '' && data['invoiceTitle']){
          searchJson.push({
            "field":"title",
            "value":data.invoiceTitle,
            "criteria":"like"
          })
        }
       
        if( data['dateFrom'] != "" && data['dateFrom']){
          searchJson.push({
            "field":"is_valid_from",
            "value" :new Date(data.dateFrom),
            "criteria":">="
          })
        }
        if( data['dateTo'] != "" && data['dateTo']){
          searchJson.push({
            "field":"is_valid_from",
            "value":new Date(data.dateTo),
            "criteria":"<="
          })
        }
        if(data['comapnyUser'] != '' && data['comapnyUser']){


          searchJson.push({
            "field":"user_id",
            "value":data.comapnyUser,
            "criteria":"="
          })
        }
        if(data['invoiceStatus'] == 'Yes'){

          console.log('typeof',resultArray==null);
          
          searchJson.push(
            {
            "field":"contact_id",
            "value":resultArray==null ? "" : resultArray,
            "criteria":"in"
          },
          {
            "field":"id",
            "value":getSendInvoiceList.rows[0].invoiceid ? getSendInvoiceList.rows[0].invoiceid : "",
            "criteria":"in"
          })
        }
        if(data['invoiceStatus'] == 'No'){
          
          searchJson.push({
            "field":"contact_id",
            "value":resultArray==null ? "" : resultArray,
            "criteria":"in"
          },
          {
            "field":"id",
            "value":getSendInvoiceList.rows[0].invoiceid ? getSendInvoiceList.rows[0].invoiceid : "",
            "criteria":"not_in"
          })
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
      
        console.log('totalCount',options);
        console.log('totalCount',totalCount);
      
        // totalCount = await  contactListCountSearch(accessToken,0,2000);

      }
      else{
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
        if(response.statusCode != 200)
        return res.status(200).json({
          status: true,
          status_code : response.statusCode,
          data: [],
          message: 'unauthorized',
        });
        //'url': `${config.BEXIO_API}2.0/kb_invoice?order_by=updated_at_desc`,
        let status = JSON.parse(config.BEXIO_PURCHASE_ORDER_STATUS);
        let contact_idList = [];
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
          for(let qryInvoice in invoiceList.rows ){
              if(invoiceList.rows[qryInvoice]['rk_order'] == resData[invoice]['id']){
                resData[invoice]['rk_globaltransaction'] = invoiceList.rows[qryInvoice]['rk_globaltransaction'];
                resData[invoice]['status'] = invoiceList.rows[qryInvoice]['status'];
                resData[invoice]['statusLabelInvoice'] = JSON.parse(config.INVOICE_STATUS)[invoiceList.rows[qryInvoice]['status']];
                resData[invoice]['timestamp'] = invoiceList.rows[qryInvoice]['timestamp'];
                resData[invoice]['type'] = invoiceList.rows[qryInvoice]['type'];
                if(invoiceList.rows[qryInvoice]['status'] == 2)
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
        await redisClient.setex(redisKey,24*60*60*2,JSON.stringify({
          status: 200,
          data:resData,
          totalCount:totalCount
        } ));
        
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
  
    logs.action = 'GET_ORDER';
    logs.level = 'ERROR';
    logs.item = 'EDI';
    // //addlogs(logs,data.rolePartyId,data.roleAccId);
    console.log(error);
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+cookie;
    warningMessage(commonErrors,error);
    return res
    .status(200)
    .json({ status: 500, message: 'something_went_wrong' });
      
  }
}
// const getOrderList = async (req,res)=>{
//   let cookie = null
//   let data = req.body;
//   const pool = await connectPostgres;
//   try {
//     cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
//     let accessToken = cookie.access_Token;
//     let isBexioUser = cookie.isBexioUser;

//     let contacts;
//     let showTo:number;
//     let showFrom:number = parseInt(data.records_per_page)*(parseInt(data.page_number)-1) + 1;
//     showTo = showFrom + parseInt(data.records_per_page) - 1;

//     console.log('showFrom',showFrom);
//     console.log('showTo',showTo);

    

//     if(isBexioUser)
//     {
//       let bexioPool = await postgresBexio;
//       let g2bPool = await postgresGate2b;
//       var options = {
//         'method': 'GET',
//         'url': `${config.BEXIO_API}2.0/contact`,
//         'headers': {
//           'Accept': 'application/json',
//           'Authorization': 'Bearer '+accessToken
//         }
//       };
//       request(options, async function (error, response) {
//         if (error){
//           console.log(error);
//           commonErrors['errorTitle'] = req.originalUrl;
//           commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+accessToken;
//           warningMessage(commonErrors,error);
//             return res.status(200).json({
//               status: false,
//               message: 'something_went_wrong',
//            });

//           } 
//           if(response.statusCode != 200)
//           {
//             return res.status(200).json({
//               data:[],
//               totalCount:0
//           });
//           }
//           contacts = JSON.parse(response.body);
          
//           const getRegisteredIdQry = `SELECT cid FROM 
//           companyregistered WHERE rk_party = $1`
//           const getRegisteredId = await bexioPool.query(getRegisteredIdQry,[data.partyId]);

//           // const getBcQry = `SELECT array_agg(rk_businessconnection) AS businessconnection FROM documents_invoice_receive
//           // WHERE fk_companyregistered = $1 
//           //   AND rk_businessconnection IS NOT NULL`

//           // const getBc = await bexioPool.query(getBcQry,[getRegisteredId.rows[0].cid]);
          
//           const getSenderIdQry = `SELECT l.companyname,gc."netcomId",json_extract_path("ot_updator"::json,'in_custom_id') as sender_custom_id,* 
//           FROM g2b_business_connections bc 
//             INNER JOIN g2b_connections gc ON gc.id = bc."FK_g2b_connections_IN"
//             INNER JOIN ediparty e ON gc."netcomId" = e.netcomid
//             INNER JOIN legalParty l ON l.fk_ediparty = e.cid
//           WHERE bc.id = $1`
//           // const getSenderId = await g2bPool.query(getSenderIdQry);
//           // let bcResult = await getBcDetails(getInviteCompanyBcResult.rows[0].cid,dataCookie.netcomId);
//           const orderListQry = `SELECT  *  
//           FROM(
//             SELECT *,ROW_NUMBER() OVER(ORDER BY createddate desc) AS row_number 
//             FROM documents_order_receive dor
//           WHERE fk_companyregistered = $1
//           ` + (data.dateFrom ? `AND date(dor.createddate) >= '${data.dateFrom}'` : '') + `
//           ` + (data.dateTo ? `AND date(dor.createddate) <= '${data.dateTo}'` : '') + `
//           ` + (data.documentNo ? `AND LOWER(dor.rk_order) LIKE LOWER('%${(data.documentNo)}%')` : '') + `
//           ` + (data.orderStatus == "Yes" ? ` AND rk_order IS NOT NULL` : '') +`
//           ` + (data.orderStatus == "No" ? ` AND rk_order IS NULL` : '') +`

//             ) AS tmpQry
//             WHERE row_number BETWEEN $2
//             AND $3`
//           console.log('orderListQry',orderListQry);

//           const orderList = await bexioPool.query(orderListQry,[getRegisteredId.rows[0].cid,showFrom,showTo]);
          
//           // const inviteCompanyDelete = `
//           //   SELECT *,ROW_NUMBER() OVER(ORDER BY rk_invoice desc) AS row_number 
//           //   FROM documents_invoice_receive 
//           // WHERE fk_companyregistered = $1
//           //   `
//           //   const orderList = await bexioPool.query(inviteCompanyDelete,[getRegisteredId.rows[0].cid]);
//           const getorderCount = `
//             SELECT count(cid) AS total
//             FROM documents_order_receive dor
//           WHERE fk_companyregistered = $1
//           ` + (data.dateFrom ? `AND date(dor.createddate) >= '${data.dateFrom}'` : '') + `
//           ` + (data.dateTo ? `AND date(dor.createddate) <= '${data.dateTo}'` : '') + `
//           ` + (data.documentNo ? `AND LOWER(dor.rk_order) LIKE LOWER('%${(data.documentNo)}%')` : '') + `
//           ` + (data.orderStatus == "Yes" ? ` AND rk_order IS NOT NULL` : '') +`
//           ` + (data.orderStatus == "No" ? ` AND rk_order IS NULL` : '') +``
          
//           const orderListCount = await bexioPool.query(getorderCount,[getRegisteredId.rows[0].cid]);
//           console.log(orderListCount.rows[0].total);

//           for (let index = 0; index < orderList.rows.length; index++) {
//             const element = orderList.rows[index];
//             element['companyName'] = '';
//             element['netcomId'] = '';
//             const getBc = await g2bPool.query(getSenderIdQry,[element.rk_businessconnection]);
           
//             if(getBc.rows.length != 0)
//             {
//               element['companyName'] = getBc.rows[0].companyname;
//               element['netcomId'] = getBc.rows[0].netcomId;
//               if(!element['rk_order'])
//               {
//                 let temp = contacts.filter(e => e.id == getBc.rows[0].sender_custom_id);
//                 element['contactName'] = temp.length != 0 ? temp[0].name_1:'';
//                 element['contactId'] = temp.length != 0 ? getBc.rows[0].sender_custom_id:'';
//                 element['connectioStatus'] = 'active';
//               }else{
//                 element['contactId'] = '';
//                 let temp = contacts.filter(e => e.id == getBc.rows[0].sender_custom_id);
//                 element['contactName'] = temp.length != 0 ? temp[0].name_1:'';
//                 element['connectioStatus'] = 'done';
//               }
             
//             }else{
//               element['contactId'] = '';
//               element['contactName'] ='';
//               element['connectioStatus'] ='';

//             }
//           } 
//         res.send({
//             status: 200,
//             data:orderList.rows,
//             totalCount:orderListCount.rows[0].total
//         })
//       // res.send(orderList.rows);
//       });

//     }else{
//       return res.status(401).json({
//         status: 'fail',
//         message: 'unauthorized',
//     });
//     }
   
//   } catch (error) {
 
//     logs.action = 'GET_ORDER';
//     logs.level = 'ERROR';
//     logs.item = 'EDI';
//     // //addlogs(logs,data.rolePartyId,data.roleAccId);
//     console.log(error);
//     commonErrors['errorTitle'] = req.originalUrl;
//     commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+cookie;
//     warningMessage(commonErrors,error);
//     return res
//     .status(200)
//     .json({ status: 500, message: 'something_went_wrong' });
      
//   }
// }
const getOrderForOpenTrans = async( req, res) => {
  let cookie = null;
  let decryptData = null;
  let orderCId;
  decryptData = req.body;
  const pool = await connectPostgres;
  const data = req.body;
  try {
    let order,paymentType;
    cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
    let accessToken = cookie.access_Token;
    const partyId = decryptData.partyId;
    const accountId = decryptData.accountId;
    const orderData = JSON.parse(decryptData.orderItems);
    const orderId = orderData.orderId|| '';
    order = await getOrderOT(accessToken,orderId); // Get order from bexio using orderId

    if( !order){ // If there is no order with this orderId, return with error
      res.send({
        status_code: 500,
        message: 'order not found',
        status: false
      });
      return
    }
    console.log("order from getOrderOT", JSON.stringify(order));
    
    
    let invitationData = await getConnectionDetails(partyId,accountId,order.contact_id,req); // Get the connection details using contact_id, party and account
    console.log("invitationData: ",invitationData[0]);
    console.log({
      partyId,
      accountId,
      "order.contact_id":order.contact_id
    });
    let customerIds = await constGetContactId(invitationData[0].rk_businessconnection); // Get customer Id using businessConnection
    console.log("customerIds: ",customerIds);

    if( invitationData != undefined){ // If there is any invitationData then do
      let pdf,fileName,pdfContent;
      // pdf = await getOrderPdf(accessToken,orderId); // Fetch pdf file for order from bexio.

      // if( !pdf ){ // If there is no pdf, return with error
      //   res.send({
      //     status_code: 500,
      //     message: 'order not found',
      //     status: false
      //   });
      //   return;
      // }
      
      // pdfContent = JSON.parse(pdf).content; // Assign pdf content.
      // fileName = JSON.parse(pdf).name; // Assign pdf name.

      /* Fetch country data from bexio using accessToken */
      let countryList;
      countryList = await getCountryLists(accessToken);

      if( !countryList ){ // If country list not found, return with error.
        res.send({
          status_code: 500,
          message: 'country not found',
          status: false
        });
      }

      /* Fetch Bank Details */
      // let bank;
      // bank = await getBank(accessToken,order.bank_account_id);
      // if( !bank){
      //   commonErrors['errorTitle'] = req.originalUrl;
      //   commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'bank_not_found -req param,',JSON.stringify(req.body);
      //   warningMessage(commonErrors,'bank_not_found');
      //   res.send({
      //     status_code: 500,
      //     message: 'something_went_wrong',
      //     status: false,      
      //   });
      //   return
      // }
      // console.log("bank :: ",bank);
      
      // if('iban_nr' in bank){
      //   order['bank'] = bank;
      // }
      // else{
      //   res.send({
      //     status_code: 500,
      //     message: 'bexio_bank_error',
      //     status: false,
      //   });
      //   return
      // }

      console.log("order.currency_id :: ",order.currency_id);
      /* Fetch currency from bexio using id. */
      let currency = await getCurrency(accessToken,order.currency_id);
      if( !currency ){
        res.send({
          status_code: 500,
          message: 'currency issue',
          status: false,
      
        });
        return
      }
      order['currency'] = currency;

      /* Get user details from access token */
      let temp = await getloginUserCompanyDetails(accessToken);
      if( !temp ){
        res.send({
          status_code: 500,
          message: 'no user',
          status: false,
        });
        return;
      }
      order['companyProfile'] = temp;
      order['companyProfile'] = JSON.parse(order['companyProfile']);
      /* Fetch payment type from order */
      paymentType = await getPaymentType(accessToken,order.payment_type_id);
      if(!paymentType){
        res.send({
          status_code: 500,
          message: 'payment_type_issue',
          status: false,
        });
        return;
      }

      let tempPaymentType = paymentType.filter(e => e.id == order.payment_type_id);
      order['paymentType'] = tempPaymentType;

      /* Fetch contact using contact id from order */
      let contact = await getContact(accessToken,order.contact_id);
      if(!contact){
        res.send({
          status_code: 500,
          message: 'contact_issue',
          status: false,
        });
        return;
      }
      order['contact'] = contact;
      let user = true;
      if(!user){
        res.send({
          status_code: 500,
          message: 'user_issue',
          status: false,
        });
        return;
      }
      order['user'] = user;

      /* Loop over positions in order */
      console.log('order',order);
      let taxIsAdded = false;
      for (const items of order.positions.required) {
        console.log('items.tax_id',items.tax_id);
        if(items.tax_id){ // Check tax is there or not
          /* Fetch tax using tax id */
          let tempTax = await getTaxs(accessToken,items.tax_id);
          console.log('taxxxxxx',tempTax);
          taxIsAdded = true;
          if(!tempTax){
            res.send({
              status_code: 500,
              message: 'tax_issue',
              status: false,
            });
            return;
          }
          items['tax'] = tempTax;
        }
        let tempItem;
        if('article_id' in items){
          /* fetch product details */
          console.log('itemsitemsitems',items);
          
          tempItem = await getProducts(accessToken,items.article_id);
          console.log('tempItemtempItemtempItem',tempItem);
          
          items['article'] = tempItem;
        }
        else{
          items['article'] = {}
          items['article']['article_id'] = items.id;
          items['article']['amount'] = items.amount;
          items['article']['intern_name'] = items.text;
          items['article']['intern_description'] = items.text;
        }
      }

      orderCId = await setOrderSendStatus(partyId,orderId,order['document_nr'],'1');

      /* Create XML from data */
      let xml;
      console.log('invitationDatainvitationDatainvitationData',invitationData);
      
      xml = await setOrderToOt(order,countryList,invitationData[0],pdfContent,fileName,customerIds,orderCId,taxIsAdded);
      console.log('xmlll',xml);
      
      if( xml == false){
        res.send({
          status_code: 500,
          message: 'bexio_item_error',
          status: false,
        });
        return;
      }
      await invoiceFilePush(invitationData[0].rk_netcomidsender,'WS',xml,order['document_nr'],'EDI');
      let redisKey = req.body.partyId+"_/";
      await deleteRedis(req.url.substr(1,req.url.length),redisKey);
      res.send({
        status_code: 200,
        message: '',
        status: true,
      });
      logs.action = 'ORDER_FOR_OPEN_TRANSACTION';
      logs.level = 'NOTIFICATION';
      logs.item = 'EDI';
      // //addlogs(logs,data.rolePartyId,data.roleAccId);
    }
    else{
      res.send({
        status_code: 500,
        message: 'invoice_push_error',
        status: false,
      });
    }
    
    /* Log */

    logs.action = 'ORDER_FOR_OPEN_TRANSACTION';
    logs.level = 'NOTIFICATION';
    logs.item = 'EDI';
    //addlogs(logs,partyId,accountId);
    
  } catch (error) {
    logs.action = 'ORDER_FOR_OPEN_TRANSACTION';
    logs.level = 'ERROR';
    logs.item = 'EDI';
    //addlogs(logs,decryptData.partyId,decryptData.accountId);
     console.log('error',error);
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+decryptData;
    warningMessage(commonErrors,error);
    res.send({
      status_code: 500,
      message: '',
      status: false,
    });
  }
}
/* Fetch order details from bexio using orderId */
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
/* Get pdf file related to order from bexio using orderId */
const getOrderPdf = async( accessToken,orderId) => {
  try {
    return new Promise( async( resolve, reject) => {
      var options = {
        'method': 'GET',
        'url': `https://api.bexio.com/2.0/kb_order/${orderId}/pdf`,
        'headers': {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
          }
      };
  
      request( options, function( error, respons){
        if(error){
          commonErrors['errorTitle'] = 'getOrderPdf';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+orderId;
          warningMessage(commonErrors,error);
          resolve(error);
        }
        if( respons.statusCode == 200){
          resolve(respons.body);
        }
        else{
          resolve(false);
        }
      })
    });
  } catch (error) {
    commonErrors['errorTitle'] = 'getOrderPdf';
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+orderId;
    warningMessage(commonErrors,error);
    return;
  }
  
}

/* Create OT using order and related details with a template. */
const setOrderToOt = async(order,coutryList,contactDetails,pdf,fileName,customerIds,orderId,taxIsAdded)=>{
  // console.log({
  //   order,coutryList,contactDetails,fileName,customerIds,orderId
  // });
  
  let deliveryAddress = {};
  // Normal split and replace is not working 
  let tempString = JSON.stringify(order.delivery_address_manual)
  let tempArray = "";
  console.log("tempString",tempString);

  
  if(tempString.indexOf("\\r\\n") != -1)
  {
    tempArray = tempString.substring(1, tempString.length-1).replace(/\\r\\n/g, "___________");
  }
  else if(tempString.indexOf("\\n") != -1)
  {
    tempArray = tempString.substring(1, tempString.length-1).replace(/\\n/g, "___________");
  }
  else if(tempString.indexOf("\\r") != -1)
  {
    tempArray = tempString.substring(1, tempString.length-1).replace(/\\r/g, "___________");
  }
  else{
    tempArray = tempString;
  }

  console.log('tempArray',tempArray);
  let deliveryAddress2 = tempArray.split("___________");
  console.log("deliveryAddress2",deliveryAddress2);
  
  let tempAdress = deliveryAddress2.filter((e)=>e.length!=0);
  console.log('tempAdress',tempAdress);
  if(tempAdress.length == 4){
    tempAdress.splice(1,0," ")
  }

  console.log('tempAdresstempAdress',tempAdress);
  let countryCode = tempAdress[5] ? coutryList.filter(coutry => coutry.name ==  tempAdress[5].replace(/\n/g, "").replace(/\r/g, "").trim())[0]?.iso_3166_alpha2 : ''

  // return
  


  coutryList = JSON.parse(coutryList);
  console.log("gghghgh");
  let emptyValue = 'NA'
  // let taxIsAdded;
  let priceQuantity = '1'



  let orderUnit = {
    'Stk':'C62',
    'h':'HUR'
  }
  let obj = {
    "OPENTRANS": {
      "$": {
        "xmlns:iomarket": "http://tempuri.org/io-market/openTRANS_UDX",
        "xmlns:bmecat": "http://www.bmecat.org/bmecat/2005",
        "xmlns": "http://www.opentrans.org/XMLSchema/2.1"
      },
      "ORDER": [{
        "$": {
          "version": "2.1",
          "type":"release"
        },
        "ORDER_HEADER": [{
          "CONTROL_INFO":[],
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
  // taxIsAdded = order.taxs.length;
  console.log("\ntaxIsAdded:: "+taxIsAdded);
  
  // obj.OPENTRANS.ORDER[0]['ORDER_HEADER'][0]['CONTROL_INFO'].push(JSON.parse(JSON.stringify({
  //   "GENERATOR_INFO":"SAPLEP",
  //   "GENERATION_DATE": new Date(order.updated_at).toISOString(),
  // })))
  console.log('contactDetailscontactDetailscontactDetails',contactDetails);
    
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
          "PARTY_ROLE":"buyer",
          "ADDRESS": [{
            "bmecat:NAME": order.companyProfile[0].name?order.companyProfile[0].name:undefined,
            "bmecat:STREET": order.companyProfile[0].address?order.companyProfile[0].address:undefined,
            "bmecat:ZIP": order.companyProfile[0].postcode?order.companyProfile[0].postcode:undefined,
            "bmecat:CITY": order.companyProfile[0].city?order.companyProfile[0].city:undefined,
            "bmecat:COUNTRY_CODED":coutryList.filter(coutry => coutry.name == order.companyProfile[0].country_name)[0].iso_3166_alpha2
          }]
        },{
          "bmecat:PARTY_ID": [{
            "_": contactDetails.rk_netcomidreceived,
            "$": {
              "type": "buyer_specific"
            }
          }],
          "PARTY_ROLE":"supplier",
          "ADDRESS": [{
            "bmecat:NAME": order.contact.name_1,
            "bmecat:NAME2": order.contact.name_2?order.contact.name_2:undefined,

            // "CONTACT_DETAILS": [{
            //     "bmecat:CONTACT_NAME": invoice.contact.name_1,
            //     "bmecat:FIRST_NAME": invoice.contact.name_1,
            //     "bmecat:EMAILS": [{
            //         "bmecat:EMAIL": invitionData.receiveremail
            //     }]
            // }],
            "bmecat:STREET": order.contact.address?order.contact.address:undefined,
            "bmecat:ZIP": order.contact.postcode?order.contact.postcode:undefined, //NOT IN BEXIO CONTACTS - REMOVED 
            "bmecat:CITY": order.contact.city?order.contact.city:undefined,
            // "bmecat:COUNTRY": invoice.contact.country_id?coutryList.filter(coutry => coutry.id == invoice.contact.country_id)[0].name:undefined,
            "bmecat:COUNTRY_CODED": order.contact.country_id?coutryList.filter(coutry => coutry.id == order.contact.country_id)[0].iso_3166_alpha2:undefined
        }]
        },{
          "bmecat:PARTY_ID": [{
            "_": contactDetails.rk_netcomidsender,
            "$": {
              "type": "buyer_specific"
            }
          }],
          "PARTY_ROLE":"final_delivery",
          "ADDRESS": [{
            "bmecat:NAME": tempAdress[0]?.trim() ? tempAdress[0]?.replace(/\n/g, "")?.replace(/\r/g, "").trim() : undefined,
            "bmecat:NAME2": tempAdress[1]?.trim() ? tempAdress[1]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined,
            "bmecat:STREET":  tempAdress[2]?.trim() ? tempAdress[2]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined,
            "bmecat:ZIP":  tempAdress[3]?.trim() ? tempAdress[3]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined,
            "bmecat:CITY":  tempAdress[4]?.trim() ? tempAdress[4]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined,
            "bmecat:COUNTRY_CODED": countryCode ? countryCode : undefined
          }]
        }]
      }],
      "ORDER_PARTIES_REFERENCE":[{
        "bmecat:BUYER_IDREF": contactDetails.sendercustomerid,
        "bmecat:SUPPLIER_IDREF":contactDetails.receivercustomerid
      }],
      "bmecat:CURRENCY":order.currency['name'],
      "REMARKS": order.title ? order.title : undefined,
      "HEADER_UDX": customerIds.length != 0 || orderId ? [{
        "HEADER_UDX_OPT":[{
          "BEX_ORDER_DOCUMENT_ID": orderId ? orderId : undefined
        }],
        "SENDER_CUSTOM_ID_1": customerIds[0]?.senderid ? customerIds[0].senderid:undefined,
        "RECEIVER_CUSTOM_ID_1": customerIds[0]?.receiverid? customerIds[0].receiverid:undefined
      }]:undefined
    })
  ));
  // console.log(JSON.stringify(obj.OPENTRANS));
  console.log("-----------------------------------------------------------");
  let allTax = [];
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
  
  console.log("order.positions",order.positions.required)
  for (let index = 0; index < order.positions.required.length; index++) {
    let element = order.positions.required[index];
    delete element.internal_pos
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    console.log(JSON.stringify(element));    
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    console.log("....... :: "+element.tax?.value);
    
    totalAmount = parseFloat(totalAmount) + parseFloat(element.position_total);
    let arr,status = true;
    console.log('element.articleelement.article',element);
    
    obj.OPENTRANS.ORDER[0]['ORDER_ITEM_LIST'][0]['ORDER_ITEM'].push(JSON.parse(JSON.stringify({
      "LINE_ITEM_ID": element.pos?element.pos:index,
      "PRODUCT_ID": [{
        "bmecat:SUPPLIER_PID": element.article?.article_id?element.article.article_id:element.article.id,
        ...(element.article.id
          ? {
              "bmecat:INTERNATIONAL_PID": {
                "_": element.article.id,
                "$": {
                  "type": "ean"
                }
              }
            }
          : {}),
        "bmecat:DESCRIPTION_SHORT": element.article.intern_name?element.article.intern_name.substring(0, 145):undefined, // product id mandatory field so just added intername as description short
        "bmecat:DESCRIPTION_LONG": element.article.intern_description? element.article.intern_description:undefined
    }],
      "QUANTITY": element.article.amount?element.article.amount:element.amount,
      "bmecat:ORDER_UNIT":orderUnit[element.unit_name]?orderUnit[element.unit_name]:'CT',
      "PRODUCT_PRICE_FIX" : [JSON.parse(JSON.stringify({
        "bmecat:PRICE_AMOUNT": element.unit_price == null ? 0.00 : parseFloat(element.unit_price).toFixed(2),
        "TAX_DETAILS_FIX":element.tax?.value&&taxIsAdded? [{
          "bmecat:TAX": element.tax?.value
          // "TAX_AMOUNT": element.tax_value
        }]:undefined,
      }))],
      "PRICE_LINE_AMOUNT": element.position_total? parseFloat(element.position_total).toFixed(2) : 0.00
    })))
  }
  obj.OPENTRANS['ORDER'][0]['ORDER_SUMMARY'].push(JSON.parse(JSON.stringify({
    "TOTAL_ITEM_NUM" : order.positions.required.length,
    "TOTAL_AMOUNT": parseFloat(order.positions.total).toFixed(2)
  })))
  // return

  let builder = new xml2js.Builder({'xmldec.version':1.0} );
  console.log("JSON.stringify(obj):: ",JSON.stringify(obj))
  var xml = builder.buildObject(obj);
  console.log("xml:  ---------------------------\n",xml);
  return Buffer.from(xml).toString('base64');
}

/* Set status for order */
const setOrderSendStatus = async (partyId,orderId,ordernumber,status,error?) => {
  let sendOrderId = '';
  return new Promise( async function (resolve, reject) {
    const bexioPool = await postgresBexio;
    const pool = await connectPostgres;
    const responseBody = error || '';
    try {
      console.log('555555555555555555555555555');
      
      bexioPool.query('begin');
      const selectQry = `SELECT c.cid,ds.cid as ordersendid FROM documents_order_send ds 
        INNER JOIN companyregistered c ON ds.fk_companyregistered = c.cid
        WHERE c.rk_party = $1
        AND rk_order = $2
        AND ds.ordertype = 'EDI'`;
      const selectQryResult = await bexioPool.query(selectQry,[partyId,orderId]);
      let insertQry;
      if(selectQryResult.rows.length == 0){
        console.log('ifffffffffffff');
        
        const selectQry = `SELECT * FROM companyregistered
              WHERE rk_party = $1`;
        const selectQryResult = await bexioPool.query(selectQry,[partyId]);
        insertQry =`INSERT INTO 
            documents_order_send
              (rk_order,ordernumber,fk_companyregistered,ordertype,status)
            VALUES
              ($1,$2,$3,$4,$5)
              RETURNING cid`
        let result = await bexioPool.query(insertQry,[orderId,ordernumber,selectQryResult.rows[0].cid,'EDI',status]);
        console.log(result);

        sendOrderId = result.rows[0].cid;
      }
      else{
        console.log('elseeeeeeeeeee');

        sendOrderId = selectQryResult.rows[0].ordersendid;
        let updateQry =`UPDATE 
          documents_order_send
              SET timestamp = NOW(),
              status = $3
            WHERE fk_companyregistered = $1
              AND rk_order = $2
              AND ordertype='EDI'`;
              console.log(selectQryResult.rows[0].cid);
              console.log(orderId);
              console.log(status);
              
        await bexioPool.query(updateQry,[selectQryResult.rows[0].cid,orderId,status]);
      }
      bexioPool.query('COMMIT', err => {
        if (err) {
          console.error('Error committing transaction')
        }
      });
      resolve(sendOrderId);
    } catch (error) {
      bexioPool.query('ROLLBACK', err => {
        if (err) {
          console.error('Error committing transaction')
        }
      })
      console.log(error);
      commonErrors['errorTitle'] = setInvoiceSendStatus.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+partyId+'-partyId'+orderId+'-orderId'+ordernumber+'orderNumber';
      warningMessage(commonErrors,error);
      resolve('');
    }
  });

}

const getPurchaseOrders = async (req,res)=>{ // List order for purchase.
  let cookie = null
  let data = req.body
  let partyId = req.body.partyId;
  const pool = await connectPostgres;
  try {
    cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
    let accessToken = cookie.access_Token;
    let isBexioUser = cookie.isBexioUser;
    const bexioPool = await postgresBexio;
    let resultData = [],tempStatus = false;
    let totalCount
    let showFrom = req.body.records_per_page * (req.body.page_number-1);
    let showTo = req.body.records_per_page;

    const selectOrderStatus = `SELECT * FROM documents_order_send ds 
    INNER JOIN companyregistered c ON ds.fk_companyregistered = c.cid
    WHERE c.rk_party = $1 AND ds.ordertype = 'EDI'`;
    const orderList = await bexioPool.query(selectOrderStatus, [partyId]);
    
    // NEW
    const getInviteCompanyIdQry = `SELECT array_agg(pa.cid) AS cid FROM
    party_account pa
    WHERE pa.fk_party = $1`
    let getInviteCompanyId = await pool.query(getInviteCompanyIdQry,[partyId]);
  
    const getConnectionStatus = `SELECT  array_agg(rk_businessconnection) AS bcConnection  FROM
      contact_bc cb
      WHERE cb.rk_party_account IN(${getInviteCompanyId.rows[0].cid})
      AND type = 'EDI'
      AND rk_businessconnection IS NOT NULL`
    let getConnectionStatusList = await bexioPool.query(getConnectionStatus);
    console.log("getConnectionStatusList.rows[0] :: ",getConnectionStatusList.rows[0]);
    
    let bcDetails = await getBcDetails(getConnectionStatusList.rows[0].bcconnection,orderList.rows[0].netcomid);
    
    let tempBc = [];
    tempBc.push(0);
    // List only orders with bcconnections.
    tempBc = bcDetails['data'].filter(obj => obj['company_details']['doc_type']['data'] === 'Order').map(obj => obj.bc_id);
    tempBc.length == 0 ? tempBc.push(0) : '';
    const getConnectionBcQry = `SELECT  array_agg(rk_sendercontactid) FROM
      contact_bc cb
      WHERE cb.rk_party_account IN(${getInviteCompanyId.rows[0].cid})
      AND type = 'EDI'
      AND rk_businessconnection IN(${tempBc})
      AND rk_businessconnection IS NOT NULL`;

    let getConnectionBc = await bexioPool.query(getConnectionBcQry);
    let resultArray = getConnectionBc.rows[0].array_agg;
    
    if(isBexioUser){
      totalCount = await orderListCountSearch(accessToken,0,2000);
      var options = {
        'method': 'GET',
        // 'url': `${config.BEXIO_API}2.0/kb_order`,
        'url': `${config.BEXIO_API}2.0/kb_order/?limit=${showTo}&offset=${showFrom}&order_by=updated_at_desc`,
        'headers': {
          'Accept': 'application/json',
          'Authorization': 'Bearer '+accessToken
        }
      };
      request(options, async function (error, response) { // Fetch all order from bexio.
        if (error){
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+showTo+' '+showFrom;
          warningMessage(commonErrors,error);
          return res.status(200).json({
            status: false,
            message: 'something_went_wrong',
          });
        }
        let resData = JSON.parse(response.body);
        if(response.statusCode != 200)
        return res.status(401).json({
          status: false,
          message: 'unauthorized',
        });
        //'url': `${config.BEXIO_API}2.0/kb_order?order_by=updated_at_desc`,
        let status = JSON.parse(config.BEXIO_ITEM_STATUS);
        for (let order in resData) {
        tempStatus = false;
        resData[order]['allowSend'] = false;
        resultArray?resData[order]['allowSend'] = resultArray.includes((resData[order].contact_id).toString()) ? true:false:false;
        console.log("resData[order]['allowSend'] :: ",resData[order]['allowSend']);
        
        resData[order]['statusLabel'] = status[resData[order].kb_item_status_id];
        resData[order]['timestamp'] = '';
        resData[order]['companyName'] = resData[order]['contact_address'].split("\n")[0];
        resData[order]['rk_globaltransaction'] = '';
        resData[order]['status'] = '';
        resData[order]['statusLabelOrder'] = '';        
        for(let qryOrder in orderList.rows )
          {
            if(orderList.rows[qryOrder]['rk_order'] == resData[order]['id'])
            {
              resData[order]['rk_globaltransaction'] = orderList.rows[qryOrder]['rk_globaltransaction'];
              resData[order]['status'] = orderList.rows[qryOrder]['status'];
              resData[order]['statusLabelOrder'] = JSON.parse(config.INVOICE_STATUS)[orderList.rows[qryOrder]['status']];
              resData[order]['timestamp'] = orderList.rows[qryOrder]['timestamp'];
              resData[order]['type'] = orderList.rows[qryOrder]['type'];

              if(orderList.rows[qryOrder]['status'] == 2)
              {
                resData[order]['allowSend'] = false;
              }
              if(!tempStatus && orderList.rows[qryOrder]['type'] == 'EBILL'){
                tempStatus = true;
              }
              break;
          }
          // else
            // resultData.push(resData[order]);
          }
          if(!tempStatus)
          {
            // console.log('12332145',resData[order]);
            
            resData[order]['isEbill'] = false;
          }else{
            resData[order]['isEbill'] = true;
            resData[order]['allowSend'] = false;

          }
          resultData.push(resData[order]);
          console.log("order :: ",JSON.stringify(resData[order]));
          console.log("------------------------------------\n");
        }
        // res.send(JSON.stringify(resData));
        // res.send(resData)
        let keys = Object.keys(req.body)
        // let redisKey = req.url+"_"+req.body.partyId+"_";
        let redisKey = req.body.partyId+"_"+req.url+"_";
        console.log('redisKey',redisKey);
        keys.forEach(element => {
            redisKey = req.body[element]? redisKey +element+':'+ req.body[element] + '_' : redisKey
        });
        await redisClient.setex(redisKey,24*60*60*2,JSON.stringify({
          status: 200,
          data:resData,
          totalCount:totalCount
        } ));
          
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
    logs.action = 'GET_ORDER';
    logs.level = 'ERROR';
    logs.item = 'EBILL';
    // //addlogs(logs,data.rolePartyId,data.roleAccId);
    console.log(error);
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+cookie;
    warningMessage(commonErrors,error);
    return res
    .status(200)
    .json({ status: 500, message: 'something_went_wrong' });
      
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

const getInvitationDetails = async (code)=>{

  return new Promise(async(resolve, reject) => {
    let formData = {
      invite_code : code.toString()
    } 
    let  options = {
      'method': 'POST',
      'url': config.PYTHON_API+'post-list/connections',
      // 'url': 'http://192.168.2.64:5005/api/'+'invite-details',

      formData: formData
    };
        request(options, function (error, response) {
          if (error) {  
            commonErrors['errorTitle'] = 'getInvitationDetails';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+code;
            warningMessage(commonErrors,error);
            resolve(false)
          }

          // res.send(response.body)
          //console.log(response.body);
          console.log(response.body);
          
          if(response.statusCode==200)
          resolve(JSON.parse(response.body));
          else
          resolve(false)

        });
      });
}
const setOrderId = async (id,billId) =>{
  console.log('error');

  try {
    let bexioPool = await postgresBexio;
      const getcustomerId = `UPDATE documents_order_receive 
      SET rk_order = $1,
      status = $2
      WHERE cid = $3`
    const getcustomerIdResult = await bexioPool.query(getcustomerId,[billId,2,id]);
    return getcustomerIdResult.rows
  } catch (error) {
    console.log(error);
      commonErrors['errorTitle'] = setBillId.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+billId;
      warningMessage(commonErrors,error);
    return 0;
  }
}

const getDeliveryNotesList = async (req,res)=>{
  console.log("getDeliveryNotesList");  
  let cookie = null;
  let data = req.body;
  let partyId = req.body.partyId;
  const pool = await connectPostgres;
  let netcomId;
  console.log("req.body ",req.body);  
  try {
    cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
    let accessToken = cookie.access_Token;
    let isBexioUser = cookie.isBexioUser;
    const bexioPool = await postgresBexio;
    let resultData = [],tempStatus = false;
    let totalCount;
    let showFrom = req.body.records_per_page * (req.body.page_number-1);
    let showTo = req.body.records_per_page;

    const selectDeliveryNotesStatus = `SELECT * FROM documents_dispatchnotification_send ds 
    INNER JOIN companyregistered c ON ds.fk_companyregistered = c.cid
    WHERE c.rk_party = $1 AND ds.deliverynotestype = 'EDI'`;
    const deliveryNotesList = await bexioPool.query(selectDeliveryNotesStatus, [partyId]);
   
    
    const getNetcomIdQry = `SELECT * FROM  companyregistered 
    WHERE rk_party = $1`;
    const getNetcomId = await bexioPool.query(getNetcomIdQry, [partyId]);
    console.log('partyId',partyId);

    const getInviteCompanyIdQry = `SELECT array_agg(pa.cid) AS cid FROM
    party_account pa
    WHERE pa.fk_party = $1`
    let getInviteCompanyId = await pool.query(getInviteCompanyIdQry,[partyId]);
  
    console.log('getInviteCompanyId.rows[0].cid',getInviteCompanyId.rows[0].cid);
  
    const getConnectionStatus = `SELECT  array_agg(rk_businessconnection) AS bcConnection FROM
      contact_bc cb
      WHERE cb.rk_party_account IN(${getInviteCompanyId.rows[0].cid})
      AND type = 'EDI'
      AND rk_businessconnection IS NOT NULL`
    let getConnectionStatusList = await bexioPool.query(getConnectionStatus);
    console.log('getConnectionStatusList.rows[0].bcConnection',getConnectionStatusList.rows[0].bcconnection);
    console.log('bcDetails12121222');
    let bcDetails;
    bcDetails = await getBcDetails(getConnectionStatusList.rows[0].bcconnection,getNetcomId.rows[0].netcomid);

    console.log('bcDetails12121222',bcDetails['data']);
    let tempBc = [];
    // tempBc.push([0]['bc_id']);

    // tempBc.push(bcDetails['data'].filter((e,idx) => (e['company_details']['doc_type']['data'] == 'DispatchNotification')[idx]['bc_id']))

    // console.log('tempBc',tempBc);
    tempBc.push(0);
    if(bcDetails){
      for (let index = 0; index < bcDetails['data'].length; index++) {
        const element = bcDetails['data'][index];
        console.log("element :: ",element);      
        if(element['company_details']['doc_type']['data'] == 'DispatchNotification'){
          tempBc.push(element['bc_id'])
        }      
      }
    }
    console.log('tempBc',tempBc);
    
    const getConnectionBcQry = `SELECT  array_agg(rk_sendercontactid) FROM
      contact_bc cb
      WHERE cb.rk_party_account IN(${getInviteCompanyId.rows[0].cid})
      AND type = 'EDI'
      AND rk_businessconnection IN(${tempBc})
      AND rk_businessconnection IS NOT NULL`
    console.log('getConnectionBc',getConnectionBcQry);

    let getConnectionBc = await bexioPool.query(getConnectionBcQry);
    console.log('getConnectionBc',getConnectionBc.rows);
    
    let resultArray = getConnectionBc.rows[0].array_agg;
    if(isBexioUser){
      totalCount = await deliveryNotesListCountSearch(accessToken,0,2000);
      var options = {
        'method': 'GET',
        // 'url': `${config.BEXIO_API}2.0/kb_delivery`,
        'url': `${config.BEXIO_API}2.0/kb_delivery/?limit=${showTo}&offset=${showFrom}&order_by=updated_at_desc`,
        'headers': {
          'Accept': 'application/json',
          'Authorization': 'Bearer '+accessToken
        }

      };    
      request(options, async function (error, response) {
        if (error) {
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+showTo+' '+showFrom;
          warningMessage(commonErrors,error);
          return res.status(200).json({
            status: false,
            message: 'something_went_wrong',
        });
        }
        let resData = JSON.parse(response.body);       
        if(response.statusCode != 200)
          return res.status(401).json({
          status: false,
          message: 'unauthorized',
          });
        let status = JSON.parse(config.BEXIO_ITEM_STATUS);
        for (let deliveryNotes in resData) {
          tempStatus = false;
          resultArray?resData[deliveryNotes]['allowSend'] = resultArray.includes((resData[deliveryNotes].contact_id).toString()) ? true:false:false;
          resData[deliveryNotes]['statusLabel'] = status[resData[deliveryNotes].kb_item_status_id];
          resData[deliveryNotes]['timestamp'] = '';
          resData[deliveryNotes]['companyName'] = resData[deliveryNotes]['contact_address'].split("\n")[0];
          resData[deliveryNotes]['rk_globaltransaction'] = '';
          resData[deliveryNotes]['status'] = '';
          resData[deliveryNotes]['statusLabelDeliveryNotes'] = '';        
          for(let qryDeliveryNotes in deliveryNotesList.rows ){
              if(deliveryNotesList.rows[qryDeliveryNotes]['rk_deliverynotes'] == resData[deliveryNotes]['id']){
                resData[deliveryNotes]['rk_globaltransaction'] = deliveryNotesList.rows[qryDeliveryNotes]['rk_globaltransaction'];
                resData[deliveryNotes]['status'] = deliveryNotesList.rows[qryDeliveryNotes]['status'];
                resData[deliveryNotes]['statusLabelDeliveryNotes'] = JSON.parse(config.INVOICE_STATUS)[deliveryNotesList.rows[qryDeliveryNotes]['status']];
                resData[deliveryNotes]['timestamp'] = deliveryNotesList.rows[qryDeliveryNotes]['timestamp'];
                resData[deliveryNotes]['type'] = deliveryNotesList.rows[qryDeliveryNotes]['type'];

                if(deliveryNotesList.rows[qryDeliveryNotes]['status'] == 2){
                  resData[deliveryNotes]['allowSend'] = false;
                }
                if(!tempStatus && deliveryNotesList.rows[qryDeliveryNotes]['type'] == 'EBILL'){
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
        console.log('redisKey',redisKey);
        keys.forEach(element => {
            redisKey = req.body[element]? redisKey +element+':'+ req.body[element] + '_' : redisKey
        });
        await redisClient.setex(redisKey,24*60*60*2,JSON.stringify({
          status: 200,
          data:resData,
          totalCount:totalCount
        } ));
          
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
  
    logs.action = 'GET_ORDER_RESPONSE';
    logs.level = 'ERROR';
    logs.item = 'EDI';
    // //addlogs(logs,data.rolePartyId,data.roleAccId);
    console.log(error);
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+cookie;
    warningMessage(commonErrors,error);
    return res
    .status(200)
    .json({ status: 500, message: 'something_went_wrong' });
      
  }
}

const deliveryNotesListCountSearch = async(token,offset,limit?)=>{
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
    console.log({
      offset: offset,
      limit: limit
    });
    
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

const getDeliveryNotesForOT = async( req, res) => {
  let cookie = null;
  let decryptData = null;
  let deliveryNotesCid;
  decryptData = req.body;
  const pool = await connectPostgres;
  const data = req.body;
  try {
    let deliveryNotes,paymentType;
    cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
    let accessToken = cookie.access_Token;
    const partyId = decryptData.partyId;
    const accountId = decryptData.accountId;
    const deliveryItems = JSON.parse(decryptData.deliveryItems);
    const delivery_id = deliveryItems[0].delivery_id;
    deliveryNotes = await getDeliveryNotesOT(accessToken,delivery_id); // Get deliveryNotes from bexio using orderId

    if( !deliveryNotes){ // If there is no deliveryNotes with this orderId, return with error
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'error_in_getDeliveryNotesOT -req param,',JSON.stringify(req.body);
      warningMessage(commonErrors,'error_in_getDeliveryNotesOT');
      logs.action = 'ORDERRESPONSE_FOR_OPEN_TRANSACTION';
      logs.level = 'ERROR';
      logs.item = 'EDI';
      // addlogs(logs,decryptData.partyId,decryptData.accountId);
      res.send({
        status_code: 500,
        message: 'something_went_wrong',
        status: false
      });
      return
    }
    console.log(JSON.stringify(deliveryNotes));
    
    
    let invitationData = await getConnectionDetails(partyId,accountId,deliveryNotes.contact_id,req); // Get the connection details using contact_id, party and account
    console.log("invitationData: ",invitationData[0]);
    console.log({
      partyId,
      accountId,
      "deliveryNotes.contact_id":deliveryNotes.contact_id
    });
    let customerIds
    if( invitationData.length > 0)
      customerIds = await constGetContactId(invitationData[0].rk_businessconnection); // Get customer Id using businessConnection
    else
      if( !customerIds ){ // If there is no customerIds, return with error
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'customerIds_not_found -req param,',JSON.stringify(req.body);
        warningMessage(commonErrors,'customerIds_not_found');
        logs.action = 'ORDERRESPONSE_FOR_OPEN_TRANSACTION';
        logs.level = 'ERROR';
        logs.item = 'EDI';
        // addlogs(logs,decryptData.partyId,decryptData.accountId);
        res.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false
        });
        return;
      }
    console.log("customerIds: ",customerIds);
    if( invitationData != undefined){ // If there is any invitationData then do
      let pdf,fileName,pdfContent;
      pdf = await getDeliveryNotesPdf(accessToken,delivery_id); // Fetch pdf file for deliveryNotes from bexio.

      if( !pdf ){ // If there is no pdf, return with error
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'deliveryNotesPdf_not_found -req param,',JSON.stringify(req.body);
        warningMessage(commonErrors,'deliveryNotesPdf_not_found');
        logs.action = 'ORDERRESPONSE_FOR_OPEN_TRANSACTION';
        logs.level = 'ERROR';
        logs.item = 'EDI';
        // addlogs(logs,decryptData.partyId,decryptData.accountId);
        res.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false
        });
        return;
      }
      
      pdfContent = JSON.parse(pdf).content; // Assign pdf content.
      fileName = JSON.parse(pdf).name; // Assign pdf name.

      /* Fetch country data from bexio using accessToken */
      let countryList;
      countryList = await getCountryLists(accessToken);

      if( !countryList ){ // If country list not found, return with error.
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'countryList_not_found -req param,',JSON.stringify(req.body);
        warningMessage(commonErrors,'countryList_not_found');
        res.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false
        });
      }

      /* Fetch Bank Details */
      let bank;
      // bank = await getBank(accessToken,2);
      // if( !bank){
      //   res.send({
      //     status_code: 500,
      //     message: 'something_went_wrong',
      //     status: false,      
      //   });
      //   return
      // }
      // console.log("bank :: ",bank);
      
      // if('iban_nr' in bank){
      //   deliveryNotes['bank'] = bank;
      // }
      // else{
      //   res.send({
      //     status_code: 500,
      //     message: 'bexio_bank_error',
      //     status: false,
      //   });
      //   return
      // }

      console.log("deliveryNotes.currency_id :: ",deliveryNotes.currency_id);
      /* Fetch currency from bexio using id. */
      let currency = await getCurrency(accessToken,deliveryNotes.currency_id);
      if( !currency ){
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'currency_not_found -req param,',JSON.stringify(req.body);
        warningMessage(commonErrors,'currency_not_found');
        logs.action = 'ORDERRESPONSE_FOR_OPEN_TRANSACTION';
        logs.level = 'ERROR';
        logs.item = 'EDI';
        // addlogs(logs,decryptData.partyId,decryptData.accountId);
        res.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
      
        });
        return
      }
      deliveryNotes['currency'] = currency;

      /* Get user details from access token */
      let temp = await getloginUserCompanyDetails(accessToken);
      if( !temp ){
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'loginUserCompanyDetails_not_found -req param,',JSON.stringify(req.body);
        warningMessage(commonErrors,'loginUserCompanyDetails_not_found');
        logs.action = 'ORDERRESPONSE_FOR_OPEN_TRANSACTION';
        logs.level = 'ERROR';
        logs.item = 'EDI';
        // addlogs(logs,decryptData.partyId,decryptData.accountId);
        res.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
        return;
      }
      deliveryNotes['companyProfile'] = temp;
      deliveryNotes['companyProfile'] = JSON.parse(deliveryNotes['companyProfile']);
      /* Fetch payment type from deliveryNotes */
      paymentType = await getPaymentType(accessToken,deliveryNotes.payment_type_id);
      if(!paymentType){
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'paymentType_not_found -req param,',JSON.stringify(req.body);
        warningMessage(commonErrors,'paymentType_not_found');
        logs.action = 'ORDERRESPONSE_FOR_OPEN_TRANSACTION';
        logs.level = 'ERROR';
        logs.item = 'EDI';
        // addlogs(logs,decryptData.partyId,decryptData.accountId);
        res.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
        return;
      }

      let tempPaymentType = paymentType.filter(e => e.id == deliveryNotes.payment_type_id);
      deliveryNotes['paymentType'] = tempPaymentType;

      /* Fetch contact using contact id from deliveryNotes */
      let contact = await getContact(accessToken,deliveryNotes.contact_id);
      if(!contact){
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'contact_not_found -req param,',JSON.stringify(req.body);
        warningMessage(commonErrors,'contact_not_found');
        logs.action = 'ORDERRESPONSE_FOR_OPEN_TRANSACTION';
        logs.level = 'ERROR';
        logs.item = 'EDI';
        // addlogs(logs,decryptData.partyId,decryptData.accountId);
        res.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
        return;
      }
      deliveryNotes['contact'] = contact;
      let user = true;
      if(!user){
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'user_not_found -req param,',JSON.stringify(req.body);
        warningMessage(commonErrors,'user_not_found');
        logs.action = 'ORDERRESPONSE_FOR_OPEN_TRANSACTION';
        logs.level = 'ERROR';
        logs.item = 'EDI';
        // addlogs(logs,decryptData.partyId,decryptData.accountId);
        res.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
        return;
      }
      deliveryNotes['user'] = user;

      /* Loop over positions in deliveryNotes */
      for (const items of deliveryNotes.positions) {
        console.log('items.tax_id',items.tax_id);
        if(items.tax_id){ // Check tax is there or not
          /* Fetch tax using tax id */
          let tempTax = await getTaxs(accessToken,items.tax_id);
          if(!tempTax){
            logs.action = 'ORDERRESPONSE_FOR_OPEN_TRANSACTION';
            logs.level = 'ERROR';
            logs.item = 'EDI';
            // addlogs(logs,decryptData.partyId,decryptData.accountId);
            commonErrors['errorTitle'] = req.originalUrl;
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'tax_not_Found -req param,',JSON.stringify(req.body);
            warningMessage(commonErrors,'tax_not_Found');
            res.send({
              status_code: 500,
              message: 'something_went_wrong',
              status: false,
            });
            return;
          }
          items['tax'] = tempTax;
        }
        let tempItem;
        if('article_id' in items)
        {
          tempItem = await getProducts(accessToken,items.article_id);
          items['article'] = tempItem;
          // console.log('articleas',items['article']);
          
        }else{
          console.log('items',items);
          
          items['article'] = {}
          items['article']['intern_name'] = items.text;
          items['article']['intern_description'] = items.text;

        }
      }
      deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId,delivery_id,deliveryNotes['document_nr'],'1');

      /* Create XML from data */
      let xml;
      xml = await setDeliveryNotesToOt(deliveryNotes,countryList,invitationData[0],pdfContent,fileName,customerIds,deliveryNotesCid);
      if( xml == false){
        deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId,delivery_id,deliveryNotes['document_nr'],'0','deliveryNotesToOt_not_found');
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'deliveryNotesToOt_not_found -req param,',JSON.stringify(req.body);
        warningMessage(commonErrors,'deliveryNotesToOt_not_found');
        logs.action = 'ORDERRESPONSE_FOR_OPEN_TRANSACTION';
        logs.level = 'ERROR';
        logs.item = 'EDI';
        // addlogs(logs,decryptData.partyId,decryptData.accountId);
        res.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
        return;
      }
      await invoiceFilePush(invitationData[0].rk_netcomidsender,'WS',xml,deliveryNotes['document_nr'],'EDI');
      let redisKey = req.body.partyId+"_/";
      // await deleteRedis(req.url.substr(1,req.url.length),redisKey);
      logs.action = 'ORDERRESPONSE_FOR_OPEN_TRANSACTION';
      logs.level = 'NOTIFICATION';
      logs.item = 'EDI';
      // addlogs(logs,partyId,accountId);
      res.send({
        status_code: 200,
        message: '',
        status: true,
      });
    }
    else{
      logs.action = 'ORDERRESPONSE_FOR_OPEN_TRANSACTION';
      logs.level = 'ERROR';
      logs.item = 'EDI';
      // addlogs(logs,decryptData.partyId,decryptData.accountId);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'ORDER_FOR_OPEN_TRANSACTION -req param,',JSON.stringify(req.body);
      warningMessage(commonErrors,'ORDER_FOR_OPEN_TRANSACTION');
      res.send({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
      });
    }
    
    /* Log */

    
  } catch (error) {
    logs.action = 'ORDERRESPONSE_FOR_OPEN_TRANSACTION';
    logs.level = 'ERROR';
    logs.item = 'EDI';
    // addlogs(logs,decryptData.partyId,decryptData.accountId);
     console.log('error',error);
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+decryptData;
    warningMessage(commonErrors,error);
    res.send({
      status_code: 500,
      message: '',
      status: false,
    });
  }
}

const getDeliveryNotesPdf = async( accessToken,delivery_id) => {
  try {
    return new Promise( async( resolve, reject) => {
      var options = {
        'method': 'GET',
        'url': `https://api.bexio.com/2.0/kb_delivery/${delivery_id}/pdf`,
        'headers': {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
          }
      };
  
      request( options, function( error, respons){
        if(error){
          commonErrors['errorTitle'] = 'getOrderResposnePdf';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+delivery_id;
          warningMessage(commonErrors,error);
          resolve(error);
        }
        if( respons.statusCode == 200){
          resolve(respons.body);
        }
        else{
          resolve(false);
        }
      })
    });
  } catch (error) {
    commonErrors['errorTitle'] = 'getOrderResposnePdf';
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+delivery_id;
    warningMessage(commonErrors,error);
    return;
  }
  
}

const setDeliveryNotesCidSendStatus = async (partyId,delivery_id,ordernumber,status,error?) => {
  let sendDeliveryNotesId = '';
  return new Promise( async function (resolve, reject) {
    const bexioPool = await postgresBexio;
    const pool = await connectPostgres;
    const responseBody = error || '';
    
    try {
      console.log('partyIdpartyIdpartyId',partyId);
      console.log('delivery_iddelivery_id',delivery_id);
      
      bexioPool.query('begin');
      const selectQry = `SELECT c.cid,ds.cid as ordersendid FROM documents_dispatchnotification_send ds 
        INNER JOIN companyregistered c ON ds.fk_companyregistered = c.cid
        WHERE c.rk_party = $1
        AND rk_deliverynotes = $2
        AND ds.deliverynotestype = 'EDI'`;

      const selectQryResult = await bexioPool.query(selectQry,[partyId,delivery_id]);
      console.log('selectQryResult',selectQryResult);

      let insertQry;
      console.log(selectQryResult);
      
      if(selectQryResult.rows.length == 0){
        const selectQry = `SELECT * FROM companyregistered
              WHERE rk_party = $1`;
        const selectQryResultParty = await bexioPool.query(selectQry,[partyId]);
        console.log('selectQryResultParty',selectQryResultParty.rows);
        

        insertQry =`INSERT INTO 
        documents_dispatchnotification_send
              (rk_deliverynotes,deliverynotesnumber,fk_companyregistered,deliverynotestype,status)
            VALUES
              ($1,$2,$3,$4,$5)
              RETURNING cid`
        let result = await bexioPool.query(insertQry,[delivery_id,ordernumber,selectQryResultParty.rows[0].cid,'EDI',status]);
        console.log(result);

        sendDeliveryNotesId = result.rows[0].cid;
      }
      else{
        sendDeliveryNotesId = selectQryResult.rows[0].ordersendid;
        let updateQry =`UPDATE 
            documents_dispatchnotification_send
              SET timestamp = NOW(),
              status = $3
            WHERE fk_companyregistered = $1
              AND rk_deliverynotes = $2
              AND deliverynotestype='EDI'`;
        await bexioPool.query(updateQry,[selectQryResult.rows[0].cid,delivery_id,status]);
      }
      bexioPool.query('COMMIT', err => {
        if (err) {
          console.error('Error committing transaction')
        }
      });
      resolve(sendDeliveryNotesId);
    } catch (error) {
      bexioPool.query('ROLLBACK', err => {
        if (err) {
          console.error('Error committing transaction')
        }
      })
      console.log(error);
      commonErrors['errorTitle'] = setInvoiceSendStatus.name;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+partyId+'-partyId'+delivery_id+'-deliveryId'+ordernumber+'orderNumber';
      warningMessage(commonErrors,error);
      resolve('');
    }
  });

}


const getDeliveryNotesOT = async (accessToken,delivery_id) =>{
  try {
    return new Promise( async( resolve, reject) => {
      var options = {
        'method': 'GET',
        'url': `https://api.bexio.com/2.0/kb_delivery/${delivery_id}`,
        'headers': {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      };
  
      request( options, function(error, response){
        if(error){
          commonErrors['errorTitle'] = 'getDeliveryNotesCidOT';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+delivery_id;
          warningMessage(commonErrors,error);
          resolve(error);
        }
        if( response.statusCode == 200){
          resolve(JSON.parse(response.body));
        }
        else{
          resolve(false);
        }
      })
    });
  } catch (error) {
    commonErrors['errorTitle'] = 'getDeliveryNotesOT';
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+delivery_id;
    warningMessage(commonErrors,error);
    return;
  }  
}

const setDeliveryNotesToOt = async(deliveryNotes,coutryList,contactDetails,pdf,fileName,customerIds,delivery_id)=>{
  console.log({
    deliveryNotes,coutryList,contactDetails,fileName,customerIds,delivery_id
  });
  coutryList = JSON.parse(coutryList);
  console.log("gghghgh");
  let emptyValue = 'NA'
  let taxIsAdded;
  let priceQuantity = '1'
  let deliveryNotesUnit = {
    'Stk':'C62',
    'h':'HUR'
  }
  let obj = {
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
          "CONTROL_INFO":[],
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
  console.log("\ntaxIsAdded:: "+taxIsAdded);
  console.log("JSON.stringify(deliveryNotes) ",JSON.stringify(deliveryNotes.contact));
  console.log(coutryList[0]);
  
  
  obj.OPENTRANS.DISPATCHNOTIFICATION[0]['DISPATCHNOTIFICATION_HEADER'][0]['CONTROL_INFO'].push(JSON.parse(JSON.stringify({
    "GENERATOR_INFO": new Date(deliveryNotes.updated_at).toISOString()
  })))
  console.log("-------------------------\n"+new Date(deliveryNotes.updated_at).toISOString()+"\n----------------");
  // console.log("-----------deliveryNotes---------------\n",deliveryNotes);
  let deliveryAddress = {};
  // Normal split and replace is not working 
  let tempString = JSON.stringify(deliveryNotes.delivery_address)
  let tempArray = "";
  console.log("tempString",tempString);

  
  if(tempString.indexOf("\\r\\n") != -1)
  {
    tempArray = tempString.substring(1, tempString.length-1).replace(/\\r\\n/g, "___________");
  }
  else if(tempString.indexOf("\\n") != -1)
  {
    tempArray = tempString.substring(1, tempString.length-1).replace(/\\n/g, "___________");
  }
  else if(tempString.indexOf("\\r") != -1)
  {
    tempArray = tempString.substring(1, tempString.length-1).replace(/\\r/g, "___________");
  }
  else{
    tempArray = tempString;
  }

  console.log('tempArray',tempArray);
  let deliveryAddress2 = tempArray.split("___________");
  console.log("deliveryAddress2",deliveryAddress2);
  
  let tempAdress = deliveryAddress2.filter((e)=>e.length!=0);
  console.log('tempAdress',tempAdress);
  if(tempAdress.length == 4){
    tempAdress.splice(1,0," ")
  }
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let isEmailAdded = pattern.test(tempAdress[1]);
  let tempStreet;
  let tempZip;
  let tempCity;
  let countryCode;
  let secondName = undefined;
 


  if(isEmailAdded){
    tempStreet = tempAdress[3]?.trim() ? tempAdress[3]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined;
    tempZip = tempAdress[4]?.trim() ? tempAdress[4]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined;
    tempCity = tempAdress[5]?.trim() ? tempAdress[5]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined;
    countryCode = tempAdress[6] ? coutryList.filter(coutry => coutry.iso_3166_alpha2 ==  tempAdress[6].replace(/\n/g, "").replace(/\r/g, "").trim())[0]?.iso_3166_alpha2 : undefined;
  }else{
    if(tempAdress.length == 5){
      countryCode = tempAdress[4] ? coutryList.filter(coutry => coutry.iso_3166_alpha2 ==  tempAdress[4].replace(/\n/g, "").replace(/\r/g, "").trim())[0]?.iso_3166_alpha2 : undefined;
      tempStreet = tempAdress[1]?.trim() ? tempAdress[1]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined;
      tempZip = tempAdress[2]?.trim() ? tempAdress[2]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined;
      tempCity =  tempAdress[3]?.trim() ? tempAdress[3]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined;
    }else{
      countryCode = tempAdress[5] ? coutryList.filter(coutry => coutry.iso_3166_alpha2 ==  tempAdress[5].replace(/\n/g, "").replace(/\r/g, "").trim())[0]?.iso_3166_alpha2 : undefined;
      secondName = tempAdress[1]?.trim() ? tempAdress[1]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined;
      tempStreet = tempAdress[2]?.trim() ? tempAdress[2]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined;
      tempZip = tempAdress[3]?.trim() ? tempAdress[3]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined;
      tempCity =  tempAdress[4]?.trim() ? tempAdress[4]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined;
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
          "PARTY_ROLE":"supplier",
          "ADDRESS": [{
            "bmecat:NAME": deliveryNotes.companyProfile[0].name_1?deliveryNotes.companyProfile[0].name_1:undefined,
            "bmecat:NAME2": deliveryNotes.companyProfile[0].name_2?deliveryNotes.companyProfile[0].name_2:undefined,
            "bmecat:STREET": deliveryNotes.companyProfile[0].address?deliveryNotes.companyProfile[0].address:undefined,
            "bmecat:ZIP": deliveryNotes.companyProfile[0].postcode?deliveryNotes.companyProfile[0].postcode:undefined,
            "bmecat:CITY": deliveryNotes.companyProfile[0].city?deliveryNotes.companyProfile[0].city:undefined,
            "bmecat:COUNTRY_CODED":coutryList.filter(coutry => coutry.id == deliveryNotes.companyProfile[0].country_id)[0].iso_3166_alpha2
          }]
        },{
          "bmecat:PARTY_ID": [{
            "_": contactDetails.rk_netcomidreceived,
            "$": {
              "type": "buyer_specific"
            }
          }],
          "PARTY_ROLE":"buyer",
          "ADDRESS": [{
            "bmecat:NAME": deliveryNotes.contact.name_1?deliveryNotes.contact.name_1:undefined,
            "bmecat:NAME2": deliveryNotes.contact.name_2?deliveryNotes.contact.name_2:undefined,
            "bmecat:STREET": deliveryNotes.contact.address?deliveryNotes.contact.address:undefined,
            "bmecat:ZIP": deliveryNotes.contact.postcode?deliveryNotes.contact.postcode:undefined, //NOT IN BEXIO CONTACTS - REMOVED 
            "bmecat:CITY": deliveryNotes.contact.city?deliveryNotes.contact.city:undefined,
            "bmecat:COUNTRY_CODED": deliveryNotes.contact.country_id?coutryList.filter(coutry => coutry.id == deliveryNotes.companyProfile[0].country_id)[0].iso_3166_alpha2:undefined
          }]
        },{
          "bmecat:PARTY_ID": [{
            "_": contactDetails.rk_netcomidsender,
            "$": {
              "type": "party_specific"
            }
          }],

        

          "PARTY_ROLE":"delivery",
          "ADDRESS": [{
            "bmecat:NAME": tempAdress[0]?.trim() ? tempAdress[0]?.replace(/\n/g, "")?.replace(/\r/g, "").trim() : undefined,
             "bmecat:NAME2": secondName,
             "CONTACT_DETAILS":isEmailAdded ? [{
              "bmecat:CONTACT_NAME":tempAdress[0]?.trim() ? tempAdress[0]?.replace(/\n/g, "")?.replace(/\r/g, "").trim() : undefined,
              "bmecat:PHONE":tempAdress[2]?.replace(/\n/g, "") ? tempAdress[2]:undefined,
              "bmecat:EMAILS":tempAdress[1]?.trim()?[{
                "bmecat:EMAIL":tempAdress[1]?.trim() ? tempAdress[1]?.replace(/\n/g, "").replace(/\r/g, "").trim() : undefined
              }]:undefined,
             }]: undefined,
            "bmecat:STREET": tempStreet,
            "bmecat:ZIP":  tempZip,
            "bmecat:CITY":  tempCity,
            "bmecat:COUNTRY_CODED": countryCode ? countryCode : undefined
          }]
        }]
      }],
      "bmecat:SUPPLIER_IDREF":contactDetails.sendercustomerid,
      "bmecat:BUYER_IDREF": contactDetails.receivercustomerid,
      "SHIPMENT_PARTIES_REFERENCE":[{
        "DELIVERY_IDREF": contactDetails.rk_netcomidsender
      }],
      "REMARKS": deliveryNotes.title ? deliveryNotes.title : undefined,
      "HEADER_UDX":[{
        "HEADER_UDX_OPT": [{
          "BEX_DISPATCHNOTIFICATION_DOCUMENT_ID": delivery_id
        }],
        "SENDER_CUSTOM_ID_1": contactDetails.sendercustomerid,
        "RECEIVER_CUSTOM_ID_1": contactDetails.receivercustomerid,
      }]
    })
  ));
  // console.log(JSON.stringify(obj.OPENTRANS));
  console.log("-----------------------------------------------------------");
  let allTax = [];
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
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    console.log(element);    
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
    
    totalAmount = parseFloat(totalAmount) + parseFloat(element.position_total);
    let arr,status = true;
    obj.OPENTRANS.DISPATCHNOTIFICATION[0]['DISPATCHNOTIFICATION_ITEM_LIST'][0]['DISPATCHNOTIFICATION_ITEM'].push(JSON.parse(JSON.stringify({
      "LINE_ITEM_ID": element.pos?element.pos:index,
      "PRODUCT_ID": [{
        "bmecat:SUPPLIER_PID" : element.internal_pos?element.internal_pos:undefined,
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
          "bmecat:DESCRIPTION_LONG": element.text? element.text:undefined
        // "bmecat:INTERNATIONAL_PID" : [JSON.parse(JSON.stringify({
        //   "_":element.article.intern_code?element.article.intern_code:undefined,
        //   "$": {
        //     "type":"ean"
        //   }
        // }))]
      }],
      "QUANTITY": element.amount?Math.trunc(element.amount):1,
      "bmecat:ORDER_UNIT":deliveryNotesUnit[element.unit_name]?deliveryNotesUnit[element.unit_name]:'C62',
      "ORDER_REFERENCE": [{
        "ORDER_ID": element.id,
        "LINE_ITEM_ID": element.pos?element.pos:index
      }],
      "SHIPMENT_PARTIES_REFERENCE":[{
        "DELIVERY_IDREF": contactDetails.rk_netcomidsender
      }]
    })))
  }
  obj.OPENTRANS['DISPATCHNOTIFICATION'][0]['DISPATCHNOTIFICATION_SUMMARY'].push(JSON.parse(JSON.stringify({
    "TOTAL_ITEM_NUM" : deliveryNotes.positions.length
  })))
  // return
  
  let builder = new xml2js.Builder({'xmldec.version':1.0} );
  console.log("JSON.stringify(obj):: ",JSON.stringify(obj))
  var xml = builder.buildObject(obj);
  console.log("xml:  ---------------------------\n",xml);
  return Buffer.from(xml).toString('base64');
}

const checkContactExist = async (req,res) => {
  let formData;
  let cookie = null;
  try {
    cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
    let accessToken = cookie.access_Token;
    formData = encryptionControl.decrypt(req.body.encrToken);
    const contactData = await getContact(accessToken,formData.contact_id);
    if(!contactData){
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
    logs.action = 'CHECK_CONTACT_EXIST';
    logs.level = 'ERROR';
    logs.item = 'EDI';
    // addlogs(logs,formData.rolePartyId,formData.roleAccId);
    console.log("tourList ",error);
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
const getAccountToken = async (req, res) => {
  console.log('11111111111111111');
  const data = req.body;
  let cookie = null,tokenSet;
  const pool = await connectPostgres;
  try {
      if(req.signedCookies[config.TOKEN_COOKIE_NAME])
        cookie = JSON.parse(encryptionControl.decryptCookie(req.signedCookies[config.TOKEN_COOKIE_NAME]));
      else
        cookie = JSON.parse(encryptionControl.decryptCookie(req.signedCookies[config.MTC_TOKEN_COOKIE_NAME]));

      let bexioPool = await postgresBexio;
      const gate2b = await connectGate2b;
      const redis_client = await redisClient;
      console.log('old',cookie);
      // console.log('new',data);
      let token = cookie;
      // let partyId = data.partyId;
      console.log('data',data);
      console.log('cookie',cookie);
      let partyId = data.partyId;
      let accountId = cookie.accId;
      // let getSuperRoleDetils = `SELECT array_agg(CID) AS roles
      // FROM role 
      // WHERE name IN (${config.SUPERADMINBEXIO})`;
      // const superRoleresult = await pool.query(getSuperRoleDetils);
      let a = await getUserPermissions(partyId,accountId);
      // await addSystemuser(partyId,accountId,superRoleresult.rows[0].roles);
      const redisKey = 'permissions_'+partyId+'_'+accountId;
      let permissions = ''
      console.log('redisKeyGet',redisKey);

      await redis_client.get(redisKey, async (err,data) => {
          permissions = data ? data : ' ';
          // if(permissions.search("superadmin.info.edit") != -1){
           
       
            // let accountId = 50;
            const getRefreshToken = `SELECT * FROM  companyregistered 
                WHERE rk_party = $1`

            let refresTokenResult = await bexioPool.query(getRefreshToken, [partyId]);
            console.log('refresTokenResult',refresTokenResult.rows);
            if(req.cookies[config.EXPIRE_MTC_COOKIE_NAME])
            {

            if(refresTokenResult.rows.length != 0){
               
              const expireCookie = JSON.parse(encryptionControl.decryptCookie(req.cookies[config.EXPIRE_MTC_COOKIE_NAME]));
              console.log('olddatetimeToken',expireCookie);
              let datetimeToken = expireCookie;
              datetimeToken['cookieCreatedTime'] = new Date(new Date(new Date().getTime() + 15 * 60000).toUTCString());
              console.log('refresTokenResult.rows[0].refreshtoken',refresTokenResult.rows[0].refreshtoken);
              let getAccountDetils = `SELECT a.cid AS accId
              FROM account a INNER JOIN "user" u ON u.cid= a.fk_user
              WHERE u.email=$1`;
              let getAccountDetilsResult = await pool.query(getAccountDetils, [cookie['userMail']]);
              console.log('getAccountDetils',getAccountDetils);
              

                if(refresTokenResult.rows[0].refreshtoken){
                    console.log('1233654');
                    
                    try {
                     tokenSet = await bexioClient.refresh(refresTokenResult.rows[0].refreshtoken);
                      
                    } catch (error) {
                      return res.status(200).json({
                        status_code: 500,
                        message: 'token_missing',
                        status: false,
                    });
                      commonErrors['errorTitle'] = req.originalUrl;
                      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param'+JSON.stringify(cookie)+' '+JSON.stringify(req.body);
                      warningMessage(commonErrors,error);
                      return res.status(200).json({
                          status_code: 500,
                          message: 'something_went_wrong',
                          status: false,
                      });
                    }

                    let bexioTokenCookie = { 
                        access_Token:tokenSet.access_token,
                        refresh_Token:tokenSet.refresh_token,
                        isBexioUser:true
                    
                    }
                    const updateRefreshToken = `UPDATE companyregistered SET refreshtoken = $1
                    WHERE rk_party = $2`
                    let updateRefreshTokenResult = await bexioPool.query(updateRefreshToken, [tokenSet.refresh_token,partyId]);

                    res.cookie(config.TOKEN_COOKIE_BEXIO_NAME, encryptionControl.encrypt(JSON.stringify(bexioTokenCookie)), {
                        domain: config.SESSION_DOMAIN,
                        maxAge: config.SESSION_EXPIRY,
                        httpOnly: true,
                        signed: true,
                        secure: true
                    });
                    let getEdiPartyUID = `SELECT fk_party, rk_uid
                    FROM "_party_gate2b"
                    WHERE fk_party = $1`
                    let ediPartyUID = await pool.query(getEdiPartyUID,[partyId]);
                    if(ediPartyUID.rows.length){
                    let getEdipartyNetcomID = `SELECT  netcomid
                                    FROM ediparty
                                    WHERE objectid = $1`
                    let edipartyNetcomID = await gate2b.query(getEdipartyNetcomID,[ediPartyUID.rows[0].rk_uid]);
                    if(edipartyNetcomID.rows.length){
                        token['netcomId']  = edipartyNetcomID.rows[0].netcomid;                           
                        token['partyID']  = partyId ;  
                        token['accId'] = getAccountDetilsResult.rows[0].accid;
                        datetimeToken['accId'] = getAccountDetilsResult.rows[0].accid;
                        datetimeToken['partyID'] = partyId;
                        datetimeToken['cookieCreatedTime'] = new Date(new Date(new Date().getTime() + 15 * 60000).toUTCString());  
                        datetimeToken['netcomId'] = edipartyNetcomID.rows[0].netcomid;
                        datetimeToken['isBexioCompany'] = true;
                        }
                    }
                    res.cookie(config.TOKEN_COOKIE_NAME, encryptionControl.encrypt(JSON.stringify(token)), {
                      domain: config.SESSION_DOMAIN,
                      maxAge: config.SESSION_EXPIRY,
                      secure: true,
                      httpOnly: true,
                      signed: true,
                  });

                    console.log('newdatetimeToken',datetimeToken);

                  //   res.cookie(
                  //       config.EXPIRE_EXPIRES_COOKIE_NAME,
                  //       encryptionControl.encrypt(JSON.stringify(datetimeToken)),
                  //       {
                  //           domain: config.SESSION_DOMAIN,
                  //           maxAge: config.SESSION_EXPIRY,
                  //           secure: false,
                  //           httpOnly: false,
                  //           signed: false,
                  //       },
                  //   );

              return res.status(200).json({
                  status_code: 200,
                  message: 'success_switch_company',
                  status: true,
                  showEbill:config.IS_EBILL_DISABLED,
              });
            }else
            {
                return res.status(200).json({
                    status_code: 500,
                    message: 'token_missing',
                    status: false,
                });
            }
        }else{
            return res.status(200).json({
                status_code: 500,
                message: 'token_missing',
                status: false,
            });
        }
    }else{
        return res.status(200).json({
            status_code: 500,
            message: 'permission_missing',
            status: false,
        });

    } 
  // }else{
  //   return res.status(200).json({
  //     status_code: 500,
  //     message: 'mtc_token_missing',
  //     status: false,
  // });
  // }

});

  } catch (error) {
        logs.action = 'SWITCH_COMPANY_BEXIO';
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        // //addlogs(logs,data.rolePartyId,data.roleAccId);
       console.log(error);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param'+JSON.stringify(cookie)+' '+JSON.stringify(req.body);
      warningMessage(commonErrors,error);
      return res.status(200).json({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
      });
      
  }
}
const getUserLogs = async (req, res) => {

  return new Promise(async(resolve, reject) => {
    var options = {
      'method': 'GET',
       'url': config.LOG_URL + 'fetchalldata',
        // 'url': 'http://192.168.2.247:9500/fetchalldata',

      'headers': {
        'Accept': 'application/json',
      }
    };
console.log(options);

    request(options, async function (error, response) {
      console.log("response",response.body);
      
      if (error) {  
        commonErrors['errorTitle'] = 'contactListCount';
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+'token';
        warningMessage(commonErrors,error);
        resolve(false)
      }
      // console.log('response.body',response.body);
      // console.log('response.statusCode',response.statusCode);
      
      if(response.statusCode==200){
          
        res.send({data:JSON.parse(response['body'])})

      }
      else
      res.send({
        response
      })
    });
  });
}

const invoiceCountSearch = async (token,search,offset,limit?)=>{
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
         let temp = invoiceCountSearch(token,offset+2000,2000)
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

const getTransactionList = async (req, res) => {
  let formData;
  let cookie = null;
  const bexioPool = await postgresBexio;
  try{
    formData = req.body;
    cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
    let accessToken = cookie.access_Token;
    // formData = encryptionControl.decrypt(req.body.encrToken);

    let contacts;
    let showTo:number;
    let showFrom:number = parseInt(formData.records_per_page)*(parseInt(formData.page_number)-1) + 1;
    showTo = showFrom + parseInt(formData.records_per_page) - 1;
    console.log({
      showFrom,showTo,formData:formData,
      'formData.records_per_page' : formData.records_per_page,
      'formData.page_number': formData.page_number
    });
    
    const transactionQuery = `SELECT * FROM (
      SELECT *, ROW_NUMBER() OVER(ORDER BY timestamp DESC) AS row_number
      FROM public."vTransactionList" vt 
      INNER JOIN companyregistered cr ON cr.cid = vt.fk_companyregistered 
      WHERE cr.rk_party = ${formData.partyId}
      ) AS temp 
      WHERE row_number BETWEEN ${showFrom}  AND ${showTo}`;
    console.log(transactionQuery);
    
    const getTransactionList = await bexioPool.query(transactionQuery);
    const totalTransaction = `SELECT * FROM public."vTransactionList" vt 
        INNER JOIN companyregistered cr ON cr.cid = vt.fk_companyregistered
        WHERE cr.rk_party = ${formData.partyId}  ORDER BY timestamp DESC`;
    const totalCounts = await bexioPool.query(totalTransaction);
    if( getTransactionList.rows.length > 0 ){
      console.log(JSON.stringify(getTransactionList.rows));
    }
    return res
    .status(200)
    .json({ status: 200, message: 'Success', data: getTransactionList.rows, totalCounts : totalCounts.rows.length, filteredCount: getTransactionList.rows.length });
  }
  catch(error) {
    logs.action = 'GET_TRANSACTION_LIST';
    logs.level = 'ERROR';
    logs.item = 'EDI';
    console.log(error);
    
    //// //(logs,data.rolePartyId,data.roleAccId);
    // commonErrors['errorTitle'] = req.originalUrl;
    // commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+cookie;
    // warningMessage(commonErrors,error);
    return res
    .status(200)
    .json({ status: 500, message: 'something_went_wrong' });
  }
}

const updateProcessDataToRedis = async (req, res) => {
  let formData;
  let cookie = null;
  const bexioPool = await postgresBexio;
  const redis_client = await redisClient;
  try {
    formData = req.body;
    console.log(formData);
    
    cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
    let accessToken = cookie.access_Token;
    let partyId = formData.partyId;
    let accId = formData.accId;
    let resData = formData.processData;
    let redisKey = partyId+"_"+accId+"_processdata_contacts";
    const currentTime = new Date();
    console.log(redisKey);    
    await redis_client.get(redisKey, async (err,data) => {
      if(!err){
        if( data ){
          await redis_client.del(redisKey, async (err, data) => {
            //console.log("deleted");
            if( !err ){
            }
          });          
        }
        await redisClient.setex(redisKey,24*60*60*2,JSON.stringify({resData}));
        res.send({
          status: true,
          status_code: 200,
          message: 'common_sucess'
        });
      }
      else{
        res.send({
          status: false,
          status_code: 500,
          message: 'something_went_wrong'
        });
      }
    });
  } catch (error) {
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param'+JSON.stringify(cookie)+' '+JSON.stringify(req.body);
    warningMessage(commonErrors,error);
    res.send({
      status: false,
      status_code: 500,
      message: 'something_went_wrong'
    });
  }
}

const getProcessDataFromRedis = async( req, res) =>{
  let formData;
  let partyId, accId;
  const redis_client = await redisClient;
  let redisKey;
  try {
    formData = req.body;
    partyId = formData.partyId;
    accId = formData.accId;
    redisKey = partyId+"_"+accId+"_processdata_contacts";
    console.log(redisKey);
    await redis_client.get(redisKey, async (err,data) => {
      if(!err){
        console.log(data);
        res.send({
          status: true,
          redisData: JSON.parse(data),
          status_code: 200,
          message: 'common_sucess'
        });      
      }
    });
  } catch (error) {
    
  }
}

const deleteProcessDataFromRedis = async(req, res) =>{
  let formData;
  let partyId, accId;
  const redis_client = await redisClient;
  let redisKey;
  console.log("redissKey");
  
  try{
    formData= req.body;
    partyId   = formData['partyId'];
    accId     = formData['accId'];
    redisKey = partyId+"_"+accId+"_processdata_contacts";
    await redis_client.get(redisKey, async (err,data) => {
      if(!err){
        console.log(data);
        if( data ){
          await redis_client.del(redisKey, async (err,data) => {
            //console.log("deleted");
            if( !err ){
              res.send({
                status: true,
                status_code: 200,
                message: 'common_sucess'
              });
            }
            else{
              res.send({
                status: false,
                status_code: 500,
                message: 'delete not done'
              });
            }
          });          
        }
        else{
          res.send({
            status: true,
            status_code: 200,
            message: 'common_sucess'
          });
        }  
      }
      else{
        res.send({
          status: false,
          status_code: 500,
          message: 'key/data not found'
        });
      }
    });
  
  }
  catch(e){
    console.log('Error in getting form data', e);
    res.send({
      status: false,
      status_code: 500,
      message: 'error in redis delete'
    });
  }

}

const getContactById = async (accessToken,contact_idList) => {
  return new Promise(async(resolve, reject) => {
    let searchJson = [];
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
    let contactList: any = [];
    request(optionsContact, async function (error, response) {
      if (error) {
        commonErrors['errorTitle'] = bexioApi.name;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'-bexio param,'+accessToken;
        warningMessage(commonErrors,error);
        resolve(error);
      }
      // if(response.statusCode != 200){
      //   resolve(JSON.parse(response.body));
      // }
      // console.log('getContactById',response.body);
      
      if(response.statusCode == 200){
        resolve(JSON.parse(response.body));      
      }else{
        resolve(false)
      }
    }); 
  });
          
 
}

const activeBillers = async (req, res) => {
  try {
    const decryptData = req.body; 
    console.log("sfd");

    const fileData = req.files
    let attachments = []
    let customerSubject 
    let customerMessage
    let subject
    let message
    // let isOnlyHead = false
    // if(decryptData.isOnlyHeadData){
    //   isOnlyHead = true
    // }
    attachments = fileData.map((file)=>{
    let fileContent = Buffer.from(file.buffer).toString('base64')
    return { filename: file.originalname,content:fileContent,encoding: 'base64', contentType:file.mimetype }; 
    });
    const mailData = await fetchEmailContent('active_biller_application_pdf2xml','DE');
    const mailMessage = mailData.message;
    const mailSubject = mailData.subject;
    /* customerSubject = 'Antrag für PDF2XML';
    customerMessage =`Lieber Kunde
       <br><br>
       <div>Besten Dank für das Ausfüllen des Formulars und für die zugestellten Dokumente. Wir werden diese prüfen und uns so bald als möglich wieder bei dir melden.</div><br>
       <div>Mit freundlichen Grüssen</div>
       <div>Ihr io-market Team</div><br>` */
    await sendEmail({
      email: config.MARKET_PLACE_ADMIN_EMAIL,
      subject: mailSubject,
      message: mailMessage,
      attachments:attachments
    });
    
    return res.status(200).json({
        status_code: 200,
        message: 'send_attachment_successfully',
        status: true,
    }); 
  } catch (error) {
    console.log('error',error);
    
     commonErrors['errorTitle'] = req.originalUrl;
     commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+req.body;
     warningMessage(commonErrors,error);
     return res.status(200).json({
         status_code: 500,
         code:error,
         message: 'something_went_wrong',
         status: false,
     });  
  }
 } 
 const getEbillInvoice = async (req,res)=>{
  let cookie = null
  // let encrToken = encryptionControl.decrypt(req.body.encrToken);
  let encrToken = req.body;

  let netcomId = encrToken.netcomId;
  let data = encrToken;

  const pool = await connectPostgres;
  try {
    cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
    let accessToken = cookie.access_Token;
    let isBexioUser = cookie.isBexioUser;
    const bexioPool = await postgresBexio;
    let resultData = [],tempStatus = false;
    let totalCount;
    let sortColumn = 'updated_at';
    let sortType = 'asc';

    /* let totalCount = await invoiceListCount(accessToken);
    if(!totalCount){
      res.send({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
      });
      return;
    }
    console.log('totalCount',totalCount); */
    let showFrom = req.body.records_per_page * (req.body.page_number-1);
    let showTo = req.body.records_per_page;
    sortColumn = req.body?.sortColumn;
    sortType = req.body?.sort;

    const selectInvoiceStatus = `SELECT * FROM documents_invoice_send ds 
    INNER JOIN companyregistered c ON ds.fk_companyregistered = c.cid
    WHERE c.netcomid = $1 AND ds.invoicetype = 'EBILL'`;
    const invoiceList = await bexioPool.query(selectInvoiceStatus, [netcomId]);


    // const getNetcomIdQry = `SELECT * FROM  companyregistered 
    // WHERE rk_party = $1`;
    // const getNetcomId = await bexioPool.query(getNetcomIdQry, [partyId]);
    // console.log('partyId',partyId);

    // console.log('getNetcomIdQry',getNetcomIdQry);
    // console.log('getNetcomId',getNetcomId.rows[0].netcomid);

    // NEW

    // const getInviteCompanyIdQry = `SELECT array_agg(pa.cid) AS cid FROM
    // party_account pa
    // WHERE pa.fk_party = $1`
    // let getInviteCompanyId = await pool.query(getInviteCompanyIdQry,[partyId]);
  
    // console.log('getInviteCompanyId.rows[0].cid',getInviteCompanyId.rows[0].cid);
  
    // const getConnectionStatus = `SELECT  array_agg(rk_businessconnection) AS bcConnection FROM
    //   contact_bc cb
    //   WHERE cb.rk_party_account IN(${getInviteCompanyId.rows[0].cid})
    //   AND type = 'EDI'
    //   AND rk_businessconnection IS NOT NULL`
    // let getConnectionStatusList = await bexioPool.query(getConnectionStatus);
    // // console.log('getConnectionStatusList.rows[0].bcConnection',getConnectionStatusList.rows[0].bcconnection);
    // // console.log('invoiceList.rows[0].netcomid',invoiceList.rows[0].netcomid);
    // console.log('bcDetails12121222');
    // let bcDetails;
    // bcDetails = await getBcDetails(getConnectionStatusList.rows[0].bcconnection,getNetcomId.rows[0].netcomid);

    // console.log('bcDetails12121222',bcDetails['data']);
    let tempBc = [];
    // tempBc.push([0]['bc_id']);

    // tempBc.push(bcDetails['data'].filter((e,idx) => (e['company_details']['doc_type']['data'] == 'Invoice')[idx]['bc_id']))

    // console.log('tempBc',tempBc);
    tempBc.push(0);
    // if(bcDetails){
    //   for (let index = 0; index < bcDetails['data'].length; index++) {
    //     const element = bcDetails['data'][index];
    //     if(element['company_details']['doc_type']['data'] == 'Invoice'){
    //       tempBc.push(element['bc_id'])
    //     }
        
    //   }
    // }
 
    // console.log('tempBc',tempBc);
    
    const getContactBcQry = `SELECT  array_agg(rk_contact) FROM contact_bc c INNER JOIN companyregistered cr
     ON cr.cid = c.fk_companyregistered
     WHERE "type"='EBILL' AND  cr.netcomid='${netcomId}'`
      
    // console.log('getConnectionBc',getContactBcQry);

    let getContactBcQryReslt = await bexioPool.query(getContactBcQry);
    // console.log('getConnectionBc',getContactBcQryReslt.rows);
    // if(){
      let contactArray = getContactBcQryReslt.rows[0].array_agg;

    // }
    // console.log('contactArray',contactArray);
    
    if(isBexioUser)
    {
    
      let options;
 

      // if(data['documentNo'] != '' || data['invoiceTitle'] != '' || data['dateFrom'] != '' || data['dateTo'] != '' || data['comapnyUser'] != '' || data['invoiceStatus'] == 'Yes' || data['invoiceStatus'] == 'No')
      // {
        const getSendInvoiceQry = `SELECT array_agg(rk_invoice) AS invoiceId FROM documents_invoice_send ds
        INNER JOIN companyregistered c ON c.cid = ds.fk_companyregistered
        WHERE c.netcomid = '${netcomId}'
        AND  invoicetype = 'EBILL' 
        ${data.shippingStatus ? ` AND ds.status = ${data.shippingStatus}` : ''}`
        let getSendInvoiceList = await bexioPool.query(getSendInvoiceQry);
        // console.log("getSendInvoiceQry",getSendInvoiceList.rows[0].invoiceid);

        let searchJson = [];
         
        if(data['documentNo'] != '' && data['documentNo']){
          searchJson.push({
            "field":"document_nr",
            "value": data.documentNo,
            "criteria":"like"
          })
        }
        if(data['invoiceTitle'] != '' && data['invoiceTitle']){
          searchJson.push({
            "field":"title",
            "value":data.invoiceTitle,
            "criteria":"like"
          })
        }
       
        if( data['dateFrom'] != "" && data['dateFrom']){
          searchJson.push({
            "field":"is_valid_from",
            "value" :new Date(data.dateFrom),
            "criteria":">="
          })
        }
        if( data['dateTo'] != "" && data['dateTo']){
          searchJson.push({
            "field":"is_valid_from",
            "value":new Date(data.dateTo),
            "criteria":"<="
          })
        }
        if(data['comapnyUser'] != '' && data['comapnyUser']){


          searchJson.push({
            "field":"user_id",
            "value":data.comapnyUser,
            "criteria":"="
          })
        }
        if(data['invoiceStatus'] == 'Yes'){

          // console.log('typeof',contactArray==null);
          
          searchJson.push(
          //   {
          //   "field":"contact_id",
          //   "value":contactArray==null ? "" : contactArray,
          //   "criteria":"in"
          // },
          {
            "field":"id",
            "value":getSendInvoiceList.rows[0].invoiceid ? getSendInvoiceList.rows[0].invoiceid : "",
            "criteria":"in"
          })
        }
        // console.log("data['invoiceStatus']",data['invoiceStatus']);
        
        if(data['invoiceStatus'] == 'No'){
          
          searchJson.push(
          //   {
          //   "field":"contact_id",
          //   "value":contactArray==null ? "" : contactArray,
          //   "criteria":"in"
          // },
          {
            "field":"id",
            "value":getSendInvoiceList.rows[0].invoiceid ? getSendInvoiceList.rows[0].invoiceid : "",
            "criteria":"not_in"
          })
        }
        // searchJson.push({
        //   "field":"contact_id",
        //   "value":contactArray==null ? "" : contactArray,
        //   "criteria":"in"
        // })
        if(data['shippingStatus'] != ''){
          
          searchJson.push(
          {
            "field":"id",
            "value":getSendInvoiceList.rows[0].invoiceid ? getSendInvoiceList.rows[0].invoiceid : "",
            "criteria":"in"
          })
        }
       
        if(req.body.contactId != ''){
          contactArray = [];
          contactArray.push(req.body.contactId);
          searchJson.push({
            "field":"contact_id",
            "value":contactArray,
            "criteria":"in"
          })
        }else{
          searchJson.push({
            "field":"contact_id",
            "value":contactArray,
            "criteria":"in"
          })
        }
       
        // console.log('searchJsonsearchJson',searchJson.length);
        // if(searchJson.length != 0)
        // {
          totalCount = await invoiceCountSearch(accessToken,searchJson,0,2000)
          options = {
            'method': 'POST',
            'url': `${config.BEXIO_API}2.0/kb_invoice/search/?limit=${showTo}&offset=${showFrom}&order_by=${sortColumn}_${sortType}`,
            // 'url': `${config.BEXIO_API}2.0/kb_invoice/search`,
           
            'headers': {
              'Accept': 'application/json',
              'Authorization': 'Bearer '+accessToken
            },
            body: JSON.stringify(searchJson)
          };
          console.log('options1111',options);
          
        // }else{
        //   totalCount = await invoiceListCountSearch(accessToken,0,2000);
        //   options = {
            
        //     'method': 'GET',
        //     // 'url': `${config.BEXIO_API}2.0/kb_invoice`,
        //     'url': `${config.BEXIO_API}2.0/kb_invoice/?limit=${showTo}&offset=${showFrom}&order_by=${sortColumn}_${sortType}`,
        //     'headers': {
        //       'Accept': 'application/json',
        //       'Authorization': 'Bearer '+accessToken
        //     }
  
        //   }; 
        // }
      
        // console.log('totalCount',options);
        // console.log('totalCount',totalCount);
      
        // totalCount = await  contactListCountSearch(accessToken,0,2000);

      // }
      // else{
      //   totalCount = await invoiceListCountSearch(accessToken,0,2000);
      //   options = {
      //     'method': 'GET',
      //     // 'url': `${config.BEXIO_API}2.0/kb_invoice`,
      //     'url': `${config.BEXIO_API}2.0/kb_invoice/?limit=${showTo}&offset=${showFrom}&order_by=${sortColumn}_${sortType}`,
      //     'headers': {
      //       'Accept': 'application/json',
      //       'Authorization': 'Bearer '+accessToken
      //     }

      //   }; 
      // }  
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
        if(response.statusCode != 200)
        return res.status(200).json({
          status: true,
          status_code : response.statusCode,
          data: [],
          message: 'unauthorized',
        });
        //'url': `${config.BEXIO_API}2.0/kb_invoice?order_by=updated_at_desc`,
        let status = JSON.parse(config.BEXIO_INVOICE_STATUS);
        let contact_idList = [];
        for (let invoice in resData) {
          tempStatus = false;
          // resultArray?resData[invoice]['allowSend'] = resultArray.includes((resData[invoice].contact_id).toString()) ? true:false:false;
          resData[invoice]['allowSend'] = "true";
          contact_idList.push((resData[invoice].contact_id));
          resData[invoice]['statusLabel'] = status[resData[invoice].kb_item_status_id];
          resData[invoice]['timestamp'] = '';
          //resData[invoice]['companyName'] = resData[invoice]['contact_address'].split("\n")[0];
          resData[invoice]['rk_globaltransaction'] = '';
          resData[invoice]['status'] = '';
          resData[invoice]['statusLabelInvoice'] = '';     
          
          // console.log('invoiceList.rows',invoiceList.rows);
          

          for(let qryInvoice in invoiceList.rows ){
            

              
              if(invoiceList.rows[qryInvoice]['rk_invoice'] == resData[invoice]['id']){
                
                resData[invoice]['rk_globaltransaction'] = invoiceList.rows[qryInvoice]['rk_globaltransaction'];
                resData[invoice]['status'] = invoiceList.rows[qryInvoice]['status'];
                resData[invoice]['statusLabelInvoice'] = JSON.parse(config.INVOICE_STATUS)[invoiceList.rows[qryInvoice]['status']];
                resData[invoice]['timestamp'] = invoiceList.rows[qryInvoice]['timestamp'];
                resData[invoice]['type'] = invoiceList.rows[qryInvoice]['type'];
                resData[invoice]['response'] = invoiceList.rows[qryInvoice]['response'];
                // console.log("invoiceList.rows[qryInvoice]['status']",invoiceList.rows[qryInvoice]['status']);
                
                if(invoiceList.rows[qryInvoice]['status'] == 2)
                {
                  resData[invoice]['allowSend'] = false;
                }else{
                  resData[invoice]['allowSend'] = true;
                }
                if(!tempStatus && invoiceList.rows[qryInvoice]['type'] == 'EBILL'){
                  tempStatus = true;
                }
                break;
            }
            // else
              // resultData.push(resData[invoice]);
          }
          if(!tempStatus){
            // console.log('12332145',resData[invoice]);
            
            resData[invoice]['isEbill'] = true;
            
          }else{
            resData[invoice]['isEbill'] = false;
            resData[invoice]['allowSend'] = false;

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
        if(currency)
        {
          currency?.forEach(element => {
            currencyList[element.id] = element.name;
          });
        }
      
        resultData?.forEach((second) => {
          second.companyName = contactNameList[second["contact_id"]];
          second.currency = currencyList[second['currency_id']];
        });
        let keys = Object.keys(req.body)
        // let redisKey = req.url+"_"+req.body.partyId+"_";
        let redisKey = req.body.netcomid+"_"+req.url+"_";
        // console.log('redisKey',redisKey);
        keys.forEach(element => {
            redisKey = req.body[element]? redisKey +element+':'+ req.body[element] + '_' : redisKey
        });
        await redisClient.setex(redisKey,24*60*60*2,JSON.stringify({
          status: 200,
          data:resData,
          totalCount:totalCount
        } ));
        
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
  
    logs.action = 'GET_INVOICE';
    logs.level = 'ERROR';
    logs.item = 'EBILL';
    // //addlogs(logs,data.rolePartyId,data.roleAccId);
    // console.log(error);
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+cookie;
    warningMessage(commonErrors,error);
    return res
    .status(200)
    .json({ status: 500, message: 'something_went_wrong' });
      
  }
}  

const getEbillInvoicePdf = async (req,res)=>{
  console.log('555555555555555555555555555');
  
  // try {
    let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
    let accessToken = cookie.access_Token;
    let invoiceId = req.body?.invoiceId ? req.body?.invoiceId : 1;
    
    // let isBexioUser = cookie.isBexioUser;
    // if(isBexioUser)
    // {
    // return new Promise( async (resolve, reject) => {
      var options = {
        'method': 'GET',
        'url': `https://api.bexio.com/2.0/kb_invoice/${invoiceId}/pdf`,
        'headers': {
          'Accept': 'application/json',
          'Authorization': 'Bearer '+accessToken
        }
      };
      request(options, function (error, response) {
        console.log('errorerror',error);
        console.log('responseresponseresponse',response);
        
        if (error) {  
          commonErrors['errorTitle'] = 'getInvoicePdf';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+invoiceId;
          warningMessage(commonErrors,error);{
            return res
            .status(200)
            .json({ status: 500, message: 'something_went_wrong' });
          }
          // resolve(false)
        }
        if(response.statusCode==200){
          console.log('555555555555555555555555555555555555555555555555555555555555555555555555');
          
          return res
          .status(200)
          .json({ status: 200,data: JSON.parse(response.body).content});
        }
        //  resolve(response.body);
        else{
          return res
          .status(200)
          .json({ status: 500, message: 'something_went_wrong' });
        }
        //  resolve(false);

      });
    // }else{
    //   return false;
    // }
  // })
   
  // } catch (error) {
  //     commonErrors['errorTitle'] = getInvoicePdf.name;
  //     commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+req.body;
  //     warningMessage(commonErrors,error);
  //     return false;

      
  // }
}


const getEbillDetails = async (req,res)=>{
  let encrToken = null
  try {
     encrToken = encryptionControl.decrypt(req.body.encrToken);
    const netcomId = encrToken.netcomId;
    const documentnumber = encrToken.documentnumber || null
    const status = encrToken.status || null
    const referenceNumber = encrToken.referenceNumber || null
    let likeValue = '%'; 
    let documentValue;
    let statusValue;
    let referenceValue;
     if(documentnumber == null){
      documentValue = likeValue+likeValue
     }
     else{
      documentValue = likeValue+documentnumber+likeValue
     }
     if(status == null){
      statusValue = likeValue+likeValue
    }
    else{
      statusValue = likeValue+status+likeValue
    }
    if(referenceNumber == null){
      referenceValue = likeValue+likeValue
    }
    else{
      referenceValue = likeValue+referenceNumber+likeValue
    }
    const validation = async (encrToken) => {
      if (!(encrToken.netcomId)) {
        return true;
      }
      else {
        return false
      }
    };
    let validationResult = await validation(encrToken);
  
    if (!validationResult) {
      const pool = await dbConn;
      const getBiller = `SELECT b.billerid  FROM biller b 
      WHERE b.netcomid = '${netcomId}'`;
      const getBillerData = await pool.query(getBiller)
      if (getBillerData.recordset.length) {
        const getInvoiceDetails = `SELECT c.bc_created
            ,c.bc_lastupdate
            ,c.billerid
            ,b.legalname
            ,c.referencenumber
            ,c.documentnumber
            ,c.businesscaseid
            ,c.status
            ,c.totalamount
            ,r.firstName + ' ' + r.name AS recipient
            ,c.responseInfo
            ,c.type
            ,c.recipientInfo
            ,ROW_NUMBER() OVER (order by bc_created DESC) as RowNumber  FROM bc c
          INNER JOIN biller b ON b.id = c.fk_biller
          LEFT JOIN recipient r ON ((c.recipientInfo = r.email OR c.recipientInfo = r.recipientId) AND b.id = r.fk_biller) 
          WHERE b.billerid ='${getBillerData.recordset[0].billerid}'
          AND c.documentnumber LIKE '${documentValue}' AND c.status LIKE '${statusValue}' AND c.referenceNumber LIKE '${referenceValue}'`;
        const getInvoiceData = await pool.query(getInvoiceDetails);
        if(getInvoiceData.recordset.length){
          getInvoiceData.recordset.forEach(element => {
            element.bc_created = element.bc_created ? element.bc_created.toISOString().replace('Z', ''):element.bc_created
            element.bc_lastupdate = element.bc_lastupdate ? element.bc_lastupdate.toISOString().replace('Z', ''):element.bc_lastupdate
          });
        }
        
        if (getInvoiceData.recordset.length) {
          return res.status(200).json({
            data: getInvoiceData.recordset,
            status_code: 200,
            message: 'invoice_details',
            status: true,
          });
        }
        else {
          return res.status(200).json({
            data: [],
            status_code: 200,
            message: 'no_data_found',
            status: true,
          });
        }
      }
      else {
        return res.status(200).json({
          data: [],
          status_code: 200,
          message: 'no_active_biller_found',
          status: true,
        });
      }
    }
    else {
      return res.status(500).json({
        status_code: 500,
        message: 'empty_or_null_netcomId',
        status: false,
      });
    }
  }
  catch (error) {
    let responseValue = JSON.stringify(encrToken)
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
  const sendBulkEbill = async (req,res)=>{

    
    try {
      const pool = await dbConn;
      const poolPg = await postgresBexio;
      let bexioPool = await postgresBexio;
      
      const getRecipientQry = `SELECT refreshtoken FROM companyregistered WHERE
      netcomId = '${req.body.netcomId}'`;
      const getRecipient = await poolPg.query(getRecipientQry);

      let tokenSet = await bexioClient.refresh(getRecipient?.rows[0]?.refreshtoken);

      let tempJson = JSON.parse(req.body.invoiceId)
    
      for (let index = 0; index < tempJson.length; index++) {
        const element = tempJson[index];
        const getRecipientQry = `SELECT recipientid,c.refreshtoken FROM contact_bc cb INNER JOIN companyregistered c ON c.cid = cb.fk_companyregistered 
        WHERE rk_contact = ${element.contactId}
        AND c.netcomId = '${req.body.netcomId}'`;
        
        const getRecipient = await poolPg.query(getRecipientQry);
        
        element['recipientid'] = getRecipient?.rows[0]?.recipientid;
        element['accessToken'] = tokenSet['access_token'];
      }
        const getBiller = `SELECT billerid  FROM biller  
        WHERE netcomid = '${req.body.netcomId}'
        AND status = 'ACTIVE'`;
        const getBillerData = await pool.query(getBiller)
      
      if(getBillerData.recordset.length > 0){
        const worker = new Worker("./src/common/utils/worker.js", {
          workerData: {billerId:getBillerData?.recordset[0]?.billerid,invoices:JSON.stringify(tempJson)}
      });
      }

      let bexioTokenCookie = { 
        access_Token:tokenSet.access_token,
        refresh_Token:tokenSet.refresh_token,
        isBexioUser:true
      
      }
      const updateRefreshToken = `UPDATE companyregistered SET refreshtoken = $1
      WHERE rk_csn = $2`
       let rk_csn = jwt.decode(tokenSet.access_token)['company_id']
        await bexioPool.query(updateRefreshToken, [tokenSet.refresh_token,rk_csn]);

      res.cookie(config.TOKEN_COOKIE_BEXIO_NAME, encryptionControl.encrypt(JSON.stringify(bexioTokenCookie)), {
        domain: config.SESSION_DOMAIN,
        maxAge: config.SESSION_EXPIRY,
        httpOnly: true,
        signed: true,
        secure: true
    });
    // res.send({ status: true })
    } catch (error) {
      console.log('error',error);
      
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
    
    
    res.send({})
  }
function pushBulkInvoice(invoices) {

 console.log('pushBulkInvoicepushBulkInvoicepushBulkInvoice',invoices);
 let temp = {};
 temp['body']['uid'] = '123654789'
 pushTest(temp,'ytrewq')
}
const pushTest = async (req,res)=>{
  let tokenSet = await bexioClient.refresh('eyJhbGciOiJub25lIn0.eyJqdGkiOiJjODY4YWI4ZC1kMzcwLTQzYWMtYjdhNC0wYjdiODg3MjA1ZTgifQ.');
  console.log('tokenSet',tokenSet);
  console.log('reqreqreqreqreqreqreqreqreq11',req.body);
  res?.send({})
}
const pushInvoiceTest3 = async (req,res)=>{

  let formData
  try {
    formData = req.body;

    console.log('pushInvoiceFormData',formData);
    console.log('req.url',req.url);
  //   return res?.status(200).json({
  //     data: '',
  //     status_code: 200,
  //     message: 'success',
  //     status: true,
  // });
  } catch (error) {
    try {
      console.log('req.url',req.url);
    //   return res?.status(200).json({
    //     data: '',
    //     status_code: 200,
    //     message: 'success',
    //     status: true,
    // });
    } catch (error) {
    console.log('pushInvoiceFormData2',error);
    return res?.status(500).json({
      data: '',
      status_code: 200,
      message: 'error',
      status: true,
  });
    }
    console.log('errorPushInvoice1',error);
    return res?.status(500).json({
      data: '',
      status_code: 200,
      message: 'error',
      status: true,
  });
  }
let cookie;
try {
    let status,errorMsg,tokenSet;
    let invoice,paymentType,companyDetails;
    const pool = await connectPostgres;
    let bexioPool = await postgresBexio;
    const ebillPool = await connectEbill;
    const decryptData = req.body;
    const invoice_id = decryptData.invoice_id;
    const biller_pid = decryptData.biller_pid;
    const contact_pid = decryptData.contact_pid;
    const invoice_uuid = decryptData?.invoice_uuid;

    let billerDetails = {
      'recipientid':decryptData.contact_pid,
      'billerid':decryptData.biller_pid
    }

    let getBiller = `SELECT * 
      FROM biller
      WHERE billerid  = '${decryptData.biller_pid}'
      AND status = 'ACTIVE'`
    let getBillerResult = await ebillPool.query(getBiller);
    console.log('7777777');
    
    
    
   
    if(getBillerResult.recordset.length == 0)
    {
      let invoiceCid:any;
      // invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
      let objectId = crypto.randomBytes(15).toString('hex');
      logs.action = 'PUSHINVOICE';
      logs.objectid = objectId;
      logs.rk_party_application_version = '';
      logs.rk_objectid = invoiceCid;
      logs.level = 'ERROR';
      logs.item = 'EBILL';
      logs.companyName = '';
      logs.user.name = '';
      logs.user.email = '';
      logs.application.name = '';
      logs.application.version = '';
      logs.timestamp = new Date().toString();
      logs['rk_object'] = invoiceCid;
      //addlogs(logs);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'biller_not_found '+'-req param,'+JSON.stringify(decryptData);
      warningMessage(commonErrors,'biller_not_found');
      res?.send({
        status_code: 500,
        message: 'biller_not_found',
        status: false,
     });
    return
    }
    console.log('getBillerResult222',getBillerResult.recordset[0]);
    const qrySelectRefreshToken = `SELECT * FROM companyregistered 
    WHERE refreshtoken IS NOT NULL AND netcomid = '${getBillerResult.recordset[0].netcomid}'`
    const result = await bexioPool.query(qrySelectRefreshToken);
    const partyId = result.rows[0].rk_party;
    console.log('resultresultresult',result);
    
    // const qryGetCompanyName = `SELECT companyname FROM 
    //   legalparty WHERE fk_party=  ${partyId}`
    // const resultCompanyName = await bexioPool.query(qryGetCompanyName);

    
    const qryGetCompanyDetails = ` SELECT pa.cid,lp.companyname,a.code AS app,av.version AS appversion
      FROM partyapplication pa 
        INNER JOIN application_version av ON av.cid = pa.fk_application_version  
        INNER JOIN application a ON a.cid = av.fk_application
        INNER JOIN legalparty lp ON lp.fk_party = pa.fk_party
      WHERE pa.fk_party = ${partyId} AND a.code = 'EBILL'`
    const companyDetailsResult = await pool.query(qryGetCompanyDetails);
    console.log('getBillerResult.recordset[0]',getBillerResult.recordset[0]);

    console.log('companyDetailsResult123',companyDetailsResult.rows[0]);

    console.log('getBillerResult.recordset[0].companyJSON',getBillerResult.recordset[0].companyJSON);
    console.log('JSON.parse(getBillerResult.recordset[0].companyJSON)',JSON.parse(getBillerResult.recordset[0].companyJSON));
    let companyJson = JSON.parse(getBillerResult.recordset[0].companyJSON);
    console.log('125478');
    
    let defaultLang = companyJson['localizedData']['defaultLanguage'];
    console.log('companyJson',companyJson['localizedData'][defaultLang]['emailAddress']);
    let tempCompanyName = companyJson['legalName'];
    let tempMail = companyJson['localizedData'][defaultLang]['emailAddress'];

    
  // const checkRecipientValid = async (billerid, pid) => {
  //   return new Promise(async (resolve, reject) => {
  //     const correlationId = crypto.randomBytes(15).toString('hex');
  //     let data = {
  //       items: [{
  //         'billRecipientId': pid,
  //       }]
  //     }
  //     const options = {
  //       method: 'POST',
  //       url: config.SIX_API_CERTIFICATE_BASE + `billers/${billerid}/bill-recipients/search`,
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'x-networkpartner-id': config.NETWORK_PARTNER_ID,
  //         'X-Correlation-Id': correlationId,
  //       },
  //       body: JSON.stringify(data),
  //       key: fs.readFileSync(config.CERTIFICATE_PATH + config.SIX_API_KEY),
  //       cert: fs.readFileSync(config.CERTIFICATE_PATH + config.SIX_API_CERTIFICATE)
  //     };
  //     console.log(options);
      
  //     await request(options, async function (error, response) {
  //       if (error) {
  //         resolve(false)
  //       }
  //       else {
  //         if (response.statusCode == 200) {
  //           let resData = JSON.parse(response.body)
  //           console.log(resData);
  //           console.log(resData.items[0].ebillSubmissionStatus);
  //           if (resData.items[0].ebillSubmissionStatus != 'NOT_ALLOWED') {
  //             resolve(true)
  //           }
  //           else {
  //             resolve(false)
  //           }
  //         }
  //         else {
  //           resolve(false)
  //         }
  //       }
  //     })
  //   })
  // }
  // Revert this changes for live, commented for test only 
  // let checkRecipientData = await checkRecipientValid(decryptData.biller_pid,decryptData.contact_pid);

  let checkRecipientData = true;
  console.log("checkRecipientData----",checkRecipientData);
  if (!checkRecipientData) {
    // await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR')
    // await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR-INTERNAL','Dieser "Kontakt" hat Sie als Rechnungssteller bisher noch nicht abonniert. Bitte kontaktieren Sie Ihren Kunden.')
    await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR-INTERNAL','Dieser "Kontakt" hat Sie als Rechnungssteller bisher noch nicht abonniert. Bitte kontaktieren Sie Ihren Kunden.',getBillerResult.recordset[0].netcomid)
    let invoiceCid:any;
    invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
    let objectId = crypto.randomBytes(15).toString('hex');
    logs.action = 'PUSHINVOICE';
    logs.objectid = objectId;
    logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
    logs.rk_objectid = invoiceCid;
    logs.level = 'ERROR';
    logs.item = 'EBILL';
    logs.companyName = companyDetailsResult.rows[0].companyname;
    logs.user.name = '';
    logs.user.email = '';
    logs.application.name = companyDetailsResult.rows[0].app;
    logs.application.version = companyDetailsResult.rows[0].appversion;
    logs.timestamp = new Date().toString();
    logs['rk_object'] = invoiceCid;
    //addlogs(logs);
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) +' comapny_name '+tempCompanyName+ ' email_id '+tempMail + ' recipientId_not_allowed' + '-req param,' + JSON.stringify(decryptData);
    console.log('commonErrorscommonErrors',commonErrors);
  
    warningMessage(commonErrors, 'recipientId_not_allowed');
    res?.send({
      status_code: 500,
      message: 'recipientId_not_allowed',
      status: false,
    });
    return
  }

    console.log('tokenSet',result.rows[0]);
    if(result.rows.length == 0)
    {
      console.log('inside tokenSet');
      
      let invoiceCid:any;
      // await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR')

      invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
      let objectId = crypto.randomBytes(15).toString('hex');
      logs.action = 'PUSHINVOICE';
      logs.objectid = objectId;
      logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
      logs.rk_objectid = invoiceCid;
      logs.level = 'ERROR';
      logs.item = 'EBILL';
      logs.companyName = companyDetailsResult.rows[0].companyname;
      logs.user.name = '';
      logs.user.email = '';
      logs.application.name = companyDetailsResult.rows[0].app;
      logs.application.version = companyDetailsResult.rows[0].appversion;
      logs.timestamp = new Date().toString();
      logs['rk_object'] = invoiceCid;
      //addlogs(logs);
      console.log('result.rowserrorerror',result.rows);

      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'refreshToken_not_found '+'-req param,'+JSON.stringify(decryptData);
      warningMessage(commonErrors,'refreshToken_not_found');
      res?.send({
        status_code: 500,
        message: 'refreshToken_not_found',
        status: false,
     });
    return
    }
    // let accessToken = cookie.access_Token;
    // const partyId = result.rows[0].rk_party;
    // const accountId = decryptData.accountId;
    // const invoiceId = decryptData.invoiceId;
    let accessToken = '';
    if('token' in decryptData){
      accessToken = decryptData.token;
      
    }else{
      try {
     
        tokenSet = await bexioClient.refresh(result.rows[0].refreshtoken);
        accessToken = tokenSet.access_token;
        // }, 1000);
        
      } catch (error) {
        console.log('444444444444444444444444',error);
        
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'refreshToken_not_found '+'-req param,'+JSON.stringify(decryptData);
        warningMessage(commonErrors,'refreshToken_not_found');
        res?.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
        return
      }
    }
  
    console.log('tokenSet1234',tokenSet);
    const invoiceId = decryptData.invoice_id;
   
    invoice = await getInvoiceOT(accessToken,invoiceId);
    console.log('invoice',invoice);
    if(!invoice)
    {
      let invoiceCid:any;
      // await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR-INTERNAL','Invoice Not Found')

      invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
      let objectId = crypto.randomBytes(15).toString('hex');
      logs.action = 'PUSHINVOICE';
      logs.objectid = objectId;
      logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
      logs.rk_objectid = invoiceCid;
      logs.level = 'ERROR';
      logs.item = 'EBILL';
      logs.companyName = companyDetailsResult.rows[0].companyname;
      logs.user.name = '';
      logs.user.email = '';
      logs.application.name = companyDetailsResult.rows[0].app;
      logs.application.version = companyDetailsResult.rows[0].appversion;
      logs.timestamp = new Date().toString();
      logs['rk_object'] = invoiceCid;
      //addlogs(logs);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_invoice_not_found '+'-req param,'+JSON.stringify(decryptData);
      warningMessage(commonErrors,'ebill_invoice_not_found');
      res?.send({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
      });
      return
    }
    // Revert this changes for live, commented for test only 
    let recipentStatus;
    if(config.IS_LIVE == 'true')
    {
       recipentStatus = await checkRecipient(decryptData.biller_pid,decryptData.contact_pid,invoice.contact_id,accessToken)
    }else{

     recipentStatus =true;
  }
    console.log("#######recipentStatus####",recipentStatus);
    if(!recipentStatus) 
    {
      let invoiceCid:any;
      // await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR-INTERNAL','Dieser "Kontakt" hat Sie als Rechnungssteller bisher noch nicht abonniert. Bitte kontaktieren Sie Ihren Kunden.')
      await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR-INTERNAL','Dieser "Kontakt" hat Sie als Rechnungssteller bisher noch nicht abonniert. Bitte kontaktieren Sie Ihren Kunden.',getBillerResult.recordset[0].netcomid)
      invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
      let objectId = crypto.randomBytes(15).toString('hex');
      logs.action = 'PUSHINVOICE';
      logs.objectid = objectId;
      logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
      logs.rk_objectid = invoiceCid;
      logs.level = 'ERROR';
      logs.item = 'EBILL';
      logs.companyName = companyDetailsResult.rows[0].companyname;
      logs.user.name = '';
      logs.user.email = '';
      logs.application.name = companyDetailsResult.rows[0].app;
      logs.application.version = companyDetailsResult.rows[0].appversion;
      logs.timestamp = new Date().toString();
      logs['rk_object'] = invoiceCid;
      //addlogs(logs);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_Recipient_not_found '+'-req param,'+JSON.stringify(decryptData);
      warningMessage(commonErrors,'ebill_Recipient_not_found');
      res?.send({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
      });
      return
    }
    // console.log('invoice',invoice);
    console.log('partyId',partyId);
    // console.log('accountId',accountId);
    // console.log('contact_id',invoice.contact_id);

    // let invitionData = await getEbillConnectionDetails(partyId,accountId,invoice.contact_id,req);
    // console.log(invitionData);
    // let customerIds = await constGetContactId(invitionData[0].rk_businessconnection);
    // console.log(customerIds);
    // console.log('invitionData',invitionData);
    
    // if(invitionData != undefined)
    // {
      
      let pdf,fileName,pdfContent;
      pdf = await getInvoicePdf(accessToken,invoiceId);
      if(!pdf)
      {
        let invoiceCid:any;
        // await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR-INTERNAL','PDF Not Found')

        invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
        let objectId = crypto.randomBytes(15).toString('hex');
        logs.action = 'PUSHINVOICE';
        logs.objectid = objectId;
        logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
        logs.rk_objectid = invoiceCid;
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        logs.companyName = companyDetailsResult.rows[0].companyname;
        logs.user.name = '';
        logs.user.email = '';
        logs.application.name = companyDetailsResult.rows[0].app;
        logs.application.version = companyDetailsResult.rows[0].appversion;
        logs.timestamp = new Date().toString();
        logs['rk_object'] = invoiceCid;
        //addlogs(logs);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_pdf_not_found '+'-req param,'+JSON.stringify(decryptData);
        warningMessage(commonErrors,'ebill_pdf_not_found');
        console.log('pdf');
        res?.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
      
        });
        return
      
      }
      pdfContent = JSON.parse(pdf).content;
      fileName = JSON.parse(pdf).name;
      // let pdf ='dasd'
      // console.log(invitionData[0]);
      let coutryList;
      coutryList = await getCountryLists(accessToken);
      if(!coutryList)
      {
        let invoiceCid:any;
        // await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR')
        // invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
        let objectId = crypto.randomBytes(15).toString('hex');
        logs.action = 'PUSHINVOICE';
        logs.objectid = objectId;
        logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
        logs.rk_objectid = invoiceCid;
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        logs.companyName = companyDetailsResult.rows[0].companyname;
        logs.user.name = '';
        logs.user.email = '';
        logs.application.name = companyDetailsResult.rows[0].app;
        logs.application.version = companyDetailsResult.rows[0].appversion;
        logs.timestamp = new Date().toString();
        logs['rk_object'] = invoiceCid;
        // //addlogs(logs);

        console.log('coutryList');
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_coutryList_not_found '+'-req param,'+JSON.stringify(decryptData);
        // warningMessage(commonErrors,'ebill_coutryList_not_found');
        res?.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
      
        });
        return
      }
      coutryList = JSON.parse(coutryList);
      // let bank
      // bank = await getBank(accessToken,invoice.bank_account_id);
      // if(!bank)
      // {
      //   res?.send({
      //     status_code: 500,
      //     message: 'something_went_wrong',
      //     status: false,
      
      // });
      // return
      // }
      // invoice['bank'] = 'iban_nr' in bank ? bank : '';
      // if('iban_nr' in bank)
      // {
      //   invoice['bank'] = bank;
      // }else{
      //   res?.send({
      //     status_code: 500,
      //     message: 'bexio_bank_error',
      //     status: false,
      //   });
      //   return
      // }
      console.log('123');
      console.log('invoice.currency_id',invoice.currency_id);
      
      let currency = await getCurrency(accessToken,invoice.currency_id);
      if(!currency)
      {
        let invoiceCid:any;
        // await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR')

        invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
        let objectId = crypto.randomBytes(15).toString('hex');
        logs.action = 'PUSHINVOICE';
        logs.objectid = objectId;
        logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
        logs.rk_objectid = invoiceCid;
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        logs.companyName = companyDetailsResult.rows[0].companyname;
        logs.user.name = '';
        logs.user.email = '';
        logs.application.name = companyDetailsResult.rows[0].app;
        logs.application.version = companyDetailsResult.rows[0].appversion;
        logs.timestamp = new Date().toString();
        logs['rk_object'] = invoiceCid;
        //addlogs(logs);

        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_currency_not_found '+'-req param,'+JSON.stringify(decryptData);
        warningMessage(commonErrors,'ebill_currency_not_found');
        res?.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
      
        });
        return
      }
      invoice['currency'] = currency;
      let temp = await getloginUserCompanyDetails(accessToken);
      console.log(temp);
      

      if(!temp)
      {
        let invoiceCid:any;
        // await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR-INTERNAL','User Details Not found')

        invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
        let objectId = crypto.randomBytes(15).toString('hex');
        logs.action = 'PUSHINVOICE';
        logs.objectid = objectId;
        logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
        logs.rk_objectid = invoiceCid;
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        logs.companyName = companyDetailsResult.rows[0].companyname;
        logs.user.name = '';
        logs.user.email = '';
        logs.application.name = companyDetailsResult.rows[0].app;
        logs.application.version = companyDetailsResult.rows[0].appversion;
        logs.timestamp = new Date().toString();
        logs['rk_object'] = invoiceCid;
        //addlogs(logs);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_companyDetails_not_found '+'-req param,'+JSON.stringify(decryptData);
        warningMessage(commonErrors,'ebill_companyDetails_not_found');
        res?.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
        return;
      }
      invoice['companyProfile'] = temp;
      invoice['companyProfile'] = JSON.parse(invoice['companyProfile']);
      // paymentType = await getPaymentType(accessToken,invoice.payment_type_id);
      paymentType = true;
      if(!paymentType)
      {
        let invoiceCid:any;
        // await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR-INTERNAL','payment details not found')

        invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
        let objectId = crypto.randomBytes(15).toString('hex');
        logs.action = 'PUSHINVOICE';
        logs.objectid = objectId;
        logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
        logs.rk_objectid = invoiceCid;
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        logs.companyName = companyDetailsResult.rows[0].companyname;
        logs.user.name = '';
        logs.user.email = '';
        logs.application.name = companyDetailsResult.rows[0].app;
        logs.application.version = companyDetailsResult.rows[0].appversion;
        logs.timestamp = new Date().toString();
        logs['rk_object'] = invoiceCid;
        //addlogs(logs);

        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_paymentType_not_found '+'-req param,'+JSON.stringify(decryptData);
        warningMessage(commonErrors,'ebill_paymentType_not_found');
        res?.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
      
        });
        return
      
      }
      // let tempPaymentType = paymentType.filter(e => e.id == invoice.payment_type_id);
      invoice['paymentType'] = true;
      let contact = await getContact(accessToken,invoice.contact_id);
      if(!contact)
      {
        let invoiceCid:any;
        // await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR')

        invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
        let objectId = crypto.randomBytes(15).toString('hex');
        logs.action = 'PUSHINVOICE';
        logs.objectid = objectId;
        logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
        logs.rk_objectid = invoiceCid;
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        logs.companyName = companyDetailsResult.rows[0].companyname;
        logs.user.name = '';
        logs.user.email = '';
        logs.application.name = companyDetailsResult.rows[0].app;
        logs.application.version = companyDetailsResult.rows[0].appversion;
        logs.timestamp = new Date().toString();
        logs['rk_object'] = invoiceCid;
        //addlogs(logs);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_contact_not_found '+'-req param,'+JSON.stringify(decryptData);
        warningMessage(commonErrors,'ebill_contact_not_found');
        res?.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
      
        });
        return
      
      }
      invoice['contact'] = contact;
      // let user = await getUser(accessToken,invoice.user_id);
      let user = true

      if(!user)
      {
        let invoiceCid:any;
        // await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR-INTERNAL')

        invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
        let objectId = crypto.randomBytes(15).toString('hex');
        logs.action = 'PUSHINVOICE';
        logs.objectid = objectId;
        logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
        logs.rk_objectid = invoiceCid;
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        logs.companyName = companyDetailsResult.rows[0].companyname;
        logs.user.name = '';
        logs.user.email = '';
        logs.application.name = companyDetailsResult.rows[0].app;
        logs.application.version = companyDetailsResult.rows[0].appversion;
        logs.timestamp = new Date().toString();
        logs['rk_object'] = invoiceCid;
        //addlogs(logs);

        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_user_not_found '+'-req param,'+JSON.stringify(decryptData);
        warningMessage(commonErrors,'ebill_user_not_found');
        res?.send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
      
        });
        return
      
      }
      invoice['user'] = user;
      // companyDetails = await getloginUserCompanyDetails(accessToken)
     
      if(invoice.positions.length != 0)
      {
        for (const items of invoice.positions) {
          console.log('items.tax_id',items.tax_id);
          if(items.tax_id){
            let tempTax = await getTaxs(accessToken,items.tax_id);
            if(!tempTax)
            {
              commonErrors['errorTitle'] = req.originalUrl;
              commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_tax_not_found '+'-req param,'+JSON.stringify(decryptData);
              warningMessage(commonErrors,'ebill_tax_not_found');
              res?.send({
                status_code: 500,
                message: 'something_went_wrong',
                status: false,
              });
              return
            }
            items['tax'] = tempTax;
          }
          
          
          let tempItem;
          console.log('tempItem',tempItem);
          if('article_id' in items)
          {
            tempItem = await getProducts(accessToken,items.article_id);
            items['article'] = tempItem;
            // console.log('articleas',items['article']);
            
          }else{
            console.log('items',items);
            
            items['article'] = {}
            items['article']['intern_name'] = items.text;
            items['article']['intern_description'] = items.text;

          }
          // return
          // if(!tempItem)
          // {
          //   res?.send({
          //     status_code: 500,
          //     message: '',
          //     status: false,
          
          // });
          // return
          // }
        
        }
      }else{
        let items = {};
        items['article'] = {}
        items['article']['intern_name'] = 'Dummy Name';
        items['article']['intern_description'] = 'Dummy Desccription';
        invoice.positions.push(items);
      }  

      // console.log('pdfpdf',pdf);
      // console.log('final',JSON.stringify(invoice));
      
      
      //  console.log('invoice',JSON.stringify(invoice));
      // console.log('invoiceinvoice',invoice);
      let xml;
      // let invoiceCid:any;
      decryptData['bank_id'] = 'bank_account_id' in invoice ? invoice['bank_account_id'] : '';
      let invoiceCidSucess = await setEbillInvoiceSendStatus(partyId,invoiceId,invoice['document_nr'],decryptData,'1');
      xml = await setInvoiceEbillOt(invoice,coutryList,'',pdfContent,fileName,'',billerDetails,decryptData,invoiceCidSucess);

      // xml = await setInvoiceEbillOt(invoice,coutryList,invitionData[0],pdfContent,fileName,customerIds,invoiceCid,netcomdId,);
      // file drp
      //  console.log('xml',xml);
      if(xml == false){
        // let invoiceCid:any;
        // invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
        // let updateQry =`UPDATE 
        // documents_invoice_send
        //   SET status = $1
        // WHERE objectid = $2`
        // await bexioPool.query(updateQry,['0',invoiceCidSucess]);
        let invoiceCid:any;
      //   await notifiBexio(result.rows[0].refreshtoken,decryptData.invoice_id,'ERROR-INTERNAL','Diese Rechnung enthält keine gültige Bankverbindungen. Bitte prüfen Sie die IBAN unter "Banking".',getBillerResult.recordset[0].netcomid);
        invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
        let objectId = crypto.randomBytes(15).toString('hex');
        logs.action = 'PUSHINVOICE';
        logs.objectid = objectId;
        logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
        logs.rk_objectid = invoiceCid;
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        logs.companyName = companyDetailsResult.rows[0].companyname;
        logs.user.name = '';
        logs.user.email = '';
        logs.application.name = companyDetailsResult.rows[0].app;
        logs.application.version = companyDetailsResult.rows[0].appversion;
        logs.timestamp = new Date().toString();
        logs['rk_object'] = invoiceCid;
        //addlogs(logs);

        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_xml_not_found '+'-req param,'+JSON.stringify(decryptData);
        warningMessage(commonErrors,'ebill_xml_not_found');
        res?.send({
          status_code: 500,
          message: 'invoice_error',
          status: false,
        });
        return
      }

      // let invoiceCid = await setEbillInvoiceSendStatus(partyId,invoiceId,invoice['document_nr'],decryptData);

      await invoiceFilePush(getBillerResult.recordset[0].netcomid,'WS',xml,invoice['document_nr'],'EBILL');
 
          res?.send({
            status_code: 200,
            message: '',
            status: true,
        });
      
    //   }else{
    //     res?.send({
    //       status_code: 500,
    //       message: 'invoice_push_error',
    //       status: false,
    //   });
    // }


  } catch (error) {
        console.log('error',error);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+formData;
        warningMessage(commonErrors,error);
      res?.send({
        status_code: 500,
        message: '',
        status: false,
      });
  }

}
const pushInvoiceTest2 = async (req,res)=>{
  return new Promise(async(resolve, reject) => {
    const decryptData = req.body;
    const invoice_id = decryptData.invoice_id;
    // setTimeout(() => {
      
    // }, 1000);
    for (let index = 0; index < 10000000; index++) {
      
    }
    console.log('end2');
    resolve(true)
  });

 

  //  res?.send({})
}
const pushInvoiceTest1 = async (req,res)=>{

  return new Promise(async(resolve, reject) => {
  
      let formData
      try {
      formData = req.body;
  
      console.log('pushInvoiceFormData1111',formData);
      //console.log('req.url',req.url);
      //   return res?.status(200).json({
      //     data: '',
      //     status_code: 200,
      //     message: 'success',
      //     status: true,
      // });
      } catch (error) {
      try {
          //console.log('req.url',req.url);
      //   return res?.status(200).json({
      //     data: '',
      //     status_code: 200,
      //     message: 'success',
      //     status: true,
      // });
      } catch (error) {
      //console.log('pushInvoiceFormData2',error);
      resolve(false)
      }
      //console.log('errorPushInvoice1',error);
      resolve(false)

      }
  let cookie;
  try {
      let status,errorMsg,tokenSet;
      let invoice,paymentType,companyDetails;
      const pool = await connectPostgres;
      let bexioPool = await postgresBexio;
      const ebillPool = await connectEbill;
      const decryptData = req.body;
      const invoice_id = decryptData.invoice_id;
      const biller_pid = decryptData.biller_pid;
      const contact_pid = decryptData.contact_pid;
      const invoice_uuid = decryptData?.invoice_uuid;
      console.log('decryptData',decryptData);
      
      let billerDetails = {
          'recipientid':decryptData.contact_pid,
          'billerid':decryptData.biller_pid
      }
  
      let getBiller = `SELECT * 
          FROM biller
          WHERE billerid  = '${decryptData.biller_pid}'
          AND status = 'ACTIVE'`
      let getBillerResult = await ebillPool.query(getBiller);
      //console.log('7777777');
      
      
      
      const qrySelectRefreshToken = `SELECT * FROM companyregistered 
      WHERE refreshtoken IS NOT NULL AND netcomid = '${getBillerResult.recordset[0].netcomid}'`
      const result = await bexioPool.query(qrySelectRefreshToken);
      const partyId = result.rows[0].rk_party;

      if(getBillerResult.recordset.length == 0)
      {
          let invoiceCid:any;
          invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0','biller_not_found');
          let objectId = crypto.randomBytes(15).toString('hex');
          logs.action = 'PUSHINVOICE';
          logs.objectid = objectId;
          logs.rk_party_application_version = '';
          logs.rk_objectid = invoiceCid;
          logs.level = 'ERROR';
          logs.item = 'EBILL';
          logs.companyName = '';
          logs.user.name = '';
          logs.user.email = '';
          logs.application.name = '';
          logs.application.version = '';
          logs.timestamp = new Date().toString();
          logs['rk_object'] = invoiceCid;
          //addlogs(logs);
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'biller_not_found '+'-req param,'+JSON.stringify(decryptData);
          warningMessage(commonErrors,'biller_not_found');
         
          resolve('biller_not_found')

      return
      }
      //console.log('getBillerResult222',getBillerResult.recordset[0]);

      //console.log('resultresultresult',result);
      
      // const qryGetCompanyName = `SELECT companyname FROM 
      //   legalparty WHERE fk_party=  ${partyId}`
      // const resultCompanyName = await bexioPool.query(qryGetCompanyName);
  
      
      const qryGetCompanyDetails = ` SELECT pa.cid,lp.companyname,a.code AS app,av.version AS appversion
          FROM partyapplication pa 
          INNER JOIN application_version av ON av.cid = pa.fk_application_version  
          INNER JOIN application a ON a.cid = av.fk_application
          INNER JOIN legalparty lp ON lp.fk_party = pa.fk_party
          WHERE pa.fk_party = ${partyId} AND a.code = 'EBILL'`
      const companyDetailsResult = await pool.query(qryGetCompanyDetails);
      //console.log('getBillerResult.recordset[0]',getBillerResult.recordset[0]);
  
      //console.log('companyDetailsResult123',companyDetailsResult.rows[0]);
  
      //console.log('getBillerResult.recordset[0].companyJSON',getBillerResult.recordset[0].companyJSON);
      //console.log('JSON.parse(getBillerResult.recordset[0].companyJSON)',JSON.parse(getBillerResult.recordset[0].companyJSON));
      let companyJson = JSON.parse(getBillerResult.recordset[0].companyJSON);
      //console.log('125478');
      
      let defaultLang = companyJson['localizedData']['defaultLanguage'];
      //console.log('companyJson',companyJson['localizedData'][defaultLang]['emailAddress']);
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
          //console.log(options);
          
          await request(options, async function (error, response) {
            if (error) {
              resolve(false)
            }
            else {
              if (response.statusCode == 200) {
                let resData = JSON.parse(response.body)
                //console.log(resData);
                //console.log(resData.items[0].ebillSubmissionStatus);
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
      // Revert this changes for live, commented for test only 
      let checkRecipientData;
      if(config.IS_LIVE == 'true'){
         checkRecipientData = await checkRecipientValid(decryptData.biller_pid,decryptData.contact_pid);
      }else{
         checkRecipientData = true;

      }
  
      console.log("checkRecipientData----",checkRecipientData);
      if (!checkRecipientData) {
      // await notifiBexioBulk(decryptData.token,decryptData.invoice_id,'ERROR')
      // await notifiBexioBulk(decryptData.token,decryptData.invoice_id,'ERROR-INTERNAL','Dieser "Kontakt" hat Sie als Rechnungssteller bisher noch nicht abonniert. Bitte kontaktieren Sie Ihren Kunden.')
      await notifiBexioBulk(decryptData.token,decryptData.invoice_id,'ERROR-INTERNAL','Dieser "Kontakt" hat Sie als Rechnungssteller bisher noch nicht abonniert. Bitte kontaktieren Sie Ihren Kunden.',getBillerResult.recordset[0].netcomid)
      let invoiceCid:any;
      invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0','recipientId_not_allowed');
      let objectId = crypto.randomBytes(15).toString('hex');
      logs.action = 'PUSHINVOICE';
      logs.objectid = objectId;
      logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
      logs.rk_objectid = invoiceCid;
      logs.level = 'ERROR';
      logs.item = 'EBILL';
      logs.companyName = companyDetailsResult.rows[0].companyname;
      logs.user.name = '';
      logs.user.email = '';
      logs.application.name = companyDetailsResult.rows[0].app;
      logs.application.version = companyDetailsResult.rows[0].appversion;
      logs.timestamp = new Date().toString();
      logs['rk_object'] = invoiceCid;
      //addlogs(logs);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) +' comapny_name '+tempCompanyName+ ' email_id '+tempMail + ' recipientId_not_allowed' + '-req param,' + JSON.stringify(decryptData);
      //console.log('commonErrorscommonErrors',commonErrors);
      
      warningMessage(commonErrors, 'recipientId_not_allowed');
    
      resolve('recipientId_not_allowed')
      return
      }
  
      //console.log('tokenSet',result.rows[0]);
      if(result.rows.length == 0)
      {
          //console.log('inside tokenSet');
          
          let invoiceCid:any;
          // await notifiBexioBulk(decryptData.token,decryptData.invoice_id,'ERROR')
  
          invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
          let objectId = crypto.randomBytes(15).toString('hex');
          logs.action = 'PUSHINVOICE';
          logs.objectid = objectId;
          logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
          logs.rk_objectid = invoiceCid;
          logs.level = 'ERROR';
          logs.item = 'EBILL';
          logs.companyName = companyDetailsResult.rows[0].companyname;
          logs.user.name = '';
          logs.user.email = '';
          logs.application.name = companyDetailsResult.rows[0].app;
          logs.application.version = companyDetailsResult.rows[0].appversion;
          logs.timestamp = new Date().toString();
          logs['rk_object'] = invoiceCid;
          //addlogs(logs);
          //console.log('result.rowserrorerror',result.rows);
  
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'refreshToken_not_found '+'-req param,'+JSON.stringify(decryptData);
          warningMessage(commonErrors,'refreshToken_not_found');
       
          resolve('refreshToken_not_found')

      return
      }
      // let accessToken = cookie.access_Token;
      // const partyId = result.rows[0].rk_party;
      // const accountId = decryptData.accountId;
      // const invoiceId = decryptData.invoiceId;
      let accessToken = '';
      if('token' in decryptData){
          accessToken = decryptData.token;
          
      }else{
          // try {
      
          // tokenSet = await bexioClient.refresh(decryptData.token);
          // accessToken = tokenSet.access_token;
          // // }, 1000);
          
          // } catch (error) {
          // //console.log('444444444444444444444444',error);
          
          // commonErrors['errorTitle'] = req.originalUrl;
          // commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'refreshToken_not_found '+'-req param,'+JSON.stringify(decryptData);
          // warningMessage(commonErrors,'refreshToken_not_found');
          // resolve('refreshToken_not_found')

          // }
          }
      
      //console.log('tokenSet1234',tokenSet);
      const invoiceId = decryptData.invoice_id;
      console.log('accessToken',accessToken);
      console.log('invoiceId',invoiceId);
      
      invoice = await getInvoiceOT(accessToken,invoiceId);
      console.log('invoice',invoice);
      if(!invoice)
      {
          let invoiceCid:any;
          // await notifiBexioBulk(decryptData.token,decryptData.invoice_id,'ERROR-INTERNAL','Invoice Not Found')
  
          invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0','something_went_wrong');
          let objectId = crypto.randomBytes(15).toString('hex');
          logs.action = 'PUSHINVOICE';
          logs.objectid = objectId;
          logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
          logs.rk_objectid = invoiceCid;
          logs.level = 'ERROR';
          logs.item = 'EBILL';
          logs.companyName = companyDetailsResult.rows[0].companyname;
          logs.user.name = '';
          logs.user.email = '';
          logs.application.name = companyDetailsResult.rows[0].app;
          logs.application.version = companyDetailsResult.rows[0].appversion;
          logs.timestamp = new Date().toString();
          logs['rk_object'] = invoiceCid;
          //addlogs(logs);
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_invoice_not_found '+'-req param,'+JSON.stringify(decryptData);
          warningMessage(commonErrors,'ebill_invoice_not_found');
          resolve('something_went_wrong')

      }
      // Revert this changes for live, commented for test only 
  
      //console.log("#######recipentStatus####",recipentStatus);
      let recipentStatus;
      if(config.IS_LIVE == 'true'){
        recipentStatus = await checkRecipient(decryptData.biller_pid,decryptData.contact_pid,invoice.contact_id,accessToken)
      }else{
        recipentStatus = true;
      }
      if(!recipentStatus) 
      {
          let invoiceCid:any;
          // await notifiBexioBulk(decryptData.token,decryptData.invoice_id,'ERROR-INTERNAL','Dieser "Kontakt" hat Sie als Rechnungssteller bisher noch nicht abonniert. Bitte kontaktieren Sie Ihren Kunden.')
          await notifiBexioBulk(decryptData.token,decryptData.invoice_id,'ERROR-INTERNAL','Dieser "Kontakt" hat Sie als Rechnungssteller bisher noch nicht abonniert. Bitte kontaktieren Sie Ihren Kunden.',getBillerResult.recordset[0].netcomid)
          invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0','ebill_Recipient_not_found');
          let objectId = crypto.randomBytes(15).toString('hex');
          logs.action = 'PUSHINVOICE';
          logs.objectid = objectId;
          logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
          logs.rk_objectid = invoiceCid;
          logs.level = 'ERROR';
          logs.item = 'EBILL';
          logs.companyName = companyDetailsResult.rows[0].companyname;
          logs.user.name = '';
          logs.user.email = '';
          logs.application.name = companyDetailsResult.rows[0].app;
          logs.application.version = companyDetailsResult.rows[0].appversion;
          logs.timestamp = new Date().toString();
          logs['rk_object'] = invoiceCid;
          //addlogs(logs);
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_Recipient_not_found '+'-req param,'+JSON.stringify(decryptData);
          warningMessage(commonErrors,'ebill_Recipient_not_found');
          resolve('something_went_wrong2')

      }
      // //console.log('invoice',invoice);
      //console.log('partyId',partyId);
      // //console.log('accountId',accountId);
      // //console.log('contact_id',invoice.contact_id);
  
      // let invitionData = await getEbillConnectionDetails(partyId,accountId,invoice.contact_id,req);
      // //console.log(invitionData);
      // let customerIds = await constGetContactId(invitionData[0].rk_businessconnection);
      // //console.log(customerIds);
      // //console.log('invitionData',invitionData);
      
      // if(invitionData != undefined)
      // {
          
          let pdf,fileName,pdfContent;
          pdf = await getInvoicePdf(accessToken,invoiceId);
          if(!pdf)
          {
          let invoiceCid:any;
          // await notifiBexioBulk(decryptData.token,decryptData.invoice_id,'ERROR-INTERNAL','PDF Not Found')
  
          invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0','something_went_wrong');
          let objectId = crypto.randomBytes(15).toString('hex');
          logs.action = 'PUSHINVOICE';
          logs.objectid = objectId;
          logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
          logs.rk_objectid = invoiceCid;
          logs.level = 'ERROR';
          logs.item = 'EBILL';
          logs.companyName = companyDetailsResult.rows[0].companyname;
          logs.user.name = '';
          logs.user.email = '';
          logs.application.name = companyDetailsResult.rows[0].app;
          logs.application.version = companyDetailsResult.rows[0].appversion;
          logs.timestamp = new Date().toString();
          logs['rk_object'] = invoiceCid;
          //addlogs(logs);
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_pdf_not_found '+'-req param,'+JSON.stringify(decryptData);
          warningMessage(commonErrors,'ebill_pdf_not_found');
          //console.log('pdf');
          resolve('something_went_wrong')

          
          }
          pdfContent = JSON.parse(pdf).content;
          fileName = JSON.parse(pdf).name;
          // let pdf ='dasd'
          // //console.log(invitionData[0]);
          let coutryList;
          coutryList = await getCountryLists(accessToken);
          if(!coutryList)
          {
            let invoiceCid:any;
            // await notifiBexioBulk(decryptData.token,decryptData.invoice_id,'ERROR')
            // invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
            let objectId = crypto.randomBytes(15).toString('hex');
            logs.action = 'PUSHINVOICE';
            logs.objectid = objectId;
            logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
            logs.rk_objectid = invoiceCid;
            logs.level = 'ERROR';
            logs.item = 'EBILL';
            logs.companyName = companyDetailsResult.rows[0].companyname;
            logs.user.name = '';
            logs.user.email = '';
            logs.application.name = companyDetailsResult.rows[0].app;
            logs.application.version = companyDetailsResult.rows[0].appversion;
            logs.timestamp = new Date().toString();
            logs['rk_object'] = invoiceCid;
            // //addlogs(logs);
    
            //console.log('coutryList');
            commonErrors['errorTitle'] = req.originalUrl;
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_coutryList_not_found '+'-req param,'+JSON.stringify(decryptData);
            // warningMessage(commonErrors,'ebill_coutryList_not_found');
            resolve('something_went_wrong')

          }
          coutryList = JSON.parse(coutryList);
          // let bank
          // bank = await getBank(accessToken,invoice.bank_account_id);
          // if(!bank)
          // {
          //   res?.send({
          //     status_code: 500,
          //     message: 'something_went_wrong',
          //     status: false,
          
          // });
          // return
          // }
          // invoice['bank'] = 'iban_nr' in bank ? bank : '';
          // if('iban_nr' in bank)
          // {
          //   invoice['bank'] = bank;
          // }else{
          //   res?.send({
          //     status_code: 500,
          //     message: 'bexio_bank_error',
          //     status: false,
          //   });
          //   return
          // }
          //console.log('123');
          //console.log('invoice.currency_id',invoice.currency_id);
          
          let currency = await getCurrency(accessToken,invoice.currency_id);
          if(!currency)
          {
            let invoiceCid:any;
            // await notifiBexioBulk(decryptData.token,decryptData.invoice_id,'ERROR')
    
            invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0','something_went_wrong');
            let objectId = crypto.randomBytes(15).toString('hex');
            logs.action = 'PUSHINVOICE';
            logs.objectid = objectId;
            logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
            logs.rk_objectid = invoiceCid;
            logs.level = 'ERROR';
            logs.item = 'EBILL';
            logs.companyName = companyDetailsResult.rows[0].companyname;
            logs.user.name = '';
            logs.user.email = '';
            logs.application.name = companyDetailsResult.rows[0].app;
            logs.application.version = companyDetailsResult.rows[0].appversion;
            logs.timestamp = new Date().toString();
            logs['rk_object'] = invoiceCid;
            //addlogs(logs);
    
            commonErrors['errorTitle'] = req.originalUrl;
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_currency_not_found '+'-req param,'+JSON.stringify(decryptData);
            warningMessage(commonErrors,'ebill_currency_not_found');
            resolve('something_went_wrong')

          }
          invoice['currency'] = currency;
          let temp = await getloginUserCompanyDetails(accessToken);
          //console.log(temp);
          
  
          if(!temp)
          {
            let invoiceCid:any;
            // await notifiBexioBulk(decryptData.token,decryptData.invoice_id,'ERROR-INTERNAL','User Details Not found')
    
            invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0','something_went_wrong');
            let objectId = crypto.randomBytes(15).toString('hex');
            logs.action = 'PUSHINVOICE';
            logs.objectid = objectId;
            logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
            logs.rk_objectid = invoiceCid;
            logs.level = 'ERROR';
            logs.item = 'EBILL';
            logs.companyName = companyDetailsResult.rows[0].companyname;
            logs.user.name = '';
            logs.user.email = '';
            logs.application.name = companyDetailsResult.rows[0].app;
            logs.application.version = companyDetailsResult.rows[0].appversion;
            logs.timestamp = new Date().toString();
            logs['rk_object'] = invoiceCid;
            //addlogs(logs);
            commonErrors['errorTitle'] = req.originalUrl;
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_companyDetails_not_found '+'-req param,'+JSON.stringify(decryptData);
            warningMessage(commonErrors,'ebill_companyDetails_not_found');
            resolve('something_went_wrong')

          }
          invoice['companyProfile'] = temp;
          invoice['companyProfile'] = JSON.parse(invoice['companyProfile']);
          // paymentType = await getPaymentType(accessToken,invoice.payment_type_id);
          paymentType = true;
          if(!paymentType)
          {
            let invoiceCid:any;
            // await notifiBexioBulk(decryptData.token,decryptData.invoice_id,'ERROR-INTERNAL','payment details not found')
    
            invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0','something_went_wrong');
            let objectId = crypto.randomBytes(15).toString('hex');
            logs.action = 'PUSHINVOICE';
            logs.objectid = objectId;
            logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
            logs.rk_objectid = invoiceCid;
            logs.level = 'ERROR';
            logs.item = 'EBILL';
            logs.companyName = companyDetailsResult.rows[0].companyname;
            logs.user.name = '';
            logs.user.email = '';
            logs.application.name = companyDetailsResult.rows[0].app;
            logs.application.version = companyDetailsResult.rows[0].appversion;
            logs.timestamp = new Date().toString();
            logs['rk_object'] = invoiceCid;
            //addlogs(logs);
    
            commonErrors['errorTitle'] = req.originalUrl;
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_paymentType_not_found '+'-req param,'+JSON.stringify(decryptData);
            warningMessage(commonErrors,'ebill_paymentType_not_found');
            resolve('something_went_wrong')

          
          }
          // let tempPaymentType = paymentType.filter(e => e.id == invoice.payment_type_id);
          invoice['paymentType'] = true;
          let contact = await getContact(accessToken,invoice.contact_id);
          if(!contact)
          {
            let invoiceCid:any;
            // await notifiBexioBulk(decryptData.token,decryptData.invoice_id,'ERROR')
    
            invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0','something_went_wrong');
            let objectId = crypto.randomBytes(15).toString('hex');
            logs.action = 'PUSHINVOICE';
            logs.objectid = objectId;
            logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
            logs.rk_objectid = invoiceCid;
            logs.level = 'ERROR';
            logs.item = 'EBILL';
            logs.companyName = companyDetailsResult.rows[0].companyname;
            logs.user.name = '';
            logs.user.email = '';
            logs.application.name = companyDetailsResult.rows[0].app;
            logs.application.version = companyDetailsResult.rows[0].appversion;
            logs.timestamp = new Date().toString();
            logs['rk_object'] = invoiceCid;
            //addlogs(logs);
            commonErrors['errorTitle'] = req.originalUrl;
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_contact_not_found '+'-req param,'+JSON.stringify(decryptData);
            warningMessage(commonErrors,'ebill_contact_not_found');
            resolve('something_went_wrong')

          
          }
          invoice['contact'] = contact;
          // let user = await getUser(accessToken,invoice.user_id);
          let user = true
  
          if(!user)
          {
            let invoiceCid:any;
            // await notifiBexioBulk(decryptData.token,decryptData.invoice_id,'ERROR-INTERNAL')
    
            invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0','something_went_wrong');
            let objectId = crypto.randomBytes(15).toString('hex');
            logs.action = 'PUSHINVOICE';
            logs.objectid = objectId;
            logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
            logs.rk_objectid = invoiceCid;
            logs.level = 'ERROR';
            logs.item = 'EBILL';
            logs.companyName = companyDetailsResult.rows[0].companyname;
            logs.user.name = '';
            logs.user.email = '';
            logs.application.name = companyDetailsResult.rows[0].app;
            logs.application.version = companyDetailsResult.rows[0].appversion;
            logs.timestamp = new Date().toString();
            logs['rk_object'] = invoiceCid;
            //addlogs(logs);
    
            commonErrors['errorTitle'] = req.originalUrl;
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_user_not_found '+'-req param,'+JSON.stringify(decryptData);
            warningMessage(commonErrors,'ebill_user_not_found');
            resolve('something_went_wrong')

          
          }
          invoice['user'] = user;
          // companyDetails = await getloginUserCompanyDetails(accessToken)
      
          if(invoice.positions.length != 0)
          {
          for (const items of invoice.positions) {
              //console.log('items.tax_id',items.tax_id);
              if(items.tax_id){
              let tempTax = await getTaxs(accessToken,items.tax_id);
              if(!tempTax)
              {
                  commonErrors['errorTitle'] = req.originalUrl;
                  commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_tax_not_found '+'-req param,'+JSON.stringify(decryptData);
                  warningMessage(commonErrors,'ebill_tax_not_found');
                  resolve('something_went_wrong10')

              }
              items['tax'] = tempTax;
              }
              
              
              let tempItem;
              //console.log('tempItem',tempItem);
              if('article_id' in items)
              {
              tempItem = await getProducts(accessToken,items.article_id);
              items['article'] = tempItem;
              // //console.log('articleas',items['article']);
              
              }else{
              //console.log('items',items);
              
              items['article'] = {}
              items['article']['intern_name'] = items.text;
              items['article']['intern_description'] = items.text;
  
              }
              // return
              // if(!tempItem)
              // {
              //   res?.send({
              //     status_code: 500,
              //     message: '',
              //     status: false,
              
              // });
              // return
              // }
          
          }
          }else{
          let items = {};
          items['article'] = {}
          items['article']['intern_name'] = 'Dummy Name';
          items['article']['intern_description'] = 'Dummy Desccription';
          invoice.positions.push(items);
          }  
  
          // //console.log('pdfpdf',pdf);
          // //console.log('final',JSON.stringify(invoice));
          
          
          //  //console.log('invoice',JSON.stringify(invoice));
          // //console.log('invoiceinvoice',invoice);
          let xml;
          // let invoiceCid:any;
          decryptData['bank_id'] = 'bank_account_id' in invoice ? invoice['bank_account_id'] : '';
          let invoiceCidSucess = await setEbillInvoiceSendStatus(partyId,invoiceId,invoice['document_nr'],decryptData,'1');
          xml = await setInvoiceEbillOt(invoice,coutryList,'',pdfContent,fileName,'',billerDetails,decryptData,invoiceCidSucess);
  
          // xml = await setInvoiceEbillOt(invoice,coutryList,invitionData[0],pdfContent,fileName,customerIds,invoiceCid,netcomdId,);
          // file drp
          //  //console.log('xml',xml);
          if(xml == false){
            // let invoiceCid:any;
            // invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0');
            // let updateQry =`UPDATE 
            // documents_invoice_send
            //   SET status = $1
            // WHERE objectid = $2`
            // await bexioPool.query(updateQry,['0',invoiceCidSucess]);
            let invoiceCid:any;
            //   await notifiBexioBulk(decryptData.token,decryptData.invoice_id,'ERROR-INTERNAL','Diese Rechnung enthält keine gültige Bankverbindungen. Bitte prüfen Sie die IBAN unter "Banking".',getBillerResult.recordset[0].netcomid);
            invoiceCid = await setEbillInvoiceSendStatus(partyId,decryptData.invoice_id,'',decryptData,'0','something_went_wrong');
            let objectId = crypto.randomBytes(15).toString('hex');
            logs.action = 'PUSHINVOICE';
            logs.objectid = objectId;
            logs.rk_party_application_version = companyDetailsResult.rows[0].cid;
            logs.rk_objectid = invoiceCid;
            logs.level = 'ERROR';
            logs.item = 'EBILL';
            logs.companyName = companyDetailsResult.rows[0].companyname;
            logs.user.name = '';
            logs.user.email = '';
            logs.application.name = companyDetailsResult.rows[0].app;
            logs.application.version = companyDetailsResult.rows[0].appversion;
            logs.timestamp = new Date().toString();
            logs['rk_object'] = invoiceCid;
            //addlogs(logs);
    
            commonErrors['errorTitle'] = req.originalUrl;
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+'ebill_xml_not_found '+'-req param,'+JSON.stringify(decryptData);
            warningMessage(commonErrors,'ebill_xml_not_found');
            resolve('something_went_wrong')

          }
  
          // let invoiceCid = await setEbillInvoiceSendStatus(partyId,invoiceId,invoice['document_nr'],decryptData);
  
          await invoiceFilePush(getBillerResult.recordset[0].netcomid,'WS',xml,invoice['document_nr'],'EBILL');
          await issueEbillInvoice(accessToken,decryptData.invoice_id);
          await markAsIssues(accessToken,decryptData.invoice_id);
          resolve(true)

      //   }else{
      //     res?.send({
      //       status_code: 500,
      //       message: 'invoice_push_error',
      //       status: false,
      //   });
      // }
  
  
      } catch (error) {
          //console.log('error',error);
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+formData;
          warningMessage(commonErrors,error);
          resolve('something_went_wrong12')

      }
  });    
}
 
const pushInvoiceTestProcess = async (invoices,billerId)=>{

  console.log('workerrrrrrrrrrrrrrr');
  console.log('billerIdbillerId',billerId);
  console.log('deleteKeys',JSON.parse(invoices));

  // apiController.pushBulkInvoice(invoices)
  // console.log(typeof(JSON.parse(invoices)));
  let tempIds = JSON.parse(invoices);
  let tempParam = {
    body:{
      invoice_id:'',
      biller_pid:'',
      contact_pid:'',
      invoice_uuid:'',
      token:''
    }
  };
  // setTimeout(async () => {
    for (let index = 0; index < tempIds.length; index++) {
    
      const element = tempIds[index];
      tempParam['body']['invoice_id'] = element.invoiceId;
      tempParam['body']['biller_pid'] = billerId;
      tempParam['body']['contact_pid'] = element.recipientid;
      tempParam['body']['invoice_uuid'] = '';
      tempParam['body']['token'] = element.accessToken;
      console.log('start');
      let v = await pushInvoiceTest1(tempParam,'')
      console.log('vvv',v);
     
      console.log('end');
  
    }
  // }, 1000);

}
const getEbillContactList = async (req, res) => {

  
  try {

      let bexioPool = await postgresBexio;
      let encrToken = req.body;
      let netcomId = encrToken.netcomId;
      const getContactBcQry = `SELECT  array_agg(rk_contact) FROM contact_bc c INNER JOIN companyregistered cr
      ON cr.cid = c.fk_companyregistered
      WHERE "type"='EBILL' AND  cr.netcomid='${netcomId}'`
      let getContactBcQryReslt = await bexioPool.query(getContactBcQry);
      let contactArray = getContactBcQryReslt.rows[0].array_agg;
      let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
      let accessToken = cookie.access_Token;
      let searchJson = [];
      searchJson.push({
        "field":"id",
        "value":contactArray==null ? "" : contactArray,
        "criteria":"in"
      })
      let options = {
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
      console.log('options22222222222',options);
      
      request(options, function (error, response) {
        console.log('errorerror',error);
        console.log('responseresponseresponse',response.body);
        
        if (error) {  
          commonErrors['errorTitle'] = 'getInvoicePdf';
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,';
          warningMessage(commonErrors,error);{
            return res
            .status(200)
            .json({ status: 500, message: 'something_went_wrong' });
          }
          // resolve(false)
        }
        if(response.statusCode==200){
          console.log('555555555555555555555555555555555555555555555555555555555555555555555555');
          
          return res
          .status(200)
          .json({ status: 200,data:JSON.parse(response.body)});
        }
        //  resolve(response.body);
        else{
          return res
          .status(200)
          .json({ status: 500, message: 'something_went_wrong' });
        }
        //  resolve(false);

      });
  } catch (error) {
    console.log('error',error);
    
  }
  
}

const notifiBexioBulk = async (token,id,status,message?,netcomId?,amount?,bankId?)=>{
  const pool = await connectPostgres;
  let bexioPool = await postgresBexio;

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
  // const tokenSet = await bexioClient.refresh(token);
  // console.log('tokenSet',tokenSet);
  console.log('id',id);
  console.log('status',status);
  await addBexioCommentBulk(token,id,status,erroMsg,netcomId);

  return new Promise(async(resolve, reject) => {
    try {
      console.log('bankId',bankId);
      
      if(status == 'COMPLETED'){
        let isNotifyBexio = true;
        const getCompanyIdQry = `SELECT settings ->>'notifyPayment' AS notify FROM
          companyregistered 
          WHERE netcomid = '${netcomId}'
          AND settings IS NOT NULL
          AND settings ->>'notifyPayment' = 'false'`

        let getCompanyIdQryResult = await bexioPool.query(getCompanyIdQry);
        if(getCompanyIdQryResult.rows.length > 0){
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
          // res.send(response.body)
          //console.log(response.body);
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
          // resolve(false)
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
          // res.send(response.body)
          //console.log(response.body);
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
          // resolve(false)
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


const addBexioCommentBulk = async (token,id,status,message?,netcomId?) => {
  const pool = await connectPostgres;
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
      // const tokenSet = await bexioClient.refresh(refreshToken);
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
      // console.log(options);
        request(options, function (error, response) {
          if (error) {  
            console.log('errorr',error);
         
            commonErrors['errorTitle'] = 'addBexioComment';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+JSON.stringify(parms);
            warningMessage(commonErrors,error);
            resolve(false)
          }
          // res.send(response.body)
          //console.log(response.body);
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
            // commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+response?response.body.toString():''+'-bexio param,'+JSON.stringify(parms);
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
const issueEbillInvoice = async (access_token,id)=>{

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
          // res.send(response.body)
          //console.log(response.body);
          if(response.statusCode==200)
          resolve(JSON.parse(response.body)[0]);
          else
          resolve(false)
        });
      });
}

const markAsIssues = async (access_token,id)=>{

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
          // res.send(response.body)
          //console.log(response.body);
          if(response.statusCode==200)
          resolve(JSON.parse(response.body)[0]);
          else
          resolve(false)
        });
      });
}
const changePayementComments = async (req, res) => {
  let encrToken = req.body;
  
  try {
      let bexioPool = await postgresBexio;
      const getStatusQry =`SELECT settings from companyregistered WHERE rk_party=$1`
      const getStatusQryRslt = await bexioPool.query(getStatusQry,[encrToken.partyId])
     
      console.log('encrToken.payementStatus',encrToken.payementStatus);
      console.log('encrToken.payementStatus',encrToken.commentStatus);
      if(getStatusQryRslt.rows[0].settings!=null)
      {
        if(encrToken.payementStatus == 'true' || encrToken.payementStatus == 'false')
        {
          let payementStatus = encrToken.payementStatus == 'true' ? '"true"' : '"false"';
          console.log('payementStatus',payementStatus);
          const payementStatusQry = `UPDATE companyregistered
              SET settings = jsonb_set(settings::jsonb, '{notifyPayment}', $1::jsonb)
              WHERE rk_party = $2`
          const payementQryRslt =  await bexioPool.query(payementStatusQry,[payementStatus,encrToken.partyId])
        }
        if(encrToken.commentStatus == 'true'|| encrToken.commentStatus == 'false')
        {
          let commentStatus = encrToken.commentStatus == 'true' ? '"true"' : '"false"';
          const commentStatusQry = `UPDATE companyregistered
            SET settings = jsonb_set(settings::jsonb, '{notifyComments}', $1::jsonb)
            WHERE rk_party = $2`
          const commentQryRslt =  await bexioPool.query(commentStatusQry,[commentStatus,encrToken.partyId])
          
        }
      }
      else
      {
        const insertStatusQry = `UPDATE companyregistered
            SET settings = jsonb_set(
                jsonb_set(
                    COALESCE(settings::jsonb, '{}'::jsonb),
                    '{notifyPayment}', '"${encrToken.payementStatus || true}"'::jsonb
                ),
                '{notifyComments}', '"${encrToken.commentStatus || true}"'::jsonb
            )
            WHERE rk_party = $1`
          const insertStatusQryRslt =  await bexioPool.query(insertStatusQry,[encrToken.partyId])
      }
      res.send({
        status_code: 200,
        status: true,
      });
      
  } catch (error) {
    console.log('error',error);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+encrToken;
        warningMessage(commonErrors,error);
      res.send({
        status_code: 500,
        status: false,
      });
    
  }
  
}
const getPayementComments = async (req, res) => {
  let encrToken = req.body;
  
  try {
      let bexioPool = await postgresBexio;
        const getStatusQry =`SELECT COALESCE(settings->>'notifyPayment', 'true') AS notifyPayment,
            COALESCE(settings->>'notifyComments', 'true') AS notifyComments FROM companyregistered where rk_party=$1`
        const getStatusQryRslt = await bexioPool.query(getStatusQry,[encrToken.partyId])
    
      res.send({
        status_code: 200,
        data:getStatusQryRslt.rows[0],
        status: true,
      });
      
  } catch (error) {
    console.log('error',error);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+encrToken;
        warningMessage(commonErrors,error);
      res.send({
        status_code: 500,
        status: false,
      });
    
  }
  
}

const sentNewOrderMails = async (req, res) =>{
  let encrToken = req.body;
  try {
    let bexioPool = await postgresBexio;
    let pool = await connectPostgres;
    const partyId = encrToken.partyId;
    const getStatusQry = `SELECT COALESCE(NULLIF(settings ->> 'notifyOrder', ''), 'false')::boolean AS notifyorder 
                          FROM companyregistered 
                          WHERE rk_party = $1`
    const getStatusQryRslt = await bexioPool.query(getStatusQry,[encrToken.partyId])
    console.log('notifyorder ',getStatusQryRslt.rows[0]);
    if(getStatusQryRslt.rows[0].notifyorder == true){
      
    let getEmail = `SELECT e.email,e.fk_party,pa.fk_account,u."language"
                    FROM email e
                    INNER JOIN party_account pa ON pa.fk_party = e.fk_party
                    INNER JOIN account a ON a.cid = pa.fk_account
                    INNER JOIN "user" u ON u.cid = a.fk_user
                    WHERE e.fk_party = ${partyId}
                    AND e._type = 'company_contact'`;
    const getEmailRslt = await pool.query(getEmail);
    const configData = JSON.parse(config.DEFAULT_CONFIG);
    if( getEmailRslt.rows.length != 0 ){
      const userEmail = getEmailRslt.rows[0].email;
      let keyDatas = {
        order_link: `${config.BEXIO_APP_URL}#/edi/sales/order`
      }
      const language = getEmailRslt.rows[0].language || 'DE';
      const subject_key = 'new_order_notification';
      const { message: mail_message, subject: mail_subject } = await fetchEmailContent(subject_key, language, keyDatas, configData);
      try {
        await sendEmail({
          email: userEmail,
          subject: mail_subject,
          message: mail_message
        });
        res.send({
          status_code: 200,
          status: true,
          message: 'email_sent_success'
        });
      } catch (error) {
        res.send({
          status_code: 500,
          status: false,
          message: 'something_went_wrong'
        });
      }
      
    }
    else{
      res.send({
        status_code: 500,
        status: false,
        message: 'company_contact_not_found'
      });
    }
  }else{
    res.send({
      status_code: 500,
      status: false,
      message: 'mail_disabled'
    });
  }

    
  } catch (error) {
    console.log('sentNewOrderMails Error!!! ',error);
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+encrToken.partyId;
    warningMessage(commonErrors,error);
    res.send({
      status_code: 500,
      status: false,
      message: 'something_went_wrong'
    });
  }
}
const updateOrderMailStatus = async (req, res) => {
  let encrToken = req.body;
  
  try {
      let bexioPool = await postgresBexio;
      const getStatusQry =`SELECT settings from companyregistered WHERE rk_party=$1`
      const getStatusQryRslt = await bexioPool.query(getStatusQry,[encrToken.partyId])
      if(getStatusQryRslt.rows[0].settings!=null)
      {
        // if(encrToken.payementStatus == 'true' || encrToken.payementStatus == 'false')
        // {
          // let payementStatus = encrToken.payementStatus == 'true' ? '"true"' : '"false"';
          // console.log('payementStatus',payementStatus);
          const payementStatusQry = `UPDATE companyregistered
              SET settings = jsonb_set(settings::jsonb, '{notifyOrder}', '"${encrToken.status}"'::jsonb)
              WHERE rk_party = $1`
          const payementQryRslt =  await bexioPool.query(payementStatusQry,[encrToken.partyId])
        // }
     
      }
      else
      {
        const insertStatusQry = `UPDATE companyregistered
            SET settings = jsonb_set(
                    COALESCE(settings::jsonb, '{}'::jsonb),
                    '{notifyOrder}', '"${encrToken.status || true}"'::jsonb
                )
            WHERE rk_party = $1`
          const insertStatusQryRslt =  await bexioPool.query(insertStatusQry,[encrToken.partyId])
      }
      res.send({
        status_code: 200,
        status: true,
      });
      
  } catch (error) {
    console.log('error',error);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+encrToken;
        warningMessage(commonErrors,error);
      res.send({
        status_code: 500,
        status: false,
      });
    
  }
  
}

const getOrderMailSendStatus = async (req, res) => {
  let encrToken = req.body;
  
  try {
      let bexioPool = await postgresBexio;
        const getStatusQry =`SELECT COALESCE(settings->>'notifyOrder', 'true') AS notifyOrderMails
         FROM companyregistered where rk_party=$1`
        const getStatusQryRslt = await bexioPool.query(getStatusQry,[encrToken.partyId])
    
      res.send({
        status_code: 200,
        data:getStatusQryRslt.rows[0],
        status: true,
      });
      
  } catch (error) {
    console.log('error',error);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+encrToken;
        warningMessage(commonErrors,error);
      res.send({
        status_code: 500,
        status: false,
      });
    
  }
  
}

const sendBulkInvoices = async( req, res) => {
  try {
    let bodyData = req.body;
    let bodyParams = {
      "partyId": bodyData.partyId,
      "accountId": bodyData.accountId,
    }
    let invoices:any = bodyData.invoices;   
    let obj = JSON.parse(invoices);

    // console.log('invoicesinvoicesinvoices',invoiceIds);
    // JSON.parse(invoices).forEach(element => {
      
    // });
    async function processInvoices(obj, bodyData) {
      for (let index = 0; index < obj.length; index++) {
        const element = obj[index];
        await setInvoiceSendStatus(bodyData.partyId, element.invoiceId, '', '1', '');
      }
    }
    
    // Call the function with await to ensure it completes before moving on
    await processInvoices(obj, bodyData);
    
    const worker = new Worker('./src/common/utils/sendInvoice_worker.js',{
      workerData: {
        bodyParams : JSON.stringify(bodyParams),
        invoices,
        headerParams: {
          cookies: req.cookies, // Include cookies
          signedCookies: req.signedCookies, // Include signed cookies
          url: req.url
        }        
      }
    })
    
  } catch (error) {
    console.log("error in sendBulkInvoices :: ",error);      
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

const pushInvoiceBulk = async (invoices, bodyValues, headerParams) => {
  console.log("worker processing invoices...");

  bodyValues = JSON.parse(bodyValues);
  let tempIds = JSON.parse(invoices);

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
        invoiceId: element.invoiceId,
      },
    };

    console.log("start processing invoice");
    const result = await pushInvoiceBulkTest(tempParam, "");
    console.log("result:", result);
    console.log("end processing invoice");
  }
};

const pushInvoiceBulkTest = async (req, res)=>{
  return new Promise( async(resolve,reject) => {    
    let cookie = null ;
    let decryptData = null;
    let invoiceCid;
    decryptData = req.body;
    if (!req.body || !req.signedCookies || !decryptData.partyId) {
      return reject('Invalid input data');
    }
    try {
      
      console.log("decryptData ",decryptData);
      let invoice,paymentType,companyDetails;
      let cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
      let accessToken = cookie.access_Token;
      const partyId = decryptData.partyId;
      const accountId = decryptData.accountId;
      const invoiceId = decryptData.invoiceId;
      invoice = await getInvoiceOT(accessToken,invoiceId);

      if( !invoice || !invoice.positions ){
        invoiceCid = await setInvoiceSendStatus(partyId,invoiceId,'','0','invoice_invalid');
        console.log('invoice not found');
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'error_pushInvoiceBulkTest -req param,',JSON.stringify(decryptData);
        warningMessage(commonErrors,'error_getInvoiceOT');
        return resolve('invoice_invalid');
      }

      let invitionData = await getConnectionDetails(partyId,accountId,invoice.contact_id,req);
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
            await deleteRedis(req.url.substr(1,req.url.length),redisKey);
          
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
  })
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
const getOrderList = async (req,res)=>{
  let cookie = null
  let data = req.body;
  const pool = await connectPostgres;
  try {
    cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
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
      let bexioPool = await postgresBexio;
      let g2bPool = await postgresGate2b;
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
          
          const getRegisteredIdQry = `SELECT cid FROM 
          companyregistered WHERE rk_party = $1`
          const getRegisteredId = await bexioPool.query(getRegisteredIdQry,[data.partyId]);

          // const getBcQry = `SELECT array_agg(rk_businessconnection) AS businessconnection FROM documents_invoice_receive
          // WHERE fk_companyregistered = $1 
          //   AND rk_businessconnection IS NOT NULL`

          // const getBc = await bexioPool.query(getBcQry,[getRegisteredId.rows[0].cid]);
          
          const getSenderIdQry = `SELECT l.companyname,gc."netcomId",json_extract_path("ot_updator"::json,'in_custom_id') as sender_custom_id,* 
          FROM g2b_business_connections bc 
            INNER JOIN g2b_connections gc ON gc.id = bc."FK_g2b_connections_IN"
            INNER JOIN ediparty e ON gc."netcomId" = e.netcomid
            INNER JOIN legalParty l ON l.fk_ediparty = e.cid
          WHERE bc.id = $1`
          // const getSenderId = await g2bPool.query(getSenderIdQry);
          // let bcResult = await getBcDetails(getInviteCompanyBcResult.rows[0].cid,dataCookie.netcomId);
          const orderListQry = `SELECT  *  
          FROM(
            SELECT *,ROW_NUMBER() OVER(ORDER BY createddate desc) AS row_number 
            FROM documents_order_receive dor
          WHERE fk_companyregistered = $1
          ` + (data.dateFrom ? `AND date(dor.createddate) >= '${data.dateFrom}'` : '') + `
          ` + (data.dateTo ? `AND date(dor.createddate) <= '${data.dateTo}'` : '') + `
          ` + (data.documentNo ? `AND LOWER(dor.rk_order) LIKE LOWER('%${(data.documentNo)}%')` : '') + `
          ` + (data.orderStatus == "Yes" ? ` AND rk_order IS NOT NULL` : '') +`
          ` + (data.orderStatus == "No" ? ` AND rk_order IS NULL` : '') +`

            ) AS tmpQry
            WHERE row_number BETWEEN $2
            AND $3`
          console.log('orderListQry',orderListQry);

          const orderList = await bexioPool.query(orderListQry,[getRegisteredId.rows[0].cid,showFrom,showTo]);
          
          // const inviteCompanyDelete = `
          //   SELECT *,ROW_NUMBER() OVER(ORDER BY rk_invoice desc) AS row_number 
          //   FROM documents_invoice_receive 
          // WHERE fk_companyregistered = $1
          //   `
          //   const orderList = await bexioPool.query(inviteCompanyDelete,[getRegisteredId.rows[0].cid]);
          const getorderCount = `
            SELECT count(cid) AS total
            FROM documents_order_receive dor
          WHERE fk_companyregistered = $1
          ` + (data.dateFrom ? `AND date(dor.createddate) >= '${data.dateFrom}'` : '') + `
          ` + (data.dateTo ? `AND date(dor.createddate) <= '${data.dateTo}'` : '') + `
          ` + (data.documentNo ? `AND LOWER(dor.rk_order) LIKE LOWER('%${(data.documentNo)}%')` : '') + `
          ` + (data.orderStatus == "Yes" ? ` AND rk_order IS NOT NULL` : '') +`
          ` + (data.orderStatus == "No" ? ` AND rk_order IS NULL` : '') +``
          
          const orderListCount = await bexioPool.query(getorderCount,[getRegisteredId.rows[0].cid]);
          console.log(orderListCount.rows[0].total);

          for (let index = 0; index < orderList.rows.length; index++) {
            const element = orderList.rows[index];
            element['companyName'] = '';
            element['netcomId'] = '';
            const getBc = await g2bPool.query(getSenderIdQry,[element.rk_businessconnection]);
           
            if(getBc.rows.length != 0)
            {
              element['companyName'] = getBc.rows[0].companyname;
              element['netcomId'] = getBc.rows[0].netcomId;
              if(!element['rk_order'])
              {
                let temp = contacts.filter(e => e.id == getBc.rows[0].sender_custom_id);
                element['contactName'] = temp.length != 0 ? temp[0].name_1:'';
                element['contactId'] = temp.length != 0 ? getBc.rows[0].sender_custom_id:'';
                element['connectioStatus'] = 'active';
              }else{
                element['contactId'] = '';
                let temp = contacts.filter(e => e.id == getBc.rows[0].sender_custom_id);
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
            data:orderList.rows,
            totalCount:orderListCount.rows[0].total
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
 
    logs.action = 'GET_ORDER';
    logs.level = 'ERROR';
    logs.item = 'EDI';
    // //addlogs(logs,data.rolePartyId,data.roleAccId);
    console.log(error);
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+cookie;
    warningMessage(commonErrors,error);
    return res
    .status(200)
    .json({ status: 500, message: 'something_went_wrong' });
      
  }
}

const setDeliveryNotesBulk = async (deliveryNotes, bodyValues, headerParams) => {
  console.log("worker processing invoices...");
  console.log('deliveryNotes',deliveryNotes);
  console.log('bodyValues',bodyValues);

  

  bodyValues = JSON.parse(bodyValues);
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

    console.log("start processing delivery notes");
    const result = await pushDeliveryNotesBulk(tempParam, "");
    console.log("result:", result);
    console.log("end processing delivery notes");
  }
};

const sendBulkDeliveryNotes = async( req, res) => {
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
        await setDeliveryNotesCidSendStatus(bodyData.partyId, element.delivery_id, '', '1', '');
      }
    }
    // Call the function with await to ensure it completes before moving on
    await processInvoices(obj, bodyData);
    const worker = new Worker('./src/common/utils/sendDeliveryNotes_worker.js',{
      workerData: {
        bodyParams : JSON.stringify(bodyParams),
        deliveryItems,
        headerParams: {
          cookies: req.cookies, // Include cookies
          signedCookies: req.signedCookies, // Include signed cookies
          url: req.url
        }        
      }
    })
    
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
  res.send({});
}

const pushDeliveryNotesBulk = async( req, res)=>{
  return new Promise( async(resolve,reject) => {
    let cookie = null;
    let decryptData = null;
    let deliveryNotesCid;
    decryptData = req.body;
    const pool = await connectPostgres;
    const data = req.body;

    try {
      let deliveryNotes,paymentType;
      cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
      let accessToken = cookie.access_Token;
      const partyId = decryptData.partyId;
      const accountId = decryptData.accountId;
      const delivery_id = decryptData.delivery_id || 1;
      deliveryNotes = await getDeliveryNotesOT(accessToken,delivery_id); // Get deliveryNotes from bexio using orderId

      if( !deliveryNotes){ // If there is no deliveryNotes with this orderId, return with error
        deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId,delivery_id,'','0','error_in_getDeliveryNotesOT');
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'error_in_getDeliveryNotesOT -req param,',JSON.stringify(req.body);
        warningMessage(commonErrors,'error_in_getDeliveryNotesOT');
        logs.action = 'ORDERRESPONSE_FOR_OPEN_TRANSACTION';
        logs.level = 'ERROR';
        logs.item = 'EDI';
        return resolve('error_in_getDeliveryNotesOT');
      }
      let invitationData = await getConnectionDetails(partyId,accountId,deliveryNotes.contact_id,req); // Get the connection details using contact_id, party and account
      let customerIds
      if( invitationData.length > 0)
        customerIds = await constGetContactId(invitationData[0].rk_businessconnection); // Get customer Id using businessConnection
      else
        if( !customerIds ){ // If there is no customerIds, return with error
          deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId,delivery_id,deliveryNotes['document_nr'],'0','customerIds_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'customerIds_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'customerIds_not_found');
          logs.action = 'ORDERRESPONSE_FOR_OPEN_TRANSACTION';
          logs.level = 'ERROR';
          logs.item = 'EDI';
          return resolve('customerIds_not_found');
        }
      if( invitationData != undefined){ // If there is any invitationData then do
        let pdf,fileName,pdfContent;
        pdf = await getDeliveryNotesPdf(accessToken,delivery_id); // Fetch pdf file for deliveryNotes from bexio.

        if( !pdf ){ // If there is no pdf, return with error
          deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId,delivery_id,deliveryNotes['document_nr'],'0','deliveryNotesPdf_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'deliveryNotesPdf_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'deliveryNotesPdf_not_found');
          logs.action = 'ORDERRESPONSE_FOR_OPEN_TRANSACTION';
          logs.level = 'ERROR';
          logs.item = 'EDI';
          return resolve('deliveryNotesPdf_not_found');
        }
        
        pdfContent = JSON.parse(pdf).content; // Assign pdf content.
        fileName = JSON.parse(pdf).name; // Assign pdf name.

        /* Fetch country data from bexio using accessToken */
        let countryList;
        countryList = await getCountryLists(accessToken);

        if( !countryList ){ // If country list not found, return with error.
          deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId,delivery_id,deliveryNotes['document_nr'],'0','countryList_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'countryList_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'countryList_not_found');
          return resolve('countryList_not_found');
        }

        /* Fetch Bank Details */
        let bank;
        // bank = await getBank(accessToken,2);
        // if( !bank){
        //   res.send({
        //     status_code: 500,
        //     message: 'something_went_wrong',
        //     status: false,      
        //   });
        //   return
        // }
        // console.log("bank :: ",bank);
        
        // if('iban_nr' in bank){
        //   deliveryNotes['bank'] = bank;
        // }
        // else{
        //   res.send({
        //     status_code: 500,
        //     message: 'bexio_bank_error',
        //     status: false,
        //   });
        //   return
        // }

        console.log("deliveryNotes.currency_id :: ",deliveryNotes.currency_id);
        /* Fetch currency from bexio using id. */
        let currency = await getCurrency(accessToken,deliveryNotes.currency_id);
        if( !currency ){
          deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId,delivery_id,deliveryNotes['document_nr'],'0','currency_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'currency_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'currency_not_found');
          logs.action = 'ORDERRESPONSE_FOR_OPEN_TRANSACTION';
          logs.level = 'ERROR';
          logs.item = 'EDI';
          return resolve('currency_not_found');
        }
        deliveryNotes['currency'] = currency;

        /* Get user details from access token */
        let temp = await getloginUserCompanyDetails(accessToken);
        if( !temp ){
          deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId,delivery_id,deliveryNotes['document_nr'],'0','loginUserCompanyDetails_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'loginUserCompanyDetails_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'loginUserCompanyDetails_not_found');
          logs.action = 'ORDERRESPONSE_FOR_OPEN_TRANSACTION';
          logs.level = 'ERROR';
          logs.item = 'EDI';
          return resolve('loginUserCompanyDetails_not_found');
        }
        deliveryNotes['companyProfile'] = temp;
        deliveryNotes['companyProfile'] = JSON.parse(deliveryNotes['companyProfile']);
        /* Fetch payment type from deliveryNotes */
        paymentType = await getPaymentType(accessToken,deliveryNotes.payment_type_id);
        if(!paymentType){
          deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId,delivery_id,deliveryNotes['document_nr'],'0','paymentType_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'paymentType_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'paymentType_not_found');
          logs.action = 'ORDERRESPONSE_FOR_OPEN_TRANSACTION';
          logs.level = 'ERROR';
          logs.item = 'EDI';
          return resolve('paymentType_not_found');
        }

        let tempPaymentType = paymentType.filter(e => e.id == deliveryNotes.payment_type_id);
        deliveryNotes['paymentType'] = tempPaymentType;

        /* Fetch contact using contact id from deliveryNotes */
        let contact = await getContact(accessToken,deliveryNotes.contact_id);
        if(!contact){
          deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId,delivery_id,deliveryNotes['document_nr'],'0','contact_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'contact_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'contact_not_found');
          logs.action = 'ORDERRESPONSE_FOR_OPEN_TRANSACTION';
          logs.level = 'ERROR';
          logs.item = 'EDI';
          return resolve('contact_not_found');
        }
        deliveryNotes['contact'] = contact;
        let user = true;
        if(!user){
          deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId,delivery_id,deliveryNotes['document_nr'],'0','user_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'user_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'user_not_found');
          logs.action = 'ORDERRESPONSE_FOR_OPEN_TRANSACTION';
          logs.level = 'ERROR';
          logs.item = 'EDI';
          return resolve('user_not_found');
        }
        deliveryNotes['user'] = user;

        /* Loop over positions in deliveryNotes */
        for (const items of deliveryNotes.positions) {
          console.log('items.tax_id',items.tax_id);
          if(items.tax_id){ // Check tax is there or not
            /* Fetch tax using tax id */
            let tempTax = await getTaxs(accessToken,items.tax_id);
            if(!tempTax){
              deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId,delivery_id,deliveryNotes['document_nr'],'0','tax_not_Found');
              logs.action = 'ORDERRESPONSE_FOR_OPEN_TRANSACTION';
              logs.level = 'ERROR';
              logs.item = 'EDI';
              // addlogs(logs,decryptData.partyId,decryptData.accountId);
              commonErrors['errorTitle'] = req.originalUrl;
              commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'tax_not_Found -req param,',JSON.stringify(req.body);
              warningMessage(commonErrors,'tax_not_Found');
              return resolve('tax_not_Found');
            }
            items['tax'] = tempTax;
          }
          let tempItem;
          if('article_id' in items){
            tempItem = await getProducts(accessToken,items.article_id);
            items['article'] = tempItem;
          }else{
            items['article'] = {}
            items['article']['intern_name'] = items.text;
            items['article']['intern_description'] = items.text;

          }
        }
        deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId,delivery_id,deliveryNotes['document_nr'],'1');

        /* Create XML from data */
        let xml;
        xml = await setDeliveryNotesToOt(deliveryNotes,countryList,invitationData[0],pdfContent,fileName,customerIds,deliveryNotesCid);
        if( xml == false){
          deliveryNotesCid = await setDeliveryNotesCidSendStatus(partyId,delivery_id,deliveryNotes['document_nr'],'0','deliveryNotesToOt_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'deliveryNotesToOt_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'deliveryNotesToOt_not_found');
          logs.action = 'ORDERRESPONSE_FOR_OPEN_TRANSACTION';
          logs.level = 'ERROR';
          logs.item = 'EDI';
          return resolve('deliveryNotesToOt_not_found');
        }
        await invoiceFilePush(invitationData[0].rk_netcomidsender,'WS',xml,deliveryNotes['document_nr'],'EDI');
        let redisKey = req.body.partyId+"_/";
        await deleteRedis(req.url.substr(1,req.url.length),redisKey);
        return resolve(true);
      }
      else{
        logs.action = 'ORDERRESPONSE_FOR_OPEN_TRANSACTION';
        logs.level = 'ERROR';
        logs.item = 'EDI';
        // addlogs(logs,decryptData.partyId,decryptData.accountId);
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'ORDER_FOR_OPEN_TRANSACTION -req param,',JSON.stringify(req.body);
        warningMessage(commonErrors,'ORDER_FOR_OPEN_TRANSACTION');
        return resolve('deliveryNotes_push_error')
      }
      } catch (error) {
        console.error('Error in pushDeliveryNotesBulk:', error);
        reject(error); // Ensure the promise is rejected.
      }
    });
  }

const sendBulkPurchaseOrder = async( req, res) => {
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

    const worker = new Worker('./src/common/utils/sendPurchaseOrder_worker.js',{
      workerData: {
        bodyParams : JSON.stringify(bodyParams),
        orders,
        headerParams: {
          cookies: req.cookies, // Include cookies
          signedCookies: req.signedCookies, // Include signed cookies
          url: req.url
        }        
      }
    })
    
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

const setPurchaseOrderBulk = async (purchaseOrder, bodyValues, headerParams) => {
  console.log("worker processing invoices...");

  bodyValues = JSON.parse(bodyValues);
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

    console.log("start processing Purchase Order");
    const result = await pushPurchaseOrderBulk(tempParam, "");
    console.log("result:", result);
    console.log("end processing Purchase Order");
  }
  
};
const pushPurchaseOrderBulk = async( req, res)=>{
  return new Promise( async(resolve,reject) => {
    let cookie = null;
    let decryptData = null;
    let purchaseorderCid;
    decryptData = req.body;
    const pool = await connectPostgres;
    const data = req.body;

    try {
      let purchaseOrder,paymentType;
      cookie = JSON.parse(encryptionControl.decryptCookie(JSON.stringify(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME])));
      console.log("decryptData :: ",decryptData);
      let accessToken = cookie.access_Token;
      const partyId = decryptData.partyId;
      const accountId = decryptData.accountId;
      // const orderData = decryptData.order_id;
      const purchaseOrderId = decryptData.order_id || 1;
      purchaseOrder = await getOrderOT(accessToken,purchaseOrderId); // Get order from bexio using orderId
      console.log("purchaseOrder :: ",purchaseOrder);
      if( !purchaseOrder){ // If there is no purchaseOrder with this orderId, return with error
        purchaseorderCid = await setOrderSendStatus(partyId,purchaseOrderId,'','0','order_not_found');
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'order_not_found -req param,',JSON.stringify(req.body);
        warningMessage(commonErrors,'order_not_found');
        logs.action = 'ORDER_FOR_OPEN_TRANSACTION';
        logs.level = 'ERROR';
        logs.item = 'EDI';
        return resolve('order_not_found');
      }
      let invitationData = await getConnectionDetails(partyId,accountId,purchaseOrder.contact_id,req); // Get the connection details using contact_id, party and account
      console.log("invitationData: ",invitationData[0]);
      let customerIds = await constGetContactId(invitationData[0].rk_businessconnection); // Get customer Id using businessConnection
      if( invitationData != undefined ){ // If there is any invitationData then do
        let pdf,fileName,pdfContent;

        /* Fetch country data from bexio using accessToken */
        let countryList;
        countryList = await getCountryLists(accessToken);

        if( !countryList ){ // If country list not found, return with error.
          purchaseorderCid = await setOrderSendStatus(partyId,purchaseOrderId,purchaseOrder['document_nr'],'0','countryList_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'countryList_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'countryList_not_found');
          return resolve('countryList_not_found');
        }

        /* Fetch Bank Details */
        let bank;
        // bank = await getBank(accessToken,2);
        // if( !bank){
        //   res.send({
        //     status_code: 500,
        //     message: 'something_went_wrong',
        //     status: false,      
        //   });
        //   return
        // }
        // console.log("bank :: ",bank);
        
        // if('iban_nr' in bank){
        //   purchaseOrder['bank'] = bank;
        // }
        // else{
        //   res.send({
        //     status_code: 500,
        //     message: 'bexio_bank_error',
        //     status: false,
        //   });
        //   return
        // }

        console.log("purchaseOrder.currency_id :: ",purchaseOrder.currency_id);
        /* Fetch currency from bexio using id. */
        let currency = await getCurrency(accessToken,purchaseOrder.currency_id);
        if( !currency ){
          purchaseorderCid = await setOrderSendStatus(partyId,purchaseOrderId,purchaseOrder['document_nr'],'0','currency_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'currency_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'currency_not_found');
          logs.action = 'ORDER_FOR_OPEN_TRANSACTION';
          logs.level = 'ERROR';
          logs.item = 'EDI';
          return resolve('currency_not_found');
        }
        purchaseOrder['currency'] = currency;

        /* Get user details from access token */
        let temp = await getloginUserCompanyDetails(accessToken);
        if( !temp ){
          purchaseorderCid = await setOrderSendStatus(partyId,purchaseOrderId,purchaseOrder['document_nr'],'0','loginUserCompanyDetails_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'loginUserCompanyDetails_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'loginUserCompanyDetails_not_found');
          logs.action = 'ORDER_FOR_OPEN_TRANSACTION';
          logs.level = 'ERROR';
          logs.item = 'EDI';
          return resolve('loginUserCompanyDetails_not_found');
        }
        purchaseOrder['companyProfile'] = temp;
        purchaseOrder['companyProfile'] = JSON.parse(purchaseOrder['companyProfile']);
        /* Fetch payment type from purchaseOrder */
        paymentType = await getPaymentType(accessToken,purchaseOrder.payment_type_id);
        if(!paymentType){
          purchaseorderCid = await setOrderSendStatus(partyId,purchaseOrderId,purchaseOrder['document_nr'],'0','paymentType_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'paymentType_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'paymentType_not_found');
          logs.action = 'ORDER_FOR_OPEN_TRANSACTION';
          logs.level = 'ERROR';
          logs.item = 'EDI';
          return resolve('paymentType_not_found');
        }

        let tempPaymentType = paymentType.filter(e => e.id == purchaseOrder.payment_type_id);
        purchaseOrder['paymentType'] = tempPaymentType;

        /* Fetch contact using contact id from purchaseOrder */
        let contact = await getContact(accessToken,purchaseOrder.contact_id);
        if(!contact){
          purchaseorderCid = await setOrderSendStatus(partyId,purchaseOrderId,purchaseOrder['document_nr'],'0','contact_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'contact_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'contact_not_found');
          logs.action = 'ORDER_FOR_OPEN_TRANSACTION';
          logs.level = 'ERROR';
          logs.item = 'EDI';
          return resolve('contact_not_found');
        }
        purchaseOrder['contact'] = contact;
        let user = true;
        if(!user){
          purchaseorderCid = await setOrderSendStatus(partyId,purchaseOrderId,purchaseOrder['document_nr'],'0','user_not_found');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'user_not_found -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'user_not_found');
          logs.action = 'ORDER_FOR_OPEN_TRANSACTION';
          logs.level = 'ERROR';
          logs.item = 'EDI';
          return resolve('user_not_found');
        }
        purchaseOrder['user'] = user;

        /* Loop over positions in purchaseOrder */
        let taxIsAdded = false;
        for ( const items of purchaseOrder.positions.required ) {
          console.log('items.tax_id',items.tax_id);
          if(items.tax_id){ // Check tax is there or not
            /* Fetch tax using tax id */
            let tempTax = await getTaxs(accessToken,items.tax_id);
            taxIsAdded = true;
            if(!tempTax){
              purchaseorderCid = await setOrderSendStatus(partyId,purchaseOrderId,purchaseOrder['document_nr'],'0','tax_not_Found');
              logs.action = 'ORDER_FOR_OPEN_TRANSACTION';
              logs.level = 'ERROR';
              logs.item = 'EDI';
              // addlogs(logs,decryptData.partyId,decryptData.accountId);
              commonErrors['errorTitle'] = req.originalUrl;
              commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'tax_not_Found -req param,',JSON.stringify(req.body);
              warningMessage(commonErrors,'tax_not_Found');
              return resolve('tax_not_Found');
            }
            items['tax'] = tempTax;
          }
          let tempItem;
          if('article_id' in items){
            tempItem = await getProducts(accessToken,items.article_id);
            items['article'] = tempItem;
          }else{
            items['article'] = {}
            items['article']['article_id'] = items.id;
            items['article']['amount'] = items.amount;
            items['article']['intern_name'] = items.text;
            items['article']['intern_description'] = items.text;

          }
        }
        purchaseorderCid = await setOrderSendStatus(partyId,purchaseOrderId,purchaseOrder['document_nr'],'1');

        /* Create XML from data */
        let xml;
        xml = await setOrderToOt(purchaseOrder,countryList,invitationData[0],pdfContent,fileName,customerIds,purchaseorderCid,taxIsAdded);
        if( xml == false){
          purchaseorderCid = await setOrderSendStatus(partyId,purchaseOrderId,purchaseOrder['document_nr'],'0','bexio_item_error');
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'bexio_item_error -req param,',JSON.stringify(req.body);
          warningMessage(commonErrors,'bexio_item_error');
          logs.action = 'ORDER_FOR_OPEN_TRANSACTION';
          logs.level = 'ERROR';
          logs.item = 'EDI';
          return resolve('bexio_item_error');
        }
        await invoiceFilePush(invitationData[0].rk_netcomidsender,'WS',xml,purchaseOrder['document_nr'],'EDI');
        let redisKey = req.body.partyId+"_/";
        await deleteRedis(req.url.substr(1,req.url.length),redisKey);
        return resolve(true);
    }
    else{
      logs.action = 'ORDER_FOR_OPEN_TRANSACTION';
      logs.level = 'ERROR';
      logs.item = 'EDI';
      // addlogs(logs,decryptData.partyId,decryptData.accountId);
      commonErrors['errorTitle'] = req.originalUrl;
      commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'ORDER_FOR_OPEN_TRANSACTION -req param,',JSON.stringify(req.body);
      warningMessage(commonErrors,'ORDER_FOR_OPEN_TRANSACTION');
      return resolve('purchase_order_push_error')
    }
    } catch (error) {
      console.error('Error in pushPurchaseOrderBulk:', error);
      reject(error); // Ensure the promise is rejected.
    }
  });
}
const packagePayment = async (data) => {
  console.log('********************data',data);
  let fomdata= {
    payementData: encryptionControl.encrypt(JSON.stringify(data))
  }
  console.log('********************packagePaymentfomdata',data);
  let  options = {
      'method': 'POST',
      'url': config.ADMIN_URL+'payment/packagePayment',
       formData: fomdata
    };
    console.log('optionsoptions',options);
    
  return new Promise(function (resolve, reject) {
    request(options, async function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      } else {
          console.log('er',error);
          
        reject(error);
      }
    });
  });
}
const planPurchase = async (data) => {
  console.log('********************data',data);
  let fomdata= {
  planData: encryptionControl.encrypt(JSON.stringify(data))
}
  console.log('********************planPurchasefomdata',fomdata);
  let  options = {
      'method': 'POST',
      'url': config.ADMIN_URL+'payment/planPurchase',
       formData: fomdata
    };
    console.log('optionsoptions',options);
    
  return new Promise(function (resolve, reject) {
    request(options, async function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      } else {
          console.log('er',error);
          
        reject(error);
      }
    });
  });
}
const processBexioPaymentFailure = async (req, res) => {
  let encrToken
  try {
    const pool = await connectPostgres;
    const gate2b = await connectGate2b;
    console.log('**************1', encrToken);
    console.log('**************body', req.body);

    let { PaymentRecord = '', paymentStatus = '', orderId = '' } = req.body;

    // Decrypt only if the value exists
    if (PaymentRecord) {
      PaymentRecord = encryptionControl.decryptCookie(PaymentRecord);
    }

    if (orderId) {
      orderId = encryptionControl.decryptCookie(orderId);
    }
    if ('encrToken' in req.body) {
      encrToken = encryptionControl.decrypt(req.body.encrToken);
      console.log('**************encrToken', encrToken);
    } else {
      encrToken = req.body
    }
    // let tempObjectId = encrToken.objectId;

    let billingCookie = JSON.parse(encryptionControl.decryptCookie(req.cookies[config.BILLING_COOKIE_NAME]));
    console.log("Object ID:", billingCookie.objectid);
    const subScriptionType = encrToken.subScriptionType;

    let formData = {
      addonId: encrToken.planId,
      user_email: encrToken.email,
      language: encrToken.language,
      user_first_name: encrToken.givenname,
      paymentStatus: paymentStatus,
      orderId: orderId,
      ...(PaymentRecord && { payedResponse: PaymentRecord })
    };
    const paymentDetails = JSON.stringify(formData)
    const updateActivation = `UPDATE activation SET paymentdata = $1 WHERE objectid = $2`;
    const updateActivationRslt = await pool.query(updateActivation, [paymentDetails, billingCookie.objectid]);
    return res.status(200).json({
      status_code: 200,
      message: 'success',
      status: true
    });
  }
  catch (error) {
    console.log('errorerror', error);
    let responseValue = JSON.stringify(encrToken)
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + 'reqparam-' + responseValue;
    warningMessage(commonErrors, error);
    return res.status(500).json({
      status_code: 500,
      message: 'something_went_wrong',
      status: false,
    });
  }
}
module.exports={
  updateOrderMailStatus,
  authorization,
  bexioRedirect,
  getToken,
  testEncrypt,
  bexioApi,
  bexioApiTest,
  getloginUserCompanyDetails,
  getLoginUserRoles,
  readFile,
  refreshTokenCreate,
  apiTest,
  bexioUserCreate,
  inviteCompany,
  getInvoice,
  getBills,
  bexioLogout,
  getAccessToken,
  createAccessToken,
  // invoiceToOt,
  testApi,
  getInvoiceForOpenTrans,
  testApi2,
  getInvoicePdf,
  copyData,
  createBill,
  xmlToJson,
  getAllUsers,
  getTax,
  getInvoiceSearch,
  copyDataNetcomid,
  createBusinessConnection,
  fileUpload,
  kafkaTest,
  getInvitionDetails,
  getBexioUserPermission,
  deleteBc,
  getTransactionDetails,
  getInvitionCodeDetails,
  checkContact,
  createContact,
  healthCheck,
  getIban,
  createBexioUser,
  // getSuperAdminToken,
  switchCompanyBexio,
  setSuperAdmin,
  getEbillUsedCount,
  // copyCountry
  pushInvoice,
  // setEbillOpenTrans,
  // test,
  getAutherizationStatus,
  setAutherizationStatus,
  tourList,
  updateTour,
  updateTutorialStatus,
  changeInvoiceSendStatus,
  notifyEbillMail,
  infoList,
  deleteRedis,
  switchCompany,
  keysAvailable,
  remove,
  testRefreshToken,
  getBccontactDetails,
  sendG2bOrder,
  getBexioDocTypes,
  getContactList,
  getOrderForOpenTrans,
  getPurchaseOrders,
  getPurchaseOrderList,
  getDeliveryNotesList,
  getDeliveryNotesForOT,
  checkContactExist,
  getAccountToken,
  getUserLogs,
  getTransactionList,
  updateProcessDataToRedis,
  getProcessDataFromRedis,
  deleteProcessDataFromRedis,
  activeBillers,
  getEbillInvoice,
  getEbillInvoicePdf,
  getEbillDetails,
  sendBulkEbill,
  pushBulkInvoice,
  pushTest,
  pushInvoiceTest1,
  pushInvoiceTestProcess,
  getEbillContactList,
  changePayementComments,
  getPayementComments,
  sentNewOrderMails,
  getOrderMailSendStatus,
  sendBulkInvoices,
  pushInvoiceBulk,
  pushInvoiceBulkTest,
  getOrderList,
  sendBulkDeliveryNotes,
  setDeliveryNotesBulk,
  pushDeliveryNotesBulk,
  sendBulkPurchaseOrder,
  setPurchaseOrderBulk,
  pushPurchaseOrderBulk,
  bexioCompanyCreate,
  processBexioPaymentFailure
}
