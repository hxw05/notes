import DefaultTheme from "vitepress/theme-without-fonts";
// @ts-ignore
import './custom.css';
import type { Theme } from "vitepress";
import Layout from "./Layout.vue";
import mediumZoom from "medium-zoom";

export default {
    extends: DefaultTheme,
    enhanceApp(ctx) {
        
    },
    Layout: Layout
} satisfies Theme;