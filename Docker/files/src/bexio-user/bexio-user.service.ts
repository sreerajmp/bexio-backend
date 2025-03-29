import { Injectable } from '@nestjs/common';
import { connectBexio, connectLibrary, connectGate2b, connectNewGate2b } from '../db/prisma-clients';
import { generators } from 'openid-client'
const code_verifier = generators.codeVerifier();
const code_challenge = generators.codeChallenge(code_verifier);
import config from '../common/config/index';
import { edit } from '../common/utils/bexioClient';
import * as request from 'request';
import { Request, Response } from 'express';
const encryptionControl = require("../common/utils/jwt-decode");
const fetchEmailContent = require('../common/utils/fetchEmailData');
const sendEmail = require('../common/utils/email');
const jwt = require('jsonwebtoken');
const mailchimp = require("@mailchimp/mailchimp_marketing");
import { Prisma } from '@prisma/client';
import redisClient from '../common/utils/redisDB';
@Injectable()
export class BexioUserService {
  async authorization(data: any): Promise<any> {

    const bexioClient = await edit();

    let url = bexioClient.authorizationUrl({
      scope: config.BEXIO_SCOPE,
      resource: 'https://auth.bexio.com/realms/bexio/protocol/openid-connect/auth',
      code_challenge,
      code_challenge_method: 'S256',
    });
    return ({ data: url });



  }
  async bexioRedirect(req: Request, res: Response, ): Promise<any> {
    // Use prisma to access your DB, example:
    let params
    console.log('data::', req);
    console.log('data::', req.body);
    console.log('API_URL', config.API_URL);
    // make sure this is inside an async function
    const bexioClient = await edit();
    console.log('bexioClient', bexioClient);

    params = bexioClient.callbackParams(req);
    console.log('params', params);
    console.log('config.API_URL', config.API_URL);

    console.log('code_verifier', code_verifier);
    const tokenSet = await bexioClient.callback(`${config.API_URL}api/v1/bexio-user/bexio-redirect`, params, { code_verifier });

    console.log('tokenSet', tokenSet);
    // console.log(tokenSet);

    let companyDetails = await this.getloginUserCompanyDetails(tokenSet.access_token);
    console.log('companyDetails',companyDetails);
    let coutryCode = await this.getConutryCode(tokenSet.access_token, companyDetails[0]['country_name'])
    console.log('coutryCode',coutryCode);
    let userDetails = await this.getLoginUserInfo(tokenSet.access_token)
    console.log('userDetails',userDetails);
    
    if (!companyDetails || !coutryCode || !userDetails) {
      return res.status(500).send({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
      });
    }
    console.log('typeof companyDetails:', typeof companyDetails);
    console.log('tempJson1',companyDetails);
    console.log('tempJson2',companyDetails[0]);
    const tempJson = companyDetails[0];
    console.log('tempJson3',tempJson);

    if (
      !tempJson['country_name'] ||
      !tempJson['name'] ||
      !tempJson['address'] ||
      !tempJson['city'] ||
      !tempJson['postcode'] ||
      !tempJson['country_id']
    ) {
      return res.redirect(`${config.BEXIO_APP_URL}#/login/unauthorized`);
    }
    console.log('test',tempJson);
    const requiredCompanyFields = ['name', 'address', 'city', 'postcode', 'country_id'];
    const validationCompany = this.validateFields(companyDetails[0], requiredCompanyFields);
    console.log('validationCompany',validationCompany);
    const requiredUserFields = ['given_name', 'family_name', 'email'];
    const validationUser = this.validateFields(userDetails, requiredUserFields);
    console.log('validationUser',validationUser);

    if (!validationCompany || !validationUser) {
      return res.redirect(`${config.BEXIO_APP_URL}#/login/unauthorized`);
    }
    if (validationCompany && validationUser) {
      let rolesDetails = await this.getLoginUserRoles(tokenSet.access_token);
      if (!rolesDetails) {
        return res.status(500).send({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
      }

      let isAdmin;
      if (rolesDetails.indexOf('is_superadmin') != -1) {
        isAdmin = true;
      } else {
        isAdmin = false;
      }
      let companyCreateStatus = await this.checkCompanyStatus(companyDetails[0]['name'], isAdmin);
      console.log('companyCreateStatus', companyCreateStatus);
      if (companyCreateStatus) {

        let token = tokenSet.access_token;
        let refreshToken = tokenSet.refresh_token;
       console.log('rk_csn',jwt.decode(token)['company_id']);

        let rk_csn = jwt.decode(token)['company_id']
        const check = await connectBexio.companyregistered.findMany({
          where: { rk_csn: rk_csn },
        });

        if (check.length == 0) {

          const insertData = await connectLibrary.$queryRaw<any[]>`
          INSERT INTO activation(detail) VALUES (${userDetails}) RETURNING objectid
        `;

          let bexioTokenCookie = {
            access_Token: tokenSet.access_token,
            refresh_Token: tokenSet.refresh_token,
            isBexioUser: true
          }
          console.log('=== Cookie Debug Logs ===');
          console.log('1. Cookie Names:', {
            BILLING_COOKIE: config.BILLING_COOKIE_NAME,
            TOKEN_COOKIE: config.TOKEN_COOKIE_BEXIO_NAME
          });
          console.log('2. Session Domain:', config.SESSION_DOMAIN);
          console.log('3. Session Expiry:', config.SESSION_EXPIRY);
          
          let billingCookie = {
            bexio: true,
            objectid: insertData[0]?.objectid
          }
          
          console.log('4. Billing Cookie Data:', billingCookie);
          console.log('5. Bexio Token Cookie Data:', bexioTokenCookie);
          
          // Encrypt cookie values
          const encryptedBillingCookie = encryptionControl.encrypt(JSON.stringify(billingCookie));
          const encryptedBexioTokenCookie = encryptionControl.encrypt(JSON.stringify(bexioTokenCookie));
          
          console.log('6. Encrypted Billing Cookie:', encryptedBillingCookie);
          console.log('7. Encrypted Bexio Token Cookie:', encryptedBexioTokenCookie);
          
          // Set cookies with detailed options
          const billingCookieOptions = {
            domain: config.SESSION_DOMAIN,
            maxAge: config.SESSION_EXPIRY,
            httpOnly: false,
            signed: false,
            secure: false,
            path: '/'
          };
          
          const bexioTokenCookieOptions = {
            domain: config.SESSION_DOMAIN,
            maxAge: config.SESSION_EXPIRY,
            secure: false,
            httpOnly: false,
            signed: false,
          };
          
          console.log('8. Billing Cookie Options:', billingCookieOptions);
          console.log('9. Bexio Token Cookie Options:', bexioTokenCookieOptions);
          
          // Set cookies
          res.cookie(config.BILLING_COOKIE_NAME, encryptedBillingCookie, billingCookieOptions);
          res.cookie(config.TOKEN_COOKIE_BEXIO_NAME, encryptedBexioTokenCookie, bexioTokenCookieOptions);
          
          // Log response headers
          console.log('10. Response Headers:', res.getHeaders());
          
          let bexioURL = config.BILLING_APP;
          console.log('11. Redirecting to:', bexioURL);
          console.log('=== End Cookie Debug Logs ===');
          
          return res.redirect(`${bexioURL}`);
        }
        else {
          let responseResult = await this.bexioUserCreate(userDetails, companyDetails, tokenSet.access_token, isAdmin, coutryCode, res, req)
          console.log('responseResult', responseResult);
          if(responseResult.status) {
            console.log('BEXIO_APP_URL',config.BEXIO_APP_URL);
            console.log(`${config.BEXIO_APP_URL}/landing/${encodeURIComponent(encryptionControl.encrypt(refreshToken))}/${encodeURIComponent(encryptionControl.encrypt(responseResult.partyAccountId.toString()))}`);
            return res.redirect(`${config.BEXIO_APP_URL}/landing/${encodeURIComponent(encryptionControl.encrypt(refreshToken))}/${encodeURIComponent(encryptionControl.encrypt(responseResult.partyAccountId.toString()))}/${encodeURIComponent(encryptionControl.encrypt(responseResult.isNewCompany.toString()))}`);
          } else {
            console.log('111');
            return res.redirect(`${config.BEXIO_APP_URL}/login/error`);
          }
        }
      } else {
        return res.redirect(`${config.BEXIO_APP_URL}/login/permissiondenied`);
      }
    }
    console.log('result');

    return res.status(200).send({
      status_code: 200,
      message: 'sucess',
      status: true,
    });
  }
  private async getloginUserCompanyDetails(access_token): Promise<any> {
    return new Promise((resolve) => {
      const options = {
        method: 'GET',
        url: 'https://api.bexio.com/2.0/company_profile',
        headers: {
          Accept: 'application/json',
          Authorization: 'Bearer ' + access_token,
        },
      };
      console.log('options', options);

      request(options, (error, response) => {
        if (error) {
          console.error('Error fetching company profile:', error);
          return resolve(false);
        }

        if (response.statusCode === 200) {
          try {
            return resolve(JSON.parse(response.body));
          } catch (e) {
            console.error('Failed to parse company profile:', e);
            return resolve(false);
          }
        } else {
          console.warn('Failed to fetch company profile. Status:', response.statusCode);
          return resolve(false);
        }
      });
    });
  }
  private async getConutryCode(token, country): Promise<any> {
    return new Promise((resolve) => {
      var options = {
        'method': 'POST',
        'url': 'https://api.bexio.com/2.0/country/search',
        'headers': {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'text/plain'
        },
        body: `[{"field": "name","value": "${country}","criteria": "="}]`

      };
      console.log('options', options);

      request(options, (error, response) => {
        if (error) {
          console.error('Error fetching company profile:', error);
          return resolve(false);
        }

        if (response.statusCode === 200) {
          try {
            resolve(JSON.parse(response.body)[0]?.iso_3166_alpha2);
          } catch (e) {
            console.error('Failed to parse company profile:', e);
            return resolve(false);
          }
        } else {
          console.warn('Failed to fetch company profile. Status:', response.statusCode);
          return resolve(false);
        }
      });
    });
  }
  private async getLoginUserInfo(token): Promise<any> {
    return new Promise((resolve) => {
      var options = {
        'method': 'GET',
        'url': 'https://auth.bexio.com/realms/bexio/protocol/openid-connect/userinfo',
        'headers': {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        }

      };
      console.log('options', options);

      request(options, (error, response) => {
        if (error) {
          console.error('Error fetching company profile:', error);
          return resolve(false);
        }

        if (response.statusCode === 200) {
          try {
             return resolve(JSON.parse(response.body))
          
          } catch (e) {
            console.error('Failed to parse company profile:', e);
            return resolve(false);
          }
        } else {
          console.warn('Failed to fetch company profile. Status:', response.statusCode);
          return resolve(false);
        }
      });
    });
  }
  private async getLoginUserRoles(access_token): Promise<any> {
    return new Promise((resolve) => {
      let companyUserId = jwt.decode(access_token)['company_user_id']
      var options = {
        'method': 'GET',
        'url': 'https://api.bexio.com/3.0/users/' + companyUserId,
        'headers': {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + access_token
        }
      };
      console.log('options', options);

      request(options, (error, response) => {
        if (error) {
          console.error('Error fetching company profile:', error);
          return resolve(false);
        }

        if (response.statusCode === 200) {
          try {
             resolve(response.body);
          } catch (e) {
            console.error('Failed to parse company profile:', e);
            return resolve(false);
          }
        } else {
          console.warn('Failed to fetch company profile. Status:', response.statusCode);
          return resolve(false);
        }
      });
    });
  }


  private async checkCompanyStatus(companyName: string, isAdmin: boolean): Promise<boolean> {
    const checkCompanyDetails = await connectLibrary.$queryRaw<any[]>(
      Prisma.sql`SELECT * FROM legalParty WHERE companyname = ${companyName}`
    );

    return checkCompanyDetails.length > 0 ? true : isAdmin;
  }

  private async bexioUserCreate(userDetails, companyDetails, accessToken, isAdmin, coutryCode, res, req): Promise<any> {
    console.log('bexioUserCreate::',req);

    let legalname, streetno, phoneNumber;
    let isNewCompany = false, paymentData, orderId;
    console.log('1');

    let email = userDetails.email;
    let givenname = userDetails.given_name;
    console.log("req.body", req.body);
    if (req?.body && req.body.PaymentRecord) {
      paymentData = encryptionControl.decryptCookie(req.body.PaymentRecord)
    }
    if (req?.body && req.body.orderId) {
      orderId = encryptionControl.decryptCookie(req.body.orderId)
    }

    let technicalContactId;
    let billingContactId;
    let companyContactId;


    let rk_csn = jwt.decode(accessToken)['company_id']
    let partyId, netcomIdG2b, newCompany, companyNameGate2b
    try {
      let party;
      let partyUser = true;
      let accountIdFinal = 0;
      let netcomeAddress;
      const isCompanyAlreadyExists = await connectBexio.companyregistered.findMany({
        where: { rk_csn: rk_csn },
      });

      if (isCompanyAlreadyExists.length === 0) {

        const companyDeatails = companyDetails[0];

        const isPartyExists = await connectLibrary.$queryRaw<any[]>(
          Prisma.sql`
                  SELECT lp.companyName, a.city, a.zip, a.country_code, lp.fk_party, p.objectid
                  FROM legalparty lp 
                  INNER JOIN address a ON a.fk_party = lp.fk_party
                  INNER JOIN party p ON p.cid = lp.fk_party
                  WHERE a._type = 'main'
                    AND lp.companyname = ${companyDeatails.name}
                    AND a.city = ${companyDeatails.city}
                    AND a.zip = ${companyDeatails.postcode}
                    AND a.country_code = ${coutryCode}
                    AND p.isdisabled = false
                `
        );
        legalname = companyDeatails.legal_form;
        streetno = companyDeatails.address.split(' ').length > 1 ? companyDeatails.address.split(' ').pop() : '';
        phoneNumber = companyDeatails.phone_fixed;

        console.log(companyDeatails.address.split(' ').length);
        console.log(streetno);

        if (companyDeatails.address.split(' ').length > 1) {
          console.log('streetno');

          let tempStreet = companyDeatails.address.split(' ');
          tempStreet.pop();
          companyDeatails.address = tempStreet.join(" ")

        }
        console.log('companyDeatails', companyDeatails);

        if (isPartyExists.length == 0) {
          newCompany = true;
          isNewCompany = true;
          let currency
          if (coutryCode === 'CH' || 'LI') {
            currency = 'CHF'
          }
          else {
            currency = 'EUR'
          }

          const getCurrencyCode = await connectLibrary.$queryRaw<any[]>(
            Prisma.sql`
                  SELECT c.cid 
                  FROM currency c
                  WHERE c."label" = ${currency}
                  `
          );

          console.log('getCurrencyCode', getCurrencyCode);


          party = await partyCreate(companyDeatails, coutryCode, email, getCurrencyCode[0].cid);
          partyId = party.companyCreated;
          await partyServiceUpdate(partyId, 'EDI', 'EDI');
          await addReferenceDetails(partyId)
          async function addReferenceDetails(companyId) {
            const getAgentDetails = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
                    SELECT cid FROM commissionagent WHERE referralcode = 'bexio'
                  `);

            if (getAgentDetails.length) {
              await connectLibrary.$queryRaw<any>(Prisma.sql`
                      INSERT INTO commissionagent_party (fk_commissionagent, fk_party, status)
                      VALUES (${getAgentDetails[0].cid}, ${companyId}, 'company_created')
                    `);
            } else {
              // let responseError ='Reference code incurrect or invalid'
              // commonErrors['errorTitle'] = 'bexio create';
              // commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+responseError;
              // warningMessage(commonErrors,responseError); 
            }
          }

          console.log('5555555555555555555555555555555555555');

          const ediPartyId = await netcomeCreate(party.partyResponse, getCurrencyCode[0].cid);
          console.log('ediPartyIdediPartyId', ediPartyId);



          const objectId = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
                SELECT p.objectid FROM party p WHERE p.cid = ${partyId}
              `);

          console.log('objectIdobjectIdobjectId', objectId);

          console.log('partyIdpartyId', partyId);


          const networkIdG2b = await connectNewGate2b.$queryRaw<any[]>(Prisma.sql`
                SELECT cid FROM network  WHERE name = ${'Bexio'}
                `);

          const newGate2bId = await connectGate2b.$queryRaw<any[]>(Prisma.sql`
                INSERT INTO ediparty (fk_network,rk_party,netcomid,fk_currency)
                VALUES (${networkIdG2b[0]?.cid}, ${objectId[0]?.objectid}, ${ediPartyId.netcomid}, ${getCurrencyCode[0].cid})
                RETURNING *
              `);

          console.log('4444444444444444444444444444444');

          netcomeAddress = await netcomGate2b(companyDeatails, party.partyResponse, ediPartyId, coutryCode, newGate2bId[0]?.cid, email);
          console.log('ediPartyId', ediPartyId);


          await saveLegal(party.partyResponse, companyDeatails);


          netcomIdG2b = ediPartyId.netcomid;
          companyNameGate2b = companyDeatails.name;

          partyUser = false;
        } else {



          const objectId = await connectGate2b.$queryRaw<any[]>(Prisma.sql`
                SELECT netcomid  FROM ediparty  WHERE  rk_party == ${isPartyExists[0]?.objectid}
              `);


          netcomIdG2b = objectId[0]?.netcomid;
          console.log(netcomIdG2b);

          newCompany = false;
          partyId = isPartyExists[0]?.fk_party;
          party = {
            addressMain: '',
            partyResponse: partyId,
            addressCid: '',
            billingCid: '',
            technicalCid: '',
            companyCreated: partyId
          }
        }

        console.log('partyId1', partyId);

        await setBexioCompany(partyId, rk_csn, netcomIdG2b);
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

        console.log("data :: ", data);

        companyConfirmation(companyDeatails.name, companyDeatails.postcode, companyDeatails.city, companyDeatails.city, coutryCode)


      } else {
        partyId = isCompanyAlreadyExists[0]?.rk_party;

        const isDisabledParty = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
            SELECT p.cid FROM party p  
            WHERE p.isblocked = true AND p.cid = ${partyId}
          `);
        if (isDisabledParty.length) {

          return ({
            status_code: 500,
            message: 'blocked_party',
            status: false,
          });
        }

        console.log('partyIdelse', partyId);
        let companyDeatails = companyDetails[0];
        let streetNo = companyDeatails.address.split(' ').length > 1 ? companyDeatails.address.split(' ').pop() : '';
        if (companyDeatails.address.split(' ').length > 1) {
          console.log('streetno');

          let tempStreet = companyDeatails.address.split(' ');
          tempStreet.pop();
          companyDeatails.address = tempStreet.join(" ")

        }
        let addressUpdate = [
          companyDeatails.address,
          streetNo,
          companyDeatails.postcode,
          companyDeatails.city,
          coutryCode,
          partyId
        ]
        let netComId = isCompanyAlreadyExists[0]?.netcomid;
        // start update edi db change


        const ediPartyId = await connectGate2b.$queryRaw<any[]>(Prisma.sql`
            SELECT cid  FROM ediparty e WHERE e.netcomid = ${netComId}
          `);



        console.log('55');
        console.log('netComId', netComId);


        async function updateAddress(data: any[], type: string) {
          await connectLibrary.$executeRaw(
            Prisma.sql`
                  UPDATE address
                  SET 
                    street = ${data[0]},
                    streetno = ${data[1]},
                    zip = ${data[2]},
                    city = ${data[3]},
                    country_code = ${data[4]}
                  WHERE fk_party = ${data[5]} AND _type = ${type}
                `
          );
        }


        await updateAddress(addressUpdate, 'billing');
        await updateAddress(addressUpdate, 'main');
        await updateAddress(addressUpdate, 'technical');


        console.log('companyDeatails.legal_form', companyDeatails.legal_form);
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
          ediPartyId[0]?.cid
        ];
        const contactData = [
          coutryCode || '',
          companyDeatails.phone_fixed || '',
          partyId,
        ]
        const contactEdiData = [
          coutryCode || '',
          companyDeatails.phone_fixed || '',
          ediPartyId[0]?.cid,
        ]
        console.log('legalPartyData', legalPartyData);

        await connectLibrary.$executeRaw(
          Prisma.sql`
                  UPDATE legalparty 
                  SET 
                    companyname = ${legalPartyData[0]},
                    tax_number = ${legalPartyData[1]},
                    vat_id = ${legalPartyData[2]},
                    legalname = ${legalPartyData[3]}
                  WHERE fk_party = ${legalPartyData[4]}
                `
        );

        await connectGate2b.$executeRaw(
          Prisma.sql`
                  UPDATE legalparty 
                  SET 
                    companyname = ${legalEdiPartyData[0]},
                    tax_number = ${legalEdiPartyData[1]},
                    vat_id = ${legalEdiPartyData[2]},
                    legalname = ${legalEdiPartyData[3]}
                  WHERE fk_ediparty = ${legalEdiPartyData[4]}
                `
        );
        await connectLibrary.$executeRaw(
          Prisma.sql`
                  UPDATE phone 
                  SET 
                  country_code = ${contactData[0]},
                  phone = ${contactData[1]}
                  WHERE fk_party = ${contactData[3]}
                `
        );
        await connectGate2b.$executeRaw(
          Prisma.sql`
                  UPDATE phone 
                  SET 
                  country_code = ${contactEdiData[0]},
                  phone = ${contactEdiData[1]}
                  WHERE fk_ediparty = ${contactEdiData[3]}
                `
        );



        let tempMail = companyDeatails.mail ? companyDeatails.mail : userDetails.email;
        console.log('tempMail.mail', tempMail);

        await connectLibrary.$executeRaw(
          Prisma.sql`
                UPDATE email SET email = ${tempMail}
                  WHERE fk_party = ${partyId}
                  AND "_type" = 'company_contact'
                `
        );


        const newEdiPartyId = await connectNewGate2b.$queryRaw<any[]>(Prisma.sql`
              SELECT cid FROM ediparty e WHERE e.netcomid = ${netComId}
            `);

        await connectGate2b.$executeRaw(
          Prisma.sql`
              UPDATE email SET email = ${tempMail}
                WHERE fk_ediparty = ${ediPartyId[0].cid}
                AND "_type" = 'company_contact'
              `
        );
        await connectNewGate2b.$executeRaw(
          Prisma.sql`
              UPDATE email SET email = ${tempMail}
                WHERE fk_ediparty = ${newEdiPartyId[0].cid}
                AND "_type" = 'company_contact'
              `
        );

        const legalNewEdiPartyData = [
          companyDeatails.name || '',
          companyDeatails.tax_number || '',
          companyDeatails.ust_id_nr || '',
          legalname,
          newEdiPartyId[0].cid
        ];
        //update legal party in new gate2b
        console.log('112');

        await connectNewGate2b.$executeRaw(
          Prisma.sql`
                  UPDATE legalparty 
                  SET 
                    companyname = ${legalNewEdiPartyData[0]},
                    tax_number = ${legalNewEdiPartyData[1]},
                    vat_id = ${legalNewEdiPartyData[2]},
                    legalname = ${legalNewEdiPartyData[3]}
                  WHERE fk_ediparty = ${legalNewEdiPartyData[4]}
                `
        );
        await connectLibrary.$executeRaw(
          Prisma.sql`
                  UPDATE party 
                  SET 
                  website = ${companyDeatails.url}
                  WHERE cid = ${partyId}
                `
        );
        await connectGate2b.$executeRaw(
          Prisma.sql`
                  UPDATE ediparty 
                  SET 
                  website = ${companyDeatails.url}
                  WHERE cid = ${ediPartyId[0]?.cid}
                `
        );
        await connectNewGate2b.$executeRaw(
          Prisma.sql`
                  UPDATE ediparty 
                  SET 
                  website = ${companyDeatails.url}
                  WHERE cid = ${newEdiPartyId[0]?.cid}
                `
        );

        console.log('22');

        party = {
          addressMain: '',
          partyResponse: partyId,
          addressCid: '',
          billingCid: '',
          technicalCid: '',
          companyCreated: partyId
        }
        netcomeAddress = await getPartyId(partyId);
      }

      let userId = await userCheck(userDetails);
      if (!userId) {
        userId = await saveUser(userDetails);
      }
      let userAccountStatus = await checkUserAccount(userId)
      // partyId = partyId ;
      console.log('partyId2', partyId);
      console.log('userAccountStatus', userAccountStatus);


      let accountId;

      if (!userAccountStatus) {
        console.log('paraccountaccountaccountaccountaccountaccountaccountaccountty', party);

        const accountIdResult = await account(userId, party, userDetails, netcomeAddress, jwt.decode(accessToken)['user_id']);
        console.log('accountIdResult', accountIdResult);

        accountId = accountIdResult.accountId;
        partyId = accountIdResult.partyKey;
      } else {
        accountId = userAccountStatus;

      }
      accountIdFinal = await savePartyAcc(partyId, accountId, isAdmin, partyUser);


      // let checkInvitationStatus  = await checkInvitation(JSON.parse(companyDetails)[0].name,partyId);
      console.log(newCompany);
      console.log(netcomIdG2b);
      console.log(companyNameGate2b);

      if (newCompany && accountIdFinal != 0) {
        console.log('inside');



        const userLanguage = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
              SELECT 
                u.language, 
                u.email, 
                u.cid 
              FROM "user" u 
              WHERE u.email = ${email}
            `);


        let parmsSend = config.BEXIO_CONNECTION_CONFIG_SEND || ''
          .replace('$netcom_id$', netcomIdG2b)
          .replace("$name$", companyNameGate2b)
        console.log('parms', parmsSend.slice(1, -1));
        console.log('parms', parmsSend);
        await setBusinessConnector(parmsSend);
        let parms = config.BEXIO_CONNECTION_CONFIG_RECEIVE || ''
          .replace('$netcom_id$', netcomIdG2b)
          .replace("$name$", companyNameGate2b)
        console.log('parms', parms.slice(1, -1));
        console.log('parms', parms);
        await setBusinessConnector(parms);

        await contactUpdate(accountId, partyId, userDetails.email, phoneNumber);
        await contactUpdateUser(userLanguage[0].cid, partyId)

      } else {

      }



      if (isCompanyAlreadyExists.length == 0) {
        let decryptData = encryptionControl.decrypt(req.body.encrToken);
        console.log('decryptData', decryptData);

        if (decryptData?.planId && decryptData?.subScriptionType) {
          await addSubscriptionParty(partyId, accountId, decryptData?.planId, decryptData?.subScriptionType, netcomIdG2b);
        }
      }

      ;
      if (accountIdFinal != 0) {
        const partyAccountResult = await connectLibrary.$queryRaw<
          { cid: any; fk_status: any }[]
        >(Prisma.sql`
                  SELECT pa.cid, pa.fk_status
                  FROM party_account pa
                  INNER JOIN status s ON s.cid = pa.fk_status
                  WHERE pa.fk_party = ${partyId} AND pa.fk_account = ${accountId} AND s."statusLabel" = 'active'
                `);

        return ({
          statusCode: 201,
          message: 'register_account_and_user_created',
          status: true,
          accountId: accountIdFinal,
          isNewCompany: isNewCompany,
          partyAccountId: partyAccountResult[0].cid
        });
      } else {
        // commonErrors['errorTitle'] = 'bexioUserCreate';
        // commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+'error_in_savePartyAcc -req param,userDetails - '+JSON.stringify(userDetails)+' ,companyDetails - '+JSON.stringify(companyDetails)+' ,accessToken - '+JSON.stringify(accessToken)+' ,isAdmin - '+JSON.stringify(isAdmin)+' ,coutryCode - '+JSON.stringify(coutryCode);
        // warningMessage(commonErrors,'error_in_savePartyAcc');
        return ({
          status_code: 500,
          message: 'something_went_wrong',
          status: false,
        });
      }



    } catch (error) {


      console.log('error', error);


      // commonErrors['errorTitle'] = bexioUserCreate.name;
      // commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString();
      // warningMessage(commonErrors,error); 
      return ({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
      });
    }


    async function setBusinessConnector(params) {
      try {

        let fomdata = {
          data: params
        }
        console.log('stringfuu', fomdata);

        let options = {
          'method': 'POST',
          'url': config.PYTHON_API + 'third-party-connector',
          // 'url':'http://192.168.2.63:5005/api/bexio-connector',
          // 'headers': headers,
          formData: fomdata
        };
        return new Promise(function (resolve, reject) {
          request(options, async function (error, response, body) {
            if (!error && response.statusCode == 200) {
              resolve(body);
              console.log('response', body);

            } else {
              console.log('error', error);

              reject(error);
            }
          });
        });


      } catch (error) {
        //   commonErrors['errorTitle'] = setBusinessConnector.name;
        //   commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+params;
        //   warningMessage(commonErrors,error);
        // console.log(error);

      }
    }


    async function checkUserAccount(userId) {
      // try {
      console.log('userId', userId);

      const accountDetails = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
    SELECT cid 
    FROM account
    WHERE fk_user = ${userId}
    AND isdisabled = false
  `);

      console.log('checkUserAccount', accountDetails.length);

      if (accountDetails.length > 0) {
        return accountDetails[0]?.cid;
      } else {
        return '';
      }

    }


    async function setBexioCompany(partyId, rk_csn, netcomIdG2b) {

      await connectBexio.companyregistered.create({
        data: {
          rk_party: partyId,
          rk_csn: rk_csn,
          netcomid: netcomIdG2b,
        }
      });
      return true;
    }
    async function getPartyId(partyId) {
      // try {
      console.log(partyId);


      const getObjectId = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
    SELECT objectid 
      FROM party 
      WHERE cid =${partyId}
  `);


      let partyResult;
      console.log(getObjectId);

      if (getObjectId.length > 0) {
        console.log(getObjectId[0].objectid);
        partyResult = await connectGate2b.$queryRaw<any[]>(Prisma.sql`
        SELECT a.cid AS partyId FROM ediparty ep 
        INNER JOIN address a ON
        a.fk_ediparty = ep.cid
        WHERE ep.rk_party =${getObjectId[0].objectid}::UUID
      `);


      }
      console.log(partyResult[0]);

      return partyResult[0].partyid;

    }
    async function userCheck(decryptData) {
      // try {
      console.log(decryptData.email);

      let data = null;
      const isAlreadyExist = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
    SELECT cid
    FROM "user" u
    WHERE email=${decryptData.email} AND u."isUserActive" = true
  `);
      if (isAlreadyExist.length) {
        return data = isAlreadyExist[0].cid;
      } else {
        data;
      }
      return data;
    }
    async function partyCreate(decryptData, countryCode, email, currency) {

      // try {
      let addressCid;
      let technicalCid;
      let billingCid;

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


      const companyCreated = await connectLibrary.$queryRaw<any>(
        Prisma.sql`
                        INSERT INTO party 
                          (fk_party_parent, fk_address_main, isconfirmeddate, isdisableddate, ismergeddate, isnaturalperson, website, isconfirmed, fk_currency)
                        VALUES (
                          ${party[0]}, ${party[1]}, ${party[2]}, ${party[3]}, ${party[4]},
                          ${party[5]}, ${party[6]}, ${party[7]}, ${party[8]}
                        )
                        RETURNING cid
                      `
      );


      async function insertAddress(data: any[]) {
        const result = await connectLibrary.$queryRaw<any>(
          Prisma.sql`
                          INSERT INTO address 
                            (fk_party, _type, number, line1, line2, line3, street, streetno, zip, city, state, country_code)
                          VALUES (
                            ${data[0]}, ${data[1]}, ${data[2]}, ${data[3]},
                            ${data[4]}, ${data[5]}, ${data[6]}, ${data[7]},
                            ${data[8]}, ${data[9]}, ${data[10]}, ${data[11]}
                          )
                          RETURNING cid
                        `
        );
        return result[0]?.cid;
      }


      const partyResponse = companyCreated[0]?.cid;
      addressData[0] = partyResponse;
      addressCid = await insertAddress(addressData);
      billingData[0] = partyResponse;

      billingCid = await insertAddress(billingData);
      technical[0] = partyResponse;
      technicalCid = await insertAddress(technical);

      async function insertEmail(fk_party: number, type: string, email: string) {
        const result = await connectLibrary.$queryRaw<any>(
          Prisma.sql`
              INSERT INTO email 
                (fk_party, _type, email)
              VALUES (
                ${fk_party}, ${type}, ${email}
              )
              RETURNING cid
            `
        );
        return result[0]?.cid;
      }
      companyContactId = await insertEmail(partyResponse, 'company_contact', email);
      technicalContactId = await insertEmail(partyResponse, 'technical_contact', email);
      billingContactId = await insertEmail(partyResponse, 'billing_contact', email);

      const updatedCompany = await connectLibrary.$queryRaw<any>(
        Prisma.sql`
        UPDATE party
        SET fk_address_main = ${addressCid}
        WHERE cid = ${partyResponse}
        RETURNING cid
      `
      );


      let data = {
        addressMain: addressCid,
        partyResponse: partyResponse,
        addressCid: addressCid,
        billingCid: billingCid,
        technicalCid: technicalCid,
        companyCreated: partyResponse
      }
      return data

    }
    async function contactUpdate(accountID, companyID, email, mobileNumber) {
      console.log('hera');

      const getUserResult = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
    SELECT u.cid 
    FROM "user" u
    INNER JOIN account a ON a.fk_user = u.cid
    WHERE a.cid = ${accountID} AND a.isdisabled = false
  `);



      const userCid = getUserResult[0].cid;
      const checkEmailResult = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
  SELECT email 
  FROM email 
  WHERE fk_party = ${companyID} AND _type = 'company_contact'
`);

      const getResult = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
    SELECT objectid FROM party p WHERE p.cid = ${companyID}
  `);


