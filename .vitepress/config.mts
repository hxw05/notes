import markdownItCjkFriendlyPlugin from 'markdown-it-cjk-friendly';
import markdownItMathjax3Plugin from 'markdown-it-mathjax3';
// @ts-ignore
import markdownItFootnotePlugin from 'markdown-it-footnote';
import { DefaultTheme, defineConfig, UserConfig } from 'vitepress';
import { withSidebar } from 'vitepress-sidebar';
import { VitePressSidebarOptions } from 'vitepress-sidebar/types';
import MermaidExample from './mermaid';

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
		}
	},
	lang: 'zh'
};

const vitePressSidebarOptions: VitePressSidebarOptions = {
	// VitePress Sidebar's options here...
	documentRootPath: '/',
	collapsed: true,
	capitalizeFirst: false,
	useTitleFromFileHeading: true,
	sortMenusByFrontmatterOrder: true,
	excludeFilesByFrontmatterFieldName: 'hidden',
	useFolderLinkFromIndexFile: true
};

// https://vitepress.dev/reference/site-config
export default defineConfig(withSidebar(vitepressConfig, vitePressSidebarOptions));
