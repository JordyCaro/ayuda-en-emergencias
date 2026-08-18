import { BadRequestException } from '@nestjs/common';

const MAX_JPEG_BYTES = 180_000;

/** JPEG data URL o base64. Fail-closed si no es JPEG pequeño. */
export function parseJpegPhoto(raw?: string): Buffer | null {
  if (!raw?.trim()) return null;
  const trimmed = raw.trim();
  if (trimmed.startsWith('data:image/') && !/^data:image\/jpeg/i.test(trimmed)) {
    throw new BadRequestException('La foto debe ser JPEG');
  }
  const b64 = trimmed.replace(/^data:image\/jpeg;base64,/i, '').replace(/\s/g, '');
  let buf: Buffer;
  try {
    buf = Buffer.from(b64, 'base64');
  } catch {
    throw new BadRequestException('Foto inválida');
  }
  if (buf.length < 24 || buf.length > MAX_JPEG_BYTES) {
    throw new BadRequestException('La foto es demasiado grande (máx. ~180 KB)');
  }
  if (buf[0] !== 0xff || buf[1] !== 0xd8) {
    throw new BadRequestException('La foto no parece un JPEG');
  }
  return buf;
}
