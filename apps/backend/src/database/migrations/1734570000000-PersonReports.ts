import { MigrationInterface, QueryRunner } from 'typeorm';

export class PersonReports1734570000000 implements MigrationInterface {
  name = 'PersonReports1734570000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS person_reports (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        kind varchar(16) NOT NULL,
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
        expires_at timestamptz NULL,
        photo_jpeg bytea NULL,
        has_photo boolean NOT NULL DEFAULT false
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS person_reports;`);
  }
}
