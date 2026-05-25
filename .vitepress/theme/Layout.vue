<script setup>
import mediumZoom from 'medium-zoom';
import { onContentUpdated, useData } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { onMounted, ref } from 'vue';
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
</script>

<template>
    <Layout>
        <template #nav-bar-content-after>
            <button class="font-toggle-btn" @click="toggleFont" :title="isSerif ? '切换到无衬线字体' : '切换到衬线字体'">
                {{ isSerif ? 'Serif' : 'Sans' }}
            </button>
        </template>
        <template #doc-before>
            <div class="doc-before">
                <div v-if="frontmatter.date" class="vp-doc-date">
                    发布于 {{ frontmatter.date }}
                </div> ·
                <a target="_blank" :href="frontmatter.origin.link" v-if="frontmatter.origin?.link">
                    查看原文
                </a>
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
    gap: 4px;
    color: var(--vp-c-text-2);
}

.doc-before a {
    text-decoration: underline;
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