import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RegistrationRequest,
  RegistrationRequestSchema,
} from './registrationRequest.model';
import { RegistrationRequestService } from './registrationRequest.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RegistrationRequest.name,
        schema: RegistrationRequestSchema,
      },
    ]),
  ],
  providers: [RegistrationRequestService],
  exports: [RegistrationRequestService],
})
export class RegistrationRequestModule {}
