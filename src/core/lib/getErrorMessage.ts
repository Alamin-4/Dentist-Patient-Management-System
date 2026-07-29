export function mapApiErrorToUserMessage(
  err: unknown,
  fallback = "An unexpected error occurred. Please try again."
): string {
  if (!err) return fallback;
  if (typeof err === "string") return err;

  const e = err as Record<string, any>;

  // 1. Network / Connection errors
  if (e.code === "ERR_NETWORK" || (!e.response && e.message === "Network Error")) {
    return "Connection error. Please check your internet connection and try again.";
  }

  const status = e.response?.status || e.statusCode || e.status;
  const data = e.response?.data || e.data;
  const errorsList = data?.errors || e.errors;

  // 2. Structured API field error array from backend (if present)
  if (Array.isArray(errorsList) && errorsList.length > 0) {
    const firstErr = errorsList[0];
    if (firstErr?.message && typeof firstErr.message === "string") {
      return firstErr.message;
    }
  }

  // 3. Extract direct message if present and user-friendly
  const directMessage = data?.message || e.message;
  if (
    directMessage &&
    typeof directMessage === "string" &&
    !directMessage.includes("TypeError:") &&
    !directMessage.includes("Cannot set properties") &&
    !directMessage.includes("undefined") &&
    !directMessage.includes("null") &&
    !directMessage.includes("SQL") &&
    !directMessage.includes("PrismaClient") &&
    !directMessage.includes("Error:")
  ) {
    return directMessage;
  }

  // 4. Status code fallbacks
  switch (status) {
    case 400:
      return "Invalid request details. Please check your input and try again.";
    case 401:
      return "Your session has expired. Please sign in again.";
    case 403:
      return "You do not have permission to perform this action.";
    case 404:
      return "The requested information could not be found.";
    case 409:
      return "A record with these details already exists.";
    case 422:
      return "Validation failed. Please verify your input.";
    case 429:
      return "Too many requests. Please wait a moment and try again.";
    default:
      if (typeof status === "number" && status >= 500) {
        return "We are experiencing technical difficulty. Please try again in a moment.";
      }
  }

  return fallback;
}

export function getErrorMessage(
  err: unknown,
  fallback = "Something went wrong"
): string {
  return mapApiErrorToUserMessage(err, fallback);
}
