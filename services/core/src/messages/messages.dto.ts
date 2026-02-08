import {
  IsNotEmpty,
  IsString,
  IsOptional,
  ValidateIf,
  MinLength,
  MaxLength,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  MESSAGE_LENGTH_MIN,
  MESSAGE_LENGTH_MAX,
} from 'src/common/constants/search.constants';

export class GetChatMessagesQueryDto {
  @IsOptional()
  @IsString({ message: 'Cursor must be a string' })
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number;
}

export class MediaMessageDto {
  @IsNotEmpty({ message: 'Media URL is required' })
  @IsString({ message: 'Media URL must be a string' })
  url: string;

  @IsOptional()
  @IsString({ message: 'MIME type must be a string' })
  mime?: string;

  @IsOptional()
  size?: number;

  @IsOptional()
  @IsString({ message: 'Original name must be a string' })
  originalName?: string;

  @IsOptional()
  width?: number;

  @IsOptional()
  height?: number;

  @IsOptional()
  durationMs?: number;
}

export class CreateMessageDto {
  @ValidateIf((object: CreateMessageDto) => !object.media)
  @IsString({ message: 'Text must be a string' })
  @MinLength(MESSAGE_LENGTH_MIN, {
    message: 'Text must be at least 1 character long',
  })
  @MaxLength(MESSAGE_LENGTH_MAX, {
    message: `Message must not be longer than ${MESSAGE_LENGTH_MAX} symbols`,
  })
  text: string;

  @ValidateIf((object: CreateMessageDto) => !object.media)
  media: MediaMessageDto;
}

export class UpdateMessageDto {
  @IsNotEmpty({ message: 'Text is required' })
  @IsString({ message: 'Text must be a string' })
  text: string;
}
