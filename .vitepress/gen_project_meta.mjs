import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import markdownItCjkFriendlyPlugin from 'markdown-it-cjk-friendly';
import markdownItMathjax3Plugin from 'markdown-it-mathjax3';
import markdownItFootnotePlugin from 'markdown-it-footnote';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const SKIP_DIRS = new Set([
  '.vitepress', 'node_modules', 'public', '.git', '.github', '.claude', '.vscode',
]);

const md = new MarkdownIt();
md.use(markdownItCjkFriendlyPlugin);
md.use(markdownItMathjax3Plugin, {
  tex: {
    macros: {
      '\\set': '{\\{#1\\}}',
      Z: '\\mathbb{Z}',
      R: '\\mathbb{R}',
      Q: '\\mathbb{Q}',
      C: '\\mathbb{C}',
    },
  },
});
md.use(markdownItFootnotePlugin);

const entries = fs.readdirSync(rootDir, { withFileTypes: true });

const projects = [];

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  if (entry.name.startsWith('.')) continue;
  if (SKIP_DIRS.has(entry.name)) continue;

  const metaPath = path.join(rootDir, entry.name, 'meta.json');
  if (!fs.existsSync(metaPath)) continue;

  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  const description = meta.description || '';

  const indexMdPath = path.join(rootDir, entry.name, 'index.md');
  const link = fs.existsSync(indexMdPath) ? `/${entry.name}/` : null;

  projects.push({
    name: entry.name,
    link,
    descriptionHtml: md.renderInline(description),
  });
}

projects.sort((a, b) => a.name.localeCompare(b.name));

const outputPath = path.join(__dirname, 'theme', 'project_meta.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(projects, null, 2) + '\n');

console.log(`Generated project_meta.json with ${projects.length} projects`);
