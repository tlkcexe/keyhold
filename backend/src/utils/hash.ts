import { createHash, randomBytes } from 'crypto';

/**
 * Refresh tokens and password-reset tokens are random opaque strings handed
 * to the client, but we only ever store a SHA-256 hash of them server-side.
 * If the database leaks, the stored hashes are useless to an attacker.
 */
export const generateOpaqueToken = (bytes = 48): string => randomBytes(bytes).toString('hex');

export const hashToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex');
