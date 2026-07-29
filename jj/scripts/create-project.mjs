import {cp, mkdir, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const [, , sourceArg, outputRootArg] = process.argv;

if (!sourceArg) {
  console.error('Usage: node create-project.mjs <source-video> [output-root]');
  process.exit(1);
}

const source = path.resolve(sourceArg);
const outputRoot = path.resolve(outputRootArg ?? process.cwd());
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const template = path.resolve(scriptDir, '..', 'assets', 'remotion-template');

const sourceInfo = await stat(source).catch(() => null);
if (!sourceInfo?.isFile()) {
  console.error(`Source video not found: ${source}`);
  process.exit(1);
}

const extension = path.extname(source);
const baseName = path.basename(source, extension)
  .normalize('NFKC')
  .replace(/[<>:"/\\|?*\u0000-\u001F]/g, '-')
  .replace(/[\s._-]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'talking-head-video';

const projectDir = path.join(outputRoot, baseName);
const editDir = path.join(projectDir, 'remotion-edit');

const existing = await stat(projectDir).catch(() => null);
if (existing) {
  console.error(`Refusing to overwrite existing project: ${projectDir}`);
  process.exit(2);
}

await mkdir(outputRoot, {recursive: true});
await mkdir(projectDir, {recursive: false});
await cp(template, editDir, {
  recursive: true,
  errorOnExist: true,
  filter: (item) => !item.split(path.sep).some((part) => part === 'node_modules' || part === '.cache'),
});
await mkdir(path.join(editDir, 'public'), {recursive: true});
await cp(source, path.join(editDir, 'public', 'source.mp4'), {errorOnExist: true});

console.log(JSON.stringify({projectDir, editDir, source: path.join(editDir, 'public', 'source.mp4')}, null, 2));
