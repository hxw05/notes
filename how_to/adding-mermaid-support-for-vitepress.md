# 为 VitePress 添加 Mermaid 支持

:::tip
仅适用于默认主题
:::

VitePress并不具备官方的Mermaid渲染支持，但配置起来很简单，因为代码都是现成的：Mermaid的官方文档用的正是VitePress。参考这篇提问 <https://github.com/orgs/mermaid-js/discussions/4511>，最简单的方式不是去写一个插件，而是自己修改模板内容，步骤如下。

:::tip
以下代码大部分来自 https://github.com/mermaid-js/mermaid/tree/develop/packages/mermaid/src/docs/.vitepress
:::

## Step 1

在VitePress配置文件`config.mts`（扩展名可能有差异）的同目录或者子目录下面，创建一个TS文件（如果要用JS，请自行去掉类型注解）并粘贴下面的代码：

```typescript
import type { MarkdownRenderer } from 'vitepress';

const MermaidExample = (md: MarkdownRenderer) => {
	const defaultRenderer = md.renderer.rules.fence;

	if (!defaultRenderer) {
		throw new Error('defaultRenderer is undefined');
	}

	md.renderer.rules.fence = (tokens, index, options, env, slf) => {
		const token = tokens[index];
		const language = token.info.trim();
		if (language.startsWith('mermaid')) {
			const key = index;
			return `
    <Suspense> 
    <template #default>
    <Mermaid id="mermaid-${key}" :showCode="${
		language === 'mermaid-example'
	}" graph="${encodeURIComponent(token.content)}"></Mermaid>
    </template>
        <!-- loading state via #fallback slot -->
        <template #fallback>
        Loading...
        </template>
    </Suspense>
