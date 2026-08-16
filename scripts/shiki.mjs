import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { codeToHtml } from 'shiki';
import he from 'he';

const { decode } = he;

const publicDir = process.env.HUGO_PUBLIC_DIR
  ? path.resolve(process.env.HUGO_PUBLIC_DIR)
  : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public');

const codeBlockPattern =
  /<pre\b[^>]*><code\b[^>]*\bclass=["']?language-([A-Za-z0-9_+-]+)["']?[^>]*\bdata-lang=["']?[^"'\s>]+["']?[^>]*>([\s\S]*?)<\/code><\/pre>/g;

async function highlight(html, file) {
  const chunks = [];
  let last = 0;
  let match;
  let count = 0;

  while ((match = codeBlockPattern.exec(html)) !== null) {
    const lang = match[1].toLowerCase();

    // These are handled by Hugo render hooks, not by this script.
    if (lang === 'mermaid' || lang === 'katex') {
      continue;
    }

    const raw = decode(match[2]);
    let highlighted;
    try {
      highlighted = await codeToHtml(raw, {
        lang,
        themes: { light: 'github-light', dark: 'github-dark' },
        defaultColor: 'light'
      });
    } catch (error) {
      console.warn(`[shiki] ${file}: unsupported language "${lang}", rendering as text`);
      highlighted = await codeToHtml(raw, {
        lang: 'text',
        themes: { light: 'github-light', dark: 'github-dark' },
        defaultColor: 'light'
      });
    }

    chunks.push(html.slice(last, match.index));
    chunks.push(highlighted);
    last = match.index + match[0].length;
    count += 1;
  }

  if (count === 0) {
    return null;
  }

  chunks.push(html.slice(last));
  return { html: chunks.join(''), count };
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      yield full;
    }
  }
}

let files = 0;
let blocks = 0;

for await (const file of walk(publicDir)) {
  const html = await readFile(file, 'utf8');
  const result = await highlight(html, file);
  if (result) {
    await writeFile(file, result.html, 'utf8');
    files += 1;
    blocks += result.count;
  }
}

console.log(`[shiki] highlighted ${blocks} code blocks in ${files} files`);
