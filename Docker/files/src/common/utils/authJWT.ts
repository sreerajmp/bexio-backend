import jwt from 'jsonwebtoken';
import config from '../../common/config/index';
import status_code from '../utils/statusCodes';
import connectPostgres from '../../common/loaders/postgres';
const  encryptionControl  = require("./jwt-decode");
const fs = require('fs');

const verifyTokenData = async (req, res, next) => {
  // next();
    let tokenCookie = req.signedCookies[config.TOKEN_COOKIE_NAME];
    let expireCookie = req.cookies[config.EXPIRE_EXPIRES_COOKIE_NAME];
    let sessionCookie = req.signedCookies[config.SESSION_COOKIE_NAME];
    let bexioCookie = req.signedCookies[config.TOKEN_COOKIE_BEXIO_NAME];

    if(!tokenCookie){
        return res.status(200).json({
            status: false,
            message: 'unauthorized',
            data:'cookie_not_found'
        });
    }
    if(!expireCookie){
        return res.status(200).json({
            status: false,
            message: 'unauthorized',
            data:'cookie_not_found'
        }); 
    }
    console.log('expireCookie',sessionCookie);

    if(!sessionCookie){
        return res.status(200).json({
            status: false,
            message: 'unauthorized',
            data:'cookie_not_found'
        }); 
    }
    if(!bexioCookie){
      return res.status(200).json({
          status: false,
          message: 'unauthorized',
          data:'cookie_not_found'
      }); 
  }
  console.log('req.url',req.headers.host);
  try {
    let cookie = JSON.parse(encryptionControl.decryptCookie(req.signedCookies[config.TOKEN_COOKIE_NAME]));
    let sessionId = req.signedCookies[config.SESSION_COOKIE_NAME];
    const pool = await connectPostgres;
    let searchQry = `SELECT * FROM authTable 
                     WHERE  mail= $1 AND sessionId = $2`
    const selectResult = await pool.query(searchQry, [cookie.userMail, sessionId])
    jwt.verify(selectResult.rows[0].accesstoken, config.SECRET_JWT, res, async (err, decode) => {
      if (err) {
        if (err.message == 'jwt expired') {
          if (selectResult.rows[0].refreshtoken == cookie['refreshToken']) {
            jwt.verify(selectResult.rows[0].refreshtoken, config.SECRET_REFRESH_JWT, res, async(err, decode) => {
              if (err) {
                console.log(err);
                return res.status(401).json({
                  status: 'fail',
                  message: 'unauthorized',
                });
              }
              var data = {
                email: cookie.userMail
              }
              const accessToken = jwt.sign(data, config.SECRET_JWT, {
                expiresIn: config.JWTExpiration
              });
              var token = cookie;
              token['accessToken'] = accessToken;
              res.cookie(config.TOKEN_COOKIE_NAME, encryptionControl.encrypt(JSON.stringify(token)), {
                domain: config.SESSION_DOMAIN,
                maxAge: config.SESSION_EXPIRY,
                httpOnly: true,
                signed: true,
                secure: true
              });
              // var datetimeToken = {
              //   cookieCreatedTime:new Date(new Date(new Date().getTime() + 15*60000).toUTCString())
              // };
              if(!req.cookies[config.EXPIRE_EXPIRES_COOKIE_NAME]){
                console.log("expire cokkie unauthorized"); 
                return res.status(401).json({
                    status: false,
                    message: 'unauthorized',
                });
             }
              const expireCookie = JSON.parse(encryptionControl.decryptCookie(req.cookies[config.EXPIRE_EXPIRES_COOKIE_NAME]));
              console.log('olddatetimeToken',expireCookie);
              let datetimeToken = expireCookie;
              datetimeToken['cookieCreatedTime'] = new Date(new Date(new Date().getTime() + 15 * 60000).toUTCString());
              res.cookie(config.EXPIRE_EXPIRES_COOKIE_NAME, encryptionControl.encrypt(JSON.stringify(datetimeToken)), {
                domain: config.SESSION_DOMAIN,
                maxAge: config.SESSION_EXPIRY,
                secure: false,
                httpOnly: false,
                signed: false,
              });
              const postgresPool = await connectPostgres;
              const updateQry = `UPDATE  authTable 
                               SET accessToken = $1
                                WHERE mail= $2 AND sessionId = $3`
              const updateResult = await postgresPool.query(updateQry,[accessToken, cookie.userMail, sessionId]);
              next();
            })
          } else {
            return res.status(401).json({
              status: 'fail',
              message: 'unauthorized',
            });
          }

        } else {
          return res.status(401).json({
            status: 'fail',
            message: 'user blocked by admin',
          });
        }

      } else {
        next();
      }

    });
  } catch (error) {
    // fs.appendFile('./assets/log.txt', '\r\n' + 'error *' + error, err => {
    //   if (err) {
    //     console.error(err)
    //     return
    //   }
    //   return true
    //   //file written successfully
    // })
    return res.status(401).json({
      status: 'fail',
      message: 'unauthorized',
    });

  }
 }
  export default verifyTokenData;

  
  // res.cookie(config.TOKEN_COOKIE_NAME, token, {
  //     domain: config.SESSION_DOMAIN,
  //     maxAge: config.SESSION_EXPIRY,
  //     httpOnly: false,
  //     signed: true
  //   });

  // jwt.verify(req.signedCookies['cokkieName']['refreshToken'],config.SECRET_REFRESH_JWT,(err,decode)=>{
  // })


  // var cookies = {};
  // req.headers && req.headers.cookie.split(';').forEach(function(cookie) {
  //   var parts = cookie.match(/(.*?)=(.*)$/)
  //   cookies[ parts[1].trim() ] = (parts[2] || '').trim();
  // });
  // console.log(list['cokkieName']);

  // let v =list['check']
  // console.log(v);

  // const obj = JSON.parse(v);

  // console.log('sadasd',obj);


  // if(!req.headers.authorization){
  //     var ts = new Date().toJSON();
  //     return res.status(status_code.UNAUTHORISED).json({message:"unAuthorized!!!!!",timeStamp:ts,status:status_code.UNAUTHORISED})
  // }
  // if(!req.headers['authorization'].split(' ')[0]){
  //     var ts = new Date().toJSON();
  //     return res.status(status_code.FORBIDDEN).json({message:"No token Provided",timeStamp:ts,status:status_code.FORBIDDEN})
  // }
  // else{
  //     var token= req.headers.authorization.split(" ")[1]
  //     var ts = new Date().toJSON();
  //     jwt.verify(token,config.SECRET_JWT,(err,decode)=>{
  //         if(err){
  //         return res.status(status_code.INTERNAL_SERVER_ERROR).json({message:"no Access token",timeStamp:ts,status:status_code.INTERNAL_SERVER_ERROR})
  //         }
  //         else{
  //             console.log("sssssddd@--"+decode.email)
  //             req.email = decode.email;
  //             next(); 
  //         }
  //     })
  // }

// }
module.exports = verifyTokenData
