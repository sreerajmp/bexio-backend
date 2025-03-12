const redisClient = require('../../common/loaders/redisDB');

const redisStore = async (req, res, next) => {
    console.log('redisStore');
    const redis_client = await redisClient;
    let keys = Object.keys(req.body)
    let redisKey = req.body.partyId+"_"+req.url+"_";
    console.log('redisKey',redisKey);
    
    if(req.body['isSync'] == 'true'){
        console.log('11111');
        // api.split(",").forEach(element => {
        redis_client.KEYS(redisKey+ "*", (err, data) => {
            data.forEach(apis => {
                redis_client.del(apis)
            });
            console.log('inside');
            
        })
        console.log('outside');
        next();
        //   });
    }else{
        keys.forEach(element => {
            redisKey = req.body[element]? redisKey +element+':'+ req.body[element] + '_' : redisKey
        });
        console.log('redisKey', redisKey);
        try {
            await redis_client.get(redisKey, (err,redisRes) => {
                // console.log('redisRes'+redisRes);
                // console.log('err'+err);
                 console.log('redisRes',redisRes);

                if(redisRes){ 
                    return res.send(redisRes); 
                }
                else{
                    next();
                }
            }) 
        } catch (error) {
            next();
            
        }
    }
 }
export default redisStore;

  
module.exports = redisStore
