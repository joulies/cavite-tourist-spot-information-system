import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TouristSpotsService } from './tourist-spots.service';
import { TouristSpotsController } from './tourist-spots.controller';
import { TouristSpot } from './entities/tourist-spot.entity';
import { Category } from '../categories/entities/category.entity';
import { Municipality } from '../municipalities/entities/municipality.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TouristSpot, Category, Municipality])],
  controllers: [TouristSpotsController],
  providers: [TouristSpotsService],
})
export class TouristSpotsModule {}
