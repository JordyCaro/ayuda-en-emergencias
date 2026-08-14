import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import type { PlaceStatus, PlaceType, Verification } from '@aee/shared-types';

@Entity({ name: 'places' })
@Unique(['sourceId', 'sourceRecordId'])
@Index(['type'])
@Index(['status'])
@Index(['lat', 'lng'])
export class PlaceEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 32 })
  type!: PlaceType;

  @Column({ type: 'varchar', length: 512 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ type: 'jsonb' })
  geometry!: { type: 'Point'; coordinates: [number, number] };

  @Column({ type: 'double precision' })
  lat!: number;

  @Column({ type: 'double precision' })
  lng!: number;

  @Column({ name: 'source_id', type: 'varchar', length: 64 })
  sourceId!: string;

  @Column({ name: 'source_record_id', type: 'varchar', length: 255 })
  sourceRecordId!: string;

  @Column({ type: 'varchar', length: 32, default: 'UNVERIFIED' })
  verification!: Verification;

  @Column({ type: 'varchar', length: 16, default: 'ACTIVE' })
  status!: PlaceStatus;

  @Column({ type: 'varchar', length: 8, default: 'CO' })
  country!: string;

  @Column({ type: 'text', nullable: true })
  address!: string | null;

  @Column({ type: 'varchar', length: 128, nullable: true })
  municipality!: string | null;

  @Column({ type: 'varchar', length: 128, nullable: true })
  department!: string | null;

  @Column({ name: 'external_url', type: 'text', nullable: true })
  externalUrl!: string | null;

  @Column({ type: 'jsonb', default: {} })
  properties!: Record<string, unknown>;

  @Column({ name: 'retrieved_at', type: 'timestamptz', nullable: true })
  retrievedAt!: Date | null;

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt!: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
