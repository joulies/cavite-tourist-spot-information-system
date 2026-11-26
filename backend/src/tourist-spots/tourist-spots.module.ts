import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TouristSpotsService } from './tourist-spots.service';
import { TouristSpotsController } from './tourist-spots.controller';
import { TouristSpot } from './entities/tourist-spot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TouristSpot])],
  controllers: [TouristSpotsController],
  providers: [TouristSpotsService],
})
export class TouristSpotsModule {}
