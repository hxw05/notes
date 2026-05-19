import mermaid, { type MermaidConfig } from 'mermaid';

mermaid.registerIconPacks([
	{
		name: 'logos',
		loader: () =>
			fetch('https://unpkg.com/@iconify-json/logos/icons.json').then(res => res.json())
	}
]);

export const render = async (id: string, code: string, config: MermaidConfig): Promise<string> => {
	const darkModeMql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
		const newColorScheme = event.matches ? 'dark' : 'light';
		if (newColorScheme === 'dark') {
			mermaid.initialize({ ...config, theme: 'dark' });
		} else {
			mermaid.initialize({ ...config, theme: 'neutral' });
		}
	});

	mermaid.initialize({ ...config, theme: darkModeMql.matches ? 'dark' : 'neutral' });
	const { svg } = await mermaid.render(id, code);
	return svg;
};
