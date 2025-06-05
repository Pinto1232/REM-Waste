export class ApiError extends Error {
  public statusCode: number;
  public code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 500, 'UNKNOWN_ERROR');
  }

  return new ApiError('An unknown error occurred', 500, 'UNKNOWN_ERROR');
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
