import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MessagesService } from 'src/messages/messages.service';
import { SocketBrokerEvents } from './rabbitmq.config';
import { ICreateMessage } from './rabbitmq.interfaces';
import { HandlerStatus } from 'src/common/utils/types';

@Controller()
export class RabbitMqController {
  private logger = new Logger(RabbitMqController.name);
  constructor(private messagesService: MessagesService) {}

  @MessagePattern(SocketBrokerEvents.CreateMessage)
  public async handleMessageSend(@Payload() data: ICreateMessage) {
    try {
      return await this.messagesService.createMessage(data);
    } catch (error) {
      this.logger.error(error);
      return { status: HandlerStatus.Failed, message: data?.message };
    }
  }
}
