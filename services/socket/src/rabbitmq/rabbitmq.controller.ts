import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CoreBrokerEvents } from 'src/common/constants';
import { IChatCreatedPayload } from 'src/common/interfaces/gateway';

import { SocketGateway } from 'src/gateway/socket.gateway';

@Controller()
export class RabbitMqController {
  private logger = new Logger(RabbitMqController.name);

  constructor(private socketGateway: SocketGateway) {}
  @EventPattern(CoreBrokerEvents.ChatCreated)
  handleChatCreated(@Payload() data: IChatCreatedPayload) {
    try {
      this.socketGateway.handleChatCreated(data);
    } catch (error) {
      this.logger.error(error);
    }
  }
}
