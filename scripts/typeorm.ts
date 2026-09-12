import process from 'node:process';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const args: string[] = [];
let environment: string | undefined;

for (const arg of process.argv.slice(2)) {
  if (arg === '--env' || arg.startsWith('--env=')) {
    const value = arg.slice('--env='.length);
    if (environment !== undefined || !/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(value)) {
      process.stderr.write('環境は --env=dev の形式で一度だけ指定してください。\n');
      process.exit(1);
    }
    environment = value;
  } else {
    args.push(arg);
  }
}

const envFile = environment === undefined ? '.env' : `.env.${environment}`;
if (!existsSync(new URL(`../${envFile}`, import.meta.url))) {
  process.stderr.write(`${envFile} がありません。.env.sample をコピーして接続情報を設定してください。\n`);
  process.exit(1);
}

process.stdout.write(`環境変数ファイル: ${envFile}\n`);
const result = spawnSync(
  process.execPath,
  [
    `--env-file=${envFile}`,
    '--import',
    'tsx',
    './node_modules/typeorm/cli.js',
    '-d',
    'src/dataSource/index.ts',
    ...args,
  ],
  { cwd: root, stdio: 'inherit' },
);

if (result.error) {
  process.stderr.write(`${result.error.message}\n`);
}
process.exit(result.status ?? 1);
