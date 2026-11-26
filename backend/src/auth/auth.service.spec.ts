import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;
  const usersService = {
    register: jest.fn(),
    findByEmailWithPassword: jest.fn(),
  };
  const jwtService = { signAsync: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('registers without returning a password', async () => {
    usersService.register.mockResolvedValue({
      user_id: 1,
      full_name: 'Juliana Marie',
      email: 'juliana@example.com',
      password: 'hashed-password',
    });

    const result = await service.register({
      full_name: 'Juliana Marie',
      email: 'juliana@example.com',
      password: 'password123',
    });

    expect(result.user).not.toHaveProperty('password');
  });

  it('rejects incorrect login credentials', async () => {
    usersService.findByEmailWithPassword.mockResolvedValue(undefined);

    await expect(
      service.login({ email: 'juliana@example.com', password: 'password123' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
