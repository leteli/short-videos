import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegistrationRequestModule } from 'src/registrationRequest/registrationRequest.module';
import { QueuePublisherModule } from 'src/queue-publisher/queue-publisher.module';

@Module({
  imports: [
    UsersModule,
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
    RegistrationRequestModule,
    QueuePublisherModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
