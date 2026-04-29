<script setup lang="ts">
import stats from '../overall_stats.json'
</script>

<template>
  <!-- <div class="overview-cards">
    <div class="oc-card">
      <div class="oc-label">总中文字数</div>
      <div class="oc-value">{{ (stats.charCountChinese / 1000).toFixed(1) }}K</div>
    </div>
    <div class="oc-card">
      <div class="oc-label">总笔记数</div>
      <div class="oc-value">{{ stats.noteCount }}</div>
    </div>
    <div class="oc-card oc-card-wide">
      <div class="oc-label">最近更新于</div>
      <div class="oc-value">{{ stats.lastUpdated }}</div>
    </div>
  </div> -->
  <ul>
    <li>总中文字数：{{ (stats.charCountChinese / 1000).toFixed(1) }}K（{{(stats.charCountChinese/10000).toFixed(2)}} 万）</li>
    <li>总笔记数：{{ stats.noteCount }} 篇</li>
    <li>最近一次更新：{{ stats.lastUpdated }}</li>
  </ul>
</template>

<style scoped>
.overview-cards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 16px;
  margin: 24px 0;
}

.oc-card {
  border: 1px solid var(--vp-c-divider, #e2e2e3);
  padding: 16px;
}

.oc-card-wide {
  grid-column: span 2;
}

.oc-label {
  font-size: 13px;
  color: var(--vp-c-text-2, #666);
  margin-bottom: 12px;
  line-height: 1;
}

.oc-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-text-1, #1a1a1a);
  font-variant-numeric: tabular-nums;
}
</style>