      const getEdiPartyResult = await connectGate2b.$queryRaw<any[]>(Prisma.sql`
    SELECT cid FROM ediparty e WHERE rk_party = ${getResult[0].objectid}
  `);

      const getEdiResult = await connectNewGate2b.$queryRaw<any[]>(Prisma.sql`
    SELECT cid FROM ediparty e WHERE rk_party = ${getResult[0].objectid}
  `);

      const gate2bId = getEdiPartyResult[0]?.cid;
      const newGate2bId = getEdiResult[0]?.cid;





      if (checkEmailResult.length > 0) {



        await connectLibrary.$executeRawUnsafe(`
          UPDATE email 
          SET email = $1, fk_user = $2 
          WHERE fk_party = $3
        `, email, userCid, companyID);

        await connectGate2b.$executeRawUnsafe(`
          UPDATE email 
          SET email = $1 
          WHERE fk_ediparty = $2 AND _type = 'company_contact'
        `, email, gate2bId);

        await connectNewGate2b.$executeRawUnsafe(`
          UPDATE email 
          SET email = $1 
          WHERE fk_ediparty = $2 AND _type = 'company_contact'
        `, email, newGate2bId);

      } else {
        await connectLibrary.$executeRaw(
          Prisma.sql`
            INSERT INTO email (fk_party, _type, email, fk_user)
            VALUES (${companyID}, 'company_contact', ${email}, ${userCid})
        `);

        await connectGate2b.$executeRaw(
          Prisma.sql`
            INSERT INTO email (fk_ediparty, _type, email)
            VALUES (${gate2bId}, 'company_contact', ${email})
        `);

        await connectNewGate2b.$executeRaw(
          Prisma.sql`
            INSERT INTO email (fk_ediparty, _type, email)
            VALUES (${newGate2bId}, 'company_contact', ${email})
        `);
      }


