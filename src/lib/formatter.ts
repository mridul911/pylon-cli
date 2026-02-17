import Table from 'cli-table3';
import { ApiResponse } from './api-client.js';

export interface FormatOptions {
  format?: 'json' | 'table';
  raw?: boolean;
}

export function output<T>(
  response: ApiResponse<T>,
  globalOpts: FormatOptions
): void {
  const format = globalOpts.format ?? 'json';
  const data = globalOpts.raw ? response : response.data;

  if (data === null || data === undefined) {
    if (format === 'table') {
      console.log('No results.');
    } else {
      console.log(JSON.stringify(globalOpts.raw ? response : [], null, 2));
    }
    return;
  }

  if (format === 'table') {
    printTable(response);
    return;
  }

  console.log(JSON.stringify(data, null, 2));
}

function printTable<T>(response: ApiResponse<T>): void {
  const data = response.data;

  if (Array.isArray(data)) {
    if (data.length === 0) {
      console.log('No results.');
      return;
    }
    const keys = Object.keys(data[0] as Record<string, unknown>);
    const displayKeys = keys.slice(0, 6); // Limit columns for readability

    const table = new Table({ head: displayKeys });
    for (const item of data) {
      const row = displayKeys.map((k) => {
        const val = (item as Record<string, unknown>)[k];
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') return JSON.stringify(val);
        return String(val);
      });
      table.push(row);
    }
    console.log(table.toString());
  } else if (data && typeof data === 'object') {
    const entries = Object.entries(data as Record<string, unknown>);
    const table = new Table();
    for (const [key, val] of entries) {
      const display =
        val === null || val === undefined
          ? ''
          : typeof val === 'object'
            ? JSON.stringify(val)
            : String(val);
      table.push({ [key]: display });
    }
    console.log(table.toString());
  } else {
    console.log(JSON.stringify(data, null, 2));
  }

  if (response.has_next_page && response.cursor) {
    console.log(`\nMore results available. Use --cursor ${response.cursor}`);
  }
}
