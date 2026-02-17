import { ApiClient, ApiResponse } from './api-client.js';

export interface PaginationOptions {
  cursor?: string;
  limit?: string;
  all?: boolean;
}

export async function list<T = unknown>(
  client: ApiClient,
  path: string,
  opts: PaginationOptions & Record<string, string | undefined>
): Promise<ApiResponse<T[]>> {
  const { cursor, limit, all, ...rest } = opts;

  const params: Record<string, string | number | undefined> = { ...rest };
  if (cursor) params.cursor = cursor;
  if (limit) params.limit = parseInt(limit, 10);

  if (!all) {
    return client.get<T[]>(path, params);
  }

  // Auto-paginate: collect all pages
  const allData: T[] = [];
  let nextCursor: string | undefined = cursor;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (nextCursor) params.cursor = nextCursor;
    const response = await client.get<T[]>(path, params);
    const items = Array.isArray(response.data) ? response.data : [response.data];
    allData.push(...items);

    if (!response.has_next_page || !response.cursor) break;
    nextCursor = response.cursor;
  }

  return { data: allData };
}