      const result = await connectLibrary.$queryRaw<{ cid: any }[]>(
        Prisma.sql`
        SELECT cid FROM phone
        WHERE fk_party = ${companyID}
          AND _type = 'company_contact'
    `);

      if (result.length > 0) {
        await connectLibrary.$executeRaw(
          Prisma.sql`
            UPDATE phone
            SET phone = ${mobileNumber}, fk_user = ${userCid}
            WHERE fk_party = ${companyID} AND _type = 'company_contact'
          `
        );
      } else {

        await connectLibrary.$executeRaw(
          Prisma.sql`
            INSERT INTO phone (fk_party, "_type", phone, fk_user)
            VALUES (${companyID}, ${'company_contact'}, ${mobileNumber}, ${userCid})
          `
        );

      }


      const resultMain = await connectLibrary.$queryRaw<
        { cid: any }[]
      >(Prisma.sql`
          SELECT cid FROM phone
          WHERE fk_party = ${companyID}
          AND "_type" = 'main'
        `);


      console.log(resultMain);

      if (resultMain.length > 0) {
        console.log('resultMain.rows');

        await connectLibrary.$executeRaw(
          Prisma.sql`
            UPDATE phone
            SET phone = ${mobileNumber}, fk_user = ${userCid}
            WHERE fk_party = ${companyID} AND "_type" = 'main'
          `
        );

      } else {
        console.log('resultMain.rows else`');
        console.log('mobileNumber', mobileNumber);
        await connectLibrary.$executeRaw(
          Prisma.sql`
            INSERT INTO phone (fk_party, "_type", phone, fk_user)
            VALUES (${companyID}, 'main', ${mobileNumber}, ${userCid})
          `
        );

      }
    };

    async function contactUpdateUser(userId, companyID) {

      const chekUserIsEmptyBillingResult = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
    SELECT * FROM address
    WHERE fk_party = ${companyID} AND "_type" = 'billing'
  `);


      console.log(chekUserIsEmptyBillingResult[0].fk_user);
      console.log(chekUserIsEmptyBillingResult[0]);

      console.log('666666666666666');

      if (!chekUserIsEmptyBillingResult[0].fk_user) {
        // update address userid
        console.log('55555555555555555555555555');
        console.log(userId);

        await connectLibrary.$queryRaw<any[]>(Prisma.sql`
  UPDATE address
  SET fk_user = ${userId}
  WHERE cid = ${chekUserIsEmptyBillingResult[0].cid}
  RETURNING cid
`);

      }

      const chekUserIsEmptyTechnicalResult = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
    SELECT * FROM address 
    WHERE fk_party = ${companyID} 
      AND "_type" = 'technical'
  `);

      if (!chekUserIsEmptyTechnicalResult[0].fk_user) {
        // update address userid
        console.log('666666666666666666');
        console.log(userId);

        await connectLibrary.$queryRaw<any[]>(Prisma.sql`
  UPDATE address 
  SET fk_user = ${userId} 
  WHERE cid = ${chekUserIsEmptyTechnicalResult[0].cid}
  RETURNING cid
`);

      }
    };
    async function saveLegal(partyResponse, decryptData) {

      // try {
      console.log('decryptDataName', decryptData.name);


      //   const pool = await connectPostgres;
      const legalPartyData = [
        partyResponse || '',
        decryptData.name || '',
        decryptData.tax_number || '',
        decryptData.ust_id_nr || '',
        legalname
      ];


      const legalparty = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
  INSERT INTO legalparty 
    (fk_party, companyname, tax_number, vat_id, legalname)
  VALUES 
    (${legalPartyData[0]}, ${legalPartyData[1]}, ${legalPartyData[2]}, ${legalPartyData[3]}, ${legalPartyData[4]})
  RETURNING cid
`);

      return legalparty

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
      const result = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
  INSERT INTO "user" 
    (givenname, familyname, email, sex, email_verified)
  VALUES (
    ${values[0]},
    ${values[1]},
    ${values[2]},
    ${values[3]},
    ${values[4]}
  )
  RETURNING cid
`);
      addMailChimp(decryptData.given_name, decryptData.family_name, decryptData.email)

      let userCid = result[0]?.cid;

      return userCid


    }


    async function account(resultdata, partyData, decryptData, netcomeAddress, bexioUserId) {
      console.log('account');
      console.log(resultdata);

      const valuesaccount = [
        resultdata || '',
        decryptData.authenticateid || '',
        decryptData.commonname || '',
        decryptData.email || ''

      ];
      console.log('1');

      if (partyData.addressCid) {
        await connectLibrary.$executeRaw(
          Prisma.sql`
            UPDATE address 
            SET fk_user = ${resultdata}
            WHERE cid = ${partyData.addressCid}
          `
        );


      }
      console.log('2');

      if (partyData.billingCid) {
        await connectLibrary.$executeRaw(
          Prisma.sql`
            UPDATE address
            SET fk_user = ${resultdata}
            WHERE cid = ${partyData.billingCid}
          `
        );

      }
      console.log('3');

      if (partyData.technicalCid) {
        await connectLibrary.$executeRaw(
          Prisma.sql`
            UPDATE address
            SET fk_user = ${resultdata}
            WHERE cid = ${partyData.technicalCid}
          `
        );
      }
      console.log('4');

      console.log(valuesaccount);

      const accountSave = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
  INSERT INTO account 
    (fk_user, authenticateid, commonname, notificationemail) 
  VALUES (
    ${valuesaccount[0]},
    ${valuesaccount[1]},
    ${valuesaccount[2]},
    ${valuesaccount[3]}
  )
  RETURNING cid
`);
      console.log('5');

      if (partyData.addressMain) {
        await connectLibrary.$executeRaw(
          Prisma.sql`
    UPDATE address
    SET fk_user = ${resultdata}
    WHERE cid = ${partyData.addressMain}
  `
        );

      }

      console.log('6');

      const personalAddress = [
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
        resultdata // this is fk_user
      ];

      const personalAddressResult = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
        INSERT INTO address 
          (fk_party, _type, number, line1, line2, line3, street, streetno, zip, city, state, country_code, fk_user)
        VALUES (
          ${personalAddress[0]},
          ${personalAddress[1]},
          ${personalAddress[2]},
          ${personalAddress[3]},
          ${personalAddress[4]},
          ${personalAddress[5]},
          ${personalAddress[6]},
          ${personalAddress[7]},
          ${personalAddress[8]},
          ${personalAddress[9]},
          ${personalAddress[10]},
          ${personalAddress[11]},
          ${personalAddress[12]}
        )
        RETURNING cid
      `);


      const personalAddressdata = personalAddressResult[0]?.cid;

      console.log('9');

      await connectGate2b.$executeRaw(
        Prisma.sql`
        UPDATE address
        SET rk_user = ${resultdata}
        WHERE cid = ${netcomeAddress}
        RETURNING cid
      `);


      const partyKey = partyData.partyResponse;
      const getBexioId = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
      SELECT cid FROM social_account_provider WHERE provider = ${'Bexio'}
    `);

      const emailUpdateQuery = async (contactId: number | null, fkUser: number) => {
        if (!contactId) return;

        await connectLibrary.$queryRaw<any[]>(Prisma.sql`
        UPDATE email
        SET fk_user = ${fkUser}
        WHERE cid = ${contactId}
        RETURNING cid
      `);
      };

      // Usage:
      await emailUpdateQuery(companyContactId, resultdata);
      await emailUpdateQuery(technicalContactId, resultdata);
      await emailUpdateQuery(billingContactId, resultdata);


      const linkedaccount = [accountSave[0].cid, getBexioId[0].cid, bexioUserId];
      const linkedInSaveResult = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
      INSERT INTO social_account 
        (fk_account, fk_social_account_provider, authid)
      VALUES (
        ${linkedaccount[0]}, 
        ${linkedaccount[1]}, 
        ${linkedaccount[2]}
      )
      RETURNING cid
    `);
      console.log('10');

      let data = {
        partyKey: partyKey,
        accountId: accountSave[0].cid
      }
      console.log('done account');

      return data

    }
    //uncoment for dummy import
    async function netcomeCreate(companyId, currency) {

      const objectId = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
    SELECT p.objectid FROM party p WHERE p.cid = ${companyId}
  `);

      const networkId = await connectGate2b.$queryRaw<any[]>(Prisma.sql`
    SELECT cid 
    FROM network 
    WHERE name = ${'Bexio'}
  `);

      const checkTokenData1 = await connectGate2b.$queryRaw<any[]>(Prisma.sql`
  INSERT INTO ediparty (fk_network, rk_party, fk_currency, netcomid)
  VALUES (${networkId[0]?.cid}, ${objectId[0]?.objectid}, ${currency}, ${''})
  RETURNING *
`);

      console.log('checkTokenData1.rows[0].cid', checkTokenData1[0]?.cid);


      const netComNetwork = config.NETCOM_NETWORK; // dont change
      const netComCustomerOffset = config.NETCOM_CUSTOMER_OFFSET; // dont change
      const modulo1 = config.MODULO;
      const netComNumber = checkTokenData1[0]?.cid; // unique key from party table cid
      const netcome = config.NETCOM_VALUE;
      const netcomFinal = parseInt(netComCustomerOffset || '') + netComNumber;
      const addNetcomWithZero = netcomFinal.toString().padStart(10, '0');
      const finalNetcom = netComNetwork + addNetcomWithZero;
      const beforeModulo = finalNetcom + '00';
      const moduloResult = parseInt(netcome || '') - (parseInt(beforeModulo) % parseInt(modulo1 || ''));
      const finalOut = finalNetcom.substr(0, 5) + '-' + finalNetcom.substr(5, 14) + '-' + moduloResult;

      const edipartyNetwork = await connectGate2b.$queryRaw<any[]>(Prisma.sql`
      INSERT INTO ediparty_network
      (fk_ediparty,fk_network)
      VALUES (${checkTokenData1[0]?.cid}, ${networkId[0]?.cid})
    `);

      // interconectId = interconectId.rows.length == 0 ?  '' :interconectId.rows[0].cid;
      console.log('netComNumber', netComNumber);
      console.log('finalOutfinalOut', finalOut);
      checkTokenData1[0]['netcomid'] = finalOut;


      await connectGate2b.$executeRaw`
    UPDATE ediparty SET netcomid = ${finalOut} WHERE cid = ${netComNumber}
    `;
      console.log('32');
      return checkTokenData1[0];

    };

    // save netcome address with company
    async function netcomGate2b(decryptData, companyId, ediPartyId, coutryCode, newGate2Id, email) {





      const addressResult = await connectGate2b.$queryRaw<any[]>(Prisma.sql`
      INSERT INTO address 
        (fk_ediparty, _type, number, line1, line2, line3, street, streetno, zip, city, state, country_code)
      VALUES 
        (
          ${ediPartyId.cid},
          ${'main'},
          ${decryptData.number || ''},
          ${decryptData.line1 || ''},
          ${decryptData.line2 || ''},
          ${decryptData.line3 || ''},
          ${decryptData.street || ''},
          ${streetno || ''},
          ${decryptData.zip || ''},
          ${decryptData.city || ''},
          ${decryptData.state || ''},
          ${coutryCode || ''}
        )
      RETURNING cid
    `);
    



      const netcomSavedId = addressResult[0].cid;
      await connectGate2b.$queryRaw<any>(Prisma.sql`
      INSERT INTO legalparty 
        (fk_ediparty, companyname, tax_number, vat_id, legalname)
      VALUES 
        (
          ${ediPartyId.cid},
          ${decryptData.name},
          ${decryptData.tax_number},
          ${decryptData.ust_id_nr},
          ${legalname}
        )
    `);

      const currentDate = new Date();
      await connectGate2b.$queryRaw<any>(Prisma.sql`
      INSERT INTO email (fk_ediparty, email, email_verified, _type)
      VALUES (
        ${ediPartyId.cid},
        ${email},
        ${currentDate},
        'main'
      )
    `);
        
            await connectLibrary.$queryRaw<any>(Prisma.sql`
        INSERT INTO "_party_gate2b" (fk_party, rk_uid)
        VALUES (${companyId}, ${ediPartyId.objectid})
        RETURNING cid
      `);

      console.log('newg2b');

      
   

      await connectNewGate2b.$queryRaw<any>(Prisma.sql`
      INSERT INTO legalparty 
        (fk_ediparty, companyname, tax_number, vat_id, legalname)
      VALUES 
        (
          ${newGate2Id},
          ${decryptData.name},
          ${decryptData.tax_number},
          ${decryptData.ust_id_nr},
          ${legalname}
        )
    `);


    await connectNewGate2b.$queryRaw<any>(Prisma.sql`
    INSERT INTO email (fk_ediparty, email, email_verified, _type)
    VALUES (
      ${newGate2Id},
      ${email},
      ${currentDate},
      'main'
    )
  `);
     
      console.log('newg2b');
 await connectGate2b.$queryRaw<any>(Prisma.sql`
  INSERT INTO phone 
    (fk_ediparty, _type, country_code, phone)
  VALUES 
    (${ediPartyId.cid}, 'main', ${coutryCode || ''}, ${decryptData.phone_fixed || ''})
  RETURNING cid
`);

await connectGate2b.$queryRaw<any>(Prisma.sql`
INSERT INTO email (fk_ediparty,_type,email)
VALUES (
  ${ediPartyId.cid},
  'company_contact',
  ${email}
)`);
await connectNewGate2b.$queryRaw<any>(Prisma.sql`
INSERT INTO email (fk_ediparty,_type,email)
VALUES (
  ${newGate2Id},
  'company_contact',
  ${email}
)`);
      
      return netcomSavedId;

    };

    async function savePartyAcc(partyValue, acc, role, partyUser) {

      console.log('savePartyAcc');


      const partyValuesSelect = [partyValue, acc];


      const statusLabel = 'active';

      const statusId = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
      SELECT cid 
      FROM status 
      WHERE "statusLabel" = ${statusLabel}
    `);

      const partyValues = [partyValue, acc, statusId[0].cid, partyUser];
      const partyResult = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
    SELECT pa.cid, pa.fk_status
    FROM party_account pa
    INNER JOIN status s ON s.cid = pa.fk_status  
    WHERE pa.fk_party = ${partyValuesSelect[0]} 
      AND pa.fk_account = ${partyValuesSelect[1]} 
      AND s."statusLabel" = 'active'
  `);

      if (partyResult.length == 0) {


        const partyAccount = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
      INSERT INTO party_account 
        (fk_party, fk_account, fk_status, isuser) 
      VALUES 
        (${partyValues[0]}, ${partyValues[1]}, ${partyValues[2]}, ${partyValues[3]})
      RETURNING cid
    `);



        await partyApplicationDetails(partyValue, acc, partyAccount[0]?.cid, role);
        console.log('savePartyAccDone');

        return partyAccount[0].cid;

      } else {

        if (partyResult[0].fk_status == statusId[0].cid)
          return partyResult[0].cid;
        else
          return 0;

      }

    }
    async function partyApplicationDetails(partyId, accountId, partyAccount, roleValue) {


      let userRoles;
      return new Promise(async function (resolve, reject) {
        console.log('role', roleValue);

        if (roleValue) {
          userRoles = config.BEXIO_ADMIN_ROLE;
        } else {
          userRoles = config.BEXIO_USER_ROLE;
        }
        // WHERE name IN (${config.SUPERADMIN})`;



        const roleData = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
    SELECT 
      r.name,
      rav.fk_application_version,
      r.cid AS "roleId"
    FROM public.role_policy rp
    INNER JOIN public.role r ON r.cid = rp.fk_role
    INNER JOIN public.policy p ON p.cid = rp.fk_policy
    INNER JOIN role_application_version rav ON rav.fk_role = r.cid
    WHERE r.name IN (${Prisma.join(userRoles)})
      AND r.fk_party IS NULL
  `);

        console.log('userRoles', userRoles);

        console.log('roleData', roleData);
        for (const element of roleData) {
          // 1. Check if partyapplication already exists
          let partyApplicationId = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
        SELECT * FROM partyapplication
        WHERE fk_party = ${partyId}
        AND fk_application_version = ${element.fk_application_version}
      `);

          // 2. Insert if not exists
          if (partyApplicationId.length === 0) {
            partyApplicationId = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
          INSERT INTO partyapplication (fk_party, fk_application_version)
          VALUES (${partyId}, ${element.fk_application_version})
          RETURNING cid
        `);
          }

          const partyApplication = partyApplicationId[0].cid;

          // 3. Insert partyapplication_account
          const partyApplicationAccountId = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
        INSERT INTO partyapplication_account (fk_partyapplication, fk_account, fk_party_account)
        VALUES (${partyApplication}, ${accountId}, ${partyAccount})
        RETURNING cid
      `);

          const partyApplicationAccount = partyApplicationAccountId[0].cid;

          // 4. Insert partyapplication_account_role
          await connectLibrary.$executeRaw(
            Prisma.sql`
          INSERT INTO partyapplication_account_role (fk_partyapplication_account, fk_role)
          VALUES (${partyApplicationAccount}, ${element.roleid})
        `
          );
        }
        resolve(1)
      });

    };

    async function addSubscriptionParty(partyValue, accountValue, planId, subScriptionType, netcomIdG2b) {
      return new Promise(async (resolve, reject) => {

        if (subScriptionType == 'PLAN') {

          let formData = {

            planId: planId,
            rolePartyId: partyValue,
            roleAccId: accountValue,
            user_email: email,
            language: 'DE'
          };
          console.log('********************formData', formData);
          let planResponse = await planPurchase(formData);
          console.log('********************regResponse', planResponse);
        }
        else {
          let billingCookie = JSON.parse(encryptionControl.decryptCookie(req.cookies[config.BILLING_COOKIE_NAME]));
        
          const activationResult = await connectLibrary.$queryRaw<any>(Prisma.sql`
          SELECT paymentData, detail 
          FROM activation 
          WHERE objectid = ${billingCookie.objectid}
        `);
        

          console.log("Object ID:", billingCookie.objectid);
          let paymentDetails = activationResult[0]?.paymentdata;

          if (paymentDetails) {
         

            const updateResult = await connectLibrary.$queryRaw<any>(Prisma.sql`
            UPDATE activation 
            SET paymentdata = 
              jsonb_set(
                jsonb_set(
                  CAST(paymentdata AS jsonb), 
                  '{rolePartyId}', 
                  to_jsonb(${partyValue}::text), 
                  true
                ), 
                '{roleAccId}', 
                to_jsonb(${accountValue}::text), 
                true
              )
            WHERE objectid = ${billingCookie.objectid}
            RETURNING paymentdata
          `);
          


            paymentDetails = updateResult[0]?.paymentdata;

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
            orderId: orderId,
            ...(paymentData && { payedResponse: paymentData })
          };

          let packageResponse = await packagePayment(formData);
          console.log('******************** packagePayment Response for formData:', packageResponse);

        }
        resolve(true)
      });

    }


  }
  validateFields(data: any, fields: string[]): boolean {
    for (const field of fields) {
      if (!data[field]) {
        console.warn(`Missing field: ${field}`);
        return false;
      }
    }
    return true;
  }

  async setExpireCookie(req: Request, res: Response): Promise<any> {
    let partyAccountId = encryptionControl.decryptCookie(decodeURIComponent(req.body['partyAccount']));
    const userDetails = await connectLibrary.$queryRaw<any>(Prisma.sql`
    SELECT email, u.cid AS "userId", pa.fk_party AS "partyId", a.cid AS "accountId", p.objectid
    FROM party_account pa
    INNER JOIN account a ON a.cid = pa.fk_account
    INNER JOIN public.user u ON u.cid = a.fk_user
    INNER JOIN party p ON p.cid = pa.fk_party
    INNER JOIN status s ON s.cid = pa.fk_status
    WHERE pa.cid = ${parseInt(partyAccountId)} AND s."statusLabel" = 'active'
    `);
    const netcomId = await connectGate2b.$queryRaw<{ netcomid: string }[]>(Prisma.sql`
  SELECT netcomid 
  FROM ediparty 
  WHERE rk_party = ${userDetails[0].objectid}::uuid
`);
console.log('userDetails[0]', userDetails[0]);
    const datetimeToken = {
      cookieCreatedTime: new Date(new Date(new Date().getTime() + 15 * 60000).toUTCString()),
      userMail: userDetails[0].email,
      partyID: String(userDetails[0].partyId),
      userID: String(userDetails[0].userId),
      accId: userDetails[0].accountId,
      isBexioCompany: true,
      netcomId: netcomId[0].netcomid
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
      data: encryptionControl.encrypt(String(userDetails[0].partyId)),
      status: true,
      showPopUp: true,
      showEbill: config.IS_EBILL_DISABLED,
    });
  }
  async getToken(req: Request, res: Response): Promise<any> {
    console.log('getToken request:', req);
    let partyAccountId = null;
    
    try {
        // Get form data from request body
        const { partyAccount, token } = req.body;
        console.log('partyAccount', partyAccount);
        console.log('token', token);
        if (!partyAccount || !token) {
            throw new Error('Missing required form fields');
        }

        console.log('Form Data:', { partyAccount, token });
        partyAccountId = encryptionControl.decryptCookie(decodeURIComponent(partyAccount));
        console.log('partyAccountId', partyAccountId);
        if (!partyAccountId) {
            throw new Error('Invalid party account ID');
        }

        // Fetch user details with proper type casting
        const userDetails = await connectLibrary.$queryRaw<any[]>(
            Prisma.sql`SELECT email, u.cid AS userId, pa.fk_party AS partyId, a.cid AS accountId, p.objectid
                        FROM party_account pa
                        INNER JOIN account a ON a.cid = pa.fk_account
                        INNER JOIN public.user u ON u.cid = a.fk_user
                        INNER JOIN party p ON p.cid = pa.fk_party
                        INNER JOIN status s ON s.cid = pa.fk_status 
                        WHERE pa.cid = ${parseInt(partyAccountId)} AND s."statusLabel" = 'active'`
        );

        if (!userDetails.length) {
            throw new Error('User not found or inactive');
        }

        const netcomIdResult = await connectGate2b.$queryRaw<any[]>(
            Prisma.sql`SELECT netcomid FROM ediparty WHERE rk_party = ${userDetails[0].objectid}::uuid`
        );
        const netcomId = netcomIdResult[0]?.netcomid;

        console.log('netcomId', netcomId);
        
        let decodedToken = encryptionControl.decryptCookie(decodeURIComponent(token));
        console.log('Decoded Token:', decodedToken);
        
        const bexioClient = await edit();
        const tokenSet = await bexioClient.refresh(decodedToken);
        
        let bexioTokenCookie = { 
            access_Token: tokenSet.access_token,
            refresh_Token: tokenSet.refresh_token,
            isBexioUser: true
        };
        
        let companyId = jwt.decode(tokenSet.access_token)['company_id'];
        await connectBexio.$queryRaw<any[]>(
            Prisma.sql`UPDATE companyregistered SET refresh_token = ${tokenSet.refresh_token} WHERE rk_csn = ${companyId}`
        );

        const data = {
            email: userDetails[0].email,
            userId: userDetails[0].userId,
        };
        
        const accessToken = jwt.sign(data, config.SECRET_JWT, { expiresIn: config.JWTExpiration });
        const refreshToken = jwt.sign(data, config.SECRET_REFRESH_JWT, { expiresIn: config.JWTRefreshExpiration });
        
        let tokenCookie = { 
            accessToken,
            refreshToken,
            userMail: userDetails[0].email,
            partyID: String(userDetails[0].partyId),  // Convert to string
            userID: String(userDetails[0].userId),    // Convert to string
            accId: String(userDetails[0].accountId),  // Convert to string
            isBexioCompany: true
        };

        console.log('bexioTokenCookie', bexioTokenCookie);
        console.log('tokenCookie', tokenCookie);
        console.log('userDetails[0]', userDetails[0]);

        // Clear existing cookies
        res.clearCookie(config.BILLING_COOKIE_NAME);
        res.clearCookie(config.TOKEN_COOKIE_BEXIO_NAME);

        // await getUserPermissions(userDetails[0].partyId, userDetails[0].accountId);
        
        // Set cookie with proper options for local development
        const cookieOptions = {
            domain: config.SESSION_DOMAIN,
            maxAge: config.SESSION_EXPIRY,
            httpOnly: true, // Changed to false to allow JavaScript access
            signed: true,   // Changed to false since we're not using cookie-parser signing
            secure: false,    // Changed to true to work with sameSite: 'none'
        };

        console.log('Setting cookie with options:', cookieOptions);
        console.log('Cookie name:', config.TOKEN_COOKIE_BEXIO_NAME);
        console.log('Cookie value:', encryptionControl.encrypt(JSON.stringify(bexioTokenCookie)));

        // Set the cookie
        res.cookie(config.TOKEN_COOKIE_BEXIO_NAME, encryptionControl.encrypt(JSON.stringify(bexioTokenCookie)), cookieOptions);

        // Log response headers to verify cookie was set
        console.log('Response headers:', res.getHeaders());

        // Convert partyId to string before encryption
        const responseData = encryptionControl.encrypt(String(userDetails[0].partyId));
        
        res.send({
            status_code: 200,
            message: '',
            data: responseData,
            status: true,
            showPopUp: true,
            showEbill: config.IS_EBILL_DISABLED,
        });

    } catch (error) {
        console.error('Error in getToken:', error);
        res.status(500).send({
            status_code: 500,
            message: error.message || 'Internal server error',
            error_details: error.code === 'ETIMEDOUT' ? 'Connection timeout - Please check your network connection' : error.message,
            status: false,
        });
    }
}

