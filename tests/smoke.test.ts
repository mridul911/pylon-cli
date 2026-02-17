import { describe, it, expect } from 'vitest';
import { execFileSync } from 'child_process';
import { resolve } from 'path';

const BIN = resolve(import.meta.dirname, '..', 'bin', 'pylon.js');

// Use a non-existent config home to prevent stored credentials from interfering
const cleanEnv = {
  ...process.env,
  PYLON_API_KEY: undefined,
  XDG_CONFIG_HOME: '/tmp/pylon-cli-test-nonexistent',
};

function run(...args: string[]): string {
  return execFileSync('node', [BIN, ...args], {
    encoding: 'utf-8',
    env: cleanEnv,
    timeout: 10000,
  }).trim();
}

function runWithStatus(...args: string[]): { stdout: string; status: number } {
  try {
    const stdout = execFileSync('node', [BIN, ...args], {
      encoding: 'utf-8',
      env: cleanEnv,
      timeout: 10000,
    }).trim();
    return { stdout, status: 0 };
  } catch (error: unknown) {
    const err = error as { status: number; stderr?: Buffer | string };
    return {
      stdout: '',
      status: err.status ?? 1,
    };
  }
}

describe('smoke tests', () => {
  it('shows help', () => {
    const output = run('--help');
    expect(output).toContain('Read-only CLI for the Pylon API');
    expect(output).toContain('usage');
    expect(output).toContain('accounts');
  });

  it('shows version', () => {
    const output = run('--version');
    expect(output).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('shows usage command list', () => {
    const output = run('usage');
    expect(output).toContain('pylon me');
    expect(output).toContain('pylon accounts list');
    expect(output).toContain('pylon issues list');
    expect(output).toContain('pylon kb list');
    expect(output).toContain('Global options:');
  });

  it('shows error when no API key for accounts list', () => {
    const result = runWithStatus('accounts', 'list');
    expect(result.status).not.toBe(0);
  });
});
