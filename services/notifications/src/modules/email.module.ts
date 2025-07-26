import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from 'src/services/email.service';
import { Config } from 'src/common/config';
import { EmailController } from 'src/controllers/email.controller';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      // eslint-disable-next-line @typescript-eslint/require-await
      useFactory: async (config: ConfigService<Config>) => {
        const mailConfig = config.get<Config['mail']>('mail');
        const { host, port, user, pass } = mailConfig as Config['mail'];

        return {
          transport: {
            host,
            port,
            secure: true,
            auth: {
              user,
              pass,
            },
          },
          defaults: {
            from: `"no-reply" <${user}>`,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
