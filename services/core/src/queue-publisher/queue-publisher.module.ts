import { Module } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

import { QueuePublisherService } from './queue-publisher.service';
import { QueueNames, getRabbitMqOptions } from 'src/rabbitmq/rabbitmq.config';

@Module({
  providers: [
    QueuePublisherService,
    {
      provide: QueueNames.Notifications,
      useFactory(configService: ConfigService) {
        return ClientProxyFactory.create(
          getRabbitMqOptions(configService, QueueNames.Notifications),
        );
      },
      inject: [ConfigService],
    },
  ],
  exports: [QueuePublisherService, QueueNames.Notifications],
})
export class QueuePublisherModule {}
