export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message: string;
  errors: string[];
}

export class ApiError extends Error {
  status: number;
  errors: string[];

  constructor(message: string, status: number, errors: string[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

  // Read token from localStorage (Zustand auth store persists there)
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    try {
      const authStorage = localStorage.getItem('zennote-auth-storage');
      if (authStorage) {
        const parsed = JSON.parse(authStorage);
        token = parsed.state?.token || null;
      }
    } catch (e) {
      console.error('Failed to parse auth token from localStorage', e);
    }
  }

  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);

    // Handle HTTP 401 Unauthorized
    if (response.status === 401) {
      if (typeof window !== 'undefined') {
        // Clear auth and redirect to login if unauthorized
        localStorage.removeItem('zennote-auth-storage');
        window.location.href = '/login';
      }
      throw new ApiError('Session expired. Please log in again.', 401);
    }

    let json: { data?: unknown; success?: boolean; message?: string; errors?: string[] };
    const text = await response.text();
    try {
      json = text ? JSON.parse(text) : {};
    } catch {
      throw new ApiError('Invalid JSON response from server', response.status);
    }

    if (!response.ok) {
      // Respect custom validation errors if thrown by ExceptionHandlingMiddleware
      const errorMessage = json.message || `Request failed with status ${response.status}`;
      const errors = json.errors || [];
      throw new ApiError(errorMessage, response.status, errors);
    }

    // Standard Response Wrapper
    return {
      data: (json.data !== undefined ? json.data : json) as T,
      success: json.success !== undefined ? json.success : true,
      message: json.message || 'Operation successful',
      errors: json.errors || [],
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'An unexpected network error occurred',
      500
    );
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(endpoint: string, body?: unknown, options?: RequestInit) =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(endpoint: string, options?: RequestInit) =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),
};
