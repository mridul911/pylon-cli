import { describe, it, expect, vi, afterEach } from 'vitest';
import { list } from '../../src/lib/pagination.js';
import { ApiClient } from '../../src/lib/api-client.js';

describe('pagination', () => {
  function mockClient(responses: Array<{ data: unknown[]; has_next_page?: boolean; cursor?: string }>) {
    let callIndex = 0;
    return {
      get: vi.fn().mockImplementation(async () => {
        return responses[callIndex++] ?? responses[responses.length - 1];
      }),
    } as unknown as ApiClient;
  }

  it('fetches single page by default', async () => {
    const client = mockClient([{ data: [{ id: '1' }, { id: '2' }], has_next_page: true, cursor: 'abc' }]);
    const result = await list(client, '/tags', {});
    expect(result.data).toHaveLength(2);
    expect(client.get).toHaveBeenCalledOnce();
  });

  it('auto-paginates with --all flag', async () => {
    const client = mockClient([
      { data: [{ id: '1' }], has_next_page: true, cursor: 'page2' },
      { data: [{ id: '2' }], has_next_page: false },
    ]);
    const result = await list(client, '/tags', { all: true });
    expect(result.data).toHaveLength(2);
    expect(client.get).toHaveBeenCalledTimes(2);
  });

  it('passes cursor and limit to client', async () => {
    const client = mockClient([{ data: [] }]);
    await list(client, '/tags', { cursor: 'abc', limit: '10' });
    expect(client.get).toHaveBeenCalledWith('/tags', expect.objectContaining({
      cursor: 'abc',
      limit: 10,
    }));
  });
});
