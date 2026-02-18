// @ts-check
import { defineConfig } from 'astro/config';
import { rehypeTablesScroll } from "./src/lib/rehypeTablesScroll";
import { rehypeObsidianCallouts } from "./src/lib/rehypeObsidianCallouts"
import rehypeSlug from "rehype-slug";
import rehypeSanitize from "rehype-sanitize";

//import starlight from '@astrojs/starlight';
//import starlightThemeRapide from 'starlight-theme-rapide'

// https://astro.build/config
import path from "path";

export default defineConfig({
    vite: {
        resolve: {
            alias: {
                "@layouts": path.resolve("./src/layouts"),
                "@components": path.resolve("./src/components"),
                "@assets": path.resolve("./src/assets"),
                "@lib": path.resolve("./src/lib"),
                "@scripts": path.resolve("./src/scripts"),
                "@config": path.resolve("./src/config"),
                "@content": path.resolve("./src/content"),
            }
        }

    },
    markdown: {
        rehypePlugins: [
            rehypeSlug,
            rehypeSanitize, // strips <script>, on* handlers, unsafe HTML
        ],
    },

    content: {
        collections: {}
    },

    server: {
        port: 3030,
        host: true, // Exposes dev server to your local network
    },
});