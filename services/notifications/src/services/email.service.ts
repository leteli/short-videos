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
      if (!to || !subject || !text) {
        this.logger.error('Email info not provided');
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const info = await this.mailerService.sendMail({
        to,
        subject,
        text,
      });

      this.logger.log(`[sendEmail] info ${JSON.stringify(info)}`);
    } catch (err) {
      this.logger.error(`[sendEmail] error: ${err}`);
    }
  }
}
