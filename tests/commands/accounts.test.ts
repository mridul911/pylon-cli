import { describe, it, expect, vi, afterEach } from 'vitest';
import { execFileSync } from 'child_process';
import { resolve } from 'path';

const BIN = resolve(import.meta.dirname, '..', '..', 'bin', 'pylon.js');

describe('accounts command', () => {
  it('shows accounts help', () => {
    const output = execFileSync('node', [BIN, 'accounts', '--help'], {
      encoding: 'utf-8',
      timeout: 10000,
    }).trim();
    expect(output).toContain('list');
    expect(output).toContain('get');
  });

  it('shows accounts list help', () => {
    const output = execFileSync('node', [BIN, 'accounts', 'list', '--help'], {
      encoding: 'utf-8',
      timeout: 10000,
    }).trim();
    expect(output).toContain('--cursor');
    expect(output).toContain('--limit');
    expect(output).toContain('--all');
  });
});
