
import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn, Check
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TouristSpot } from '../../tourist-spots/entities/tourist-spot.entity';

@Entity('Review')
@Check('CHK_review_rating', 'rating BETWEEN 1 AND 5')
export class Review {
  @PrimaryGeneratedColumn()
  review_id: number;

  @ManyToOne(() => User, (user) => user.reviews, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => TouristSpot, (spot) => spot.reviews, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'spot_id' })
  tourist_spot: TouristSpot;

  @Column({ type: 'tinyint' })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  review_date: Date;
}
