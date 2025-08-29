import {
  IsString,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsInt,
  IsOptional,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import {
  SEARCH_QUERY_MIN,
  SEARCH_QUERY_MAX,
  PAGE_DEFAULT,
  LIMIT_DEFAULT,
  LIMIT_MIN,
  LIMIT_MAX,
} from 'src/common/constants/search.constants';

export class SearchUsersQuery {
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(SEARCH_QUERY_MIN)
  @MaxLength(SEARCH_QUERY_MAX)
  searchQuery: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(PAGE_DEFAULT)
  page: number = PAGE_DEFAULT;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(LIMIT_MIN)
  @Max(LIMIT_MAX)
  limit: number = LIMIT_DEFAULT;
}
