import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import configuration from 'src/common/config';
import { RabbitMqModule } from './rabbitmq/rabbitmq.module';
import { SocketModule } from './gateway/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const expiresInDays = config.get<string>('auth.jwtTokenExpiresInDays');
        return {
          secret: config.get<string>('auth.jwtTokenSecret'),
          signOptions: {
            expiresIn: `${expiresInDays}d`,
          },
        };
      },
      inject: [ConfigService],
    }),
    RabbitMqModule,
    SocketModule,
  ],
})
export class AppModule {}
