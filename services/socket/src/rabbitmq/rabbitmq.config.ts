import { ConfigService } from '@nestjs/config';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { Config } from 'src/common/config';

export const getRabbitMqOptions = (
  configService: ConfigService<Config>,
  queueName: string,
): RmqOptions => {
  const rabbitConfig = configService.get<Config['rabbit']>('rabbit');
  const { host, user, pass } = rabbitConfig as Config['rabbit'];

  return {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${user}:${pass}@${host}`],
      queue: queueName,
      queueOptions: { durable: false },
    },
  };
};
