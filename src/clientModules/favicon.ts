import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

const icons = {light: '/w.png', dark: '/w-invert.png'} as const;

/** 直接改 href 不会让浏览器刷新标签页图标，必须换掉整个 link 节点 */
function syncFavicon(): void {
	const href =
		document.documentElement.dataset.theme === 'dark' ? icons.dark : icons.light;
	const current = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
	if (current?.getAttribute('href') === href && !current.media) {
		return;
	}

	for (const link of document.querySelectorAll('link[rel="icon"]')) {
		link.remove();
	}
	const link = document.createElement('link');
	link.rel = 'icon';
	link.href = href;
	document.head.append(link);
}

if (ExecutionEnvironment.canUseDOM) {
	new MutationObserver(syncFavicon).observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['data-theme'],
	});
	syncFavicon();
}
