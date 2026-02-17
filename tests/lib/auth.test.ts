import { describe, it, expect, afterEach, vi } from 'vitest';
import { resolveApiKey } from '../../src/lib/auth.js';
import { AuthError } from '../../src/lib/errors.js';

// Mock credentials module so stored credentials don't interfere
vi.mock('../../src/lib/credentials.js', () => ({
  getCredentialApiKey: vi.fn(() => undefined),
}));

describe('resolveApiKey', () => {
  const originalEnv = process.env.PYLON_API_KEY;

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.PYLON_API_KEY = originalEnv;
    } else {
      delete process.env.PYLON_API_KEY;
    }
  });

  it('returns API key from options when provided', () => {
    expect(resolveApiKey({ apiKey: 'flag-key' })).toBe('flag-key');
  });

  it('returns API key from env var when no flag', () => {
    process.env.PYLON_API_KEY = 'env-key';
    expect(resolveApiKey({})).toBe('env-key');
  });

  it('prefers flag over env var', () => {
    process.env.PYLON_API_KEY = 'env-key';
    expect(resolveApiKey({ apiKey: 'flag-key' })).toBe('flag-key');
  });

  it('throws AuthError when no key is available', () => {
    delete process.env.PYLON_API_KEY;
    expect(() => resolveApiKey({})).toThrow(AuthError);
  });
});
