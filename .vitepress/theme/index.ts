import DefaultTheme from "vitepress/theme-without-fonts";
// @ts-ignore
import './custom.css';
import type { Theme } from "vitepress";
import Layout from "./Layout.vue";
import OverviewCards from "./components/OverviewCards.vue";
import ProjectTable from "./components/ProjectTable.vue";
import ProjectList from "./components/ProjectList.vue";
import Mermaid from "./components/Mermaid.vue";

export default {
    extends: DefaultTheme,
    enhanceApp(ctx) {
        ctx.app.component('OverviewCards', OverviewCards);
        ctx.app.component('ProjectTable', ProjectTable)
        ctx.app.component('ProjectList', ProjectList)
        ctx.app.component('Mermaid', Mermaid);
    },
    Layout: Layout
} satisfies Theme;