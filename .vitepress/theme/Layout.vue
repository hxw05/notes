<script setup>
import mediumZoom from 'medium-zoom';
import { onContentUpdated, useData } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { computed, onMounted, ref } from 'vue';
const { Layout } = DefaultTheme;

let zoom;

onContentUpdated(() => {
    if (zoom) {
        zoom.detach();
        zoom.attach('img');
    } else {
        zoom = mediumZoom('img');
    }
});

const { frontmatter } = useData()

const isSerif = ref(false)

function toggleFont() {
    isSerif.value = !isSerif.value
    document.documentElement.classList.toggle('font-serif', isSerif.value)
    try { localStorage.setItem('font-serif', isSerif.value ? '1' : '0') } catch { }
}

onMounted(() => {
    const saved = localStorage.getItem('font-serif') === '1'
    isSerif.value = saved
    document.documentElement.classList.toggle('font-serif', saved)
})

const prefixText = computed(() => {
    let res = [`本文发布于 ${frontmatter.value.date}`];
    if (frontmatter.value.origin) {
        if (frontmatter.value.origin.date) {
            res.push(`原文发布于 ${frontmatter.value.origin.date}`)
        }
        if (frontmatter.value.origin.author) {
            res.push(`原作者 ${frontmatter.value.origin.author}`)
        }
        if (frontmatter.value.origin.link) {
            res.push(`<a href="${frontmatter.value.origin.link}" target="_blank">查看原文</a>`)
        }
    }
    return res.join('，');
})
</script>

<template>
    <Layout>
        <template #nav-bar-content-after>
            <button class="font-toggle-btn" @click="toggleFont" :title="isSerif ? '切换到无衬线字体' : '切换到衬线字体'">
                {{ isSerif ? 'Serif' : 'Sans' }}
            </button>
        </template>
        <template #doc-before>
            <div class="doc-before" v-if="frontmatter">
                <p v-html="prefixText"></p>
            </div>
            <!-- <h3 v-if="frontmatter.origin?.title" class="vp-doc-pre-title">
                {{ frontmatter.origin.title }}
            </h3> -->
        </template>
    </Layout>
</template>

<style lang="css">
.doc-before {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    color: var(--vp-c-text-2);
}

.doc-before a {
    text-decoration: underline;
}

.doc-before>*:not(:last-child)::after {
    content: '·';
    margin: 0 8px;
}

.medium-zoom-overlay {
    z-index: 30;
}

.medium-zoom-overlay {
    background: rgba(255, 255, 255, .8) !important;
}

.dark .medium-zoom-overlay {
    background: rgba(0, 0, 0, .9) !important;
}

.medium-zoom-image--opened {
    z-index: 31;
}

.font-toggle-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
    height: 24px;
    margin-left: 16px;
    border: 1px solid var(--vp-c-divider);
    border-radius: 14px;
    background: transparent;
    color: var(--vp-c-text-2);
    font-size: 12px;
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 0.2s, color 0.2s;
}

.font-toggle-btn:hover {
    opacity: 1;
    color: var(--vp-c-text-1);
}
</style>