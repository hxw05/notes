(() => {
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

  const renderOne = async (pre, lang) => {
    const code = pre.querySelector('code');
    const source = code ? code.textContent : pre.textContent;
    try {
      const codeToHtml = await getCodeToHtml();
      // Dual-theme output, matching scripts/shiki.mjs: both light and dark
      // token colors are embedded (color + --shiki-dark / --shiki-dark-bg
      // variables), and assets/styles/custom.css switches them via
      // data-theme / prefers-color-scheme. No re-rendering on theme change.
      const html = await codeToHtml(source, {
        lang: lang || 'text',
        themes: { light: 'github-light', dark: 'github-dark' },
        defaultColor: 'light'
      });
      const template = document.createElement('template');
      template.innerHTML = html.trim();
      const next = template.content.firstElementChild;
      if (!next || next.tagName !== 'PRE') return;
      next.dataset.shiki = 'true';
      next.dataset.shikiLang = lang || 'text';
      pre.replaceWith(next);
    } catch (error) {
      pre.dataset.shiki = 'plain';
    }
  };

  const highlightAll = async () => {
    const pres = Array.from(document.querySelectorAll('pre code[class*="language-"]'))
      .map((code) => code.closest('pre'))
      .filter((pre) => pre && !pre.dataset.shiki);
    await Promise.all(
      pres.map((pre) => renderOne(pre, languageOf(pre.querySelector('code'))))
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
})();
