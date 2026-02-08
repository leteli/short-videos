import { Module, Global } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory } from '@nestjs/microservices';
import { getRabbitMqOptions } from './rabbitmq.config';
import { RabbitMqService } from './rabbitmq.service';
import { QueueNames } from '../common/constants/index';
import { RabbitMqController } from './rabbitmq.controller';
import { SocketModule } from 'src/gateway/socket.module';

@Global()
@Module({
  imports: [SocketModule],
  controllers: [RabbitMqController],
  providers: [
    RabbitMqService,
    {
      provide: QueueNames.Core,
      useFactory: (configService: ConfigService) => {
        return ClientProxyFactory.create(
          getRabbitMqOptions(configService, QueueNames.Core),
        );
      },
      inject: [ConfigService],
    },
  ],
  exports: [RabbitMqService, QueueNames.Core],
})
export class RabbitMqModule {}
