import config from './common/config';
import express from 'express';
import * as path from 'path';
import helmet from 'helmet';
import * as l10n from 'jm-ez-l10n';
const https = require('https');
const fs = require('fs');

async function startServer() {
	const app = express();

	/**
	 * A little hack here
	 * Import/Export can only be used in 'top-level code'
	 * Well, at least in node 10 without babel and at the time of writing
	 * So we are using good old require.
	 **/


	await require('./common/loaders').default({ expressApp: app });
	app.use(express.static(path.join(__dirname, 'public')));
	
	
	l10n.setTranslationsFile('en', __dirname+'/common/language/translation.en.json');
	app.use(l10n.enableL10NExpress);
	
	app.use(helmet());
	Error.stackTraceLimit = Infinity;
	let server = app.listen(config.port, (err?: any) => {
		if (err) {
			console.info(err);
			process.exit(1);
			return;
		}
		console.info(`
      ################################################
      🛡️  Server listening on port: ${config.port}   🛡️
      ################################################
    `);
	});

	// const opts = {
	// 	key: fs.readFileSync('assets/iom_server_key.pem'),
    //     cert: fs.readFileSync('assets/iom_server_cert.pem'),
    //     // key: fs.readFileSync(config.SERVER_CERTIFICATE_PATH+'iom_server_key.pem'),
    //     // cert: fs.readFileSync(config.SERVER_CERTIFICATE_PATH+ 'iom_server_cert.pem'),
    //     requestCert: true,
    //     rejectUnauthorized: false, // so we can do own error handling
    //     ca: [
	// 		fs.readFileSync('assets/iom_server_cert.pem')
    //         // fs.readFileSync(config.SERVER_CERTIFICATE_PATH+ 'iom_server_cert.pem')
    //     ]
    // };
    //  console.log(opts);
	 
	// let server = https.createServer(opts,app).listen(config.port, (err?:any) => {
	// 	if (err) {
	// 		console.info(err);
	// 		process.exit(1);
	// 		return;
	// 	}
    // 	console.info(`
    //   ################################################
    //   🛡️  Server listening on port: ${config.port}   🛡️
    //   ################################################
    // `);
    // });
	server.setTimeout(0)
}

startServer();

