import * as dotenv from 'dotenv';

dotenv.config();


// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Set DATABASE_URL dynamically before running Prisma
const envFound = dotenv.config();

if (!envFound) {
	// This error should crash whole process
	throw new Error("⚠️ Couldn't find .env file ⚠️");
}

export default {
	/**
	 * Prod or development server
	 */
	ENV: process.env.NODE_ENV,

	NAME: process.env.NAME,
	VERSION: process.env.VERSION,

	/**
	 * Your favorite port
	 */
	port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,

	
	
	/* JWT Setup */
	JWT_SECRET: process.env.JWT_SECRET,
	CIPHER_SECRET: process.env.CIPHER_SECRET,
	JWT_TTL: process.env.JWT_TTL,
	refreshTokenMasterSecret: process.env.refreshTokenMasterSecret,

    /* SMTP Credentials */
	SMTP_HOST: process.env.SMTP_HOST,
	SMTP_PORT: process.env.SMTP_PORT,
	SMTP_USER: process.env.SMTP_USER,
	SMTP_PASSWORD: process.env.SMTP_PASSWORD,

	/* Developer Emails */
	dev_emails: process.env.DEV_EMAILS,

	/**
	 * API configs
	 */
	api: {
		prefix: '/'
	},
	
	
    WHITELIST: process.env.WHITELIST,
    CORS_OPTIONS: {
        origin: process.env.WHITELIST || ["https://gate2b.io-procurement.com/", /\.io-procurement\.com$/],
        methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
        allowedHeaders:['Content-Type', 'Authorization'],
        exposedHeaders:['Content-Range', 'X-Content-Range'],
        credentials:true
      },

	  //  new changes
	  PASSWORD_HASH_ALGORITHAM:"sha256", //HASH password algoritham
	  SECRET_JWT: "normal-iom-secret-key",
	  SECRET_REFRESH_JWT: "refresh-key",
	  JWTExpiration: '1d' ,           // 1 hour -3600
	  JWTRefreshExpiration: '1d',   // 24 hours - 86400
	  SESSION_SECRET : 'my_iom_ind_secret',
	  SESSION_EXPIRY: process.env.SESSION_EXPIRY? parseInt(process.env.SESSION_EXPIRY, 10): 30000 * 60 * 30,
	
	  TOKEN_COOKIE_BEXIO_NAME:'bexioToken',
	  SESSION_DOMAIN : process.env.SESSION_DOMAIN || '.io-procurement.com', 

	  DB_HOST:process.env.DB_HOST,
	  DB_PORT:process.env.DB_PORT,
	  DB_USER:process.env.DB_USER,
	  DB_PASSWORD:process.env.DB_PASSWORD,
	  DB_NAME:process.env.DB_NAME,

	  SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME || 'sessionId', 
	  EXPIRE_EXPIRES_COOKIE_NAME:'expireCookie',

	  REDIS_PORT : process.env.REDIS_PORT || 6379,
	  REDIS_HOST : process.env.REDIS_HOST || 'localhost',


	//Local   
	  BEXIO_REDIRECT_URIS: ['http://localhost:3000/api/v1/gate2bAPI/bexio-redirect'],
	  API_URL:process.env.API_URL ||'http://localhost:3000/',
	  URL:'http://testadmin-bexio.io-procurement.com/',
	  DB_NAME_BEXIO : 'bexio',

	// // test server   
	//   BEXIO_REDIRECT_URIS: ['https://jlegl.api.io-market.net/api/v1/gate2bAPI/bexio-redirect'],
	//   API_URL: process.env.API_URL,
	   BEXIO_APP_URL: process.env.BEXIO_APP_URL || 'https://gate2b-bexio.io-market.net/',
	//   DB_NAME_BEXIO : process.env.DB_NAME_BEXIO,

	  BEXIO_API:'https://api.bexio.com/',
	  BEXIO_CLIENT_ID:process.env.BEXIO_CLIENT_ID ||'4d86db92-6cd7-416a-8855-66ee5a9a9219',
	  BEXIO_SECRET:process.env.BEXIO_SECRET ||'JlwF2zMsf4LKweYCNNTCHKfdXLBnEqy6Gug2wuhRhZtr-J0nI388YH2X17LlVDNwylondFjWto4f3UeqQhf9JQ',
	

	  NETCOM_NETWORK:process.env.NETCOM_NETWORK,
	  NETCOM_CUSTOMER_OFFSET:process.env.NETCOM_CUSTOMER_OFFSET,
	  MODULO:process.env.MODULO,
	  NETCOM_VALUE:process.env.NETCOM_VALUE,
	  TOKEN_COOKIE_NAME: process.env.TOKEN_COOKIE_NAME || 'tokenCookie',
	  USER_COOKIE_NAME: process.env.USER_COOKIE_NAME || 'userCookie',
	  GATE2B_DB_USER : process.env.G2_DB_USER,
	  GATE2B_DB_HOST:process.env.G2_DB_HOST,
	  GATE2B_DB_PASSWORD : process.env.G2_DB_PASSWORD,
	  GATE2B_DB_NAME:process.env.G2_DB_NAME,
	  GATE2B_DB_PORT:process.env.G2_DB_PORT,

	  MAIL_SERVER: process.env.MAIL_SERVER,
	  MAIL_PORT: process.env.MAIL_PORT,
	  MAIL_USERNAME: process.env.MAIL_USERNAME,
	  MAIL_PASSWORD: process.env.MAIL_PASSWORD,
	  MAIL_SSL: process.env.MAIL_SSL,

	  DEBUG: process.env.DEV !== 'prod',
	  DEBUG_MAIL: process.env.DEBUG_MAIL || 'r.murali@iomarket.in',

	  PYTHON_API:process.env.PYTHON_API,
	  
	  BEXIO_CONNECTION_CONFIG_SEND:process.env.BEXIO_CONNECTION_CONFIG_SEND,
	  BEXIO_CONNECTION_CONFIG_RECEIVE:process.env.BEXIO_CONNECTION_CONFIG_RECEIVE,
	  BEXIO_INVITE_CONFIG:process.env.BEXIO_INVITE_CONFIG,
	  BEXIO_CONNECTION_CONFIG_ORDER_RECEIVE: process.env.BEXIO_CONNECTION_CONFIG_ORDER_RECEIVE || '{"config":{"platform":{"module":"EDI","config":{"type":"network","code":"BEX","direction":"OUT"}},"netcom_id":"$netcom_id$","name":"$name$","direction":"OUT","fk_doc_type":"$doc_type$","fk_doc_format":"OpenTrans2.1","fk_netcomid_doc_interface":"WS","status":"1","fk_encoding_details":"utf-8","fk_culture":"en-us","allow_duplicate":"0","file_export_filename":"%DNO%_%TST:yyyyMMddHHmmss%.xml","create-pdf":"0","create-signed-doc":"0","export-doc-ref":"0","validate-sign":"0"}}',
	  BEXIO_CONNECTION_CONFIG_ORDER_SEND: process.env.BEXIO_CONNECTION_CONFIG_ORDER_SEND || '{"config":{"platform":{"module":"EDI","config":{"type":"network","code":"BEX","direction":"IN"}},"include_pdf":"0","netcom_id":"$netcom_id$","name":"$name$","direction":"IN","fk_doc_type":"$doc_type$","fk_doc_format":"OpenTrans2.1","fk_netcomid_doc_interface":"WS","status":"1","fk_encoding_details":"utf-8","fk_culture":"en-us","create-pdf":"0","create-signed-doc":"0","export-doc-ref":"0","validate-sign":"0"}}',
	  logs: {
        level: process.env.LOG_LEVEL || 'silly',
        path: process.env.LOG_PATH || './',
	},
	  

	  GATE2B_NEW_DB_HOST:process.env.GATE2B_NEW_DB_HOST,
	  GATE2B_NEW_DB_PORT:process.env.GATE2B_NEW_DB_PORT,
	  GATE2B_NEW_DB_USER:process.env.GATE2B_NEW_DB_USER,
	  GATE2B_NEW_DB_PASSWORD:process.env.GATE2B_NEW_DB_PASSWORD,
	  GATE2B_NEW_DB_NAME:process.env.GATE2B_NEW_DB_NAME,
	  
	  BEXIO_INVOICE_STATUS:process.env.BEXIO_INVOICE_STATUS,
	  BEXIO_ORDER_STATUS:'{"5":"common_status_pending","6":"order_status_done","15":"common_status_partial","21":"common_status_canceled"}',
	  G2B_COMMON_INACTIVE : process.env.G2B_COMMON_INACTIVE,
	  G2B_COMMON_ACTIVE : process.env.G2B_COMMON_ACTIVE,
	  G2B_COMMON_DELETED : process.env.G2B_COMMON_DELETED,
	  BEXIO_COMPANY_TYPE:process.env.BEXIO_COMPANY_TYPE,
	  MAIL_FROM:process.env.MAIL_FROM,
	  INVOICE_STATUS:process.env.INVOICE_STATUS,
	  BEXIO_DELETE_BC:process.env.BEXIO_DELETE_BC,
	  SALES_TEAM_CONTACT:process.env.SALES_TEAM_CONTACT,
	  HELP_DESK_CONTACT:process.env.HELP_DESK_CONTACT,
	  NOTIFICATION_URL:process.env.NOTIFICATION_URL,
      SERVER_NAME:process.env.SERVER_NAME,
      SYSTEM_NAME:process.env.SYSTEM_NAME,
      ERROR_CATEGORY:process.env.ERROR_CATEGORY,
      ERROR_CODE:process.env.ERROR_CODE,
      ERROR_SOURCE:process.env.ERROR_SOURCE,
      DOCKER_NAME:process.env.DOCKER_NAME,
	  MAIL_SUBJECT_START: process.env.MAIL_SUBJECT_START || 'gate2b - Social EDI:',
	  DB_LIBRARY:false,
	  DB_BEXIO:false,
	  DB_G2B:false,
	  DB_G2B_NEW:false,
	  SHOW_POPUP:process.env.SHOW_POPUP,
	  DOC_TYPE:process.env.DOC_TYPE || 1,
	  DOC_FORMAT:process.env.DOC_FORMAT || 5 ,
	  NOT_CODE:process.env.NOT_CODE || '2175',
	  NOT_CATEGORY:process.env.NOT_CATEGORY || 'NOT',
	  MARKET_PLACE_ADMIN_EMAIL:process.env.MARKET_PLACE_ADMIN_EMAIL,
	  GLOBAL_KEY:process.env.GLOBAL_KEY,
	  GLOBAL_MODULE:process.env.GLOBAL_MODULE,
	  SUPERADMIN:process.env.SUPERADMIN || "'EDI_ADMIN','PROFILE_USER','COMPANY_BEXIO_ADMIN','SUPER_ADMIN','BEXIO_ADMIN'",
	  SUPPORTACCOUNTEMAIL:process.env.SUPPORTACCOUNTEMAIL || 'support@io-market.com',
	  QRREADERURL:process.env.QRREADERURL,
	  EBILL_DB_HOST:process.env.EBILL_DB_HOST,
	  EBILL_DB_PORT: parseInt(process.env.EBILL_DB_PORT || '1433', 10),
	  EBILL_DB_USER:process.env.EBILL_DB_USER,
	  EBILL_DB_PASSWORD:process.env.EBILL_DB_PASSWORD,
	  EBILL_DB_NAME:process.env.EBILL_DB_NAME,
	  MAX_CLIENTS_IN_POOL:20,
	  IDLE_TIMEOUT_MILLIS:2000,
	  ERROR_PATH : process.env.ERROR_PATH,
	  BEXIO_ADMIN_ROLE : process.env.BEXIO_ADMIN_ROLE || "'COMPANY_BEXIO_ADMIN','EDI_ADMIN','PROFILE_READONLY','BEXIO_ADMIN'", 
	  BEXIO_USER_ROLE : process.env.BEXIO_USER_ROLE || "'COMPANY_READONLY','EDI_USER','PROFILE_READONLY','BEXIO_USER'",
	  EXPIRE_MTC_COOKIE_NAME: process.env.EXPIRE_MTC_COOKIE_NAME || 'mtc_cookie',
	  NETWORK_PARTNER_ID:process.env.NETWORK_PARTNER_ID,
	  CERTIFICATE_PATH:process.env.CERTIFICATE_PATH,
	  SIX_API_CERTIFICATE_BASE:process.env.SIX_API_CERTIFICATE_BASE,
	  BEXIO_CODE:process.env.BEXIO_CODE,
	  GATE2BURL: process.env.GATE2BURL,
	  SET_TIME_OUT: parseInt(process.env.SET_TIME_OUT || '30000', 10),
	  ERROR_BEXIO_CONTACT:process.env.ERROR_BEXIO_CONTACT,
	  ERROR_BEXIO_BILLER:process.env.ERROR_BEXIO_BILLER,
	  CREATE_BUSSINESS_CONNECTION:process.env.CREATE_BUSSINESS_CONNECTION,
	  BEXIO_CREATE_BUSSINESS_CONNECTION:process.env.BEXIO_CREATE_BUSSINESS_CONNECTION,
	  IMAGE_SAVE_PATH:process.env.IMAGE_SAVE_PATH,
	  IS_EBILL_DISABLED:process.env.IS_EBILL_DISABLED || false,
	  SERVICE_NAME:process.env.SERVICE_NAME,
	  APP_NAME:process.env.APP_NAME,
	  LOG_PATH:process.env.LOG_PATH || '/data/logger',
	  LOGGER_KAFKKA_TOPIC:process.env.LOGGER_KAFKKA_TOPIC || 'EVENTLOGGER',
	  LOGGER_KAFKKA_HOST:process.env.LOGGER_KAFKKA_HOST || 'kafka.services.svc.cluster.local:9092',
	  LOG_GET_URL: process.env.LOG_GET_URL || "http://event-logger.py-apps.svc.cluster.local/getdata",
	  BEXIO_COMMENTS:process.env.BEXIO_COMMENTS || '{"ERROR-INTERNAL": "Transaktion aufgrund [message] bei io-market auf Fehler gelaufen.","ERROR":"Transaktion aufgrund [message] bei SIX auf Fehler gelaufen.","INCORRECT":"Transaktion aufgrund [message] bei io-market fehlgeschlagen.","REJECTED":"Dein Kunde hat diese Rechnung nicht akzeptiert.","APPROVED":"Dein Kunde hat diese Rechnung akzeptiert.","OPEN":"Diese Rechnung wurde an deine Kunden versendet.","COMPLETED":"Diese Rechnung wurde von deinem Kunden bezahlt."}',
	  BEXIO_SCOPE:process.env.BEXIO_SCOPE  || 'kb_delivery_show kb_invoice_edit contact_edit openid email file profile article_show contact_show kb_order_edit kb_order_show kb_offer_show kb_invoice_show kb_article_order_show kb_article_order_show offline_access company_profile',
	  TOUR_SUPERADMIN:process.env.TOUR_SUPERADMIN || "'EDI_ADMIN','PROFILE_USER','COMPANY_ADMIN','SUPER_ADMIN','EBILL_ADMIN','BEXIO_ADMIN'",
	  BEXIO_DOCTYPES: process.env.BEXIO_DOCTYPES || '[{"id": "1", "label": "common_invoice","key": "Invoice","image":"/assets/img/invoice.svg","send": true,"receive":true},{"id": "2", "label": "common_order", "key": "Order","image":"/assets/img/invoice.svg","send": true,"receive":true},{"id": "3", "label": "common_deliverynotes","key":"DispatchNotification","image":"/assets/img/invoice.svg", "send": true,"receive":false}]',
	  BEXIO_ITEM_STATUS: process.env.BEXIO_ITEM_STATUS || '{"5":"common_status_pending","6":"common_status_done","15":"common_status_partial","21":"common_status_canceled","10":"common_status_draft","18":"common_status_done","20":"common_status_canceled"}',
	  LOG_URL: process.env.LOG_URL || "http://event-logger.py-apps.svc.cluster.local/",
	  SIX_API_CERTIFICATE: process.env.SIX_API_CERTIFICATE || 'star_io-market_com.pem',
	  SIX_API_KEY: process.env.SIX_API_KEY || 'io_market_com_pk_without_pass.key',
	  MTC_TOKEN_COOKIE_NAME: process.env.MTC_TOKEN_COOKIE_NAME || 'mtcTokenCookie',
	  IS_LIVE: process.env.IS_LIVE || 'false',
	  DEFAULT_CONFIG: process.env.DEFAULT_CONFIG || '{"color":{"--theme-color-1":{"light_theme":"#8b9635","dark_theme":"#8b9635"},"--theme-color-2":{"light_theme":"#474d22","dark_theme":"#474d22"},"--hovertext-color":{"light_theme":"#ffffff","dark_theme":"#000000"},"--text-color":{"light_theme":"#4c4f53","dark_theme":"#e2e2e2"}},"images":{"account_logo":{"filePath":"assets/logo.png","fileName":"logo.png"},"favicon":{"filePath":"assets/gate2b_icon.ico","fileName":"gate2b_icon.ico"},"dark_theme":{"filePath":"assets/logoDark.png","fileName":"logoDark.png"},"light_theme":{"filePath":"assets/logoWhite.png","fileName":"logoWhite.png"}},"socialmedia":{"facebook_link":"https://www.facebook.com/iomarketag","twitter_link":"https://www.twitter.com/iomarket","linkedin_link":"https://in.linkedin.com/company/io-market-ag","facebook_title":"iomarket AG ","twitter_title":"iomarket AG ","linkedin_title":"iomarket AG"},"extraStyle":[""],"sales_team_contact":"sales@io-market.com","help_desk_contact":"helpdesk@io-market.com","domain":"io-market.net","company_name":"iomarket AG","accounts_url":"https://accounts.io-market.net/#/","accounts_api_url":"https://fjy29.api.io-market.net/api/v1/","admin_url":"https://admin.io-market.net/#/","admin_api_url":"https://fkbwl.api.io-market.net/api/v1/","gate2b_url":"https://gate2b.io-market.net/#/","gate2b_api_url":"https://dhdgu.api.io-market.net/api/v1/","favi_title":"iomarket Account","product_logo":"https://accounts.io-market.net/assets/img/template/iomlogowhite.png","company_logo":"https://accounts.io-market.net/assets/img/template/iomarket-logo.png","contactus_image":"https://accounts.io-market.net/assets/img/template/support_agent.png","theme_color":"rgba(139, 150, 53, 1)","contactus_link":"mailto:office@io-market.com"}',
	  BEXIO_PURCHASE_ORDER_STATUS:'{"22":"common_status_draft","23":"ebill_invoice_open","24":"common_status_partial","25":"common_status_done","26":"common_status_canceled"}',
	  ADMIN_URL:process.env.ADMIN_URL,
	  BILLING_COOKIE_NAME: process.env.BILLING_COOKIE_NAME ||'BILLINGBEXIO',
	  DOMAIN_NAME:process.env.DOMAIN_NAME||'io-market.net',
	  BILLING_APP:process.env.BILLING_APP || "https://billing.io-market.net/plans",
	  MAILCHIMP_PREFIX: process.env.MAILCHIMP_PREFIX,
	  MAILCHIMP_KEY:  process.env.MAILCHIMP_KEY ,
	  MAILCHIMP_TAG_NAME:  process.env.MAILCHIMP_TAG_NAME || "iomarket AG Test",
	  OCTOPUS_URL:  process.env.OCTOPUS_URL,
	  BEXIO_INTERNAL_URL:"http://bexio-interface-backend.gate2b.svc.cluster.local/",
	  BILLING_URL: process.env.BILLING_URL || 'https://billing.io-market.net/',
	  MAIL_INTERNAL_DOMAIN: process.env.MAIL_INTERNAL_DOMAIN || 'io-market.net',

	  SALESFORCE_BASE_URL: process.env.SALESFORCE_BASE_URL,
	  SALESFORCE_USERNAME: process.env.SALESFORCE_USERNAME,
	  SALESFORCE_PASSWORD: process.env.SALESFORCE_PASSWORD,
	  SALESFORCE_CLIENT_ID: process.env.SALESFORCE_CLIENT_ID,
	  SALESFORCE_CLIENT_SECRET: process.env.SALESFORCE_CLIENT_SECRET,
	  
	  DYNAMODB_CLIENT_ID: process.env.DYNAMODB_CLIENT_ID,
	  DYNAMODB_SECRET_KEY: process.env.DYNAMODB_SECRET_KEY,
	  DYNAMODB_REGION: process.env.DYNAMODB_REGION,
	  DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME || 'contact_import_manager',
	  GATE2BURL_PYTHON_URL: process.env.GATE2BURL_PYTHON_URL || 'http://ebill-report.py-apps.svc.cluster.local',
	 EBILL_REPORT_CONFIG:process.env.EBILL_REPORT_CONFIG || '[{"update_type":"bc","channel":"api","application":"bex"}]',
};