async getAccessToken(req: any, res: Response): Promise<any>{
  console.log('getAccessToken request:', req.session);
  console.log('req.sessionID',req.sessionID);

  let cookie: any = null;
  let isNewCompany;
  let formData = req.body;
  try {
   
    console.log(req.cookies);
    isNewCompany = encryptionControl.decryptCookie(decodeURIComponent(formData['isNewCompany']));

    console.log('isNewCompanyisNewCompany',isNewCompany);
    
    cookie = JSON.parse(encryptionControl.decryptCookie(req.cookies[config.EXPIRE_EXPIRES_COOKIE_NAME]));
     console.log('cookie',cookie);
     const userDetails = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
      SELECT 
        pa.isuser,
        pa.cid AS "partyAccountId",
        u.email,
        u.cid AS "userId",
        pa.fk_party AS "partyId",
        a.cid AS "accountId",
        u.language AS "userlanguage"
      FROM party_account pa
      INNER JOIN account a ON a.cid = pa.fk_account
      INNER JOIN public.user u ON u.cid = a.fk_user
      INNER JOIN status s ON s.cid = pa.fk_status
      WHERE pa.fk_party = ${parseInt(cookie?.partyID)}
        AND pa.fk_account = ${parseInt(cookie.accId)}
        AND s."statusLabel" = 'active'`);
    console.log('userDetails',userDetails);
    const data = {
      email: userDetails[0].email,
      userId: userDetails[0].userid,
    };
    const accessToken = jwt.sign(data, config.SECRET_JWT, { expiresIn: config.JWTExpiration });
    const refreshToken = jwt.sign(data, config.SECRET_REFRESH_JWT, {
      expiresIn: config.JWTRefreshExpiration,
    });
    // req.session.isAuth = true;

    let tokenCookie = { 
      accessToken:accessToken,
      refreshToken:refreshToken,
      userMail: userDetails[0].email,
      partyID: userDetails[0].partyid,
      userID: userDetails[0].userid,
      accId: userDetails[0].accountid,
      isBexioCompany:true,
      netcomId:cookie.netcomid

    }
    res.cookie(config.TOKEN_COOKIE_NAME, encryptionControl.encrypt(JSON.stringify(tokenCookie)), {
      domain: config.SESSION_DOMAIN,
      maxAge: config.SESSION_EXPIRY,
      httpOnly: true,
      signed: true,
      secure: false
    });
    console.log('userDetails',userDetails);
    let email = userDetails[0].email;
    console.log('email',email);
    console.log('req.sessionID',req.sessionID);
    console.log(req.sessionID);

    let userLanguage = userDetails[0].userlanguage ? userDetails[0].userlanguage : 'de';    
  
    const selectResult = await connectLibrary.$queryRaw<any[]>(Prisma.sql`SELECT * FROM authTable WHERE mail= ${email} AND sessionId = ${req.sessionID}`);
    // console.log('selectResult',selectResult);
    console.log('selectResult.length', selectResult.length);
    if (selectResult.length === 0) {
        
    console.log('INSERT start');

        await connectLibrary.$executeRaw(Prisma.sql`INSERT INTO authTable (mail, refreshToken, sessionId, accessToken) VALUES(${email}, ${refreshToken}, ${req.sessionID}, ${accessToken})`);
    console.log('INSERT end');

    } else {
        await connectLibrary.$executeRaw(Prisma.sql`UPDATE authTable SET refreshToken = ${refreshToken}, accessToken = ${accessToken} WHERE mail = ${email} AND sessionId = ${req.sessionID}`);
        const deleteOldTokens50thFromGeneratedNow = `
            DELETE FROM public.authtable
            WHERE mail = $1
            AND  "id" NOT IN (
            SELECT "id" FROM public.authtable
            WHERE mail = $1
            ORDER BY timestamp DESC
            LIMIT 50)`;
        await connectLibrary.$executeRaw(Prisma.sql`${deleteOldTokens50thFromGeneratedNow}`, [email]);

  }
  if(isNewCompany === "true"){
    await gate2bRegisterInBexio(userLanguage || 'de', formData.module, userDetails[0].email);
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

    const checkRoleData = await connectLibrary.$queryRaw<any[]>(Prisma.sql`${checkRoleQry}`, [userDetails[0].accountid, userDetails[0].partyid]);
    console.log('checkRoleData', checkRoleData);
    if(checkRoleData.length === 0){
      await setEbillRole(userDetails[0].partyid, userDetails[0].accountid, userDetails[0].partyaccountid, userDetails[0].isuser, formData.module);
      await partyServiceUpdate(userDetails[0].partyid, 'EBILL', 'EDI');

    }
    }
   
    
    await getUserPermissions(String(userDetails[0].partyId),userDetails[0].accountId);
    res.send({
      status_code: 200,
      message: '',
      status: true,
      data:encryptionControl.encrypt(String(userDetails[0].partyId))
  });

  } catch (error) { 
    // commonErrors['errorTitle'] = req.originalUrl;
    // commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+cookie;
    // warningMessage(commonErrors,error);
    console.log(error);
    res.send({
      status_code: 500,
      message: JSON.stringify(error),
      status: false,
  });
    
  }
}

}
const partyServiceUpdate = async (partyResponse, service, app) => {
  return new Promise(async (resolve, reject) => {
   
    try {

      const serviceName = service;
      const partyId = partyResponse;
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
      if (getExisted.length) {
        return reject(false)
      }
      console.log('service', service);
      console.log('app', app);

      const getAppServiceId = await connectLibrary.$queryRaw<any>(Prisma.sql`
      SELECT aa.cid
      FROM applicationversion_appservice aa
      INNER JOIN appservice aps ON aps.cid = aa.fk_appservice
      INNER JOIN application_version av ON av.cid = aa.fk_application_version
      INNER JOIN application a ON a.cid = av.fk_application
      WHERE aps.code = ${serviceName} AND a.code = ${appName}
    `);
      await connectLibrary.$executeRaw(
        Prisma.sql`
          INSERT INTO party_applicationversion_appservice (fk_party, fk_applicationversion_appservice)
          VALUES (${partyId}, ${getAppServiceId[0].cid})
        `
      );
      return resolve(true)
    }
    catch (error) {
    
      let responseValue = JSON.stringify(partyResponse)
      // commonErrors['errorTitle'] = 'partyServiceUpdate';
      // commonErrors['errorDescription'] = 'From:' + path.basename(__filename) + ' ' + error.toString() + '-req param,' + responseValue;
      // warningMessage(commonErrors, error);
      return reject(false)
    }
  })
}
const companyConfirmation = async(companyname, zip, city, street, state)=> {
  console.log("companyConfirmation function");
  console.log({
    companyname, zip, city, street, state
  });

  let keyDatas = {
    companyName: companyname, zip, city, street, state
  }
  let mailData = await fetchEmailContent('new_company_register', 'de', keyDatas);
  let message = mailData.message;
  let subject = mailData.subject;
  console.log("Subject Admin", subject);


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
 const addMailChimp = async(fName, lName, email) => {
  try {
    console.log('fName', fName);
    console.log('lName', lName);
    console.log('email', email);


    mailchimp.setConfig({
      apiKey: config.MAILCHIMP_KEY,
      server: config.MAILCHIMP_PREFIX,
    });
    const response = await mailchimp.lists.getAllLists();
    let name = config.MAILCHIMP_TAG_NAME;

    const foundLists = response['lists'].filter(list => list.name.toLowerCase().includes(name.toLowerCase()));
    console.log('foundLists', foundLists[0].id);

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
    console.log('error', error);

  }



}
const planPurchase = async (data) => {
  console.log('********************data', data);
  let fomdata = {
    planData: encryptionControl.encrypt(JSON.stringify(data))
  }
  console.log('********************planPurchasefomdata', fomdata);
  let options = {
    'method': 'POST',
    'url': config.ADMIN_URL + 'payment/planPurchase',
    formData: fomdata
  };
  console.log('optionsoptions', options);

  return new Promise(function (resolve, reject) {
    request(options, async function (error, response, body) {
      if (!error && response.statusCode == 200) {
        resolve(body);
      } else {
        console.log('er', error);

        reject(error);
      }
    });
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
              const redis_client = await redisClient;
              
              // Ensure Redis client is connected
              if (!redis_client.isOpen) {
                  await redis_client.connect();
              }

              const getUserPermissionsResult = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
                SELECT po.policy, par.cid 
                FROM partyapplication_account_role par
                INNER JOIN partyapplication_account pa ON par.fk_partyapplication_account = pa.cid
                INNER JOIN partyapplication p ON p.cid = pa.fk_partyapplication 
                INNER JOIN role_policy rp ON rp.fk_role = par.fk_role 
                INNER JOIN policy po ON po.cid = rp.fk_policy
                WHERE fk_account = ${parseInt(accId)}::bigint AND p.fk_party = ${parseInt(partyId)}::bigint
            `);
            
              
              const redisKey = 'permissions_'+partyId+'_'+accId;
              const roleObject = {};
              roleObject[redisKey] = {};
              if( getUserPermissionsResult.length > 0){
                  getUserPermissionsResult.forEach(element => {
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
                  
                  try {
                      await redis_client.set(redisKey, JSON.stringify(roleObject[redisKey]), {
                          EX: 24 * 60 * 60 * 2 // 2 days in seconds
                      });
                  } catch (redisError) {
                      console.error('Redis error:', redisError);
                      // Continue execution even if Redis fails
                  }
              }
              resolve(redisKey);
          }
      } catch (error) {
        console.log('getUserPermissions error', error);
      // commonErrors['errorTitle'] = getUserPermissions.name;
      // commonErrors['errorDescription'] = 'From:'+path.basename(__filename)+' '+error.toString()+'-req param,'+partyId+' '+accId;
      // warningMessage(commonErrors,error);
          reject(error)
          // return res.status(statusCode.INTERNAL_SERVER_ERROR).json({
          //     message: 'something went wrong',
          //     status: false
          // });
      }
  });
}
const gate2bRegisterInBexio = async (userLanguage,module,email)  => {
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

const setEbillRole = async (partyId, accountId, partyAccount, roleValue, module) => {
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

    // Insert party application account
    const partyApplicationAccount = await connectLibrary.$queryRaw<any[]>(Prisma.sql`
      INSERT INTO partyapplication_account 
        (fk_partyapplication, fk_account, fk_party_account)
      VALUES (${partyApplicationId}, ${accountId}, ${partyAccount})
      RETURNING cid
    `);

    // Insert party application account role
    await connectLibrary.$queryRaw(Prisma.sql`
      INSERT INTO partyapplication_account_role 
        (fk_partyapplication_account, fk_role)
      VALUES (${partyApplicationAccount[0].cid}, ${roleData[0].roleId})
    `);

    return 1;
  } catch (error) {
    console.log('error in setEbillRole:', error);
    throw error;
  }
};