<script setup>
import mediumZoom from 'medium-zoom';
import { onContentUpdated } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { onBeforeUpdate, onMounted, onUpdated } from 'vue';
const { Layout } = DefaultTheme;

onContentUpdated(() => {
    mediumZoom('img')
})
</script>

<template>
    <Layout />
</template>

<style lang="css">
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