import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MunicipalitiesService } from './municipalities.service';
import { Municipality } from './entities/municipality.entity';

describe('MunicipalitiesService', () => {
  let service: MunicipalitiesService;
  const municipalityRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MunicipalitiesService,
        {
          provide: getRepositoryToken(Municipality),
          useValue: municipalityRepository,
        },
      ],
    }).compile();

    service = module.get<MunicipalitiesService>(MunicipalitiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a municipality using Cavite as the default province', async () => {
    const dto = { municipality_name: 'Tagaytay City', postal_code: '4120' };
    const municipality = { municipality_id: 1, ...dto, province: 'Cavite' };
    municipalityRepository.findOneBy.mockResolvedValue(null);
    municipalityRepository.create.mockReturnValue(municipality);
    municipalityRepository.save.mockResolvedValue(municipality);

    await expect(service.create(dto)).resolves.toEqual(municipality);
    expect(municipalityRepository.create).toHaveBeenCalledWith({
      ...dto,
      province: 'Cavite',
    });
  });

  it('rejects duplicate municipality names within the same province', async () => {
    municipalityRepository.findOneBy.mockResolvedValue({
      municipality_id: 1,
      municipality_name: 'Tagaytay City',
      province: 'Cavite',
    });

    await expect(
      service.create({ municipality_name: 'Tagaytay City' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws when a municipality does not exist', async () => {
    municipalityRepository.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(404)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
