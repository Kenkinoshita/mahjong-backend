// import { z } from 'zod';

// export const getStatsRequestSchema = z.object({
//   userId: z.string().uuid().optional(),
//   from: z.string().datetime().optional(),
//   to: z.string().datetime().optional(),
//   limit: z.preprocess((val) => (val ? Number(val) : undefined), z.number().int().positive().optional()),
// });

// export type GetStatsRequest = z.infer<typeof getStatsRequestSchema>;

// zodを使うように修正
export const getStatsRequestSchema = {};
