import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  const corsOrigin = process.env.API_CORS_ORIGIN ?? 'http://localhost:4200';
  app.enableCors({ origin: corsOrigin.split(',').map((o) => o.trim()) });
  app.use(json({ limit: '400kb' }));
  app.use(urlencoded({ extended: true, limit: '400kb' }));
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swagger = new DocumentBuilder()
    .setTitle('Ayuda en Emergencias API')
    .setDescription(
      'API pública v1 — capas de emergencia (avisos, lugares, mascotas, connectors).',
    )
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('api/docs', app, document);

  if (process.env.OPENAPI_EXPORT === 'true') {
    const out =
      process.env.OPENAPI_EXPORT_PATH ??
      join(process.cwd(), '../../specs/009-produccion/contracts/openapi-v1.json');
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, JSON.stringify(document, null, 2), 'utf8');
    // eslint-disable-next-line no-console
    console.log(`OpenAPI exported → ${out}`);
  }

  const port = Number(process.env.PORT ?? process.env.API_PORT ?? 3000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API http://localhost:${port}/api/v1  · Swagger http://localhost:${port}/api/docs`);
}

void bootstrap();
