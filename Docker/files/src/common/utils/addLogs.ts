import config from '../config/index';
const request = require('request');
const crypto = require('crypto');
const fs = require('fs');
const util = require('util');
const {  Kafka} = require('kafkajs')
import {  unpack,  pack} from 'msgpackr';
import connectPostgres from '../../common/loaders/postgres';

const addLogs = async (data, rolePartyId ? , roleAccId ? ) => {
  const pool = await connectPostgres;
  let accountDetailsResult;
  const qryGetCompanyDetails = ` SELECT pa.cid,lp.companyname,a.code AS app,av.version AS appversion
    FROM partyapplication pa 
      INNER JOIN application_version av ON av.cid = pa.fk_application_version  
      INNER JOIN application a ON a.cid = av.fk_application
      INNER JOIN legalparty lp ON lp.fk_party = pa.fk_party
    WHERE pa.fk_party = ${rolePartyId} AND a.code = '${data.item}'`
  const companyDetailsResult = await pool.query(qryGetCompanyDetails);
  if (roleAccId) {
    const accountDetails = `SELECT CONCAT  (givenname, ' ', familyname) AS "username",email,p.cid as party_account_id
      FROM "user" u  
      INNER JOIN account a ON a.fk_user = u.cid
      INNER JOIN party_account p ON p.fk_account=a.cid
      WHERE p.fk_account=${roleAccId} AND p.fk_party =${rolePartyId}`;
    accountDetailsResult = await pool.query(accountDetails);
  }
  if(companyDetailsResult.rows.length > 0 && accountDetailsResult.rows.length >0){

  let objectId = crypto.randomBytes(15).toString('hex');
  data.objectid = objectId;
  data.rk_party_application_version = companyDetailsResult.rows[0]?.cid;
  data.rk_party_account = accountDetailsResult.rows.length ? accountDetailsResult.rows[0]?.party_account_id : '';
  data.companyName = companyDetailsResult.rows[0]?.companyname || '';
  data.user.name = accountDetailsResult.rows.length ? accountDetailsResult.rows[0]?.username : '';
  data.user.email = accountDetailsResult.rows.length ? accountDetailsResult.rows[0]?.email : '';
  data.application.name = companyDetailsResult.rows[0]?.app || '';
  data.application.version = companyDetailsResult.rows[0]?.appversion || '';
  data.timestamp = new Date().toISOString();
  data['rk_object'] = '';
  console.log('addLogs', data);

  var currentdate = Date.now() + (crypto.randomBytes(16).toString("hex")).toUpperCase();
  let mainFolder = config.LOG_PATH;
  if (!fs.existsSync(mainFolder)) {
    fs.mkdirSync(mainFolder)
  }
  let folderName = mainFolder + '/';
  // try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName)
    fs.writeFile(folderName + currentdate + '.json', JSON.stringify(data), function (err) {
      if (err) {
        console.log(err);
      }
    });
  } else {
    fs.writeFile(folderName + currentdate + '.json', JSON.stringify(data), function (err) {
      if (err) {
        console.log(err);
      }
    });
  }
  let finalPath = currentdate + '.json' // saved filepath name in db
  const kafka = new Kafka({
    brokers: [config.LOGGER_KAFKKA_HOST],
  })
  const producer = kafka.producer()
  await producer.connect()
  async function queueMessage(finalPath) {
    let success = await producer.send({
      topic: config.LOGGER_KAFKKA_TOPIC,
      messages: [{
        value: finalPath
      }, ],
    })
    console.log('packed Message', finalPath);
    if (success) {
      console.log(`message queued (${unpack(finalPath)})`);
    } else {
      console.log('Error..');
    }
  }
  let dataObj = {
    'pathValue': finalPath
  };
  console.log('dataObj', dataObj);

  let jsonString = JSON.stringify(dataObj);
  console.log('jsonString', jsonString);
  try {
    let finalPathResult = pack(jsonString);
    console.log('finalPathResult', finalPathResult);
    queueMessage(finalPathResult);

  } catch (error) {
    console.log('erorrAddLog');
    
  }
 

}

}

export default addLogs;
