import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { QueueEvents } from 'src/rabbitmq/rabbitmq.config';
import { EmailService, ISendEmailPayload } from 'src/services/email.service';

@Controller()
export class EmailController {
  private logger = new Logger(EmailController.name);
  constructor(private emailService: EmailService) {}

  @EventPattern(QueueEvents.SendEmail)
  async handleSendEmailMessage(@Payload() data: ISendEmailPayload) {
    try {
      await this.emailService.sendEmail(data);
    } catch (err) {
      this.logger.error(err);
    }
  }
}
