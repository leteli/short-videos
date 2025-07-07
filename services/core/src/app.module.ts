import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
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
  ],
})
export class AppModule {}
