import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, AsyncOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AppModule } from 'src i/app.module';
import { getRabbitMqOptions, QueueNames } from 'src/rabbitmq/rabbitmq.config';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<
    AsyncOptions<MicroserviceOptions>
  >(AppModule, {
    inject: [ConfigService],
    useFactory: (configService: ConfigService) =>
      getRabbitMqOptions(configService, QueueNames.Ffmpeg),
  });
  await app.listen();
}
bootstrap();
