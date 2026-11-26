import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

export interface RegisterUserInput {
  full_name: string;
  email: string;
  password: string;
  contact_number?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(input: RegisterUserInput) {
    const existing = await this.userRepository.findOneBy({ email: input.email });
    if (existing) {
      throw new ConflictException('Email is already registered.');
    }

    const password = await bcrypt.hash(input.password, 12);
    const user = this.userRepository.create({
      full_name: input.full_name,
      email: input.email,
      password,
      contact_number: input.contact_number,
    });
    return this.userRepository.save(user);
  }

  findByEmailWithPassword(email: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findProfile(user_id: number) {
    const user = await this.userRepository.findOneBy({ user_id });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  async create(dto: CreateUserDto) {
    const user = await this.register(dto);
    return this.toSafeUser(user);
  }

  findAll() {
    return this.userRepository.find({
      order: { full_name: 'ASC' },
    });
  }

  async findOne(id: number, requesting_user_id: number) {
    this.assertOwner(id, requesting_user_id);
    return this.findProfile(id);
  }

  async update(
    id: number,
    requesting_user_id: number,
    dto: UpdateUserDto,
  ) {
    this.assertOwner(id, requesting_user_id);
    const user = await this.findProfile(id);

    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findOneBy({ email: dto.email });
      if (existing) {
        throw new ConflictException('Email is already registered.');
      }
    }

    const { password, ...profileDetails } = dto;
    Object.assign(user, profileDetails);
    if (password) {
      user.password = await bcrypt.hash(password, 12);
    }

    const updatedUser = await this.userRepository.save(user);
    return this.toSafeUser(updatedUser);
  }

  async remove(id: number, requesting_user_id: number) {
    this.assertOwner(id, requesting_user_id);
    const user = await this.findProfile(id);
    await this.userRepository.remove(user);
  }

  private assertOwner(id: number, requesting_user_id: number) {
    if (id !== requesting_user_id) {
      throw new ForbiddenException('You can only access your own user record.');
    }
  }

  private toSafeUser(user: User) {
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
