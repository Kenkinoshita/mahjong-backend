import type { ZodSchema } from 'zod';
import type { ValidationTargets } from 'hono';
import { zValidator } from '@hono/zod-validator';

export const requestValidator = <T extends ZodSchema, Target extends keyof ValidationTargets>(
  target: Target,
  schema: T,
) =>
  zValidator(target, schema, (result) => {
    if (!result.success) throw result.error as Error;
  });
