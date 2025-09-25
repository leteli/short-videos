import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PublishedEvents, QueueNames } from 'src/rabbitmq/rabbitmq.config';
import { ISendEmailPayload } from './types';

@Injectable()
export class QueuePublisherService {
  constructor(
    @Inject(QueueNames.Notifications) private notificationClient: ClientProxy,
  ) {}
  sendEmail(data: ISendEmailPayload) {
    this.notificationClient.emit(PublishedEvents.SendEmail, data);
  }
}
