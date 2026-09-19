import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

// Create real schema-1 data with the protected V2 implementation, not a guessed old schema.
export async function legacyModules(directory) {
  const root = join(directory, 'tagged-v2', 'src'); await mkdir(root, { recursive: true });
  for (const file of ['core.mjs', 'store.mjs', 'prompts.json']) {
    const content = execFileSync('git', ['show', `director-v2-persistence-working:src/${file}`], { cwd: resolve('.') });
    await writeFile(join(root, file), content);
  }
  const core = await import(pathToFileURL(join(root, 'core.mjs')));
  const { SessionStore } = await import(pathToFileURL(join(root, 'store.mjs')));
  return { ...core, SessionStore };
}
