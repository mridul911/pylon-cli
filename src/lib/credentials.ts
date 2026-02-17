import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';

export interface Credentials {
  default?: string;
  workspaces: Record<string, string>;
}

/**
 * Get the path to the credentials file.
 * Follows XDG Base Directory Specification on Unix-like systems,
 * and uses APPDATA on Windows.
 */
export function getCredentialsPath(): string {
  if (process.platform === 'win32') {
    const appData = process.env.APPDATA;
    if (appData) {
      return join(appData, 'pylon', 'credentials.json');
    }
  }

  const xdgConfigHome = process.env.XDG_CONFIG_HOME;
  const home = homedir();

  if (xdgConfigHome) {
    return join(xdgConfigHome, 'pylon', 'credentials.json');
  }

  return join(home, '.config', 'pylon', 'credentials.json');
}

/**
 * Load credentials from disk.
 */
export function loadCredentials(): Credentials {
  const path = getCredentialsPath();

  try {
    const content = readFileSync(path, 'utf-8');
    const parsed = JSON.parse(content);
    return {
      default: parsed.default,
      workspaces: parsed.workspaces ?? {},
    };
  } catch {
    return { workspaces: {} };
  }
}

/**
 * Save credentials to disk.
 */
export function saveCredentials(creds: Credentials): void {
  const path = getCredentialsPath();
  const dir = dirname(path);

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true, mode: 0o700 });
  }

  writeFileSync(path, JSON.stringify(creds, null, 2) + '\n', {
    encoding: 'utf-8',
    mode: 0o600,
  });
}

/**
 * Add or update a credential.
 * If this is the first workspace, it becomes the default.
 */
export function addCredential(workspace: string, apiKey: string): void {
  const creds = loadCredentials();

  if (Object.keys(creds.workspaces).length === 0) {
    creds.default = workspace;
  }

  creds.workspaces[workspace] = apiKey;
  saveCredentials(creds);
}

/**
 * Remove a credential.
 * If removing the default, reassign to another workspace or clear.
 */
export function removeCredential(workspace: string): void {
  const creds = loadCredentials();
  delete creds.workspaces[workspace];

  if (creds.default === workspace) {
    const remaining = Object.keys(creds.workspaces);
    creds.default = remaining.length > 0 ? remaining[0] : undefined;
  }

  saveCredentials(creds);
}

/**
 * Get the API key for a workspace, or the default workspace.
 */
export function getCredentialApiKey(workspace?: string): string | undefined {
  const creds = loadCredentials();

  if (workspace) {
    return creds.workspaces[workspace];
  }

  if (creds.default) {
    return creds.workspaces[creds.default];
  }

  return undefined;
}

/**
 * Get the default workspace name.
 */
export function getDefaultWorkspace(): string | undefined {
  return loadCredentials().default;
}

/**
 * Get all configured workspace names.
 */
export function getWorkspaces(): string[] {
  return Object.keys(loadCredentials().workspaces);
}

/**
 * Set the default workspace.
 */
export function setDefaultWorkspace(workspace: string): void {
  const creds = loadCredentials();
  if (!creds.workspaces[workspace]) {
    throw new Error(`Workspace "${workspace}" not found in credentials`);
  }
  creds.default = workspace;
  saveCredentials(creds);
}
