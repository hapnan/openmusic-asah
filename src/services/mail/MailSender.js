'use strict';

const nodemailer = require('nodemailer');
const InvariantError = require('../../exeptions/InvariantError');

class MailSender {
    constructor() {
        const host = process.env.SMTP_HOST;
        const port = Number(process.env.SMTP_PORT);
        const user = process.env.SMTP_USER;
        const pass = process.env.SMTP_PASSWORD;

        if (!host || !port || !user || !pass) {
            throw new InvariantError('SMTP configuration is incomplete');
        }

        this._transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: {
                user,
                pass,
            },
        });

        this._sender = user;
    }

    async sendEmail(targetEmail, content) {
        const message = {
            from: this._sender,
            to: targetEmail,
            subject: 'OpenMusic Playlist Export',
            text: 'Attached is your requested playlist export.',
            attachments: [
                {
                    filename: 'playlist.json',
                    content,
                    contentType: 'application/json',
                },
            ],
        };

        await this._transporter.sendMail(message);
    }
}

module.exports = MailSender;
