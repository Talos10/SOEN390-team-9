import nodemailer from 'nodemailer';
import logger from '../shared/Logger';
import { config } from '../../config';

class EmailService {
    private smtpTransport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.mail.user,
            pass: config.mail.pass
        }
    });

    public sendPasswordRecoveryEmail(email: string, token: string) {
        const mail = {
            to: email,
            from: 'supreme.erp@gmail.com',
            subject: 'Supreme ERP - Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\n${config.hostname}/reset/${token}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n\nThe Supreme ERP team`
        };
        try {
            this.smtpTransport.sendMail(mail);
            return true;
        } catch (error) {
            logger.error(`Error sending password recovery email to ${email}. Error: ${error}`);
            return false;
        }
    }
}

const emailService = new EmailService();

export default emailService;
