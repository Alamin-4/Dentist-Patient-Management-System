import { AxiosError } from "axios";

export interface BackendErrorSource {
  field: string;
  message: string;
}

export interface AppError {
  success: false;
  message: string;
  statusCode: number;
  errors?: BackendErrorSource[];
  errorDetails?: unknown;
  stack?: string;
}

export function normalizeApiError(error: unknown): AppError {
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<any>;
    const responseData = axiosError.response?.data;

    return {
      success: false,
      message: responseData?.message || "An unexpected server error occurred.",
      statusCode: axiosError.response?.status || 500,
      errors: Array.isArray(responseData?.errors) ? responseData.errors : undefined,
      errorDetails: responseData?.errorDetails || undefined,
      stack: responseData?.stack || undefined,
    };
  }

  return {
    success: false,
    message: error instanceof Error ? error.message : "An unknown error occurred.",
    statusCode: 500,
  };
}
