import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOrigin = process.env.API_CORS_ORIGIN ?? 'http://localhost:4200';
  app.enableCors({ origin: corsOrigin.split(',').map((o) => o.trim()) });
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
    .setDescription('API pública v1 — MVP 001 + Fase 2 (Places / SISPRO)')
    .setVersion('0.2.0')
    .build();
  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, swagger));

  const port = Number(process.env.API_PORT ?? 3000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API http://localhost:${port}/api/v1  · Swagger http://localhost:${port}/api/docs`);
}

void bootstrap();
