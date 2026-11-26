import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  category_name: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  category_description?: string;
}
