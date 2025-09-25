import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RabbitMqController } from 'src/rabbitmq/rabbitmq.controller';
import { SocketGateway } from 'src/gateway/socket.gateway';
import configuration from 'src/common/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
  ],
  controllers: [RabbitMqController],
  providers: [SocketGateway],
})
export class AppModule {}
