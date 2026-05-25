<script setup lang="ts">
import projects from '../project_meta.json';

const sorted = [...projects].sort((a, b) => a.name.localeCompare(b.name));
</script>

<template>
  <ul>
    <li v-for="p in sorted" :key="p.name">
      <template v-if="p.link">
        <a :href="p.link">{{ p.name }}</a>
      </template>
      <template v-else>{{ p.name }}</template>
      — <span v-html="p.descriptionHtml" />
    </li>
  </ul>
</template>
