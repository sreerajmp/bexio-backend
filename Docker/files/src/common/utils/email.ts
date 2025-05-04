import * as nodemailer from 'nodemailer';
import config from '../config';

const sendEmail = async (options) => {
    // create transporter
    console.log(options.email);
    console.log(config.MAIL_SERVER);
    console.log(config.MAIL_PORT);
    console.log(config.MAIL_USERNAME);
    console.log(config.MAIL_PASSWORD);

    console.log(options.subject);
    console.log(options.message);

    
    const transporter = nodemailer.createTransport({
        host: config.MAIL_SERVER,
        port: config.MAIL_PORT,
        auth: {
            user: config.MAIL_USERNAME,
            pass: config.MAIL_PASSWORD,
        },
        name: process.env.MAIL_INTERNAL_DOMAIN,
    });
 
    const mailOptions = {
        from: config.MAIL_USERNAME,
        to: options.email,
        subject: config.MAIL_SUBJECT_START + options.subject,
        html: options.message,
    };
    await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
