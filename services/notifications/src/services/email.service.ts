import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

export interface ISendEmailPayload {
  to: string;
  subject: string;
  text: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendEmail({ to, subject, text }: ISendEmailPayload) {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        text,
      });
    } catch (err) {
      this.logger.error(`[sendEmail] error: ${err}`);
    }
  }
}
