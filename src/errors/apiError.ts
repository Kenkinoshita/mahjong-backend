export type ApiErrorOptions = {
  message?: string;
};

export const statusByCode = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL: 500,
} as const;

type ApiErrorCode = keyof typeof statusByCode;

export class ApiError extends Error {
  readonly code: ApiErrorCode;

  constructor(code: ApiErrorCode, options: ApiErrorOptions = {}) {
    // ErrorOptions.cause を使える環境（Node 24）では super に渡す
    super(options.message ?? code);
    this.name = 'ApiError';
    this.code = code;
  }

  static badRequest(message?: string) {
    return new ApiError('BAD_REQUEST', { message });
  }

  static unauthorized(message?: string) {
    return new ApiError('UNAUTHORIZED', { message });
  }

  static forbidden(message?: string) {
    return new ApiError('FORBIDDEN', { message });
  }

  static notFound(message?: string) {
    return new ApiError('NOT_FOUND', { message });
  }

  static conflict(message?: string) {
    return new ApiError('CONFLICT', { message });
  }
}
