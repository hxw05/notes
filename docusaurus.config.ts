import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import rehypeKatex from 'rehype-katex';
import remarkCjkFriendly from 'remark-cjk-friendly';
import remarkGfmStrikethroughCjkFriendly from 'remark-cjk-friendly-gfm-strikethrough';
import remarkMath from 'remark-math';
import {sidebarItemsGenerator} from './src/sidebarItemsGenerator';

const config: Config = {
	title: 'whxnotes',
	tagline: 'Notes taken by whx',
	url: 'https://notes.wanghaoxiang.com',
	baseUrl: '/',
	favicon: 'w.png',
	organizationName: 'hxw05',
	projectName: 'notes',
	trailingSlash: false,
	onBrokenLinks: 'throw',
	headTags: [
		{
			tagName: 'link',
			attributes: {
				rel: 'icon',
				href: '/w.png',
				media: '(prefers-color-scheme: light)',
				type: 'image/png',
			},
		},
		{
			tagName: 'link',
			attributes: {
				rel: 'icon',
				href: '/w-invert.png',
				media: '(prefers-color-scheme: dark)',
				type: 'image/png',
			},
		},
	],
	i18n: {
		defaultLocale: 'zh-Hans',
		locales: ['zh-Hans'],
	},
	markdown: {
		format: 'detect',
		emoji: false,
		mermaid: true,
	},
	themes: ['@docusaurus/theme-mermaid'],
	presets: [
		[
			'classic',
			{
				docs: {
					path: '.',
					routeBasePath: '/',
					sidebarPath: './sidebars.ts',
					sidebarItemsGenerator,
					numberPrefixParser: false,
					exclude: [
						'**/_*.{js,jsx,ts,tsx,md,mdx}',
						'**/_*/**',
						'**/*.test.{js,jsx,ts,tsx}',
						'**/__tests__/**',
						'node_modules/**',
						'build/**',
						'.docusaurus/**',
						'src/**',
						'static/**',
						'CLAUDE.md',
						'README.md',
					],
					admonitions: {
						keywords: ['details'],
						extendDefaults: true,
					},
					remarkPlugins: [
						remarkMath,
						remarkCjkFriendly,
						remarkGfmStrikethroughCjkFriendly,
					],
					rehypePlugins: [
						[
							rehypeKatex,
							{
								strict: false,
								macros: {
									'\\set': '{\\{#1\\}}',
									Z: '\\mathbb{Z}',
									R: '\\mathbb{R}',
									Q: '\\mathbb{Q}',
									C: '\\mathbb{C}',
								},
							},
						],
					],
					breadcrumbs: false,
					showLastUpdateAuthor: false,
					showLastUpdateTime: false,
				},
				blog: false,
				pages: false,
				theme: {
					customCss: './src/css/custom.css',
				},
			} satisfies Preset.Options,
		],
	],
	themeConfig: {
		metadata: [{name: 'description', content: 'Notes taken by whx'}],
		image: 'w.png',
		colorMode: {
			respectPrefersColorScheme: true,
		},
		navbar: {
			title: 'whxnotes',
			items: [{to: '/', label: 'Home', position: 'left'}],
		},
		docs: {
			sidebar: {
				hideable: false,
			},
		},
		tableOfContents: {
			minHeadingLevel: 2,
			maxHeadingLevel: 3,
		},
		mermaid: {
			theme: {light: 'neutral', dark: 'dark'},
		},
		prism: {
			theme: prismThemes.github,
			darkTheme: prismThemes.dracula,
		},
	} satisfies Preset.ThemeConfig,
};

export default config;
