import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreatePhotoDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  spot_id: number;

  @IsUrl()
  @MaxLength(500)
  photo_url: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  caption?: string;
}
