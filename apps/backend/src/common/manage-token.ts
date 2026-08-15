import { createHash, randomBytes } from 'crypto';

/** Token de gestión (una sola vez al crear). En DB solo guardamos hash. */
export function issueManageToken(): { plain: string; hash: string } {
  const plain = randomBytes(24).toString('hex');
  return { plain, hash: hashManageToken(plain) };
}

export function hashManageToken(plain: string): string {
  return createHash('sha256').update(plain.trim()).digest('hex');
}
