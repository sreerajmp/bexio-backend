import express from "express";
const router = express.Router();
const  scheduleController  = require("../controllers/schedulerController")

router.post('/notifiBexioErrors',scheduleController.notifiBexioErrors);
router.post('/getErrorInvoices',scheduleController.getErrorInvoices);

export default router;