import type * as Preset from '@docusaurus/preset-classic';

type DocsOptions = Exclude<NonNullable<Preset.Options['docs']>, false>;
type GeneratorOption = NonNullable<DocsOptions['sidebarItemsGenerator']>;
type GeneratorArgs = Parameters<GeneratorOption>[0];
type Generator = GeneratorArgs['defaultSidebarItemsGenerator'];
type GeneratedItem = Awaited<ReturnType<Generator>>[number];
type GeneratorDoc = GeneratorArgs['docs'][number];

type Meta = {
	label: string;
	order?: number;
	date?: string;
};

// 与旧站点一致：使用运行时默认 locale 的比较器
const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});

function docMeta(doc: GeneratorDoc): Meta {
	const frontMatter = doc.frontMatter ?? {};
	const order =
		typeof frontMatter.order === 'number' ? frontMatter.order : undefined;
	const date =
		typeof frontMatter.date === 'string'
			? frontMatter.date
			: frontMatter.date instanceof Date
				? frontMatter.date.toISOString()
				: undefined;
	return {label: doc.title, order, date};
}

function compareMeta(a: Meta, b: Meta): number {
	if (a.order !== undefined && b.order !== undefined) {
		return a.order !== b.order
			? a.order - b.order
			: collator.compare(a.label, b.label);
	}
	if (a.order !== undefined) return -1;
	if (b.order !== undefined) return 1;

	if (a.date !== undefined && b.date !== undefined) {
		const cmp = a.date.localeCompare(b.date);
		return cmp !== 0 ? cmp : collator.compare(a.label, b.label);
	}
	if (a.date !== undefined) return -1;
	if (b.date !== undefined) return 1;

	return collator.compare(a.label, b.label);
}

function metaOf(item: GeneratedItem, metas: Map<string, Meta>): Meta {
	if (item.type === 'category') {
		return {label: item.label};
	}
	if (item.type === 'doc' || item.type === 'ref') {
		return metas.get(item.id) ?? {label: item.id};
	}
	return {label: item.type === 'link' ? item.label : ''};
}

/**
 * 分类首页只认 index/readme，与目录同名的笔记（modern_js/modern_js.md 之类）
 * 保持为普通条目，分类标题始终是目录名。
 */
const isCategoryIndex = ({fileName}: {fileName: string}): boolean =>
	['index', 'readme'].includes(fileName.toLowerCase());

/**
 * 沿用旧站点的侧栏顺序：先看 order，再看 date，最后按标题自然序。
 */
export const sidebarItemsGenerator: GeneratorOption = async ({
	defaultSidebarItemsGenerator,
	docs,
	...args
}) => {
	const metas = new Map(docs.map((doc) => [doc.id, docMeta(doc)]));

	const sort = (items: GeneratedItem[]): GeneratedItem[] =>
		[...items]
			.sort((a, b) => compareMeta(metaOf(a, metas), metaOf(b, metas)))
			.map((item) =>
				item.type === 'category'
					? {...item, items: sort(item.items)}
					: item,
			);

	return sort(
		await defaultSidebarItemsGenerator({...args, docs, isCategoryIndex}),
	);
};
