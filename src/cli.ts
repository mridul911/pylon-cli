import { Command } from 'commander';
import { handleError } from './lib/errors.js';

import { register as registerUsage } from './commands/usage.js';
import { register as registerMe } from './commands/me.js';
import { register as registerAccounts } from './commands/accounts.js';
import { register as registerAuditLogs } from './commands/audit-logs.js';
import { register as registerContacts } from './commands/contacts.js';
import { register as registerCustomFields } from './commands/custom-fields.js';
import { register as registerIssues } from './commands/issues.js';
import { register as registerKnowledgeBases } from './commands/knowledge-bases.js';
import { register as registerMacroGroups } from './commands/macro-groups.js';
import { register as registerTags } from './commands/tags.js';
import { register as registerTeams } from './commands/teams.js';
import { register as registerTicketForms } from './commands/ticket-forms.js';
import { register as registerTrainingData } from './commands/training-data.js';
import { register as registerUserRoles } from './commands/user-roles.js';
import { register as registerUsers } from './commands/users.js';
import { register as registerInstall } from './commands/install.js';
import { register as registerAuth } from './commands/auth.js';

const program = new Command();

program
  .name('pylon')
  .description('Read-only CLI for the Pylon API')
  .version('0.1.0')
  .option('--api-key <key>', 'Pylon API key (or set PYLON_API_KEY)')
  .option('--format <format>', 'Output format: json (default) or table', 'json')
  .option('--raw', 'Include full API envelope (request_id, pagination)');

registerAuth(program);
registerUsage(program);
registerMe(program);
registerAccounts(program);
registerAuditLogs(program);
registerContacts(program);
registerCustomFields(program);
registerIssues(program);
registerKnowledgeBases(program);
registerMacroGroups(program);
registerTags(program);
registerTeams(program);
registerTicketForms(program);
registerTrainingData(program);
registerUserRoles(program);
registerUsers(program);
registerInstall(program);

program.parseAsync(process.argv).catch(handleError);
