import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateTouristSpotDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  spot_name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  address: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  entrance_fee?: number;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  opening_hours?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  contact_number?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  category_id: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  municipality_id: number;
}
