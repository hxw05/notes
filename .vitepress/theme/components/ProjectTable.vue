<script setup lang="js">
import stats from '../project_stats.json'

const keys = Object.keys(stats[0])

const keyNames = {
    'name': 'Project',
    'noteCount': '笔记数',
    'imageCount': '图片数',
    'charCountChinese': '中文字数',
    'charCountTotal': '字词数',
    'lastUpdated': '最近更新于'
}
</script>

<template>
    <div style="overflow-x: auto;">
        <table style="display: table; width: 100%;">
            <thead>
                <tr>
                    <th v-for="k in keys">
                        {{ keyNames[k] }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="entry in stats">
                    <td v-for="k in keys">{{ entry[k] }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style lang="css" scoped>
th,
td {
    text-align: center;
}
</style>