
const multer = require('multer')
const path = require('path')
const maxSize = 2 * 1024 * 1024;
const crypto = require('crypto');

import config from '../config';

let storage = (filePath) => multer.diskStorage({
    //save file out side project
    destination: (req, file, cb) => {
        cb(null, config.IMAGE_SAVE_PATH + filePath)
    },
    filename: (req, file, cb) => {
        var currentdate = Date.now() + (crypto.randomBytes(16).toString("hex")).toUpperCase();
        let removeSpecial = file.originalname.replace(/[^0-9a-zA-Z.]/g, '');
        let filepathValue = currentdate + '_' + removeSpecial
        req.body["serverLocation"] = filePath
        cb(null, filepathValue);
    }
});
//used single for 1 image upload
const uploadFiles = (from, path) => multer({
    storage: storage(path),
    limits: { fileSize: maxSize },
}).single(from);
const uploadtext = multer().array()
const uploadSingle = multer().single("file")
const uploadMutiple = multer().any();
module.exports = { uploadFiles, uploadtext,uploadSingle,uploadMutiple }