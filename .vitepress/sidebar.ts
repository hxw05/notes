import fs from 'node:fs';
import path from 'node:path';

interface SidebarItem {
  text: string;
  link?: string;
  items?: SidebarItem[];
  collapsed?: boolean;
}

interface FileInfo {
  name: string;
  link: string;
  order?: number;
  date?: string;
}

const SKIP_DIRS = new Set([
  '.vitepress', 'node_modules', 'public', '.git', '.github', '.claude', '.vscode',
]);

function parseFrontmatter(content: string): Record<string, unknown> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const data: Record<string, unknown> = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val: unknown = m[2].trim();
    if (val === 'true') val = true;
    else if (val === 'false') val = false;
    else if (/^-?\d+$/.test(val as string)) val = Number(val);
    data[key] = val;
  }
  return data;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/~~([^~]+)~~/g, '$1')
    .replace(/__([^_]+)__/g, '$1');
}

function extractTitle(content: string): string | null {
  const body = content.replace(/^---\n[\s\S]*?\n---\n?/, '');
  const match = body.match(/^#\s+(.+)$/m);
  return match ? stripMarkdown(match[1].trim()) : null;
}

const naturalCollator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
const naturalCompare = (a: string, b: string) => naturalCollator.compare(a, b);

function sortFiles(files: FileInfo[]): FileInfo[] {
  return [...files].sort((a, b) => {
    const aHasOrder = a.order !== undefined;
    const bHasOrder = b.order !== undefined;
    if (aHasOrder && bHasOrder) {
      if (a.order !== b.order) return a.order! - b.order!;
      return naturalCompare(a.name, b.name);
    }
    if (aHasOrder) return -1;
    if (bHasOrder) return 1;

    const aHasDate = a.date !== undefined;
    const bHasDate = b.date !== undefined;
    if (aHasDate && bHasDate) {
      const cmp = a.date!.localeCompare(b.date!);
      if (cmp !== 0) return cmp;
      return naturalCompare(a.name, b.name);
    }
    if (aHasDate) return -1;
    if (bHasDate) return 1;

    return naturalCompare(a.name, b.name);
  });
}

function buildSection(dirPath: string, dirName: string, rootDir: string): SidebarItem | null {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  let indexLink: string | undefined;
  const files: FileInfo[] = [];

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue;

    const filePath = path.join(dirPath, entry.name);
    const content = fs.readFileSync(filePath, 'utf-8');
    const fm = parseFrontmatter(content);

    if (fm.hidden) continue;

    const title = extractTitle(content);
    if (!title) continue;

    const relPath = path.relative(rootDir, filePath);
    const link = '/' + relPath.replace(/\.md$/, '');

    const info: FileInfo = { name: title, link };
    if (typeof fm.order === 'number') info.order = fm.order;
    if (typeof fm.date === 'string') info.date = fm.date;

    if (entry.name === 'index.md') {
      indexLink = link.replace(/\/index$/, '/');
    } else {
      files.push(info);
    }
  }

  if (!indexLink && files.length === 0) return null;

  const sorted = sortFiles(files);
  const items: SidebarItem[] = sorted.map(f => ({ text: f.name, link: f.link }));

  return {
    text: dirName,
    collapsed: true,
    ...(indexLink ? { link: indexLink } : {}),
    ...(items.length > 0 ? { items } : {}),
  };
}

export function generateSidebar(rootDir?: string): SidebarItem[] {
  const root = rootDir || process.cwd();
  const entries = fs.readdirSync(root, { withFileTypes: true });

  const sections: SidebarItem[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith('.')) continue;
    if (SKIP_DIRS.has(entry.name)) continue;

    const dirPath = path.join(root, entry.name);
    const hasMd = fs.readdirSync(dirPath).some(f => f.endsWith('.md'));
    if (!hasMd) continue;

    const section = buildSection(dirPath, entry.name, root);
    if (section) sections.push(section);
  }

  sections.sort((a, b) => naturalCompare(a.text, b.text));
  return sections;
}
