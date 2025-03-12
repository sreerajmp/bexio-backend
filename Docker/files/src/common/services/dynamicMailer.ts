import * as nodemailer from 'nodemailer';
import config from '../config';
import ejs from 'ejs';
import path from 'path';
import { Service } from 'typedi';

@Service()
export class dynamicMailer {
    transporter;

    public constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.SMTP_HOST,
            port: config.SMTP_PORT,
            secure: false,
            service: 'gmail',
            auth: {
                user: config.SMTP_USER,
                pass: config.SMTP_PASSWORD,
            },
        });
    }

    public async APIBackendService(data: any) {
        const mailOptions = {
            from: config.SMTP_USER,
            to: data.receivers,
            subject: data.subject,
            html: data.body,
        };
        this.transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                // Logger.error(error);
            }
        });
    }

    public async memberInvitationSendMail(data: Object) {
        const trans = this.transporter;
        const year = new Date().getFullYear();
		ejs.renderFile(
			path.join(__dirname, '../views/emails', 'invitationLink.ejs'),
			{ year:year },
			function(err, body) {
				if (err) {
					// Logger.error(err);
				} else {
					const subject = '';
					const mailOptions = {
						from: config.SMTP_USER,
						to: data['receiver_email'],
						subject: subject,
						html: body,
					};
					trans.sendMail(mailOptions, function(error, info) {
						if (error) {
							// Logger.errorAndMail(error);
						} else {
							// Logger.info('Email sent: ' + info.response);
						}
					});
				}
			},
		);
	}
}
