import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMunicipalityDto } from './dto/create-municipality.dto';
import { UpdateMunicipalityDto } from './dto/update-municipality.dto';
import { Municipality } from './entities/municipality.entity';

@Injectable()
export class MunicipalitiesService {
  constructor(
    @InjectRepository(Municipality)
    private readonly municipalityRepository: Repository<Municipality>,
  ) {}

  async create(dto: CreateMunicipalityDto) {
    const province = dto.province ?? 'Cavite';
    const existing = await this.municipalityRepository.findOneBy({
      municipality_name: dto.municipality_name,
      province,
    });

    if (existing) {
      throw new ConflictException(
        'A municipality with this name already exists in the province.',
      );
    }

    const municipality = this.municipalityRepository.create({
      ...dto,
      province,
    });
    return this.municipalityRepository.save(municipality);
  }

  findAll() {
    return this.municipalityRepository.find({
      order: { municipality_name: 'ASC' },
    });
  }

  async findOne(id: number) {
    const municipality = await this.municipalityRepository.findOneBy({
      municipality_id: id,
    });

    if (!municipality) {
      throw new NotFoundException('Municipality not found.');
    }

    return municipality;
  }

  async update(id: number, dto: UpdateMunicipalityDto) {
    const municipality = await this.findOne(id);
    const municipality_name = dto.municipality_name ?? municipality.municipality_name;
    const province = dto.province ?? municipality.province;

    const existing = await this.municipalityRepository.findOneBy({
      municipality_name,
      province,
    });

    if (existing && existing.municipality_id !== id) {
      throw new ConflictException(
        'A municipality with this name already exists in the province.',
      );
    }

    Object.assign(municipality, dto);
    return this.municipalityRepository.save(municipality);
  }

  async remove(id: number) {
    const municipality = await this.findOne(id);
    await this.municipalityRepository.remove(municipality);
  }
}
