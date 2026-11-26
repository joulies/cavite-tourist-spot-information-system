import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdatePhotoDto {
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  photo_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  caption?: string;
}
