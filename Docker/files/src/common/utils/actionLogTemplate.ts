import config from '../../common/config/index';

let logs = {
    "objectid":'',
    "rk_party_application_version":'',
    "rk_party_account":'',
    "rk_objectid":'',
    "application":{"name":'',"version":''},
    "service":{"name":'',"version":''},
    "level":'', // ERROR,NOTIFICATION,INFO,WARNING,DEBUG,ACCESS,MESSAGE
    "action":'',
    "item":'',
    "message":'',
    "companyName":'',
    "user":{'name':'','email':''},
    "senderDetails":{senderCompanyName:'',senderUserName:'',senderUserEmail:''},
    "timestamp":'',
    "infoJSON":''//{ ipAddress:'',browser:''}

}

export default logs;