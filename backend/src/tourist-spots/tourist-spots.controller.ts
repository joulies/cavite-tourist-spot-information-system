import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TouristSpotsService } from './tourist-spots.service';
import { CreateTouristSpotDto } from './dto/create-tourist-spot.dto';
import { UpdateTouristSpotDto } from './dto/update-tourist-spot.dto';

@Controller('tourist-spots')
export class TouristSpotsController {
  constructor(private readonly touristSpotsService: TouristSpotsService) {}

  @Post()
  create(@Body() createTouristSpotDto: CreateTouristSpotDto) {
    return this.touristSpotsService.create(createTouristSpotDto);
  }

  @Get()
  findAll() {
    return this.touristSpotsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.touristSpotsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTouristSpotDto: UpdateTouristSpotDto) {
    return this.touristSpotsService.update(+id, updateTouristSpotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.touristSpotsService.remove(+id);
  }
}
