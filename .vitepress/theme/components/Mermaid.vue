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
    <div
        ref="mermaidOuter"
        :class="['mermaid-outer', { 'mermaid-zoomable': enableZoom }]"
        @wheel="onWheel"
        @mousedown="enableZoom && onMouseDown($event)"
        @dblclick="enableZoom && resetTransform"
    >
        <div
            class="mermaid-inner"
            :style="{ transform: enableZoom ? `translate(${tx}px, ${ty}px) scale(${scale})` : undefined }"
            v-html="svg"
        ></div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { render } from './mermaid';

const props = defineProps({
    graph: {
        type: String,
        required: true,
    },
    id: {
        type: String,
        required: true,
    },
    showCode: {
        type: Boolean,
        default: true,
    },
    enableZoom: {
        type: Boolean,
        default: false,
    },
});

const svg = ref('');
const code = ref(decodeURIComponent(props.graph));
const ctrlSymbol = ref(navigator.platform.includes('Mac') ? '⌘' : 'Ctrl');
const editableContent = ref(null);
const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
const contentEditable = ref(isFirefox ? 'true' : 'plaintext-only');

let mut = null;

const MIN_SCALE = 0.25;
const MAX_SCALE = 5;
const scale = ref(1);
const tx = ref(0);
const ty = ref(0);
const mermaidOuter = ref(null);

let dragging = false;
let dragStartX = 0;
let dragStartY = 0;
let dragStartTx = 0;
let dragStartTy = 0;

const updateCode = (event) => {
    code.value = event.target.innerText;
};

const clampScale = (v) => Math.max(MIN_SCALE, Math.min(MAX_SCALE, v));

const onWheel = (e) => {
    if (!props.enableZoom) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = clampScale(scale.value + delta);

    const rect = mermaidOuter.value.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    tx.value = cx - (cx - tx.value) * (newScale / scale.value);
    ty.value = cy - (cy - ty.value) * (newScale / scale.value);
    scale.value = newScale;
};

const onMouseDown = (e) => {
    if (e.button !== 0) return;
    dragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragStartTx = tx.value;
    dragStartTy = ty.value;
    e.preventDefault();
};

const onMouseMove = (e) => {
    if (!dragging) return;
    tx.value = dragStartTx + (e.clientX - dragStartX);
    ty.value = dragStartTy + (e.clientY - dragStartY);
};

const onMouseUp = () => {
    dragging = false;
};

const resetTransform = () => {
    scale.value = 1;
    tx.value = 0;
    ty.value = 0;
};

onMounted(async () => {
    mut = new MutationObserver(() => renderChart());
    mut.observe(document.documentElement, { attributes: true });

    if (editableContent.value) {
        editableContent.value.textContent = code.value;
    }

    await renderChart();

    const hasImages = /<img([\w\W]+?)>/.exec(code.value)?.length > 0;
    if (hasImages)
        setTimeout(() => {
            let imgElements = document.getElementsByTagName('img');
            let imgs = Array.from(imgElements);
            if (imgs.length) {
                Promise.all(
                    imgs
                        .filter((img) => !img.complete)
                        .map(
                            (img) =>
                                new Promise((resolve) => {
                                    img.onload = img.onerror = resolve;
                                })
                        )
                ).then(() => {
                    renderChart();
                });
            }
        }, 100);

    if (props.enableZoom) {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    }
});

onUnmounted(() => {
    mut.disconnect();
    if (props.enableZoom) {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    }
});

const renderChart = async () => {
    console.log('rendering chart' + props.id + code.value);
    const hasDarkClass = document.documentElement.classList.contains('dark');
    const mermaidConfig = {
        securityLevel: 'loose',
        startOnLoad: false,
        theme: hasDarkClass ? 'dark' : 'default',
    };
    let svgCode = await render(props.id, code.value, mermaidConfig);
    const salt = Math.random().toString(36).substring(7);
    svg.value = `${svgCode} <span style="display: none">${salt}</span>`;
};
</script>

<style scoped>
.mermaid-outer {
    position: relative;
    overflow: auto;
}

.mermaid-zoomable {
    overflow: hidden;
    cursor: grab;
    user-select: none;
}

.mermaid-zoomable:active {
    cursor: grabbing;
}

.mermaid-inner {
    display: inline-block;
    min-width: 100%;
}
</style>
