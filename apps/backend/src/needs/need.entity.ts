import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { NeedCategory, NeedStatus, Verification } from '@aee/shared-types';

@Entity({ name: 'needs' })
@Index(['category'])
@Index(['status'])
@Index(['createdAt'])
export class NeedEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 32 })
  category!: NeedCategory;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'jsonb' })
  geometry!: { type: 'Point'; coordinates: [number, number] };

  @Column({ type: 'double precision' })
  lat!: number;

  @Column({ type: 'double precision' })
  lng!: number;

  @Column({ type: 'varchar', length: 16, default: 'USER' })
  source!: 'USER';

  @Column({ type: 'varchar', length: 32, default: 'UNVERIFIED' })
  verification!: Verification;

  @Column({ type: 'varchar', length: 16, default: 'OPEN' })
  status!: NeedStatus;

  @Column({ type: 'varchar', length: 8, default: 'CO' })
  country!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt!: Date | null;
}
