import config from '../../common/config/index';
const request = require('request');
const crypto = require('crypto');
const fs = require('fs');
const util = require('util');

const warningMessageToDotnet = async (data,error) => {
    console.log('error',error);
    console.log('data',data);
    
    if(error != null){
        const errorId = crypto.randomBytes(15).toString('hex');
        const errorFolder = config.ERROR_PATH+'/'
        if (!fs.existsSync(errorFolder)) {
            fs.mkdirSync(errorFolder)
        }
        fs.writeFile(errorFolder+'/'+errorId+'.txt',util.inspect(error) , 'utf-8',function(err) {
            if(err){
                console.log(err);
            }
        });
        let addl_params = {
            "key": config.GLOBAL_KEY,
            "module": config.GLOBAL_MODULE,
            "transid": "",
            "bkpfile": "",
            "channel": "",
            "netcomid": ""
          }
        addl_params.transid = errorId;
        let finalData = JSON.stringify(addl_params)
        data['addl_params'] = finalData;
       }
       else{
           data['addl_params'] = '{}'
          }
    let typeIssue = data.errorDescription.search("ERR_INVALID_ARG_TYPE");
    data['name']='';
    data['path']='';

    if (typeIssue != -1) {
        return;
     }
        const options = {
            method: 'POST',
            url: config.NOTIFICATION_URL,
            formData: data
        };
        if(data){
            console.log('datadatadata',data);
            try {
                await request(options, async function (error, response) {
                    if (error) {
                        console.log('error111',error);
                    }
                    else {
                        console.log(response.body);
                    }
                })
            } catch (error) {
                console.log('waringError',error);
                
            }
           

    }
}

export default warningMessageToDotnet;
