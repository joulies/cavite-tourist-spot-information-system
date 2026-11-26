import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { TouristSpotsService } from './tourist-spots.service';
import { TouristSpot } from './entities/tourist-spot.entity';
import { Category } from '../categories/entities/category.entity';
import { Municipality } from '../municipalities/entities/municipality.entity';

describe('TouristSpotsService', () => {
  let service: TouristSpotsService;
  const touristSpotRepository = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    save: jest.fn(),
  };
  const categoryRepository = { findOneBy: jest.fn() };
  const municipalityRepository = { findOneBy: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TouristSpotsService,
        {
          provide: getRepositoryToken(TouristSpot),
          useValue: touristSpotRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: categoryRepository,
        },
        {
          provide: getRepositoryToken(Municipality),
          useValue: municipalityRepository,
        },
      ],
    }).compile();

    service = module.get<TouristSpotsService>(TouristSpotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a tourist spot with an existing category and municipality', async () => {
    const dto = {
      spot_name: "People's Park in the Sky",
      description: 'A scenic park in Tagaytay.',
      address: 'Tagaytay City, Cavite',
      entrance_fee: 30,
      category_id: 1,
      municipality_id: 2,
    };
    const category = { category_id: 1, category_name: 'Historical' };
    const municipality = { municipality_id: 2, municipality_name: 'Tagaytay City' };
    const touristSpot = { spot_id: 1, ...dto, category, municipality };
    categoryRepository.findOneBy.mockResolvedValue(category);
    municipalityRepository.findOneBy.mockResolvedValue(municipality);
    touristSpotRepository.create.mockReturnValue(touristSpot);
    touristSpotRepository.save.mockResolvedValue(touristSpot);

    await expect(service.create(dto)).resolves.toEqual(touristSpot);
    expect(touristSpotRepository.create).toHaveBeenCalledWith({
      spot_name: dto.spot_name,
      description: dto.description,
      address: dto.address,
      entrance_fee: dto.entrance_fee,
      category,
      municipality,
    });
  });

  it('rejects a tourist spot with a missing category', async () => {
    categoryRepository.findOneBy.mockResolvedValue(null);
    municipalityRepository.findOneBy.mockResolvedValue({ municipality_id: 2 });

    await expect(
      service.create({
        spot_name: 'Example',
        description: 'Description',
        address: 'Cavite',
        category_id: 404,
        municipality_id: 2,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
