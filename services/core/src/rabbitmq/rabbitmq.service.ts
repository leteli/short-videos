import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  PublishedBrokerEvents,
  QueueNames,
} from 'src/rabbitmq/rabbitmq.config';
import { ISendEmailPayload, IChatCreatedPayload } from './rabbitmq.interfaces';

@Injectable()
export class RabbitMqService {
  private logger = new Logger(RabbitMqService.name);
  constructor(
    @Inject(QueueNames.Notifications) private notificationClient: ClientProxy,
    @Inject(QueueNames.Socket) private socketClient: ClientProxy,
  ) {}

  safeEmit(client: ClientProxy, event: string, data: unknown) {
    try {
      client.emit(event, data);
    } catch (error) {
      this.logger.error(`Failed to emit ${event}: ${error}`);
    }
  }

  sendEmail(data: ISendEmailPayload) {
    this.safeEmit(
      this.notificationClient,
      PublishedBrokerEvents.SendEmail,
      data,
    );
  }
  handleChatCreated(data: IChatCreatedPayload) {
    this.safeEmit(this.socketClient, PublishedBrokerEvents.ChatCreated, data);
  }
}
