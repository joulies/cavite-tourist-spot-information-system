
import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, JoinColumn
} from 'typeorm';
import { TouristSpot } from '../../tourist-spots/entities/tourist-spot.entity';

@Entity('Photo')
export class Photo {
  @PrimaryGeneratedColumn()
  photo_id: number;

  @ManyToOne(() => TouristSpot, (spot) => spot.photos, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'spot_id' })
  tourist_spot: TouristSpot;

  @Column({ type: 'varchar', length: 500 })
  photo_url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  caption: string;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  upload_date: Date;
}
