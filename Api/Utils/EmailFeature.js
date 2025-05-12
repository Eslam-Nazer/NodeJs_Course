const nodemailer = require('nodemailer');
require('dotenv').config();

const sendMail = async (option) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: parseInt(process.env.MAIL_PORT),
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
        tls: {
            minVersion: process.env.MAIL_TLS,
        }
    });

    // Define email options
    const emailOptions = {
        from: "Eslam support <support@example.com>",
        to: option.email,
        subject: option.subject,
        text: option.text,
    };

    await transporter.sendMail(emailOptions, (error, info) => {
        if (error) {
            console.log('error ', error);
        }
    });
}

module.exports = sendMail;