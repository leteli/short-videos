import {
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  IsMongoId,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateGroupChatDto {
  @IsArray({ message: 'Participants ids must be an array' })
  @ArrayNotEmpty({ message: 'Participants ids are required' })
  @IsMongoId({ each: true })
  participantIds: string[];

  @IsOptional()
  @IsString({ message: 'Chat title must be a string' })
  @IsNotEmpty({ message: 'Chat title cannot be empty' })
  title?: string;
}
