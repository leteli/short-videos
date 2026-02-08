import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';

export const toObjectId = (value: string) => {
  if (!Types.ObjectId.isValid(value)) {
    throw new BadRequestException('Invalid ObjectId');
  }
  return new Types.ObjectId(value);
};
