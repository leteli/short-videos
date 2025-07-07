import { Controller, Logger } from '@nestjs/common';
import { SocketGateway } from 'src/gateway/socket.gateway';

@Controller()
export class RabbitMqController {
  private logger = new Logger(RabbitMqController.name);

  constructor(private socketGateway: SocketGateway) {}
}
