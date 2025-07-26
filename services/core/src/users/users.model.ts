import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Document, Types } from 'mongoose';

export interface IUser {
  _id: string;
  email: string;
  username: string;
}

export interface IBasicUserDto {
  id: string;
  username: string;
}
export interface IUserDto extends IBasicUserDto {
  email: string;
}

export enum DtoFormats {
  short = 'short',
  full = 'full',
}

export type UserDocument = User & Document<Types.ObjectId>;

@Schema({
  timestamps: true,
  autoCreate: true,
  autoIndex: true,
  versionKey: false,
})
export class User {
  _id: string;
  @Prop({ required: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, select: false })
  password: string;

  toDto(): IUserDto {
    return {
      id: this._id,
      username: this.username,
      email: this.email,
    };
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const saltRounds = 6;
  try {
    const hashed = await bcrypt.hash(this.password, saltRounds);
    this.password = hashed;
  } catch (err) {
    console.error(err);
    throw err;
  }
});

UserSchema.loadClass(User);
