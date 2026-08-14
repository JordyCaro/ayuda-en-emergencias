import {
  Column,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import type {
  IntegrationStatus,
  SourceType,
  TrustTier,
  UpdateFrequency,
} from '@aee/shared-types';

@Entity({ name: 'sources' })
export class SourceEntity {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 32 })
  type!: SourceType;

  @Column({ type: 'smallint' })
  tier!: TrustTier;

  @Column({ type: 'varchar', length: 8, default: 'CO' })
  country!: string;

  @Column({ type: 'text', nullable: true })
  url!: string | null;

  @Column({ name: 'api_url', type: 'text', nullable: true })
  apiUrl!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  license!: string | null;

  @Column({ name: 'attribution_required', type: 'boolean', default: true })
  attributionRequired!: boolean;

  @Column({ name: 'redistribution_allowed', type: 'boolean', nullable: true })
  redistributionAllowed!: boolean | null;

  @Column({ name: 'update_frequency', type: 'varchar', length: 32, default: 'UNKNOWN' })
  updateFrequency!: UpdateFrequency;

  @Column({ name: 'integration_status', type: 'varchar', length: 32 })
  integrationStatus!: IntegrationStatus;

  @Column({ name: 'last_successful_fetch', type: 'timestamptz', nullable: true })
  lastSuccessfulFetch!: Date | null;

  @Column({ name: 'last_error', type: 'text', nullable: true })
  lastError!: string | null;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
