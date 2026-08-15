import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';

/**
 * En production exige OPS_TOKEN (header X-Ops-Token).
 * En desarrollo, si no hay token configurado, permite (DX local).
 */
@Injectable()
export class OpsTokenGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const expected = (this.config.get<string>('OPS_TOKEN') ?? '').trim();
    const isProd = this.config.get<string>('NODE_ENV') === 'production';
    if (!expected) {
      if (isProd) {
        throw new UnauthorizedException('OPS_TOKEN no configurado');
      }
      return true;
    }
    const req = context.switchToHttp().getRequest<Request>();
    const got = String(req.headers['x-ops-token'] ?? '').trim();
    if (!got || got !== expected) {
      throw new UnauthorizedException('Token ops inválido');
    }
    return true;
  }
}
