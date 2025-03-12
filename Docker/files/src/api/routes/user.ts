import { Router, Request, Response, response } from 'express';
import gate2BApi from './gate2BApi';
const  verifyTokenData = require('../../common/utils/authJWT');
import sixCertificateApi from './sixCertificateAPI';
import schedule from './schedule';

export default (app: Router) => {
     app.use('/api/v1/gate2bAPI',gate2BApi)
     app.use('/api/v1/sixAPICertificate',sixCertificateApi)
     app.use('/api/v1/schedule',schedule)
};

