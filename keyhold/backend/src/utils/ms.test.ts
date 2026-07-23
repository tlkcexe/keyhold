import { describe, it, expect } from 'vitest';
import ms from './ms';

describe('ms util', () => {
  it('parses seconds', () => expect(ms('30s')).toBe(30 * 1000));
  it('parses minutes', () => expect(ms('15m')).toBe(15 * 60 * 1000));
  it('parses hours', () => expect(ms('2h')).toBe(2 * 60 * 60 * 1000));
  it('parses days', () => expect(ms('30d')).toBe(30 * 24 * 60 * 60 * 1000));
  it('throws on invalid input', () => expect(() => ms('banana')).toThrow());
});
