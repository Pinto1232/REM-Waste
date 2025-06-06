import { z } from 'zod';

export const SkipSchema = z.object({
  id: z.number(),
  size: z.number(),
  // Legacy properties from old API (required by existing API)
  transport_cost: z.number().nullable().optional(),
  per_tonne_cost: z.number().nullable().optional(),
  price_before_vat: z.number(),
  vat: z.number(),
  postcode: z.string(),
  area: z.string(),
  forbidden: z.boolean(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  allowed_on_road: z.boolean(),
  allows_heavy_waste: z.boolean(),
  hire_period_days: z.number(),
  // Optional new properties
  name: z.string().optional(),
  description: z.string().optional(),
  dimensions: z.object({
    length: z.number(),
    width: z.number(),
    height: z.number(),
  }).optional(),
  weight_limit: z.number().optional(),
  suitable_for: z.array(z.string()).optional(),
  image_url: z.string().url().optional(),
  availability: z.object({
    available: z.boolean(),
    next_available_date: z.string().optional(),
  }).optional(),
}).transform((data) => ({
  ...data,
  // Generate name from size if not provided by API
  name: data.name || `${data.size} Yard Skip`,
}));

export const SkipSearchParamsSchema = z.object({
  postcode: z.string().min(3, 'Postcode must be at least 3 characters'),
  area: z.string().optional(),
  // Additional search parameters
  waste_type: z.string().optional(),
  min_size: z.number().optional(),
  max_size: z.number().optional(),
});

export const SkipListResponseSchema = z.array(SkipSchema);

export type Skip = z.infer<typeof SkipSchema>;
export type SkipSearchParams = z.infer<typeof SkipSearchParamsSchema>;