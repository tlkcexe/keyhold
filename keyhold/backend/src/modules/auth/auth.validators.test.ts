import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from './auth.validators';

describe('registerSchema', () => {
  it('accepts a valid registration payload', () => {
    const result = registerSchema.safeParse({
      body: { name: 'Ada Lovelace', email: 'ada@example.com', password: 'SuperSecret123!' },
    });
    expect(result.success).toBe(true);
  });

  it('rejects a weak password missing a special character', () => {
    const result = registerSchema.safeParse({
      body: { name: 'Ada Lovelace', email: 'ada@example.com', password: 'SuperSecret123' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid email', () => {
    const result = registerSchema.safeParse({
      body: { name: 'Ada Lovelace', email: 'not-an-email', password: 'SuperSecret123!' },
    });
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('rejects an empty password', () => {
    const result = loginSchema.safeParse({ body: { email: 'a@b.com', password: '' } });
    expect(result.success).toBe(false);
  });
});
