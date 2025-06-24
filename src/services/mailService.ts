import nodemailer from 'nodemailer';
import { MailRequest, MailResponse, MailConfig } from '../types/mail';

export class MailService {
  private transporter: nodemailer.Transporter;
  private fromEmail: string;

  constructor(config: MailConfig) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });
    this.fromEmail = config.auth.user;
  }

  async sendMail(mailRequest: MailRequest): Promise<MailResponse> {
    try {
      const mailOptions = {
        from: this.fromEmail,
        to: Array.isArray(mailRequest.to) ? mailRequest.to.join(', ') : mailRequest.to,
        subject: mailRequest.subject,
        text: mailRequest.text,
        html: mailRequest.html,
        cc: mailRequest.cc ? (Array.isArray(mailRequest.cc) ? mailRequest.cc.join(', ') : mailRequest.cc) : undefined,
        bcc: mailRequest.bcc ? (Array.isArray(mailRequest.bcc) ? mailRequest.bcc.join(', ') : mailRequest.bcc) : undefined,
        attachments: mailRequest.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error('Erreur lors de l\'envoi du mail:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
      };
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Erreur de vérification de la connexion SMTP:', error);
      return false;
    }
  }
} 