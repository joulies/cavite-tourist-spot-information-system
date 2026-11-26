import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePhotoDto } from './dto/create-photo.dto';
import { UpdatePhotoDto } from './dto/update-photo.dto';
import { Photo } from './entities/photo.entity';
import { TouristSpot } from '../tourist-spots/entities/tourist-spot.entity';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: Repository<Photo>,
    @InjectRepository(TouristSpot)
    private readonly touristSpotRepository: Repository<TouristSpot>,
  ) {}

  async create(dto: CreatePhotoDto) {
    const tourist_spot = await this.touristSpotRepository.findOneBy({
      spot_id: dto.spot_id,
    });
    if (!tourist_spot) {
      throw new NotFoundException('Tourist spot not found.');
    }

    const photo = this.photoRepository.create({
      tourist_spot,
      photo_url: dto.photo_url,
      caption: dto.caption,
    });
    return this.photoRepository.save(photo);
  }

  findAll() {
    return this.photoRepository.find({
      relations: { tourist_spot: true },
      order: { upload_date: 'DESC' },
    });
  }

  async findOne(id: number) {
    const photo = await this.photoRepository.findOne({
      where: { photo_id: id },
      relations: { tourist_spot: true },
    });
    if (!photo) {
      throw new NotFoundException('Photo not found.');
    }
    return photo;
  }

  async update(id: number, dto: UpdatePhotoDto) {
    const photo = await this.findOne(id);
    Object.assign(photo, dto);
    return this.photoRepository.save(photo);
  }

  async remove(id: number) {
    const photo = await this.findOne(id);
    await this.photoRepository.remove(photo);
  }
}
