
import config from '../../common/config/index';

const protect = (req, res, next) => {
    let sessionId = req.signedCookies[config.SESSION_COOKIE_NAME]
    if((sessionId) &&  (req.sessionID) && (sessionId == req.sessionID))
    {
        req.sessionId = sessionId;
    }
    else{
            return res.status(401).json({
                status: 'fail',
                message: 'unauthorized',
                SESSION_COOKIE_NAME: config.SESSION_COOKIE_NAME,
                sessionId: sessionId|| 'cookie session id',
                reqSessionId : req.sessionId || 'req.sessionId'
            });  
    }
    next()
}

const jwtProtect = (req, res, next) => {
    let sessionId = req.signedCookies[config.SESSION_COOKIE_NAME]
    if((sessionId) &&  (req.sessionID) && (sessionId == req.sessionID))
    {
        req.sessionId = sessionId;
    }
    else{
        return res.status(401).json({
            status: 'fail',
            message: 'unauthorized',
            SESSION_COOKIE_NAME: config.SESSION_COOKIE_NAME,
            sessionId: sessionId|| 'cookie session id',
            reqSessionId : req.sessionId || 'req.sessionId'
        });  
    }
    next()
}

module.exports = protect;