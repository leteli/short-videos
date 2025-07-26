import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { hash, compare } from 'bcryptjs';
import { Document, Types } from 'mongoose';
import { minutesToMilliseconds, minutesToSeconds } from 'date-fns';
import { parseNumber } from 'src/common/utils/parsers/parseNumber';

export const codeExpiresInMin = parseNumber(process.env.CODE_EXPIRES_MIN, 3);

export interface IRegistrationRequest {
  email: string;
  username: string;
  password: string;
  code: string;
}

@Schema({
  versionKey: false,
  autoCreate: true,
  autoIndex: true,
  timestamps: true,
})
export class RegistrationRequest {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  code: string;

  @Prop({
    expires: minutesToSeconds(codeExpiresInMin),
  })
  updatedAt: Date;

  async isValid(code: string) {
    return compare(code, this.code);
  }
  getExpireTime() {
    return this.updatedAt.getTime() + minutesToMilliseconds(codeExpiresInMin);
  }
}

export type RegistrationRequestDocument = RegistrationRequest &
  Document<Types.ObjectId>;

export const RegistrationRequestSchema =
  SchemaFactory.createForClass(RegistrationRequest);

RegistrationRequestSchema.pre('save', async function () {
  try {
    const saltRounds = 6;
    const hashed = await hash(this.code, saltRounds);
    this.code = hashed;
  } catch (err) {
    console.error(err);
    throw err;
  }
});

RegistrationRequestSchema.loadClass(RegistrationRequest);
