import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Category } from './entities/category.entity';
import { CategoriesService } from './categories.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  const categoryRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: categoryRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a category when its name is unique', async () => {
    const dto = {
      category_name: 'Historical Sites',
      category_description: 'Historical destinations.',
    };
    const category = { category_id: 1, ...dto };
    categoryRepository.findOneBy.mockResolvedValue(null);
    categoryRepository.create.mockReturnValue(category);
    categoryRepository.save.mockResolvedValue(category);

    await expect(service.create(dto)).resolves.toEqual(category);
    expect(categoryRepository.save).toHaveBeenCalledWith(category);
  });

  it('rejects duplicate category names', async () => {
    categoryRepository.findOneBy.mockResolvedValue({
      category_id: 1,
      category_name: 'Historical Sites',
    });

    await expect(
      service.create({ category_name: 'Historical Sites' }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(categoryRepository.create).not.toHaveBeenCalled();
  });

  it('throws when a category does not exist', async () => {
    categoryRepository.findOneBy.mockResolvedValue(null);

    await expect(service.findOne(404)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
