// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { rehypeHeadingIds } from '@astrojs/markdown-remark';
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

// https://astro.build/config
export default defineConfig({
	site: 'https://blog.ssvv.dev',
	integrations: [mdx(), sitemap()],
	markdown: {
		remarkPlugins: [ remarkMath],
		rehypePlugins: [ 
			rehypeKatex, 
			rehypeHeadingIds,
			[
				rehypeAutolinkHeadings, {
					behavior: 'prepend',
					content: {
					  type: 'text',
					  value: '# ',
					},
					headingProperties: {
					  className: ['anchor'],
					},
					properties: {
					  className: ['anchor-link'],
					}
				}
			]
		],
		shikiConfig: {
		  themes: { light: "material-theme", dark: "night-owl" },
		  wrap: true,
		},
	  },
});
