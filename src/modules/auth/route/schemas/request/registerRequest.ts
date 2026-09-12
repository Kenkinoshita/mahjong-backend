import { z } from 'zod';

export const registerRequestSchema = z.object({
  name: z.string().trim().min(1),
  email: z.email(),
  password: z.string().min(8),
});

export type RegisterRequestBody = z.infer<typeof registerRequestSchema>;
