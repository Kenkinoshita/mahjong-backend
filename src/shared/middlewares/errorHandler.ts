import type { Context } from 'hono';
import { ApiError, statusByCode } from '@/shared/errors/apiError';

type ErrorResponseBody = {
  error: {
    code: string;
    message: string;
  };
};

export function errorHandler(err: Error, c: Context) {
  const apiError = err instanceof ApiError ? err : new ApiError('INTERNAL', { message: 'Internal Server Error' });

  // 運用時に原因追跡できるように最低限ログ
  // eslint-disable-next-line no-console
  if (!(err instanceof ApiError)) console.error(err);

  const body: ErrorResponseBody = {
    error: {
      code: apiError.code,
      message: apiError.message,
    },
  };

  return c.json(body, statusByCode[apiError.code]);
}
