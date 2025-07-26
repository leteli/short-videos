import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { QueueEvents } from 'src/rabbitmq/rabbitmq.config';
import { EmailService, ISendEmailPayload } from 'src/services/email.service';

@Controller()
export class EmailController {
  constructor(private emailService: EmailService) {}

  @EventPattern(QueueEvents.SendEmail)
  async handleSendEmailMessage(@Payload() data: ISendEmailPayload) {
    await this.emailService.sendEmail(data);
  }
}
