import { z } from 'zod';

export const artaxContext = z.object({
  depth: z.number().default(1),
  navigation: z
    .array(z.object({ searchParams: z.any(), url: z.any() }))
    .default([]),
  payloads: z.array(z.string()).default([]),
  selectors: z.array(z.string()).default([]),
  uri: z.string().url(),
});

export type ArtaxContext = z.infer<typeof artaxContext>;
