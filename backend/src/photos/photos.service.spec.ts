import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { Photo } from './entities/photo.entity';
import { TouristSpot } from '../tourist-spots/entities/tourist-spot.entity';

describe('PhotosService', () => {
  let service: PhotosService;
  const photoRepository = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    save: jest.fn(),
  };
  const touristSpotRepository = { findOneBy: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PhotosService,
        { provide: getRepositoryToken(Photo), useValue: photoRepository },
        {
          provide: getRepositoryToken(TouristSpot),
          useValue: touristSpotRepository,
        },
      ],
    }).compile();

    service = module.get<PhotosService>(PhotosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a photo for an existing tourist spot', async () => {
    const tourist_spot = { spot_id: 1, spot_name: "People's Park" };
    const dto = {
      spot_id: 1,
      photo_url: 'https://example.com/peoples-park.jpg',
      caption: 'View from the park',
    };
    const photo = { photo_id: 1, tourist_spot, ...dto };
    touristSpotRepository.findOneBy.mockResolvedValue(tourist_spot);
    photoRepository.create.mockReturnValue(photo);
    photoRepository.save.mockResolvedValue(photo);

    await expect(service.create(dto)).resolves.toEqual(photo);
    expect(photoRepository.create).toHaveBeenCalledWith({
      tourist_spot,
      photo_url: dto.photo_url,
      caption: dto.caption,
    });
  });

  it('rejects a photo for a missing tourist spot', async () => {
    touristSpotRepository.findOneBy.mockResolvedValue(null);

    await expect(
      service.create({
        spot_id: 404,
        photo_url: 'https://example.com/photo.jpg',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
