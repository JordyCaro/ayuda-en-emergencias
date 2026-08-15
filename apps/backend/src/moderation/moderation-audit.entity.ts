import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import type { ModerationAction, ModerationTargetKind } from '@aee/shared-types';

@Entity({ name: 'moderation_audits' })
@Index(['targetKind', 'targetId'])
@Index(['createdAt'])
export class ModerationAuditEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'target_kind', type: 'varchar', length: 16 })
  targetKind!: ModerationTargetKind;

  @Column({ name: 'target_id', type: 'uuid' })
  targetId!: string;

  @Column({ type: 'varchar', length: 16 })
  action!: ModerationAction;

  @Column({ type: 'varchar', length: 64, default: 'moderator' })
  actor!: string;

  @Column({ type: 'text', nullable: true })
  note!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;
}
