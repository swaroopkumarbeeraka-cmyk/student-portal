/**
 * API Fetch Client with Environment Flagging and Auth Token Injection
 */

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const isMockEnabled = (): boolean => {
  // If VITE_USE_MOCK is explicitly 'false', mock mode is disabled.
  // Otherwise, default to true for standalone execution.
  return import.meta.env.VITE_USE_MOCK !== 'false';
};

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Generic fetch wrapper for backend communication.
 * Automatically injects Bearer token if present in session storage.
 */
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const token = localStorage.getItem('aits_auth_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      let errorData: any = null;
      try {
        errorData = await response.json();
      } catch {
        // response was not JSON
      }
      throw new ApiError(
        errorData?.message || `Request failed with status ${response.status}`,
        response.status,
        errorData
      );
    }

    // For 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network communication error',
      0
    );
  }
}
