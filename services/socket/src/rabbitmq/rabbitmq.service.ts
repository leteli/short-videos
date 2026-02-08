import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { timeout, retry, firstValueFrom } from 'rxjs';
import { QueueNames, PublishedBrokerEvents } from 'src/common/constants';
import {
  ICreateMessage,
  ICreateMessageResponse,
} from 'src/common/interfaces/gateway';

@Injectable()
export class RabbitMqService {
  private logger = new Logger(RabbitMqService.name);
  constructor(
    @Inject(QueueNames.Core)
    private coreClient: ClientProxy,
  ) {}

  safeEmit(client: ClientProxy, event: string, data: unknown) {
    try {
      client.emit(event, data);
    } catch (error) {
      this.logger.error(`Failed to emit ${event}: ${error}`);
    }
  }

  async handleSendMessage(data: ICreateMessage) {
    try {
      const result = await firstValueFrom(
        this.coreClient
          .send<
            ICreateMessageResponse,
            ICreateMessage
          >(PublishedBrokerEvents.CreateMessage, data)
          .pipe(timeout(2000), retry(1)),
      );
      return result;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
