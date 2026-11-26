import { Test, TestingModule } from '@nestjs/testing';
import { TouristSpotsController } from './tourist-spots.controller';
import { TouristSpotsService } from './tourist-spots.service';

describe('TouristSpotsController', () => {
  let controller: TouristSpotsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TouristSpotsController],
      providers: [TouristSpotsService],
    }).compile();

    controller = module.get<TouristSpotsController>(TouristSpotsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
