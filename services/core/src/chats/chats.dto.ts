import {
  IsNotEmpty,
  IsArray,
  ArrayNotEmpty,
  IsMongoId,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateDirectChatDto {
  @IsNotEmpty({ message: 'Participant id is required' })
  @IsString({ message: 'Participant id must be a string' })
  @IsMongoId()
  participantId: string;
}

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
