import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export async function v3Modules(directory) {
  const root = join(directory, 'tagged-v3', 'src'); await mkdir(root, { recursive: true });
  for (const file of ['core.mjs', 'store.mjs', 'prompts.json', 'critique-policy.json']) {
    await writeFile(join(root, file), execFileSync('git', ['show', `director-v3-compare-working:src/${file}`], { cwd: resolve('.') }));
  }
  return { ...await import(pathToFileURL(join(root, 'core.mjs'))), ...await import(pathToFileURL(join(root, 'store.mjs'))) };
}
