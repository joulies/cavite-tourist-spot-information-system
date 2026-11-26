import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateMunicipalityDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  municipality_name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  province?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  postal_code?: string;
}
