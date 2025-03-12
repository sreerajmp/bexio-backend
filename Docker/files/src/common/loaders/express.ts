import express from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import { isCelebrateError } from 'celebrate';
import common_routes from '../../api';
import config from '../config';
const redis = require('redis');
const redisClient = redis.createClient(config.REDIS_PORT, config.REDIS_HOST);


// change start
const multer = require('multer');
const upload = multer();

const session = require('express-session');

const cookieParser = require('cookie-parser');
const RedisStore = require('connect-redis')(session);

//new change
const expressSession = require('express-session');
import status_code from '../../common/utils/statusCodes';
const encryptionControl = require('../utils/jwt-decode');

// change end

export default ({ app }: { app: express.Application }) => {
	/**
	 * Health Check endpoints
	 * @TODO Explain why they are here
	 */

	// Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
	// It shows the real origin IP in the heroku or Cloudwatch logs
	app.enable('trust proxy');
	
	// The magic package that prevents frontend developers going nuts
	// Alternate description:
	// Enable Cross Origin Resource Sharing to all origins by default
	// app.use(cors(config.CORS_OPTIONS));
	console.log('WHITELIST',config.WHITELIST);
	
	const corsOptions = {
        origin: function (origin, callback) {
			console.log('origin',origin);
			
            if (config.WHITELIST.indexOf(origin) !== -1) {
				console.log('IN',origin);
				
                callback(null, true);
			} 
			else {
				console.log('OUT',origin);

                callback(console.log('Not allowed by CORS'));
            }
        },
        methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Content-Range', 'X-Content-Range'],
        credentials: true,
    };

	// app.use(cors(corsOptions));
	console.log('corsOptions',corsOptions);
	
	app.use(cors(corsOptions));
	// Middleware that transforms the raw string of req.body into json
	// app.use(bodyParser.json());
	//support parsing of application/x-www-form-urlencoded post data
	// app.use(bodyParser.urlencoded({ extended: false }));

	
	app.use(cookieParser(config.SESSION_SECRET))
	app.use(
        session({
            store: new RedisStore({
                client: redisClient,
            }),
            secret: config.SESSION_SECRET,
            resave: true,
            saveUninitialized: false,
            name: config.SESSION_COOKIE_NAME,
            cookie: {
                secure: true,
                httpOnly: true,
                maxAge: config.SESSION_EXPIRY,
                domain: config.SESSION_DOMAIN,
            },
        }),
    );
	app.use(upload.array());
	app.use(bodyParser.urlencoded({
	  extended: true
	}));
     // create session end

	app.use(bodyParser.json({ limit: '50mb' }));
	app.use(
		bodyParser.urlencoded({
			limit: '150mb',
			extended: true,
			parameterLimit: 500000000
		})
	);

	app.set('views', 'src/views');
	app.set('view engine', 'ejs');

	// Load API routes
	app.use(config.api.prefix, common_routes());

	app.use((err, req, res, next) => {
		if (isCelebrateError) { //if joi produces an error, it's likely a client-side problem   
			if (err.details.get('body')) {
				const errorBody = err.details.get('body'); // 'details' is a Map()
				let { details } = errorBody;
				details = details[0];
				return res.status(400).json({ status: '400', message: details.message, type: 'body' });
			}
		}
		next(err);
	});
	
	// / catch 404 and forward to error handler
	app.use((req, res, next) => {
		const err = new Error('Route Not Found');
		err['status'] = 404;
		next(err);
	});

	// / error handlers
	app.use((err, req, res, next) => {
		/**
		 * Handle 401 thrown by express-jwt library
		 */
		if (err.name === 'UnauthorizedError') {
			return res
				.status(err.status)
				.send({ message: err.message })
				.end();
		}
		return next(err);
	});
	app.use((err, req, res, next) => {
		res.status(err.status || 500);
		res.json({
			errors: {
				message: err.message
			}
		});
	});
};
