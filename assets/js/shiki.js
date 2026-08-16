(() => {
  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  const isDark = () => {
    const theme = root.dataset.theme || 'light';
    return theme.endsWith('dark') || (theme.endsWith('auto') && media.matches);
  };

  const themeName = () => (isDark() ? 'github-dark' : 'github-light');

  let codeToHtmlPromise = null;
  const getCodeToHtml = () => {
    if (!codeToHtmlPromise) {
      codeToHtmlPromise = import('https://esm.sh/shiki@4.4.3').then((m) => m.codeToHtml);
    }
    return codeToHtmlPromise;
  };

  const languageOf = (code) => {
    const cls = Array.from(code.classList).find((name) => name.startsWith('language-'));
    return cls ? cls.slice('language-'.length).toLowerCase() : 'text';
  };

  const renderOne = async (pre, lang, theme) => {
    const code = pre.querySelector('code');
    const source = code ? code.textContent : pre.textContent;
    try {
      const codeToHtml = await getCodeToHtml();
      const html = await codeToHtml(source, { lang: lang || 'text', theme });
      const template = document.createElement('template');
      template.innerHTML = html.trim();
      const next = template.content.firstElementChild;
      if (!next || next.tagName !== 'PRE') return;
      next.dataset.shiki = 'true';
      next.dataset.shikiLang = lang || 'text';
      next.dataset.shikiTheme = theme;
      pre.replaceWith(next);
    } catch (error) {
      pre.dataset.shiki = 'plain';
    }
  };

  const highlightAll = async (refresh = false) => {
    const theme = themeName();
    let pres;
    if (refresh) {
      pres = Array.from(document.querySelectorAll('pre[data-shiki="true"]'));
    } else {
      pres = Array.from(document.querySelectorAll('pre code[class*="language-"]'))
        .map((code) => code.closest('pre'))
        .filter((pre) => pre && !pre.dataset.shiki);
    }
    await Promise.all(
      pres.map((pre) => {
        const code = pre.querySelector('code');
        const lang = refresh
          ? pre.dataset.shikiLang || 'text'
          : languageOf(code);
        return renderOne(pre, lang, theme);
      })
    );
  };

  document.addEventListener('copy', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const code = target.closest('code');
    if (!code || !navigator.clipboard) return;
    const pre = code.closest('pre');
    if (!pre) return;
    event.preventDefault();
    const text = window.getSelection().toString() || code.textContent;
    navigator.clipboard.writeText(text);
  });

  highlightAll();
  media.addEventListener('change', () => highlightAll(true));
  new MutationObserver(() => highlightAll(true)).observe(root, {
    attributes: true,
    attributeFilter: ['data-theme']
  });
})();
