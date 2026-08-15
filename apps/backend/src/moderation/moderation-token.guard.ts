import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

@Injectable()
export class ModerationTokenGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const expected = (this.config.get<string>('MODERATION_TOKEN') ?? '').trim();
    if (!expected) {
      throw new UnauthorizedException(
        'MODERATION_TOKEN no configurado en el servidor',
      );
    }
    const req = context.switchToHttp().getRequest<Request>();
    const got = String(req.headers['x-moderation-token'] ?? '').trim();
    if (!got || got !== expected) {
      throw new UnauthorizedException('Token de moderación inválido');
    }
    return true;
  }
}
