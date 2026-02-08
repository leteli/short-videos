import { Global, Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { RabbitMqService } from './rabbitmq.service';
import { QueueNames, getRabbitMqOptions } from 'src/rabbitmq/rabbitmq.config';
import { RabbitMqController } from './rabbitmq.controller';
import { MessagesModule } from 'src/messages/messages.module';

@Global()
@Module({
  imports: [MessagesModule],
  controllers: [RabbitMqController],
  providers: [
    RabbitMqService,
    {
      provide: QueueNames.Notifications,
      useFactory(configService: ConfigService) {
        return ClientProxyFactory.create(
          getRabbitMqOptions(configService, QueueNames.Notifications),
        );
      },
      inject: [ConfigService],
    },
    {
      provide: QueueNames.Socket,
      useFactory(configService: ConfigService) {
        return ClientProxyFactory.create(
          getRabbitMqOptions(configService, QueueNames.Socket),
        );
      },
      inject: [ConfigService],
    },
  ],
  exports: [RabbitMqService, QueueNames.Notifications, QueueNames.Socket],
})
export class RabbitMqModule {}
