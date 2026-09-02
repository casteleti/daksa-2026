import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Content Collections — fonte: 07-SEO-GEO-CONTEUDO-CMS.md §6.
 * Um item de exemplo por collection (dados fictícios, marcados como exemplo) só para
 * validar os schemas nesta fase — conteúdo real é Fase 3–4 (09 §1).
 */

const seoSchema = z.object({
  title: z.string().max(60),
  description: z.string().min(140).max(155),
});

const services = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/services' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      shortName: z.string(),
      lead: z.string(), // 3 frases (07 §6)
      duration: z.string(),
      deliverables: z.array(z.string()).min(1),
      requirements: z.array(z.string()).default([]),
      faq: z.array(reference('faqs')).default([]),
      order: z.number().int(),
      next: reference('services').optional(),
      prev: reference('services').optional(),
      seo: seoSchema,
      ogImage: image().optional(),
    }),
});

const segments = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/segments' }),
  schema: z.object({
    name: z.string(),
    lead: z.string(),
    flowSteps: z.array(z.string()).default([]),
    signals: z.array(z.string()).min(1),
    agentMapping: z
      .array(z.object({ agent: reference('agents'), context: z.string() }))
      .default([]),
    glossary: z.array(z.object({ term: z.string(), definition: z.string() })).default([]),
    faq: z.array(reference('faqs')).default([]),
    services: z.array(reference('services')).default([]),
    seo: seoSchema,
  }),
});

const agents = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/agents' }),
  schema: z.object({
    name: z.string(),
    does: z.string(),
    kpi: z.array(z.string()).min(1),
    permissions: z.array(z.string()).min(1),
    escalatesWhen: z.array(z.string()).min(1),
    logExample: z.array(z.string()).min(1),
  }),
});

const metrics = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/metrics' }),
  schema: z.object({
    name: z.string(),
    phase: z.enum(['before', 'during', 'after']),
    definition: z.string(),
    unit: z.string(),
    howMeasured: z.string(),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/authors' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      bio: z.string().max(400),
      photo: image().optional(),
      linkedin: z.string().url().optional(),
      sameAs: z.array(z.string().url()).default([]),
    }),
});

const insights = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/insights' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().max(160),
      lead: z.string(), // 3 frases
      author: reference('authors'),
      tags: z.array(z.string()).min(1),
      datePublished: z.coerce.date(),
      dateModified: z.coerce.date().optional(),
      // readingTime é calculado em build (lib/format.ts estimateReadingTime), não editorial.
      related: z.array(z.union([reference('services'), reference('segments')])).default([]),
      seo: seoSchema,
      ogImage: image().optional(),
      draft: z.boolean().default(false),
    }),
});

const cases = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    segment: reference('segments'),
    companySize: z.string(),
    anonymized: z.boolean().default(true),
    clientName: z.string().optional(),
    baseline: z.array(z.object({ metric: reference('metrics'), value: z.string() })).min(1),
    actions: z.array(z.string()).default([]),
    results: z
      .array(z.object({ metric: reference('metrics'), before: z.string(), after: z.string() }))
      .min(1),
    quote: z
      .object({
        text: z.string(),
        name: z.string(),
        role: z.string(),
        // guardrail D6/01 §6.4: nunca publicar sem autorização explícita registrada.
        authorized: z.literal(true),
      })
      .optional(),
    datePublished: z.coerce.date(),
    seo: seoSchema,
    // D6: rota fica noindex/fora do menu enquanto não houver published:true.
    published: z.boolean().default(false),
  }),
});

const faqs = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/faqs' }),
  schema: z.object({
    question: z.string(),
    answer: z.string().max(600),
    pages: z.array(z.string()).default([]),
  }),
});

const timeline = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/timeline' }),
  schema: z.object({
    year: z.number().int(),
    title: z.string(),
    text: z.string(),
  }),
});

const principles = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/principles' }),
  schema: z.object({
    order: z.number().int(),
    title: z.string(),
    text: z.string(),
  }),
});

const techPages = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/techPages' }),
  schema: z.object({
    title: z.string(),
    lead: z.string(),
    faq: z.array(reference('faqs')).default([]),
    seo: seoSchema,
  }),
});

const legal = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    lastReviewed: z.coerce.date(),
  }),
});

export const collections = {
  services,
  segments,
  agents,
  metrics,
  authors,
  insights,
  cases,
  faqs,
  timeline,
  principles,
  techPages,
  legal,
};
