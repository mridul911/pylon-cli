import { AuthError } from './errors.js';
import { getCredentialApiKey } from './credentials.js';

/**
 * Resolve API key with the following precedence:
 * 1. --api-key flag (highest priority)
 * 2. PYLON_API_KEY environment variable
 * 3. Stored credentials (~/.config/pylon/credentials.json)
 */
export function resolveApiKey(options: { apiKey?: string }): string {
  // 1. CLI flag
  if (options.apiKey) return options.apiKey;

  // 2. Environment variable
  if (process.env.PYLON_API_KEY) return process.env.PYLON_API_KEY;

  // 3. Stored credentials
  const stored = getCredentialApiKey();
  if (stored) return stored;

  throw new AuthError();
}
