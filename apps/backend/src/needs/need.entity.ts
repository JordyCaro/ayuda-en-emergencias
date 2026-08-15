import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { NeedCategory, NeedIntent, NeedStatus, Verification } from '@aee/shared-types';

@Entity({ name: 'needs' })
@Index(['category'])
@Index(['status'])
@Index(['createdAt'])
@Index(['intent'])
@Index(['cityCode'])
export class NeedEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 32 })
  category!: NeedCategory;

  @Column({ type: 'varchar', length: 16, default: 'NEED' })
  intent!: NeedIntent;

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

  @Column({ name: 'city_code', type: 'varchar', length: 8, nullable: true })
  cityCode!: string | null;

  @Column({ type: 'varchar', length: 128, nullable: true })
  municipality!: string | null;

  /** Dígitos internacionales, ej. 573001234567. Nunca se muestra “verificado”. */
  @Column({ name: 'contact_whatsapp', type: 'varchar', length: 32, nullable: true })
  contactWhatsapp!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @Column({ name: 'expires_at', type: 'timestamptz', nullable: true })
  expiresAt!: Date | null;
}
