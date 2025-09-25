import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QueuePublisherModule } from './queue-publisher/queue-publisher.module';
import { ChatsModule } from './chats/chats.module';
import { SecurityModule } from './security/security.module';
import config from 'src/common/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('mongo.uri'),
        dbName: config.get<string>('mongo.dbName'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    QueuePublisherModule,
    ChatsModule,
    SecurityModule,
  ],
})
export class AppModule {}
