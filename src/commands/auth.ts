import { Command } from 'commander';
import { createClient } from '../lib/api-client.js';
import { handleError } from '../lib/errors.js';
import {
  addCredential,
  removeCredential,
  getWorkspaces,
  getDefaultWorkspace,
  getCredentialApiKey,
  getCredentialsPath,
  setDefaultWorkspace,
} from '../lib/credentials.js';
import { resolveApiKey } from '../lib/auth.js';

export function register(program: Command): void {
  const cmd = program
    .command('auth')
    .description('Manage Pylon authentication');

  cmd
    .command('login')
    .description('Add a workspace credential')
    .requiredOption('--key <key>', 'Pylon API key')
    .option('--name <name>', 'Workspace name (defaults to org name from API)')
    .action(async (opts) => {
      try {
        // Validate the key by calling /me
        const client = createClient({ apiKey: opts.key });
        const response = await client.get<{ id: string; name: string }>('/me');
        const org = response.data;

        const workspace = opts.name ?? org.name.toLowerCase().replace(/[^a-z0-9-]/g, '-');

        addCredential(workspace, opts.key);

        const workspaces = getWorkspaces();
        const isDefault = workspaces.length === 1;

        console.log(`Logged in to workspace: ${org.name} (${workspace})`);
        if (isDefault) {
          console.log('  Set as default workspace');
        }

        if (process.env.PYLON_API_KEY) {
          console.log('');
          console.log('Warning: PYLON_API_KEY environment variable is set.');
          console.log('It takes precedence over stored credentials.');
        }
      } catch (error) {
        handleError(error);
      }
    });

  cmd
    .command('logout [workspace]')
    .description('Remove a workspace credential')
    .action((workspace?: string) => {
      try {
        const target = workspace ?? getDefaultWorkspace();
        if (!target) {
          console.error('Error: No workspace specified and no default set.');
          process.exit(1);
        }

        const workspaces = getWorkspaces();
        if (!workspaces.includes(target)) {
          console.error(`Error: Workspace "${target}" not found.`);
          console.error(`Available: ${workspaces.join(', ') || '(none)'}`);
          process.exit(1);
        }

        removeCredential(target);
        console.log(`Removed credentials for workspace: ${target}`);
      } catch (error) {
        handleError(error);
      }
    });

  cmd
    .command('list')
    .description('List configured workspaces')
    .action(() => {
      const workspaces = getWorkspaces();
      const defaultWs = getDefaultWorkspace();

      if (workspaces.length === 0) {
        console.log('No workspaces configured.');
        console.log('Run: pylon auth login --key <api-key>');
        return;
      }

      console.log('Configured workspaces:');
      for (const ws of workspaces) {
        const marker = ws === defaultWs ? '* ' : '  ';
        console.log(`${marker}${ws}`);
      }
    });

  cmd
    .command('default [workspace]')
    .description('Set the default workspace')
    .action((workspace?: string) => {
      try {
        if (!workspace) {
          const defaultWs = getDefaultWorkspace();
          if (defaultWs) {
            console.log(`Default workspace: ${defaultWs}`);
          } else {
            console.log('No default workspace set.');
          }
          return;
        }

        setDefaultWorkspace(workspace);
        console.log(`Default workspace set to: ${workspace}`);
      } catch (error) {
        handleError(error);
      }
    });

  cmd
    .command('token')
    .description('Print the resolved API key')
    .action(() => {
      try {
        const key = resolveApiKey(program.opts());
        console.log(key);
      } catch (error) {
        handleError(error);
      }
    });

  cmd
    .command('whoami')
    .description('Show current user and workspace info')
    .action(async () => {
      try {
        const client = createClient(program.opts());
        const response = await client.get<{ id: string; name: string }>('/me');

        const defaultWs = getDefaultWorkspace();
        const credPath = getCredentialsPath();

        console.log(`Organization: ${response.data.name}`);
        console.log(`Org ID: ${response.data.id}`);
        if (defaultWs) {
          console.log(`Default workspace: ${defaultWs}`);
        }
        console.log(`Credentials: ${credPath}`);

        if (process.env.PYLON_API_KEY) {
          console.log('Auth source: PYLON_API_KEY environment variable');
        } else if (program.opts().apiKey) {
          console.log('Auth source: --api-key flag');
        } else {
          console.log('Auth source: stored credentials');
        }
      } catch (error) {
        handleError(error);
      }
    });

  cmd
    .command('status')
    .description('Show authentication status')
    .action(() => {
      const workspaces = getWorkspaces();
      const defaultWs = getDefaultWorkspace();
      const hasEnvKey = !!process.env.PYLON_API_KEY;
      const credPath = getCredentialsPath();

      console.log(`Credentials file: ${credPath}`);
      console.log(`Stored workspaces: ${workspaces.length}`);
      if (defaultWs) {
        console.log(`Default workspace: ${defaultWs}`);
      }
      console.log(`PYLON_API_KEY env var: ${hasEnvKey ? 'set' : 'not set'}`);

      if (workspaces.length === 0 && !hasEnvKey) {
        console.log('');
        console.log('Not authenticated. To get started:');
        console.log('  pylon auth login --key <api-key>');
        console.log('  # or');
        console.log('  export PYLON_API_KEY=<api-key>');
      }
    });
}
