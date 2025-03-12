import status_code from '../../common/utils/statusCodes';
const crypto = require("crypto");
import config from '../../common/config/index';
const fs = require('fs')
const request = require('request');
import dbConn from '../../common/loaders/ebil_postgres';
import gate2B from '../../common/loaders/postgresBexio';
import connectPostgres from '../../common/loaders/postgres';
const encryptionControl = require('../../common/utils/jwt-decode');
import commonErrors from '../../common/utils/commonError'
const path =require('path')
import warningMessage from '../../common/utils/warningMessage'
const sendEmail = require('../../common/utils/email');
import connectGate2b from '../../common/loaders/postgresDb';
import logs from '../../common/utils/actionLogTemplate';
import { log } from 'console';
import addlogs from '../../common/utils/addLogs';

const redisClient = require('../../common/loaders/redisDB');
// import addlogs from '../../common/utils///addlogs';
const fetchEmailContent = require('../../common/utils/fetchEmailData');

// create ebill in six api 
const createBiller = async (req, res) => {
  let encrToken = null;
  const pool = await dbConn;
  const postgresPool = await connectPostgres;
  const ediParty = await connectGate2b;
  const gate2BConnection = await gate2B;
  const bodyData = req.body;
  try {

    const correlationId = crypto.randomBytes(15).toString('hex');
    encrToken = encryptionControl.decrypt(req.body.encrToken);
    const options = {
      method: 'POST',
      url: config.SIX_API_CERTIFICATE_BASE + `billers`,
      headers: {
        'Content-Type': 'application/json',
        'x-networkpartner-id':config.NETWORK_PARTNER_ID,
        'X-Correlation-Id': correlationId,
      },
      body: encrToken.data,
      key: fs.readFileSync(config.CERTIFICATE_PATH + config.SIX_API_KEY),
      cert: fs.readFileSync(config.CERTIFICATE_PATH + config.SIX_API_CERTIFICATE) 
    };
    await request(options, async function (error, response) {
      if (error) {
        console.log(error);
        logs.action = 'CREATE_BILLER';
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        addlogs(logs,bodyData.rolePartyId,bodyData.roleAccId);
        return res.status(status_code.INTERNAL_SERVER_ERROR).json({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
      }
      else {
        let data = JSON.parse(response.body);
        if (data.id) {
          let netcomId = encrToken.netcomId;
          let companyName = encrToken.companyName;
          let companyId = encrToken.companyId;
          let bexioCompanyName = null;
          const checkBexioCompany = `SELECT cid FROM  companyregistered 
          WHERE netcomid = $1`
          const checkBexioCompanyResult = await gate2BConnection.query(checkBexioCompany, [netcomId]);
          console.log('checkBexioCompanyResult.rows',checkBexioCompanyResult.rows);
          
          if (checkBexioCompanyResult.rows.length != 0) {
            const getParent = `SELECT rk_party  FROM network  WHERE name = $1`;
            const getParentData = await ediParty.query(getParent, [config.BEXIO_CODE]);
            bexioCompanyName = getParentData.rows[0].rk_party;
          }
          let jsonReq = JSON.stringify(data);
          const getPartyEbill = `SELECT cid
                                 FROM "ebillWallet"
                                 WHERE fk_party = $1`;
          let getPartyEbillResult = await postgresPool.query(getPartyEbill, [companyId]);
          if (getPartyEbillResult.rows.length <= 0) {
            const partyEbill = `INSERT INTO "ebillWallet" 
             (fk_party,"lastEntered","billerId") 
             VALUES ($1,date_trunc('month', now()::timestamp) + interval '6 hour',$2)`;
            await postgresPool.query(partyEbill, [companyId, data.id]);
          }
          const addBiller = `INSERT INTO biller (netcomid,billerId,status,legalName,uid,subscriptionStatus,defaultLanguage,companyJSON,party_parent) 
          VALUES('${netcomId}','${data.id}','${data.status}','${data.legalName}',${data.accounts[0].iid},'${data.billRecipientSubscriptionStatus}','${data.localizedData.defaultLanguage}','${jsonReq}',${bexioCompanyName})`;
          await pool.query(addBiller);
          let createdPythonResponse = await bexioCreatePythonData(netcomId,companyName,encrToken);
          console.log("createdPythonResponse---",createdPythonResponse,'createdPythonResponse &&');
          if (checkBexioCompanyResult.rows.length != 0) {
           let updateBexio = await bexioUpdateBiller(req,data.id);
           console.log("updateBexio---",updateBexio);
           if(updateBexio != true){
            let dataResponse = {"name":"io_market.ebill_pid", "value":`${data.id}`} 
            commonErrors['errorTitle'] = req.originalUrl;
            commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + JSON.stringify(data) + '-bexioUpdateBiller params---'+dataResponse;
            console.log("commonErrors--",commonErrors);
            warningMessage(commonErrors, 'bexioUpdateBiller failed...');
           }
          }
          if (companyId != null) {
            const updateCommitionAgent = ` UPDATE commissionagent_party SET status = 'biller_created',"module" = 'EBILL' WHERE fk_party = $1 `;
            await postgresPool.query(updateCommitionAgent, [companyId]);
          }
          const getCompanyData = `SELECT u."language",e.email,l.companyname  FROM party p 
                                    INNER JOIN email e ON e.fk_party = p.cid
                                    INNER JOIN "user" u ON e.fk_user = u.cid 
                                    INNER JOIN legalparty l ON l.fk_party  = p.cid  
                                    WHERE p.cid = $1 AND e."_type" = 'company_contact'`;
          const getCompanyDetails = await postgresPool.query(getCompanyData, [companyId]);
          let language = getCompanyDetails.rows[0]?.language;
          let ComapnyEmail = getCompanyDetails.rows[0]?.email;
          let companyname = getCompanyDetails.rows[0]?.companyname;
          /* let message, subject;
          if (language === 'en') {
            subject = 'Biller created at SIX eBill-platform';
            message = `Dear customer<br><br>Thank you for filling out the form. Your data was automatically stored on the eBill platform. Your biller ID is ${data.id}.<br>You can now inform your bill recipients that you are activated as a biller on the eBill platform with the name ${companyname}<br><br>Kind regards <br>Your io-market team`;
          }
          else {
            subject = 'Biller erstellt bei SIX eBill';
            message = `Lieber Kunde<br><br>Besten Dank für das Ausfüllen des Formulars. Deine Daten wurden automatisch auf der eBill-Plattform hinterlegt. Deine Biller ID lautet ${data.id}.<br>
            Nun kannst du deine Rechnungsempfänger informieren, dass du auf der Plattform von eBill als mit dem Namen ${companyname} aufgeschaltet bist.<br><br>Mit freundlichen Grüssen<br>Dein io-market Team`;
          } */
         let keyDatas = {
          id: data.id,
          companyName: companyname
         }
         const mailData = await fetchEmailContent('biller_created_six',language,keyDatas);
         const message = mailData.message;
         const subject = mailData.subject;
          await sendEmail({
            email: config.DEBUG ? config.DEBUG_MAIL :ComapnyEmail ,
            subject: subject,
            message,
          });
          logs.action = 'CREATE_BILLER';
          logs.level = 'NOTIFICATION';
          logs.item = 'EBILL';
          addlogs(logs,bodyData.rolePartyId,bodyData.roleAccId);
          return res.status(status_code.OK).json({
            status_code: 200,
            message: 'created_biller_successfully',
            status: true,
          });          
        }
        else {
          let responseValue = JSON.stringify(encrToken)
          commonErrors['errorTitle'] = req.originalUrl;
          logs.action = 'CREATE_BILLER';
          logs.level = 'ERROR';
          logs.item = 'EBILL';
          addlogs(logs,bodyData.rolePartyId,bodyData.roleAccId);
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + JSON.stringify(data) + '-req param six,'+ responseValue;
          warningMessage(commonErrors, responseValue);
          var returnData = data.type.replace('/problems/','');
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
    logs.action = 'CREATE_BILLER';
    logs.level = 'ERROR';
    logs.item = 'EBILL';
    addlogs(logs,bodyData.rolePartyId,bodyData.roleAccId);
    let responseValue = JSON.stringify(encrToken);
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,'+responseValue;
    warningMessage(commonErrors, error);
    return res.status(status_code.INTERNAL_SERVER_ERROR).json({
      status_code: 500,
      message: 'something_went_wrong',
      status: false,
    });
  }
}
// update biller in six API
const updateBiller = async (req, res) => {
  let encrToken = null;
  const bodyData = req.body;
  try {
    let companyId = encrToken.companyId;
    const postgresPool = await connectPostgres;
    const pool = await dbConn;
    const bexioPool = await gate2B;

    
    const resetToken = crypto.randomBytes(15).toString('hex');
    encrToken = encryptionControl.decrypt(req.body.encrToken);
    const billerData = encrToken.data
    let billerId = JSON.parse(billerData)
    const options = {
      method: 'PUT',
      url: config.SIX_API_CERTIFICATE_BASE + `billers/${billerId.id}`,
      headers: {
        'Content-Type': 'application/json',
        'x-networkpartner-id':config.NETWORK_PARTNER_ID,
        'X-Correlation-Id': resetToken,
      },
      body: billerData,
      key: fs.readFileSync(config.CERTIFICATE_PATH + config.SIX_API_KEY),
      cert: fs.readFileSync(config.CERTIFICATE_PATH+config.SIX_API_CERTIFICATE) 
    };
    await request(options, async function (error, response) {
      if (error) {
        logs.action = 'UPDATE_BILLER';
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        addlogs(logs,bodyData.rolePartyId,bodyData.roleAccId);
        return res.status(status_code.INTERNAL_SERVER_ERROR).json({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
      }
      else {
        let data = JSON.parse(response.body);
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

          await pool.query(updateBillerData, responseData)
           const getPartyEbill = `SELECT cid
            FROM "ebillWallet"
            WHERE fk_party = $1`;
            let getPartyEbillResult = await postgresPool.query(getPartyEbill, [companyId]);
            if (getPartyEbillResult.rows.length <= 0) {
            const partyEbill = `INSERT INTO "ebillWallet" 
            (fk_party,"lastEntered","billerId") 
            VALUES ($1,date_trunc('month', now()::timestamp) + interval '6 hour',$2)`;
            await postgresPool.query(partyEbill, [companyId, data.id]);
            }
         let updateconnection = await updateConnection(encrToken.form);
         const checkBexioCompany = `SELECT netcomid FROM  companyregistered 
           WHERE rk_party = $1`;

         const checkBexioCompanyResult = await bexioPool.query(checkBexioCompany, [companyId]);
         if(checkBexioCompanyResult.rows.length > 0){
          await createBexiobiller(checkBexioCompanyResult.rows[0].netcomid);
         }

          logs.action = 'UPDATE_BILLER';
          logs.level = 'NOTIFICATION';
          logs.item = 'EBILL';
          addlogs(logs,bodyData.rolePartyId,bodyData.roleAccId);
          return res.status(status_code.OK).json({
            status_code: 200,
            data:updateconnection,
            message: 'updated_biller_successfully',
            status: true,
          });
        }
        else {
          let responseValue = JSON.stringify(encrToken);
          logs.action = 'UPDATE_BILLER';
          logs.level = 'ERROR';
          logs.item = 'EBILL';
          addlogs(logs,bodyData.rolePartyId,bodyData.roleAccId);
          commonErrors['errorTitle'] = req.originalUrl;
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + JSON.stringify(data) + '-req param,' + responseValue;
          warningMessage(commonErrors, responseValue);
          var returnData = data.type.replace('/problems/','');
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
    logs.action = 'UPDATE_BILLER';
    logs.level = 'ERROR';
    logs.item = 'EBILL';
    addlogs(logs,bodyData.rolePartyId,bodyData.roleAccId);
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
const updateConnection = async(data)=>{
  return new Promise(async (resolve, reject) => {
    let responseData = null
    try {
      let tempData = JSON.parse(data).data;
      let formData = {
        con_id:tempData.con_id,
        doc_type:tempData.fk_doc_type,
        doc_format:tempData.fk_doc_format,
        doc_interface:tempData.fk_netcomid_doc_interface,
        include_pdf:tempData.include_pdf
      }
       console.log('formData',formData);
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
        if(error){
          commonErrors['errorTitle'] = 'updateConnection';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString();
          warningMessage(commonErrors, error);
          return resolve(false)
        }
        else{
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

// update asset six API
const updateAsset = async (req, res) => {
  let accessToken
  let encrToken = null;
  const data = req.body;
  try {
    encrToken = req.body;
    const resetToken = crypto.randomBytes(15).toString('hex');
    const billerId = encrToken.billerId;
    const assetId = encrToken.assetId
    const options = {
      method: 'PUT',
      url: config.SIX_API_CERTIFICATE_BASE + `billers/${billerId}/assets/${assetId}`,
      headers: {
        'authorization': `Bearer ${accessToken}`,
        'x-networkpartner-id':config.NETWORK_PARTNER_ID,
        'X-Correlation-Id': resetToken,
      },
      body: req.file['buffer'],
      key: fs.readFileSync(config.CERTIFICATE_PATH + config.SIX_API_KEY),
      cert: fs.readFileSync(config.CERTIFICATE_PATH+config.SIX_API_CERTIFICATE) 
    };
    if (path.extname(req.file.originalname) === ".jpeg") {
      options.headers['Content-Type'] = 'image/jpeg'
    }
    if (path.extname(req.file.originalname) === ".png") {
      options.headers['Content-Type'] = "image/png"
    }
    if (path.extname(req.file.originalname) === ".gif") {
      options.headers['Content-Type'] = "image/gif"
    }
    if (path.extname(req.file.originalname) === ".pdf") {
      options.headers['Content-Type'] = "application/pdf"
    } 
    await request(options, async function (error, response) {
      if (error) {
        console.log(error);
        let responseValue = JSON.stringify(encrToken)
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param six,' + responseValue;
        warningMessage(commonErrors, error);
        logs.action = 'UPDATE_ASSETS';
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        addlogs(logs,data.rolePartyId,data.roleAccId);
        return res.status(status_code.INTERNAL_SERVER_ERROR).json({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
      }
      else{
        if(response.statusCode == '204'){
          logs.action = 'UPDATE_ASSETS';
          logs.level = 'NOTIFICATION';
          logs.item = 'EBILL';
          addlogs(logs,data.rolePartyId,data.roleAccId);
          return res.status(status_code.OK).json({
            status_code: 200,
            message: 'updated_asset_successfully',
            status: true,
          });
        }
        if(response.statusCode == '500'){
          logs.action = 'UPDATE_ASSETS';
          logs.level = 'ERROR';
          logs.item = 'EBILL';
          addlogs(logs,data.rolePartyId,data.roleAccId);
          return res.status(status_code.INTERNAL_SERVER_ERROR).json({
            status_code: 500,
            data:response,
            message: "something_went_wrong",
            status: true,
          });
        }
        else{
          let errorResponse = JSON.parse(response.body)
          var returnData = errorResponse.type.replace('/problems/','');
          logs.action = 'UPDATE_ASSETS';
          logs.level = 'ERROR';
          logs.item = 'EBILL';
          addlogs(logs,data.rolePartyId,data.roleAccId);
          return res.status(status_code.INTERNAL_SERVER_ERROR).json({
            status_code: 500,
            message: returnData.toLowerCase(),
            status: true,
          });
        }
      }
    });
  }
  catch (error) {
    logs.action = 'UPDATE_ASSETS';
    logs.level = 'ERROR';
    logs.item = 'EBILL';
    addlogs(logs,data.rolePartyId,data.roleAccId);
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
// get ebiller details six API
const getBiller = async (req, res) => {
  let encrToken = null;
  const data = encryptionControl.decrypt(req.body.encrToken);
  try {
    encrToken = encryptionControl.decrypt(req.body.encrToken);
    const resetToken = crypto.randomBytes(15).toString('hex');
    const billerId = encrToken.billerId
    const options = {
      method: 'GET',
      url: config.SIX_API_CERTIFICATE_BASE + `billers/${billerId}`,
      headers: {
        'x-networkpartner-id':config.NETWORK_PARTNER_ID,
        'X-Correlation-Id': resetToken,
      },
      key: fs.readFileSync(config.CERTIFICATE_PATH + config.SIX_API_KEY),
      cert: fs.readFileSync(config.CERTIFICATE_PATH+config.SIX_API_CERTIFICATE)
    };
    await request(options, async function (error, response) {
      if (error) {
        let responseValue = JSON.stringify(encrToken)
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param six,' + responseValue;
        warningMessage(commonErrors, error);
        logs.action = 'GET_BILLER';
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        addlogs(logs,data.rolePartyId,data.roleAccId);
        return res.status(status_code.INTERNAL_SERVER_ERROR).json({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
      }
      else {
        if(response.body){
        return res.status(status_code.OK).json({
          data: JSON.parse(response.body),
          status_code: 200,
          message: 'get_biller_data',
          status: true,
        });
      }
      else{
        logs.action = 'GET_BILLER';
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        addlogs(logs,data.rolePartyId,data.roleAccId);
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
    logs.action = 'GET_BILLER';
    logs.level = 'ERROR';
    logs.item = 'EBILL';
    addlogs(logs,data.rolePartyId,data.roleAccId);
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
// update asset six API
const getAsset = async (req, res) => {
  let encrToken = null;
  const data = encryptionControl.decrypt(req.body.encrToken);
  try {
    encrToken = encryptionControl.decrypt(req.body.encrToken);
    const resetToken = crypto.randomBytes(15).toString('hex');
    const billerId = encrToken.billerId;
    const assetId = encrToken.assetId;
    const tempImageFile = 'assets/'
    let apiResponse
    const options = {
      method: 'GET',
      url: config.SIX_API_CERTIFICATE_BASE + `billers/${billerId}/assets/${assetId}`,
      headers: {
        'x-networkpartner-id':config.NETWORK_PARTNER_ID,
        'X-Correlation-Id': resetToken,
      },
      key: fs.readFileSync(config.CERTIFICATE_PATH + config.SIX_API_KEY),
      cert: fs.readFileSync(config.CERTIFICATE_PATH+config.SIX_API_CERTIFICATE)
    };
    await request(options, async function (error, response) {
      if (error) {
        let responseValue = JSON.stringify(encrToken)
        commonErrors['errorTitle'] = req.originalUrl;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param six,' + responseValue;
        warningMessage(commonErrors, error);
        console.log(error);
        logs.action = 'GET_ASSETS';
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        addlogs(logs,data.rolePartyId,data.roleAccId);
        return res.status(500).json({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
      }
      else {
        apiResponse = response;
        if (apiResponse.statusCode === 200) {
          var base64
          setTimeout(() => {
            base64 = fs.readFileSync(`${tempImageFile}${assetId}.jpeg`, "base64");
            let data = "data:" + 'image/jpeg' + ";base64," + base64;
            return res.status(status_code.OK).json({
              data: data,
              status_code: 200,
              message: 'fetch_asset_image',
              status: true,
            });
          }, config.SET_TIME_OUT)
          setTimeout(() => {
            fs.unlink(`${tempImageFile}${assetId}.jpeg`, function (err) {
              if (err) {
                console.log('File not found');
              } else {
                console.log('File Delete Successfuly');
              }
            });
          }, config.SET_TIME_OUT)
        }
        else {
          setTimeout(() => {
            fs.unlink(`${tempImageFile}${assetId}.jpeg`, function (err) {
              if (err) {
                console.log('File not found');
              } else {
                console.log('File Delete Successfuly');
              }
            });
          }, config.SET_TIME_OUT)
          return res.status(status_code.OK).json({
            data: '',
            status_code: 200,
            message: 'asset_not_found',
            status: true,
          });
        }
      }
    }).pipe(fs.createWriteStream(`${tempImageFile}${assetId}.jpeg`))
  }
  catch (error) {
    logs.action = 'GET_ASSETS';
    logs.level = 'ERROR';
    logs.item = 'EBILL';
    addlogs(logs,data.rolePartyId,data.roleAccId);
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
// get biller basic informations from server Db
const getBillerDetails = async (req, res) => {
  let encrToken = null;
  try {
    const pool = await dbConn;
    const ioDb = await connectPostgres;
    console.log('req.body.encrToken',req.body.encrToken);
    
    encrToken = encryptionControl.decrypt(req.body.encrToken);

    if('accId' in encrToken)
    {
      const getUserPermissions = `SELECT po.policy,par.cid from partyapplication_account_role par
      INNER JOIN partyapplication_account pa ON par.fk_partyapplication_account = pa.cid
      INNER JOIN partyapplication p ON p.cid = pa.fk_partyapplication 
      INNER JOIN role_policy rp ON rp.fk_role = par.fk_role 
      INNER JOIN policy po ON po.cid = rp.fk_policy
      INNER JOIN role r ON r.cid = rp.fk_role 
      WHERE fk_account = $1
      AND  p.fk_party = $2
      AND r.name like '%EBILL%'`
      const getUserPermissionsResult = await ioDb.query(getUserPermissions,[encrToken['accId'],encrToken['partyId']]);
      if(getUserPermissionsResult.rows.length == 0){
        return res.status(status_code.OK).json({
          status_code: 200,
          message: 'no_data_found',
          status: true,
        });
      }
    }

    const netcomId = encrToken.netcomId;
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
    const getData = await pool.query(getBasicDetails)
    if (getData.recordset.length) {
      if (getData.recordset[0].companyJSON) {
        let jsonExtract = JSON.parse(getData.recordset[0].companyJSON)
        getData.recordset[0]['enterpriseIdentificationNumber'] = jsonExtract.enterpriseIdentificationNumber
      }
     let pythonData = await getPythonData(netcomId);
     let connectionData  = null   
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
      return res.status(status_code.OK).json({
        data: getData.recordset,
        pythonData:connectionData,
        status_code: 200,
        message: 'basic_informations',
        status: true,
      });
    }
    else {
      return res.status(status_code.OK).json({
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
    return res.status(status_code.INTERNAL_SERVER_ERROR).json({
      status_code: 500,
      message: 'something_went_wrong',
      status: false,
    });
  }
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
// get all sectors six API
const getSectors = async (req, res) => {
  let accessToken
  // const data = req.body;
  try {
    const resetToken = crypto.randomBytes(15).toString('hex');
    const options = {
      method: 'GET',
      url: config.SIX_API_CERTIFICATE_BASE + `sectors`,
      headers: {
        'x-networkpartner-id':config.NETWORK_PARTNER_ID,
        'X-Correlation-Id': resetToken,
      },
      key: fs.readFileSync(config.CERTIFICATE_PATH + config.SIX_API_KEY),
      cert: fs.readFileSync(config.CERTIFICATE_PATH+config.SIX_API_CERTIFICATE)
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
        if(response.body){
        return res.status(status_code.OK).json({
          data: JSON.parse(response.body),
          status_code: 200,
          message: 'get_sectors',
          status: true,
        });
      }
      else{
        logs.action = 'GET_SECTORS';
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        //addlogs(logs);
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
//  get getSubscribers from server Db 
const getSubscribers = async (req, res) => {
  let encrToken = null;
  try {
    encrToken = encryptionControl.decrypt(req.body.encrToken);
    const netcomId = encrToken.netcomId;
    const recordsPerPage = encrToken.records_per_page;
    const pageNumber = encrToken.page_number;
    const isLinked = encrToken.isLinked || 0;
    const email = encrToken.email || null;
    const reciepent = encrToken.recipientId || null;
    const name = encrToken.fullName || encrToken.name || null;
    let likeValue ='%';
    let emailValue
    let reciepentValue
    let nameValue;
    if(email == null){
      emailValue = likeValue+likeValue 
    }
    else{
      emailValue = likeValue+email+likeValue
    }
    if(reciepent == null){
      reciepentValue = likeValue+likeValue 
    }
    else{
      reciepentValue = likeValue+reciepent+likeValue
    }
    if(name == null){
      nameValue = likeValue+likeValue 
    }
    else{
      nameValue = likeValue+name+likeValue
    }
    const validation = async (encrToken) => {
      console.log(encrToken.netcomId);
      if (!(encrToken.netcomId)) {
        return true;
      }
      else {
        return false
      }
    };
    let validationResult = await validation(encrToken);
    let page
    let limit
    if (pageNumber != 1) {
      page = encrToken.records_per_page * (pageNumber - 1);
      limit = parseInt(page) + 10;
    }
    else {
      page = 0
      limit = recordsPerPage;
    }

    if (!validationResult) {
      const pool = await dbConn;
      const getBiller = `SELECT b.billerid  FROM biller b 
                       WHERE b.netcomid = '${netcomId}'`;
      const getBillerData = await pool.query(getBiller)

      if (getBillerData.recordset.length) {
        const getSubcribeDetails = `SELECT * from 
    (SELECT r.recipientid
        ,r.name AS surname
        ,r.firstname
        ,r.email
        ,r.streetnumber
        ,r.street
        ,r.zip
        ,r.city
        ,r.countrycode
        ,r.created
        ,r.lastupdate
        ,r.SubscriptionFormFieldsJSON AS subscription
        ,r.party_specific_id
        ,r.id as subscriptionId
        ,r.islinked
        ,r.type
        ,(SELECT COUNT(*) FROM bc WHERE bc.recipientInfo = r.recipientId OR bc.recipientInfo = r.email) AS transactionCount
        ,r.status,ROW_NUMBER() OVER (order by r.created DESC) as RowNumber  FROM recipient r
    INNER JOIN biller b
    ON b.id = r.fk_biller WHERE b.billerid ='${getBillerData.recordset[0].billerid}'
    AND r.email LIKE '${emailValue}' AND r.recipientId LIKE '${reciepentValue}'
    AND (r.firstname  LIKE '${nameValue}' OR r.name LIKE '${nameValue}') 
    ) temp
    where RowNumber > '${page}' and RowNumber <= '${limit}' `;
        const getData = await pool.query(getSubcribeDetails)
        const countData = `SELECT  COUNT (r.id) as totalcount
    FROM recipient r
    INNER JOIN biller b
    ON b.id = r.fk_biller
    WHERE b.billerid = '${getBillerData.recordset[0].billerid}'
    AND r.email LIKE '${emailValue}' AND r.recipientId LIKE '${reciepentValue}'
    AND (r.firstname  LIKE '${nameValue}' OR r.name LIKE '${nameValue}')`
        const getCount = await pool.query(countData)
        if (getData.recordset.length) {
          return res.status(status_code.OK).json({
            data: getData.recordset,
            totalRecord: getCount.recordset[0].totalcount,
            status_code: 200,
            message: 'subscriber_details',
            status: true,
          });
        }
        else {
          return res.status(status_code.OK).json({
            data: [],
            status_code: 200,
            message: 'no_data_found',
            status: true,
          });
        }
      }
      else {
        return res.status(status_code.OK).json({
          data: [],
          status_code: 200,
          message: 'no_active_biller_found',
          status: true,
        });
      }
    }
    else {
      return res.status(status_code.INTERNAL_SERVER_ERROR).json({
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
    return res.status(status_code.INTERNAL_SERVER_ERROR).json({
      status_code: 500,
      message: 'something_went_wrong',
      status: false,
    });
  }
}
//  get getInvoices from server Db 
const getInvoices = async (req, res) => {
  let encrToken = null
  try {
     encrToken = encryptionControl.decrypt(req.body.encrToken);
    const netcomId = encrToken.netcomId;
    const recordsPerPage = encrToken.records_per_page;
    const pageNumber = encrToken.page_number;
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
    let page
    let limit
    if (pageNumber != 1) {
      page = encrToken.records_per_page * (pageNumber - 1);
      limit = parseInt(page) + 10;
    }
    else {
      page = 0
      limit = recordsPerPage;
    }
    if (!validationResult) {
      const pool = await dbConn;
      const getBiller = `SELECT b.billerid  FROM biller b 
      WHERE b.netcomid = '${netcomId}'`;
      const getBillerData = await pool.query(getBiller)
      if (getBillerData.recordset.length) {
        const getInvoiceDetails = `SELECT * from 
        (SELECT c.bc_created
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
          ,c.recipientInfo
          ,ROW_NUMBER() OVER (order by bc_created DESC) as RowNumber  FROM bc c
        INNER JOIN biller b ON b.id = c.fk_biller
        LEFT JOIN recipient r ON ((c.recipientInfo = r.email OR c.recipientInfo = r.recipientId) AND b.id = r.fk_biller) 
        WHERE b.billerid ='${getBillerData.recordset[0].billerid}'
        AND c.documentnumber LIKE '${documentValue}' AND c.status LIKE '${statusValue}' AND c.referenceNumber LIKE '${referenceValue}'
        ) temp
        where RowNumber > '${page}' and RowNumber <= '${limit}'`;
        const getInvoiceData = await pool.query(getInvoiceDetails);
        if(getInvoiceData.recordset.length){
          getInvoiceData.recordset.forEach(element => {
            element.bc_created = element.bc_created ? element.bc_created.toISOString().replace('Z', ''):element.bc_created
            element.bc_lastupdate = element.bc_lastupdate ? element.bc_lastupdate.toISOString().replace('Z', ''):element.bc_lastupdate
          });
        }
        const countData = `SELECT  COUNT (r.uid) as filterCount
          FROM bc r
          INNER JOIN biller b ON b.id = r.fk_biller
          LEFT JOIN recipient rc ON ((r.recipientInfo = rc.email OR r.recipientInfo = rc.recipientId) AND b.id = rc.fk_biller)
          WHERE b.billerid = '${getBillerData.recordset[0].billerid}'
          AND r.documentnumber LIKE '${documentValue}' AND r.status LIKE '${statusValue}' 
          AND r.referenceNumber LIKE '${referenceValue}'`
        const getFilterCount = await pool.query(countData);
        const totalCount = `SELECT  COUNT (r.uid) as totalcount
          FROM bc r
          INNER JOIN biller b ON b.id = r.fk_biller
          LEFT JOIN recipient rc ON ((r.recipientInfo = rc.email OR r.recipientInfo = rc.recipientId) AND b.id = rc.fk_biller)
          WHERE b.billerid = '${getBillerData.recordset[0].billerid}'`;
        const getTotalCount = await pool.query(totalCount);
        if (getInvoiceData.recordset.length) {
          return res.status(status_code.OK).json({
            data: getInvoiceData.recordset,
            totalRecord: getTotalCount.recordset[0].totalcount,
            filteredCount: getFilterCount.recordset[0].filterCount,
            status_code: 200,
            message: 'invoice_details',
            status: true,
          });
        }
        else {
          return res.status(status_code.OK).json({
            data: [],
            status_code: 200,
            message: 'no_data_found',
            status: true,
          });
        }
      }
      else {
        return res.status(status_code.OK).json({
          data: [],
          status_code: 200,
          message: 'no_active_biller_found',
          status: true,
        });
      }
    }
    else {
      return res.status(status_code.INTERNAL_SERVER_ERROR).json({
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
    return res.status(status_code.INTERNAL_SERVER_ERROR).json({
      status_code: 500,
      message: 'something_went_wrong',
      status: false,
    });
  }
}
// getContact from bexio API 
const getContact = async (req, res) => {
  let cookie;
  const gate2pool = await gate2B;
  // const data = req.body;
  try {
    cookie = JSON.parse(encryptionControl.decryptCookie(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME]));
    let accessToken = cookie.access_Token;
    const options = {
      method: 'GET',
      url: `https://api.bexio.com/2.0/contact`,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
    };
    await request(options, async function (error, response) {
      if (error) {
        return res.status(500).json({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
      }
      else {
       let countryData
       let contactData
       let countryList = [];
       countryData = await getCountry(accessToken)
       countryData = JSON.parse(countryData);
       contactData = JSON.parse(response.body)
       countryData['message'] != 'Unauthorized' ? countryList = countryData:[];
       console.log("countryList",countryList);
       const getMerged = ` SELECT rk_contact FROM contact_bc
       WHERE "type" = 'EBILL'`
        const getLinked = await gate2pool.query(getMerged)
        console.log(getLinked.rows);
        if (getLinked.rows.length) {
          for (let index = 0; index < contactData.length; index++) {
            getLinked.rows.filter(element => {
              if (element.rk_contact == contactData[index]['id']) {
                contactData[index]['isLinked'] = true;
              }
              else {
                contactData[index]['isLinked'] = false;
              }
            })
          }
        }
       for(let index = 0; index < contactData.length; index++) {
          countryList.filter(element=>{
            let countryName
            if(element.id == contactData[index]['country_id']){
              if(element.id != null){
              countryName = element['name']
              contactData[index]['country'] = countryName
              }
             }
            !contactData[index]['country'] ? contactData[index]['country'] = '' :''
              })
            
        }
        return res.status(status_code.OK).json({
          data:contactData,
          status_code: 200,
          message: 'get_contact_data',
          status: true,
        });
      }
    })
  }
  catch (error) {
    logs.action = 'GET_CONTACT';
    logs.level = 'ERROR';
    logs.item = 'EBILL';
    //addlogs(logs);
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + cookie;
    warningMessage(commonErrors, error);
    return res.status(status_code.INTERNAL_SERVER_ERROR).json({
      status_code: 500,
      message: 'something_went_wrong',
      status: false,
    });
  }
}
// getCountry from bexio API 
const getCountry = async (accessToken) => {
  let accessTokenData = null
  try {
    return new Promise(async(resolve, reject) => {
    accessTokenData = accessToken;
    const options = {
      method: 'GET',
      url: `https://api.bexio.com/2.0/country`,
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${accessTokenData}`
      },
    };
    await request(options, async function (error, response) {
      if (error) {
            commonErrors['errorTitle'] = 'getCountry';
            commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-bexio param,'+accessTokenData;
            warningMessage(commonErrors,error);
            resolve(false)
      }
      else {
        if(response.statusCode==200)
        resolve(response.body);
        else
        resolve(false)
      }
    })
  });
 }
  catch (error) {
    commonErrors['errorTitle'] = getCountry;
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + accessTokenData;
    warningMessage(commonErrors, error);
  }
}
// mergeAccept from server DB
const mergeAccept = async (req, res) => {
  let encrToken = null
  const gate2pool = await gate2B;
  const pool = await dbConn;
  const sql = require('mssql')
  let transaction = new sql.Transaction(pool);
  await transaction.begin()
  gate2pool.query('begin');
  let data = encryptionControl.decrypt(req.body.encrToken);
  try {
    encrToken = encryptionControl.decrypt(req.body.encrToken);
    data = encrToken;
    const receiptId = encrToken.receiptId;
    const netcomId = encrToken.netcomId;
    const bexioCustomerId = encrToken.bexioCustomerId;
    const getCompany = `SELECT cid FROM  companyregistered c WHERE netcomid =$1`;
    const getCompanydata = await gate2pool.query(getCompany, [netcomId]);
    if (getCompanydata.rows.length) {
      const addBexioQuery = `INSERT INTO  contact_bc (fk_companyregistered,rk_contact,"type",recipientid)
                         VALUES($1,$2,$3,$4)`
      await gate2pool.query(addBexioQuery, [getCompanydata.rows[0].cid, bexioCustomerId, 'EBILL', receiptId])
      const updateRecipientQuery = `UPDATE recipient SET islinked = '1' WHERE recipientid ='${receiptId}'`
      await new sql.Request(transaction).query(updateRecipientQuery)
      let bexioUpdate: any = await updateBexioConatct(req, bexioCustomerId, receiptId)
      console.log("bexioUpdate Result----",bexioUpdate);
      if (bexioUpdate.statusCode == 200 && bexioUpdate.status) {
        await transaction.commit();
        gate2pool.query('COMMIT', err => {
          if (err) {
            console.error('Error committing transaction')
          }
        })
        let temp = req.url.substr(1,req.url.length);
        console.log('temp',temp);
        let redisKey = data.rolePartyId+"_/";
        await deleteRedis(req.url.substr(1,req.url.length),redisKey);
        logs.action = 'MERGE_ACCEPT';
        logs.level = 'NOTIFICATION';
        logs.item = 'EBILL';
        addlogs(logs,data.rolePartyId,data.roleAccId);
        return res.status(status_code.OK).json({
          status_code: 200,
          message: 'success_contact_update',
          bexioUpdate: bexioUpdate,
          status: true,
        });        
      }
      else {
        await transaction.rollback();
        gate2pool.query('ROLLBACK', err => {
          if (err) {
            console.error('Error rolling back client_gate2b', err)
          }
        })
        logs.action = 'MERGE_ACCEPT';
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        addlogs(logs,data.rolePartyId,data.roleAccId);
        return res.status(status_code.INTERNAL_SERVER_ERROR).json({
          status_code: 500,
          message: 'bexio_error_mergeAccept_validationError',
          bexioUpdate: bexioUpdate,
          status: false,
        });
      }
    }
    else {
      await transaction.rollback();
      gate2pool.query('ROLLBACK', err => {
        if (err) {
          console.error('Error rolling back client_gate2b', err)
        }
      })
      logs.action = 'MERGE_ACCEPT';
      logs.level = 'ERROR';
      logs.item = 'EBILL';
      addlogs(logs,data.rolePartyId,data.roleAccId);
      return res.status(status_code.INTERNAL_SERVER_ERROR).json({
        status_code: 500,
        message: 'bexio_error_mergeAccept_companyNotFound',
        status: false,
      });
    }
  }
  catch (error) {
    await transaction.rollback();
    gate2pool.query('ROLLBACK', err => {
      if (err) {
        console.error('Error rolling back client_gate2b', err)
      }
    })
    logs.action = 'MERGE_ACCEPT';
    logs.level = 'ERROR';
    logs.item = 'EBILL';
    addlogs(logs,data.rolePartyId,data.roleAccId);
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
// update bexio contact with receiptId
const updateBexioConatct = async (req, bexioCustomerId, receiptId) => {
  return new Promise( async (resolve,reject)=>{
  let cookie
  try {
    cookie = JSON.parse(encryptionControl.decryptCookie(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME]));
    let accessToken = cookie.access_Token;
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
      // body: `[{"name": "ebill_pid","value": "${receiptId}"}]`
      body: JSON.stringify(data)
    };
    await request(options, async function (error, response) {
      if (error) {
        commonErrors['errorTitle'] = req.originalUrl + `' updateBexioConatct'+' '+'bexioCustomerId ----${bexioCustomerId}'+' '+'receiptId----${receiptId}'`;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + cookie;
        commonErrors['errorCode'] = config.ERROR_BEXIO_CONTACT
        warningMessage(commonErrors, error);
        return false
      }
      if(response.statusCode == 200){
        resolve({statusCode:response.statusCode,status:true});
      }
      else {
        resolve({statusCode:response.statusCode,body:response.body,status:false});
      }
    })
  }
  catch {
    return false
  }
})
}
// bexio update biller with billerId
const bexioUpdateBiller = async (req, billerId) => {
  return new Promise( async (resolve,reject)=>{
  let cookie;
  try {
    cookie = JSON.parse(encryptionControl.decryptCookie(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME]));
    let accessToken = cookie.access_Token;
    let data = {
      "name":"io_market.ebill_pid",
      "value":`${billerId}` 
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
        console.log("response from bexio update biller error----",error);
        commonErrors['errorTitle'] = req.originalUrl + `' bexioUpdateBiller'+' '+'billerId ----${billerId}'`;
        commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + cookie.access_Token;
        commonErrors['errorCode'] = config.ERROR_BEXIO_BILLER
        warningMessage(commonErrors, error);
        resolve(false);
      }
      else {
        console.log("response from bexio update biller----",response.body);
        resolve(true);
      }
    })
  }
  catch {
    resolve(false);
  }
})
}
// for python API call
const bexioCreatePythonData = async (netcomId,companyName,encrToken) => {
  return new Promise(async (resolve, reject) => {
  let data = null
  try{ 
  if(companyName === 'Bexio'){
    data = JSON.parse(config.BEXIO_CREATE_BUSSINESS_CONNECTION)
   }
else{
  data = JSON.parse(config.CREATE_BUSSINESS_CONNECTION)
  let response = JSON.parse(encrToken.config)
  data.config.platform["config"] = {}
  data.config["fk_doc_type"] = response.fk_doc_type || '',
  data.config["fk_doc_format"] = response.fk_doc_format || '',
  data.config["fk_netcomid_doc_interface"] = response.fk_netcomid_doc_interface || ''
  data.config["include_pdf"] = response.include_pdf || 0
}
  data.config['netcom_id'] = `${netcomId}`
  // data.config['name'] = 'EBILL_$SEND$_'+netcomId
  let docTypeFormat = encrToken.docTypeFormat ? JSON.parse(encrToken.docTypeFormat) : '';
  let doc_type = docTypeFormat ? docTypeFormat.doc_type : data.config["fk_doc_type"].toUpperCase();
  let doc_format = docTypeFormat ? docTypeFormat.doc_type : data.config["fk_doc_format"];
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
  await request(options, async function (error, response) {
    if (error) {
      let responseValue = JSON.stringify(data)
      commonErrors['errorTitle'] = ' bexioCreatePythonData';
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + responseValue;
      warningMessage(commonErrors, error);
      return  resolve(false);
    }
    else {
      let dataValue = JSON.parse(response.body)
      if (dataValue.status) {
        return resolve(true);
      }
      else{
      let responseValue = JSON.stringify(data)
      commonErrors['errorTitle'] = 'bexioCreatePythonData';
      commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + 'something wrong'+responseValue;
      warningMessage(commonErrors,responseValue);
      return resolve(false);
      }
    }
  })
}
catch(error){
  let responseValue = JSON.stringify(data)
  commonErrors['errorTitle'] = 'bexioCreatePythonData';
  commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString()+'req param-'+responseValue;
  warningMessage(commonErrors, error);
  return reject(false);
 }
})
}
// search biller deatils
const searchBiller = async (req, res) => {
  let encrToken = null;
  try {
    encrToken = encryptionControl.decrypt(req.body.encrToken);
    let limit = encrToken.limit || 100
    let offset = encrToken.offset || 0
    let name = encrToken.name;
    let data = {
      filter: {
        'name':name
        // 'esrParticipantNumber':
        // 'enterpriseIdentificationNumber':'CHE437857675'
        // 'iban':
        // 'besr':
      }
    }
    const resetToken = crypto.randomBytes(15).toString('hex');
    const options = {
      method: 'POST',
      url: config.SIX_API_CERTIFICATE_BASE + `billers/search?limit=${limit}&offset=${offset}`,
      headers: {
        'x-networkpartner-id':config.NETWORK_PARTNER_ID,
        'X-Correlation-Id': resetToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      key: fs.readFileSync(config.CERTIFICATE_PATH + config.SIX_API_KEY),
      cert: fs.readFileSync(config.CERTIFICATE_PATH+config.SIX_API_CERTIFICATE)
    };
    await request(options, async function (error, response) {
      if (error) {
        return res.status(status_code.INTERNAL_SERVER_ERROR).json({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
      }
      else {
        if(response.body){
          let companyResponse = JSON.parse(response.body);
          let companyStatus = companyResponse.totalCount == 0 ? false : true ;
        return res.status(status_code.OK).json({
          data: companyStatus,
          status_code: 200,
          message: 'get_biller_data',
          status: true,
        });
      }
      else{
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
// get all subscribers in ebill
const getAllSubcribers = async (req, res) => {
  let encrToken = null;
  let data;
  try {
    encrToken = encryptionControl.decrypt(req.body.encrToken);
    data = encrToken;
    const netcomId = encrToken.netcomId;
    const email = encrToken.email || null
    const reciepent = encrToken.recipientId || null
    const name = encrToken.fullName || encrToken.name || null;
    const isLinked = encrToken.isLinked || 0
    let likeValue ='%';
    let emailValue
    let reciepentValue
    let nameValue;
    if(email == null){
      emailValue = likeValue+likeValue 
    }
    else{
      emailValue = likeValue+email+likeValue
    }
    if(reciepent == null){
      reciepentValue = likeValue+likeValue 
    }
    else{
      reciepentValue = likeValue+reciepent+likeValue
    }
    if(name == null){
      nameValue = likeValue+likeValue 
    }
    else{
      nameValue = likeValue+name+likeValue
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
        const getSubcribeDetails = `SELECT * from 
      (SELECT r.recipientid
          ,r.name AS surname
          ,r.firstname
          ,r.email
          ,r.streetnumber
          ,r.street
          ,r.zip
          ,r.city
          ,r.countrycode
          ,r.created
          ,r.lastupdate
          ,r.SubscriptionFormFieldsJSON AS subscription
          ,r.party_specific_id
          ,r.id as subscriptionId
          ,r.status,ROW_NUMBER() OVER (order by r.created DESC) as RowNumber  FROM recipient r
      INNER JOIN biller b
      ON b.id = r.fk_biller WHERE r.islinked = '${isLinked}' AND b.billerid ='${getBillerData.recordset[0].billerid}'
      AND r.email LIKE '${emailValue}' AND r.recipientId LIKE '${reciepentValue}'
      AND (r.firstname  LIKE '${nameValue}' OR r.name LIKE '${nameValue}') 
      ) temp`;
        const getData = await pool.query(getSubcribeDetails)
        if (getData.recordset.length) {
          return res.status(status_code.OK).json({
            data: getData.recordset,
            status_code: 200,
            message: 'subscriber_details',
            status: true,
          });
        }
        else {
          
          return res.status(status_code.OK).json({
            data: [],
            status_code: 200,
            message: 'no_data_found',
            status: true,
          });
        }
      }
      else {
        return res.status(status_code.OK).json({
          data: [],
          status_code: 200,
          message: 'no_active_biller_found',
          status: true,
        });
      }
    }
    else {
      logs.action = 'GET_ALL_SUBSCRIBERS';
      logs.level = 'ERROR';
      logs.item = 'EBILL';
      addlogs(logs,data.rolePartyId,data.roleAccId);
      return res.status(status_code.INTERNAL_SERVER_ERROR).json({
        status_code: 500,
        message: 'empty_or_null_netcomId',
        status: false,
      });
    }
  }
  catch (error) {
    logs.action = 'GET_ALL_SUBSCRIBERS';
    logs.level = 'ERROR';
    logs.item = 'EBILL';
    addlogs(logs,data.rolePartyId,data.roleAccId);
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
const updatePartySpecific = async (req, res) => {
  let encrToken = null;
  try {
    const pool = await dbConn;
    encrToken = encryptionControl.decrypt(req.body.encrToken);
    console.log(encrToken);
    const validation = async (encrToken) => {
      if (!(parseInt(encrToken.subscriptionId)) || !(encrToken.partySpecificId)) {
        return true;
      }
      else {
        return false
      }
    };
    let validationResult = await validation(encrToken);
    if (!validationResult) {
      // const getSpecificId = `SELECT r.id from recipient r 
      //                        INNER JOIN biller b ON b.id = r.fk_biller 
      //                        WHERE b.netcomid = '${encrToken.netcomId}' AND r.party_specific_id = '${encrToken.partySpecificId}'`
      // let existedData = await pool.query(getSpecificId)
      // if(existedData.recordset.length){
      //   return res.status(status_code.OK).json({
      //     status_code: 200,
      //     message: 'already_exist_party_specific_id',
      //     status: true,
      //   }); 
      // }
      const updatePartySpecific = `UPDATE recipient SET party_specific_id = '${encrToken.partySpecificId}' WHERE id='${encrToken.subscriptionId}'`
      await pool.query(updatePartySpecific)
      // console.log(t);
      return res.status(status_code.OK).json({
        status_code: 200,
        message: 'update_party_specific_id',
        status: true,
      });
    }
    else {
      return res.status(status_code.INTERNAL_SERVER_ERROR).json({
        status_code: 500,
        message: 'empty_or_null_subscriptionId',
        status: false,
      });
    }
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
const createBexiobiller = async(data)=>{
  return new Promise(async (resolve, reject) => {
    let responseData = null
    try {
      // let tempData = JSON.parse(data).data;
      let formData = {
        netcomid:data
     
      }
       console.log('formData-createBexiobiller',formData);
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
        if(error){
          commonErrors['errorTitle'] = 'updateConnection';
          commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString();
          warningMessage(commonErrors, error);
          return resolve(false)
        }
        else{
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
const disconnectRecipient = async (req, res) => {
  let encrToken = null
  let newReceiptId = null
  const gate2pool = await gate2B;
  const pool = await dbConn;
  encrToken = encryptionControl.decrypt(req.body.encrToken);
  
  const sql = require('mssql')
  let transaction = new sql.Transaction(pool);
  await transaction.begin();
  const data = encrToken;
  gate2pool.query('begin');
  try {
    const receiptId = encrToken.receiptId
    const netcomId = encrToken.netcomId
    const bexioCustomerId = encrToken.bexioCustomerId
    const getCompany = `SELECT cid FROM  companyregistered c WHERE netcomid =$1`
    const getCompanydata = await gate2pool.query(getCompany, [netcomId])
    if (getCompanydata.rows.length) {
      const addBexioQuery = ` UPDATE contact_bc
      SET recipientid = ${newReceiptId}
      WHERE rk_contact = ${bexioCustomerId}
      AND fk_companyregistered = ${getCompanydata.rows[0].cid}`                      
      await gate2pool.query(addBexioQuery)
      const updateRecipientQuery = `UPDATE recipient 
                                    SET islinked = '0'
                                    FROM recipient rec 
                                    INNER JOIN biller bill 
                                    ON bill.id = rec.fk_biller 
                                    WHERE recipientId ='${receiptId}'`
    
      await new sql.Request(transaction).query(updateRecipientQuery)
      let bexioUpdate = await updateBexioConatct(req, bexioCustomerId, newReceiptId)
      if (bexioUpdate) {
        await transaction.commit();
        gate2pool.query('COMMIT', err => {
          if (err) {
            console.error('Error committing transaction')
          }
        })
        logs.action = 'DISCONNECT_RECIPIENT';
        logs.level = 'NOTIFICATION';
        logs.item = 'EBILL';
        addlogs(logs,data.rolePartyId,data.roleAccId);
        return res.status(status_code.OK).json({
          status_code: 200,
          message: 'common_success',
          bexioUpdate: bexioUpdate,
          status: true,
        });
      }
      else {
        await transaction.rollback();
        gate2pool.query('ROLLBACK', err => {
          if (err) {
            console.error('Error rolling back client_gate2b', err)
          }
        })
        logs.action = 'DISCONNECT_RECIPIENT';
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        addlogs(logs,data.rolePartyId,data.roleAccId);
        return res.status(status_code.INTERNAL_SERVER_ERROR).json({
          status_code: 500,
          message: 'something_went_wrong',
          bexioUpdate: bexioUpdate,
          status: false,
        });
      }

    }
    else {
      await transaction.rollback();
      gate2pool.query('ROLLBACK', err => {
        if (err) {
          console.error('Error rolling back client_gate2b', err)
        }
      })
      logs.action = 'DISCONNECT_RECIPIENT';
      logs.level = 'ERROR';
      logs.item = 'EBILL';
      addlogs(logs,data.rolePartyId,data.roleAccId);
      return res.status(status_code.INTERNAL_SERVER_ERROR).json({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
      });
    }
  }
  catch (error) {
    await transaction.rollback();
    gate2pool.query('ROLLBACK', err => {
      if (err) {
        console.error('Error rolling back client_gate2b', err)
      }
    })
    logs.action = 'DISCONNECT_RECIPIENT';
    logs.level = 'ERROR';
    logs.item = 'EBILL';
    addlogs(logs,data.rolePartyId,data.roleAccId);
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
const getContactList = async (req, res) => {
  let cookie;
  let encrToken 
  const gate2pool = await gate2B;
  const pool = await dbConn;
  let receipientContactIds;
  let data;
  try {
    cookie = JSON.parse(encryptionControl.decryptCookie(req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME]));
    let accessToken = cookie.access_Token;
    encrToken = encryptionControl.decrypt(req.body.encrToken);
    data = encrToken;
    let showFrom = encrToken.records_per_page * (encrToken.page_number-1);
    let showTo = encrToken.records_per_page;    
    let totalCount: any = 0,filterCount: any = 0;
    let rkContactIn = false;
    console.log('encrToken',encrToken);
    
    let options;
    if(encrToken['receipientId'] != '' && encrToken['receipientId']){      
      const getContactId = `SELECT cb.rk_contact FROM contact_bc cb 
        INNER JOIN companyregistered c ON c.cid = cb.fk_companyregistered
      WHERE 
        cb.recipientid = $1 AND cb.type = 'EBILL' 
        AND cb.rk_contact IS NOT NULL
        AND c.rk_party = $2`;
      console.log('getContactId',getContactId);
      rkContactIn = true;
      const getContactIdQry = await gate2pool.query(getContactId,[encrToken['receipientId'],encrToken['partyId']]);
      console.log('getContactIdQry.rows',getContactIdQry.rows);
      if( getContactIdQry.rows.length > 0){
        console.log('rkContactIn',rkContactIn);
        receipientContactIds = getContactIdQry.rows[0].rk_contact;
        console.log('receipientContactIds',receipientContactIds);

      }      
    }
    if(encrToken['name_1'] || encrToken['name_2'] || encrToken['email'] || rkContactIn){
      let searchJson = [];      
      if(encrToken['name_1'] != '' && encrToken['name_1']){
        searchJson.push({
          "field":"name_1",
          "value":encrToken.name_1,
          "criteria":"like"
        });
      }
      if(encrToken['name_2'] != '' && encrToken['name_2']){
        searchJson.push({
          "field":"name_2",
          "value":encrToken.name_2,
          "criteria":"like"
        });
      }
      if(encrToken['email'] != '' && encrToken['email']){
        searchJson.push({
          "field":"mail",
          "value":encrToken.email,
          "criteria":"like"
        });
      }
      console.log("encrToken['receipientId']",encrToken['receipientId']);
      console.log('11111111111111111111111111111111');
      
      if(encrToken['receipientId'] != '' && encrToken['receipientId']){      
        if( receipientContactIds ){
          searchJson.push({
            "field":"id",
            "value": receipientContactIds,
            "criteria":"equal"
          });
        }
        else{
          return res.status(200).json({
            data:[],
            status_code: 200,
            recordsTotal: totalCount,
            recordsFiltered: filterCount,
            message: 'get_contact_data',
            status: true,
          });
        }
      }      
      options = {
        method: 'POST',
        url: `https://api.bexio.com/3.0/contact/search/?limit=${showTo}&offset=${showFrom}&order_by=updated_at_desc`,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(searchJson)
      };      
      filterCount = await contactListCountSearch(accessToken,searchJson,0,2000)
      totalCount = await  contactListCount(accessToken,0,2000);
    }
    else{
      options = {
        method: 'GET',
        url: `https://api.bexio.com/3.0/contact/?limit=${showTo}&offset=${showFrom}&order_by=updated_at_desc`,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      };
      totalCount = await  contactListCount(accessToken,0,2000);
      filterCount = totalCount;      
    }
    
    await request(options, async function (error, response) {
      if (error) {
        console.log('error',error);
        logs.action = 'GET_CONTACT_LIST';
        logs.level = 'ERROR';
        logs.item = 'EBILL';
        addlogs(logs,data.rolePartyId,data.roleAccId);
        return res.status(500).json({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
      }
      else {
          if(response.statusCode!=200)
          {
            console.log('error',error);
            logs.action = 'GET_CONTACT_LIST';
            logs.level = 'ERROR';
            logs.item = 'EBILL';
            addlogs(logs,data.rolePartyId,data.roleAccId);
            res.send({
              status_code: 500,
              message: 'something_went_wrong',
              status: false,
            });
          return
        }
        let countryData
        let contactData
        //  let countryList = [];       
        //  countryData = await getCountry(accessToken)
        //  countryData = JSON.parse(countryData);
        //  contactData = JSON.parse(response.body)
        let resData,subscriberList ;
        let countryList = {};
        // resData = await getCountry(accessToken);
        // if(!resData)
        // {
        //   res.send({
        //     status_code: 500,
        //     message: 'something_went_wrong',
        //     status: false,
        
        // });
        // return
        // }
        // resData = JSON.parse(resData);
        contactData = JSON.parse(response.body);      
        // resData['message'] != 'Unauthorized' ?resData.forEach((country) => {
        //   countryList[country.id] = country.name
        // }):'';
        // const getSubscribers = `SELECT 
        //                   r.recipientid
        //                   ,r.firstname  AS fullname
        //                   FROM recipient r
        //                   INNER JOIN biller b
        //                   ON b.id = r.fk_biller WHERE b.netcomid ='${encrToken.netcomId}'` ;
        // const getSubscribersList = await pool.query(getSubscribers);
        // getSubscribersList.recordset.forEach((subscriber) => {
        //   subscriberList[subscriber.recipientid] = subscriber.fullname;
        // });

        // countryData['message'] != 'Unauthorized' ? countryList = countryData:[];

        //  if(getSubscribersList.recordset.length){
        // console.log('countryList',countryList['1']);
        
        //  for await (const item of contactData) {
          // contactData.forEach(element => {
          //   subscriberList ? element['subscriberName'] = subscriberList[element['ebill_pid']] : '';
          //   element['country'] = countryList[element['country_id']] ?  countryList[element['country_id']] : '';
          //  });
          //  console.log('item',item);
           
          // subscriberList ? item['subscriberName'] = subscriberList[item['ebill_pid']] : '';
          // console.log("item['country_id']",item['country_id']);
          // console.log("countryList[item['country_id']]",countryList[item['country_id']]);

          
          // contactData[item['country']] = countryList[item['country_id']];
          // subscriberList[]
        //  }
        console.log('contactData',contactData);
         
        // for(let index = 0; index < contactData.length; index++) {
        //   getSubscribersList.recordset.filter(element=>{
        //     if(element.recipientid == contactData[index]['ebill_pid']){
        //       contactData[index]['subscriberName'] = element.fullname;
        //     }

        //   })
        //   contactData[index]['country'] = countryList[contactData[index]['country_id']] ? countryList[contactData[index]['country_id']] : '';

        // }
        //  }
        //  if(countryList.length){
        //   for(let index = 0; index < contactData.length; index++) {
        //       countryList.filter(element=>{
        //         let countryName
        //         if(element.id == contactData[index]['country_id']){
        //           if(element.id != null){
        //           countryName = element['name']
        //           contactData[index]['country'] = countryName
        //           }
        //         }
        //         !contactData[index]['country'] ? contactData[index]['country'] = '' :''
        //       });
        //     }
        //   }
        // console.log(contactData);
            let keys = Object.keys(encrToken)
            let redisKey = encrToken.partyId+"_"+req.url+"_";
            console.log('redisKey',redisKey);
            keys.forEach(element => {
                redisKey = encrToken[element]? redisKey +element+':'+ encrToken[element] + '_' : redisKey
            });
            await redisClient.setex(redisKey,24*60*60*2,JSON.stringify({
              status: 200,
              data:resData,
              totalCount:totalCount
          } ));
        return res.status(200).json({
          data:contactData,
          status_code: 200,
          recordsTotal: totalCount,
          recordsFiltered: filterCount,
          message: 'get_contact_data',
          status: true,
        });
      }
    })
  }
  catch (error) {
    console.log('error',error);
    logs.action = 'GET_CONTACT_LIST';
    logs.level = 'ERROR';
    logs.item = 'EBILL';
    addlogs(logs,data.rolePartyId,data.roleAccId);
    commonErrors['errorTitle'] = req.originalUrl;
    commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + cookie;
    warningMessage(commonErrors, error);
    return res.status(500).json({
      status_code: 500,
      message: 'something_went_wrong',
      status: false,
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

// get biller basic informations from server Db

module.exports={
    createBiller,
    updateBiller,
    updateAsset,
    getBillerDetails,
    getSectors,
    getAsset,
    getSubscribers,
    getInvoices,
    getBiller,
    getContact,
    mergeAccept,
    searchBiller,
    getAllSubcribers,
    updatePartySpecific,
    disconnectRecipient,
    getContactList
}