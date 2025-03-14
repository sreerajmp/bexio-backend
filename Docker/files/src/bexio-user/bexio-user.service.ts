import { Injectable } from '@nestjs/common';
// import { connectBexio, connectLibrary, connectGate2b } from '../db/prisma-clients';
import { Issuer, generators } from 'openid-client'
const code_verifier = generators.codeVerifier();
const code_challenge = generators.codeChallenge(code_verifier);
import config from '../common/config/index';
import { edit } from '../common/config/utils/bexioClient';
import * as request from 'request';
import { Request, Response } from 'express';
@Injectable()
export class BexioUserService {
  async authorization(data: any): Promise<any> {
    console.log('***********************jiji', data)
    const bexioClient = await edit();

    let url = bexioClient.authorizationUrl({
      scope: config.BEXIO_SCOPE,
      resource: 'https://idp.bexio.com/authorize',
      code_challenge,
      code_challenge_method: 'S256',
    });
    return ({ data: url });



  }
  async bexioRedirect(req: Request, res: Response): Promise<any> {
    // Use prisma to access your DB, example:
    let params
    console.log('data', req);
    let issuer = await Issuer.discover('https://idp.bexio.com');
    console.log('API_URL', config.API_URL);
    // make sure this is inside an async function
    const bexioClient = await edit();
    console.log('bexioClient', bexioClient);

    params = bexioClient.callbackParams(req);
    console.log('params', params);
    console.log('config.API_URL', config.API_URL);

    console.log('code_verifier', code_verifier);
    const tokenSet = await bexioClient.callback(`${config.API_URL}bexioRedirect`, params, { code_verifier });

    console.log('tokenSet', tokenSet);
    // console.log(tokenSet);

    let companyDetails = await this.getloginUserCompanyDetails(tokenSet.access_token);
    let coutryCode = await this.getConutryCode(tokenSet.access_token, companyDetails[0]['country_name'])
    let userDetails = await this.getLoginUserInfo(tokenSet.access_token)
    if (!companyDetails && !coutryCode && !userDetails) {
      res.status(500).send({
        status_code: 500,
        message: 'something_went_wrong',
        status: false,
      })
    }
    console.log('typeof companyDetails:', typeof companyDetails);
    const tempJson = companyDetails[0];

    if (
      !tempJson['country_name'] ||
      !tempJson['name'] ||
      !tempJson['address'] ||
      !tempJson['city'] ||
      !tempJson['postcode'] ||
      !tempJson['country_id']
    ) {
      // return redirect response
      return {
        redirect: `${process.env.BEXIO_APP_URL}#/login/unauthorized`,
      };
    }

    const requiredCompanyFields = ['name', 'address', 'city', 'postcode', 'country_id'];
    const validationCompany = this.validateFields(companyDetails[0], requiredCompanyFields);

    const requiredUserFields = ['given_name', 'family_name', 'email'];
    const validationUser = this.validateFields(userDetails, requiredUserFields);

    if (!validationCompany && !validationUser) {
      res.redirect(`${config.BEXIO_APP_URL}#/login/unauthorized`);
          return;
    }
    if (validationCompany && validationUser) {
    //   let rolesDetails = await getLoginUserRoles(tokenSet.access_token);
    }
    console.log('result');

    res.status(200).send({
      status_code: 200,
      message: 'sucess',
      status: true,
    })
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
//   private async getLoginUserRoles(token): Promise<any> {
//     return new Promise((resolve) => {
//       var options = {
//         'method': 'GET',
//         'url': 'https://api.bexio.com/3.0/users/'+companyUserId,
//         'headers': {
//           'Accept': 'application/json',
//           'Authorization': 'Bearer '+access_token
//         }
//       };
//       console.log('options', options);

//       request(options, (error, response) => {
//         if (error) {
//           console.error('Error fetching company profile:', error);
//           return resolve(false);
//         }

//         if (response.statusCode === 200) {
//           try {
//             return resolve(JSON.parse(response.body))
//           } catch (e) {
//             console.error('Failed to parse company profile:', e);
//             return resolve(false);
//           }
//         } else {
//           console.warn('Failed to fetch company profile. Status:', response.statusCode);
//           return resolve(false);
//         }
//       });
//     });
//   }
  validateFields(data: any, fields: string[]): boolean {
    for (const field of fields) {
      if (!data[field]) {
        console.warn(`Missing field: ${field}`);
        return false;
      }
    }
    return true;
  }
}

