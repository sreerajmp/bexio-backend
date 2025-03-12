import express from "express";
const router = express.Router();
const uploadFile = require('../../common/utils/uploads');
const  sixAPIController  = require("../controllers/sixAPICertificateController")
const  verifyTokenData = require('../../common/utils/authJWT');
const  redisStoreCheck = require('../../common/utils/redisStore');

router.post('/createBiller',verifyTokenData,sixAPIController.createBiller); 
router.post('/updateBiller',verifyTokenData,uploadFile.uploadtext,sixAPIController.updateBiller); 
router.get('/getSectors',verifyTokenData,uploadFile.uploadtext,sixAPIController.getSectors); 
router.post('/getAsset',verifyTokenData,uploadFile.uploadtext,sixAPIController.getAsset);  
router.post('/getBiller',verifyTokenData,uploadFile.uploadtext,sixAPIController.getBiller);
router.post('/getBillerDetails',verifyTokenData,sixAPIController.getBillerDetails); 
router.post('/getSubcribers',verifyTokenData,uploadFile.uploadtext,sixAPIController.getSubscribers); 
router.post('/getInvoices',verifyTokenData,uploadFile.uploadtext,sixAPIController.getInvoices); 
router.get('/getContact',verifyTokenData,uploadFile.uploadtext,sixAPIController.getContact); 
router.post('/mergeAccept',verifyTokenData,sixAPIController.mergeAccept); 
router.post('/updateAsset',verifyTokenData,uploadFile.uploadSingle,sixAPIController.updateAsset);
router.post('/searchBiller',verifyTokenData,uploadFile.uploadtext,sixAPIController.searchBiller);
router.post('/getAllSubcribers',verifyTokenData,uploadFile.uploadtext,sixAPIController.getAllSubcribers);
router.post('/updatePartySpecific',verifyTokenData,uploadFile.uploadtext,sixAPIController.updatePartySpecific);
router.post('/disconnectRecipient',sixAPIController.disconnectRecipient);
router.post('/getContactList',verifyTokenData,redisStoreCheck,sixAPIController.getContactList);

// router.post('/mergeAccept',uploadFile.uploadtext,sixAPIController.mergeAccept); 


export default router;