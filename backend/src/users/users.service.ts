import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
