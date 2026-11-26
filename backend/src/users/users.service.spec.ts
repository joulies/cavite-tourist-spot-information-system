import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  const userRepository = {
    findOneBy: jest.fn(),
    createQueryBuilder: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    remove: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('rejects access to a different user record', async () => {
    await expect(service.findOne(1, 2)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });

  it('does not return a password after updating a user', async () => {
    const user = {
      user_id: 1,
      full_name: 'Juliana Marie',
      email: 'juliana@example.com',
      password: 'old-hash',
    };
    userRepository.findOneBy.mockResolvedValue(user);
    userRepository.save.mockResolvedValue({
      ...user,
      contact_number: '09123456789',
    });

    const result = await service.update(1, 1, {
      contact_number: '09123456789',
    });

    expect(result).not.toHaveProperty('password');
  });
});
