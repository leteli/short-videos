import { NestFactory } from '@nestjs/core';
import { AsyncOptions, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { getRabbitMqOptions } from './rabbitmq/rabbitmq.config';
import { QueueNames, SOCKET_FALLBACK_PORT } from './common/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const socketPort = configService.get<number>('port', SOCKET_FALLBACK_PORT);

  app.connectMicroservice<AsyncOptions<MicroserviceOptions>>({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      getRabbitMqOptions(configService, QueueNames.SOCKET_EMIT),
  });

  await app.listen(socketPort, () => {
    console.log(`Socket server is listening on port ${socketPort}`);
  });

  await app.startAllMicroservices();
}
bootstrap();
