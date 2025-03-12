import express from "express";
const router = express.Router();
const  bexioController  = require("../controllers/apiController")
const  verifyTokenData = require('../../common/utils/authJWT');
const certificateValidtion = require('../../common/utils/certificateValidator');
const  redisStoreCheck = require('../../common/utils/redisStore');
const uploadFile = require('../../common/utils/uploads');

router.post('/authorization',bexioController.authorization);
router.get('/bexio-redirect/:code',bexioController.bexioRedirect);
router.get('/bexio-redirect',bexioController.bexioRedirect);
router.post('/getToken',bexioController.getToken);
router.get('/testEncrypt',verifyTokenData,bexioController.testEncrypt);
router.post('/bexioApi',verifyTokenData,redisStoreCheck,bexioController.bexioApi);
router.post('/bexioApiTest',verifyTokenData,bexioController.bexioApiTest);
router.post('/readFile',verifyTokenData,bexioController.readFile);
router.post('/apiTest',verifyTokenData,bexioController.apiTest);
router.post('/bexioUserCreate',verifyTokenData,bexioController.bexioUserCreate);
router.post('/refreshTokenCreate',verifyTokenData,bexioController.refreshTokenCreate);
router.post('/inviteCompany',verifyTokenData,bexioController.inviteCompany);
// router.post('/getCountryCode',bexioController.getUserRole)
router.post('/getInvoice',verifyTokenData,redisStoreCheck,bexioController.getInvoice);
router.post('/getBills',verifyTokenData,bexioController.getBills);
router.post('/logout',bexioController.bexioLogout);
router.post('/getOrderForOpenTrans',verifyTokenData,bexioController.getOrderForOpenTrans);
router.post('/getAccessToken',bexioController.getAccessToken);
router.post('/createAccessToken',verifyTokenData,bexioController.createAccessToken);
router.post('/testApi',verifyTokenData,bexioController.testApi);
router.post('/getInvoiceForOpenTrans',verifyTokenData,bexioController.getInvoiceForOpenTrans);
router.post('/testApi2',bexioController.testApi2);
router.post('/getInvoicePdf',verifyTokenData,bexioController.getInvoicePdf);
router.post('/createBill',verifyTokenData,bexioController.createBill);
router.post('/xmlToJson',verifyTokenData,bexioController.xmlToJson);
router.post('/getAllUsers',verifyTokenData,bexioController.getAllUsers);
router.post('/createBusinessConnection',verifyTokenData,bexioController.createBusinessConnection);
router.post('/fileUpload',verifyTokenData,bexioController.fileUpload);

router.post('/getTax',verifyTokenData,bexioController.getTax);
// router.post('/copyCountry',bexioController.copyCountry);
 router.post('/getInvitionDetails',bexioController.getInvitionDetails);
//  router.post('/changeInvoiceSendStatus',bexioController.changeInvoiceSendStatus);
 router.post('/kafkaTest',bexioController.kafkaTest);
//  router.post('/contactList',bexioController.contactList);

router.post('/getBexioUserPermission',verifyTokenData,bexioController.getBexioUserPermission);
 
router.post('/deleteBc',verifyTokenData,bexioController.deleteBc);
router.post('/getTransactionDetails',verifyTokenData,bexioController.getTransactionDetails);
router.post('/getInvitionCodeDetails',verifyTokenData,bexioController.getInvitionCodeDetails);
router.post('/checkContact',verifyTokenData,bexioController.checkContact);

router.post('/createContact',verifyTokenData,bexioController.createContact);
router.get('/healthCheck',bexioController.healthCheck); 
router.post('/testApi',verifyTokenData,bexioController.testApi); 
router.post('/createBexioUser',verifyTokenData,bexioController.createBexioUser); 
// router.post('/getSuperAdminToken',bexioController.getSuperAdminToken); 

router.post('/switchCompanyBexio',bexioController.switchCompanyBexio); 
router.post('/setSuperAdmin',bexioController.setSuperAdmin); 
router.post('/getEbillUsedCount',bexioController.getEbillUsedCount); 

// router.post('/setEbillOpenTrans',bexioController.setEbillOpenTrans); 
router.post('/pushInvoice/:method/:method2/:method3',bexioController.pushInvoice)

router.post('/pushInvoice',bexioController.pushInvoice); 
// router.post('/test',bexioController.test); 

