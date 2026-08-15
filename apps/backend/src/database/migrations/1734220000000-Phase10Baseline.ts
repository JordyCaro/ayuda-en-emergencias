import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Baseline Fase 10: columnas de cierre comunitario + auditoría.
 * Idempotente (IF NOT EXISTS) para DBs que ya usaron synchronize.
 */
export class Phase10Baseline1734220000000 implements MigrationInterface {
  name = 'Phase10Baseline1734220000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS moderation_audits (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        target_kind varchar(16) NOT NULL,
        target_id uuid NOT NULL,
        action varchar(16) NOT NULL,
        actor varchar(64) NOT NULL DEFAULT 'moderator',
        note text NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      );
    `);
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS pet_reports (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        kind varchar(16) NOT NULL,
        species varchar(16) NOT NULL,
        description text NOT NULL,
        geometry jsonb NOT NULL,
        lat double precision NOT NULL,
        lng double precision NOT NULL,
        source varchar(16) NOT NULL DEFAULT 'USER',
        verification varchar(32) NOT NULL DEFAULT 'UNVERIFIED',
        status varchar(16) NOT NULL DEFAULT 'OPEN',
        country varchar(8) NOT NULL DEFAULT 'CO',
        city_code varchar(8) NULL,
        municipality varchar(128) NULL,
        contact_whatsapp varchar(32) NULL,
        manage_token_hash varchar(64) NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        expires_at timestamptz NULL
      );
    `);

    await queryRunner.query(
      `ALTER TABLE needs ADD COLUMN IF NOT EXISTS manage_token_hash varchar(64) NULL;`,
    );
    await queryRunner.query(
      `ALTER TABLE places ADD COLUMN IF NOT EXISTS manage_token_hash varchar(64) NULL;`,
    );
    await queryRunner.query(
      `ALTER TABLE pet_reports ADD COLUMN IF NOT EXISTS manage_token_hash varchar(64) NULL;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE needs DROP COLUMN IF EXISTS manage_token_hash;`,
    );
    await queryRunner.query(
      `ALTER TABLE places DROP COLUMN IF EXISTS manage_token_hash;`,
    );
    await queryRunner.query(
      `ALTER TABLE pet_reports DROP COLUMN IF EXISTS manage_token_hash;`,
    );
  }
}
