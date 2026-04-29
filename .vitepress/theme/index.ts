import DefaultTheme from "vitepress/theme-without-fonts";
// @ts-ignore
import './custom.css';
import type { Theme } from "vitepress";
import Layout from "./Layout.vue";
import OverviewCards from "./components/OverviewCards.vue";
import ProjectTable from "./components/ProjectTable.vue";

export default {
    extends: DefaultTheme,
    enhanceApp(ctx) {
        ctx.app.component('OverviewCards', OverviewCards);
        ctx.app.component('ProjectTable', ProjectTable)
    },
    Layout: Layout
} satisfies Theme;