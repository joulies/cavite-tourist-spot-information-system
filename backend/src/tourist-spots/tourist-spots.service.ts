import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTouristSpotDto } from './dto/create-tourist-spot.dto';
import { UpdateTouristSpotDto } from './dto/update-tourist-spot.dto';
import { TouristSpot } from './entities/tourist-spot.entity';
import { Category } from '../categories/entities/category.entity';
import { Municipality } from '../municipalities/entities/municipality.entity';

@Injectable()
export class TouristSpotsService {
  constructor(
    @InjectRepository(TouristSpot)
    private readonly touristSpotRepository: Repository<TouristSpot>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Municipality)
    private readonly municipalityRepository: Repository<Municipality>,
  ) {}

  async create(dto: CreateTouristSpotDto) {
    const { category_id, municipality_id, ...spotDetails } = dto;
    const [category, municipality] = await Promise.all([
      this.categoryRepository.findOneBy({ category_id }),
      this.municipalityRepository.findOneBy({ municipality_id }),
    ]);

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    if (!municipality) {
      throw new NotFoundException('Municipality not found.');
    }

    const touristSpot = this.touristSpotRepository.create({
      ...spotDetails,
      entrance_fee: spotDetails.entrance_fee ?? 0,
      category,
      municipality,
    });
    return this.touristSpotRepository.save(touristSpot);
  }

  findAll() {
    return this.touristSpotRepository.find({
      relations: { category: true, municipality: true },
      order: { spot_name: 'ASC' },
    });
  }

  async findOne(id: number) {
    const touristSpot = await this.touristSpotRepository.findOne({
      where: { spot_id: id },
      relations: { category: true, municipality: true },
    });

    if (!touristSpot) {
      throw new NotFoundException('Tourist spot not found.');
    }

    return touristSpot;
  }

  async update(id: number, dto: UpdateTouristSpotDto) {
    const touristSpot = await this.findOne(id);
    const { category_id, municipality_id, ...spotDetails } = dto;

    if (category_id !== undefined) {
      const category = await this.categoryRepository.findOneBy({ category_id });
      if (!category) {
        throw new NotFoundException('Category not found.');
      }
      touristSpot.category = category;
    }

    if (municipality_id !== undefined) {
      const municipality = await this.municipalityRepository.findOneBy({
        municipality_id,
      });
      if (!municipality) {
        throw new NotFoundException('Municipality not found.');
      }
      touristSpot.municipality = municipality;
    }

    Object.assign(touristSpot, spotDetails);
    return this.touristSpotRepository.save(touristSpot);
  }

  async remove(id: number) {
    const touristSpot = await this.findOne(id);
    await this.touristSpotRepository.remove(touristSpot);
  }
}
