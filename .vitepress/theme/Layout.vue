<script setup>
import mediumZoom from 'medium-zoom';
import { onContentUpdated, useData } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { onBeforeUpdate, onMounted, onUpdated } from 'vue';
const { Layout } = DefaultTheme;

onContentUpdated(() => {
    mediumZoom('img')
});

const { frontmatter } = useData()
</script>

<template>
    <Layout>
        <template #doc-before>
            <div class="vp-doc-before">
                <div v-if="frontmatter.date" class="vp-doc-date">
                    发布于 {{ frontmatter.date }}
                </div>
            </div>
        </template>
    </Layout>
</template>

<style lang="css">
.vp-doc-before {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 5px;
}

.vp-doc-date {
    color: var(--vp-c-text-2);
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
</style>