router.post('/getAutherizationStatus',bexioController.getAutherizationStatus); 
router.post('/setAutherizationStatus',bexioController.setAutherizationStatus);
router.post('/tourList',verifyTokenData,bexioController.tourList);
router.post('/updateTour',verifyTokenData,bexioController.updateTour);
router.post('/infoList',verifyTokenData,bexioController.infoList);
router.post('/updateInfo',verifyTokenData,bexioController.updateTour);
router.post('/updateTutorialStatus',verifyTokenData,bexioController.updateTutorialStatus);
// router.post('/notifiBexioErrors',verifyTokenData,bexioController.notifiBexioErrors);
router.post('/notifyEbillMail',verifyTokenData,bexioController.notifyEbillMail);
router.post('/changeInvoiceSendStatus',bexioController.changeInvoiceSendStatus);
router.post('/switchCompany',verifyTokenData,bexioController.switchCompany);
router.post('/keysAvailable',bexioController.keysAvailable);
// router.post('/xmlToJsonOrder',bexioController.xmlToJsonOrder);
router.post('/getBccontactDetails',bexioController.getBccontactDetails);
router.post('/getBexioDocTypes',bexioController.getBexioDocTypes);
router.post('/getContactList',redisStoreCheck,bexioController.getContactList);
router.post('/getOrderList',redisStoreCheck,bexioController.getOrderList);
router.post('/sendG2bOrder',bexioController.sendG2bOrder);
router.post('/getPurchaseOrders',verifyTokenData,bexioController.getPurchaseOrders);
router.post('/getDeliveryNotesList',verifyTokenData,bexioController.getDeliveryNotesList);
router.post('/getDeliveryNotesForOT',verifyTokenData,bexioController.getDeliveryNotesForOT);
router.post('/checkContactExist',verifyTokenData,bexioController.checkContactExist);
router.post('/getAccountToken',bexioController.getAccountToken);
router.post('/getUserLogs',bexioController.getUserLogs);


router.post('/getTransactionList',verifyTokenData,bexioController.getTransactionList);
router.post('/updateProcessDataToRedis',verifyTokenData,bexioController.updateProcessDataToRedis);
router.post('/getProcessDataFromRedis',verifyTokenData,bexioController.getProcessDataFromRedis);
router.post('/deleteProcessDataFromRedis',verifyTokenData,bexioController.deleteProcessDataFromRedis);
// router.post('/sendOrderToG2b',verifyTokenData,bexioController.sendOrderToG2b);
// router.post('/test',verifyTokenData,bexioController.test);
router.post('/activeBillers',uploadFile.uploadMutiple,bexioController.activeBillers)
// router.post('/checkBexio',uploadFile.uploadSingle,bexioController.checkBexio)
router.post('/getEbillInvoice',uploadFile.uploadSingle,bexioController.getEbillInvoice);
router.post('/getEbillInvoicePdf',uploadFile.uploadSingle,bexioController.getEbillInvoicePdf);
router.post('/sendBulkEbill',bexioController.sendBulkEbill);
router.post('/pushTest',bexioController.pushTest);
// router.post('/pushInvoiceTest',bexioController.pushInvoiceTest);
router.post('/getEbillContactList',bexioController.getEbillContactList);
router.post('/changePayementComments',bexioController.changePayementComments);
router.post('/getPayementComments',bexioController.getPayementComments);
router.post('/sentNewOrderMails',bexioController.sentNewOrderMails);
router.post('/updateOrderMailStatus',verifyTokenData,bexioController.updateOrderMailStatus);
router.post('/getOrderMailSendStatus',verifyTokenData,bexioController.getOrderMailSendStatus);
router.post('/sendBulkInvoices',bexioController.sendBulkInvoices);
router.post('/getPurchaseOrderList',verifyTokenData,bexioController.getPurchaseOrderList);
router.post('/sendBulkDeliveryNotes',verifyTokenData,bexioController.sendBulkDeliveryNotes);
router.post('/sendBulkPurchaseOrder',verifyTokenData,bexioController.sendBulkPurchaseOrder);
router.post('/bexioCompanyCreate',bexioController.bexioCompanyCreate);
router.post('/processBexioPaymentFailure',bexioController.processBexioPaymentFailure);







export default router;