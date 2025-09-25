import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { compare, hash } from 'bcryptjs';
import { Types, HydratedDocument } from 'mongoose';

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  username: string;
  usernameLower: string;
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

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  autoCreate: true,
  autoIndex: true,
  versionKey: false,
})
export class User {
  _id: Types.ObjectId;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  usernameLower: string;

  @Prop({ required: true })
  password: string;

  toBasicDto(): IBasicUserDto {
    return {
      id: this._id.toString(),
      username: this.username,
    };
  }

  toDto(): IUserDto {
    return {
      id: this._id.toString(),
      username: this.username,
      email: this.email,
    };
  }
  async isPasswordValid(password: string) {
    return compare(password, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function () {
  if (this.isModified('username')) {
    this.usernameLower = this.username.toLowerCase();
  }
  if (!this.isModified('password')) {
    return;
  }
  const saltRounds = 6;
  try {
    const hashed = await hash(this.password, saltRounds);
    this.password = hashed;
  } catch (err) {
    console.error(err);
    throw err;
  }
});

UserSchema.loadClass(User);
UserSchema.index({ usernameLower: 1 });
