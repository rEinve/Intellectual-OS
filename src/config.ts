import { defineCollection } from 'astro:content';
//import { docsLoader } from '@astrojs/starlight/loaders';
//import { docsSchema } from '@astrojs/starlight/schema';

//export const collections = {
	//docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
//};


const irrigations = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    published: z.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([])
  })
});

featured: z.boolean().default(false),
series: z.string().optional(),


export const collections = {
    notes
};