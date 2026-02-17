import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiClient, ApiResponse } from '../../src/lib/api-client.js';

describe('ApiClient', () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  function mockFetch(response: Partial<Response> & { json?: () => Promise<unknown> }) {
    const fn = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      json: async () => ({ data: [] }),
      text: async () => '',
      ...response,
    });
    globalThis.fetch = fn;
    return fn;
  }

  it('sends GET request with auth header', async () => {
    const fetchMock = mockFetch({
      json: async () => ({ data: { id: '1', name: 'Test' } }),
    });

    const client = new ApiClient({ apiKey: 'test-key' });
    const result = await client.get('/accounts');

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('https://api.usepylon.com/accounts');
    expect(init.method).toBe('GET');
    expect(init.headers.Authorization).toBe('Bearer test-key');
    expect(init.headers['User-Agent']).toMatch(/^pylon-cli\//);
    expect(result.data).toEqual({ id: '1', name: 'Test' });
  });

  it('appends query params', async () => {
    const fetchMock = mockFetch({
      json: async () => ({ data: [] }),
    });

    const client = new ApiClient({ apiKey: 'test-key' });
    await client.get('/accounts', { limit: 10, cursor: 'abc' });

    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain('limit=10');
    expect(url).toContain('cursor=abc');
  });

  it('skips undefined params', async () => {
    const fetchMock = mockFetch({
      json: async () => ({ data: [] }),
    });

    const client = new ApiClient({ apiKey: 'test-key' });
    await client.get('/accounts', { limit: 10, cursor: undefined });

    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain('limit=10');
    expect(url).not.toContain('cursor');
  });

  it('throws ApiError on 401', async () => {
    mockFetch({ ok: false, status: 401, statusText: 'Unauthorized' });

    const client = new ApiClient({ apiKey: 'bad-key' });
    await expect(client.get('/me')).rejects.toThrow('Invalid API key');
  });

  it('throws ApiError on 404', async () => {
    mockFetch({ ok: false, status: 404, statusText: 'Not Found' });

    const client = new ApiClient({ apiKey: 'test-key' });
    await expect(client.get('/accounts/missing')).rejects.toThrow('Not found');
  });
});
