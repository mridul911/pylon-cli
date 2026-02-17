import { Command } from 'commander';
import { createClient } from '../lib/api-client.js';
import { output } from '../lib/formatter.js';
import { handleError } from '../lib/errors.js';

export function register(program: Command): void {
  program
    .command('me')
    .description('Get current authenticated user')
    .action(async () => {
      try {
        const client = createClient(program.opts());
        const response = await client.get('/me');
        output(response, program.opts());
      } catch (error) {
        handleError(error);
      }
    });
}
