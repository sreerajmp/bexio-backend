import { Logger } from '@nestjs/common';
import config from '../../common/config/index';
const request = require('request');
const crypto = require('crypto');
const fs = require('fs');
const util = require('util');

const logger = new Logger('WarningMessage');

/**
 * Pushes log data to Loki via stdout using NestJS inbuilt Logger.
 * This structure aligns with the Python implementation requirements.
 */
const pushToLoki = async (data: any, error: any) => {
    try {
        const lokiData = {
            messagetype: Number(data.messagetype) || 500,
            tenant: data.netcomId || data.tenant || data.addl_params?.netcomid || "",
            message: data.message || (error ? error.toString() : "Unknown Error"),
            service: config.DOCKER_NAME || config.APP_NAME || "Bexio-Interface",
            process: data.process || data.errorTitle || "",
            user: { name: 'autobot' },
            timestamp: new Date().toISOString().replace('T', ' ').replace('Z', ''),
            guid: data.guid || data.addl_params?.transid || "",
            filename: data.filename || "",
            uniqueid: crypto.randomBytes(16).toString('hex')
        };

        logger.log(JSON.stringify(lokiData));
    } catch (e) {
        logger.error('Error in pushToLoki:', e);
    }
};

/**
 * Main entry point for logging warnings/errors.
 * Now exclusively uses pushToLoki (via stdout/Logger).
 */
const warningMessageToDotnet = async (data, error, isLogger: boolean = true) => {
    if (isLogger) {
        await pushToLoki(data, error);
    }
    if (error != null) {
        const errorId = crypto.randomBytes(15).toString('hex');
        // const errorFolder = config.ERROR_PATH + '/'
        // if (!fs.existsSync(errorFolder)) {
        //     fs.mkdirSync(errorFolder)
        // }
        // fs.writeFile(errorFolder + '/' + errorId + '.txt', util.inspect(error), 'utf-8', function (err) {
        //     if (err) {
        //         console.log(err);
        //     }
        // });
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
    else {
        data['addl_params'] = '{}'
    }
    let typeIssue = data.errorDescription?.search("ERR_INVALID_ARG_TYPE") ?? -1;
    data['name'] = '';
    data['path'] = '';

    if (typeIssue != -1) {
        return;
    }
    const options = {
        method: 'POST',
        url: config.NOTIFICATION_URL,
        formData: data
    };
    if (data) {
        try {
            await request(options, async function (error, response) {
                if (error) {
                    console.log('error111', error);
                }
                else {
                    console.log(response.body);
                }
            })
        } catch (error) {
            console.log('waringError', error);

        }


    }
}

export default warningMessageToDotnet;
