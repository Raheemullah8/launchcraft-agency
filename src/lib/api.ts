import axios, { AxiosError } from "axios";

/**
 * Centralized Axios instance for LaunchCraft application.
 * Preconfigured with default JSON headers, /api baseURL, and error normalization.
 */
export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
});

// Response interceptor for consistent error extraction
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: string; message?: string }>) => {
    const customMessage =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "An unexpected network or server error occurred.";

    // Augment error with the human-friendly message
    error.message = customMessage;
    return Promise.reject(error);
  }
);

/**
 * Utility helper to safely extract API error message from any caught error.
 */
export function getApiErrorMessage(error: unknown, fallbackMessage = "Operation failed."): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.error || error.response?.data?.message || error.message || fallbackMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallbackMessage;
}

export default api;

