import markdownItCjkFriendlyPlugin from 'markdown-it-cjk-friendly';
import markdownItMathjax3Plugin from 'markdown-it-mathjax3';
// @ts-ignore
import markdownItFootnotePlugin from 'markdown-it-footnote';
import { DefaultTheme, defineConfig, UserConfig } from 'vitepress';
import MermaidExample from './mermaid';
import { generateSidebar } from './sidebar';

const vitepressConfig: UserConfig<DefaultTheme.Config> = {
	title: 'whxnotes',
	description: 'Notes taken by whx',
	appearance: 'force-auto',
	head: [
		['link', { rel: 'icon', href: '/w.png', media: '(prefers-color-scheme: light)', type: 'image/png' }],
		['link', { rel: 'icon', href: '/w-invert.png', media: '(prefers-color-scheme: dark)', type: 'image/png' }]
	],
	themeConfig: {
		nav: [{ text: 'Home', link: '/' }],
		sidebar: generateSidebar(),
		outline: {
			label: '目录',
			level: [2, 3]
		}
	},
	markdown: {
		config: md => {
			md.use(markdownItCjkFriendlyPlugin);
			md.use(markdownItMathjax3Plugin, {
				tex: {
					macros: {
						'\\set': '{\\{#1\\}}',
						'Z': '\\mathbb{Z}',
						'R': '\\mathbb{R}',
						'Q': '\\mathbb{Q}',
						'C': '\\mathbb{C}'
					}
				}
			});
			md.use(markdownItFootnotePlugin);
			MermaidExample(md);

			// Fix linkify-it: CJK/fullwidth punctuation is not excluded by
			// linkify-it's path regex (only ASCII punctuation is), so it gets
			// included as part of auto-linked URLs.
			// See: https://github.com/markdown-it/linkify-it/issues/15
			//
			// Truncate at the FIRST CJK punctuation character inside the URL.
			// This handles both trailing punctuation (。, ！, ？) and the case
			// where CJK punct sits between two adjacent URLs (e.g.
			// `url1、url2`), which would otherwise be merged into one link.
			const cjkPunctCharRE = /[、。，．！？；：【】「」『』《》（）]/;
			const origLinkifyNormalize = md.linkify.normalize.bind(md.linkify);
			md.linkify.normalize = (match) => {
				origLinkifyNormalize(match);
				const idx = match.url.search(cjkPunctCharRE);
				if (idx === -1) return;
				const removed = match.url.length - idx;
				match.url = match.url.slice(0, idx);
				match.text = match.text.slice(0, match.text.length - removed);
				match.lastIndex -= removed;
			};
		}
	},
	lang: 'zh'
};

// https://vitepress.dev/reference/site-config
export default defineConfig(vitepressConfig);