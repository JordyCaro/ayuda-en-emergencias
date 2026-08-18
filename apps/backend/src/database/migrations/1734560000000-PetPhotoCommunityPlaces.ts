import { MigrationInterface, QueryRunner } from 'typeorm';

/** Foto JPEG en mascotas + acopios comunitarios sin caducidad. */
export class PetPhotoCommunityPlaces1734560000000 implements MigrationInterface {
  name = 'PetPhotoCommunityPlaces1734560000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE pet_reports ADD COLUMN IF NOT EXISTS photo_jpeg bytea NULL;`,
    );
    await queryRunner.query(
      `ALTER TABLE pet_reports ADD COLUMN IF NOT EXISTS has_photo boolean NOT NULL DEFAULT false;`,
    );
    await queryRunner.query(`
      UPDATE places
      SET
        expires_at = NULL,
        status = CASE WHEN status = 'EXPIRED' THEN 'ACTIVE' ELSE status END
      WHERE source_id = 'community'
        AND status IN ('ACTIVE', 'EXPIRED');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE pet_reports DROP COLUMN IF EXISTS photo_jpeg;`,
    );
    await queryRunner.query(
      `ALTER TABLE pet_reports DROP COLUMN IF EXISTS has_photo;`,
    );
  }
}
