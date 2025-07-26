import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as crypto from 'crypto';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import {
  RegistrationRequest,
  IRegistrationRequest,
  RegistrationRequestDocument,
} from './registrationRequest.model';
import { ApiErrors } from 'src/common/constants/errors.constants';
import { CONFIRM_CODE_LENGTH } from 'src/common/constants/app.constants';

@Injectable()
export class RegistrationRequestService {
  constructor(
    @InjectModel(RegistrationRequest.name)
    private registrationRequestModel: Model<RegistrationRequestDocument>,
    private configService: ConfigService,
  ) {}

  async createRegistrationRequest(data: Omit<IRegistrationRequest, 'code'>) {
    const code = this.generateCode();
    const request = new this.registrationRequestModel({
      ...data,
      code,
    });
    await request.save();
    return { expiresAt: request.getExpireTime(), code };
  }
  async getRegistrationRequest({ email }: { email: string }) {
    return this.registrationRequestModel.findOne({ email });
  }
  async createOrUpdateRegistrationRequest(
    data: Omit<IRegistrationRequest, 'code'>,
  ) {
    const { email } = data;
    const request = await this.getRegistrationRequest({ email });
    if (!request) {
      return this.createRegistrationRequest(data);
    }
    const code = this.generateCode();
    request.code = code;
    await request.save();
    return {
      expiresAt: request.getExpireTime(),
      code,
    };
  }
  async validateRegistrationRequest({
    code,
    email,
  }: Pick<IRegistrationRequest, 'code' | 'email'>) {
    const request = await this.getRegistrationRequest({ email });
    const isValid = await request?.isValid(code);
    if (!request || !isValid) {
      throw new UnauthorizedException(ApiErrors.InvalidCode);
    }
    return request;
  }
  generateCode() {
    const codeLength =
      this.configService.get<number>('codeLength') ?? CONFIRM_CODE_LENGTH;
    const code = crypto.randomInt(0, 1_000_000);
    return code.toString().padStart(codeLength, '0');
  }
}
