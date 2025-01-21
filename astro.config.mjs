// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkToc from "remark-toc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [mdx(), sitemap()],
	markdown: {
		remarkPlugins: [
		  remarkMath,
		  remarkToc
		],
		rehypePlugins: [rehypeKatex],
		shikiConfig: {
		  // For more themes, visit https://shiki.style/themes
		  themes: { light: "material-theme", dark: "night-owl" },
		  wrap: true,
		},
	  },
});
