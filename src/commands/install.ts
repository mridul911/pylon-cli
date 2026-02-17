import { Command } from 'commander';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const SKILL_FILES: Record<string, string> = {};

// Load skill files at build time via bundler, with runtime fallback
function getSkillContent(relativePath: string): string {
  if (SKILL_FILES[relativePath]) return SKILL_FILES[relativePath];

  // Resolve from package root (bin/../skills/)
  const __filename = fileURLToPath(import.meta.url);
  const packageRoot = join(dirname(__filename), '..');
  const candidates = [
    join(packageRoot, 'skills', 'pylon-cli', relativePath),
    join(packageRoot, '..', 'skills', 'pylon-cli', relativePath),
  ];

  for (const candidate of candidates) {
    try {
      return readFileSync(candidate, 'utf-8');
    } catch {
      continue;
    }
  }

  throw new Error(`Skill file not found: ${relativePath}`);
}

const SKILL_PATHS = [
  'SKILL.md',
  'references/auth.md',
  'references/accounts.md',
  'references/contacts.md',
  'references/issues.md',
  'references/knowledge-base.md',
  'references/tags.md',
  'references/teams-and-users.md',
];

export function register(program: Command): void {
  program
    .command('install')
    .description('Install pylon-cli skills and integrations')
    .option('--skills', 'Install agent skills for Claude Code and other AI agents')
    .action((opts) => {
      if (!opts.skills) {
        console.log('Usage: pylon install --skills');
        console.log('');
        console.log('Options:');
        console.log('  --skills    Install agent skills to .claude/skills/pylon-cli/');
        return;
      }

      const targetDir = join(process.cwd(), '.claude', 'skills', 'pylon-cli');
      const refsDir = join(targetDir, 'references');

      mkdirSync(refsDir, { recursive: true });

      for (const path of SKILL_PATHS) {
        const content = getSkillContent(path);
        const targetPath = join(targetDir, path);
        mkdirSync(dirname(targetPath), { recursive: true });
        writeFileSync(targetPath, content, 'utf-8');
      }

      console.log(`Installed pylon-cli skills to ${targetDir}`);
      console.log('');
      console.log('Files written:');
      for (const path of SKILL_PATHS) {
        console.log(`  .claude/skills/pylon-cli/${path}`);
      }
      console.log('');
      console.log('Claude Code and other AI agents will now discover these skills automatically.');
    });
}
