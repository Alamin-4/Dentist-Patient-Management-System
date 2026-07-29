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
  if (
    error &&
    typeof error === "object" &&
    "success" in error &&
    (error as any).success === false &&
    "message" in error
  ) {
    return error as AppError;
  }

  // Check if error contains 413 or too large in message or string representation
  const errorMsg = error instanceof Error ? error.message : String(error);
  if (
    errorMsg.includes("413") ||
    errorMsg.toLowerCase().includes("too large") ||
    errorMsg.toLowerCase().includes("large entity")
  ) {
    return {
      success: false,
      message: "File is too large. Please select a smaller file (under 5MB).",
      statusCode: 413,
    };
  }

  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as AxiosError<any>;
    const responseData = axiosError.response?.data;
    const status = axiosError.response?.status;

    if (status === 413) {
      return {
        success: false,
        message: "File is too large. Please select a smaller file (under 5MB).",
        statusCode: 413,
      };
    }

    return {
      success: false,
      message: responseData?.message || "An unexpected server error occurred.",
      statusCode: status || 500,
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
