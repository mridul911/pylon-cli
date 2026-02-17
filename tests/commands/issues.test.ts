import { describe, it, expect } from 'vitest';
import { execFileSync } from 'child_process';
import { resolve } from 'path';

const BIN = resolve(import.meta.dirname, '..', '..', 'bin', 'pylon.js');

describe('issues command', () => {
  it('shows issues help with subcommands', () => {
    const output = execFileSync('node', [BIN, 'issues', '--help'], {
      encoding: 'utf-8',
      timeout: 10000,
    }).trim();
    expect(output).toContain('list');
    expect(output).toContain('get');
    expect(output).toContain('followers');
    expect(output).toContain('messages');
    expect(output).toContain('threads');
  });

  it('requires --start and --end for issues list', () => {
    try {
      execFileSync('node', [BIN, 'issues', 'list', '--api-key', 'test'], {
        encoding: 'utf-8',
        timeout: 10000,
        env: { ...process.env, PYLON_API_KEY: undefined },
      });
      expect.unreachable('should have thrown');
    } catch (error: unknown) {
      const err = error as { stderr: Buffer | string };
      const stderr = String(err.stderr ?? '');
      expect(stderr).toContain('--start');
    }
  });
});
