import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, AsyncOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { FALLBACK_CORE_PORT } from './common/constants/app.constants';
import { getRabbitMqOptions, QueueNames } from './rabbitmq/rabbitmq.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.connectMicroservice<AsyncOptions<MicroserviceOptions>>({
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      getRabbitMqOptions(configService, QueueNames.Core),
  });

  await app.startAllMicroservices();

  const configService = app.get(ConfigService);
  const clientUri = configService.get<string>('clientUrl');

  app.enableCors({
    origin: clientUri,
    credentials: true,
  });

  const port = configService.get<number>('port', FALLBACK_CORE_PORT);

  await app.listen(port);
}
bootstrap();
