import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword } from './password.service';

describe('password.service', () => {
  it('hashes a password to a non-plaintext string', async () => {
    const hash = await hashPassword('SuperSecret123!');
    expect(hash).not.toBe('SuperSecret123!');
    expect(hash.startsWith('$argon2id$')).toBe(true);
  });

  it('verifies a correct password against its hash', async () => {
    const hash = await hashPassword('SuperSecret123!');
    await expect(verifyPassword(hash, 'SuperSecret123!')).resolves.toBe(true);
  });

  it('rejects an incorrect password', async () => {
    const hash = await hashPassword('SuperSecret123!');
    await expect(verifyPassword(hash, 'WrongPassword1!')).resolves.toBe(false);
  });

  it('produces different hashes for the same password (random salt)', async () => {
    const [a, b] = await Promise.all([
      hashPassword('SuperSecret123!'),
      hashPassword('SuperSecret123!'),
    ]);
    expect(a).not.toBe(b);
  });
});
