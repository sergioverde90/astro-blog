// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkToc from "remark-toc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import remarkCollapse from "remark-collapse";

// https://astro.build/config
export default defineConfig({
	site: 'https://blog.ssvv.dev',
	integrations: [mdx(), sitemap()],
	redirects : {
		'/' : '/blog/1'
	},
	markdown: {
		remarkPlugins: [ remarkMath, remarkToc, [remarkCollapse,
			{
			  test: "Table of Contents",
			}]],
		rehypePlugins: [ rehypeKatex, rehypeHeadingIds],
		shikiConfig: {
		  themes: { light: "material-theme", dark: "night-owl" },
		  wrap: true,
		},
	  },
});
