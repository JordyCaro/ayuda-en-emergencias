import dataSource from './data-source';

async function main(): Promise<void> {
  await dataSource.initialize();
  const ran = await dataSource.runMigrations();
  // eslint-disable-next-line no-console
  console.log(`Migrations applied: ${ran.map((m) => m.name).join(', ') || '(none)'}`);
  await dataSource.destroy();
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
