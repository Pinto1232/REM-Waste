export interface ApiError {
  message: string;
  code: string;
  status: number | undefined;
  details: unknown | undefined;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ApiException extends Error {
  public readonly code: string;
  public readonly status: number | undefined;
  public readonly details: unknown | undefined;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiException';
    this.code = error.code;
    this.status = error.status;
    this.details = error.details;
  }
}