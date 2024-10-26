const nodemailer = require('nodemailer');

async function mailSender(email, body, title) {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        });

        const response = await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            text: body, // Use 'text' or 'html' based on your needs
            subject: title
        });

        console.log(`This is the response for sending email to ${email} =====> `, response);
    } catch (error) {
        console.log("Error occurred in mailSender function (mailSender.js):", error);
    }
}

// If using CommonJS, export the function
module.exports = mailSender;

// If using ES modules, you can keep it as is but make sure your environment supports it
