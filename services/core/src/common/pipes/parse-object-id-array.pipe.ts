import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from './parse-object-id.pipe';

@Injectable()
export class ParseObjectIdArrayPipe implements PipeTransform {
  private readonly itemPipe: ParseObjectIdPipe;

  constructor() {
    this.itemPipe = new ParseObjectIdPipe();
  }

  transform(arr: string[]): Types.ObjectId[] {
    try {
      return arr.map((v) => this.itemPipe.transform(v));
    } catch {
      throw new BadRequestException('Invalid ObjectId in array');
    }
  }
}
