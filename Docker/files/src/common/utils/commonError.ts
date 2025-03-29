import config from '../../common/config/index';

let commonErrors = {
    serverName:config.SERVER_NAME,
    systemName:config.SYSTEM_NAME,
    errorCategory:config.ERROR_CATEGORY,
    errorCode:config.ERROR_CODE,
    errorSource:config.ERROR_SOURCE,
    dockerName:config.DOCKER_NAME,
    senderCompany:'',
    receiverCompany:'',
    contactEmail:'',
    errorFile:'',
    addl_params:{
        key: config.GLOBAL_KEY,
        module: config.GLOBAL_MODULE,
        transid: "",
        bkpfile: "",
        channel: "",
        netcomid: ""
      } 
}

export default commonErrors;