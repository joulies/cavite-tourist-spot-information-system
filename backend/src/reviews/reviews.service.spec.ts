import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { Review } from './entities/review.entity';
import { TouristSpot } from '../tourist-spots/entities/tourist-spot.entity';
import { User } from '../users/entities/user.entity';

describe('ReviewsService', () => {
  let service: ReviewsService;
  const reviewRepository = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    save: jest.fn(),
  };
  const touristSpotRepository = { findOneBy: jest.fn() };
  const userRepository = { findOneBy: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: getRepositoryToken(Review), useValue: reviewRepository },
        {
          provide: getRepositoryToken(TouristSpot),
          useValue: touristSpotRepository,
        },
        { provide: getRepositoryToken(User), useValue: userRepository },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a review for the authenticated user', async () => {
    const user = { user_id: 1, email: 'juliana@example.com' };
    const tourist_spot = { spot_id: 2, spot_name: "People's Park" };
    const review = { review_id: 1, user, tourist_spot, rating: 5 };
    userRepository.findOneBy.mockResolvedValue(user);
    touristSpotRepository.findOneBy.mockResolvedValue(tourist_spot);
    reviewRepository.create.mockReturnValue(review);
    reviewRepository.save.mockResolvedValue(review);

    await expect(
      service.create(1, { spot_id: 2, rating: 5, comment: 'Great view.' }),
    ).resolves.toEqual(review);
  });

  it('rejects a review for a missing tourist spot', async () => {
    userRepository.findOneBy.mockResolvedValue({ user_id: 1 });
    touristSpotRepository.findOneBy.mockResolvedValue(null);

    await expect(service.create(1, { spot_id: 404, rating: 5 })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('rejects an update from a different user', async () => {
    reviewRepository.findOne.mockResolvedValue({
      review_id: 1,
      user: { user_id: 1 },
      tourist_spot: { spot_id: 2 },
      rating: 5,
    });

    await expect(service.update(1, 2, { rating: 4 })).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });
});
