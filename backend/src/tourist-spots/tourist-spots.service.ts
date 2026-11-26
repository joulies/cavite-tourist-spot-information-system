import { Injectable } from '@nestjs/common';
import { CreateTouristSpotDto } from './dto/create-tourist-spot.dto';
import { UpdateTouristSpotDto } from './dto/update-tourist-spot.dto';

@Injectable()
export class TouristSpotsService {
  create(createTouristSpotDto: CreateTouristSpotDto) {
    return 'This action adds a new touristSpot';
  }

  findAll() {
    return `This action returns all touristSpots`;
  }

  findOne(id: number) {
    return `This action returns a #${id} touristSpot`;
  }

  update(id: number, updateTouristSpotDto: UpdateTouristSpotDto) {
    return `This action updates a #${id} touristSpot`;
  }

  remove(id: number) {
    return `This action removes a #${id} touristSpot`;
  }
}
