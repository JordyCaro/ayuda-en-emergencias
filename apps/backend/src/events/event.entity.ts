import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import type { EventType, Verification } from '@aee/shared-types';
import { SourceEntity } from '../sources/source.entity';
import { RawRecordEntity } from './raw-record.entity';

@Entity({ name: 'events' })
@Unique(['sourceId', 'sourceRecordId'])
@Index(['type'])
@Index(['retrievedAt'])
export class EventEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 32 })
  type!: EventType;

  @Column({ name: 'original_type', type: 'varchar', length: 128, nullable: true })
  originalType!: string | null;

  @Column({ name: 'source_id', type: 'varchar', length: 64 })
  sourceId!: string;

  @ManyToOne(() => SourceEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'source_id' })
  source!: SourceEntity;

  @Column({ name: 'source_record_id', type: 'varchar', length: 255 })
  sourceRecordId!: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  title!: string | null;

  @Column({ type: 'text', nullable: true })
  summary!: string | null;

  /** GeoJSON geometry stored as jsonb for MVP (Point preferred). */
  @Column({ type: 'jsonb', nullable: true })
  geometry!: Record<string, unknown> | null;

  @Column({ type: 'double precision', nullable: true })
  lat!: number | null;

  @Column({ type: 'double precision', nullable: true })
  lng!: number | null;

  @Column({ name: 'observed_at', type: 'timestamptz', nullable: true })
  observedAt!: Date | null;

  @Column({ name: 'published_at', type: 'timestamptz', nullable: true })
  publishedAt!: Date | null;

  @Column({ name: 'retrieved_at', type: 'timestamptz' })
  retrievedAt!: Date;

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt!: Date | null;

  @Column({ type: 'varchar', length: 32 })
  verification!: Verification;

  @Column({ name: 'raw_record_id', type: 'uuid', nullable: true })
  rawRecordId!: string | null;

  @ManyToOne(() => RawRecordEntity, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'raw_record_id' })
  rawRecord!: RawRecordEntity | null;

  @Column({ type: 'jsonb', default: {} })
  properties!: Record<string, unknown>;

  @Column({ name: 'last_seen_at', type: 'timestamptz' })
  lastSeenAt!: Date;
}
