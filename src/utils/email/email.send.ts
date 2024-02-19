import nodemailer from 'nodemailer';
import config from '../config';
import handlebars from 'handlebars';
import fs from 'fs/promises';

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 587, 
    secure: false, 
    auth: {
        user: config.NODEMAILER.EMAIL,
        pass: config.NODEMAILER.PASSWORD,
    },
});

interface EmailOptions {
    to: string;
    subject: string;
    templatePath: string;
    templateData: any;
}

async function renderTemplate(templatePath: string, data: any): Promise<string> {
    const templateSource = await fs.readFile(templatePath, 'utf-8');
    const compiledTemplate = handlebars.compile(templateSource);
    return compiledTemplate(data);
  }

export async function sendEmail(options: EmailOptions): Promise<void> {
    return new Promise(async (resolve, reject) => {

        const html = await renderTemplate(options.templatePath, options.templateData);

        const mailOptions: nodemailer.SendMailOptions = {
            from: config.NODEMAILER.EMAIL,
            to: options.to,
            subject: options.subject,
            html,
        };

        // Send the email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('🚨 Error sending email:', error);
                reject(error);
            } else {
                console.log('🚀 Email sent:', info.response);
                resolve();
            }
        });
    });
}
