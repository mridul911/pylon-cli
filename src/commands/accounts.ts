import { Command } from 'commander';
import { createClient } from '../lib/api-client.js';
import { list } from '../lib/pagination.js';
import { output } from '../lib/formatter.js';
import { handleError } from '../lib/errors.js';

export function register(program: Command): void {
  const cmd = program.command('accounts').description('Manage accounts');

  cmd
    .command('list')
    .description('List accounts')
    .option('--cursor <cursor>', 'Pagination cursor')
    .option('--limit <n>', 'Results per page')
    .option('--all', 'Fetch all pages')
    .action(async (opts) => {
      try {
        const client = createClient(program.opts());
        const response = await list(client, '/accounts', opts);
        output(response, program.opts());
      } catch (error) {
        handleError(error);
      }
    });

  cmd
    .command('get <id>')
    .description('Get account by ID')
    .action(async (id: string) => {
      try {
        const client = createClient(program.opts());
        const response = await client.get(`/accounts/${encodeURIComponent(id)}`);
        output(response, program.opts());
      } catch (error) {
        handleError(error);
      }
    });
}
