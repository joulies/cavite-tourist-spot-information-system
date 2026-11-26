import { PartialType } from '@nestjs/mapped-types';
import { CreateTouristSpotDto } from './create-tourist-spot.dto';

export class UpdateTouristSpotDto extends PartialType(CreateTouristSpotDto) {}
