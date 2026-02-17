import { Command } from 'commander';
import { createClient } from '../lib/api-client.js';
import { list } from '../lib/pagination.js';
import { output } from '../lib/formatter.js';
import { handleError } from '../lib/errors.js';
import { ValidationError } from '../lib/errors.js';

function validateDateRange(start: string, end: string): void {
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (isNaN(startDate.getTime())) {
    throw new ValidationError(`Invalid start date: ${start}. Use RFC3339 format (e.g. 2024-01-01T00:00:00Z)`);
  }
  if (isNaN(endDate.getTime())) {
    throw new ValidationError(`Invalid end date: ${end}. Use RFC3339 format (e.g. 2024-01-31T00:00:00Z)`);
  }

  const diffMs = endDate.getTime() - startDate.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  if (diffDays > 30) {
    throw new ValidationError('Date range cannot exceed 30 days');
  }
  if (diffDays < 0) {
    throw new ValidationError('Start date must be before end date');
  }
}

export function register(program: Command): void {
  const cmd = program.command('issues').description('Manage issues');

  cmd
    .command('list')
    .description('List issues (requires --start and --end, max 30 day range)')
    .requiredOption('--start <timestamp>', 'Start time (RFC3339)')
    .requiredOption('--end <timestamp>', 'End time (RFC3339)')
    .option('--cursor <cursor>', 'Pagination cursor')
    .option('--limit <n>', 'Results per page')
    .option('--all', 'Fetch all pages')
    .action(async (opts) => {
      try {
        validateDateRange(opts.start, opts.end);
        const client = createClient(program.opts());
        const response = await list(client, '/issues', {
          cursor: opts.cursor,
          limit: opts.limit,
          all: opts.all,
          start_time: opts.start,
          end_time: opts.end,
        });
        output(response, program.opts());
      } catch (error) {
        handleError(error);
      }
    });

  cmd
    .command('get <id>')
    .description('Get issue by ID')
    .action(async (id: string) => {
      try {
        const client = createClient(program.opts());
        const response = await client.get(`/issues/${encodeURIComponent(id)}`);
        output(response, program.opts());
      } catch (error) {
        handleError(error);
      }
    });

  cmd
    .command('followers <id>')
    .description('Get issue followers')
    .action(async (id: string) => {
      try {
        const client = createClient(program.opts());
        const response = await client.get(`/issues/${encodeURIComponent(id)}/followers`);
        output(response, program.opts());
      } catch (error) {
        handleError(error);
      }
    });

  cmd
    .command('messages <id>')
    .description('Get issue messages')
    .action(async (id: string) => {
      try {
        const client = createClient(program.opts());
        const response = await client.get(`/issues/${encodeURIComponent(id)}/messages`);
        output(response, program.opts());
      } catch (error) {
        handleError(error);
      }
    });

  cmd
    .command('threads <id>')
    .description('Get issue threads')
    .action(async (id: string) => {
      try {
        const client = createClient(program.opts());
        const response = await client.get(`/issues/${encodeURIComponent(id)}/threads`);
        output(response, program.opts());
      } catch (error) {
        handleError(error);
      }
    });
}
