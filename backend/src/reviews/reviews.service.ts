import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { TouristSpot } from '../tourist-spots/entities/tourist-spot.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(TouristSpot)
    private readonly touristSpotRepository: Repository<TouristSpot>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(user_id: number, dto: CreateReviewDto) {
    const [user, tourist_spot] = await Promise.all([
      this.userRepository.findOneBy({ user_id }),
      this.touristSpotRepository.findOneBy({ spot_id: dto.spot_id }),
    ]);

    if (!user) {
      throw new NotFoundException('User not found.');
    }
    if (!tourist_spot) {
      throw new NotFoundException('Tourist spot not found.');
    }

    const review = this.reviewRepository.create({
      user,
      tourist_spot,
      rating: dto.rating,
      comment: dto.comment,
    });
    return this.reviewRepository.save(review);
  }

  findAll() {
    return this.reviewRepository.find({
      relations: { user: true, tourist_spot: true },
      order: { review_date: 'DESC' },
    });
  }

  async findOne(id: number) {
    const review = await this.reviewRepository.findOne({
      where: { review_id: id },
      relations: { user: true, tourist_spot: true },
    });
    if (!review) {
      throw new NotFoundException('Review not found.');
    }
    return review;
  }

  async update(id: number, user_id: number, dto: UpdateReviewDto) {
    const review = await this.findOne(id);
    this.assertOwner(review, user_id);
    Object.assign(review, dto);
    return this.reviewRepository.save(review);
  }

  async remove(id: number, user_id: number) {
    const review = await this.findOne(id);
    this.assertOwner(review, user_id);
    await this.reviewRepository.remove(review);
  }

  private assertOwner(review: Review, user_id: number) {
    if (review.user.user_id !== user_id) {
      throw new ForbiddenException('You can only modify your own reviews.');
    }
  }
}
