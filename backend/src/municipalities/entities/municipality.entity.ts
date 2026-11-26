
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TouristSpot } from '../../tourist-spots/entities/tourist-spot.entity';

@Entity('Municipality')
export class Municipality {
  @PrimaryGeneratedColumn()
  municipality_id: number;

  @Column({ type: 'varchar', length: 100 })
  municipality_name: string;

  @Column({ type: 'varchar', length: 100 })
  province: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  postal_code: string;

  @OneToMany(() => TouristSpot, (spot) => spot.municipality)
  tourist_spots: TouristSpot[];
}
