import { describe, it, expect, vi, afterEach } from 'vitest';
import { output } from '../../src/lib/formatter.js';

describe('formatter', () => {
  const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

  afterEach(() => {
    consoleSpy.mockClear();
  });

  it('outputs JSON by default', () => {
    output({ data: { id: '1', name: 'Test' } }, {});
    expect(consoleSpy).toHaveBeenCalledOnce();
    const parsed = JSON.parse(consoleSpy.mock.calls[0][0]);
    expect(parsed).toEqual({ id: '1', name: 'Test' });
  });

  it('outputs raw envelope when --raw is set', () => {
    const response = { data: { id: '1' }, request_id: 'req_123' };
    output(response, { raw: true });
    const parsed = JSON.parse(consoleSpy.mock.calls[0][0]);
    expect(parsed.request_id).toBe('req_123');
    expect(parsed.data).toEqual({ id: '1' });
  });

  it('outputs table format for arrays', () => {
    output({ data: [{ id: '1', name: 'A' }, { id: '2', name: 'B' }] }, { format: 'table' });
    expect(consoleSpy).toHaveBeenCalled();
    const tableOutput = consoleSpy.mock.calls[0][0];
    expect(tableOutput).toContain('id');
    expect(tableOutput).toContain('name');
  });

  it('outputs table format for single objects', () => {
    output({ data: { id: '1', name: 'Test' } }, { format: 'table' });
    expect(consoleSpy).toHaveBeenCalled();
    const tableOutput = consoleSpy.mock.calls[0][0];
    expect(tableOutput).toContain('id');
  });

  it('handles empty arrays in table format', () => {
    output({ data: [] }, { format: 'table' });
    expect(consoleSpy).toHaveBeenCalledWith('No results.');
  });
});
