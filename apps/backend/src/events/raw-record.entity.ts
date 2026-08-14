import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SourceEntity } from '../sources/source.entity';

@Entity({ name: 'raw_records' })
@Index(['sourceId', 'contentHash'])
export class RawRecordEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'source_id', type: 'varchar', length: 64 })
  sourceId!: string;

  @ManyToOne(() => SourceEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'source_id' })
  source!: SourceEntity;

  @Column({ name: 'source_record_id', type: 'varchar', length: 255, nullable: true })
  sourceRecordId!: string | null;

  @Column({ type: 'jsonb' })
  payload!: Record<string, unknown>;

  @CreateDateColumn({ name: 'retrieved_at', type: 'timestamptz' })
  retrievedAt!: Date;

  @Column({ name: 'content_hash', type: 'varchar', length: 128, nullable: true })
  contentHash!: string | null;
}
