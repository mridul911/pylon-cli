import { Command } from 'commander';
import { createClient } from '../lib/api-client.js';
import { list } from '../lib/pagination.js';
import { output } from '../lib/formatter.js';
import { handleError } from '../lib/errors.js';

export function register(program: Command): void {
  const cmd = program.command('kb').description('Manage knowledge bases');

  cmd
    .command('list')
    .description('List knowledge bases')
    .option('--cursor <cursor>', 'Pagination cursor')
    .option('--limit <n>', 'Results per page')
    .option('--all', 'Fetch all pages')
    .action(async (opts) => {
      try {
        const client = createClient(program.opts());
        const response = await list(client, '/knowledge-bases', opts);
        output(response, program.opts());
      } catch (error) {
        handleError(error);
      }
    });

  cmd
    .command('get <id>')
    .description('Get knowledge base by ID')
    .action(async (id: string) => {
      try {
        const client = createClient(program.opts());
        const response = await client.get(`/knowledge-bases/${encodeURIComponent(id)}`);
        output(response, program.opts());
      } catch (error) {
        handleError(error);
      }
    });

  cmd
    .command('collections <id>')
    .description('List collections in a knowledge base')
    .action(async (id: string) => {
      try {
        const client = createClient(program.opts());
        const response = await client.get(`/knowledge-bases/${encodeURIComponent(id)}/collections`);
        output(response, program.opts());
      } catch (error) {
        handleError(error);
      }
    });

  cmd
    .command('articles <id>')
    .description('List articles in a knowledge base')
    .action(async (id: string) => {
      try {
        const client = createClient(program.opts());
        const response = await client.get(`/knowledge-bases/${encodeURIComponent(id)}/articles`);
        output(response, program.opts());
      } catch (error) {
        handleError(error);
      }
    });

  cmd
    .command('article <kb-id> <article-id>')
    .description('Get a specific article in a knowledge base')
    .action(async (kbId: string, articleId: string) => {
      try {
        const client = createClient(program.opts());
        const response = await client.get(
          `/knowledge-bases/${encodeURIComponent(kbId)}/articles/${encodeURIComponent(articleId)}`
        );
        output(response, program.opts());
      } catch (error) {
        handleError(error);
      }
    });
}
