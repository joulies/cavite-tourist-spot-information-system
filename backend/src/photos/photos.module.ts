import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { Photo } from './entities/photo.entity';
import { TouristSpot } from '../tourist-spots/entities/tourist-spot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Photo, TouristSpot])],
  controllers: [PhotosController],
  providers: [PhotosService],
})
export class PhotosModule {}
