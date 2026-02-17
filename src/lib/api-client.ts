import { ApiError } from './errors.js';
import { resolveApiKey } from './auth.js';

const BASE_URL = 'https://api.usepylon.com';
const MAX_RETRIES = 3;
const VERSION = '0.1.0';

export interface ApiClientOptions {
  apiKey?: string;
}

export interface ApiResponse<T = unknown> {
  data: T;
  request_id?: string;
  has_next_page?: boolean;
  cursor?: string;
}

export class ApiClient {
  private readonly apiKey: string;

  constructor(options: ApiClientOptions) {
    this.apiKey = resolveApiKey(options);
  }

  async get<T = unknown>(
    path: string,
    params?: Record<string, string | number | undefined>
  ): Promise<ApiResponse<T>> {
    const url = new URL(path, BASE_URL);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== '') {
          url.searchParams.set(key, String(value));
        }
      }
    }

    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'User-Agent': `pylon-cli/${VERSION}`,
            Accept: 'application/json',
          },
        });

        if (response.status === 429) {
          if (attempt < MAX_RETRIES) {
            const retryAfter = response.headers.get('Retry-After');
            const delay = retryAfter
              ? parseInt(retryAfter, 10) * 1000
              : Math.pow(2, attempt) * 1000;
            await sleep(delay);
            continue;
          }
          throw new ApiError(429, 'Rate limited. Please try again later.');
        }

        if (response.status === 401) {
          throw new ApiError(
            401,
            'Invalid API key. Check your PYLON_API_KEY or --api-key value.'
          );
        }

        if (response.status === 404) {
          throw new ApiError(404, `Not found: ${path}`);
        }

        if (!response.ok) {
          const body = await response.text().catch(() => '');
          throw new ApiError(
            response.status,
            `API error (${response.status}): ${body || response.statusText}`
          );
        }

        const json = (await response.json()) as Record<string, unknown>;
        return normalizeResponse<T>(json);
      } catch (error) {
        if (error instanceof ApiError) throw error;
        lastError = error as Error;
        if (attempt < MAX_RETRIES) {
          await sleep(Math.pow(2, attempt) * 1000);
          continue;
        }
      }
    }

    throw new ApiError(
      0,
      `Request failed after ${MAX_RETRIES + 1} attempts: ${lastError?.message ?? 'Unknown error'}`
    );
  }
}

function normalizeResponse<T>(json: Record<string, unknown>): ApiResponse<T> {
  const pagination = json.pagination as
    | { cursor?: string; has_next_page?: boolean }
    | undefined;

  return {
    data: (json.data ?? null) as T,
    request_id: json.request_id as string | undefined,
    has_next_page: pagination?.has_next_page ?? false,
    cursor: pagination?.cursor,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createClient(globalOpts: ApiClientOptions): ApiClient {
  return new ApiClient(globalOpts);
}
