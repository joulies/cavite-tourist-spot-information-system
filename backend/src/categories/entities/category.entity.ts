
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TouristSpot } from '../../tourist-spots/entities/tourist-spot.entity';

@Entity('Category')
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  category_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  category_description: string;

  @OneToMany(() => TouristSpot, (spot) => spot.category)
  tourist_spots: TouristSpot[];
}
