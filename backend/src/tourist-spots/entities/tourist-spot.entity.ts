
import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, OneToMany, JoinColumn
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Municipality } from '../../municipalities/entities/municipality.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Photo } from '../../photos/entities/photo.entity';

@Entity('Tourist_Spot')
export class TouristSpot {
  @PrimaryGeneratedColumn()
  spot_id: number;

  @Column({ type: 'varchar', length: 150 })
  spot_name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.00 })
  entrance_fee: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  opening_hours: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  contact_number: string;

  @ManyToOne(() => Category, (category) => category.tourist_spots, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Municipality, (municipality) => municipality.tourist_spots, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'municipality_id' })
  municipality: Municipality;

  @OneToMany(() => Review, (review) => review.tourist_spot)
  reviews: Review[];

  @OneToMany(() => Photo, (photo) => photo.tourist_spot)
  photos: Photo[];
}