`;
		} else if (language === 'warning') {
			return `<div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>${token.content}}</p></div>`;
		} else if (language === 'note') {
			return `<div class="tip custom-block"><p class="custom-block-title">NOTE</p><p>${token.content}}</p></div>`;
		} else if (language === 'regexp') {
			// shiki doesn't yet support regexp code blocks, but the javascript
			// one still makes RegExes look good
			token.info = 'javascript';
			// use trimEnd to move trailing `\n` outside if the JavaScript regex `/` block
			token.content = `/${token.content.trimEnd()}/\n`;
			return defaultRenderer(tokens, index, options, env, slf);
		} else if (language === 'jison') {
			return `<div class="language-">
    <button class="copy"></button>
    <span class="lang">jison</span>
    <pre>
    <code>${token.content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>
    </pre>
    </div>`;
		}

		return defaultRenderer(tokens, index, options, env, slf);
	};
};

export default MermaidExample;
```

这是借助VitePress暴露的对markdownit的扩展选项，为markdown解析过程添加mermaid解析流程。以上代码不仅添加了mermaid本身的渲染，还添加了对callout的代码块语法支持以及以regex作为language code代码块的支持，这些都是Mermaid官方文档的定制化需求，如果不需要可以删掉；留下最开头的mermaid language code分支即可。

## Step 2

在theme文件夹下新建一个components目录（如果没有）用于存放自定义的组件，新建一个组件并粘贴下面的内容：

```vue
<template>
	<div v-if="props.showCode">
		<h5>Code:</h5>
		<div class="language-mermaid">
			<button class="copy"></button>
			<span class="lang">mermaid</span>
			<pre><code :contenteditable="contentEditable" @input="updateCode"  @keydown.meta.enter="renderChart" @keydown.ctrl.enter="renderChart" ref="editableContent" class="editable-code"></code></pre>
			<div class="buttons-container">
				<span>{{ ctrlSymbol }} + Enter</span><span>|</span>
				<button @click="renderChart">Run ▶</button>
			</div>
		</div>
	</div>
	<div v-html="svg"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { render } from './mermaid';

const props = defineProps({
	graph: {
		type: String,
		required: true
	},
	id: {
		type: String,
		required: true
	},
	showCode: {
		type: Boolean,
		default: true
	}
});

const svg = ref('');
const code = ref(decodeURIComponent(props.graph));
const ctrlSymbol = ref(navigator.platform.includes('Mac') ? '⌘' : 'Ctrl');
const editableContent = ref(null);
const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
const contentEditable = ref(isFirefox ? 'true' : 'plaintext-only');

let mut = null;

const updateCode = event => {
	code.value = event.target.innerText;
};

onMounted(async () => {
	mut = new MutationObserver(() => renderChart());
	mut.observe(document.documentElement, { attributes: true });

	if (editableContent.value) {
		// Set the initial value of the contenteditable element
		// We cannot bind using `{{ code }}` because it will rerender the whole component
		// when the value changes, shifting the cursor when enter is used
		editableContent.value.textContent = code.value;
	}

	await renderChart();

	//refresh images on first render
	const hasImages = /<img([\w\W]+?)>/.exec(code.value)?.length > 0;
	if (hasImages)
		setTimeout(() => {
			let imgElements = document.getElementsByTagName('img');
			let imgs = Array.from(imgElements);
			if (imgs.length) {
				Promise.all(
					imgs
						.filter(img => !img.complete)
						.map(
							img =>
								new Promise(resolve => {
									img.onload = img.onerror = resolve;
								})
						)
				).then(() => {
					renderChart();
				});
			}
		}, 100);
});

onUnmounted(() => mut.disconnect());

const renderChart = async () => {
	console.log('rendering chart' + props.id + code.value);
	const hasDarkClass = document.documentElement.classList.contains('dark');
	const mermaidConfig = {
		securityLevel: 'loose',
		startOnLoad: false,
		theme: hasDarkClass ? 'dark' : 'default'
	};
	let svgCode = await render(props.id, code.value, mermaidConfig);
	// This is a hack to force v-html to re-render, otherwise the diagram disappears
	// when **switching themes** or **reloading the page**.
	// The cause is that the diagram is deleted during rendering (out of Vue's knowledge).
	// Because svgCode does NOT change, v-html does not re-render.
	// This is not required for all diagrams, but it is required for c4c, mindmap and zenuml.
	const salt = Math.random().toString(36).substring(7);
	svg.value = `${svgCode} <span style="display: none">${salt}</span>`;
};
</script>

<style>
.editable-code:focus {
	outline: none;
	/* Removes the default focus indicator */
}

.buttons-container {
	position: absolute;
	bottom: 0;
	right: 0;
	z-index: 1;
	padding: 0.5rem;
	display: flex;
	gap: 0.5rem;
}

.buttons-container > span {
	cursor: default;
	opacity: 0.5;
	font-size: 0.8rem;
}

.buttons-container > button {
	color: #007bffbf;
	font-weight: bold;
	cursor: pointer;
}

.buttons-container > button:hover {
	color: #007bff;
}
</style>
```

在同目录（也可以是其他目录，但需要修改以上粘贴内容script中的mermaid脚本路径）下新建一个TS文件，粘贴以下内容：

```typescript
import mermaid, { type MermaidConfig } from 'mermaid';

mermaid.registerIconPacks([
	{
		name: 'logos',
		loader: () =>
			fetch('https://unpkg.com/@iconify-json/logos/icons.json').then(res => res.json())
	}
]);

export const render = async (id: string, code: string, config: MermaidConfig): Promise<string> => {
	mermaid.initialize(config);
	const { svg } = await mermaid.render(id, code);
	return svg;
};
```

在这里可以做一些定制化的操作，例如将unpkg.com的链接更换为对国内网络环境更友好的镜像链接。Mermaid的配置可以通过修改`mermaid.initialize`这句实现：

```typescript
mermaid.initialize({ ...config, theme: 'forest' });
```

更进一步地，还可以添加一些代码来进一步定制Mermaid的配置文件，例如根据用户系统的颜色模式来切换Mermaid的主题配色。需要注意以下代码只检测操作系统的相关设置而与VitePress自带的颜色模式切换按钮无关，无法做到检测按钮切换的效果。建议到`config.mts`中将`appearance`设置为`force-auto`来隐藏切换按钮同时提供对操作系统颜色模式支持。

```typescript
const darkModeMql = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
	const newColorScheme = event.matches ? 'dark' : 'light';
	if (newColorScheme === 'dark') {
		mermaid.initialize({ ...config, theme: 'dark' });
	} else {
		mermaid.initialize({ ...config, theme: 'neutral' });
	}
});
mermaid.initialize({ ...config, theme: darkModeMql.matched ? 'dark' : 'neutral' });
```

## Step 3
在theme文件夹下添加入口`index.ts`，并全局注册刚刚定义的组件。

```typescript
// ...
import type { Theme } from "vitepress";
import Mermaid from "./components/Mermaid.vue";

export default {
    enhanceApp(ctx) {
        // ...
        ctx.app.component('Mermaid', Mermaid);
    },
    // ...
} satisfies Theme;
```

## Step 4
在`config.mts`中的markdown配置字段加上对MermaidExample的调用即可。

```typescript
const vitepressConfig = {
    // ...
    markdown: {
        // ...
        config: md => {
            // ...
            MermaidExample(md);
        }
    }
}
```